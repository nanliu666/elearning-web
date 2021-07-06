<template>
  <div class="development">
    <page-header title="培训计划制定">
      <el-button
        slot="rightMenu"
        v-p="TRAINING_DEVELOPMENT_ADD"
        type="primary"
        size="medium"
        @click="createPlan"
      >
        创建计划
      </el-button>
    </page-header>
    <!-- 数据表格 -->
    <basic-container block>
      <common-table
        ref="table"
        v-loading="loading"
        :columns="columns"
        :config="tableConfig"
        :data="tableData"
        :page-config="tablePageConfig"
        :page="page"
        @current-page-change="handleCurrentPageChange"
        @page-size-change="handlePageSizeChange"
      >
        <template
          slot="planName"
          slot-scope="{ row }"
        >
          <el-button
            type="text"
            @click="goAnnualDetails(row)"
          >
            {{ row.planName }}
          </el-button>
        </template>
        <template
          slot="handler"
          slot-scope="scope"
        >
          <el-button
            v-p="TRAINING_DEVELOPMENT_EDIT"
            type="text"
            @click="editPlan(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            v-p="TRAINING_DEVELOPMENT_DELETE"
            type="text"
            @click="deletePlan(scope.row)"
          >
            删除
          </el-button>
        </template>
      </common-table>
    </basic-container>
  </div>
</template>

<script>
import {
  TRAINING_DEVELOPMENT_ADD,
  TRAINING_DEVELOPMENT_EDIT,
  TRAINING_DEVELOPMENT_DELETE
} from '@/const/privileges'
import { trainPlanPreList, deleteTrainPlanPre } from '@/api/trainingPlan/trainingPlan'
export default {
  name: 'Development',
  data() {
    return {
      columns: [
        {
          label: '年度培训计划',
          prop: 'planName',
          minWidth: 120,
          slot: true
        },
        {
          label: '创建人',
          prop: 'submitName'
        },
        {
          label: '部门',
          prop: 'orgName'
        },
        {
          label: '计划子项数',
          prop: 'planDetailsNum'
        },
        {
          label: '培训人次',
          prop: 'traineeNumSum'
        },
        {
          label: '项目数量',
          prop: 'sessionsSum'
        }
      ],
      tableConfig: {
        handlerColumn: {
          width: 100
        },
        enablePagination: true,
        showHandler: true,
        showIndexColumn: false
      },
      tableData: [],
      tablePageConfig: {
        currentPage: 1
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      loading: false
    }
  },
  computed: {
    TRAINING_DEVELOPMENT_ADD: () => TRAINING_DEVELOPMENT_ADD,
    TRAINING_DEVELOPMENT_EDIT: () => TRAINING_DEVELOPMENT_EDIT,
    TRAINING_DEVELOPMENT_DELETE: () => TRAINING_DEVELOPMENT_DELETE
  },
  activated() {
    this.initTrainPlanList()
  },
  methods: {
    //   创建培训
    createPlan() {
      this.$router.push({
        path: '/trainingPlan/components/createPlan',
        query: { development: true }
      })
    },
    //  处理页码改变
    handleCurrentPageChange(param) {
      this.page.pageNo = param
      this.initTrainPlanList()
    },
    handlePageSizeChange(param) {
      this.page.pageSize = param
      this.initTrainPlanList()
    },
    // 初始化培训上报列表
    async initTrainPlanList() {
      this.loading = true
      let params = {
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize
      }
      await trainPlanPreList(params)
        .then((res) => {
          this.tableData = res.data
          this.page.total = res.totalNum
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 编辑计划
    editPlan(row) {
      this.$router.push({
        path: '/trainingPlan/components/createPlan',
        query: { planId: row.id, development: true, tagName: '编辑计划' }
      })
    },
    // 删除计划
    deletePlan(row) {
      this.$confirm('确认删除吗？', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await deleteTrainPlanPre({ planId: row.id }).then(() => {
          this.$message.success('删除成功!')
          this.initTrainPlanList()
        })
      })
    },
    // 跳转到培训计划详情
    goAnnualDetails(row) {
      this.$router.push({
        path: '/trainingPlan/components/annualDetails',
        query: { planId: row.id, development: true }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.development {
}
</style>
