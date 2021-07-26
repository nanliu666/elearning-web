<template>
  <div class="integralStatistics">
    <header-title
      title="线上选修统计"
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
                  {{ row.isPass == 0 ? '否' : '是' }}
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
  getElectiveOverview,
  getElectiveDetail,
  exportElectiveOverview,
  exportElectiveDetail
} from '@/api/statistics/census'
import headerTitle from '../components/topTitle'
import screen from '../components/screen'
import { dateAdd, exportToExcel } from '@/util/util'
import { EMPLOYTYPE } from '@/const/configData'
// 积分明细配置
const onlineAll = [
  {
    label: '选修课程名称',
    minWidth: 160,
    fixed: 'left',
    prop: 'electiveName',
    isDisabled: true
  },
  {
    label: '课时（h)',
    minWidth: 150,
    prop: 'courseTime'
  },
  {
    label: '讲师',
    minWidth: 150,
    prop: 'lecturerName'
  },
  {
    label: '讲师类型',
    minWidth: 150,
    prop: 'lecturerType',
    formatter: (row) => {
      return EMPLOYTYPE[row.lecturerType] || row.lecturerType
    }
  },
  {
    label: '学习人数',
    minWidth: 150,
    prop: 'studyNum'
  },
  {
    label: '通过人数',
    minWidth: 150,
    prop: 'passNum'
  },
  {
    label: '评分',
    minWidth: 150,
    prop: 'scope'
  },
  {
    label: '评论人数',
    minWidth: 150,
    prop: 'commentNum'
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
    minWidth: 150,
    prop: 'createTime'
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
    label: '选修课程名称',
    minWidth: 150,
    prop: 'electiveName'
  },
  {
    label: '课时（h）',
    minWidth: 150,
    prop: 'courseTime'
  },
  {
    label: '学习时长（h）',
    minWidth: 150,
    prop: 'studyTime'
  },
  {
    label: '是否通过',
    minWidth: 150,
    prop: 'isPass',
    slot: true
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
    field: 'electiveName',
    label: '选修课程名称',
    data: '',
    options: [],
    config: { placeholder: '请输入选修课程名称' }
  }
]
const scoreDetailParams = [
  {
    type: 'input',
    field: 'electiveName',
    label: '选修课程名称',
    data: '',
    options: [],
    config: { placeholder: '请输入选修课程名称' }
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
      tabs: ['线上选修总览统计', '线上选修学习明细统计'],
      params: {
        electiveName: '',
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
    orgChange({ orgId, userName, electiveName }) {
      this.params.dept = orgId || ''
      this.params.userName = userName || ''
      this.params.electiveName = electiveName || ''
    },
    exportDetail({ size, start }) {
      exportElectiveDetail({
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
      exportElectiveOverview({
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
        electiveName: '',
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
      getElectiveDetail({
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
      getElectiveOverview({
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
