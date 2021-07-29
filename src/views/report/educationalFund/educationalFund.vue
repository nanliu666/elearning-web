<template>
  <div class="agreementSigned">
    <headerTitle
      title="经费统计"
      :total="page.total"
      :need-export-btn="true"
      :export-loading="exportLoading"
      @expoerdata="exportExcel"
    ></headerTitle>
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
import { getEductionBudget, exportEductionBudget } from '@/api/statistics/census'
import headerTitle from '../components/topTitle'
import screen from '../components/screen'
import { dateAdd, exportToExcel } from '@/util/util'
import { TRAINING_Type } from '@/const/configData'
// 线上选修学习配置
const onlineStudy = [
  {
    label: '项目名称',
    prop: 'projectName',
    minWidth: 160,
    fixed: 'left',
    slot: true,
    isDisabled: true
  },
  {
    label: '费用预算（元）',
    minWidth: 130,
    prop: 'budget'
  },
  {
    label: '使用费用（元）',
    minWidth: 130,
    prop: 'budgetUsed'
  },
  {
    label: '使用部门',
    minWidth: 150,
    prop: 'orgName'
  },
  {
    label: '经费类型名称',
    minWidth: 150,
    prop: 'catalogueName'
  },
  // {
  //   label: '培训人员类别',
  //   minWidth: 150,
  //   prop: 'trainObject'
  // },
  {
    label: '实际人数',
    prop: 'actualCount'
  },
  {
    label: '培训方式',
    prop: 'trainWay',
    formatter: (row) => {
      return TRAINING_Type[row.trainWay] || row.trainWay
    }
  },
  {
    label: '培训时间',
    prop: 'trainBeginTime',
    minWidth: 200,
    formatter: (row) => {
      if (row.trainBeginTime && row.trainEndTime) {
        return `${row.trainBeginTime} ~ ${row.trainEndTime}`
      }
      return '--'
    }
  },
  {
    label: '培训总学时（h）',
    minWidth: 160,
    prop: 'totalCourseTime'
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
        orgId: '',
        catalogueName: '',
        startTime: '',
        endTime: ''
      },
      searchConfig: [
        {
          type: 'input',
          field: 'name',
          label: '经费类型',
          data: '',
          options: [],
          config: { placeholder: '请输入类型名称' }
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
      (this.formData.startTime = val[0] || ''), (this.formData.endTime = dateAdd(val[1]) || '')
    },
    orgChange({ orgId, name }) {
      this.formData.orgId = orgId || ''
      this.formData.catalogueName = name || ''
    },
    getQuery(isPage, key) {
      if (key === 'clickQuery') {
        this.reqParam = JSON.parse(JSON.stringify(this.formData))
      }
      this.getTabelData(isPage)
    },
    exportExcel({ start, size }) {
      this.exportLoading = true
      exportEductionBudget({
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
      getEductionBudget({
        pageSize: this.page.size,
        pageNo: this.page.currentPage,
        ...this.reqParam
      })
        .then(({ data, totalNum }) => {
          this.tableData = data || []
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
