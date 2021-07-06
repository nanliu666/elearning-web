<template>
  <common-table
    ref="table"
    :columns="columnsVisible"
    :config="tableConfig"
    :data="tableData"
    :loading="tableLoading"
    :page="page"
    @current-page-change="handleCurrentPageChange"
    @page-size-change="handlePageSizeChange"
  ></common-table>
</template>
<script>
const TABLE_COLUMNS = [
  {
    label: '姓名',
    prop: 'userNo',
    minWidth: 150
  },
  {
    label: '手机号',
    prop: 'userName',
    minWidth: 120
  },
  {
    label: '所属部门',
    prop: 'orgName',
    minWidth: 120
  }
]
const TABLE_CONFIG = {
  rowKey: 'id',
  showIndexColumn: false,
  enablePagination: true,
  enableMultiSelect: true
}
import { getStudentList } from '@/api/live/editLive'
export default {
  name: 'LiveApply',
  data() {
    return {
      tableLoading: false,
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      queryInfo: {
        pageNo: 1,
        pageSize: 10,
        liveId: this.$route.query.liveId || '555'
      },
      columnsVisible: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: []
    }
  },
  created() {},
  methods: {
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
      this.loadTableData()
    },
    // 加载函数
    async loadTableData() {
      if (this.tableLoading) return
      try {
        this.tableData = []
        this.tableLoading = true
        let { totalNum, data } = await getStudentList(this.queryInfo)
        this.tableLoading = false
        this.tableData = data
        this.page.total = totalNum
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
