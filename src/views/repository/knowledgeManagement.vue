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
          {{ row.status === 0 ? '已上架' : '已下架' }}
        </template>
        <template #uploadType="{row}">
          {{ row.uploadType === 0 ? '本地文件' : '链接文件' }}
        </template>
        <template #tags="{row}">
          <el-tag
            v-for="(item, index) in row.tags"
            :key="index"
            style="margin-right: 10px"
          >
            {{ _.get(item, 'name', '') }}
          </el-tag>
        </template>
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
            type="text"
            class="ellipsis"
            style="color: #207EFA; cursor:pointer"
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
            {{ row.isTop === 0 ? '置顶' : '已置顶' }}
          </el-button>
          <el-button
            type="text"
            @click="handleStatus(row)"
          >
            {{ row.status === 0 ? '下架' : '上架' }}
          </el-button>

          <el-dropdown @command="handleCommand($event, row)">
            <el-button
              type="text"
              style="margin-left: 10px"
            >
              <i class="el-icon-arrow-down el-icon-more" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="deleteOrg">
                删除
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </common-table>
    </basic-container>
  </div>
</template>

<script>
import {
  getKnowledgeManageList,
  deleteKnowledgeList,
  topingKnowledge,
  updateStatusKnowledgeList,
  getKnowledgeCatalogList,
  getKnowledgeManageTaglist
} from '@/api/knowledge/knowledge'
import SearchPopover from '@/components/searchPopOver/index'

// 表格属性
const TABLE_COLUMNS = [
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
    label: '所在目录',
    prop: 'catalogName',
    minWidth: 100
  },
  {
    label: '上传模式',
    slot: true,
    prop: 'uploadType',
    minWidth: 100
  },
  {
    label: '标签',
    slot: true,
    prop: 'tags',
    minWidth: 150
  },
  {
    label: '创建人',
    prop: 'createName',
    minWidth: 100
  },
  {
    label: '更新时间',
    prop: 'publishTime',
    minWidth: 100
  }
]
const TABLE_CONFIG = {
  enablePagination: true,
  showHandler: true,
  enableMultiSelect: true,
  showIndexColumn: true,
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
    label: '所在目录',
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
    type: 'select',
    field: 'tagId',
    label: '标签',
    data: '',
    options: [],
    config: { optionLabel: 'name', optionValue: 'id' }
  }
]
let SEARCH_POPOVER_CONFIG = {
  popoverOptions: SEARCH_POPOVER_POPOVER_OPTIONS,
  requireOptions: SEARCH_POPOVER_REQUIRE_OPTIONS
}
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
        tagId: '',
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
    initSearchData() {
      let catalogId = _.find(this.searchPopoverConfig.popoverOptions, { field: 'catalogId' })
      let tagId = _.find(this.searchPopoverConfig.popoverOptions, { field: 'tagId' })
      if (catalogId) {
        getKnowledgeCatalogList().then(
          (res) =>
            (catalogId.config.treeParams.data = _.concat(
              [
                {
                  id: '',
                  name: '全部'
                }
              ],
              res
            ))
        )
      }
      if (tagId) {
        getKnowledgeManageTaglist().then(
          (res) =>
            (tagId.options = _.concat(
              [
                {
                  id: '',
                  name: '全部'
                }
              ],
              res
            ))
        )
      }
    },
    multipleDeleteClick(selected) {
      let selectedIds = []
      _.each(selected, (item) => {
        selectedIds.push(item.id)
      })
      this.delFun(selectedIds)
    },
    // 置顶与取消置顶
    async handleTop(rowData) {
      await topingKnowledge({ id: rowData.id, isTop: rowData.isTop === 0 ? 1 : 0 })
      this.$message.success(`${rowData.isTop === 0 ? '' : '取消'}置顶成功`)
      this.loadTableData()
    },
    // 上架与下架
    async handleStatus(rowData) {
      await updateStatusKnowledgeList({ id: rowData.id, status: rowData.status === 0 ? 1 : 0 })
      this.$message.success(`${rowData.status === 0 ? '下架' : '上架'}成功`)
      this.loadTableData()
    },
    async handleCommand($event, row) {
      if ($event === 'deleteOrg') {
        let that = this
        this.$confirm('是否删除当前资源', '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.delFun(row)
        })
      }
    },
    createResource() {
      this.$router.push({
        path: '/repository/knowledgeEdit'
      })
    },
    async delFun(row) {
      await deleteKnowledgeList({ id: row.id })
      this.$message.success('删除成功')
      this.loadTableData()
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
