<template>
  <div style="height:100%">
    <page-header title="模板管理">
      <el-button
        slot="rightMenu"
        size="medium"
        type="primary"
        @click="onHandleEdit('add')"
      >
        添加
      </el-button>
    </page-header>
    <basic-container block>
      <common-table
        ref="table"
        :columns="columns"
        :config="tableConfig"
        :page="page"
        :data="tableData"
        :loading="loading"
        @current-page-change="pageChange"
        @page-size-change="sizeChange"
      >
        <template #topMenu>
          <div class="flex flex-flow flex-justify-between flex-items">
            <el-input
              v-model="templateName"
              size="medium"
              placeholder="模板名称"
              clearable
              style="width: 200px; margin-right: 12px"
              @input="searchGroup"
            />
            <div class="refresh-container">
              <span
                class="icon el-icon-refresh-right"
                @click="reload"
              />
              <span class="refresh-text">刷新</span>
            </div>
          </div>
        </template>
        <template #code="{ row }">
          {{ row.code | codeToName }}
        </template>
        <template
          slot="multiSelectMenu"
          slot-scope="{ selection }"
        >
          <el-button
            type="text"
            icon="el-icon-delete"
            @click="handleDel(selection)"
          >
            批量删除
          </el-button>
        </template>

        <template
          slot="handler"
          slot-scope="scope"
        >
          <el-button
            type="text"
            size="medium"
            @click.stop="onHandleEdit('edit', scope.row)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            size="medium"
            @click.stop="handleDel(scope.row, scope.index)"
          >
            删除
          </el-button>
        </template>
      </common-table>
    </basic-container>

    <el-dialog
      :close-on-click-modal="false"
      append-to-body
      :title="setTitle"
      :visible="visible"
      width="600px"
      :modal-append-to-body="false"
      @close="handleClose"
    >
      <el-form
        ref="ruleForm"
        :model="formData"
        :rules="rules"
        label-width="100px"
        label-position="top"
        class="newOrgDailog"
      >
        <el-form-item
          label="模板名称"
          prop="title"
        >
          <el-input
            v-model.trim="formData.title"
            maxlength="32"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item
          label="模板类型"
          prop="code"
        >
          <el-select v-model="formData.code" :disabled="this.groupRow.id?true:false" placeholder="请选择模板类型">
            <el-option
              v-for="item in templateCode"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item
          label="模板描述"
          prop="remark"
        >
          <el-input
            v-model.trim="formData.remark"
            type="textarea"
            maxlength="200"
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item
          label="模板文件"
          prop="file"
        >
           <common-upload
                v-model="formData.file"
                multiple
                :before-upload="beforeUpload"
                :limit="1"
                :disabled="formData.file.length >= 1 ? true : false"
                @on-masterFileMax="attachmentLimitCallback"
                class="uploadfile"
              >
                <template>
                  <div style="text-align:left">
                    <el-button
                      size="medium"
                      icon="el-icon-upload"
                    >
                      点击上传
                    </el-button>
                    <div class="upload__tip">
                      单个文件大小＜5MB，最多1个文件
                    </div>
                  </div>
                  <div>
                    <ul class="upload__files">
                      <li
                        v-for="(item, index) in formData.file"
                        :key="index"
                      >
                        <div class="files__left">
                          <span class="ellipsis files__name">{{ item.localName }}</span>
                          <i
                          class="el-icon-close"
                          @click.stop="handleRemoveAttachment(index)"
                        ></i>
                        </div>
                        
                      </li>
                    </ul>
                  </div>
                </template>
              </common-upload>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="medium"
          @click="handleClose"
        >取消</el-button>
        <el-button
          type="primary"
          size="medium"
          @click="submit"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { templateAdd,templateUpdate,templateList,getTemplate,delTemplate } from '@/api/system/template'
import {templateCode} from './templateCodeConfig'
import CommonUpload from '@/components/common-upload/commonUpload'


const TABLE_CONFIG = {
  showHandler: true, //是否显示操作列
  showIndexColumn: false, //是否显示序号列
  rowKey: 'id',
  enableMultiSelect: true,
  handlerColumn: {
    //操作列配置
    width: 100,
    fixed: false
  }
}
const COLUMNS = [
  {
    label: '模板名称',
    prop: 'title'
  },
  {
    label: '模板类型',
    prop: 'code',
    slot:true
  },
  {
    label: '模板描述',
    prop: 'remark'
  },
  {
    label: '模板链接',
    prop: 'fileUrl'
  },
]

export default {
  name: 'templateManage',
  components: {CommonUpload},
  data() {
    return {
      visible: false,
      loading: false,
      groupRow: {},
      btnKey: 'edit',
      tableData: [],
      templateName: '',
      formData: {
        title: '',
        code: '',
        remark: '',
        file:[]
      },
      templateCode,
      rules: {
        title: [{ required: true, message: '请输入模板名称', trigger: 'change' }],
        code: [{ required: true, message: '请选择模板类型', trigger: 'change' }],
        file: [{ required: true, message: '请上传模板文件', trigger: 'change' }]
      },
      page: {
        size: 10,
        currentPage: 1,
        total: 0
      },
      columns: COLUMNS,
      tableConfig: TABLE_CONFIG
    }
  },
  filters:{
    codeToName(val){
      return _.filter(templateCode,{value:val})[0].label
    }
  },
  computed: {
    setTitle(){
      return this.groupRow.id?'编辑模板':'添加模板'
    }
  },
  activated() {
    this.loadData()
  },
  methods: {
    handleRemoveAttachment(index) {
      this.formData.file.splice(index, 1)
    },
    //限制附件上传数量callback
    attachmentLimitCallback() {
      this.$message({
        type: 'info',
        message: '最多上传1个附件'
      })
    },
    beforeUpload(file) {
      const isExcel = /\.(xlsx|xls)$/
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isExcel.test(file.name)) {
        this.$message.error('只能上传xlsx|xls格式文件!')
        return !isExcel
      }
      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 5MB!')
      }
      return isLt5M
    },
    sizeChange(val) {
      this.page.size = val
      this.page.currentPage = 1
      this.loadData()
    },
    pageChange(val) {
      this.page.currentPage = val
      this.loadData()
    },
    //搜索
    searchGroup() {
      this.reload()
    },
    // 删除
    handleDel(rows) {
      this.$confirm('你确定删除当前模板吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const ids = rows.length > 0 ? rows.map((row) => row.id) : rows.id
          delTemplate(ids).then(() => {
            this.$message.success('删除成功')
            this.reload()
          })
        })
        .catch(() => {})
    },
    // 加载list
    loadData() {
      const params = {
        pageNo: this.page.currentPage,
        pageSize: this.page.size,
        title: this.templateName || ''
      }
      this.loading = true
      templateList(params).then((res) => {
        this.tableData = res.data
        this.page.total = res.totalNum
        this.loading = false
      })
    },
    // 刷新数据
    reload() {
      this.$set(this.page, 'currentPage', 1)
      this.loadData()
    },
    //编辑模板
    onHandleEdit(key, row) {
      if (key == 'edit') {
        this.$set(this, 'formData', {
          title: row.title,
          code: row.code,
          remark: row.remark,
          file: [{
            localName:row.fileName,
            fileUrl:row.fileUrl,
            size:row.fileSize
          }]
        })
      }
      this.groupRow = row || {}
      this.btnKey = key
      this.visible = true
    },
    //关闭弹出层
    handleClose() {
      this.$set(this, 'formData', { title: '',type: '',remark: '',file:[]})
      this.$refs.ruleForm.clearValidate()
      this.visible = false
      this.groupRow = {}
    },

    //编辑和添加
    submit() {
      let self = this
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const params = {
              title: self.formData.title,
              remark: self.formData.remark,
              code: self.formData.code,
              fileUrl:self.formData.file[0].fileUrl,
              fileName:self.formData.file[0].localName,
              fileSize:self.formData.file[0].size
          }
          let fun = this.btnKey === 'add' ? templateAdd : templateUpdate
          if(this.btnKey !== 'add' ){
            delete params.code
            params.id = self.groupRow.id
          }
          fun(params).then(res=>{
              this.$message.success(`${this.btnKey === 'add'?'新增':'修改'}成功`)
              this.reload()
              this.handleClose()
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-container--block {
  height: calc(100% - 92px);
  min-height: calc(100% - 92px);
  .title {
    color: $primaryColor;
    cursor: pointer;
  }
  .el-menu {
    margin-bottom: 20px;
    margin-top: -10px;
  }
  /deep/ .el-menu--horizontal {
    border-bottom: 1px solid #cccccc !important;
  }
}
.originColumn {
  height: 25px;
}
.transitionBox {
  position: relative;
  height: 50px;
}

.searchBox {
  // position: absolute;
  // width: 100%;
  i {
    color: #a0a8ae;
    font-size: 18px;
  }
  .search-sort-box {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 10px;
    cursor: pointer;
    .sort-text {
      color: #a0a8ae;
      margin-left: 6px;
      font-size: 14px;
    }
    &::before {
      position: absolute;
      content: '';
      top: 3px;
      right: 0px;
      width: 0.5px;
      height: 80%;
      background-color: #a0a8ae;
    }
  }
  .table-search {
    display: flex;
    align-items: center;
    .search-list {
      flex: 1;
    }
  }
}
.refresh-text {
  padding-left: 6px;
  display: inline-block;
  height: 18px;
  color: #a0a8ae;
}
.icon {
  font-size: 18px;
  color: #a0a8ae;
  cursor: pointer;
}
.uploadfile{
  .upload__files{
    width: 500px;
    text-align: left;
    .el-icon-close{
      margin-left: 20px;
    }
  }
}
.search-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .upload-date {
    margin-right: 16px;
  }
  /deep/.require-form .el-form-item {
    padding: 0;
    margin: 0;
  }
}
</style>
