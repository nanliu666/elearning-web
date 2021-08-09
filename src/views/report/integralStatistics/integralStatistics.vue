<template>
  <div class="integralStatistics">
    <header-title
      title="积分统计"
      :need-export-btn="true"
      :export-loading="exportLoading"
      :total="page[activeName].total"
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
import { getOverview, getScord, exportScordDetail, exportOverview } from '@/api/statistics/census'
import headerTitle from '../components/topTitle'
import screen from '../components/screen'
import { dateAdd, exportToExcel } from '@/util/util'
// 个人积分统计配置
const onlineAll = [
  {
    label: '姓名',
    minWidth: 160,
    fixed: 'left',
    prop: 'userName',
    isDisabled: true
  },
  {
    label: '用户编号',
    prop: 'workNo'
  },
  {
    label: '所在部门',
    prop: 'orgName'
  },
  {
    label: '岗位',
    prop: 'position'
  },
  {
    label: '总积分',
    prop: 'totalScore'
  },
  {
    label: '可兑换积分',
    prop: 'activeScore'
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
    label: '账号',
    prop: 'account'
  },
  {
    label: '用户编号',
    prop: 'workNo'
  },
  {
    label: '部门',
    prop: 'orgName'
  },
  {
    label: '岗位',
    prop: 'position'
  },
  {
    label: '积分规则',
    prop: 'ruleName'
  },
  {
    label: '积分来源',
    prop: 'recodeResource'
  },
  {
    label: '积分值',
    prop: 'score'
  },
  {
    label: '获取时间',
    prop: 'createTime'
  }
]
const perScoreParams = [
  {
    type: 'input',
    field: 'name',
    label: '姓名',
    data: '',
    options: [],
    config: { placeholder: '请输入姓名' }
  }
]
const scoreDetailParams = [
  {
    type: 'input',
    field: 'name',
    label: '姓名',
    data: '',
    options: [],
    config: { placeholder: '请输入姓名' }
  },
  {
    type: 'input',
    field: 'score',
    label: '积分来源',
    data: '',
    options: [],
    config: { placeholder: '请输入规则名称' }
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
      tabs: ['个人积分统计', '积分明细'],
      params: {
        userName: '',
        orgId: '',
        startTime: '',
        endTime: '',
        recodeResource: ''
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
    orgChange({ orgId, name, score }) {
      this.params.orgId = orgId || ''
      this.params.userName = name || ''
      this.params.recodeResource = score || ''
    },
    exportDetail({ size, start }) {
      exportScordDetail({
        size: `${size}`,
        start: `${start}`,
        ...this.reqParam
      })
        .then((res) => {
          exportToExcel(res)
        })
        .finally(() => {
          this.exportLoading = false
        })
    },
    exportPer({ size, start }) {
      exportOverview({
        size: `${size}`,
        start: `${start}`,
        ...this.reqParam
      })
        .then((res) => {
          exportToExcel(res)
        })
        .finally(() => {
          this.exportLoading = false
        })
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
        userName: '',
        orgId: '',
        startTime: '',
        endTime: '',
        recodeResource: ''
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
    getScordDetail(isLoad) {
      if (isLoad) {
        this.$set(this.page[1], 'currentPage', 1)
      }
      this.loading = true
      getScord({
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
      getOverview({
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
