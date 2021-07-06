<template>
  <div class="subitemsPlanDetails">
    <!-- 数据表格 -->
    <el-table
      ref="subTable"
      :data="tableData"
      style="margin-top: 20px"
      default-expand-all
    >
      <!-- 嵌套表格 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table
            ref="nestedTable"
            :data="scope.row.trains"
            class="nestedTable"
          >
            <el-table-column
              label="培训名称"
              prop="trainName"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="goTrainDetails(scope.row)"
                >
                  {{ scope.row.trainName }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="培训类别"
              prop="trainScope"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ { inside: '内训', outer: '外训' }[scope.row.trainScope] }}
              </template>
            </el-table-column>
            <el-table-column
              label="培训状态"
              prop="status"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ { 1: '未开始', 2: '进行中', 3: '已结束' }[scope.row.status] }}
              </template>
            </el-table-column>
            <el-table-column
              label="培训时间"
              prop="trainTime"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{
                  scope.row.trainBeginTime.slice(0, 10) + '-' + scope.row.trainEndTime.slice(0, 10)
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="100"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="cancelAssociated(scope.row)"
                >
                  取消关联
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        label="序号"
        type="index"
        width="80"
      >
        <template slot-scope="scope">
          {{ scope.$index >= 9 ? scope.$index + 1 : '0' + (scope.$index + 1) }}
        </template>
      </el-table-column>
      <el-table-column
        label="培训项目"
        prop="trainProject"
        show-overflow-tooltip
        width="150"
      >
        <template slot-scope="scope">
          <el-tooltip
            effect="dark"
            :content="scope.row.trainProject"
            placement="top"
            :manual="!(scope.row.trainProject.length > 8)"
          >
            <el-button
              type="text"
              @click="goChildScheme(scope.row)"
            >
              {{
                scope.row.trainProject.length > 8
                  ? scope.row.trainProject.slice(0, 8) + '...'
                  : scope.row.trainProject
              }}
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="计划性质"
        prop="planFeature"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ planFeatureTemp[scope.row.planFeature] }}
        </template>
      </el-table-column>
      <el-table-column
        label="培训人数"
        prop="traineeNum"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="项目数量"
        prop="sessions"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ (scope.row.numOfDone || 0) + '/' + (scope.row.sessions || 0) }}
        </template>
      </el-table-column>
      <el-table-column
        label="费用预算(元)"
        prop="budget"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.budget || 0 }}
        </template>
      </el-table-column>
      <el-table-column
        label="培训日期"
        prop="trainingDate"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{
            scope.row.trainEnd
              ? scope.row.trainStart + '月-' + scope.row.trainEnd + '月'
              : scope.row.trainStart + '月'
          }}
        </template>
      </el-table-column>
      <el-table-column
        label="实施部门"
        prop="trainOrgName"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="计划等级"
        prop="trainLevel"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ trainLevelTemp[scope.row.trainLevel] }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="80"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="associatedTraining(scope.row)"
          >
            关联培训
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 关联培训 -->
    <associated-training
      ref="associatedTraining"
      @initAssociated="initAssociated"
    ></associated-training>
  </div>
</template>

<script>
import { cancelTrainRel } from '@/api/trainingPlan/trainingPlan'
import associatedTraining from './associatedTraining'
export default {
  name: 'SubitemsPlanDetails',
  components: {
    associatedTraining
  },
  data() {
    return {
      tableData: [],
      planFeatureTemp: {
        //   计划性质
        0: '新增',
        1: '计划中',
        2: '已取消'
      },
      trainLevelTemp: {
        // 计划等级
        1: '公司级',
        2: '单位级',
        3: '部门级'
      },
      month: ''
    }
  },
  methods: {
    // 跳转到子计划项
    goChildScheme(row) {
      this.$router.push({
        path: '/trainingPlan/components/viewPlanSubitems',
        query: { id: row.planDetailId, year: row.year }
      })
    },
    // 跳转培训详情
    goTrainDetails(row) {
      this.$router.push({
        path: '/training/trainingDetail',
        query: { id: row.trainId, status: row.status }
      })
    },
    // 关联培训
    associatedTraining(row) {
      this.$refs.associatedTraining.month = this.month
      this.$refs.associatedTraining.planDetailId = row.planDetailId
      this.$refs.associatedTraining.getScheduleList()
      this.$refs.associatedTraining.visible = true
    },
    // 取消培训关联
    cancelAssociated(row) {
      this.$confirm(
        '取消后，培训将不会关联到计划子项，月度及年度完成度有可能会发生变更。',
        '提醒',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '执行中...'
              await cancelTrainRel({ id: row.relId })
                .then(() => {
                  this.$message.success('取消成功!')
                  this.$emit('initTable')
                })
                .finally(() => {
                  instance.confirmButtonLoading = false
                  done()
                })
            } else {
              done()
            }
          }
        }
      )
    },
    initAssociated() {
      this.$emit('initTable')
    }
  }
}
</script>

<style lang="scss" scoped>
.subitemsPlanDetails {
  margin-top: 20px;
  /deep/ .el-table.nestedTable th {
    background: none;
  }
  /deep/ .el-table.nestedTable td,
  /deep/ .el-table.nestedTable th.is-leaf {
    border-bottom: none;
  }
  /deep/ .el-table.nestedTable tr {
    background: rgba(0, 11, 21, 0.02);
  }
  /deep/ .el-table__expanded-cell[class*='cell'] {
    padding: 0;
  }
  .form-label::before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
}
</style>
