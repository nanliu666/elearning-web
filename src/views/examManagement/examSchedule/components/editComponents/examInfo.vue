<template>
  <div class="exam-info">
    <common-form
      ref="form"
      :model="model"
      :columns="columns"
      @changeLabel="changeLabel"
    >
      <template #basicTitle>
        <div class="title-box">
          基础信息
        </div>
      </template>
      <template #basicInfoTitle>
        <div class="title-box">
          基础设置
        </div>
      </template>
      <template #environment>
        <div class="title-box">
          考场环境
        </div>
      </template>
      <template #privilegeTitle>
        <div class="title-box">
          考生权限
        </div>
      </template>
      <template #strategyTitle>
        <div class="title-box">
          评卷策略
        </div>
      </template>
      <template #multipleTitle>
        <span class="multiple-title">多选题</span>
      </template>
      <template #branchTitle>
        <div class="title-box">
          成绩发布
        </div>
      </template>
      <template #testPaper>
        <lazy-select
          ref="testPaperRef"
          v-model="model.testPaper"
          :disabled="modelDisabled"
          :searchable="true"
          :load="loadTestPaper"
          :first-option="testPaperDefault"
          :option-props="{
            label: 'name',
            value: 'id',
            key: 'id'
          }"
        />
      </template>
      <template #reckonTimeValue>
        <el-radio-group
          v-model="model.reckonTime"
          :disabled="modelDisabled"
        >
          <el-radio :label="false">
            不计时
          </el-radio>
          <radio-input
            :label="true"
            :input-value.sync="model.reckonTimeValue"
            text-before="限制时长"
            text-after="分钟"
            :input-props="{ maxLength: 4, disabled: modelDisabled || !model.reckonTime }"
          />
        </el-radio-group>
      </template>
      <template #questionTimeLimitType>
        <el-radio-group
          v-model="model.questionTimeLimitType"
          :disabled="modelDisabled"
        >
          <el-radio :label="0">
            不计时
          </el-radio>
          <el-radio :label="1">
            按试题原设置时间
          </el-radio>
          <radio-input
            :label="2"
            :input-value.sync="model.questionTimeLimit"
            text-before="每题限时"
            text-after="分钟"
            :input-props="{
              maxLength: 4,
              disabled: modelDisabled || model.questionTimeLimitType !== 2
            }"
          />
        </el-radio-group>
      </template>
      <template #joinNumValue>
        <el-radio-group
          v-model="model.joinNum"
          :disabled="modelDisabled"
        >
          <div class="flex-flow flex flexcenter">
            <el-radio :label="false">
              不限次数
            </el-radio>
            <radio-input
              :label="true"
              :input-value.sync="model.joinNumValue"
              text-before="限制次数 不超过"
              text-after="次"
              :input-props="{ maxLength: 2, disabled: modelDisabled || !model.joinNum }"
            />
          </div>
        </el-radio-group>
      </template>
      <template #integral>
        <checkbox-input
          v-model="model.integral"
          :disabled="modelDisabled"
          text-before="本考试记录系统积分，积分值为"
          text-after="分"
          :default-value.sync="model.integralValue"
          :input-width="60"
          :input-props="{ maxLength: 4, disabled: modelDisabled || !model.integral }"
        ></checkbox-input>
      </template>
      <template #publishTime>
        <checkbox-input
          v-model="model.publishTime"
          :disabled="modelDisabled"
          text-before="考试开始前"
          text-after="分钟发布考试信息"
          :input-width="60"
          :default-value.sync="model.publishTimeValue"
          :input-props="{ maxLength: 4, disabled: modelDisabled || !model.publishTime }"
        ></checkbox-input>
      </template>
      <template #lateBanExam>
        <div class="switch__container">
          <span class="label">{{ getSwitchLabel('lateBanExam') }}</span>
          <switch-input
            :disabled="modelDisabled"
            :switch-value.sync="model.lateBanExam"
            :input-value.sync="model.lateBanExamValue"
            pre-text="迟到"
            after-text="分钟禁止参加考试"
          />
        </div>
      </template>
      <template #answerBanExam>
        <div class="switch__container">
          <span class="label">{{ getSwitchLabel('answerBanExam') }}</span>
          <switch-input
            :disabled="modelDisabled"
            :switch-value.sync="model.answerBanExam"
            :input-value.sync="model.answerBanExamValue"
            pre-text="开始答卷"
            after-text="分钟内禁止交卷"
          />
        </div>
      </template>
      <template #isDecoil>
        <div class="switch__container">
          <span class="label">{{ getSwitchLabel('isDecoil') }}</span>
          <el-switch
            v-model="model.isDecoil"
            :disabled="modelDisabled"
          />
        </div>
      </template>
      <template #publicAnswers>
        <div class="switch__container">
          <span class="label">{{ getSwitchLabel('publicAnswers') }}</span>
          <el-switch
            v-model="model.publicAnswers"
            :disabled="modelDisabled"
          />
        </div>
      </template>
      <template #openResults>
        <div class="switch__container">
          <span class="label">{{ getSwitchLabel('openResults') }}</span>
          <switch-input
            :disabled="modelDisabled"
            :switch-value.sync="model.openResults"
            :input-value.sync="model.openResultsValue"
            pre-text="考生"
            after-text="天内可以查看成绩（0代表永久）"
          />
        </div>
      </template>
      <template #openAnswerSheet>
        <div class="switch__container">
          <span class="label">{{ getSwitchLabel('openAnswerSheet') }}</span>
          <el-switch
            v-model="model.openAnswerSheet"
            :disabled="modelDisabled"
          />
        </div>
      </template>
      <template #scopeLimit>
        <div class="switch__container">
          <span class="label">{{ getSwitchLabel('scopeLimit') }}</span>
          <switch-input
            :disabled="modelDisabled"
            :switch-value.sync="model.scopeLimit"
            :input-value.sync="model.scopeLimitValue"
            pre-text="最高得分为"
            after-text="分"
          />
        </div>
      </template>
      <template #objectiveQuestions>
        <div class="switch__container">
          <span class="label">{{ getSwitchLabel('objectiveQuestions') }}</span>
          <el-switch
            v-model="model.objectiveQuestions"
            :disabled="modelDisabled"
          />
        </div>
      </template>
      <template #decideItem>
        <div class="switch__container">
          <span class="label">{{ getSwitchLabel('decideItem') }}</span>
          <el-switch
            v-model="model.decideItem"
            :disabled="modelDisabled"
          />
        </div>
      </template>
      <template #answerMode1>
        <el-radio-group
          v-model="model.multipleChoice"
          :disabled="modelDisabled"
          class="radio-group-class"
        >
          <el-radio
            v-for="(item, index) in radioList"
            :key="index"
            class="radio-li"
            :label="index"
          >
            {{ item.value }}
            <el-tooltip
              v-if="item.des"
              effect="dark"
              width="400px"
              :content="item.des"
              placement="top"
            >
              <i class="el-icon-question" />
            </el-tooltip>
            <div
              v-if="index > 1 && model.multipleChoice === index"
              class="multiple-text"
            >
              <span v-if="index === 2">得扣</span>
              <span v-if="index === 3">扣</span>
              <span v-if="index === 4">得</span>
              <el-input-number
                v-model.number="model.multipleChoiceValue"
                style="width: 60px; margin: 0 4px"
                :controls="false"
                :min="0"
              />
              <span>分</span>
            </div>
          </el-radio>
        </el-radio-group>
      </template>
      <template #autoEvaluate>
        <div class="switch__container">
          <span class="label">{{ getSwitchLabel('autoEvaluate') }}</span>
          <el-switch
            v-model="model.autoEvaluate"
            :disabled="modelDisabled"
          />
        </div>
      </template>
      <template #passType>
        <el-radio-group
          v-model="model.passType"
          :disabled="modelDisabled"
          style="display: flex;"
        >
          <condition-radio-input
            v-model="model.passScope"
            :label="1"
            :is-show="model.passType === 1"
            style="margin-right:40px"
            label-text="按成绩"
            text-before="成绩不低于"
            text-after="分"
            :input-props="{ maxLength: 4, disabled: modelDisabled }"
          />
          <condition-radio-input
            v-model="model.passPercentage"
            :label="2"
            :is-show="model.passType === 2"
            label-text="按得分率"
            text-before="得分率不低于"
            text-after="%"
            :input-props="{ maxLength: 4, disabled: modelDisabled }"
          />
        </el-radio-group>
      </template>
    </common-form>
  </div>
</template>

<script>
import ConditionRadioInput from '@/components/condition-radio-input/condition-radio-input'
import SwitchInput from '../atomComponents/switchInput'
import RadioInput from '@/components/radio-input/radio-input'
import CheckboxInput from '@/components/checkbox-input/checkbox-input'
import { getCategoryList } from '@/api/examManage/category'
import { getExamList, getCopyPaperList, getExamArrange } from '@/api/examManage/schedule'
import { ONLINE_COLUMNS, OFFLINE_COLUMNS } from './infoConfig'
//TODO: 暂时隐藏
const radioList = [
  { value: '完全正确得分' },
  { value: '按正确选项个数计分' }
  // {
  //   value: '每项得扣分',
  //   des:
  //     '每道题答对一个得设置的分数，如设置为0.3分，则答对一选项得0.3，答错扣0.3，且每道题得分不低于0分'
  // },
  // {
  //   value: '每项答错扣分',
  //   des:
  //     '（题目的分数/正确答案的选项的个数）*答对的个数 - 错误分数*答错错个数 不完全正确时，答错扣分（每项扣分少于每项得分，总扣分减去得分不小于0，例如设置每项答错扣分0.3，试题分数为8，答案为ABCD，答题为ABC,则得分为（8 / 4）*3-0*0.3=6分；设置每项答错扣分0.3，试题分数为8，答案为ABD，答题为ABC,则得分为（8 / 4）*2-1*0.3=5.7分'
  // },
  // {
  //   value: '每正确项得分',
  //   des:
  //     '只有答对的选项中对的个数计分，如设置为0.4，正确答案是ABC，如果考生答题AB，答对两个，则得0.8分，如果答题ABD，则得0分'
  // }
]

export default {
  name: 'ExamInfo',
  components: {
    ConditionRadioInput,
    SwitchInput,
    RadioInput,
    CheckboxInput,
    LazySelect: () => import('@/components/lazy-select/lazySelect')
  },
  data() {
    return {
      testPaperDefault: [], // 考卷默认信息
      testPaperExpiredTime: '',
      radioList,
      columns: [],
      modelDisabled: false,
      model: {
        questionTimeLimitType: 0, // 0-不计时,1-按原试题设置,2-重新设置
        questionTimeLimit: 1, //每题限时默认为1
        publicFlag: true, // 是否开启公开报名
        joinApproveFlag: 1, // 公开报名是否需要审批
        joinEndDate: '', // 报名截止日期
        multipleChoice: 0, // 多选选哪个？
        multipleChoiceValue: '', // 多选分值
        certificateId: '',
        certificate: true,
        categoryId: '',
        examTime: '',
        examName: '',
        testPaper: '',
        reviewer: null,
        answerMode: 1,
        reckonTime: false,
        reckonTimeValue: 60, // 限制时长60分钟
        joinNum: false,
        joinNumValue: 3, // 默认参加次数，不超过3次
        integral: false,
        integralValue: 2,
        publishTime: false,
        publishTimeValue: 10,
        strategy: false,
        isLimitIp: false,
        isShuffle: false,
        createAnswers: false,
        lateBanExam: false,
        answerBanExam: false,
        preCreate: true,
        isHold: false,
        lateBanExamValue: 15, // 迟到15
        answerBanExamValue: 30, // 最低30分钟才可交卷
        preCreateValue: 10, // 预打印10份
        isDecoil: false,
        openAnswerSheet: true,
        selfMarking: false,
        publicAnswers: true,
        // openEntrance: false,
        // isExamine: false,
        openResults: true,
        openResultsValue: 0, // 允许考生查看成绩 默认值0，表示永久
        modifyAnswer: false,
        modifyLimit: false,
        scopeLimit: false,
        scopeLimitValue: 100, // 最高分默认值100
        objectiveQuestions: false,
        decideItem: false,
        autoEvaluate: true,
        passType: 1,
        passScope: 60,
        passPercentage: 80,
        publishType: 1,
        paperExpiredTime: '', // 试卷过期时间
        fixedTime: new Date()
      }
    }
  },
  computed: {
    isOnline() {
      return _.get(this.$route, 'query.examPattern', 'general') === 'general'
    },
    id() {
      return _.get(this.$route.query, 'id', null)
    }
  },
  watch: {
    isOnline: {
      handler(val) {
        this.columns = val ? ONLINE_COLUMNS : OFFLINE_COLUMNS
      },
      deep: true,
      immediate: true
    },
    'model.certificate': {
      handler(val) {
        const certificateIdProp = _.find(this.columns, { prop: 'certificateId' })
        certificateIdProp.required = val
        // 当切换成无需设置证书模板时，去除校验
        const formRef = _.get(this.$refs, 'form')
        formRef && formRef.clearValidate()
      },
      deep: true,
      immediate: true
    },
    'model.testPaper': {
      handler(value) {
        const paper = _.find(this.$refs.testPaperRef.optionList, (item) => {
          return item.id === value
        })
        if (paper) {
          this.model.paperExpiredTime = paper.expiredTime
          this.$store.commit('SET_PAPER_TIME', this.model.paperExpiredTime)
        }
      },
      deep: true
    },
    'model.publishType': {
      handler(value) {
        // 1隐藏， 2显示
        _.set(_.find(this.columns, { prop: 'fixedTime' }), 'isVisible', value === 2)
        // 隐藏的时候必填校验关闭
        _.set(_.find(this.columns, { prop: 'fixedTime' }), 'required', value === 2)
      },
      deep: true,
      immediate: true
    },
    'model.autoEvaluate': {
      handler(value) {
        const passTypeProp = _.find(this.columns, { prop: 'passType' })
        const autoEvaluateProp = _.find(this.columns, { prop: 'autoEvaluate' })
        passTypeProp.isHidden = !value
        autoEvaluateProp.span = value ? 11 : 24
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    getSwitchLabel(prop) {
      return _.get(_.find(this.columns, { prop }), 'label')
    },
    /**
     * 单独设置评卷人不置灰
     */
    setReviewerDisable() {
      const reviewerProp = _.find(this.columns, { prop: 'reviewer' })
      if (reviewerProp) {
        reviewerProp.disabled = false
      }
    },
    /**
     * 触发公开报名色switch
     */
    changeLabel(prop, disable) {
      if (prop === 'publicFlag') {
        this.setDateDisable(!disable)
      }
    },
    /**
     * 设置截止日期的disable
     */
    setDateDisable(val) {
      const joinEndDateIdProp = _.find(this.columns, { prop: 'joinEndDate' })
      _.set(joinEndDateIdProp, 'disabled', val)
    },
    /**
     * 公开报名以及报名截止日期以及证书的置灰处理
     */
    setPublicDisable(val) {
      const publicFlagProp = _.find(this.columns, { prop: 'joinApproveFlag' })
      const certificateIdProp = _.find(this.columns, { prop: 'certificateId' })
      _.set(publicFlagProp, 'disabled', val)
      _.set(certificateIdProp, 'disabled', val)
      this.setDateDisable(val)
    },
    /**
     * 设置公开报名的switch置灰
     */
    setLableConfigDisable(val) {
      const joinApproveFlagProp = _.find(this.columns, { prop: 'joinApproveFlag' })
      _.set(joinApproveFlagProp, 'labelSwitchConfig.disabled', val)
      const certificateIdProp = _.find(this.columns, { prop: 'certificateId' })
      _.set(certificateIdProp, 'labelSwitchConfig.disabled', val)
    },
    initData() {
      this.getCategory()
      this.initEditData()
    },
    // 获取编辑数据
    initEditData() {
      if (this.id) {
        // 编辑的时候的数据回显
        getExamArrange({ id: this.id }).then((res) => {
          // 不限时考试编辑回显默认显示60
          const cloneDeepRes = _.cloneDeep(res)
          const { reckonTime } = cloneDeepRes
          cloneDeepRes.reckonTimeValue = reckonTime ? cloneDeepRes.reckonTimeValue : 60
          this.model = cloneDeepRes
          this.$nextTick(() => {
            this.setDisabled(this)
          })
          this.setLazySelectFisrt(this, res)
          this.loadTestPaper()
          this.$store.commit('SET_PAPER_TIME', res.paperExpiredTime)
        })
      } else {
        this.modelDisabled = false
        this.setColumnsDisable(false)
      }
    },
    // 获取分类
    getCategory() {
      getCategoryList({
        parentId: 0,
        type: '1', // 0是题库分类 1是试卷分类
        name: '',
        status: 1
      }).then((res) => {
        let categoryId = _.filter(this.columns, (item) => {
          return item.prop === 'categoryId'
        })[0]
        categoryId.props.treeParams.data = res
      })
    },
    // 设置置灰与恢复正常
    setColumnsDisable(boolean) {
      _.each(this.columns, (item) => {
        _.set(item, 'disabled', boolean)
      })
      this.setLableConfigDisable(boolean)
      this.setPublicDisable(boolean)
      this.setReviewerDisable()
    },
    // 懒加载的默认值
    setLazySelectFisrt(examInfo, res) {
      examInfo.testPaperDefault = [
        {
          name: res.paperName,
          id: res.testPaper
        }
      ]
      const reviewerProp = _.find(examInfo.columns, { prop: 'reviewer' })
      _.each(res.reviewerNames, (item, index) => {
        _.set(reviewerProp, `firstOption[${index}].name`, item)
      })
      _.each(res.reviewer, (item, index) => {
        _.set(reviewerProp, `firstOption[${index}].userId`, item)
      })
    },
    // 设置置灰原则
    setDisabled(examInfo) {
      const type = _.get(this.$route, 'query.type')
      let disable = false
      //非草稿箱
      if (
        type === 'edit' &&
        examInfo.model.type === 0 &&
        (examInfo.model.status === '2' || examInfo.model.status === '3')
      ) {
        // 正在进行中的考试以及已结束的考试需要置灰
        disable = true
      } else {
        // 草稿与未开始的考试不要置灰
        disable = false
      }
      examInfo.modelDisabled = disable
      examInfo.setColumnsDisable(disable)
    },
    loadTestPaper(params) {
      //从手工评卷的编辑进来的时候，需要换成副本接口，入参也需要加入试卷id
      const loadFun = _.get(this.$route, 'query.source') ? getCopyPaperList : getExamList
      const loadParam = _.get(this.$route, 'query.source')
        ? _.assign(params, { id: this.model.testPaper })
        : _.assign(params, { status: 'normal' })
      return loadFun(loadParam)
    },
    getData(type) {
      // 不限时考试入参设置为0
      const cloneDeepModel = _.cloneDeep(this.model)
      const { reckonTime } = cloneDeepModel
      cloneDeepModel.reckonTimeValue = reckonTime ? cloneDeepModel.reckonTimeValue : 0
      return new Promise((resolve) => {
        // 如果是草稿不需要校验，如果是提交或者下一步需要校验
        if (type === 'draft') {
          resolve(cloneDeepModel)
        } else {
          this.$refs['form']
            .validate()
            .then(() => {
              resolve(cloneDeepModel)
            })
            .catch(() => {
              this.$message.error('请完整填写考试信息')
            })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.exam-info {
  /deep/ .el-form-item__label {
    white-space: nowrap;
  }
  /deep/ .el-form-item {
    margin-bottom: 16px;
  }
  /deep/ .el-form-item__label {
    font-size: 14px;
    color: rgba(0, 11, 21, 0.65);
  }
  .switch__container {
    display: flex;
    align-items: center;
    min-height: 36px;
    .label {
      color: rgba(0, 11, 21, 0.65);
      margin-right: 20px;
    }
  }
  .multiple-title {
    color: rgba(0, 11, 21, 0.65);
  }
  .radio-group-class {
    display: flex;
    flex-direction: column;
    margin-top: -20px;
    /deep/ .el-radio__label {
      display: flex;
      align-items: center;
    }
    .radio-li {
      // margin: 10px 0;
      margin-right: 30px;
      display: flex;
      align-items: center;
      margin-top: 10px;
      height: 34px;
      .multiple-text {
        align-items: center;
        display: flex;
        margin-left: 10px;
      }
    }
  }
  .title-box {
    font-size: 18px;
    color: rgba(0, 11, 21, 0.85);
    font-weight: 550;
    margin-top: 8px;
  }
}
</style>
