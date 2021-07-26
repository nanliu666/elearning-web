<template>
  <div class="createPlanSubitems">
    <!-- 面包屑 -->
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      style="padding: 25px 0 20px"
    >
      <el-breadcrumb-item>创建培训计划</el-breadcrumb-item>
      <el-breadcrumb-item>创建计划子项</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体内容 -->
    <basic-container block>
      <!-- 表单 -->
      <div class="form-container">
        <el-row v-if="!development">
          <el-col
            :span="11"
            style="margin-bottom: 22px"
          >
            <div style="font-size: 14px; padding-bottom: 8px; color: #606266">
              选择已收集计划
            </div>
            <el-select
              v-model="collectedPlan"
              placeholder="请选择"
              style="width: 100%"
              @change="changeCollectedPlan"
            >
              <el-option
                v-for="item in collectedPlanOptions"
                :key="item.id"
                :label="item.trainProject"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <common-form
          ref="form"
          v-loading="formLoading"
          :model="form"
          :columns="columns"
        >
          <!-- 费用预算 -->
          <template slot="budgets">
            <el-row
              slot="label"
              type="flex"
              justify="space-between"
              style="width: calc(100% - 10px); margin-top: -35px; margin-left: 10px"
            >
              <div class="form-label">
                费用预算<span style="margin-left: 10px">总金额：{{ '￥' + totalAmount }}</span>
              </div>
              <el-button
                type="text"
                @click="addBudget"
              >
                添加预算
              </el-button>
            </el-row>
            <!-- 预算表格 -->
            <el-table :data="form.budgets">
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
                label="预算费用（元）"
                prop="budget"
                show-overflow-tooltip
                width="250"
              >
                <template slot-scope="scope">
                  <el-input-number
                    v-if="scope.row.seen"
                    v-model="scope.row.budget"
                    :min="0"
                    :max="1000000000"
                    :controls="false"
                    step-strictly
                  >
                  </el-input-number>
                  <span
                    v-else
                    style="margin-left: 10px"
                  >{{ scope.row.budget }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="预算说明"
                prop="remark"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.seen"
                    v-model="scope.row.remark"
                    maxlength="32"
                    show-word-limit
                  >
                  </el-input>
                  <span
                    v-else
                    style="margin-left: 10px"
                  >{{ scope.row.remark }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="100"
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.seen"
                    type="text"
                    @click="savePlanSubitems(scope.$index, scope.row)"
                  >
                    保存
                  </el-button>
                  <el-button
                    v-else
                    type="text"
                    @click="editPlanSubitems(scope.$index, scope.row)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="text"
                    @click="deletePlanSubitems(scope.$index, scope.row)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </common-form>
        <!-- 底部按钮 -->
        <el-row>
          <el-col
            :xl="20"
            :lg="20"
            :md="22"
            :sm="22"
            :xs="22"
          >
            <el-button
              type="primary"
              size="medium"
              @click="handerConfirm"
            >
              完成
            </el-button>
            <el-button
              size="medium"
              @click="handerCancel()"
            >
              取消
            </el-button>
          </el-col>
        </el-row>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { getOrgTree } from '@/api/org/org'
import {
  listTrainPlanDetail,
  getTrainPlanPreDetail, // 调用培训计划制定子计划详情
  deleteBudgetPre, // 删除培训计划制定预算
  deleteBudget // 删除培训计划查看预算
} from '@/api/trainingPlan/trainingPlan'
export default {
  name: 'CreatePlanSubitems',
  data() {
    return {
      collectedPlan: '',
      collectedPlanOptions: [],
      formLoading: false,
      form: {
        trainProject: '',
        trainObject: '',
        target: '',
        content: '',
        traineeNum: undefined,
        trainType: '',
        trainDate: [],
        trainOrgId: '',
        trainLevel: '',
        trainMode: '',
        sessions: '',
        evaluationMethod: [],
        budgets: []
      },
      columns: [
        {
          prop: 'trainProject',
          label: '培训项目',
          itemType: 'input',
          span: 11,
          maxlength: 32,
          showWordLimit: true,
          required: true
        },
        {
          prop: 'trainObject',
          label: '培训对象',
          itemType: 'input',
          span: 11,
          offset: 2,
          maxlength: 32,
          showWordLimit: true,
          required: true
        },
        {
          prop: 'target',
          label: '培训目标',
          itemType: 'input',
          span: 24,
          rows: 4,
          maxlength: 200,
          showWordLimit: true,
          type: 'textarea',
          required: true
        },
        {
          prop: 'content',
          label: '培训内容',
          itemType: 'input',
          span: 24,
          rows: 4,
          maxlength: 200,
          showWordLimit: true,
          type: 'textarea',
          required: true
        },
        {
          prop: 'traineeNum',
          label: '培训人数',
          itemType: 'inputNumber',
          min: 1,
          span: 11,
          rules: [
            { required: true, message: '培训人数不能为空', trigger: ['input', 'blur', 'change'] },
            {
              type: 'number',
              validator: (rule, value, callback) => {
                if (/^(?:[1-9]\d*|0)$/.test(value) == false) {
                  callback(new Error('请输入正整数'))
                } else {
                  callback()
                }
              },
              trigger: ['input', 'blur', 'change']
            }
          ]
        },
        {
          prop: 'trainType',
          label: '培训类别',
          itemType: 'select',
          span: 11,
          offset: 2,
          options: [
            {
              value: 1,
              label: '内部培训'
            },
            {
              value: 2,
              label: '外购培训'
            },
            {
              value: 3,
              label: '外派培训'
            }
          ],
          required: true
        },
        {
          prop: 'trainDate',
          label: '培训日期',
          itemType: 'datePicker',
          type: 'monthrange',
          'start-placeholder': '开始月份',
          'end-placeholder': '结束月份',
          'range-separator': '至',
          valueFormat: 'M',
          'popper-class': 'trainingPlan-Date',
          format: 'M月',
          span: 11,
          required: true
        },
        {
          label: '实施部门',
          itemType: 'treeSelect',
          prop: 'trainOrgId',
          span: 11,
          offset: 2,
          props: {
            selectParams: {
              placeholder: '请选择实施部门',
              multiple: false
            },
            treeParams: {
              'check-strictly': true,
              'default-expand-all': false,
              'expand-on-click-node': false,
              clickParent: true,
              data: [],
              filterable: false,
              props: {
                children: 'children',
                label: 'orgName',
                value: 'orgId'
              }
            }
          },
          required: true
        },
        {
          prop: 'trainLevel',
          label: '计划等级',
          itemType: 'select',
          span: 11,
          options: [
            {
              value: 1,
              label: '公司级'
            },
            {
              value: 2,
              label: '单位级'
            },
            {
              value: 3,
              label: '部门级'
            }
          ],
          required: true
        },
        {
          prop: 'trainMode',
          label: '培训方式',
          itemType: 'select',
          span: 11,
          offset: 2,
          options: [
            {
              value: 1,
              label: '线上培训'
            },
            {
              value: 2,
              label: '线下培训'
            },
            {
              value: 3,
              label: '混合培训'
            }
          ],
          required: true
        },
        {
          prop: 'sessions',
          label: '项目数量',
          itemType: 'input',
          span: 11,
          rules: [
            { required: true, message: '项目数量不能为空' },
            {
              type: 'number',
              validator: (rule, value, callback) => {
                if (/^(?:[1-9]\d*)$/.test(value) == false) {
                  callback(new Error('请输入正整数'))
                } else {
                  callback()
                }
              }
            }
          ]
        },
        {
          prop: 'evaluationMethod',
          label: '评估方式',
          itemType: 'select',
          span: 11,
          offset: 2,
          multiple: true,
          options: [
            {
              value: '1',
              label: '满意度调查'
            },
            {
              value: '2',
              label: '集中测试'
            },
            {
              value: '3',
              label: '课程学习'
            },
            {
              value: '4',
              label: '出勤情况'
            },
            {
              value: '5',
              label: '上报材料'
            },
            {
              value: '6',
              label: '实操考试'
            },
            {
              value: '7',
              label: '答辩汇报'
            },
            {
              value: '8',
              label: '课程表现'
            }
          ],
          required: true
        },
        {
          prop: 'budgets',
          itemType: 'slot',
          label: '',
          span: 24,
          rules: [{ required: true, message: '请添加预算' }]
        }
      ],
      deleteSubitems: [], // 要删除的预算id集合
      development: false // 判断是培训上报还是培训制定
    }
  },
  computed: {
    totalAmount() {
      let total = 0
      if (this.form.budgets && this.form.budgets.length) {
        this.form.budgets.map((v) => {
          if (!isNaN(parseInt(v.budget))) total += parseInt(v.budget)
        })
      }
      return total
    }
  },
  activated() {
    if (this.$route.query.development) {
      this.development = this.$route.query.development
    }
  },
  //   watch: {
  //     'form.budgets': {
  //       handler: function() {
  //         this.form.sessions = this.form.budgets.length
  //       },
  //       deep: true
  //     }
  //   },
  mounted() {
    this.getDepartment()
  },
  methods: {
    // 获取所有的子计划列表
    async initTrainPlanDetailList(year) {
      await listTrainPlanDetail({ year: year }).then((res) => {
        this.collectedPlanOptions = res
      })
    },
    async changeCollectedPlan(val) {
      this.formLoading = true
      await getTrainPlanPreDetail({ id: val })
        .then((res) => {
          if (!Object.keys(res).length) {
            this.$message.warning('该收集计划暂无数据!')
            return
          }
          let id = this.form.id || '',
            planFeature = this.form.planFeature
          this.form = res
          this.form.id = id
          this.form.planFeature = planFeature
          //   this.form.trainDate = [this.form.trainStart, this.form.trainEnd]
          this.$set(this.form, 'trainDate', [this.form.trainStart, this.form.trainEnd])
          this.form.evaluationMethod = this.form.evaluationMethod.split(',')
          this.form.budgets.forEach((v) => {
            v.seen = false
          })
          this.$refs.form.resetFields()
        })
        .finally(() => {
          this.formLoading = false
        })
    },
    //   获取部门组织架构
    async getDepartment() {
      await getOrgTree({ orgType: 'Department', parentOrgId: '0' }).then((res) => {
        this.columns.find((item) => item.prop === 'trainOrgId').props.treeParams.data = res
      })
    },
    // 添加预算
    addBudget() {
      if (this.form.budgets.length >= 10) {
        this.$message.warning('最多只能添加10项预算!')
        return
      }
      this.form.budgets.push({
        budget: undefined,
        remark: '',
        seen: true
      })
    },
    // 保存
    savePlanSubitems(index, row) {
      if ((!row.budget && row.budget !== 0) || !row.remark) {
        this.$message.warning('预算费用或预算说明有遗漏!')
        return
      }
      row.seen = false
      this.$set(this.form.budgets, index, row)
    },
    // 编辑
    editPlanSubitems(index, row) {
      row.seen = true
      this.$set(this.form.budgets, index, row)
    },
    // 删除
    deletePlanSubitems(index, row) {
      this.form.budgets.splice(index, 1)
      if (row.id) {
        this.deleteSubitems.push(row.id)
      }
    },
    resetForm() {
      this.$refs.form.resetFields()
      this.collectedPlan = ''
      this.year = ''
      this.form = {
        trainProject: '',
        trainObject: '',
        target: '',
        content: '',
        traineeNum: undefined,
        trainType: '',
        trainDate: [],
        trainOrgId: '',
        trainLevel: '',
        trainMode: '',
        sessions: '',
        evaluationMethod: [],
        budgets: []
      }
    },
    // 完成
    handerConfirm() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        // 判断预算是否保存
        for (let i = 0; i < this.form.budgets.length; i++) {
          if (this.form.budgets[i].seen) {
            this.$message.warning('请保存全部预算!')
            return
          }
        }

        if (this.deleteSubitems.length) {
          if (this.development) {
            await deleteBudgetPre({ budgetIds: this.deleteSubitems.join(',') })
          } else {
            await deleteBudget({ budgetIds: this.deleteSubitems.join(',') })
          }
          this.deleteSubitems = []
        }
        this.form.trainStart = this.form.trainDate[0]
        this.form.trainEnd = this.form.trainDate[1]
        this.form.evaluationMethod = this.form.evaluationMethod.join(',')
        // 计划性质, 0-新增 1-计划中 2-已取消
        if (!this.form.planFeature) this.form.planFeature = 0
        delete this.form.trainDate
        this.form.budgets.forEach((v, i) => {
          delete v.seen
          v.seq = i < 9 ? '0' + (i + 1) : i + 1
        })
        let cloneData = JSON.parse(JSON.stringify(this.form))
        this.resetForm()
        this.$emit('addSubitems', cloneData)
      })
    },
    // 取消
    handerCancel() {
      this.$confirm('返回后，计划子项的数据将会丢失，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.resetForm()
        this.$emit('handerCancel')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.createPlanSubitems {
  height: 100%;
  font-size: 16px;
  padding: 0 20px;
  .basic-container--block {
    height: calc(100% - 92px);
    min-height: calc(100% - 92px);
  }
  .form-container {
    padding: 0 120px;
  }
  /deep/ .el-date-editor .el-range-separator {
    padding: 0;
  }
}
</style>
<style lang="scss">
.trainingPlan-Date {
  width: 322px;
  .el-picker-panel__body {
    min-width: 256px;
  }
  .el-date-range-picker__content.is-left {
    width: 100%;
  }
  .el-date-range-picker__content.is-right,
  .el-date-range-picker__header {
    display: none;
  }
}
</style>
