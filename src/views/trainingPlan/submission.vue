<template>
  <div class="submission">
    <page-header title="培训计划上报">
      <el-button
        slot="rightMenu"
        v-p="TRAINING_PLAN_ADD"
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
          <!--  计划状态,0-审核中 1-执行中 2-变更中 3-已完成 4-未提交 5-已拒绝 6-待审核 -->
          <el-row
            type="flex"
            justify="space-between"
          >
            <el-button
              v-if="[4, 5].includes(scope.row.status)"
              v-p="TRAINING_PLAN_EDIT"
              type="text"
              @click="editPlan(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="scope.row.status === 1"
              v-p="TRAINING_PLAN_CHANGE"
              type="text"
              @click="changePlan(scope.row)"
            >
              变更
            </el-button>
            <!-- <el-button
              v-if="[0, 2, 6].includes(scope.row.status)"
              v-p="TRAINING_PLAN_WITHDRAW"
              type="text"
              @click="withdrawPlan(scope.row)"
            >
              撤回
            </el-button> -->
            <el-button
              v-if="[1, 3, 4, 5].includes(scope.row.status)"
              v-p="TRAINING_PLAN_DELETE"
              type="text"
              @click="deletePlan(scope.row)"
            >
              删除
            </el-button>
          </el-row>
        </template>
      </common-table>
    </basic-container>
    <!-- 审批发起组件 -->
    <appr-submit
      ref="apprSubmit"
      category-id="13"
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
import { categoryMap } from '@/const/approve'
import ApprSubmit from '@/components/appr-submit/ApprSubmit'
import {
  TRAINING_PLAN_ADD,
  TRAINING_PLAN_EDIT,
  TRAINING_PLAN_CHANGE,
  TRAINING_PLAN_WITHDRAW,
  TRAINING_PLAN_DELETE
} from '@/const/privileges'
import {
  listTrainPlan,
  deleteTrainPlan,
  reCallTrainPlan,
  changeStatusToDelete
} from '@/api/trainingPlan/trainingPlan'
export default {
  name: 'Submission',
  components: {
    ApprSubmit
  },
  data() {
    return {
      formKey: 'trainPlan',
      columns: [
        {
          label: '年度培训计划',
          prop: 'planName',
          minWidth: 120,
          slot: true
        },
        {
          label: '提交人',
          prop: 'submitName'
        },
        {
          label: '公司',
          prop: 'orgName'
        },
        {
          label: '计划子项数',
          width: 100,
          prop: 'planDetailsNum'
        },
        {
          label: '培训人次',
          prop: 'traineeNumSum'
        },
        {
          label: '项目数量',
          prop: 'sessionsSum'
        },
        {
          label: '完成情况',
          prop: 'completed',
          formatter: (row) => {
            return row.completed ? row.completed + '%' : '--'
          }
        },
        {
          label: '状态',
          prop: 'status',
          formatter: (row) => {
            return {
              0: '审核中',
              1: '执行中',
              2: '变更中',
              3: '已完成',
              4: '未提交',
              5: '已拒绝',
              6: '审核中',
              7: '审核中', // 7-执行中待删除
              8: '审核中' // 8-已完成待删除
            }[row.status]
          }
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
      loading: false,
      auditData: {} // 审核当前数据
    }
  },
  computed: {
    TRAINING_PLAN_ADD: () => TRAINING_PLAN_ADD,
    TRAINING_PLAN_EDIT: () => TRAINING_PLAN_EDIT,
    TRAINING_PLAN_CHANGE: () => TRAINING_PLAN_CHANGE,
    TRAINING_PLAN_WITHDRAW: () => TRAINING_PLAN_WITHDRAW,
    TRAINING_PLAN_DELETE: () => TRAINING_PLAN_DELETE
  },
  activated() {
    this.initTrainPlanList()
  },
  methods: {
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
      await listTrainPlan(params)
        .then((res) => {
          this.tableData = res.data
          this.page.total = res.totalNum
        })
        .finally(() => {
          this.loading = false
        })
    },
    //   创建计划
    createPlan() {
      this.$router.push({
        path: '/trainingPlan/components/createPlan'
      })
    },
    // 编辑计划
    editPlan(row) {
      this.$router.push({
        path: '/trainingPlan/components/createPlan',
        query: { planId: row.id, tagName: '编辑计划' }
      })
    },
    // 变更计划
    changePlan(row) {
      this.$router.push({
        path: '/trainingPlan/components/createPlan',
        query: { planId: row.id, isTranslate: true }
      })
    },
    // 撤回审核
    withdrawPlan(row) {
      this.$confirm('该流程还未开始审批，撤回后状态将会变为未提交，是否继续撤回？', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await reCallTrainPlan({ planId: row.id }).then(() => {
          this.$message.success('撤回成功!')
          this.initTrainPlanList()
        })
      })
    },
    // 审批发起组件的弹窗确认回调
    handleSubmit() {
      this.submitAudit(this.auditData)
    },
    // 提交审批
    submitApprApply(res) {
      this.$refs.apprSubmit.submit({
        formId: res.planId,
        formData: res.apprPlanId,
        processName: categoryMap['13'],
        formKey: this.formKey
      })
    },
    // 提交审核
    submitAudit(row) {
      this.$refs.apprSubmit.validate().then(async () => {
        // 7-执行中待删除 8-已完成待删除
        await changeStatusToDelete({
          planId: row.id,
          status: { 1: '7', 3: '8' }[row.status]
        }).then(async (res) => {
          await this.submitApprApply(res)
          this.auditData = {}
          this.$message.success('提交成功!')
          this.initTrainPlanList()
        })
      })
    },
    // 删除计划
    deletePlan(row) {
      // 计划状态,0-审核中 1-执行中 2-变更中 3-已完成 4-未提交 5-已拒绝 6-待审核
      switch (row.status) {
        //   1、3状态要进入审批流,4、5直接删除
        case 1:
        case 3:
          this.$confirm(
            '删除后，将会进行审批流程，通过后所有计划内容将会消失，是否继续删除?',
            '提醒',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(async () => {
            //   调用审批流接口
            this.submitAudit(row)
            this.auditData = row
          })
          break
        //   直接删除
        case 4:
        case 5:
          this.$confirm('确认删除培训计划。', '提醒', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            await deleteTrainPlan({ planId: row.id }).then(() => {
              this.$message.success('删除成功!')
              this.initTrainPlanList()
            })
          })
          break
      }
    },
    // 跳转到培训计划详情
    goAnnualDetails(row) {
      this.$router.push({
        path: '/trainingPlan/components/annualDetails',
        query: { planId: row.id }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.submission {
  height: 100%;
  .basic-container--block {
    height: calc(100% - 92px);
    min-height: calc(100% - 92px);
  }
}
</style>
