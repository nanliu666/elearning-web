<template>
  <div class="integralStatistics">
    <header-title
      title="部门学习统计"
      :need-export-btn="true"
      :export-loading="exportLoading"
      :total="page[activeName].total"
      :change-page="200"
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
                  {{ row.examPattern === 'general' ? '线上考试' : '线下考试' }}
                </div>
              </template>
              <template #topMenu>
                <screen
                  ref="screen"
                  :is-query-disabled="true"
                  :disabled-date="true"
                  :query-data="params"
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
  getStudyList,
  exportStudyLsit,
  getStudyDaily,
  exportStudyDaily
} from '@/api/statistics/census'
import headerTitle from '../components/topTitle'
import screen from '../components/screen'
import { dateAdd, exportToExcel } from '@/util/util'
// 个人积分统计配置
const onlineAll = [
  {
    label: '部门名称',
    minWidth: 200,
    fixed: 'left',
    prop: 'orgName',
    isDisabled: true
  },
  {
    label: '部门人数',
    minWidth: 150,
    prop: 'orgUserCount'
  },
  {
    label: '学习人数',
    minWidth: 150,
    prop: 'countStudy'
  },
  {
    label: '总学习时长（h）',
    minWidth: 150,
    prop: 'studyPeriod'
  },
  {
    label: '总积分',
    minWidth: 150,
    prop: 'totalScore'
  },
  {
    label: '培训数',
    minWidth: 150,
    prop: 'countTrain'
  },
  {
    label: '线上必修安排数',
    minWidth: 150,
    prop: 'countStudyPlan'
  },
  {
    label: '选修课数',
    minWidth: 150,
    prop: 'countElectiveCourse'
  },
  {
    label: '参加直播数',
    minWidth: 150,
    prop: 'countlivePlan'
  },
  {
    label: '上传知识数',
    minWidth: 150,
    prop: 'countUploadKnowledge'
  },
  {
    label: '考试数',
    minWidth: 150,
    prop: 'countExam'
  },
  {
    label: '提交作业数',
    minWidth: 150,
    prop: 'countJob'
  },
  {
    label: '填写问卷数',
    minWidth: 150,
    prop: 'countAsq'
  }
]
// 积分明细配置
const onlineStudy = [
  {
    label: '部门名称',
    minWidth: 200,
    fixed: 'left',
    prop: 'orgName',
    isDisabled: true
  },
  {
    label: '日期',
    minWidth: 150,
    prop: 'date'
  },
  {
    label: '部门人数',
    minWidth: 150,
    prop: 'orgUserCount'
  },
  {
    label: '学习人数',
    minWidth: 150,
    prop: 'countStudy'
  },
  {
    label: '总学习时长（h）',
    minWidth: 150,
    prop: 'studyPeriod'
  },
  {
    label: '总积分',
    minWidth: 150,
    prop: 'totalScore'
  },
  {
    label: '培训数',
    minWidth: 150,
    prop: 'countTrain'
  },
  {
    label: '线上必修安排数',
    minWidth: 150,
    prop: 'countStudyPlan'
  },
  {
    label: '通过选修数',
    minWidth: 150,
    prop: 'countElectiveCourse'
  },
  {
    label: '参加直播数',
    minWidth: 150,
    prop: 'countlivePlan'
  },
  {
    label: '上传知识数',
    minWidth: 150,
    prop: 'countUploadKnowledge'
  },
  {
    label: '考试数',
    minWidth: 150,
    prop: 'countExam'
  },
  {
    label: '提交作业数',
    minWidth: 150,
    prop: 'countJob'
  },
  {
    label: '填写问卷数',
    minWidth: 150,
    prop: 'countAsq'
  }
]
const perScoreParams = []
const scoreDetailParams = []
const tableColunms = [onlineAll, onlineStudy]
const tableConfig = {
  enableMultiSelect: false,
  highlightSelect: true,
  emptyText: '请先选择统计条件，查询数据'
}
let that
let myTableData = [[], []]
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
      tableConfig, // table 配置
      tabs: ['部门统计', '部门学习趋势'],
      params: {
        orgId: '',
        startTime: '',
        endTime: ''
      },
      page: [],
      searchConfig: [perScoreParams, scoreDetailParams],
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
      // if (this.activeName == '0') {
      //   this.getQuery(true, 'clickQuery')
      // }
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
      if (val[0] && val[1]) {
        const d = new Date(val[0].replace(/-/g, '/')).getTime()
        const d2 = new Date(val[1].replace(/-/g, '/')).getTime()
        const t = (d2 - d) / 1000 / 3600 / 24
        if (t > 180) {
          val = ['', '']
          this.$refs.screen[0].paramsList.requireOptions.map((j) => {
            if (j.type === 'dataPicker') {
              j.data = ''
            }
          })
          this.$message.error('时间可选最大范围为180天,请重新选择。')
        }
      }
      this.params.startTime = val[0] || ''
      this.params.endTime = dateAdd(val[1]) || ''
    },
    orgChange({ orgId }) {
      this.params.orgId = orgId || ''
    },
    getQuery(isPage, key) {
      if (key === 'clickQuery') {
        this.reqParam = JSON.parse(JSON.stringify(this.params))
      }
      if (this.activeName === '0') {
        this.getTabelData(isPage)
      } else {
        this.getScordDetail(isPage)
      }
    },
    exportStudyDaily({ size, start }) {
      exportStudyDaily({
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
    exportStudyLsit({ size, start }) {
      exportStudyLsit({
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
        this.exportStudyLsit(obj)
      } else {
        this.exportStudyDaily(obj)
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
      this.tableData = []
      this.params = {
        orgId: '',
        startTime: '',
        endTime: ''
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
      this.pageReset()
      // if (this.activeName == '0') {
      //   this.getQuery(true, 'clickQuery')
      // }
    },
    getScordDetail(isLoad) {
      if (isLoad) {
        this.$set(this.page[1], 'currentPage', 1)
      }
      this.loading = true
      getStudyDaily({
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
      getStudyList({
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
