<template>
  <div class="agreementSigned">
    <header-title
      title="外购统计"
      :total="page.total"
      :need-export-btn="true"
      :export-loading="exportLoading"
      @expoerdata="exportData"
    ></header-title>
    <basic-container block>
      <div class="table">
        <common-table
          :loading="loading"
          :data="tableData"
          :columns="columnsVisible | columnsFilter"
          :config="tableConfig"
          :page="page"
          @current-page-change="pageChange"
          @page-size-change="sizeChange"
        >
          <template #topMenu>
            <screen
              ref="screen"
              :columns-visible="columnsVisible"
              :columns-visible-filter="columnsVisibleFilter"
              :params="searchConfig"
              @dateChange="dateChange"
              @paramsChange="orgChange"
              @changeQuery="getQuery"
              @showColunmsChange="showColunmsChange"
            >
            </screen>
          </template>
        </common-table>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { getTrainOutbuy, exportTrainOutbuy } from '@/api/statistics/census'
import headerTitle from '../components/topTitle'
import screen from '../components/screen'
import { dateAdd, exportToExcel } from '@/util/util'
// 线上选修学习配置
const onlineStudy = [
  {
    label: '申请人',
    prop: 'userName',
    minWidth: 160,
    fixed: 'left',
    isDisabled: true
  },
  {
    label: '用户编码',
    minWidth: 100,
    prop: 'workNo'
  },
  {
    label: '部门',
    minWidth: 200,
    prop: 'orgName'
  },
  {
    label: '岗位',
    prop: 'position'
  },
  {
    label: '项目名称',
    prop: 'projectName',
    isDisabled: true
  },
  {
    label: '计划人数',
    minWidth: 120,
    prop: 'joinNum'
  },
  {
    label: '培训时间',
    minWidth: 200,
    prop: 'trainStartTime',
    formatter: (row) => {
      if (row.trainStartTime && row.trainEndTime) {
        return `${row.trainStartTime} ~ ${row.trainEndTime}`
      }
      return '--'
    }
  },
  {
    label: '培训地点',
    prop: 'address'
  },
  {
    label: '总课时（h）',
    minWidth: 130,
    prop: 'lessonPeriod'
  },
  {
    label: '费用预算（元）',
    minWidth: 130,
    prop: 'budget'
  },
  {
    label: '项目经理',
    minWidth: 150,
    prop: 'pm'
  },
  {
    label: '联系方式',
    minWidth: 120,
    prop: 'contactInfo'
  },
  {
    label: '申请时间',
    minWidth: 150,
    prop: 'createTime'
  }
]

const tableColunms = onlineStudy
const tableConfig = {
  enableMultiSelect: false,
  highlightSelect: true
}
export default {
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(tableColunms, ({ prop }) => _.includes(visibleColProps, prop))
  },
  components: { headerTitle, screen },
  data() {
    return {
      exportLoading: false,
      columnsVisibleFilter: tableColunms.filter((item) => item.label),
      columnsVisible: _.map(tableColunms, ({ prop }) => prop),
      loading: false,
      activeName: '0',
      tableData: [], //部门统计table数据
      tableColunms, //table列配置
      tableConfig, // table 配置
      page: { size: 10, total: 0, currentPage: 1 },
      formData: {
        orgId: 0,
        projectName: '',
        startTime: '',
        endTime: ''
      },
      searchConfig: [
        {
          type: 'input',
          field: 'name',
          label: '项目名称',
          data: '',
          options: [],
          config: { placeholder: '请输入项目名称' }
        }
      ],
      reqParam: {}
    }
  },
  activated() {
    this.$refs.screen.reset()
    this.getQuery(true, 'clickQuery')
  },
  methods: {
    showColunmsChange(data) {
      this.columnsVisible = data
    },
    dateChange(val) {
      this.formData.startTime = val[0] || ''
      this.formData.endTime = dateAdd(val[1]) || ''
    },
    orgChange({ orgId, name }) {
      this.formData.orgId = orgId || ''
      this.formData.projectName = name || ''
    },
    getQuery(isPage, key) {
      if (key === 'clickQuery') {
        this.reqParam = JSON.parse(JSON.stringify(this.formData))
      }
      this.getTabelData(isPage)
    },
    exportData({ size, start }) {
      this.exportLoading = true
      exportTrainOutbuy({
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
    pageChange() {
      this.getQuery()
    },
    sizeChange(val) {
      this.page.size = val
      this.getQuery(true)
    },
    getTabelData(isLoad) {
      if (isLoad) {
        this.$set(this.page, 'currentPage', 1)
      }
      this.loading = true
      getTrainOutbuy({
        pageSize: this.page.size,
        pageNo: this.page.currentPage,
        ...this.reqParam
      })
        .then(({ data, totalNum }) => {
          this.tableData = data
          this.page.total = totalNum
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
.agreementSigned {
  /deep/.basic-container--block {
    height: calc(100% - 92px);
    min-height: calc(100% - 92px);
  }
  ::v-deep .top-menu {
    height: 100%;
    margin: 0;
  }
}
</style>
