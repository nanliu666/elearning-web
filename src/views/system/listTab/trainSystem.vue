<template>
  <div class="fill">
    <common-table
      ref="table"
      :columns="tableColumns"
      :config="tableConfig"
      :page="page"
      :data="tableData"
      :loading="tableLoading"
      @current-page-change="handleCurrentPageChange"
      @page-size-change="handlePageSizeChange"
    >
      <template #topMenu>
        <div class="search-box">
          <div style="margin-right:20px;">
            <span class="upload-date">上传时间</span>
            <el-date-picker
              v-model="queryInfo.uploadTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择"
              @change="dateChange"
            >
            </el-date-picker>
          </div>
          <search-popover
            ref="searchPopover"
            :require-options="searchConfig.requireOptions"
            :popover-options="searchConfig.popoverOptions"
            @submit="handleSearch"
          />
          <common-upload
            ref="uploadFile"
            class="upload-more"
            need-handler
            multiple
            :limit="20"
            :check-upload="checkUpload"
            :on-upload-complete="onUploadComplete"
            :before-upload="CoursewareUpload"
            @on-masterFileMax="handleExceed"
          >
            <el-button
              v-if="activeIndex == 0"
              v-p="UPLOAD_TRAIN"
              size="medium"
              type="primary"
            >
              {{ tabList[activeIndex].btnText }}
            </el-button>

            <el-button
              v-if="activeIndex == 1"
              v-p="UPLOAD_FORM"
              size="medium"
              type="primary"
            >
              {{ tabList[activeIndex].btnText }}
            </el-button>
          </common-upload>
        </div>
      </template>

      <template #fileName="{ row }">
        <div
          class="ellipsis title"
          @click="jumpDetail(row)"
        >
          {{ row.fileName }}
        </div>
      </template>

      <template
        slot="multiSelectMenu"
        slot-scope="{ selection }"
      >
        <el-button
          type="text"
          icon="el-icon-bottom"
          @click="downloadSelected(selection)"
        >
          批量下载
        </el-button>

        <el-button
          style="margin-left:20px;"
          type="text"
          icon="el-icon-delete"
          @click="deleteSelected(selection)"
        >
          批量删除
        </el-button>
      </template>

      <template #status="{ row }">
        {{ row.status > 0 ? '已置顶' : '未置顶' }}
      </template>

      <template #handler="{ row }">
        <div class="menuClass">
          <el-button
            type="text"
            @click="handleStatus(row)"
          >
            {{ row.status > 0 ? '取消置顶' : '置顶' }}
          </el-button>
          <el-button
            type="text"
            @click="handleAuth(row, 'download')"
          >
            下载
          </el-button>
          <el-button
            v-p="LIST_DELETE"
            type="text"
            @click="handleAuth(row, 'delete')"
          >
            删除
          </el-button>
        </div>
      </template>
    </common-table>
  </div>
</template>

<script>
import { getArrayList, delList, toTopData, uploadDoc } from '@/api/system/systemList'
import SearchPopover from '@/components/searchPopOver/index'
import { downLoadFile, getReviewUrl } from '@/util/util'
import styles from '@/styles/variables.scss'
import commonUpload from '@/components/common-upload/commonUpload'
import { UPLOAD_FORM, UPLOAD_TRAIN, LIST_DELETE } from '@/const/privileges'
let timeout = null
const TABLE_COLUMNS = [
  {
    label: '序号',
    type: 'index',
    width: 80
  },
  {
    label: '制度名称',
    prop: 'fileName',
    slot: true
  },
  {
    label: '上传时间',
    prop: 'uploadTime'
  },
  {
    label: '上传人员',
    prop: 'uploadName'
  },
  {
    label: '状态',
    prop: 'status',
    slot: true
  }
]

const TABLE_CONFIG = {
  showHandler: true, //是否显示操作列
  defaultExpandAll: false, //是否默认展开所有行
  showIndexColumn: false, //是否显示序号列
  enablePagination: true,
  enableMultiSelect: true,
  handlerColumn: {
    //操作列配置
    width: 170,
    fixed: false
  }
}
export default {
  name: 'TrainSystem',
  components: { SearchPopover, commonUpload },
  props: {
    activeIndex: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      tableLoading: false,
      tableColumns: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      queryInfo: {
        type: '1', //1-培训制度 2-业务表单
        uploadTime: '',
        name: ''
      },
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      activeColor: styles.primaryColor,
      tableData: [],
      searchConfig: {
        requireOptions: [
          {
            type: 'input',
            field: 'name',
            label: '',
            config: { placeholder: '', 'suffix-icon': 'el-icon-search' }
          }
        ],
        popoverOptions: []
      },
      searchParams: {
        name: ''
      },
      tabList: [
        { name: '培训制度', searchPlace: '培训制度名称/上传人员', btnText: '上传培训制度' },
        { name: '业务表单', searchPlace: '业务表单名称/上传人', btnText: '上传业务表单' }
      ]
    }
  },
  computed: {
    UPLOAD_FORM: () => UPLOAD_FORM,
    UPLOAD_TRAIN: () => UPLOAD_TRAIN,
    LIST_DELETE: () => LIST_DELETE
  },

  mounted() {
    this.queryInfo.type = Number(this.activeIndex) + 1 + ''
    this.setConfig(this.activeIndex)
    this.loadTableData()
  },
  methods: {
    checkUpload() {
      // if (this.uploadingQueue.length >= 2) {
      //   if (!this.pendingQueue.includes(file)) {
      //     this.pendingQueue.push(file)
      //   }
      //   return true
      // } else {
      //   this.uploadingQueue.push(file)
      // }
      // return false
    },
    onUploadComplete(file, url) {
      this.$refs.uploadFile.$refs.upload.clearFiles()
      const param = {
        type: this.queryInfo.type,
        file: {}
      }
      param.file[file.file.name] = url
      uploadDoc(param).then(() => {
        if (timeout !== null) clearTimeout(timeout)
        timeout = setTimeout(() => {
          this.$message.success('上传成功')
          this.loadTableData()
        }, 600)
      })
    },
    handleExceed() {
      this.$message.error('一次性最多上传20个文件')
      return
    },
    // 上传校验
    CoursewareUpload(file) {
      if (this.isFileSize(file)) return false
      const regx = /^.*\.(doc|docx|wps|rtf|xls|xlsx|ppt|pptx|pdf|jpg|bmp|jpeg|png)$/
      const regxImg = /^.*\.(jpg|jpeg|png|bmp)$/
      const regxtxt = /.*\.(txt)$/
      const isLt10M = file.size / 1024 / 1024 <= 10.2
      const isLtImg = file.size / 1024 / 1024 <= 5.2
      setTimeout(() => {
        if (regxtxt.test(file.name.toLowerCase())) {
          this.$message.error('不支持上传txt类型!')
          return
        }
        if (!isLt10M) {
          this.$message.error('上传文件大小不超过10M!')
          return
        }
        if (!regx.test(file.name.toLowerCase())) {
          this.$message.error('上传资料仅支持上传文档、Excel、pdf、图片四种类型')
          return
        }
        if (regxImg.test(file.name.toLowerCase())) {
          if (!isLtImg) {
            this.$message.error('上传图片大小不能超过 5MB!')
            return
          }
        }
      })
      if (
        regxtxt.test(file.name.toLowerCase()) ||
        !isLt10M ||
        !regx.test(file.name.toLowerCase()) ||
        (regxImg.test(file.name.toLowerCase()) && !isLtImg)
      ) {
        return false
      }
      return true
    },
    // 是否空文件
    isFileSize(file) {
      if (file.size === 0) {
        this.$message({
          message: '请不要上传空文件哦！',
          type: 'warning'
        })
        return true
      }
    },

    //处理页码改变
    handleCurrentPageChange(param) {
      this.$set(this.page, 'currentPage', param)
      this.loadTableData()
    },
    //处理页码大小更改
    handlePageSizeChange(param) {
      this.$set(this.page, 'size', param)
      this.loadTableData(true)
    },
    // 设置配置
    setConfig(key) {
      const statusIndex = _.findIndex(TABLE_COLUMNS, (item) => item.prop == 'fileName')
      TABLE_COLUMNS[statusIndex].label = ['制度名称', '表单名称'][key]
      this.$set(
        this.searchConfig.requireOptions[0].config,
        'placeholder',
        this.tabList[key].searchPlace
      )
    },
    //选择时间搜索
    dateChange() {
      this.loadTableData(true)
    },
    //文件预览
    async jumpDetail(row) {
      let url = row.fileUrl
      let onlineViewType = ['doc', 'docx', 'xls', 'xlsx', 'xlsm', 'ppt', 'pptx']
      let allZip = ['zip', 'rar']
      let fileTypeName = url.substring(url.lastIndexOf('.') + 1, url.length).split('?')[0]
      if (allZip.includes(fileTypeName.toLowerCase())) {
        this.$message.error('此文件类型无法预览，推荐下载之后打开')
        return
      }
      let isWord = onlineViewType.find((type) => type === fileTypeName.toLowerCase())
      if (isWord) {
        // url = 'http://view.officeapps.live.com/op/view.aspx?src=' + url
        let { data } = await getReviewUrl({
          convertType: 0, //0 execl 14 pdf 20 PDF
          fileUrl: url
        })
        url = data.data.viewUrl
      }
      window.open(url, '_blank')
    },
    // 搜索
    handleSearch(params) {
      _.assign(this.searchParams, params)
      this.$set(this.queryInfo, 'name', params.name)
      this.loadTableData(true)
    },
    // 删除下载操作
    handleAuth(row, key) {
      if (key == 'download') {
        if (row.fileUrl.indexOf('http') < 0 && row.fileUrl.indexOf('https') < 0) {
          this.$message.error('文件地址错误')
          return
        }
        downLoadFile(row)
      } else if (key == 'delete') {
        const content =
          this.queryInfo.type == '1' ? '您确定要删除该制度吗？' : '您确定要删除该表单吗？'
        this.$confirm(content, '提醒', {
          type: 'warning'
        })
          .then(() => {
            this.deleteFun(row.id)
          })
          .catch(() => {})
      }
    },

    // 具体的删除函数
    deleteFun(ids) {
      delList({ ids }).then(() => {
        this.loadTableData(true)
        this.$message.success('删除成功')
        this.$refs.table.clearSelection()
      })
    },
    // 批量删除
    deleteSelected(selection) {
      if (!selection.length) return
      const content = '你确定删除？'
      this.$confirm(content, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const ids = selection.map((val) => val.id).join(',')
          this.deleteFun(ids)
        })
        .catch(() => {})
    },
    // 批量下载
    downloadSelected(selection) {
      selection.forEach((row) => {
        downLoadFile(row)
      })
    },
    //置顶或取消置顶
    handleStatus(row) {
      const param = {
        id: row.id,
        action: row.status > 0 ? '0' : '1',
        type: this.queryInfo.type
      }
      toTopData(param).then(() => {
        this.$message.success(row.status > 0 ? '取消置顶成功' : '置顶成功')
        this.loadTableData(true)
      })
    },

    // 加载函数
    async loadTableData(isLoad) {
      if (this.tableLoading) {
        return
      }
      try {
        if (isLoad) {
          //是否重置分页
          this.$set(this.page, 'currentPage', 1)
        }
        this.tableLoading = true
        const param = {
          pageNo: this.page.currentPage,
          pageSize: this.page.size,
          ...this.queryInfo
        }
        let { totalNum, data } = await getArrayList(param)
        this.tableLoading = false
        this.tableData = data
        this.page.total = totalNum
      } catch (error) {
        this.tableLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.cell:empty::before {
  content: '--';
  color: gray;
}
.title {
  color: #01aafc;
  cursor: pointer;
}
.search-box {
  display: flex;
  align-items: center;
  .upload-date {
    margin-right: 16px;
  }
  /deep/.require-form .el-form-item {
    padding: 0;
    margin: 0;
  }
  .upload-more {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
