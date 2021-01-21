<template>
  <div class="mark-list">
    <page-header
      title="试卷列表"
      show-back
    />
    <basic-container block>
      <div class="title-box">
        <span class="title">{{ $route.query.examName }}</span>
        <span
          v-if="!_.isEmpty(evaluationCount)"
          class="sub-title"
        >
          <span>（未评卷：{{ evaluationCount.notExamNum }}人，</span>
          <span> 阅卷中：{{ evaluationCount.ExamNumIng }}人，</span>
          <span>已评卷：{{ evaluationCount.ExamNumed }}人 ）</span>
        </span>
      </div>
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
        </template>
        <template #name>
          ******
        </template>
        <template #phone>
          ******
        </template>
        <template #status="{row}">
          {{ row.status | statusFilterer }}
        </template>
        <template #effectiveTime="{row}">
          <span v-if="row.answerBeginTime">
            {{ row.answerBeginTime }} ~ {{ row.answerEndTime }}
          </span>
          <span v-else>
            暂无
          </span>
        </template>
        <template #score="{row}">
          {{ row.score != 0 ? row.score : '--' }}
        </template>
        <template #handler="{row}">
          <div class="menuClass">
            <el-button
              type="text"
              @click="handleExaminee(row)"
            >
              {{ getHandleButtonText(row) }}
            </el-button>
          </div>
        </template>
      </common-table>
    </basic-container>
  </div>
</template>

<script>
// 逐人评卷列表
import SearchPopover from '@/components/searchPopOver/index'
import { getCreatUsers } from '@/api/knowledge/knowledge'
import { listManualEvaluationOnce, listManualEvaluationOnceCount } from '@/api/examManage/mark'
import { mapGetters } from 'vuex'
let TABLE_COLUMNS = [
  {
    label: '考生姓名',
    prop: 'name',
    slot: true,
    minWidth: 120
  },
  {
    label: '手机号码',
    prop: 'phone',
    slot: true,
    minWidth: 120
  },
  {
    label: '所属组织',
    prop: 'dept',
    minWidth: 120
  },
  {
    label: '状态',
    prop: 'status',
    slot: true,
    minWidth: 120
  },
  {
    label: '考试时间',
    prop: 'effectiveTime',
    slot: true,
    minWidth: 120
  },
  {
    label: '得分',
    prop: 'score',
    slot: true,
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
  { value: '3', label: '待评卷' },
  { value: '4', label: '阅卷中' },
  { value: '5', label: '已评卷' }
]
const SEARCH_CONFIG = {
  requireOptions: [
    {
      type: 'input',
      field: 'name',
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
      type: 'numInterval',
      data: { min: '', max: '' },
      label: '得分',
      field: 'scoreMin,scoreMax'
    },
    {
      type: 'numInterval',
      data: { min: '', max: '' },
      label: '正确率',
      field: 'accuracyMin,accuracyMax'
    },
    {
      type: 'select',
      field: 'reviewer',
      data: '',
      label: '评卷人',
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
  name: 'ExamineeList',
  components: { SearchPopover },
  filters: {
    statusFilterer(data) {
      if (data) {
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
      evaluationCount: {},
      tablePageConfig: {},
      page: {
        currentPage: 0,
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
        size: 10
      }
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
    next()
  },
  async activated() {
    this.evaluationCount = await listManualEvaluationOnceCount({ id: this.$route.query.id })
    this.queryInfo = _.assign(this.queryInfo, { id: this.$route.query.id })
    let reviewer = _.filter(this.searchConfig.popoverOptions, (item) => {
      return item.field === 'reviewer'
    })[0]
    if (_.size(reviewer.options) === 0) {
      getCreatUsers().then((res) => {
        if (reviewer) {
          reviewer.options.push(...res)
        }
      })
    }
    this.loadTableData()
  },
  methods: {
    getHandleButtonText(row) {
      const STATUS_DICTS = {
        3: '开始评卷',
        4: row.currentId === this.userId ? '继续评卷' : '查看答卷',
        5: '查看答卷'
      }
      return STATUS_DICTS[row.status]
    },
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
    // 加载函数
    async loadTableData() {
      if (this.tableLoading) return
      try {
        this.tableData = []
        this.tableLoading = true
        let { totalNum, list } = await listManualEvaluationOnce(this.queryInfo)
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
    /**
     * 逐人评卷
     */
    handleExaminee(row) {
      const query = { id: row.id, examineeBatchId: row.examineeBatchId, examId: row.examId }
      let path = ''
      if (row.status === '5' || (row.status === '4' && row.currentId !== this.userId)) {
        // 查看试卷详情
        path = '/examManagement/mark/ViewByExaminee'
      } else {
        // 可评卷试卷页面
        path = '/examManagement/mark/MarkByExaminee'
      }
      this.$router.push({ path, query })
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-container--block {
  height: calc(100% - 92px);
  min-height: calc(100% - 92px);
  .title-box {
    margin-bottom: 10px;
    .title {
      font-size: 18px;
      color: rgba(0, 11, 21, 0.85);
      font-weight: 550;
    }
    .sub-title {
      font-size: 16px;
      color: rgba(0, 11, 21, 0.45);
      margin-left: 6px;
    }
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
