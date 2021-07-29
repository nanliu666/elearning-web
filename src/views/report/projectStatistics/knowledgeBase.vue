<template>
  <div class="integralStatistics">
    <header-title
      title="知识库统计"
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
                slot="uploadType"
                slot-scope="{ row }"
              >
                <div>
                  {{ row.uploadType == 1 ? '链接文件' : '本地文件' }}
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
  getKnowledgeOverview,
  getKnowledgeDetail,
  getKnowledgeOverviewExport,
  getKnowledgeDetailExport
} from '@/api/statistics/census'
import headerTitle from '../components/topTitle'
import screen from '../components/screen'
import { dateAdd, exportToExcel } from '@/util/util'
// 个人积分统计配置
const onlineAll = [
  {
    label: '知识名称',
    minWidth: 160,
    fixed: 'left',
    prop: 'knowledgeName',
    isDisabled: true
  },
  {
    label: '上传模式',
    minWidth: 150,
    prop: 'uploadType',
    slot: true
  },
  {
    label: '提供人',
    minWidth: 150,
    prop: 'provider'
  },
  {
    label: '提供时间',
    minWidth: 150,
    prop: 'provideTime'
  },
  {
    label: '提供人部门',
    minWidth: 150,
    prop: 'providerDept'
  },
  {
    label: '提供人岗位',
    minWidth: 150,
    prop: 'providerPosition'
  },
  {
    label: '浏览人数',
    minWidth: 150,
    prop: 'scanNum'
  },
  {
    label: '下载人数',
    minWidth: 150,
    prop: 'downloadNum'
  },
  {
    label: '下载次数',
    minWidth: 150,
    prop: 'downloads'
  },
  {
    label: '评论人数',
    minWidth: 150,
    prop: 'commentsNum'
  },
  {
    label: '评分',
    minWidth: 150,
    prop: 'scope'
  }
]
// 积分明细配置
const onlineStudy = [
  {
    label: '姓名',
    minWidth: 160,
    fixed: 'left',
    prop: 'username',
    isDisabled: true
  },
  {
    label: '用户编号',
    prop: 'workNo'
  },
  {
    label: '部门',
    minWidth: 150,
    prop: 'dept'
  },
  {
    label: '岗位',
    prop: 'position'
  },
  {
    label: '知识名称',
    prop: 'knowledgeName'
  },
  // {
  //   label: '浏览次数',
  //   minWidth: 100,
  //   prop: 'views'
  // },
  {
    label: '下载次数',
    minWidth: 100,
    prop: 'downloads'
  }
]
const perScoreParams = [
  {
    type: 'input',
    field: 'knowledgeName',
    label: '知识名称',
    data: '',
    options: [],
    config: { placeholder: '请输入知识名称' }
  }
]
const scoreDetailParams = [
  {
    type: 'input',
    field: 'knowledgeName',
    label: '知识名称',
    data: '',
    options: [],
    config: { placeholder: '请输入知识名称' }
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
      tableColunms, //table列配置
      tableConfig, // table 配置
      tabs: ['知识库总览统计', '知识库学习明细'],
      params: {
        knowledgeName: '',
        dept: '',
        startTime: '',
        endTime: '',
        userName: ''
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
    orgChange({ orgId, userName, knowledgeName }) {
      this.params.dept = orgId || ''
      this.params.userName = userName || ''
      this.params.knowledgeName = knowledgeName || ''
    },
    exportDetail({ size, start }) {
      getKnowledgeDetailExport({
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
      getKnowledgeOverviewExport({
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
    pageChange() {
      this.getQuery()
    },
    sizeChange(val) {
      this.page[this.activeName].size = val
      this.getQuery(true)
    },
    clearParams() {
      this.params = {
        knowledgeName: '',
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
    getScordDetail(isLoad) {
      if (isLoad) {
        this.$set(this.page[1], 'currentPage', 1)
      }
      this.loading = true
      getKnowledgeDetail({
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
      getKnowledgeOverview({
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
