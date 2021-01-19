<template>
  <div class="exam-info">
    <common-form
      ref="form"
      :model="model"
      :columns="columns"
      :config="{
        disabled: modelDisabled
      }"
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
        <div
          class="title-box"
          style="margin-top: -12px"
        >
          成绩发布
        </div>
      </template>
      <template #testPaper>
        <lazy-select
          ref="testPaperRef"
          v-model="model.testPaper"
          :allow-create="true"
          :searchable="true"
          :load="loadTestPaper"
          :option-props="{
            label: 'name',
            value: 'id',
            key: 'id'
          }"
        />
      </template>
      <template #certificateId>
        <lazy-select
          v-model="model.certificateId"
          :allow-create="true"
          :searchable="true"
          :load="loadCertificateList"
          :option-props="{
            label: 'name',
            value: 'id',
            key: 'id'
          }"
        />
      </template>
      <template #reviewer>
        <lazy-select
          v-model="model.reviewer"
          :allow-create="true"
          :searchable="true"
          :load="loadCoordinator"
          :option-props="{
            label: 'name',
            value: 'userId',
            key: 'userId'
          }"
          :multiple="true"
        />
      </template>
      <template #reckonTimeValue>
        <el-radio-group v-model="model.reckonTime">
          <el-radio :label="false">
            不计时
          </el-radio>
          <radio-input
            :label="true"
            :input-value.sync="model.reckonTimeValue"
            text-before="限制时长"
            text-after="分钟"
            :input-props="{ maxLength: 4, disabled: !model.reckonTime }"
          />
        </el-radio-group>
      </template>

      <template #joinNumValue>
        <el-radio-group v-model="model.joinNum">
          <div class="flex-flow flex flexcenter">
            <el-radio :label="false">
              不限次数
            </el-radio>
            <radio-input
              :label="true"
              :input-value.sync="model.joinNumValue"
              text-before="限制次数 不超过"
              text-after="次"
              :input-props="{ maxLength: 2, disabled: !model.joinNum }"
            />
          </div>
        </el-radio-group>
      </template>
      <template #integral>
        <checkbox-input
          v-model="model.integral"
          text-before="本考试记录系统积分，积分值为"
          text-after="分"
          :default-value="2"
          :input-width="60"
          :input-props="{ maxLength: 4 }"
        ></checkbox-input>
      </template>
      <template #publishTime>
        <checkbox-input
          v-model="model.publishTime"
          text-before="考试开始前"
          text-after="分钟发布考试信息"
          :input-width="60"
          :default-value="10"
          :input-props="{ maxLength: 4 }"
        ></checkbox-input>
      </template>
      <template #lateBanExam>
        <switch-input
          :switch-value.sync="model.lateBanExam"
          :input-value.sync="model.lateBanExamValue"
          pre-text="迟到"
          after-text="分钟禁止参加考试"
        />
      </template>
      <template #answerBanExam>
        <switch-input
          :switch-value.sync="model.answerBanExam"
          :input-value.sync="model.answerBanExamValue"
          pre-text="开始答卷"
          after-text="分钟内禁止交卷"
        />
      </template>
      <template #preCreate>
        <switch-input
          :switch-value.sync="model.preCreate"
          :input-value.sync="model.preCreateValue"
          pre-text="试卷最多预生成"
          after-text="份"
        />
      </template>
      <template #openResults>
        <switch-input
          :switch-value.sync="model.openResults"
          :input-value.sync="model.openResultsValue"
          pre-text="考生"
          after-text="天内可以查看成绩（0代表永久）"
        />
      </template>
      <template #scopeLimit>
        <switch-input
          :switch-value.sync="model.scopeLimit"
          :input-value.sync="model.scopeLimitValue"
          pre-text="最高得分为"
          after-text="分"
        />
      </template>
      <template #modifyAnswer>
        <el-switch v-model="model.modifyAnswer" />
      </template>
      <template #autoEvaluate>
        <el-switch v-model="model.autoEvaluate" />
      </template>
      <template #answerMode1>
        <el-radio-group
          v-model="model.multipleChoice"
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
      <template #passType>
        <el-radio-group
          v-model="model.passType"
          style="display: flex;"
        >
          <condition-radio-input
            v-model="model.passType"
            style="margin-right:40px"
            label-text="按成绩"
            text-before="成绩不低于"
            text-after="分"
            :input-width="60"
            :default-value="passCondition[0].passType"
            :number.sync="passCondition[0].passScope"
            :pass-scope="model.passScope"
            :input-props="{ maxLength: 4 }"
          />
          <condition-radio-input
            v-model="model.passType"
            label-text="按得分率"
            text-before="得分率不低于"
            text-after="%"
            :input-width="60"
            :default-value="passCondition[1].passType"
            :number.sync="passCondition[1].passScope"
            :input-props="{ maxLength: 4 }"
          />
        </el-radio-group>
      </template>
    </common-form>
  </div>
</template>

<script>
import ConditionRadioInput from '@/components/condition-radio-input/condition-radio-input'
import SwitchInput from './atomComponents/switchInput'
import RadioInput from '@/components/radio-input/radio-input'
import CheckboxInput from '@/components/checkbox-input/checkbox-input'
import { getAllUserList } from '@/api/system/user'
import { getCategoryList } from '@/api/examManage/category'
import { getExamList, getCertificateList } from '@/api/examManage/schedule'

const insertConfig = {
  itemType: 'switch',
  span: 11,
  offset: 2,
  prop: 'modifyLimit',
  label: '不允许修改考生客观题及其评分结果'
}
const testPaper1Config = {
  itemType: 'slot',
  span: 11,
  offset: 2,
  required: true,
  prop: 'certificateId',
  label: '证书模板'
}

const EventColumns = [
  {
    prop: 'basicTitle',
    itemType: 'slotout',
    span: 24,
    label: ''
  },
  {
    itemType: 'input',
    span: 11,
    required: true,
    maxLength: 50,
    prop: 'examName',
    label: '考试名称'
  },
  {
    itemType: 'treeSelect',
    span: 11,
    offset: 2,
    required: false,
    options: [],
    prop: 'categoryId',
    label: '考试分类',
    props: {
      selectParams: {
        placeholder: '请选择分类',
        multiple: false
      },
      treeParams: {
        data: [],
        'check-strictly': true,
        'default-expand-all': false,
        'expand-on-click-node': false,
        clickParent: true,
        filterable: false,
        props: {
          children: 'children',
          label: 'name',
          disabled: 'disabled',
          value: 'id'
        }
      }
    }
  },
  {
    itemType: 'slot',
    span: 11,
    required: true,
    options: [],
    prop: 'testPaper',
    label: '考试用卷'
  },
  { itemType: 'slot', span: 11, offset: 2, required: false, prop: 'reviewer', label: '评卷人' },
  { itemType: 'switch', span: 11, required: false, prop: 'certificate', label: '是否发放证书' },
  {
    prop: 'basicInfoTitle',
    itemType: 'slotout',
    span: 24,
    label: ''
  },
  {
    itemType: 'radio',
    prop: 'answerMode',
    label: '答题模式',
    span: 11,
    options: [
      { label: '整卷模式', value: 1 },
      { label: '逐卷模式', value: 2 }
    ]
  },
  {
    itemType: 'slot',
    prop: 'reckonTimeValue',
    label: '考试时长',
    offset: 2,
    span: 11
  },
  {
    itemType: 'slot',
    prop: 'joinNumValue',
    label: '参加次数',
    span: 11
  },
  {
    itemType: 'radio',
    prop: 'strategy',
    label: '考试时间策略',
    span: 24,
    options: [
      { label: '允许进入考试的时间', value: false },
      { label: '允许参考时间（到结束时间，会自动提交。）', value: true }
    ]
  },
  {
    itemType: 'slot',
    prop: 'integral',
    label: '积分',
    span: 11
  },
  {
    itemType: 'slot',
    prop: 'publishTime',
    label: '发布考试',
    offset: 2,
    span: 11
  },
  {
    prop: 'environment',
    itemType: 'slotout',
    span: 24,
    label: ''
  },
  {
    itemType: 'switch',
    span: 11,
    prop: 'isLimitIp',
    label: '启用IP限制(需设定考生合法IP范围)'
  },
  {
    itemType: 'switch',
    prop: 'isShuffle',
    label: '生成试卷时打乱试题和选项顺序',
    offset: 2,
    span: 11
  },
  {
    itemType: 'switch',
    span: 11,
    prop: 'createAnswers',
    label: '交卷即时生成答案统计数据(建议大规模考试时不启用)'
  },
  {
    itemType: 'slot',
    prop: 'lateBanExam',
    label: '迟到后禁止考试',
    offset: 2,
    span: 11
  },
  {
    itemType: 'slot',
    span: 11,
    prop: 'answerBanExam',
    label: '答卷时间过少禁止交卷'
  },
  {
    itemType: 'slot',
    span: 11,
    offset: 2,
    prop: 'preCreate',
    label: '启用试卷预生成服务'
  },
  {
    itemType: 'switch',
    span: 11,
    prop: 'isHold',
    label: '自动保存答案到服务器'
  },
  {
    prop: 'privilegeTitle',
    itemType: 'slotout',
    span: 24,
    label: ''
  },
  {
    itemType: 'switch',
    span: 11,
    prop: 'isDecoil',
    label: '允许考生查看本机资料(开卷考试)'
  },
  {
    itemType: 'slot',
    span: 11,
    offset: 2,
    prop: 'openResults',
    label: '允许考生查看成绩'
  },
  {
    itemType: 'switch',
    span: 11,
    prop: 'openAnswerSheet',
    label: '允许考生查看答卷'
  },
  {
    itemType: 'switch',
    span: 11,
    offset: 2,
    prop: 'selfMarking',
    label: '允许考生自己评卷'
  },
  {
    itemType: 'switch',
    span: 11,
    prop: 'publicAnswers',
    label: '允许考生查看标准答案'
  },
  //TODO: 暂时隐藏
  // {
  //   itemType: 'switch',
  //   span: 11,
  //   offset: 2,
  //   prop: 'openEntrance',
  //   label: '允许考生报名参加考试'
  // },
  // {
  //   itemType: 'switch',
  //   span: 11,
  //   prop: 'isExamine',
  //   label: '考生报名考试需要审批'
  // },
  {
    prop: 'strategyTitle',
    itemType: 'slotout',
    span: 24,
    label: ''
  },
  {
    itemType: 'slot',
    span: 24,
    prop: 'modifyAnswer',
    label: '允许评卷人修改考生答案'
  },
  {
    itemType: 'slot',
    span: 11,
    prop: 'scopeLimit',
    label: '评卷限定最高得分'
  },
  {
    itemType: 'switch',
    span: 11,
    offset: 2,
    prop: 'objectiveQuestions',
    label: '手工评卷是否显示客观题'
  },
  {
    itemType: 'switch',
    span: 24,
    prop: 'decideItem',
    label: '判断题答对得分，不答不得分，答错扣分'
  },
  {
    prop: 'multipleTitle',
    itemType: 'slotout',
    span: 24,
    label: ''
  },
  {
    itemType: 'slot',
    prop: 'answerMode1',
    label: '',
    span: 24
  },
  {
    prop: 'branchTitle',
    itemType: 'slotout',
    span: 24,
    label: ''
  },
  {
    itemType: 'slot',
    span: 24,
    prop: 'autoEvaluate',
    label: '自动评定是否通过'
  },
  {
    itemType: 'radio',
    span: 11,
    prop: 'publishType',
    label: '发布规则',
    options: [
      { label: '系统即时发布', value: 1 },
      { label: '定时自动发布', value: 2 }
    ]
  }
]
const passTypeConfig = {
  itemType: 'slot',
  span: 11,
  offset: 2,
  prop: 'passType',
  label: '通过条件'
}
const fixedTimeConfig = {
  itemType: 'datePicker',
  span: 11,
  offset: 2,
  type: 'datetime',
  required: true,
  valueFormat: 'yyyy-MM-dd HH:mm:ss',
  prop: 'fixedTime',
  label: '定时发布日期时间'
}
const radioList = [
  { value: '完全正确得分' },
  { value: '按正确选项个数计分' },
  {
    value: '每项得扣分',
    des:
      '每道题答对一个得设置的分数，如设置为0.3分，则答对一选项得0.3，答错扣0.3，且每道题得分不低于0分'
  },
  {
    value: '每项答错扣分',
    des:
      '（题目的分数/正确答案的选项的个数）*答对的个数 - 错误分数*答错错个数 不完全正确时，答错扣分（每项扣分少于每项得分，总扣分减去得分不小于0，例如设置每项答错扣分0.3，试题分数为8，答案为ABCD，答题为ABC,则得分为（8 / 4）*3-0*0.3=6分；设置每项答错扣分0.3，试题分数为8，答案为ABD，答题为ABC,则得分为（8 / 4）*2-1*0.3=5.7分'
  },
  {
    value: '每正确项得分',
    des:
      '只有答对的选项中对的个数计分，如设置为0.4，正确答案是ABC，如果考生答题AB，答对两个，则得0.8分，如果答题ABD，则得0分'
  }
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
      testPaperExpiredTime: '',
      radioList,
      passCondition: [
        {
          passType: 1,
          passScope: 60
        },
        {
          passType: 2,
          passScope: 80
        }
      ],
      columns: EventColumns,
      model: {
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
        integral: 0,
        strategy: false,
        publishTime: 0,
        isLimitIp: false,
        isShuffle: false,
        createAnswers: false,
        lateBanExam: false,
        answerBanExam: false,
        preCreate: false,
        isHold: false,
        lateBanExamValue: 15, // 迟到15
        answerBanExamValue: 30, // 最低30分钟才可交卷
        preCreateValue: 10, // 预打印10份
        isDecoil: false,
        openResults: false,
        openAnswerSheet: false,
        selfMarking: false,
        publicAnswers: false,
        // openEntrance: false,
        isExamine: false,
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
        publishType: 1,
        fixedTime: new Date()
      }
    }
  },
  computed: {
    modelDisabled() {
      let flag = true
      if (this.$route.query.isDraft === 'true' || this.$route.query.type === 'copy') {
        flag = false
      } else {
        flag = this.model.status && this.model.status !== '1'
      }
      return flag
    }
  },
  watch: {
    'model.testPaper': {
      handler(value) {
        const paper = _.find(this.$refs.testPaperRef.optionList, (item) => {
          return item.id === value
        })
        if (paper) {
          this.testPaperExpiredTime = paper.expiredTime
        }
      },
      deep: true
    },
    'model.passType': {
      handler(value) {
        this.model.passScope = this.passCondition[value - 1].passScope
      },
      deep: true
    },
    'model.publishType': {
      handler(value) {
        const fixedTimeIndex = _.findIndex(this.columns, (column) => {
          return column.prop === 'fixedTime'
        })
        const publishRulesIndex = _.findIndex(this.columns, (column) => {
          return column.prop === 'publishType'
        })
        // 1隐藏， 2显示
        if (value === 1) {
          if (fixedTimeIndex !== -1) {
            this.columns.splice(fixedTimeIndex, 1)
          }
        } else {
          if (fixedTimeIndex === -1) {
            this.columns.splice(publishRulesIndex + 1, 0, fixedTimeConfig)
          }
        }
      },
      deep: true
    },
    'model.autoEvaluate': {
      handler(value) {
        const autoEvaluateIndex = _.findIndex(this.columns, (column) => {
          return column.prop === 'autoEvaluate'
        })
        const passTypeIndex = _.findIndex(this.columns, (column) => {
          return column.prop === 'passType'
        })
        if (value) {
          if (passTypeIndex === -1) {
            this.columns[autoEvaluateIndex].span = 11
            this.columns.splice(autoEvaluateIndex + 1, 0, passTypeConfig)
          }
        } else {
          if (passTypeIndex !== -1) {
            this.columns[autoEvaluateIndex].span = 24
            this.columns.splice(passTypeIndex, 1)
          }
        }
      },
      deep: true,
      immediate: true
    },
    'model.modifyAnswer': {
      handler(value) {
        const index = _.findIndex(this.columns, (column) => {
          return column.prop === 'modifyAnswer'
        })
        const limitIndex = _.findIndex(this.columns, (column) => {
          return column.prop === 'modifyLimit'
        })
        if (value) {
          if (limitIndex === -1) {
            this.columns.splice(index + 1, 0, insertConfig)
            this.columns[index].span = 11
          }
        } else {
          if (limitIndex !== -1) {
            this.columns[index].span = 24
            this.columns.splice(limitIndex, 1)
          }
        }
      },
      deep: true
    },
    // 是否发放证书
    'model.certificate': {
      handler(value) {
        const reviewer1Index = _.findIndex(this.columns, (column) => {
          return column.prop === 'certificate'
        })
        const testPaper1Index = _.findIndex(this.columns, (column) => {
          return column.prop === 'certificateId'
        })
        if (value) {
          if (testPaper1Index === -1) {
            this.columns.splice(reviewer1Index + 1, 0, testPaper1Config)
          }
        } else {
          // 删除
          if (testPaper1Index !== -1) {
            this.columns.splice(testPaper1Index, 1)
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    getCategoryList({
      parentId: 0,
      type: '0',
      name: ''
    }).then((res) => {
      let categoryId = _.filter(this.columns, (item) => {
        return item.prop === 'categoryId'
      })[0]
      categoryId.props.treeParams.data = res
    })
  },
  methods: {
    loadCoordinator(params) {
      return getAllUserList(params)
    },
    loadTestPaper(params) {
      return getExamList(_.assign(params, { status: 'normal' }))
    },
    loadCertificateList(params) {
      return getCertificateList(params)
    },
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs['form']
          .validate()
          .then(() => {
            resolve(this.model) // TODO 提交表单
          })
          .catch(() => {
            reject()
          })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.exam-info {
  background-color: #fff;
  padding: 20px 60px;
  margin-bottom: 30px;
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
