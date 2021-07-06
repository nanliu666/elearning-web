<template>
  <div class="Menu fill">
    <page-header title="知识管理">
      <template slot="rightMenu">
        <el-button
          v-p="ADD_REP"
          type="primary"
          size="medium"
          @click="createResource"
        >
          创建资源
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
                  style="cursor: pointer;"
                  class="el-icon-setting"
                />
                <!-- 设置表格列可见性 -->
                <div class="operations__column--visible">
                  <el-checkbox-group v-model="columnsVisible">
                    <el-checkbox
                      v-for="item of tableColumns"
                      :key="item.prop"
                      :disabled="item.prop === 'resName'"
                      :label="item.prop"
                      class="operations__column--item"
                    >
                      {{ item.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </el-popover>
            </div>
          </div>
        </template>
        <template #approveStatus="{row}">
          {{
            row.approveStatus === 0
              ? '审批中'
              : row.approveStatus === 1
                ? row.status === '0'
                  ? '已发布'
                  : '已停用'
                : row.approveStatus === 2
                  ? '已拒绝'
                  : '已撤销'
          }}
        </template>

        <template #uploadType="{row}">
          {{ row.uploadType === 0 ? '本地文件' : '链接文件' }}
        </template>

        <template #type="{row}">
          {{ row.type === 1 ? '视频' : row.type === 2 ? '文档' : '资料下载' }}
        </template>
        <template #knowledgeSystemId="{row}">
          {{
            row.knowledgeSystemId === '0'
              ? '大数据'
              : row.knowledgeSystemId === '1'
                ? '沟通技巧'
                : '--'
          }}
        </template>
        <template
          slot="multiSelectMenu"
          slot-scope="{ selection }"
        >
          <el-button
            v-p="DELETE_REP"
            type="text"
            size="medium"
            icon="el-icon-delete"
            @click="multipleDeleteClick(selection)"
          >
            批量删除
          </el-button>
        </template>
        <template
          slot="resName"
          slot-scope="{ row }"
        >
          <div
            v-if="VIEW_REP"
            class="ellipsis title"
            @click="jumpDetail(row)"
          >
            {{ row.resName }}
          </div>
          <div v-else>
            {{ row.resName }}
          </div>
        </template>
        <template #handler="{row}">
          <div class="handle__button">
            <el-button
              v-if="row.approveStatus === 1"
              v-p="PUTAWAY_REP"
              type="text"
              class="top__button"
              :disabled="disabled(0, row.approveStatus)"
              @click="handleStatus(row)"
            >
              {{ row.status == 0 ? '停用' : '发布' }}
            </el-button>
            <el-button
              v-else
              v-p="TOP_REP"
              type="text"
              class="top__button"
              :disabled="disabled(0, row.approveStatus)"
            >
              停用
            </el-button>
            <el-button
              v-p="EDIT_REP"
              type="text"
              :disabled="disabled(1, row.approveStatus)"
              @click="editFun(row)"
            >
              编辑
            </el-button>
            <el-button
              v-p="DELETE_REP"
              type="text"
              :disabled="disabled(3, row.approveStatus)"
              @click="delFun(row)"
            >
              删除
            </el-button>
          </div>
        </template>
      </common-table>
    </basic-container>

    <el-dialog
      title="移动目录"
      :visible.sync="dialogTableVisible"
      append-to-body
      width="500px"
    >
      <div style="margin-bottom: 15px">
        所在目录：{{ moveKnowledgeRow.catalogName }}
      </div>
      <common-form
        ref="form"
        :columns="formColumns"
        :model="formData"
      >
      </common-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogTableVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="saveMove"
        >
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getKnowledgeManageList,
  deleteKnowledgeList,
  topingKnowledge,
  updateStatusKnowledgeList,
  getKnowledgeCatalogList,
  // getKnowledgeManageTaglist,
  moveKnowledge
} from '@/api/knowledge/knowledge'
import SearchPopover from '@/components/searchPopOver/index'
// const approveStatus = ['审核中', '审批通过', '已拒绝', '已撤回']
// 表格属性
const TABLE_COLUMNS = [
  { type: 'index', label: '序号' },
  {
    label: '知识名称',
    width: 200,
    slot: true,
    prop: 'resName'
  },
  {
    label: '状态',
    slot: true,
    prop: 'approveStatus'
  },
  {
    label: '所在分类',
    prop: 'catalogName',
    width: 150
  },
  {
    label: '上传模式',
    slot: true,
    prop: 'uploadType',
    width: 100
  },
  {
    label: '知识类型',
    slot: true,
    prop: 'type',
    width: 100
  },
  {
    label: '提供人',
    slot: true,
    prop: 'providerName',
    width: 150
  },
  {
    label: '提供人部门',
    slot: true,
    prop: 'providerOrgName',
    width: 150
  },
  {
    label: '提供人岗位',
    slot: true,
    prop: 'providerPosition',
    width: 150
  },
  {
    label: '知识体系',
    slot: true,
    prop: 'knowledgeSystemId',
    width: 150
  },
  {
    label: '创建人',
    slot: true,
    prop: 'creatorName',
    width: 100
  },
  {
    label: '更新时间',
    slot: true,
    prop: 'updateTime',
    width: 150
  }
]
const TABLE_CONFIG = {
  enablePagination: true,
  showHandler: true,
  enableMultiSelect: true,
  showIndexColumn: false,
  rowKey: 'id',
  treeProps: { hasChildren: 'hasChildren', children: 'children' },
  handlerColumn: {
    label: '操作',
    width: 150,
    fixed: 'right'
  },
  highlightSelect: true
}
const TABLE_PAGE_CONFIG = {}

// 搜索配置
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    config: { placeholder: '输入知识名称搜索', 'suffix-icon': 'el-icon-search' },
    data: '',
    field: 'resName',
    label: '',
    type: 'input'
  }
]
let SEARCH_POPOVER_POPOVER_OPTIONS = [
  {
    type: 'select',
    field: 'approveStatus',
    label: '状态',
    data: '',
    options: [
      { value: '', label: '全部' },
      { value: 0, label: '审批中' },
      { value: '1-0', label: '已发布' }, //需要传两个状态，做拆分
      { value: '1-1', label: '已停用' },
      { value: 2, label: '已拒绝' },
      { value: 3, label: '已撤销' }
    ]
  },
  {
    type: 'treeSelect',
    field: 'catalogId',
    label: '所在分类',
    data: '',
    config: {
      selectParams: {
        placeholder: '请输入内容',
        multiple: false
      },
      treeParams: {
        data: [],
        'check-strictly': true,
        'default-expand-all': false,
        'expand-on-click-node': false,
        clickParent: true,
        filterable: false,
        props: {
          children: 'children',
          label: 'name',
          disabled: 'disabled',
          value: 'id'
        }
      }
    }
  },
  {
    type: 'select',
    field: 'uploadType',
    label: '上传模式',
    data: '',
    options: [
      { value: '', label: '全部' },
      { value: 0, label: '本地文件' },
      { value: 1, label: '链接文件' }
    ]
  },

  {
    type: 'treeSelect',
    field: 'orgId',
    label: '部门',
    data: '',
    config: {
      selectParams: {
        placeholder: '请输入内容',
        multiple: false
      },
      treeParams: {
        data: [],
        'check-strictly': true,
        'default-expand-all': false,
        'expand-on-click-node': false,
        clickParent: true,
        filterable: false,
        props: {
          children: 'children',
          label: 'orgName',
          disabled: 'disabled',
          value: 'id'
        }
      }
    }
  },

  {
    type: 'select',
    field: 'knowledgeSystemId',
    label: '知识体系',
    data: '',
    options: [
      { value: '', label: '全部' },
      { value: 0, label: '大数据' },
      { value: 1, label: '沟通技巧' }
    ]
  },
  {
    type: 'select',
    field: 'type',
    label: '知识类型',
    data: '',
    options: [
      { value: '', label: '全部' },
      { value: 1, label: '视频' },
      { value: 2, label: '文档' },
      { value: 3, label: '资料下载' }
    ]
  }
  // {
  //   type: 'select',
  //   field: 'tagId',
  //   label: '标签',
  //   data: '',
  //   options: [],
  //   config: { optionLabel: 'name', optionValue: 'id' }
  // }
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
  ADD_REP,
  TOP_REP,
  PUTAWAY_REP,
  EDIT_REP,
  DELETE_REP,
  MOVE_REP,
  VIEW_REP
} from '@/const/privileges'
import { mapGetters } from 'vuex'
import { getOrgTreeSimple } from '@/api/org/org'
export default {
  name: 'KnowledgeManagement',
  components: {
    SearchPopover
  },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      treeOptions: [],
      moveKnowledgeRow: {},
      formColumns: FORM_COLUMNS,
      formData: {
        catalogId: ''
      },
      dialogTableVisible: false,

      // 默认选中所有列
      // columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop).filter((v) => {
      //   return v != 'creatorName' && v != 'updateTime'
      // }),

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
        resName: '',
        catalogId: '',
        uploadType: '',
        // tagId: '',
        status: ''
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
    ADD_REP: () => ADD_REP,
    TOP_REP: () => TOP_REP,
    PUTAWAY_REP: () => PUTAWAY_REP,
    EDIT_REP: () => EDIT_REP,
    DELETE_REP: () => DELETE_REP,
    VIEW_REP: () => VIEW_REP,
    MOVE_REP: () => MOVE_REP,
    ...mapGetters(['privileges']),
    disabled() {
      return (type, status) => {
        let boolean = false

        switch (+status) {
          case 0:
            boolean = true
            break
          case 1:
            boolean = false
            break
          case 2:
            if (type == 3) {
              boolean = false
            } else {
              boolean = true
            }

            break
          case 3:
            if (type == 3) {
              boolean = false
            } else {
              boolean = true
            }

            break
          case 4:
            boolean = false
            break
          case 5:
            boolean = false
            break
        }
        return boolean
      }
    }
  },
  watch: {
    // 鉴权注释：当前用户无所有的操作权限，操作列表关闭
    privileges: {
      handler() {
        this.tableConfig.showHandler = this.$p([
          TOP_REP,
          PUTAWAY_REP,
          EDIT_REP,
          MOVE_REP,
          DELETE_REP
        ])
      },
      deep: true
    }
  },
  activated() {
    this.initSearchData()
    this.refreshTableData()
    this.getOrgTree()
  },
  methods: {
    //获取树
    getOrgTree() {
      getOrgTreeSimple({ parentOrgId: 0 }).then((res) => {
        this.treeOptions = res
        let orgId = _.find(this.searchPopoverConfig.popoverOptions, { field: 'orgId' })
        orgId.config.treeParams.data = res
      })
    },

    selectorChange(id) {
      this.query.orgId = id
      this.loadTableData()
    },
    getCategoryList() {
      return getKnowledgeCatalogList().then((res) => {
        return _.concat(
          [
            {
              id: '',
              name: '全部'
            }
          ],
          res
        )
      })
    },
    async initSearchData() {
      let catalogId = _.find(this.searchPopoverConfig.popoverOptions, { field: 'catalogId' })
      let moveCatalogId = _.find(this.formColumns, { prop: 'catalogId' })
      // let tagId = _.find(this.searchPopoverConfig.popoverOptions, { field: 'tagId' })
      // if (tagId) {
      //   getKnowledgeManageTaglist().then(
      //     (res) =>
      //       (tagId.options = _.concat(
      //         [
      //           {
      //             id: '',
      //             name: '全部'
      //           }
      //         ],
      //         res
      //       ))
      //   )
      // }
      let catalogList = await this.getCategoryList()
      if (catalogId) {
        catalogId.config.treeParams.data = catalogList
      }
      if (moveCatalogId) {
        moveCatalogId.props.treeParams.data = _.drop(catalogList)
      }
    },
    async multipleDeleteClick(selected) {
      this.$confirm('是否批量删除所选资源', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let selectedIds = []
        _.each(selected, (item) => {
          selectedIds.push(item.id)
        })
        await deleteKnowledgeList({ id: selectedIds.join(',') })
        this.$message.success('删除成功')
        this.$refs.table.clearSelection()
        this.loadTableData()
      })
    },
    // 置顶与取消置顶
    handleTop(rowData) {
      topingKnowledge({ id: rowData.id, isTop: rowData.topTime ? 0 : 1 }).then(() => {
        this.$message.success(`${rowData.topTime ? '取消' : ''}置顶成功`)
        this.loadTableData()
      })
    },
    // 上架与下架
    handleStatus(rowData) {
      const statusTips = rowData.status === '1' ? '发布' : '停用'
      this.$confirm(`是否${statusTips}当前资源`, '提示', {
        confirmButtonText: statusTips,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        updateStatusKnowledgeList({ id: rowData.id, status: rowData.status === '0' ? 1 : 0 }).then(
          () => {
            this.$message.success(`${statusTips}成功`)
            this.loadTableData()
          }
        )
      })
    },
    // 多种操作
    async handleCommand($event, row) {
      const TYPE_COMMAND = {
        deleteKnow: this.delFun,
        editKnow: this.editFun,
        moveKnow: this.moveFun
      }
      TYPE_COMMAND[$event](row)
    },
    // 编辑
    editFun(row) {
      this.createResource(row.id)
    },
    // 打开移动弹窗
    moveFun(row) {
      this.dialogTableVisible = true
      this.moveKnowledgeRow = row
    },
    // 保存移动
    async saveMove() {
      this.$refs.form.validate().then((data) => {
        if (data) {
          this.dialogTableVisible = false
          moveKnowledge({ id: this.moveKnowledgeRow.id, catalogId: this.formData.catalogId }).then(
            () => {
              this.$message.success('移动成功')
              this.loadTableData()
            }
          )
        }
      })
    },
    // 创建以及编辑资源
    createResource(id) {
      const path = { path: '/repository/knowledgeEdit' }
      const fullPath = _.isObject(id)
        ? path
        : _.assign(path, { query: { id, tagName: '编辑资源' } })
      this.$router.push(fullPath)
    },
    delFun(row) {
      let that = this
      this.$confirm('是否删除当前资源', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await deleteKnowledgeList({ id: row.id })
        that.$message.success('删除成功')
        that.loadTableData()
      })
    },
    /**
     * 处理页码改变
     */
    handleCurrentPageChange(param) {
      this.queryInfo = _.assign(this.queryInfo, { pageNo: param })
      this.loadTableData()
    },
    /**
     * 处理页码大小更改
     */
    handlePageSizeChange(param) {
      this.queryInfo = _.assign(this.queryInfo, { pageSize: param })
      this.loadTableData()
    },
    /**
     * 搜索
     */
    handleSearch(searchParams) {
      searchParams.status = ''
      if (String(searchParams.approveStatus).indexOf('-') > -1) {
        const statusArr = searchParams.approveStatus.split('-')
        searchParams.approveStatus = statusArr[0]
        searchParams.status = statusArr[1]
      }
      this.queryInfo = _.assign(this.queryInfo, searchParams)
      this.queryInfo.pageNo = 1
      this.page.currentPage = 1
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
        let { totalNum, data } = await getKnowledgeManageList(this.queryInfo)
        // this.tableData = data
        this.tableData = data.map((item) => {
          if (!item.providerName) {
            item.providerName = '--'
          }
          if (!item.providerOrgName) {
            item.providerOrgName = '--'
          }
          if (!item.providerPosition) {
            item.providerPosition = '--'
          }
          return item
        })

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
.handle__button {
  display: flex;
  justify-content: space-between;
  .top__button {
    width: 30px;
  }
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
</style>
<style lang="sass" scoped>
$color_icon: #A0A8AE
.status-span
    padding: 4px;
    border-radius: 2px;
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
