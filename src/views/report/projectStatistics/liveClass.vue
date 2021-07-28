<template>
  <div class="integralStatistics">
    <header-title
      title="直播统计"
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
              :columns="columnsVisible | columnsFilter"
              :data="tableData[activeName]"
              :config="tableConfig"
              :page="page[activeName]"
              @current-page-change="pageChange"
              @page-size-change="sizeChange"
            >
              <template
                slot="uploadType"
                slot-scope="{ row }"
              >
                <div>
                  {{ row.uploadType === 0 ? '本地文件' : '链接文件' }}
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
                />
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
  getLiveOverview,
  getLiveDetail,
  getLiveExam,
  exportLiveOverview,
  exportLiveDetail,
  exportLiveExam
} from '@/api/statistics/census'
import headerTitle from '../components/topTitle'
import screen from '../components/screen'
import { dateAdd, exportToExcel } from '@/util/util'
// import { LIVE_STATUS } from '@/const/configData'
// 积分明细配置
const onlineAll = [
  {
    label: '直播名称',
    minWidth: 160,
    fixed: 'left',
    prop: 'liveName',
    isDisabled: true
  },
  // {
  //   label: '状态',
  //   minWidth: 150,
  //   prop: 'liveStatus',
  //   formatter: (row) => {
  //     return LIVE_STATUS[row.liveStatus]
  //   }
  // },
  {
    label: '直播讲师',
    minWidth: 150,
    prop: 'liveLecturer'
  },
  {
    label: '直播时间',
    minWidth: 150,
    prop: 'startTime',
    formatter: (row) => {
      return row.startTime && row.endTime ? `${row.startTime} ~ ${row.endTime}` : ''
    }
  },
  {
    label: '直播时长（h）',
    minWidth: 150,
    prop: 'liveDuration'
  },
  {
    label: '计划人数',
    prop: 'planNumber'
  },
  {
    label: '参与人数',
    prop: 'actualNumber'
  },
  // {
  //   label: 'pc端在线人数',
  //   minWidth: 150,
  //   prop: 'pcNumber'
  // },
  // {
  //   label: '移动端在线人数',
  //   minWidth: 150,
  //   prop: 'appNumber'
  // },
  {
    label: '创建人',
    minWidth: 150,
    prop: 'creator'
  },
  {
    label: '创建人部门',
    minWidth: 150,
    prop: 'dept'
  },
  {
    label: '创建时间',
    minWidth: 150,
    prop: 'createTime'
  }
]
//直播考试统计
const onlineTest = [
  {
    label: '姓名',
    minWidth: 160,
    fixed: 'left',
    prop: 'username',
    isDisabled: true
  },
  {
    label: '用户编码',
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
    label: '直播名称',
    prop: 'liveName'
  },
  {
    label: '考试名称',
    prop: 'examName'
  },
  {
    label: '考试时间',
    prop: 'startTime',
    formatter: (row) => {
      return `${row.startTime} ~ ${row.endTime}`
    }
  },
  {
    label: '考试次数',
    minWidth: 120,
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
    minWidth: 150,
    prop: 'isPass',
    formatter: (row) => {
      return row.isPass == '1' ? '是' : '否'
    }
  }
]

//直播参加明细
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
    label: '直播名称',
    prop: 'liveName'
  },
  {
    label: '累计观看时长（h）',
    minWidth: 160,
    prop: 'watchTime'
  },
  {
    label: '进入时间',
    minWidth: 150,
    prop: 'startTime'
  },
  {
    label: '离开时间',
    minWidth: 150,
    prop: 'endTime'
  },
  {
    label: '地区',
    prop: 'province'
  },
  {
    label: '城市',
    prop: 'city'
  }
]

const perScoreParams = [
  {
    type: 'input',
    field: 'liveName',
    label: '直播名称',
    data: '',
    options: [],
    config: { placeholder: '请输入直播名称' }
  }
]
const perTestParams = [
  {
    type: 'input',
    field: 'liveName',
    label: '直播名称',
    data: '',
    options: [],
    config: { placeholder: '请输入直播名称' }
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
const scoreDetailParams = [
  {
    type: 'input',
    field: 'liveName',
    label: '直播名称',
    data: '',
    options: [],
    config: { placeholder: '请输入直播名称' }
  },
  {
    type: 'input',
    field: 'userName',
    label: '姓名',
    data: '',
    options: [],
    config: { placeholder: '请输入姓名' }
  },
  {
    type: 'slot',
    field: 'isMerge'
  }
]
const tableColunms = [onlineAll, onlineTest, onlineStudy]
const tableConfig = {
  highlightSelect: true,
  enablePagination: true,
  enableMultiSelect: false
}
let that
let myTableData = [[], [], []]
export default {
  components: { headerTitle, screen },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(tableColunms[that.activeName], ({ prop }) => _.includes(visibleColProps, prop))
  },
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
      tabs: ['直播总览统计', '直播考试统计', '直播参加明细'],
      params: {
        examName: '',
        liveName: '',
        dept: '',
        startTime: '',
        endTime: '',
        userName: ''
      },
      page: [],
      searchConfig: [perScoreParams, perTestParams, scoreDetailParams],
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
    orgChange({ orgId, userName, liveName, examName }) {
      this.params.dept = orgId || ''
      this.params.userName = userName || ''
      this.params.liveName = liveName || ''
      this.params.examName = examName || ''
    },
    exportDetail({ size, start }) {
      exportLiveDetail({
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
      exportLiveOverview({
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

    //考试直播统计
    exportTest({ size, start }) {
      exportLiveExam({
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
        this.exportTest(obj)
      } else {
        this.exportDetail(obj)
      }
    },
    getQuery(isPage, key) {
      if (key === 'clickQuery') {
        this.reqParam = JSON.parse(JSON.stringify(this.params))
        if (this.activeName === '2') {
          this.reqParam.isMerge = this.$refs.screen[0].isMerge ? '1' : '0'
        }
      }
      if (this.activeName === '0') {
        this.getTabelData(isPage)
      } else if (this.activeName === '1') {
        this.getTestDetail(isPage)
      } else {
        this.getScordDetail(isPage)
      }
    },
    pageChange() {
      this.getQuery()
    },
    sizeChange(val) {
      this.page.size = val
      this.getQuery(true)
    },
    clearParams() {
      this.params = {
        examName: '',
        liveName: '',
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
    getTestDetail(isLoad) {
      if (isLoad) {
        this.$set(this.page[1], 'currentPage', 1)
      }
      this.loading = true
      getLiveExam({
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

    getScordDetail(isLoad) {
      if (isLoad) {
        this.$set(this.page[2], 'currentPage', 1)
      }
      this.loading = true
      getLiveDetail({
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
    getTabelData(isLoad) {
      if (isLoad) {
        this.$set(this.page[0], 'currentPage', 1)
      }
      this.loading = true
      getLiveOverview({
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
