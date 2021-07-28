<template>
  <div class="apply__container">
    <div class="apply__top">
      <div class="select__part">
        <el-select
          v-model="currentBatch"
          placeholder="请选择"
        >
          <el-option
            v-for="item in batchList"
            :key="item.batchId"
            :label="item.label"
            :value="item.batchId"
          >
          </el-option>
        </el-select>
      </div>
      <div class="batch__container">
        <div class="time">
          <span>考试时间：</span>
          <span>
            <span>{{ examConfigs.startTime }}</span>
            <span>-</span>
            <span>{{ examConfigs.endTime }}</span>
          </span>
        </div>
        <div class="location">
          <span>考试教室：</span>
          <span>{{ examConfigs.classroomName }}</span>
        </div>
      </div>
    </div>
    <common-table
      :columns="tableColumns"
      :config="tableConfig"
      :data="tableData"
      :loading="tableLoading"
      :page-config="tablePageConfig"
      :page="page"
      @current-page-change="handleCurrentPageChange"
      @page-size-change="handlePageSizeChange"
    >
      <template #name="{row}">
        <div
          class="ellipsis title"
          @click="jumpDetail(row)"
        >
          {{ row.name }}
        </div>
      </template>

      <template
        slot="multiSelectMenu"
        slot-scope="{ selection }"
      >
        <el-button
          v-if="!examDetail.autoEvaluate"
          type="text"
          icon="el-icon-sold-out"
          @click="approveBatch(selection, '1')"
        >
          批量同意
        </el-button>
        <el-button
          type="text"
          icon="el-icon-s-release"
          @click="approveBatch(selection, '2')"
        >
          批量拒绝
        </el-button>
      </template>
      <template #handler="{row}">
        <div class="menuClass">
          <el-button
            type="text"
            @click="approve(row.id, '1')"
          >
            同意
          </el-button>
          <el-button
            type="text"
            @click="approve(row.id, '2')"
          >
            拒绝
          </el-button>
        </div>
      </template>
    </common-table>
  </div>
</template>
<script>
const nzhcn = require('nzh/cn')
const TABLE_COLUMNS = [
  {
    label: '姓名',
    prop: 'userName',
    slot: true,
    minWidth: 150
  },
  {
    label: '手机号',
    prop: 'phonenum',
    slot: true,
    minWidth: 120
  },
  {
    label: '部门',
    prop: 'orgName',
    formatter: (row) => (row.orgName ? row.orgName : '无部门'),
    minWidth: 120
  },
  {
    label: '选择批次',
    prop: 'batchNumber',
    formatter: (row) => `第${nzhcn.encodeS(row.batchNumber + 1)}批`,
    minWidth: 120
  }
]
const TABLE_CONFIG = {
  rowKey: 'id',
  showIndexColumn: false,
  enablePagination: true,
  showHandler: true,
  enableMultiSelect: true,
  handlerColumn: {
    minWidth: 150
  }
}
import { examJoinList, getBatchNumber, approveExamJoin } from '@/api/examManage/schedule'
export default {
  name: 'ApplyList',
  data() {
    return {
      examConfigs: {},
      currentBatch: '',
      batchList: [],
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      // 请求参数
      queryInfo: {
        pageNo: 1,
        pageSize: 10,
        batchId: ''
      },
      tableLoading: false,
      tableData: [],
      tablePageConfig: {},
      tableColumns: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG
    }
  },
  watch: {
    currentBatch: {
      handler(val) {
        if (val) {
          this.getClassroomName()
          this.loadTableData()
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    // 批量审批
    approveBatch(select, status) {
      const ids = _.map(select, 'id')
      this.approve(ids, status)
    },
    /**
     * ids:待审批的id，支持批量操作
     * status需要进行的操作1-同意 2-拒绝
     */
    async approve(ids, status) {
      const params = { ids, status }
      await approveExamJoin(params)
      this.$message.success(`已${status == 1 ? '同意' : '拒绝'}`)
      this.loadTableData()
    },
    // 初始化数据
    async initData() {
      this.batchList = await getBatchNumber({ id: this.$route.query.id })
      this.currentBatch = _.get(this.batchList, '[0].batchId')
    },
    getClassroomName() {
      this.examConfigs = _.pick(_.find(this.batchList, { batchId: this.currentBatch }), [
        'startTime',
        'endTime',
        'classroomName'
      ])
    },
    // 跳转到用户详情
    jumpDetail(data) {
      this.$router.push({ path: '/system/userDetail', query: { userId: data.userId } })
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
      this.loadTableData()
    },
    // 搜索
    handleSearch(params) {
      this.queryInfo.pageNo = 1
      this.queryInfo = _.assign(this.queryInfo, params)
      this.loadTableData()
    },
    async loadTableData() {
      if (this.tableLoading) return
      try {
        this.tableData = []
        this.tableLoading = true
        this.queryInfo.batchId = this.currentBatch
        let { totalNum, data } = await examJoinList(this.queryInfo)
        this.tableData = data
        this.page.total = totalNum
      } catch (error) {
        this.$message.error(error.message)
      } finally {
        this.tableLoading = false
      }
    }
  }
}
</script>
<style scoped lang="scss">
.apply__container {
  .apply__top {
    display: flex;
    align-items: center;
    .select__part {
      max-width: 300px;
    }
    .batch__container {
      display: flex;
      align-items: center;
      margin-left: 20px;
      color: #575757;
      .time {
        position: relative;
        padding-right: 10px;
        margin-right: 10px;
        &::before {
          content: '';
          width: 1px;
          height: 80%;
          background-color: #575757;
          position: absolute;
          right: 0;
          top: 3px;
        }
      }
      .location {
      }
    }
  }
  /deep/ .top-menu {
    height: 0;
  }
}
</style>
