<template>
  <div class="main-container">
    <!-- 创建培训计划 -->
    <div
      v-show="!showPlanSubitems"
      v-loading="loading"
      class="createPlan"
    >
      <page-header
        :title="(planId ? (isTranslate ? '变更' : '编辑') : '创建') + '培训计划'"
        show-back
        :back="goBack"
      >
      </page-header>
      <!-- <basic-container
        v-if="planId && !isTranslate"
        style="margin-bottom: 20px"
      >
        <span class="rejectReason">拒绝原因：{{ ruleForm.rejectReason || '未填写' }}</span>
      </basic-container> -->
      <!-- 数据表格 -->
      <basic-container block>
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
        >
          <el-form-item
            v-if="isTranslate"
            prop="changeReason"
            label="变更理由"
          >
            <el-input
              v-model="ruleForm.changeReason"
              type="textarea"
              placeholder="请输入变更理由"
              maxlength="200"
              show-word-limit
              rows="4"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="year">
            <div
              slot="label"
              class="form-label"
              style="display: inline-block; width: calc(100% - 10px)"
            >
              计划年份
              <span style="margin-left: 10px">每年仅允许创建一次计划</span>
            </div>
            <el-date-picker
              v-model="ruleForm.year"
              :picker-options="pickerOptions"
              value-format="yyyy"
              type="year"
              placeholder="选择年"
              style="width: 380px"
              :disabled="!!planId"
              popper-class="trainingPlanYear"
              @change="selectPlanYear"
            >
            </el-date-picker>
          </el-form-item>
          <!-- 计划子项 -->
          <el-form-item prop="trainPlanDetails">
            <div
              slot="label"
              class="form-label"
              style="
                display: inline-block;
                width: calc(100% - 10px);
                position: relative;
                z-index: 2;
              "
            >
              <el-row
                type="flex"
                justify="space-between"
              >
                <el-col>计划子项</el-col>
                <el-col>
                  <el-row
                    type="flex"
                    justify="end"
                  >
                    <el-link
                      target="_blank"
                      download="培训计划模板.xsl"
                      :underline="false"
                      :href="
                        'https://file-test.epro-edu.com/eln/default/20210625/15/05/3/150015732ec73fe4b32bd14138ace953.xlsx'
                      "
                    >
                      <el-button type="text">
                        模板下载
                      </el-button>
                    </el-link>
                    <el-upload
                      action=""
                      :before-upload="beforeUpload"
                      :http-request="httpRequest"
                      :show-file-list="false"
                    >
                      <el-button
                        type="text"
                        style="margin: 0 10px"
                      >
                        导入
                      </el-button>
                    </el-upload>
                    <el-button
                      type="text"
                      @click="createSubitems"
                    >
                      创建
                    </el-button>
                  </el-row>
                </el-col>
              </el-row>
            </div>
            <!-- 数据表格 -->
            <el-table
              ref="mutilTable"
              v-loading="tableLoading"
              :data="ruleForm.trainPlanDetails"
              style="margin-top: 20px"
            >
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form
                    label-position="left"
                    inline
                    class="createPlan-table-form"
                  >
                    <el-form-item label="培训目标">
                      <span>{{ props.row.target }}</span>
                    </el-form-item>
                    <el-form-item label="培训内容">
                      <span>{{ props.row.content }}</span>
                    </el-form-item>
                    <el-form-item label="预算说明">
                      <span
                        v-for="(item, index) in props.row.budgets"
                        :key="index"
                      >{{
                        item.remark + '/' + item.budget + '元;'
                      }}</span>
                    </el-form-item>
                  </el-form>
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
              >
              </el-table-column>
              <el-table-column
                v-if="isTranslate"
                label="计划性质"
                prop="planFeature"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ planFeatureTemp[scope.row.planFeature] }}
                </template>
              </el-table-column>
              <el-table-column
                label="培训对象"
                prop="trainObject"
                show-overflow-tooltip
              >
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
              </el-table-column>
              <el-table-column
                label="费用预算（元）"
                prop="costBudget"
                show-overflow-tooltip
                width="120"
              >
                <template slot-scope="scope">
                  {{ totalAmount(scope.row.budgets) }}
                </template>
              </el-table-column>
              <el-table-column
                label="培训日期"
                prop="trainingDate"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{
                    !scope.row.trainStart && !scope.row.trainStart
                      ? ''
                      : scope.row.trainStart != scope.row.trainEnd
                        ? scope.row.trainStart + '月-' + scope.row.trainEnd + '月'
                        : scope.row.trainStart + '月'
                  }}
                </template>
              </el-table-column>
              <el-table-column
                label="培训类型"
                prop="trainType"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ trainTypeTemp[scope.row.trainType] }}
                </template>
              </el-table-column>
              <el-table-column
                label="培训方式"
                prop="trainMode"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ trainModeTemp[scope.row.trainMode] }}
                </template>
              </el-table-column>
              <el-table-column
                label="评估方式"
                prop="evaluationMethod"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ initEvaluationMethod(scope.row.evaluationMethod) }}
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="100"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="editTrainingPlan(scope.row)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    v-if="!isTranslate || (isTranslate && scope.row.planFeature === 0)"
                    type="text"
                    @click="deleteTrainingPlan(scope.$index, scope.row)"
                  >
                    删除
                  </el-button>
                  <el-button
                    v-if="isTranslate && scope.row.planFeature === 1"
                    type="text"
                    @click="cancelTrainingPlan(scope.$index)"
                  >
                    取消
                  </el-button>
                  <el-button
                    v-if="isTranslate && scope.row.planFeature === 2"
                    type="text"
                    @click="restoreTrainingPlan(scope.$index)"
                  >
                    恢复
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
        <!-- 提交按钮 -->
        <div class="submit-btn">
          <el-button
            v-if="development"
            type="primary"
            size="medium"
            @click="submitDevelop"
          >
            提交
          </el-button>
          <template v-else>
            <el-button
              type="primary"
              size="medium"
              @click="submitAudit(true)"
            >
              提交审核
            </el-button>
            <el-button
              v-if="isTranslate"
              size="medium"
              @click="cancelTranslate"
            >
              取消
            </el-button>
            <el-button
              v-else
              size="medium"
              @click="submitAudit(false)"
            >
              保存
            </el-button>
          </template>
        </div>
      </basic-container>
    </div>
    <!-- 创建计划子项 -->
    <create-plan-subitems
      v-show="showPlanSubitems"
      ref="createPlanSubitems"
      @handerCancel="showPlanSubitems = false"
      @addSubitems="addSubitems"
    ></create-plan-subitems>
    <!-- 审批发起组件 -->
    <appr-submit
      ref="apprSubmit"
      category-id="13"
      @submit="handleSubmit"
      @apprCancel="apprCancel"
    />
  </div>
</template>

<script>
import { categoryMap } from '@/const/approve'
import ApprSubmit from '@/components/appr-submit/ApprSubmit'

import createPlanSubitems from './createPlanSubitems'
import {
  saveTrainPlan, // 培训计划上报创建
  saveTrainPlanPre, // 培训计划制定创建
  importTrainPlan,
  getTrainPlanPre, // 培训计划制定详情
  getTrainPlan, // 培训计划查看详情
  deleteDetailPre, // 培训计划制定删除子计划
  deleteDetail, // 培训计划查看删除子计划
  updateTrainPlanPre, // 培训计划制定编辑
  updateTrainPlan // 培训计划查看编辑
} from '@/api/trainingPlan/trainingPlan'
export default {
  name: 'CreatePlan',
  components: {
    createPlanSubitems,
    ApprSubmit
  },
  data() {
    return {
      formKey: 'trainPlan',
      loading: false,
      tableLoading: false,
      showPlanSubitems: false,
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
      planFeatureTemp: {
        0: '新增',
        1: '计划内',
        2: '已取消'
      },
      ruleForm: {
        year: '',
        trainPlanDetails: []
      },
      rules: {
        changeReason: [{ required: true, message: '请输入变更理由', trigger: 'blur' }],
        year: [{ required: true, message: '请选择计划年份', trigger: 'change' }],
        trainPlanDetails: [
          { required: true, type: 'array', min: 1, message: '计划子项不能为空', trigger: 'change' }
        ]
      },
      planId: '', // 培训计划id
      deletePlanList: [], // 删除的培训子计划集合
      isTranslate: false, // 是否是变更
      pickerOptions: {
        //disabledDate为函数，返回值为布尔值，
        disabledDate: (time) => {
          // 2020年-目前年份+2例如目前年份2021计划年份可选 2020-2023
          let minYear = new Date().getFullYear() + 2
          return (
            time.getTime() > new Date(JSON.stringify(minYear)) ||
            time.getTime() < new Date(JSON.stringify(2020))
          )
        }
      },
      development: false, // 判断是培训上报还是培训制定
      planSubitemsId: 1 //编辑计划子项的id
    }
  },
  watch: {
    'ruleForm.trainPlanDetails': {
      handler(newVal) {
        if (newVal.length > 0) {
          this.$refs.ruleForm.clearValidate('trainPlanDetails')
        }
      }
    }
  },
  activated() {
    this.initData()
    console.log(222)
  },
  methods: {
    goBack() {
      this.$router.back(-1)
    },
    // 选择计划年份
    selectPlanYear(val) {
      if (!this.development) {
        this.$refs.createPlanSubitems.initTrainPlanDetailList(val)
      }
    },
    // 改变评估方式
    initEvaluationMethod(data) {
      let cloneData = data.split(',')
      cloneData.forEach((v, index) => {
        cloneData[index] = this.evaluationMethodTemp[v]
      })
      return cloneData.join(',')
    },
    // 初始化数据
    initData() {
      if (this.$route.query.planId) {
        this.planId = this.$route.query.planId
        if (this.$route.query.isTranslate) {
          this.isTranslate = true
          this.ruleForm.changeReason = ''
        }
        if (this.$route.query.development) {
          this.getTrainPlanPre()
        } else {
          this.getTrainPlan()
        }
      } else {
        this.planId = ''
      }
      if (this.$route.query.development) {
        this.development = true
      } else {
        this.development = false
      }
      if (!this.$route.query.isTranslate) {
        this.isTranslate = false
      } else {
        this.ruleForm.changeReason = ''
      }
      this.$refs.createPlanSubitems.resetForm()
      this.planSubitemsId = 1
      this.deletePlanList = []
      this.$refs.ruleForm.resetFields()
      this.showPlanSubitems = false
      this.form = {
        year: '',
        trainPlanDetails: []
      }
    },
    //   创建计划子项
    createSubitems() {
      if (!this.ruleForm.year) {
        this.$message.warning('请选择计划年份!')
        return
      }
      this.$refs.createPlanSubitems.development = this.development
      this.showPlanSubitems = true
    },
    //  编辑培训计划
    editTrainingPlan(row) {
      let cloneData = JSON.parse(JSON.stringify(row))
      cloneData.trainStart && cloneData.trainEnd
        ? (cloneData.trainDate = [cloneData.trainStart, cloneData.trainEnd])
        : (cloneData.trainDate = [])
      cloneData.evaluationMethod
        ? (cloneData.evaluationMethod = cloneData.evaluationMethod.split(','))
        : (cloneData.evaluationMethod = [])
      cloneData.budgets.forEach((v) => {
        v.seen = false
      })
      this.$refs.createPlanSubitems.form = JSON.parse(JSON.stringify(cloneData))
      this.showPlanSubitems = true
    },
    // 删除培训计划
    deleteTrainingPlan(index, row) {
      this.ruleForm.trainPlanDetails.splice(index, 1)
      this.deletePlanList.push(row.id)
      if (!this.ruleForm.trainPlanDetails.length) {
        this.$refs.ruleForm.validateField('trainPlanDetails')
      }
    },
    // 取消计划
    cancelTrainingPlan(index) {
      this.$confirm('取消后，未保持的数据将会消失，是否继续？', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$set(this.ruleForm.trainPlanDetails[index], 'planFeature', 2)
      })
    },
    // 恢复计划
    restoreTrainingPlan(index) {
      this.$set(this.ruleForm.trainPlanDetails[index], 'planFeature', 1)
    },
    // 计算总金额
    totalAmount(budgets) {
      let total = 0
      if (budgets.length) {
        budgets.map((v) => {
          total += parseInt(v.budget)
        })
      }
      return total
    },
    // 新增子计划项
    addSubitems(data) {
      this.showPlanSubitems = false
      if (data.id) {
        for (let i = 0; i < this.ruleForm.trainPlanDetails.length; i++) {
          if (this.ruleForm.trainPlanDetails[i].id == data.id) {
            this.$set(this.ruleForm.trainPlanDetails, i, data)
            return
          }
        }
      } else {
        data.id = this.planSubitemsId
        this.planSubitemsId++
        this.ruleForm.trainPlanDetails.push(data)
      }
    },
    apprCancel() {
      for (let i = 0; i < this.ruleForm.trainPlanDetails.length; i++) {
        if (!this.ruleForm.trainPlanDetails[i].id) {
          this.ruleForm.trainPlanDetails[i].id = this.planSubitemsId
          this.planSubitemsId++
        }
      }
    },
    // 导入文件
    async httpRequest(file) {
      const parmas = new FormData()
      parmas.append('file', file.file)
      this.tableLoading = true
      await importTrainPlan(parmas)
        .then((res) => {
          if (!res.successList.length) {
            this.$message.error('导入失败,请下载模板正确输入!')
          }
          let cloneData = JSON.parse(JSON.stringify(res.successList))
          cloneData.forEach((v) => {
            v.id = this.planSubitemsId
            this.planSubitemsId++
          })
          this.ruleForm.trainPlanDetails = [...this.ruleForm.trainPlanDetails, ...cloneData]
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    beforeUpload(file) {
      const regx = /^.*\.(xls|xlsx)$/
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('上传附件大小不能超过 5MB!')
        return false
      }
      if (!regx.test(file.name)) {
        this.$message.error('上传附件只支持xls、xlsx格式文件')
        return false
      }
      return true
    },
    // 提交审核
    submitAudit(flag) {
      // flag为true时为提交审核,false为保存
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return
        // 判断计划子项是否有空值，导入字段不正确会置空
        let repeatNum = 0,
          includeItems = [
            'trainProject',
            'trainObject',
            'sessions',
            'traineeNum',
            'trainStart',
            'trainEnd',
            'trainMode',
            'trainType',
            'target',
            'content',
            'evaluationMethod'
          ]
        for (let i = 0; i < this.ruleForm.trainPlanDetails.length; i++) {
          for (let key in this.ruleForm.trainPlanDetails[i]) {
            if (!this.ruleForm.trainPlanDetails[i][key] && includeItems.includes(key))
              repeatNum += 1
          }
        }
        if (repeatNum) {
          this.$message.warning(
            `您导入的表格有${repeatNum}处字段不正确,已做置空处理,请修改后重新提交`
          )
          return
        }
        this.ruleForm.planName = this.ruleForm.year + '年度培训计划'
        // 计划状态,0-审核中 1-执行中 2-变更中 3-已完成 4-未提交 5-已拒绝 6-待审核
        this.ruleForm.status = flag ? '0' : '4'
        this.$confirm(
          flag
            ? `提交后，将会进行审批流程，${
                this.isTranslate ? '通过后变更将会生效' : '通过后修改需要进行变更审批'
              }，是否继续提交？`
            : '确认保存？',
          '提醒',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(async () => {
          this.submitPlanData(flag)
        })
      })
    },
    async submitPlanData(flag) {
      // 判断培训项目名称是否重复
      let repeatKey = []
      for (let i = 0; i < this.ruleForm.trainPlanDetails.length; i++) {
        if (repeatKey.includes(this.ruleForm.trainPlanDetails[i].trainProject)) {
          this.$message.warning('培训项目名称不能重复!')
          return
        }
        repeatKey.push(this.ruleForm.trainPlanDetails[i].trainProject)
      }
      if (!flag) this.loading = true
      if (this.deletePlanList.length) {
        await deleteDetail({ detailIds: this.deletePlanList.join(',') })
      }
      //   将新增的子计划id置空
      for (let i = 0; i < this.ruleForm.trainPlanDetails.length; i++) {
        if (
          Object.prototype.toString.call(this.ruleForm.trainPlanDetails[i].id) === '[object Number]'
        ) {
          this.ruleForm.trainPlanDetails[i].id = ''
        }
      }
      //   flag走审批流程
      if (flag) {
        this.$refs.apprSubmit.validate().then(async () => {
          if (this.ruleForm.id) {
            //   判断是变更还是编辑
            if (this.isTranslate) {
              this.ruleForm.status = '2'
              for (let i = 0; i < this.ruleForm.trainPlanDetails.length; i++) {
                if (
                  Object.prototype.toString.call(this.ruleForm.trainPlanDetails[i].id) ===
                  '[object Number]'
                ) {
                  this.ruleForm.trainPlanDetails[i].id = ''
                }
              }
            }
            await updateTrainPlan(this.ruleForm)
              .then(async (res) => {
                if (flag) {
                  //保存不走审批流
                  await this.submitApprApply(res.id)
                }
                this.$message.success('提交审核成功')
                this.$router.push({ path: '/trainingPlan/submission' })
              })
              .finally(() => {
                this.loading = false
              })
          } else {
            await saveTrainPlan(this.ruleForm)
              .then(async (res) => {
                if (flag) {
                  //保存不走审批流
                  await this.submitApprApply(res.id)
                }
                this.$message.success('提交审核成功')
                this.$router.push({ path: '/trainingPlan/submission' })
              })
              .finally(() => {
                this.loading = false
              })
          }
        })
      } else {
        if (this.ruleForm.id) {
          //   判断是变更还是编辑
          if (this.isTranslate) {
            this.ruleForm.status = '2'
          }
          await updateTrainPlan(this.ruleForm)
            .then(() => {
              this.$message.success('保存成功')
              this.$router.push({ path: '/trainingPlan/submission' })
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          await saveTrainPlan(this.ruleForm)
            .then(() => {
              this.$message.success('保存成功')
              this.$router.push({ path: '/trainingPlan/submission' })
            })
            .finally(() => {
              this.loading = false
            })
        }
      }
    },
    // 审批发起组件的弹窗确认回调
    handleSubmit() {
      this.submitPlanData(true)
    },
    // 提交审批
    submitApprApply(applyId) {
      this.$refs.apprSubmit.submit({
        formId: applyId,
        processName: categoryMap['13'],
        formKey: this.formKey
      })
    },
    // 培训计划制定提交
    submitDevelop() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return
        console.log(this.planId)
        // 判断计划子项是否有空值，导入字段不正确会置空
        let repeatNum = 0,
          includeItems = [
            'trainProject',
            'trainObject',
            'sessions',
            'traineeNum',
            'trainStart',
            'trainEnd',
            'trainMode',
            'trainType',
            'target',
            'content',
            'evaluationMethod',
            'budgets'
          ]
        for (let i = 0; i < this.ruleForm.trainPlanDetails.length; i++) {
          for (let key in this.ruleForm.trainPlanDetails[i]) {
            if (
              (!this.ruleForm.trainPlanDetails[i][key] && includeItems.includes(key)) ||
              (key == 'budgets' && !this.ruleForm.trainPlanDetails[i][key].length)
            )
              repeatNum += 1
          }
        }
        if (repeatNum) {
          this.$message.warning(
            `您导入的表格有${repeatNum}处字段不正确,已做置空处理,请修改后重新提交`
          )
          return
        }
        this.ruleForm.planName = this.ruleForm.year + '年度培训计划'
        this.$confirm('确认提交吗？', '提醒', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          console.log(this.ruleForm)
          this.loading = true
          //   删除子计划的id集合
          if (this.deletePlanList.length) {
            await deleteDetailPre({ detailIds: this.deletePlanList.join(',') })
          }
          //   将新增的子计划id置空
          for (let i = 0; i < this.ruleForm.trainPlanDetails.length; i++) {
            if (
              Object.prototype.toString.call(this.ruleForm.trainPlanDetails[i].id) ===
              '[object Number]'
            ) {
              this.ruleForm.trainPlanDetails[i].id = ''
            }
          }
          if (this.ruleForm.id) {
            //   判断是变更还是编辑
            await updateTrainPlanPre(this.ruleForm)
              .then(async () => {
                this.$message.success('提交成功')
                this.$router.push({ path: '/trainingPlan/development' })
              })
              .catch(() => {
                //   提交，后端校验不能重名，需要重新赋值id
                for (let i = 0; i < this.ruleForm.trainPlanDetails.length; i++) {
                  if (!this.ruleForm.trainPlanDetails[i].id) {
                    this.ruleForm.trainPlanDetails[i].id = this.planSubitemsId
                    this.planSubitemsId++
                  }
                }
              })
              .finally(() => {
                this.loading = false
              })
          } else {
            await saveTrainPlanPre(this.ruleForm)
              .then(async () => {
                this.$message.success('提交成功')
                this.$router.push({ path: '/trainingPlan/development' })
              })
              .catch(() => {
                //   提交，后端校验不能重名，需要重新赋值id
                for (let i = 0; i < this.ruleForm.trainPlanDetails.length; i++) {
                  if (!this.ruleForm.trainPlanDetails[i].id) {
                    this.ruleForm.trainPlanDetails[i].id = this.planSubitemsId
                    this.planSubitemsId++
                  }
                }
              })
              .finally(() => {
                this.loading = false
              })
          }
        })
      })
    },
    // 获取培训计划查看详情
    async getTrainPlan() {
      this.loading = true
      await getTrainPlan({ planId: this.planId })
        .then((res) => {
          this.ruleForm = res
          this.ruleForm.trainPlanDetails = this.ruleForm.details
          this.ruleForm.year = this.ruleForm.year + ''
          this.ruleForm.changeReason = ''
          this.$refs.createPlanSubitems.initTrainPlanDetailList(this.ruleForm.year)
          delete this.ruleForm.details
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 获取培训计划制定详情
    async getTrainPlanPre() {
      this.loading = true
      await getTrainPlanPre({ planId: this.planId })
        .then((res) => {
          this.ruleForm = res
          this.ruleForm.trainPlanDetails = this.ruleForm.details
          this.ruleForm.year = this.ruleForm.year + ''
          delete this.ruleForm.details
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 取消变更
    cancelTranslate() {
      this.$confirm('取消后，未保持的数据将会消失，是否继续？', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.goBack()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.createPlan {
  /deep/ .el-form-item__label {
    width: 100%;
    text-align: left;
  }
  .rejectReason {
    font-size: 16px;
  }
  .sub-title {
    width: 100px !important;
    margin-right: 20px;
  }
  .createPlan-table-form {
    font-size: 0;
    /deep/ label {
      width: 90px;
      color: #99a9bf;
    }
    /deep/ .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 100%;
      .el-form-item__content {
        width: calc(100% - 90px);
      }
    }
  }
}
</style>
<style lang="scss">
.trainingPlanYear table tr {
  td:first-child .cell,
  th:first-child .cell {
    padding-left: 0;
  }
}
</style>
