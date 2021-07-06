<template>
  <div class="agreementSigned">
    <header-title
      title="个人学习统计"
      :need-export-btn="true"
      :export-loading="exportLoading"
      :total="page.total"
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
          <template #userName="{ row }">
            <div
              class="ellipsis title"
              @click="handleView(row)"
            >
              {{ row.userName }}
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
import { getStudyUser, exportStudyUser } from '@/api/statistics/census'
import headerTitle from '../components/topTitle'
import screen from '../components/screen'
import { dateAdd, exportToExcel } from '@/util/util'
// 线上选修学习配置
const onlineStudy = [
  {
    label: '姓名',
    minWidth: 160,
    prop: 'userName',
    fixed: 'left',
    slot: true,
    isDisabled: true
  },
  {
    label: '用户编号',
    width: 100,
    prop: 'workNo'
  },
  {
    label: '部门',
    minWidth: 200,
    prop: 'orgName'
  },
  {
    label: '岗位',
    minWidth: 150,
    prop: 'position'
  },
  {
    label: '登录天数',
    prop: 'totalLogin'
  },
  {
    label: '总积分',
    prop: 'totalScore'
  },
  {
    label: '可兑换积分',
    minWidth: 150,
    prop: 'activeScore'
  },
  {
    label: '总学习时长（h）',
    minWidth: 150,
    prop: 'studyPeriod'
  },
  {
    label: '下载知识数',
    minWidth: 150,
    prop: 'countDownloadKnowledge'
  },
  {
    label: '上传知识数',
    minWidth: 150,
    prop: 'countUploadKnowledge'
  },
  {
    label: '参加培训数',
    minWidth: 150,
    prop: 'countTrain'
  },
  {
    label: '参加线上必修安排数',
    minWidth: 150,
    prop: 'countStudyPlan'
  },
  {
    label: '参加直播数',
    minWidth: 150,
    prop: 'countlivePlan'
  },
  {
    label: '参加考试数',
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
      params: {
        orgId: '0',
        startTime: '',
        endTime: '',
        userName: ''
      },
      searchConfig: [
        {
          type: 'input',
          field: 'name',
          label: '姓名',
          data: '',
          options: [],
          config: { placeholder: '请输入姓名' }
        }
      ],
      reqParam: {}
    }
  },
  activated() {
    this.$refs.screen.reset()
  },
  mounted() {
    this.getQuery(true, 'clickQuery')
  },
  methods: {
    showColunmsChange(data) {
      this.columnsVisible = data
    },
    dateChange(val) {
      this.params.startTime = val[0] || ''
      this.params.endTime = dateAdd(val[1]) || ''
    },
    orgChange({ orgId, name }) {
      this.params.orgId = orgId || ''
      this.params.userName = name || ''
    },
    getQuery(isPage, key) {
      if (key === 'clickQuery') {
        this.reqParam = JSON.parse(JSON.stringify(this.params))
      }
      this.getTabelData(isPage)
    },
    exportData({ size, start }) {
      this.exportLoading = true
      exportStudyUser({
        size: `${size}`,
        start: `${start}`,
        ...this.params
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
    //跳转用户
    handleView(row) {
      this.$router.push({
        path: '/system/userDetail',
        query: { userId: row.id }
      })
    },
    getTabelData(isLoad) {
      if (isLoad) {
        this.$set(this.page, 'currentPage', 1)
      }
      this.loading = true
      getStudyUser({
        pageSize: this.page.size,
        pageNo: this.page.currentPage,
        ...this.params
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
  height: 100%;
  /deep/.basic-container--block {
    height: calc(100% - 92px);
    min-height: calc(100% - 92px);
  }
  .title {
    color: $primaryColor;
    cursor: pointer;
  }
  ::v-deep .top-menu {
    height: 100%;
    margin: 0;
  }
}
</style>
