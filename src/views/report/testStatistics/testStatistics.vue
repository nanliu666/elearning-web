<template>
  <div class="integralStatistics">
    <header-title
      title="考试统计"
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
                slot="examPattern"
                slot-scope="{ row }"
              >
                <div>
                  {{ EXAM_PATTERN[row.examPattern] }}
                </div>
              </template>

              <template
                slot="examSource"
                slot-scope="{ row }"
              >
                <div>
                  {{ myExamSource[row.examSource] }}
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
                  <template slot="frist">
                    <span class="labelscreen">{{ activeName === '1' ? '考试' : '考试名称' }}</span>
                    <lazy-select
                      v-model="params.examName"
                      :options-width="250"
                      :remote-method="getExamList"
                      :query-props="{ search: 'examName', page: 'pageNo', size: 'pageSize' }"
                      :props="{ value: 'id', label: 'examName' }"
                      @getSelected="examChange"
                    />
                  </template>
                  <template
                    v-if="activeName === '1'"
                    slot="second"
                  >
                    <span class="labelscreen">批次</span>
                    <el-select
                      v-model="params.batchNumber"
                      :disabled="!params.examName"
                      placeholder="请选择"
                      clearable
                    >
                      <el-option
                        v-for="val in batchNum"
                        :key="val.batchId"
                        :label="`第${parseInt(val.batchNumber) + 1}批次`"
                        :value="val.batchNumber"
                      >
                      </el-option>
                    </el-select>
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
import lazySelect from '../components/el-lazy-select'
// import { getExamList } from '@/api/examManage/schedule'
import {
  getExamOverview,
  getExam,
  exportExamoverview,
  exportExamdetail,
  getExamBatch,
  getExamList
} from '@/api/statistics/census'
import headerTitle from '../components/topTitle'
import screen from '../components/screen'
import { dateAdd, exportToExcel } from '@/util/util'
import { MYEXAMSOURCE, EXAM_PATTERN } from '@/const/configData'
// 个人积分统计配置
const onlineAll = [
  {
    label: '考试名称',
    minWidth: 160,
    fixed: 'left',
    prop: 'examName',
    isDisabled: true
  },
  {
    label: '考试方式',
    minWidth: 150,
    prop: 'examPattern',
    slot: true
  },
  {
    label: '考试来源',
    minWidth: 150,
    prop: 'examSource',
    slot: true
  },
  {
    label: '有效时间',
    minWidth: 160,
    prop: 'examBeginTime',
    formatter: (row) => {
      return row.examBeginTime && row.examEndTime ? `${row.examBeginTime} ~ ${row.examEndTime}` : ''
    }
  },
  {
    label: '项目名称',
    minWidth: 150,
    prop: 'projectName',
    isDisabled: true
  },
  {
    label: '考试时长（min)',
    minWidth: 150,
    prop: 'examTestTime'
  },
  {
    label: '应考人数',
    minWidth: 150,
    prop: 'examPainStudents'
  },
  {
    label: '实际考试人数',
    minWidth: 150,
    prop: 'examStudents'
  },
  {
    label: '平均分',
    minWidth: 150,
    prop: 'avgScore'
  },
  {
    label: '及格分数',
    minWidth: 150,
    prop: 'passScope'
  },
  {
    label: '通过人数',
    minWidth: 150,
    prop: 'passStudents'
  },
  {
    label: '通过率',
    minWidth: 150,
    prop: 'passRate',
    formatter: (row) => {
      return row.passRate === '' ? '' : `${row.passRate}%`
    }
  }
]
// 积分明细配置
const onlineStudy = [
  {
    label: '姓名',
    minWidth: 160,
    fixed: 'left',
    prop: 'userName',
    isDisabled: true
  },
  {
    label: '用户编号',
    minWidth: 150,
    prop: 'workNo'
  },
  {
    label: '部门',
    minWidth: 150,
    prop: 'orgName'
  },
  {
    label: '岗位',
    minWidth: 150,
    prop: 'position'
  },
  {
    label: '考试名称',
    minWidth: 150,
    prop: 'examName'
  },
  {
    label: '考试方式',
    minWidth: 150,
    prop: 'examPattern',
    slot: true
  },
  {
    label: '考试来源',
    minWidth: 150,
    prop: 'examSource',
    slot: true
  },
  {
    label: '批次',
    minWidth: 150,
    prop: 'batchNumber',
    formatter: (row) => {
      return row.batchNumber ? `第${parseInt(row.batchNumber) + 1}批次` : ''
    }
  },
  {
    label: '参考时间',
    minWidth: 150,
    prop: 'joinTime'
  },
  {
    label: '考试成绩',
    minWidth: 150,
    prop: 'score'
  },
  {
    label: '是否通过',
    minWidth: 150,
    prop: 'isPass',
    formatter: (row) => {
      return row.isPass == '1' ? '是' : '否'
    }
  },
  {
    label: '是否获得证书',
    minWidth: 150,
    prop: 'gainCertificate',
    formatter: (row) => {
      return row.gainCertificate == '1' ? '已获得' : '未获得'
    }
  }
]
const perScoreParams = [
  // {
  //   type: 'input',
  //   field: 'examName',
  //   label: '考试名称',
  //   data: '',
  //   options: [],
  //   config: { placeholder: '请输入考试名称' }
  // },
  {
    type: 'input',
    field: 'projectName',
    label: '项目名称',
    data: '',
    options: [],
    config: { placeholder: '请输入项目名称' }
  }
]
const scoreDetailParams = [
  {
    type: 'input',
    field: 'userName',
    label: '姓名',
    data: '',
    options: [],
    config: { placeholder: '请输入姓名' }
  }
]
const tableColunms = [onlineAll, onlineStudy]
const tableConfig = {
  enableMultiSelect: false,
  highlightSelect: true
}
let that
let myTableData = [[], []]
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
      myExamSource: MYEXAMSOURCE,
      EXAM_PATTERN,
      loading: false,
      options: [],
      activeName: '0',
      nowTab: '0',
      tableData: myTableData, //部门统计table数据
      tableColunms, //table列配置
      tableConfig, // table 配置
      tabs: ['考试总览统计', '考试参加明细'],
      params: {
        examName: '',
        userName: '',
        projectName: '',
        batchNumber: '',
        orgId: '',
        startTime: '',
        endTime: '',
        recodeResource: ''
      },
      page: [],
      searchConfig: [perScoreParams, scoreDetailParams],
      batchNum: [],
      newExamName: '',
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
    examChange(val) {
      if (!val.id) return
      this.newExamName = val.examName
      if (this.activeName === '0') return
      getExamBatch({
        examId: val.id
      }).then((res) => {
        this.batchNum = res || []
        this.params.batchNumber = ''
      })
    },
    getExamList(params) {
      return getExamList(params)
    },
    dateChange(val) {
      this.params.startTime = val[0] || ''
      this.params.endTime = dateAdd(val[1]) || ''
    },
    orgChange({ orgId, recodeResource, projectName, userName }) {
      this.params.orgId = orgId || ''
      this.params.recodeResource = recodeResource || ''
      this.params.projectName = projectName || ''
      this.params.userName = userName || ''
    },
    resetQuery() {
      this.params.examName = ''
      this.params.batchNumber = ''
    },
    getQuery(isPage, key) {
      if (key === 'clickQuery') {
        this.reqParam = JSON.parse(JSON.stringify(this.params))
        // if (this.activeName === '1') {
        //   this.reqParam.examName = this.params.examName ? this.newExamName : ''
        // }
        this.reqParam.examName = this.params.examName ? this.newExamName : ''
      }
      if (this.activeName === '0') {
        this.getTabelData(isPage)
      } else {
        this.getScordDetail(isPage)
      }
    },
    exportDetail({ size, start }) {
      exportExamdetail({
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
      exportExamoverview({
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
      } else {
        this.exportDetail(obj)
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
        examName: '',
        userName: '',
        projectName: '',
        batchNumber: '',
        orgId: '',
        startTime: '',
        endTime: '',
        recodeResource: ''
      }
      this.newExamName = ''
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
    getScordDetail(isLoad) {
      if (isLoad) {
        this.$set(this.page[1], 'currentPage', 1)
      }
      this.loading = true
      // const newParam = JSON.parse(JSON.stringify(this.params))
      // newParam.examName = this.params.examName ? this.newExamName : ''
      getExam({
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
      getExamOverview({
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
