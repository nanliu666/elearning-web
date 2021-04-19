<template>
  <div class="fill">
    <page-header title="考试安排">
      <el-dropdown
        slot="rightMenu"
        v-p="ADD_EXAM"
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
        :active-text-color="activeColor"
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
        ref="table"
        :columns="columnsVisible | columnsFilter"
        :config="tableConfig"
        :data="tableData"
        :loading="tableLoading"
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
                    :disabled="item.prop === 'examName'"
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
        <template #examType="{row}">
          {{ row.examType | typeFilterer }}
        </template>
        <template
          slot="multiSelectMenu"
          slot-scope="{ selection }"
        >
          <el-button
            v-p="DELETE_EXAM"
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
              v-p="EDIT_EXAM"
              type="text"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              v-p="DELETE_EXAM"
              type="text"
              :disabled="row.status === '2'"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
            <el-dropdown
              v-if="activeIndex === '0' && $p([COPY_EXAM])"
              @command="handleCommand(row)"
            >
              <el-button
                type="text"
                style="margin-left: 10px"
              >
                <i class="el-icon-arrow-down el-icon-more" />
              </el-button>
              <el-dropdown-menu
                slot="dropdown"
                v-p="COPY_EXAM"
              >
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
import {
  getArrangeList,
  delExamArrange,
  getExamList,
  getCreatUsers
} from '@/api/examManage/schedule'
import { getCategoryList } from '@/api/examManage/category'
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
    minWidth: 120,
    formatter: (row) => (row.category ? row.category : '未分类')
  },
  {
    label: '考试方式',
    prop: 'examPattern',
    minWidth: 120,
    formatter: (row) => PATTERN_TYPE[row.examPattern]
  },
  {
    label: '考试类型',
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
    label: '参考人数',
    prop: 'takeExamUsers',
    minWidth: 120
  },
  {
    label: '参考人次',
    prop: 'takeExamTimes',
    minWidth: 120
  },
  {
    label: '通过人数',
    prop: 'usersOfPass',
    minWidth: 120
  },
  {
    label: '未通过人数',
    prop: 'usersOfNotPass',
    minWidth: 120
  },
  {
    label: '通过率',
    prop: 'passRate',
    formatter: (row) => `${row.passRate}%`,
    minWidth: 120
  },
  {
    label: '正确率',
    prop: 'rightRate',
    formatter: (row) => `${row.rightRate}%`,
    minWidth: 120
  },
  {
    label: '平均分',
    prop: 'avgScore',
    minWidth: 120
  },
  {
    label: '最高分',
    prop: 'maxScore',
    minWidth: 120
  },
  {
    label: '最低分',
    prop: 'minScore',
    minWidth: 120
  },
  {
    label: '试题数量',
    prop: 'quesNum',
    minWidth: 120
  },
  {
    label: '客观题数量',
    prop: 'objectiveQuesNum',
    minWidth: 120
  },
  {
    label: '主观题数量',
    prop: 'subjectiveQuesNum',
    minWidth: 120
  },
  {
    label: '有效时间',
    prop: 'effectiveTime',
    minWidth: 300
  }
]
const TABLE_CONFIG = {
  rowKey: 'id',
  showHandler: true,
  showIndexColumn: false,
  enablePagination: true,
  enableMultiSelect: true,
  handlerColumn: {
    minWidth: 150,
    fixed: false
  }
}
const STATUS_STATUS = [
  { value: '', label: '全部' },
  { value: '1', label: '未开始' },
  { value: '2', label: '进行中' },
  { value: '3', label: '已过期' }
]
const PATTERN_TYPE = {
  general: '普通考试',
  offline: '线下考试'
}
const TYPE_STATUS = [
  { value: '', label: '全部' },
  { value: 'CurrencyExam', label: '通用考试' },
  { value: 'CourseExam', label: '课程考试' },
  { value: 'StudyPlan', label: '学习计划' },
  { value: 'TrainExam', label: '培训班考试' }
]
const WAY_STATUS = [
  { value: '', label: '全部' },
  { value: 'general', label: '普通考试' },
  { value: 'offline', label: '线下考试' }
]

const SEARCH_CONFIG = {
  requireOptions: [
    {
      type: 'input',
      maxlength: 32,
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
      type: 'treeSelect',
      field: 'categoryId',
      label: '考试分类',
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
      field: 'examType',
      label: '考试类型',
      data: '',
      options: TYPE_STATUS
    },
    {
      type: 'select',
      field: 'examPattern',
      label: '考试方式',
      data: '',
      options: WAY_STATUS
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
      loadMoreFun: {}
    }
  ]
}
import styles from '@/styles/variables.scss'
import { ADD_EXAM, EDIT_EXAM, DELETE_EXAM, COPY_EXAM } from '@/const/privileges'
import { mapGetters } from 'vuex'
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
    typeFilterer(data) {
      const type = _.filter(TYPE_STATUS, (item) => {
        return item.value === data
      })
      return _.get(type, '[0].label', null)
    },
    // // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      activeColor: styles.primaryColor,
      tableLoading: false,
      tableData: [],
      activeIndex: '0',
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
        examType: '', //考试类型 CurrencyExam-通用考试 CourseExam-课程考试 TrainExam-培训班考试
        pageNo: 1,
        pageSize: 10,
        status: '', //状态: 未开始-1, 进行中-2, 已结束-3
        testPaper: '', //关联考卷id
        type: 0 //状态:0-已发布，1-草稿箱
      }
    }
  },
  computed: {
    ADD_EXAM: () => ADD_EXAM,
    EDIT_EXAM: () => EDIT_EXAM,
    DELETE_EXAM: () => DELETE_EXAM,
    COPY_EXAM: () => COPY_EXAM,
    ...mapGetters(['privileges'])
  },
  watch: {
    // 鉴权注释：当前用户无所有的操作权限，操作列表关闭
    privileges: {
      handler() {
        this.tableConfig.showHandler = this.$p([EDIT_EXAM, DELETE_EXAM, COPY_EXAM])
      },
      deep: true
    }
  },
  activated() {
    this.activeIndex = _.get(this.$route.query, 'activeIndex', '0')
    this.handleSelect(this.activeIndex)
    let creatorId = _.filter(this.searchConfig.popoverOptions, (item) => {
      return item.field === 'creatorId'
    })[0]
    getCreatUsers({ pageNo: 1, pageSize: 10, examType: this.activeIndex }).then((res) => {
      creatorId.options.push(...res.data)
    })
    const loadMoreFun = (item) => {
      if (item.loading || item.noMore) return
      item.loading = true
      getCreatUsers({ pageNo: item.pageNo, pageSize: 10, examType: this.activeIndex }).then(
        (res) => {
          if (res.data.length > 0) {
            item.options.push(...res.data)
            item.pageNo += 1
            item.loading = false
          } else {
            item.noMore = true
            item.loading = false
          }
        }
      )
    }
    creatorId.loadMoreFun = loadMoreFun
    this.setConfig()
    let categoryIdType = _.find(this.searchConfig.popoverOptions, { field: 'categoryId' })
    getCategoryList({ type: 1 }).then((res) => {
      categoryIdType.config.treeParams.data = _.concat(
        [
          {
            name: '全部',
            id: ''
          }
        ],
        res
      )
    })
    this.loadTableData()
  },
  methods: {
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
        if (statusIndex !== -1) {
          TABLE_COLUMNS.splice(statusIndex, 1)
        }
      }
      this.tableColumns = TABLE_COLUMNS
      this.columnsVisible = _.map(TABLE_COLUMNS, ({ prop }) => prop).filter((v) => {
        return v != 'testPaper' && v != 'createUser'
      })
    },
    // 切换nav
    handleSelect(key) {
      this.$refs.table.clearSelection()
      window.location.href = `#/examManagement/examSchedule/list?activeIndex=${key}`
      this.activeIndex = key
      this.handleSearch({ type: Number(key) })
      this.setConfig()
    },
    // 多种操作
    handleCommand(row) {
      this.$router.push({
        path: '/examManagement/examSchedule/edit',
        query: { id: row.id, type: 'copy', examPattern: row.examPattern }
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
      const groupList = _.groupBy(selected, (item) => item.status === '2')
      const underway = _.get(groupList, 'true', [])
      const others = _.get(groupList, 'false', [])
      // 全部选了进行中
      if (_.isEmpty(others)) {
        this.$message.error('您所选中的考试都是进行的，无法进行删除操作！')
      } else {
        let tips = ''
        // 全选非进行中
        if (_.isEmpty(underway)) {
          tips = '您确定要删除您所选中的考试吗？'
        } else {
          // 进行中与其他状态都有
          tips = `您所选的共有${_.size(
            underway
          )}条进行中的考试不能被删除，您希望继续删除其他考试吗？）`
        }
        this.$confirm(tips, '提醒', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteBatch(others)
        })
      }
    },
    deleteBatch(others) {
      let selectedIds = []
      _.each(others, (item) => {
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
      this.queryInfo.pageNo = 1
      this.page.currentPage = 1
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
