<template>
  <div class="info">
    <div class="student__list">
      <common-table
        v-if="_.get(data, 'authType', 'direct') === 'direct'"
        ref="table"
        :columns="columnsVisible"
        :config="tableConfig"
        :data="tableData"
        :loading="tableLoading"
        :page="page"
        @current-page-change="handleCurrentPageChange"
        @page-size-change="handlePageSizeChange"
      />
      <div v-else>
        <div>
          <span>学员总数：</span>
          <span>{{ data.traineeCount }}</span>
        </div>
        <div>学员登录平台即可观看，链接分享给任意人员可以进行观看</div>
        <!-- 需要验证码 -->
        <div v-if="data.authType === 'code'">
          <span>直播验证码：</span>
          <span>{{ data.authSecretOrCode }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const TABLE_COLUMNS = [
  {
    label: '用户编号',
    prop: 'userNo',
    minWidth: 150
  },
  {
    label: '姓名',
    prop: 'userName',
    minWidth: 120
  },
  {
    label: '所在部门',
    prop: 'orgName',
    minWidth: 120
  },
  {
    label: '手机号码',
    prop: 'phoneNum',
    minWidth: 120
  }
]
const TABLE_CONFIG = {
  rowKey: 'id',
  showIndexColumn: false,
  enablePagination: true,
  enableMultiSelect: false
}
import { getStudentList } from '@/api/live/editLive'
export default {
  name: 'LiveStudent',
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
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
  created() {
    this.loadTableData()
  },
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
