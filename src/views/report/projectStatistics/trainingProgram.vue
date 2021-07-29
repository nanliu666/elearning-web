<template>
  <div class="integralStatistics">
    <header-title
      title="培训项目统计"
      :total="page[activeName].total"
      :need-export-btn="true"
      :export-loading="exportLoading"
      @expoerdata="exportData"
    ></header-title>
    <basic-container block>
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="(item, index) in tabs"
          :key="index"
          :label="item"
          lazy
        >
          <div
            v-if="activeName == index"
            class="table"
          >
            <common-table
              :loading="loading"
              :data="tableData[activeName]"
              :columns="columnsVisible | columnsFilter"
              :config="tableConfig"
              :page="page[activeName]"
              @current-page-change="pageChange"
              @page-size-change="sizeChange"
            >
              <template
                slot="isPass"
                slot-scope="{ row }"
              >
                <div>
                  {{ row.isPass == '1' ? '是' : '否' }}
                </div>
              </template>
              <template #topMenu>
                <screen
                  ref="screen"
                  :columns-visible="columnsVisible"
                  :columns-visible-filter="columnsVisibleFilter"
                  :params="searchConfig[activeName]"
                  @dateChange="dateChange"
                  @paramsChange="orgChange"
                  @changeQuery="getQuery"
                  @showColunmsChange="showColunmsChange"
                  @resetQuery="resetQuery"
                >
                  <template
                    v-if="activeName == '0'"
                    slot="frist"
                  >
                    <span class="labelscreen">年度培训计划</span>
                    <lazy-select
                      v-model="params.annualPlan"
                      :remote-method="getTrainPlanList"
                      :query-props="{ search: 'planName', page: 'pageNo', size: 'pageSize' }"
                      :props="{ value: 'year', label: 'planName' }"
                    />
                  </template>
                </screen>
              </template>
            </common-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </basic-container>
  </div>
</template>

<script>
import {
  getTrainOveriew,
  getTrainCourse,
  getTrainExam,
  getTrainTrainersdetail,
  exportTrainOverview,
  exportTrainCourse,
  exportTrainExam,
  exportTrainTrainersdetail,
  getTrainPlan
} from '@/api/statistics/census'
import headerTitle from '../components/topTitle'
import screen from '../components/screen'
import lazySelect from '@/components/el-lazy-select'
import { dateAdd, exportToExcel } from '@/util/util'
import {
  EMPLOYTYPE,
  LECTURERLEVEL,
  TRAINING_Type,
  TRAIN_CATEGORY,
  TRAIN_TYPE,
  TRAIN_STATUS
} from '@/const/configData'
// 培训总览统计
const onlineAll = [
  {
    label: '培训名称',
    minWidth: 160,
    fixed: 'left',
    prop: 'trainName',
    isDisabled: true
  },
  {
    label: '培训状态',
    minWidth: 150,
    prop: 'trainStatus',
    formatter: (row) => {
      return TRAIN_STATUS[row.trainStatus] || row.trainStatus
    }
  },
  {
    label: '培训类别',
    minWidth: 150,
    prop: 'trainCategory',
    formatter: (row) => {
      return TRAIN_CATEGORY[row.trainCategory] || row.trainCategory
    }
  },
  {
    label: '培训方式',
    minWidth: 150,
    prop: 'trainWay',
    formatter: (row) => {
      return TRAINING_Type[row.trainWay] || row.trainWay
    }
  },
  {
    label: '培训类型',
    minWidth: 150,
    prop: 'trainType',
    formatter: (row) => {
      return TRAIN_TYPE[row.trainType] || row.trainType
    }
  },
  {
    label: '是否年度计划内',
    minWidth: 150,
    prop: 'annualPlan'
  },
  {
    label: '培训时间',
    minWidth: 220,
    prop: 'startTime',
    formatter: (row) => {
      return row.startTime && row.endTime ? `${row.startTime} ~ ${row.endTime}` : ''
    }
  },
  {
    label: '费用预算（元）',
    minWidth: 150,
    prop: 'costBudget'
  },
  {
    label: '使用费用(元）',
    minWidth: 150,
    prop: 'useBudget'
  },
  {
    label: '计划人数',
    minWidth: 150,
    prop: 'planNumber'
  },
  {
    label: '实际学习人数',
    minWidth: 150,
    prop: 'actualNumber'
  },
  {
    label: '通过人数',
    minWidth: 150,
    prop: 'passNumber'
  },
  {
    label: '通过率',
    minWidth: 150,
    prop: 'passRate',
    formatter: (row) => {
      return row.passRate === '' ? '' : `${row.passRate}%`
    }
  },
  {
    label: '培训总时长（h)',
    minWidth: 150,
    prop: 'trainDuration'
  },
  {
    label: '创建人',
    minWidth: 150,
    prop: 'creator'
  },
  {
    label: '创建人部门',
    minWidth: 160,
    prop: 'creatorDept'
  },
  {
    label: '创建时间',
    minWidth: 160,
    prop: 'createTime'
  }
]
// 培训课程统计
const onlineExam = [
  {
    label: '姓名',
    minWidth: 160,
    fixed: 'left',
    prop: 'username',
    isDisabled: true
  },
  {
    label: '用户编码',
    minWidth: 150,
    prop: 'workNo'
  },
  {
    label: '部门',
    minWidth: 150,
    prop: 'dept'
  },
  {
    label: '岗位',
    minWidth: 150,
    prop: 'position'
  },
  {
    label: '培训名称',
    minWidth: 150,
    prop: 'trainName'
  },
  {
    label: '课程名称',
    minWidth: 150,
    prop: 'courseName'
  },
  {
    label: '课程类型',
    minWidth: 150,
    prop: 'courseType'
  },
  {
    label: '授课时间',
    minWidth: 150,
    prop: 'startTime',
    formatter: (row) => {
      return `${row.startTime} ~ ${row.endTime}`
    }
  },
  {
    label: '课时（h）',
    minWidth: 150,
    prop: 'courseTime'
  },
  {
    label: '讲师',
    minWidth: 150,
    prop: 'lecturerName'
  },
  {
    label: '聘用类型',
    minWidth: 150,
    prop: 'employType',
    formatter: (row) => {
      return EMPLOYTYPE[row.employType] || row.employType
    }
  },
  {
    label: '讲师级别',
    width: 150,
    prop: 'lecturerLevel',
    formatter: (row) => {
      return LECTURERLEVEL[row.lecturerLevel] || row.lecturerLevel
    }
  },
  {
    label: '课程评分',
    minWidth: 150,
    prop: 'scope'
  }
]
// 培训考试统计
const onlineStudy = [
  {
    label: '姓名',
    minWidth: 160,
    fixed: 'left',
    prop: 'username',
    isDisabled: true
  },
  {
    label: '用户编码',
    minWidth: 150,
    prop: 'workNo'
  },
  {
    label: '部门',
    minWidth: 150,
    prop: 'dept'
  },
  {
    label: '岗位',
    minWidth: 150,
    prop: 'position'
  },
  {
    label: '培训名称',
    minWidth: 150,
    prop: 'trainName'
  },
  {
    label: '考试名称',
    minWidth: 150,
    prop: 'examName'
  },
  {
    label: '考试时间',
    minWidth: 200,
    prop: 'startTime',
    formatter: (row) => {
      return `${row.startTime} ~ ${row.endTime}`
    }
  },
  {
    label: '考试限时（min）',
    minWidth: 150,
    prop: 'examTime'
  },
  {
    label: '考试次数',
    minWidth: 150,
    prop: 'examTimes'
  },
  {
    label: '成绩（分）',
    minWidth: 150,
    prop: 'score'
  },
  {
    label: '是否通过',
    minWidth: 150,
    prop: 'isPass',
    slot: true
  }
]
// 参培人员明细
const trainPerson = [
  {
    label: '姓名',
    minWidth: 160,
    fixed: 'left',
    prop: 'username',
    isDisabled: true
  },
  {
    label: '用户编码',
    minWidth: 150,
    prop: 'workNo'
  },
  {
    label: '部门',
    minWidth: 150,
    prop: 'dept'
  },
  {
    label: '岗位',
    minWidth: 150,
    prop: 'position'
  },
  {
    label: '培训名称',
    minWidth: 150,
    prop: 'trainName'
  },
  {
    label: '培训状态',
    minWidth: 150,
    prop: 'trainStatus',
    formatter: (row) => {
      return TRAIN_STATUS[row.trainStatus] || row.trainStatus
    }
  },
  {
    label: '项目经理',
    minWidth: 150,
    prop: 'projectManager'
  },
  {
    label: '日程名称',
    minWidth: 150,
    prop: 'courseName'
  },
  {
    label: '学习时长（h）',
    minWidth: 150,
    prop: 'studyTime'
  },
  {
    label: '讲师',
    minWidth: 150,
    prop: 'lecturerName'
  },
  {
    label: '获得积分',
    prop: 'credit'
  },
  {
    label: '培训成绩（分）',
    minWidth: 150,
    prop: 'trainScore'
  },
  {
    label: '是否通过',
    prop: 'isPass'
  },
  {
    label: '通过时间',
    minWidth: 150,
    prop: 'passTime'
  },
  {
    label: '是否获得证书',
    minWidth: 150,
    prop: 'getCert'
  },
  {
    label: '证书获得时间',
    minWidth: 150,
    prop: 'getCertTime'
  },
  {
    label: '培训评分',
    minWidth: 150,
    prop: 'scope'
  }
]

const perScoreParams = [
  {
    type: 'input',
    field: 'trainName',
    label: '培训名称',
    data: '',
    options: [],
    config: { placeholder: '请输入培训名称' }
  }
]
const scoreDetailParams = [
  {
    type: 'input',
    field: 'trainName',
    label: '培训名称',
    data: '',
    options: [],
    config: { placeholder: '请输入培训名称' }
  },
  {
    type: 'input',
    field: 'courseName',
    label: '课程',
    data: '',
    options: [],
    config: { placeholder: '请输入课程名称' }
  }
]
const studyParams = [
  {
    type: 'input',
    field: 'trainName',
    label: '培训名称',
    data: '',
    options: [],
    config: { placeholder: '请输入培训名称' }
  },
  {
    type: 'input',
    field: 'examName',
    label: '考试',
    data: '',
    options: [],
    config: { placeholder: '请输入考试名称' }
  }
]

const personParams = [
  {
    type: 'input',
    field: 'trainName',
    label: '培训名称',
    data: '',
    options: [],
    config: { placeholder: '请输入培训名称' }
  },
  {
    type: 'input',
    field: 'userName',
    label: '姓名',
    data: '',
    options: [],
    config: { placeholder: '请输入姓名' } //'suffix-icon': 'el-icon-search'
  }
]
const tableColunms = [onlineAll, onlineExam, onlineStudy, trainPerson]
const tableConfig = {
  enableMultiSelect: false,
  highlightSelect: true
}
let that
let myTableData = [[], [], [], []]
export default {
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(tableColunms[that.activeName], ({ prop }) => _.includes(visibleColProps, prop))
  },
  components: { headerTitle, screen, lazySelect },
  data() {
    return {
      exportLoading: false,
      columnsVisibleFilter: tableColunms['0'].filter((item) => item.label),
      columnsVisible: _.map(tableColunms['0'], ({ prop }) => prop),
      loading: false,
      activeName: '0',
      nowTab: '0',
      tableData: myTableData, //部门统计table数据
      tableColunms, //table列配置
      tableConfig, // table 配置
      tabs: ['培训总览统计', '培训课程统计', '培训考试统计', '参培人员明细'],
      params: {
        trainName: '',
        annualPlan: '',
        examName: '',
        courseName: '',
        dept: '',
        startTime: '',
        endTime: '',
        userName: ''
      },
      page: [],
      searchConfig: [perScoreParams, scoreDetailParams, studyParams, personParams],
      reqParam: {}
    }
  },
  created() {
    this.pageReset()
  },
  beforeCreate() {
    that = this
  },
  // beforeRouteLeave(to, from, next) {
  //   from.meta.$keepAlive = false // 禁用页面缓存
  //   next()
  // },
  activated() {
    this.$nextTick(() => {
      this.$refs.screen[0].reset()
      this.getQuery(true, 'clickQuery')
    })
  },
  methods: {
    pageReset() {
      this.page = []
      this.tabs.forEach(() => {
        this.page.push({ size: 10, total: 0, currentPage: 1 })
      })
    },
    showColunmsChange(data) {
      this.columnsVisible = data
    },
    getTrainPlanList(params) {
      return getTrainPlan(params)
    },
    dateChange(val) {
      this.params.startTime = val[0] || ''
      this.params.endTime = dateAdd(val[1]) || ''
    },
    orgChange({ orgId, userName, trainName, examName, courseName }) {
      this.params.dept = orgId || ''
      this.params.userName = userName || ''
      this.params.trainName = trainName || ''
      this.params.examName = examName || ''
      this.params.courseName = courseName || ''
    },
    exportTrainTrainersdetail({ size, start }) {
      exportTrainTrainersdetail({
        ...this.reqParam,
        size: `${size}`,
        start: `${start}`
      })
        .then((res) => {
          exportToExcel(res)
        })
        .finally(() => {
          this.exportLoading = false
        })
    },
    exportTrainExam({ size, start }) {
      exportTrainExam({
        ...this.reqParam,
        size: `${size}`,
        start: `${start}`
      })
        .then((res) => {
          exportToExcel(res)
        })
        .finally(() => {
          this.exportLoading = false
        })
    },
    exportTrainCourse({ size, start }) {
      exportTrainCourse({
        ...this.reqParam,
        size: `${size}`,
        start: `${start}`
      })
        .then((res) => {
          exportToExcel(res)
        })
        .finally(() => {
          this.exportLoading = false
        })
    },
    exportTrainOverview({ size, start }) {
      exportTrainOverview({
        ...this.reqParam,
        size: `${size}`,
        start: `${start}`
      })
        .then((res) => {
          exportToExcel(res)
        })
        .finally(() => {
          this.exportLoading = false
        })
    },
    exportData(obj) {
      this.exportLoading = true
      if (this.activeName === '0') {
        this.exportTrainOverview(obj)
      } else if (this.activeName === '1') {
        this.exportTrainCourse(obj)
      } else if (this.activeName === '2') {
        this.exportTrainExam(obj)
      } else {
        this.exportTrainTrainersdetail(obj)
      }
    },
    resetQuery() {
      if (this.activeName === '0') {
        this.params.annualPlan = ''
      }
    },
    getQuery(isPage, key) {
      if (key === 'clickQuery') {
        this.reqParam = JSON.parse(JSON.stringify(this.params))
      }
      if (this.activeName === '0') {
        this.getTabelData(isPage)
      } else if (this.activeName === '1') {
        this.getTrainCourse(isPage)
      } else if (this.activeName === '2') {
        this.getTrainExam(isPage)
      } else {
        this.getTrainTrainersdetail(isPage)
      }
    },
    pageChange() {
      this.getQuery()
    },
    sizeChange(val) {
      this.page[this.activeName].size = val
      this.getQuery(true)
    },
    clearParams() {
      this.params = {
        trainName: '',
        annualPlan: '',
        examName: '',
        courseName: '',
        dept: '',
        startTime: '',
        endTime: '',
        userName: ''
      }
      this.$refs.screen[0].reset()
    },
    handleClick() {
      if (this.nowTab == this.activeName) {
        return
      }
      this.nowTab = this.activeName
      ;(this.columnsVisibleFilter = tableColunms[this.activeName].filter((item) => item.label)),
        (this.columnsVisible = _.map(tableColunms[this.activeName], ({ prop }) => prop)),
        this.clearParams()
      this.getQuery(true, 'clickQuery')
    },
    getTrainTrainersdetail(isLoad) {
      if (isLoad) {
        this.$set(this.page[3], 'currentPage', 1)
      }
      this.loading = true
      getTrainTrainersdetail({
        pageSize: this.page[3].size,
        pageNo: this.page[3].currentPage,
        ...this.reqParam
      })
        .then(({ data, totalNum }) => {
          this.tableData[3] = data
          this.page[3].total = totalNum
        })
        .finally(() => {
          this.loading = false
        })
    },
    getTrainExam(isLoad) {
      if (isLoad) {
        this.$set(this.page[2], 'currentPage', 1)
      }
      this.loading = true
      getTrainExam({
        pageSize: this.page[2].size,
        pageNo: this.page[2].currentPage,
        ...this.reqParam
      })
        .then(({ data, totalNum }) => {
          this.tableData[2] = data
          this.page[2].total = totalNum
        })
        .finally(() => {
          this.loading = false
        })
    },
    getTrainCourse(isLoad) {
      if (isLoad) {
        this.$set(this.page[1], 'currentPage', 1)
      }
      this.loading = true
      getTrainCourse({
        pageSize: this.page[1].size,
        pageNo: this.page[1].currentPage,
        ...this.reqParam
      })
        .then(({ data, totalNum }) => {
          this.tableData[1] = data
          this.page[1].total = totalNum
        })
        .finally(() => {
          this.loading = false
        })
    },
    getTabelData(isLoad) {
      if (isLoad) {
        this.$set(this.page[0], 'currentPage', 1)
      }
      this.loading = true
      getTrainOveriew({
        pageSize: this.page[0].size,
        pageNo: this.page[0].currentPage,
        ...this.reqParam
      })
        .then(({ data, totalNum }) => {
          this.tableData[0] = data
          this.page[0].total = totalNum
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.cell:empty::before {
  content: '--';
  color: gray;
}
.integralStatistics {
  height: 100%;
  /deep/.basic-container--block {
    height: calc(100% - 92px);
    min-height: calc(100% - 92px);
  }
  /deep/.el-tabs__item {
    height: 36px;
    line-height: 1;
  }
  /deep/.el-tabs__header {
    margin: 0 0 16px;
  }
  ::v-deep .top-menu {
    height: 100%;
    margin: 0;
  }
}
</style>
