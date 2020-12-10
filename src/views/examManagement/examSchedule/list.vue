<template>
  <div class="fill">
    <page-header title="考试安排">
      <el-dropdown
        slot="rightMenu"
        @command="createExam"
      >
        <el-button
          type="primary"
          size="medium"
        >
          创建考试
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="general">
            普通考试
          </el-dropdown-item>
          <el-dropdown-item command="offline">
            线下考试
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </page-header>

    <basic-container block>
      <el-menu
        :default-active="activeIndex"
        class="el-menu"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="0">
          已发布
        </el-menu-item>
        <el-menu-item index="1">
          草稿箱
        </el-menu-item>
      </el-menu>
      <common-table
        id="demo"
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
          <div class="search-box">
            <search-popover
              ref="searchPopover"
              :require-options="searchConfig.requireOptions"
              :popover-options="searchConfig.popoverOptions"
              @submit="handleSearch"
            />
            <div
              v-if="activeIndex === '0'"
              class="filter-box"
            >
              <div
                class="search-sort-box"
                @click="loadTableData"
              >
                <i class="el-icon-refresh-right" />
                <span class="sort-text">刷新</span>
              </div>
              <el-popover
                placement="bottom"
                width="40"
                trigger="click"
                style="margin-left:10px"
              >
                <el-checkbox-group
                  v-model="columnsVisible"
                  style="display: flex;flex-direction: column;"
                >
                  <el-checkbox
                    v-for="item in tableColumns"
                    :key="item.prop"
                    :label="item.prop"
                    class="originColumn"
                  >
                    {{ item.label }}
                  </el-checkbox>
                </el-checkbox-group>
                <i
                  slot="reference"
                  class="el-icon-setting"
                  style="cursor: pointer;"
                />
              </el-popover>
            </div>
          </div>
        </template>
        <template #examName="{row}">
          <div
            class="ellipsis title"
            @click="jumpDetail(row)"
          >
            {{ row.examName }}
          </div>
        </template>
        <template #status="{row}">
          {{ row.status | statusFilterer }}
        </template>
        <template #examPattern="{row}">
          {{ row.examPattern | patternFilterer }}
        </template>
        <template #examType="{row}">
          {{ row.examType | typeFilterer }}
        </template>
        <template
          slot="multiSelectMenu"
          slot-scope="{ selection }"
        >
          <el-button
            type="text"
            icon="el-icon-delete"
            @click="deleteSelected(selection)"
          >
            批量删除
          </el-button>
        </template>
        <template #handler="{row}">
          <div class="menuClass">
            <el-button
              type="text"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
            <el-dropdown
              v-if="activeIndex === '0'"
              @command="handleCommand(row)"
            >
              <el-button
                type="text"
                style="margin-left: 10px"
              >
                <i class="el-icon-arrow-down el-icon-more" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="copy">
                  复制
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </common-table>
    </basic-container>
  </div>
</template>

<script>
import SearchPopover from '@/components/searchPopOver/index'
import { getArrangeList, delExamArrange, getExamList } from '@/api/examManage/schedule'
import { getCreatUsers } from '@/api/knowledge/knowledge'
const STATUS_CONFIG = {
  label: '状态',
  prop: 'status',
  slot: true,
  minWidth: 120
}
let TABLE_COLUMNS = [
  {
    label: '考试名称',
    prop: 'examName',
    slot: true,
    minWidth: 150
  },

  {
    label: '考试分类',
    prop: 'category',
    minWidth: 120
  },
  {
    label: '考试类型',
    slot: true,
    prop: 'examPattern',
    minWidth: 120
  },
  {
    label: '考试方式',
    slot: true,
    prop: 'examType',
    minWidth: 120
  },
  {
    label: '关联试卷',
    prop: 'testPaper',
    minWidth: 120
  },
  {
    label: '创建人',
    prop: 'createUser',
    minWidth: 120
  },
  {
    label: '有效时间',
    prop: 'effectiveTime',
    minWidth: 120
  }
]
const TABLE_CONFIG = {
  rowKey: 'id',
  showHandler: true,
  showIndexColumn: false,
  enablePagination: true,
  enableMultiSelect: true,
  handlerColumn: {
    minWidth: 150
  }
}
const STATUS_STATUS = [
  { value: '', label: '全部' },
  { value: '1', label: '未开始' },
  { value: '2', label: '进行中' },
  { value: '3', label: '已结束' }
]
const PATTERN_TYPE = [
  { value: '', label: '全部' },
  { value: 'general', label: '普通考试' },
  { value: 'offline', label: '线下考试' }
]
const TYPE_STATUS = [
  { value: '', label: '全部' },
  { value: 'CurrencyExam', label: '通用考试' },
  { value: 'CourseExam', label: '课程考试' },
  { value: 'TrainExam', label: '培训班考试' }
]
const SEARCH_CONFIG = {
  requireOptions: [
    {
      type: 'input',
      field: 'examName',
      label: '',
      data: '',
      options: [],
      config: { placeholder: '请输入考试名称搜索', 'suffix-icon': 'el-icon-search' }
    }
  ],
  popoverOptions: [
    {
      type: 'select',
      field: 'status',
      label: '状态',
      data: '',
      options: STATUS_STATUS
    },
    {
      type: 'select',
      field: 'examPattern',
      label: '考试分类',
      data: '',
      options: PATTERN_TYPE
    },
    {
      type: 'select',
      field: 'examType',
      label: '考试类型',
      data: '',
      options: TYPE_STATUS
    },
    {
      data: '',
      field: 'testPaper',
      label: '关联试卷',
      type: 'lazySelect',
      optionList: [],
      placeholder: '请选择关联试卷',
      optionProps: {
        formatter: (item) => `${item.name}`,
        key: 'name',
        value: 'id'
      },
      load: (params) => {
        return getExamList(params)
      },
      config: { optionLabel: 'name', optionValue: 'id' }
    },
    {
      type: 'select',
      field: 'creatorId',
      data: '',
      label: '创建人',
      options: [],
      config: { optionLabel: 'name', optionValue: 'userId' },
      loading: false,
      noMore: false,
      pageNo: 2,
      loadMoreFun(item) {
        if (item.loading || item.noMore) return
        item.loading = true
        getCreatUsers().then((res) => {
          if (res.length > 0) {
            item.options.push(...res)
            item.pageNo += 1
            item.loading = false
          } else {
            item.noMore = true
            item.loading = false
          }
        })
      }
    }
  ]
}
export default {
  name: 'CatelogManager',
  components: { SearchPopover },
  filters: {
    statusFilterer(data) {
      if (data) {
        return _.filter(STATUS_STATUS, (item) => {
          return item.value === data
        })[0].label
      }
    },
    patternFilterer(data) {
      return _.filter(PATTERN_TYPE, (item) => {
        return item.value === data
      })[0].label
    },
    typeFilterer(data) {
      return _.filter(TYPE_STATUS, (item) => {
        return item.value === data
      })[0].label
    },
    // // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      activeIndex: '0',
      tableLoading: false,
      tableData: [],
      tablePageConfig: {},
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      tableConfig: TABLE_CONFIG,
      tableColumns: TABLE_COLUMNS,
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      searchConfig: SEARCH_CONFIG,
      data: [],
      createOrgDailog: false,
      queryInfo: {
        categoryId: '', // 分类ID
        creatorId: '', //评卷人id
        examPattern: '', //考试方式 general-普通考试 offline-线下考试
        examType: '', //考试类型 CurrencyExam-通用考试 CourseExam-课程考试 TrainExam-培训班考试
        pageNo: '',
        pageSize: '',
        status: '', //状态: 未开始-1, 进行中-2, 已结束-3
        testPaper: '', //关联考卷id
        type: 0 //状态:0-已发布，1-草稿箱
      }
    }
  },
  activated() {
    let creatorId = _.filter(this.searchConfig.popoverOptions, (item) => {
      return item.field === 'creatorId'
    })[0]
    if (_.size(creatorId.options) === 0) {
      getCreatUsers().then((res) => {
        if (creatorId) {
          creatorId.options.push(...res)
        }
      })
    }
    this.loadTableData()
    this.setConfig()
  },
  methods: {
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
    // 跳转详情
    jumpDetail(row) {
      this.$router.push({ path: '/examManagement/examSchedule/detail', query: { id: row.id } })
    },
    setConfig() {
      const examNameIndex = _.findIndex(TABLE_COLUMNS, (item) => {
        return item.prop === 'examName'
      })
      const statusIndex = _.findIndex(TABLE_COLUMNS, (item) => {
        return item.prop === 'status'
      })
      if (this.activeIndex === '0') {
        if (statusIndex === -1) {
          TABLE_COLUMNS.splice(examNameIndex + 1, 0, STATUS_CONFIG)
        }
      } else {
        TABLE_COLUMNS.splice(statusIndex, 1)
      }
      this.tableColumns = TABLE_COLUMNS
      this.columnsVisible = _.map(TABLE_COLUMNS, ({ prop }) => prop)
    },
    // 切换nav
    handleSelect(key) {
      this.$refs.table.clearSelection()
      this.activeIndex = key
      this.handleSearch({ type: Number(key) })
      this.setConfig()
    },
    // 多种操作
    handleCommand(row) {
      this.$router.push({
        path: '/examManagement/examSchedule/edit',
        query: { id: row.id, type: 'copy' }
      })
    },
    // 创建考试
    createExam($event) {
      this.$router.push({
        path: '/examManagement/examSchedule/edit',
        query: { examPattern: $event }
      })
    },
    // 具体的删除函数
    deleteFun(id) {
      delExamArrange({ ids: id }).then(() => {
        this.$refs.table.clearSelection()
        this.loadTableData()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    // 单个删除
    handleDelete(row) {
      this.$confirm('您确定要删除选中的考试吗？', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteFun(row.id)
      })
    },
    // 批量删除
    deleteSelected(selected) {
      let selectedIds = []
      _.each(selected, (item) => {
        selectedIds.push(item.id)
      })
      this.deleteFun(selectedIds.join(','))
    },
    // 加载函数
    async loadTableData() {
      if (this.tableLoading) {
        return
      }
      try {
        this.tableData = []
        this.tableLoading = true
        let { totalNum, data } = await getArrangeList(this.queryInfo)
        this.tableLoading = false
        this.tableData = data
        this.page.total = totalNum
      } catch (error) {
        this.tableLoading = false
        this.$message.error(error.message)
      }
    },
    changevisible(data) {
      this.createOrgDailog = data
    },
    // 搜索
    handleSearch(params) {
      this.queryInfo = _.assign(this.queryInfo, params)
      this.loadTableData()
    },
    /**
     * 编辑
     */
    handleEdit(row) {
      this.$router.push({
        path: '/examManagement/examSchedule/edit',
        query: { id: row.id, type: 'edit' }
      })
    },
    // 递归获取所有的停启用的id集合
    getDeepIds(row) {
      let ids = []
      const deep = function(row) {
        ids.push(row.id)
        if (!_.isEmpty(row.children)) {
          _.each(row.children, (item) => {
            deep(item)
          })
        }
      }
      deep(row)
      return ids
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-container--block {
  height: calc(100% - 92px);
  min-height: calc(100% - 92px);
  .el-menu {
    margin-bottom: 20px;
    margin-top: -10px;
  }
  /deep/ .el-menu--horizontal {
    border-bottom: 1px solid #cccccc !important;
  }
  .title {
    color: $primaryColor;
    cursor: pointer;
  }
}
.originColumn {
  height: 25px;
}
.search-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  i {
    color: #a0a8ae;
    font-size: 18px;
  }
  .filter-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
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
}
</style>
