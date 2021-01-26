<template>
  <!-- 第一页 -->
  <common-table
    ref="table"
    :columns="columnsVisible | columnsFilter"
    :config="tableConfig"
    :data="tableData"
    :page-config="tablePageConfig"
    :page="page"
    @current-page-change="handleCurrentPageChange"
    @page-size-change="handlePageSizeChange"
  >
    <!-- 课程标题 -->
    <template slot="processName" slot-scope="{ row }">
      <el-button type="text" @click="toDetails(row)">
        {{ row.processName || '课程标题' }}
      </el-button>
    </template>

    <!-- 状态 -->
    <template #status="{row}">
      <span
        class="status-span"
        :style="{
          color: statusToText(row.status).color,
          backgroundColor: statusToText(row.status).backgroundColor
        }"
        v-text="statusToText(row.status).text"
      />
    </template>
    <template slot="handler" slot-scope="scope">
      <el-button type="text" @click="againFn(scope.row.id)">
        重新申请
      </el-button>
      <el-button type="text" @click="withdrawFn(scope.row)">
        撤回
      </el-button>
    </template>
  </common-table>
</template>

<script>
import { fulllist, cancel } from '@/api/approvalCenter/approvalCenter'
import { STATUS_TO_TEXT } from '@/const/approve'
// 表格属性
let TABLE_COLUMNS = [
  {
    label: '审批单号',
    prop: 'apprNo'
  },
  {
    label: '课程标题',
    prop: 'processName',
    slot: true
  },
  {
    label: '审核状态',
    prop: 'status',
    slot: true
  },
  {
    label: '申请人',
    prop: 'userName'
  },
  {
    label: '申请时间',
    prop: 'applyTime'
  },
  {
    label: '当前审批人',
    prop: 'approveUser' //数组里面的userName   要遍历出来
  }
]
const TABLE_CONFIG = {
  handlerColumn: {
    width: 200
  },
  enablePagination: true,
  showHandler: true,
  showIndexColumn: false
}
const TABLE_PAGE_CONFIG = {}
export default {
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      searchInput: '',
      pitch: 1,
      options: [
        {
          value: 1,
          label: '全部'
        },
        {
          value: 2,
          label: '已通过'
        },
        {
          value: 3,
          label: '已拒绝'
        }
      ],
      value: '',

      // 默认选中所有列
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tablePageConfig: TABLE_PAGE_CONFIG,
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    }
  },

  activated() {
    this.setPitch()
  },
  // created() {
  //   this.setPitch()
  // },
  methods: {
    statusToText(status) {
      return STATUS_TO_TEXT[status]
    },
    // 去详情
    toDetails(item) {
      this.$router.push({
        path: '/approvalCenter/details',
        query: { id: item.formId, apprNo: item.apprNo }
      })
    },
    // 重新申请
    againFn(id) {
      window.console.log(id)
    },
    // 撤回
    withdrawFn(row) {
      cancel({ processInstanceId: row.processInstanceId }).then(() => {
        this.$message({
          message: '撤回成功',
          type: 'success'
        })
      })
    },
    // 获取数据
    async setPitch() {
      let res = await fulllist({ ...this.page, categoryId: '1', status: 'Approve' })
      window.console.log(res)
      this.tableData = res.data
      this.page.total = res.totalNum

      this.$emit('titleTotalNum', res.totalNum)
    },

    //  处理页码改变
    handleCurrentPageChange(param) {
      this.page.pageNo = param
      this.setPitch(this.pitch)
    },
    handlePageSizeChange(param) {
      this.page.pageSize = param
      this.setPitch(this.pitch)
    }
  }
}
</script>

<style></style>
