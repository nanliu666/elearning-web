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
    <!-- 审批单号 -->
    <template
      slot="apprNo"
      slot-scope="{ row }"
    >
      <el-button
        type="text"
        @click="toDetails(row)"
      >
        {{ row.apprNo }}
      </el-button>
    </template>
    <!-- 当前审批人 -->
    <template
      slot="approveUser"
      slot-scope="{ row }"
    >
      <span v-if="row.approveUser.length == 0"> - - </span>
      <span v-else>
        <span
          v-for="(item, index) in row.approveUser"
          :key="index"
        >{{ item.userName }}
          {{ index != row.approveUser.length - 1 ? ',' : '' }}
        </span>
      </span>
    </template>

    <!-- 状态 -->
    <template #status="{ row }">
      <span
        class="status-span"
        :style="{
          color: statusToText(row.status).color,
          backgroundColor: statusToText(row.status).backgroundColor
        }"
        v-text="statusToText(row.status).text"
      />
    </template>
    <template
      slot="handler"
      slot-scope="scope"
    >
      <el-button
        type="text"
        @click="againFn(scope.row)"
      >
        重新申请
      </el-button>
      <el-button
        type="text"
        @click="withdrawFn(scope.row)"
      >
        撤回
      </el-button>
      <el-button
        type="text"
        @click="toDetails(scope.row)"
      >
        查看
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
    prop: 'apprNo',
    slot: true
  },
  {
    label: '课程标题',
    prop: 'formTitle'
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
    prop: 'approveUser', //数组里面的userName   要遍历出来
    slot: true
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
        path: '/apprProcess/apprDetail',
        query: { apprNo: item.apprNo }
      })
    },
    // 重新申请
    againFn(obj) {
      // window.console.log(id)  compileCourse  establishCourse
      this.$confirm('您确定要对课程进行修改并重新申请?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$router.push({ path: '/course/establishCourse', query: { id: obj.formId } })
        })
        .catch(() => {})
    },
    // 撤回
    withdrawFn(row) {
      this.$confirm('撤回后课程将进入草稿箱，您确定要对课程进行撤回?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          cancel({ processInstanceId: row.processInstanceId }).then(() => {
            this.setPitch()
            this.$message({
              message: '撤回成功',
              type: 'success'
            })
          })
        })
        .catch(() => {})
    },
    // 获取数据
    async setPitch() {
      let res = await fulllist({ ...this.page, categoryId: '1', status: 'Approve' })
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
