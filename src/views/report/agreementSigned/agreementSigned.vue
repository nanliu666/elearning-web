<template>
  <div class="agreementSigned">
    <header-title
      title="协议统计"
      :total="page.total"
      :need-export-btn="true"
      :export-loading="exportLoading"
      @expoerdata="exportDatas"
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
          <template
            slot="signDate"
            slot-scope="{ row }"
          >
            <div>
              {{ row.signDate | formatTime }}
            </div>
          </template>
          <template
            slot="agreementStartTime"
            slot-scope="{ row }"
          >
            <div>
              {{ row.agreementStartTime | formatTime }}
            </div>
          </template>
          <template
            slot="agreementEndTime"
            slot-scope="{ row }"
          >
            <div>
              {{ row.agreementEndTime | formatTime }}
            </div>
          </template>
          <template
            slot="breakDate"
            slot-scope="{ row }"
          >
            <div>
              {{ row.breakDate | formatTime }}
            </div>
          </template>
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
import { getTrainAgreement, exportTrainAgreement } from '@/api/statistics/census'
import headerTitle from '../components/topTitle'
import screen from '../components/screen'
import { dateAdd, exportToExcel } from '@/util/util'
import moment from 'moment'
// 线上选修学习配置
const onlineStudy = [
  {
    label: '培训项目名称',
    minWidth: 160,
    prop: 'trainName',
    fixed: 'left',
    isDisabled: true
  },
  {
    label: '姓名',
    minWidth: 100,
    prop: 'userName',
    isDisabled: true
  },
  {
    label: '身份证',
    minWidth: 200,
    prop: 'idNo'
  },
  {
    label: '部门',
    minWidth: 150,
    prop: 'orgName'
  },
  {
    label: '岗位',
    prop: 'position'
  },
  {
    label: '签订日期',
    minWidth: 150,
    prop: 'signDate',
    slot: true
  },
  {
    label: '协议起始日期',
    minWidth: 150,
    prop: 'agreementStartTime',
    slot: true
  },
  {
    label: '协议终止日期',
    minWidth: 150,
    prop: 'agreementEndTime',
    slot: true
  },
  {
    label: '服务年限',
    prop: 'serviceYear'
  },
  {
    label: '人均费用（元）',
    minWidth: 150,
    prop: 'avgCost'
  },
  {
    label: '违约金',
    minWidth: 150,
    prop: 'breakAmount'
  },
  {
    label: '违约日期',
    minWidth: 150,
    prop: 'breakDate',
    slot: true
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
      _.filter(tableColunms, ({ prop }) => _.includes(visibleColProps, prop)),
    formatTime(val) {
      if (val) {
        let date = ''
        if (val.includes('T')) {
          date = val.replace(/T/g, ' ')
        } else {
          date = Number(val)
        }
        return moment(date).format('YYYY-MM-DD') //hh:mm:ss
      }
      return '--'
    }
  },
  components: { headerTitle, screen },
  data() {
    return {
      exportLoading: false,
      columnsVisibleFilter: tableColunms.filter((item) => item.label),
      columnsVisible: _.map(tableColunms, ({ prop }) => prop),
      loading: false,
      tableData: [], //部门统计table数据
      tableColunms, //table列配置
      tableConfig, // table 配置
      page: { size: 10, total: 0, currentPage: 1 },
      formData: {
        orgId: 0,
        trainName: '',
        startTime: '',
        endTime: ''
      },
      searchConfig: [
        {
          type: 'input',
          field: 'name',
          label: '培训名称',
          data: '',
          options: [],
          config: { placeholder: '请输入项目名称搜索' }
        }
      ],
      reqParam: {}
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   from.meta.$keepAlive = false // 禁用页面缓存
  //   next()
  // },
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
      this.formData.trainName = name || ''
    },
    getQuery(isPage, key) {
      if (key === 'clickQuery') {
        this.reqParam = JSON.parse(JSON.stringify(this.formData))
      }
      this.getTabelData(isPage)
    },
    exportDatas({ start, size }) {
      this.exportLoading = true
      exportTrainAgreement({
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
    //获取列表数据
    getTabelData(isLoad) {
      if (isLoad) {
        this.$set(this.page, 'currentPage', 1)
      }
      this.loading = true
      getTrainAgreement({
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
