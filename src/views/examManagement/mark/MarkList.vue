<template>
  <div class="mark-list">
    <page-header title="手工评卷" />
    <basic-container block>
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
            <div class="filter-box">
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
          <el-alert
            title="该列表将列出您被安排评卷的考试的列表，建议逐人及逐题不可同时使用"
            type="info"
            show-icon
            class="tips"
            :closable="false"
          >
          </el-alert>
        </template>
        <template #examName="{row}">
          <div
            class="ellipsis title"
            @click="jumpDetail(row)"
          >
            {{ row.examName }}
          </div>
        </template>
        <template #categoryName="{row}">
          {{ row.categoryName ? row.categoryName : '未分类' }}
        </template>
        <template #createUser1="{row}">
          {{ moment(row.examEndTime).diff(moment(row.examBeginTime), 'minutes') }}
        </template>
        <template #examEndTime="{row}">
          <span>{{ moment(row.examBeginTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
          <span>至</span>
          <span>{{ moment(row.examEndTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>

        <template #completeStatus="{row}">
          {{ row.completeStatus | statusFilterer }}
        </template>
        <template #handler="{row}">
          <div class="menuClass">
            <el-button
              v-p="BY_PERSON"
              type="text"
              @click="handleExaminee(row)"
            >
              逐人评卷
            </el-button>
            <el-button
              v-p="BY_QUESTION"
              type="text"
              @click="handlePaper(row)"
            >
              逐题评卷
            </el-button>
          </div>
        </template>
      </common-table>
    </basic-container>
  </div>
</template>

<script>
// 手工评卷列表页
import SearchPopover from '@/components/searchPopOver/index'
import { listManualEvaluation } from '@/api/examManage/mark'
import { getExamList } from '@/api/examManage/schedule'
import { getCreatUsers } from '@/api/knowledge/knowledge'
import { getCategoryList } from '@/api/examManage/category'
import moment from 'moment'
let TABLE_COLUMNS = [
  {
    label: '考试名称',
    prop: 'examName',
    slot: true,
    minWidth: 150
  },
  {
    label: '状态',
    prop: 'completeStatus',
    slot: true,
    minWidth: 120
  },
  {
    label: '考试分类',
    prop: 'categoryName',
    slot: true,
    minWidth: 120
  },
  {
    label: '关联试卷',
    prop: 'testPaperName',
    minWidth: 120
  },
  {
    label: '答题时限（分钟）',
    prop: 'createUser1',
    slot: true,
    minWidth: 150
  },
  {
    label: '创建人',
    prop: 'createName',
    minWidth: 120
  },
  {
    label: '有效时间',
    slot: true,
    prop: 'examEndTime',
    minWidth: 120
  }
]
const TABLE_CONFIG = {
  rowKey: 'id',
  showHandler: true,
  showIndexColumn: false,
  enablePagination: true,
  enableMultiSelect: false,
  handlerColumn: {
    minWidth: 150
  }
}
const STATUS_STATUS = [
  { value: '', label: '全部' },
  { value: '0', label: '未评卷' },
  { value: '1', label: '评卷中' },
  { value: '2', label: '已评卷' }
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
      field: 'completeStatus',
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
import { BY_PERSON, BY_QUESTION } from '@/const/privileges'
import { mapGetters } from 'vuex'
export default {
  name: 'MarkList',
  components: { SearchPopover },
  filters: {
    statusFilterer(data) {
      if (data !== '') {
        return _.filter(STATUS_STATUS, (item) => {
          return item.value === data + ''
        })[0].label
      }
    },
    // // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
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
        currentPage: 0,
        size: 10,
        categoryId: '', // 分类ID
        completeStatus: ''
      }
    }
  },
  computed: {
    BY_PERSON: () => BY_PERSON,
    BY_QUESTION: () => BY_QUESTION,
    ...mapGetters(['privileges'])
  },
  watch: {
    // 鉴权注释：当前用户无所有的操作权限，操作列表关闭
    privileges: {
      handler() {
        this.tableConfig.showHandler = this.$p([BY_PERSON, BY_QUESTION])
      },
      deep: true
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
    let categoryIdType = _.find(this.searchConfig.popoverOptions, { field: 'categoryId' })
    getCategoryList().then((res) => {
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
  },
  methods: {
    moment,
    /**
     * 处理页码改变
     */
    handleCurrentPageChange(param) {
      this.queryInfo.currentPage = param
      this.loadTableData()
    },
    /**
     * 处理页码大小更改
     */
    handlePageSizeChange(param) {
      this.queryInfo.size = param
      this.loadTableData()
    },
    // 跳转详情
    jumpDetail(row) {
      this.$router.push({
        path: '/examManagement/examSchedule/detail',
        query: { id: row.id, source: 'mark' }
      })
    },
    // 加载函数
    async loadTableData() {
      if (this.tableLoading) {
        return
      }
      try {
        this.tableData = []
        this.tableLoading = true
        let { totalNum, list } = await listManualEvaluation(this.queryInfo)
        this.tableLoading = false
        this.tableData = list
        this.page.total = totalNum
      } catch (error) {
        this.tableLoading = false
        this.$message.error(error.message)
      }
    },
    // 搜索
    handleSearch(params) {
      this.queryInfo = _.assign(this.queryInfo, params)
      this.loadTableData()
    },
    // 逐题评卷跳转
    handlePaper(row) {
      this.$router.push({
        path: '/examManagement/mark/MarkByPaper',
        query: { id: row.id, examName: row.examName }
      })
    },
    // 逐人评卷跳转
    handleExaminee(row) {
      this.$router.push({
        path: '/examManagement/mark/ExamineeList',
        query: { id: row.id, examName: row.examName }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mark-list {
  /deep/ .top-menu {
    height: 80px;
    .tips {
      margin-top: 10px;
      background-color: #e7fbff;
    }
    .el-alert__icon {
      color: $primaryColor;
    }
  }
}

.basic-container--block {
  height: calc(100% - 92px);
  min-height: calc(100% - 92px);
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
