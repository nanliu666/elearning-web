<template>
  <div
    v-loading="loading"
    class="viewPlanSubitems"
  >
    <!-- 面包屑 -->
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      style="padding: 25px 0 20px"
    >
      <el-breadcrumb-item>{{ year }}年度培训计划</el-breadcrumb-item>
      <el-breadcrumb-item>查看计划子项</el-breadcrumb-item>
    </el-breadcrumb>
    <basic-container block>
      <div class="subitems-container">
        <el-form label-position="top">
          <el-row>
            <el-col :span="12">
              <el-form-item label="培训项目">
                <span>{{ subitemsInfo.trainProject }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="培训对象">
                <span>{{ subitemsInfo.trainObject }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="培训目标">
                <span>{{ subitemsInfo.target }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="培训内容">
                <span>{{ subitemsInfo.content }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计划性质">
                <span>{{ planFeatureTemp[subitemsInfo.planFeature] }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="培训人数">
                <span>{{ subitemsInfo.traineeNum }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="培训日期">
                <span>{{
                  subitemsInfo.trainEnd
                    ? subitemsInfo.trainStart + '月-' + subitemsInfo.trainEnd + '月'
                    : subitemsInfo.trainStart + '月'
                }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="培训类别">
                <span>{{ trainTypeTemp[subitemsInfo.trainType] }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计划等级">
                <span>{{ trainLevelTemp[subitemsInfo.trainLevel] }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="实施部门">
                <span>{{ subitemsInfo.orgName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目数量">
                <span>{{ subitemsInfo.sessions }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="培训方式">
                <span>{{ trainModeTemp[subitemsInfo.trainMode] }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="评估方式">
                <span>{{ initEvaluationMethod(subitemsInfo.evaluationMethod) }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <div slot="label">
                  费用预算<span
                    style="margin-left: 10px; font-size: 14px; color: #000000"
                  >总金额：{{ '￥' + totalAmount }}</span>
                </div>
                <span
                  v-for="(item, index) in subitemsInfo.budgets"
                  :key="index"
                >{{
                  item.remark + '/' + item.budget + '元;'
                }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { getTrainPlanDetail, getTrainPlanPreDetail } from '@/api/trainingPlan/trainingPlan'
export default {
  name: 'ViewPlanSubitems',
  data() {
    return {
      id: '', // 计划子项的id
      year: '',
      loading: false,
      subitemsInfo: {},
      trainTypeTemp: {
        // 培训类型
        1: '内部培训',
        2: '外购培训',
        3: '外派培训'
      },
      trainModeTemp: {
        // 培训方式
        1: '线上培训',
        2: '线下培训',
        3: '混合培训'
      },
      planFeatureTemp: {
        //   计划性质
        0: '新增',
        1: '计划中',
        2: '已取消'
      },
      trainLevelTemp: {
        //   计划等级
        1: '公司级',
        2: '单位级',
        3: '部门级'
      },
      evaluationMethodTemp: {
        1: '满意度调查',
        2: '集中测试',
        3: '课程学习',
        4: '出勤情况',
        5: '上报材料',
        6: '实操考试',
        7: '答辩汇报',
        8: '课程表现'
      },
      development: false // 判断是培训上报还是培训制定
    }
  },
  computed: {
    totalAmount() {
      let total = 0
      if (this.subitemsInfo.budgets && this.subitemsInfo.budgets.length) {
        this.subitemsInfo.budgets.map((v) => {
          total += parseInt(v.budget)
        })
      }
      return total
    }
  },
  activated() {
    if (this.$route.query.id && this.$route.query.year) {
      this.id = this.$route.query.id
      this.year = this.$route.query.year
      if (this.$route.query.development) {
        this.development = true
        this.getTrainPlanPreDetail()
      } else {
        this.getTrainPlanDetail()
      }
    }
  },
  methods: {
    // 改变评估方式
    initEvaluationMethod(data) {
      if (data) {
        let cloneData = data.split(',')
        cloneData.forEach((v, index) => {
          cloneData[index] = this.evaluationMethodTemp[v]
        })
        return cloneData.join(',')
      }
    },
    //   获取培训计划上报子计划详情
    async getTrainPlanDetail() {
      this.loading = true
      await getTrainPlanDetail({ id: this.id })
        .then((res) => {
          this.subitemsInfo = res
        })
        .finally(() => {
          this.loading = false
        })
    },
    //   获取培训计划制定子计划详情
    async getTrainPlanPreDetail() {
      this.loading = true
      await getTrainPlanPreDetail({ id: this.id })
        .then((res) => {
          this.subitemsInfo = res
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.viewPlanSubitems {
  height: 100%;
  .basic-container--block {
    height: calc(100% - 92px);
    min-height: calc(100% - 92px);
  }
  .subitems-container {
    padding: 0 175px;
    /deep/ .el-form-item {
      margin-bottom: 0;
      .el-form-item__label {
        padding: 0;
        line-height: 24px;
        opacity: 0.6;
      }
    }
    span {
      font-size: 16px;
      line-height: 24px;
      display: inline-block;
    }
  }
}
</style>
