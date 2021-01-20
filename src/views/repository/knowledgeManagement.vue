<template>
  <div class="Menu fill">
    <page-header title="知识管理">
      <template slot="rightMenu">
        <el-button
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
        <template #status="{row}">
          {{ row.status === '0' ? '已上架' : '已下架' }}
        </template>
        <template #uploadType="{row}">
          {{ row.uploadType === 0 ? '本地文件' : '链接文件' }}
        </template>
        <!-- <template #tags="{row}">
          <div v-if="_.size(row.tags) > 0">
            <el-tag
              v-for="(item, index) in row.tags"
              :key="index"
              style="margin-right: 10px"
            >
              {{ _.get(item, 'name', '') }}
            </el-tag>
          </div>
          <div v-else>
            {{ '' }}
          </div>
        </template> -->
        <template
          slot="multiSelectMenu"
          slot-scope="{ selection }"
        >
          <el-button
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
            class="ellipsis title"
            @click="jumpDetail(row)"
          >
            {{ row.resName }}
          </div>
        </template>
        <template #handler="{row}">
          <el-button
            type="text"
            class="top-button"
            @click="handleTop(row)"
          >
            {{ row.topTime ? '已置顶' : '置顶' }}
          </el-button>
          <el-button
            type="text"
            @click="handleStatus(row)"
          >
            {{ row.status === '0' ? '下架' : '上架' }}
          </el-button>

          <el-dropdown
            style="margin-left: 4px"
            @command="handleCommand($event, row)"
          >
            <el-button
              type="text"
              style="margin-left: 10px"
            >
              <i class="el-icon-arrow-down el-icon-more" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="editKnow">
                编辑
              </el-dropdown-item>
              <el-dropdown-item command="deleteKnow">
                删除
              </el-dropdown-item>
              <el-dropdown-item command="moveKnow">
                移动
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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

// 表格属性
const TABLE_COLUMNS = [
  { type: 'index', label: '序号' },
  {
    label: '资源名称',
    minWidth: 150,
    slot: true,
    prop: 'resName'
  },
  {
    label: '状态',
    slot: true,
    prop: 'status',
    maxWidth: 100
  },
  {
    label: '所在分类',
    prop: 'catalogName',
    minWidth: 100
  },
  {
    label: '上传模式',
    slot: true,
    prop: 'uploadType',
    minWidth: 100
  },
  // {
  //   label: '标签',
  //   slot: true,
  //   prop: 'tags',
  //   minWidth: 150
  // },
  {
    label: '创建人',
    prop: 'creatorName',
    minWidth: 100
  },
  {
    label: '更新时间',
    prop: 'updateTime',
    minWidth: 100
  }
]
const TABLE_CONFIG = {
  enablePagination: true,
  showHandler: true,
  enableMultiSelect: true,
  showIndexColumn: false,
  rowKey: 'id',
  treeProps: { hasChildren: 'hasChildren', children: 'children' }
}
const TABLE_PAGE_CONFIG = {}

// 搜索配置
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    config: { placeholder: '输入资源名称搜索', 'suffix-icon': 'el-icon-search' },
    data: '',
    field: 'resName',
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
      { value: '', label: '全部' },
      { value: 0, label: '上架' },
      { value: 1, label: '下架' }
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
  activated() {
    this.initSearchData()
    this.refreshTableData()
  },
  methods: {
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
      let selectedIds = []
      _.each(selected, (item) => {
        selectedIds.push(item.id)
      })
      await deleteKnowledgeList({ id: selectedIds.join(',') })
      this.$message.success('删除成功')
      this.$refs.table.clearSelection()
      this.loadTableData()
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
      const statusTips = rowData.status === '0' ? '下架' : '上架'
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
