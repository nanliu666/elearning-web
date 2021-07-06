<template>
  <div>
    <common-table
      ref="table"
      :columns="columnsVisible"
      :config="tableConfig"
      :data="tableData"
      :loading="tableLoading"
      :page-config="tablePageConfig"
      :page="page"
      @current-page-change="handleCurrentPageChange"
      @page-size-change="handlePageSizeChange"
    >
      <template #examTime="{ row }">
        {{ row.examBeginTime }} - {{ row.examEndTime }}
      </template>
      <template #isPass="{ row }">
        {{ getPass(row) }}
      </template>
      <template #score="{ row }">
        {{ row.score ? row.score : '--' }}
      </template>
      <template #handler="{ row }">
        <el-button
          type="text"
          @click="toDetail(row)"
        >
          进入考试
        </el-button>
      </template>
    </common-table>
  </div>
</template>
<script>
const TABLE_COLUMNS = [
  {
    label: '考试名称',
    prop: 'examName',
    minWidth: 150
  },
  {
    label: '来源',
    prop: 'examSourceName',
    align: 'center',
    minWidth: 80
  },
  {
    label: '考试时间',
    prop: 'examTime',
    slot: true,
    align: 'center',
    minWidth: 240
  },
  {
    label: '参加次数',
    prop: 'examTimes',
    align: 'center',
    minWidth: 100
  },
  {
    label: '考试成绩',
    slot: true,
    align: 'center',
    prop: 'score',
    minWidth: 100
  },
  {
    label: '是否通过',
    prop: 'isPass',
    align: 'center',
    slot: true,
    minWidth: 100
  }
]
const TABLE_CONFIG = {
  rowKey: 'id',
  showHandler: true,
  defaultExpandAll: true,
  showIndexColumn: false,
  enablePagination: true,
  enableMultiSelect: false,
  handlerColumn: {
    minWidth: 80
  }
}
import moment from 'moment'
// import { getExamList } from '@/api/exam'
const PASS_TYPE = [
  {
    label: '全部',
    value: 0
  },
  {
    value: 1,
    label: '未通过'
  },
  {
    value: 2,
    label: '待发布'
  },
  {
    value: 3,
    label: '已通过'
  }
]
export default {
  name: 'LiveExam',
  data() {
    return {
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      queryInfo: {
        pageNo: 1,
        pageSize: 10,
        examTime: [],
        examName: '',
        isPass: 0,
        status: 0
      },
      tablePageConfig: {},
      columnsVisible: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tableLoading: false
    }
  },
  activated() {
    this.loadTableData()
  },
  methods: {
    getPass(row) {
      return _.find(PASS_TYPE, (item) => {
        return item.value === row.isPass
      }).label
    },
    // 去中间页面
    toDetail(row) {
      this.$router.push({ path: '/exam/middle', query: { id: row.batchId } })
    },
    /**
     * 处理页码改变
     */
    handleCurrentPageChange(param) {
      this.queryInfo.pageNo = param
      this.loadTableData()
    },
    /**
     * 处理页码大小更改
     */
    handlePageSizeChange(param) {
      this.queryInfo.pageSize = param
      this.queryInfo.pageNo = 1
      this.loadTableData()
    },
    // 加载函数
    async loadTableData() {
      if (this.tableLoading) return
      try {
        this.tableData = []
        this.tableLoading = true
        const examTimeTemp = _.cloneDeep(this.queryInfo.examTime)
        const examTime = _.map(examTimeTemp, (item) => {
          return moment(item).format('YYYY-MM-DD HH:mm:ss')
        })
        // eslint-disable-next-line no-unused-vars
        const params = _.assign(_.cloneDeep(this.queryInfo), { examTime })
        // let { totalNum, data } = await getExamList(params)
        this.tableLoading = false
        this.tableData = []
        this.page.total = 100
      } catch (error) {
        this.tableLoading = false
        this.$message.error(error.message)
        window.console.error(JSON.stringify(this.queryInfo))
      }
    }
  }
}
</script>
<style scoped lang="scss"></style>
