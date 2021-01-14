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
    <!-- 当前状态 -->
    <template
      slot="userName"
      slot-scope="{ row }"
    >
      <span>{{ row.userName }}</span>
    </template>
    <template
      slot="handler"
      slot-scope="scope"
    >
      <el-button
        type="text"
        disabled
        @click="toDetails(scope.row.id)"
      >
        查看
      </el-button>
    </template>
  </common-table>
</template>

<script>
// import {
//   waitApproveList,
//   hasApproveList,
//   myApproveList,
//   ccApproveList
// } from '@/api/approvalCenter/approvalCenter'

// 表格属性
let TABLE_COLUMNS = [
  {
    label: '审批单号',
    prop: 'apprNo'
  },
  {
    label: '课程标题',
    prop: 'processName'
  },
  {
    label: '审核状态',
    prop: 'userName',
    slot: true
  },
  {
    label: '申请人',
    prop: 'applyTime'
  },
  {
    label: '申请时间',
    prop: 'status'
  },
  {
    label: '当前审批人',
    prop: 'approveUser' //数组里面的userName   要遍历出来
  },
  {
    label: '操作',
    prop: 'aprteUser'
  }
]
const TABLE_CONFIG = {
  handlerColumn: {
    width: 100
  },
  enablePagination: true,
  showHandler: false,
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
    this.setPitch(1)
  },
  created() {
    this.setPitch(1)
  },

  methods: {
    toDetails(id) {
      window.console.log(id)
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
