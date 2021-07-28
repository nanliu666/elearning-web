<template>
  <div class="integralStatistics">
    <header-title
      title="线上必修统计"
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
                  {{ row.isPass == 1 ? '是' : '否' }}
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
                >
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
  getCompulsoryOverview,
  getCompulsoryExam,
  getCompulsoryDetail,
  exportCompulsoryOverview,
  exportCompulsoryExam,
  exportCompulsoryDetail
} from '@/api/statistics/census'
import headerTitle from '../components/topTitle'
import screen from '../components/screen'
import { dateAdd, exportToExcel } from '@/util/util'
import { TRAIN_STATUS } from '@/const/configData'
// 积分明细配置
const onlineAll = [
  {
    label: '线上必修名称',
    minWidth: 160,
    fixed: 'left',
    prop: 'compulsoryName',
    isDisabled: true
  },
  {
    label: '状态',
    minWidth: 150,
    prop: 'compulsoryStatus',
    formatter: (row) => {
      return TRAIN_STATUS[row.compulsoryStatus] || row.compulsoryStatus
    }
  },
  {
    label: '学习时间',
    minWidth: 200,
    prop: 'startTime',
    formatter: (row) => {
      return `${row.startTime} ~ ${row.endTime}`
    }
  },
  {
    label: '计划学习人数',
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
    label: '积分',
    minWidth: 150,
    prop: 'score'
  },
  {
    label: '总时长（h）',
    minWidth: 150,
    prop: 'duration'
  },
  {
    label: '创建人',
    minWidth: 150,
    prop: 'creator'
  },
  {
    label: '创建人部门',
    minWidth: 150,
    prop: 'creatorDept'
  },
  {
    label: '创建时间',
    minWidth: 160,
    prop: 'createTime'
  }
]
// 个人积分统计配置
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
    label: '线上必修名称',
    minWidth: 150,
    prop: 'compulsoryName'
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
    label: '考试次数',
    minWidth: 150,
    prop: 'examTimes'
  },
  {
    label: '考试限时（min）',
    minWidth: 150,
    prop: 'examTime'
  },
  {
    label: '成绩（分）',
    minWidth: 150,
    prop: 'score'
  },
  {
    label: '是否通过',
    prop: 'isPass',
    slot: true
  }
]
// 个人积分统计配置
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
    label: '线上必修名称',
    minWidth: 150,
    prop: 'compulsoryName'
  },
  {
    label: '状态',
    minWidth: 150,
    prop: 'compulsoryStatus',
    formatter: (row) => {
      return TRAIN_STATUS[row.compulsoryStatus] || row.compulsoryStatus
    }
  },
  {
    label: '项目经理',
    minWidth: 150,
    prop: 'projectManager'
  },
  {
    label: '课程名称',
    minWidth: 150,
    prop: 'courseName'
  },
  {
    label: '实际学习时长（h)',
    minWidth: 150,
    prop: 'studyTime'
  },
  {
    label: '课程讲师',
    minWidth: 150,
    prop: 'lecturerName'
  },
  {
    label: '获得学分',
    minWidth: 150,
    prop: 'credit'
  },
  {
    label: '是否通过',
    prop: 'isPass',
    formatter: (row) => {
      return row.isPass.toLowerCase() == 'yes' ? '是' : row.isPass.toLowerCase() == 'no' ? '否' : ''
    }
  }
  // {
  //   label: '通过时间',
  //   minWidth: 150,
  //   prop: 'passTime'
  // }
]

const perScoreParams = [
  {
    type: 'input',
    field: 'compulsoryName',
    label: '线上必修',
    data: '',
    options: [],
    config: { placeholder: '请输入线上必修安排名称' }
  }
]
const scoreDetailParams = [
  {
    type: 'input',
    field: 'compulsoryName',
    label: '线上必修',
    data: '',
    options: [],
    config: { placeholder: '请输入线上必修名称' }
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
const studyParams = [
  {
    type: 'input',
    field: 'compulsoryName',
    label: '线上必修',
    data: '',
    options: [],
    config: { placeholder: '请输入线上必修名称' }
  },
  {
    type: 'input',
    field: 'userName',
    label: '姓名',
    data: '',
    options: [],
    config: { placeholder: '请输入姓名' }
  }
]
const tableColunms = [onlineAll, onlineExam, onlineStudy]
const tableConfig = {
  enableMultiSelect: false,
  highlightSelect: true
}
let that
let myTableData = [[], [], []]
export default {
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(tableColunms[that.activeName], ({ prop }) => _.includes(visibleColProps, prop))
  },
  components: { headerTitle, screen },
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
      tabs: ['线上必修总览统计', '线上必修考试统计', '线上必修学习明细统计'],
      params: {
        compulsoryName: '',
        examName: '',
        dept: '',
        startTime: '',
        endTime: '',
        userName: ''
      },
      page: [],
      searchConfig: [perScoreParams, scoreDetailParams, studyParams],
      reqParam: {}
    }
  },
  created() {
    this.pageReset()
  },
  beforeCreate() {
    that = this
  },
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
    dateChange(val) {
      this.params.startTime = val[0] || ''
      this.params.endTime = dateAdd(val[1]) || ''
    },
    orgChange({ orgId, userName, compulsoryName, examName }) {
      this.params.dept = orgId || ''
      this.params.userName = userName || ''
      this.params.compulsoryName = compulsoryName || ''
      this.params.examName = examName || ''
    },
    exportDetail({ size, start }) {
      exportCompulsoryDetail({
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
    exportExam({ size, start }) {
      exportCompulsoryExam({
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
    exportPer({ size, start }) {
      exportCompulsoryOverview({
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
        this.exportPer(obj)
      } else if (this.activeName === '1') {
        this.exportExam(obj)
      } else {
        this.exportDetail(obj)
      }
    },
    getQuery(isPage, key) {
      if (key === 'clickQuery') {
        this.reqParam = JSON.parse(JSON.stringify(this.params))
      }
      if (this.activeName === '0') {
        this.getTabelData(isPage)
      } else if (this.activeName === '1') {
        this.getScordDetail(isPage)
      } else {
        this.getCompulsoryDetail(isPage)
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
        compulsoryName: '',
        examName: '',
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
      this.columnsVisibleFilter = tableColunms[this.activeName].filter((item) => item.label)
      this.columnsVisible = _.map(tableColunms[this.activeName], ({ prop }) => prop)
      this.clearParams()
      this.getQuery(true, 'clickQuery')
    },
    getCompulsoryDetail(isLoad) {
      if (isLoad) {
        this.$set(this.page[2], 'currentPage', 1)
      }
      this.loading = true
      getCompulsoryDetail({
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
    getScordDetail(isLoad) {
      if (isLoad) {
        this.$set(this.page[1], 'currentPage', 1)
      }
      this.loading = true
      getCompulsoryExam({
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
      getCompulsoryOverview({
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
