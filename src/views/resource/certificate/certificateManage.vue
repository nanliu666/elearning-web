<template>
  <div class="Menu fill">
    <page-header title="证书模板管理">
      <template slot="rightMenu">
        <el-button
          v-p="ADD_CERTIFICATE"
          type="primary"
          size="medium"
          @click="toAddCertificate"
        >
          创建证书模板
        </el-button>
      </template>
    </page-header>
    <basic-container block>
      <common-table
        ref="table"
        :columns="columnsVisible | columnsFilter"
        :config="tableConfig"
        :data="tableData"
        :loading="tableLoading"
        :page-config="tablePageConfig"
        :page="page"
        @current-page-change="handleCurrentPageChange"
        @page-size-change="handlePageSizeChange"
      >
        <template #topMenu>
          <div class="operations">
            <SearchPopover
              ref="searchPopover"
              :popover-options="searchPopoverConfig.popoverOptions"
              :require-options="searchPopoverConfig.requireOptions"
              @submit="handleSearch"
            />
            <div class="operations-right">
              <div
                class="refresh-container"
                @click="loadTableData"
              >
                <i class="el-icon-refresh-right" />
                <span>刷新</span>
              </div>
              <el-popover
                placement="bottom"
                width="40"
                trigger="click"
              >
                <i
                  slot="reference"
                  style="cursor: pointer"
                  class="el-icon-setting"
                />
                <!-- 设置表格列可见性 -->
                <div class="operations__column--visible">
                  <el-checkbox-group v-model="columnsVisible">
                    <el-checkbox
                      v-for="item of tableColumns"
                      :key="item.prop"
                      :label="item.prop"
                      class="operations__column--item"
                      :disabled="item.label == '编号' || item.label == '模板名称'"
                    >
                      {{ item.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </el-popover>
            </div>
          </div>
        </template>

        <template
          slot="multiSelectMenu"
          slot-scope="{ selection }"
        >
          <el-button
            v-p="DELETE_CERTIFICATE"
            type="text"
            size="medium"
            icon="el-icon-delete"
            @click="multipleDeleteClick(selection)"
          >
            批量删除
          </el-button>
        </template>

        <!-- 状态 -->
        <template #status="{ row }">
          {{ row.status === 0 ? '停用' : row.status === 1 ? '正常' : '已失效' }}
        </template>

        <template #handler="{ row }">
          <el-button
            v-if="row.status"
            v-p="STOP_CERTIFICATE"
            :disabled="row.status === 3"
            type="text"
            @click.stop="blockStart(row.id, true)"
          >
            停用
          </el-button>
          <el-button
            v-else
            v-p="STOP_CERTIFICATE"
            :disabled="row.status === 3"
            type="text"
            @click.stop="blockStart(row.id)"
          >
            启用
          </el-button>
          <el-button
            v-p="EDIT_CERTIFICATE"
            type="text"
            @click.stop="edit(row.id)"
          >
            编辑
          </el-button>
          <el-dropdown>
            <i class="el-icon-arrow-down el-icon-more" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button
                  type="text"
                  @click.stop="previewMouseOver(row.id)"
                >
                  预览
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-p="DELETE_CERTIFICATE"
                  type="text"
                  @click="handleRemove(row)"
                >
                  删除
                </el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- 预览框 -->
          <el-dialog
            title="预览"
            :visible="previewDialog"
            :modal="false"
            width="600px"
            @close="previewDialog = false"
          >
            <CertificateTemplate
              class="preview"
              :certificate-data="preview"
            />
          </el-dialog>
        </template>
      </common-table>
    </basic-container>
  </div>
</template>

<script>
import { pinyin } from 'pinyin-pro'
import SearchPopover from '@/components/searchPopOver/index'
import {
  getCertificateList,
  getSingleCertificate,
  updateStatus,
  delTemplate
} from '@/api/certificate/certificate'
import CertificateTemplate from './components/CertificateTemplate.vue'
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '证书名称',
    width: 180,
    prop: 'name'
  },
  {
    label: '状态',
    slot: true,
    prop: 'status',
    minWidth: 100
  },
  {
    label: '生效日期',
    prop: 'activeTime',
    formatter: (row) => row.activeTime.split(' ')[0],
    minWidth: 100
  },
  {
    label: '有效日期',
    formatter: (row) => {
      if (row.bornTime && row.deadTime)
        return `${row.bornTime.split(' ')[0]} ~ ${row.deadTime.split(' ')[0]}`
      else return '--'
    },
    minWidth: 200
  },
  {
    label: '证书类型',
    prop: 'category',
    minWidth: 100
  },
  {
    label: '文案',
    prop: 'text',
    width: 300
  },
  {
    label: '颁发机构',
    prop: 'awardAgency',
    minWidth: 100
  },

  {
    label: '创建人',
    prop: 'creatorName',
    minWidth: 100
  },
  {
    label: '更新日期',
    prop: 'updateTime',
    minWidth: 100
  }
]
const TABLE_CONFIG = {
  enablePagination: true,
  showHandler: true,
  enableMultiSelect: true,
  rowKey: 'id',
  treeProps: { hasChildren: 'hasChildren', children: 'children' },
  handlerColumn: {
    fixed: 'right',
    minWidth: 130,
    center: true
  }
}
const TABLE_PAGE_CONFIG = {}

// 搜索配置
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    config: { placeholder: '输入证书名称搜索', 'suffix-icon': 'el-icon-search' },
    data: '',
    field: 'name',
    label: '',
    type: 'input'
  }
]
let SEARCH_POPOVER_POPOVER_OPTIONS = [
  {
    type: 'select',
    field: 'status',
    label: '状态',
    data: '',
    options: [
      { value: '0', label: '停用' },
      { value: '1', label: '正常' },
      { value: '3', label: '已失效' }
    ]
  },
  {
    type: 'input',
    field: 'agency',
    label: '颁发机构',
    data: '',
    config: { maxlength: 10 }
  },
  {
    type: 'select',
    field: 'category',
    label: '证书类型',
    data: '',
    options: [
      { value: '0', label: '培训合格证书' },
      { value: '1', label: '聘书' }
    ]
  }
]
let SEARCH_POPOVER_CONFIG = {
  popoverOptions: SEARCH_POPOVER_POPOVER_OPTIONS,
  requireOptions: SEARCH_POPOVER_REQUIRE_OPTIONS
}
const FORM_COLUMNS = [
  {
    label: '移动到新目录',
    itemType: 'treeSelect',
    prop: 'catalogId',
    required: true,
    span: 24,
    props: {
      selectParams: {
        placeholder: '请选择所在目录',
        multiple: false
      },
      treeParams: {
        'check-strictly': true,
        'default-expand-all': false,
        'expand-on-click-node': false,
        clickParent: true,
        data: [],
        filterable: false,
        props: {
          children: 'children',
          label: 'name',
          value: 'id'
        },
        required: true
      }
    }
  }
]
import {
  ADD_CERTIFICATE,
  STOP_CERTIFICATE,
  PREVIEW_CERTIFICATE,
  DELETE_CERTIFICATE,
  EDIT_CERTIFICATE
} from '@/const/privileges'
import { mapGetters } from 'vuex'
export default {
  name: 'KnowledgeManagement',
  components: {
    SearchPopover,
    CertificateTemplate
  },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      previewDialog: false,
      preview: {},
      moveKnowledgeRow: {},

      formColumns: FORM_COLUMNS,
      formData: {
        catalogId: ''
      },
      dialogTableVisible: false,
      // 默认选中所有列
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      // 请求参数
      queryInfo: {
        pageNo: 1,
        pageSize: 10,
        status: '',
        name: '',
        agency: ''
      },
      searchPopoverConfig: SEARCH_POPOVER_CONFIG,
      tableColumns: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tableLoading: false,
      tablePageConfig: TABLE_PAGE_CONFIG
    }
  },
  computed: {
    ADD_CERTIFICATE: () => ADD_CERTIFICATE,
    STOP_CERTIFICATE: () => STOP_CERTIFICATE,
    PREVIEW_CERTIFICATE: () => PREVIEW_CERTIFICATE,
    DELETE_CERTIFICATE: () => DELETE_CERTIFICATE,
    EDIT_CERTIFICATE: () => EDIT_CERTIFICATE,
    ...mapGetters(['privileges'])
  },
  watch: {
    // 鉴权注释：当前用户无所有的操作权限，操作列表关闭
    privileges: {
      handler() {
        this.tableConfig.showHandler = this.$p([
          ADD_CERTIFICATE,
          STOP_CERTIFICATE,
          PREVIEW_CERTIFICATE,
          DELETE_CERTIFICATE,
          EDIT_CERTIFICATE
        ])
      },
      deep: true
    }
  },
  activated() {
    // this.initSearchData()
    this.refreshTableData()
  },
  methods: {
    // 编辑证书
    edit(id) {
      this.$router.push({
        path: '/resource/certificate/editCertificate',
        query: {
          id
        }
      })
    },
    // 去新建证书
    toAddCertificate() {
      this.$router.push({ path: '/resource/certificate/addCertificate' })
    },
    // 批量删除
    multipleDeleteClick(selectArr) {
      let currentArr = selectArr.filter((item) => {
        return item.status === 0
      })
      let deactivate = selectArr.length - currentArr.length
      let selectedIds = []
      _.each(currentArr, (item) => {
        selectedIds.push(item.id)
      })
      // 提示
      this.$confirm('您确定要删除选中的证书模版吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          if (selectedIds.length === 0) {
            this.$message.warning('所选证书模版处于启用状态，请停用后删除')
            this.$refs.table.clearSelection()
            this.refreshTableData()
            return
          }
          await delTemplate({ templateIds: selectedIds.join(',') })
          if (deactivate === 0) {
            this.$message.success('删除成功')
          } else {
            this.$message.success(
              `已删除${selectedIds.length}条证书模版，另外${deactivate}条证书模板处于启用状态，请停用后删除`
            )
          }
          this.$refs.table.clearSelection()
          this.refreshTableData()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 删除
    handleRemove(row) {
      let info = `${
        row.status ? '该证书模版处于启用状态，请停用后删除。' : '您确定要删除选中的证书模版吗？'
      }`
      let params = row.status
        ? {
            confirmButtonText: '我知道了',
            showCancelButton: false,
            type: 'warning'
          }
        : {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
      // 提示
      this.$confirm(info, '提示', params)
        .then(() => {
          if (!row.status) {
            delTemplate({ templateIds: row.id }).then(() => {
              this.$message.success('删除成功')
              this.loadTableData()
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 停用&启用
    blockStart(id, i) {
      if (i) {
        let info = '您确定要停用该证书模版吗？停用后，该证书模版将暂停使用。'
        this.$confirm(info, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            updateStatus({ templateId: id, choice: 0 }).then(() => {
              this.$message.success('停用成功')
              this.loadTableData()
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
      } else {
        updateStatus({ templateId: id, choice: 1 }).then(() => {
          this.$message.success('启用成功')
          this.loadTableData()
        })
      }
    },
    //   预览Btn
    previewMouseOver(id) {
      getSingleCertificate({ templateId: id }).then((res) => {
        let currentstr = pinyin(res.awardAgency, { pattern: 'initial', type: 'array' })
          .splice(0, 2)
          .join('')
          .toUpperCase()
        this.previewDialog = true
        this.preview = res
        this.preview.certificateNo = (currentstr ? currentstr : 'YB') + '-20201130-0001'
      })
    },

    /**
     * 处理页码改变
     */
    handleCurrentPageChange(param) {
      this.queryInfo.pageNo = param
      this.loadTableData()
    },
    /**
     * 处理页码大小更改
     */
    handlePageSizeChange(param) {
      this.queryInfo.pageSize = param
      this.loadTableData()
    },
    /**
     * 搜索
     */
    handleSearch(searchParams) {
      for (let i in searchParams) {
        this.queryInfo[i] = searchParams[i]
      }
      this.queryInfo.pageNo = 1
      this.loadTableData()
    },
    // 跳去详情
    jumpDetail({ id }) {
      this.$router.push({
        path: '/repository/knowledgeDetail',
        query: { id }
      })
    },
    // 刷新列表数据
    refreshTableData() {
      //  因为只加载了最外层的数据，children仍然是旧的，清空数据
      this.tableData = []
      this.loadTableData()
    },
    // 加载表格数据
    async loadTableData() {
      if (this.tableLoading) return
      this.tableLoading = true
      try {
        let { totalNum, data } = await getCertificateList(this.queryInfo)
        this.tableData = data
        this.page.total = totalNum
      } catch (error) {
        // window.console.log(error)
      } finally {
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
::v-deep .el-dropdown {
  padding-left: 5px;
  color: #a1a7ae;
}
::v-deep .el-dialog {
  margin: 0 auto;
  .el-dialog__body {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    height: 500px;
  }
}
.top-button {
  width: 40px;
}
.operations-right {
  i {
    margin-left: 12px;
    font-size: 18px;
    color: #a0a8ae;
    cursor: pointer;
  }
  display: flex;
  align-items: center;
  .refresh-container {
    position: relative;
    display: flex;
    align-items: center;
    color: #a0a8ae;
    padding: 0 10px;
    cursor: pointer;
    span {
      padding-left: 6px;
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
}
.preview {
  transform: scale(0.67);
}
</style>
<style lang="sass" scoped>
$color_icon: #A0A8AE
.status-span
  padding: 4px
  border-radius: 2px
.basic-container--block
  height: calc(100% - 92px)
  min-height: calc(100% - 92px)
.title
  color: $primaryColor
  cursor: pointer
.operations
  align-items: center
  display: flex
  justify-content: space-between
  &__column--item
    height: 25px
  &__column--visible
    height: 200px
    overflow: scroll
  &__btns
    align-items: center
    display: flex
    height: 24px
    justify-content: flex-start
  &__btns--item
    margin: 0
    margin-right: 4px
    padding: 0
    height: 24px
    width: 24px
    line-height: 24px
    &:last-child
      margin: 0
    // margin-bottom: 8px
    // margin-right: 8px
  .iconfont
    color: $color_icon
    font-weight: bold
    font-size: 16px

.Menu
  // 添加一个分隔号 "｜"
  .table__handler
    display: flex
    justify-content: flex-end
    > .el-button--text
      text-align: center
      padding: 0 8px
      margin-left: 0px
      position: relative
      &:not(:last-child)::after
        background-color: #e3e7e9
        content: ''
        height: 10px
        position: absolute
        right: 0
        top: 50%
        transform: translateY(-50%)
        width: 1px
</style>
