<template>
  <div>
    <page-header
      title="人员统计详情"
      show-back
    />
    <el-card class="statistics-card">
      <div class="card-top">
        <div class="top-left">
          <span class="left-box">
            <span class="label">用户编号：</span>
            <span class="value">124544</span>
          </span>
          <span class="left-box">
            <span class="label">用户名称：</span>
            <span class="value">张三</span>
          </span>
          <span class="left-box">
            <span class="label">所属部门：</span>
            <span class="value">研发中心/UCD中心</span>
          </span>
          <span class="left-box">
            <span class="label">累计时长：</span>
            <span class="value">5小时50分07分</span>
          </span>
        </div>
        <div class="top-right">
          <el-date-picker
            v-model="value1"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </div>
      </div>
      <common-table
        ref="table"
        :columns="tableColumns"
        :config="tableConfig"
        :data="tableData"
        :loading="tableLoading"
        :page="page"
        @current-page-change="handleCurrentPageChange"
        @page-size-change="handlePageSizeChange"
      />
    </el-card>
  </div>
</template>

<script>
let TABLE_COLUMNS = [
  {
    label: '直播名称',
    prop: 'examName',
    minWidth: 150
  },

  {
    label: '直播编号',
    prop: 'category',
    minWidth: 120
  },
  {
    label: '进入时间',
    slot: true,
    prop: 'examPattern',
    minWidth: 120
  },
  {
    label: '离开时间',
    prop: 'effectiveTime',
    minWidth: 120
  },
  {
    label: '累计时长',
    prop: 'examType',
    minWidth: 120
  }
]
const TABLE_CONFIG = {
  rowKey: 'id',
  showHandler: false,
  showIndexColumn: false,
  enablePagination: true,
  enableMultiSelect: false
}
import { getArrangeList } from '@/api/examManage/schedule'
export default {
  data() {
    return {
      value1: '',
      tableLoading: false,
      tableColumns: TABLE_COLUMNS,
      tableData: [],
      queryInfo: {
        type: 0 //状态:0-已发布，1-草稿箱
      },
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      tableConfig: TABLE_CONFIG
    }
  },
  activated() {
    this.loadTableData()
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
    next()
  },
  methods: {
    /**
     * 处理页码改变
     */
    handleCurrentPageChange(param) {
      this.queryInfo = _.assign(this.queryInfo, { pageNo: param })
      this.loadTableData()
    },
    /**
     * 处理页码大小更改
     */
    handlePageSizeChange(param) {
      this.queryInfo = _.assign(this.queryInfo, { pageSize: param })
      this.loadTableData()
    },
    // 加载函数
    async loadTableData() {
      if (this.tableLoading) {
        return
      }
      try {
        this.tableData = []
        this.tableLoading = true
        let { totalNum, data } = await getArrangeList(this.queryInfo)
        this.tableLoading = false
        this.tableData = data
        this.page.total = totalNum
      } catch (error) {
        this.tableLoading = false
        this.$message.error(error.message)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.statistics-card {
  .label {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: rgba(0, 11, 21, 0.45);
  }
  .value {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: rgba(0, 11, 21, 0.85);
  }
  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .top-left {
      width: 700px;
      display: flex;
      justify-content: space-between;
      flex-wrap: nowrap;
      .left-box {
        display: flex;
        flex-wrap: nowrap;
      }
    }
    .top-right {
      /deep/ .el-range-separator {
        padding: 0;
      }
    }
  }
}
</style>
