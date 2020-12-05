<template>
  <div class="permission">
    <common-form
      ref="form"
      :model="model"
      :columns="columns"
      :config="{
        labelPosition: 'left'
      }"
    >
      <template #title1>
        考场环境
      </template>
      <template #title2>
        考生权限
      </template>
      <template #title3>
        评卷策略
      </template>
      <template #title4>
        <span style="color: #606266">多选题</span>
      </template>
      <template #title5>
        成绩分布
      </template>
      <template #title6>
        <span style="color: #606266">通过条件</span>
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
        <el-switch
          v-model="model.modifyAnswer"
          @change="modifyAnswerChange"
        />
      </template>
      <template #autoEvaluate>
        <el-switch
          v-model="model.autoEvaluate"
          @change="autoEvaluateChange"
        />
      </template>
      <template #answerMode>
        <el-radio-group
          v-model="currentRadio"
          class="radio-group"
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
          </el-radio>
        </el-radio-group>
      </template>
      <template #passType>
        <el-radio-group v-model="model.passType">
          <achivementRadioInput
            v-model="model.passType"
            label-text="按成绩"
            text-before="成绩不低于"
            text-after="分"
            :input-width="60"
            :default-value="passCondition[0].passType"
            :number.sync="passCondition[0].passScope"
            :pass-scope="model.passScope"
            :input-props="{ maxLength: 4 }"
          ></achivementRadioInput>
          <achivementRadioInput
            v-model="model.passType"
            label-text="按得分率"
            text-before="得分率不低于"
            text-after="%"
            :input-width="60"
            :default-value="passCondition[1].passType"
            :number.sync="passCondition[1].passScope"
            :input-props="{ maxLength: 4 }"
          ></achivementRadioInput>
        </el-radio-group>
      </template>
    </common-form>
    <common-form
      ref="pubulishForm"
      :model="pubulishModel"
      :columns="pubulishColumns"
    />
  </div>
</template>

<script>
import achivementRadioInput from '@/components/achivementRadioInput/achivementRadioInput'
import SwitchInput from '../atomComponents/switchInput'
const personOptionProps = {
  label: 'name',
  value: 'userId',
  key: 'userId'
}
const insertConfig = {
  itemType: 'switch',
  span: 24,
  prop: 'modifyLimit',
  label: '不允许修改考生客观题及其评分结果'
}
const EventColumns = [
  {
    prop: 'title1',
    itemType: 'slotout',
    span: 24,
    label: ''
  },
  {
    itemType: 'switch',
    span: 24,
    prop: 'isLimitIp',
    label: '启用IP限制(需设定考生合法IP范围)'
  },
  {
    itemType: 'switch',
    span: 24,
    prop: 'isShuffle',
    label: '生成试卷时打乱试题和选项顺序'
  },
  {
    itemType: 'switch',
    span: 24,
    prop: 'createAnswers',
    label: '交卷即时生成答案统计数据(建议大规模考试时不启用)'
  },
  {
    itemType: 'slot',
    span: 24,
    prop: 'lateBanExam',
    label: '迟到后禁止考试'
  },
  {
    itemType: 'slot',
    span: 24,
    prop: 'answerBanExam',
    label: '答卷时间过少禁止交卷'
  },
  {
    itemType: 'slot',
    span: 24,
    prop: 'preCreate',
    label: '启用试卷预生成服务'
  },
  {
    itemType: 'switch',
    span: 24,
    prop: 'isHold',
    label: '自动保存答案到服务器'
  },
  {
    prop: 'title2',
    itemType: 'slotout',
    span: 24,
    label: ''
  },
  {
    itemType: 'switch',
    span: 24,
    prop: 'isDecoil',
    label: '允许考生查看本机资料(开卷考试)'
  },
  {
    itemType: 'slot',
    span: 24,
    prop: 'openResults',
    label: '允许考生查看成绩'
  },
  {
    itemType: 'switch',
    span: 24,
    prop: 'openAnswerSheet',
    label: '允许考生查看答卷'
  },
  {
    itemType: 'switch',
    span: 24,
    prop: 'selfMarking',
    label: '允许考生自己评卷'
  },
  {
    itemType: 'switch',
    span: 24,
    prop: 'publicAnswers',
    label: '允许考生查看标准答案'
  },
  {
    itemType: 'switch',
    span: 24,
    prop: 'openEntrance',
    label: '允许考生报名参加考试'
  },
  {
    itemType: 'switch',
    span: 24,
    prop: 'isExamine',
    label: '考生报名考试需要审批'
  },
  {
    prop: 'title3',
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
    span: 24,
    prop: 'scopeLimit',
    label: '评卷限定最高得分'
  },
  {
    itemType: 'switch',
    span: 24,
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
    prop: 'title4',
    itemType: 'slotout',
    span: 24,
    label: ''
  },
  {
    itemType: 'slot',
    prop: 'answerMode',
    label: '',
    span: 24
  },
  {
    prop: 'title5',
    itemType: 'slotout',
    span: 24,
    label: ''
  },

  {
    itemType: 'slot',
    span: 24,
    prop: 'autoEvaluate',
    label: '自动评定是否通过'
  }
]
const title6Config = {
  prop: 'title6',
  itemType: 'slotout',
  span: 24,
  label: ''
}
const passTypeConfig = {
  itemType: 'slot',
  span: 24,
  prop: 'passType',
  label: ''
}
const fixedTimeConfig = {
  itemType: 'datePicker',
  span: 12,
  type: 'datetimerange',
  required: true,
  prop: 'fixedTime',
  label: '定时发布日期时间'
}
const pubulishColumns = [
  {
    itemType: 'radio',
    span: 12,
    prop: 'publishRules',
    label: '发布规则',
    options: [
      { label: '系统即时发布', value: 1 },
      { label: '定时自动发布', value: 2 }
    ]
  }
]
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
  name: 'Permission',
  components: {
    SwitchInput,
    achivementRadioInput
  },
  data() {
    return {
      personOptionProps,
      columns: EventColumns,
      pubulishColumns,
      currentRadio: 0,
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
      model: {
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
        openEntrance: false,
        isExamine: false,
        openResultsValue: 0, // 允许考生查看成绩 默认值0，表示永久
        modifyAnswer: false,
        modifyLimit: false,
        scopeLimit: false,
        scopeLimitValue: 100, // 最高分默认值100
        objectiveQuestions: false,
        decideItem: false,
        autoEvaluate: false,
        passType: 1,
        passScope: 0
      },
      pubulishModel: {
        publishRules: 1,
        fixedTime: []
      }
    }
  },
  watch: {
    'pubulishModel.publishRules': {
      handler(value) {
        const fixedTimeIndex = _.findIndex(this.pubulishColumns, (column) => {
          return column.prop === 'fixedTime'
        })
        const publishRulesIndex = _.findIndex(this.pubulishColumns, (column) => {
          return column.prop === 'publishRules'
        })
        // 1隐藏， 2显示
        if (value === 1) {
          this.pubulishColumns.splice(fixedTimeIndex, 1)
        } else {
          this.pubulishColumns.splice(publishRulesIndex + 1, 0, fixedTimeConfig)
        }
      },
      deep: true
    }
  },
  created() {},
  methods: {
    // 允许评卷人修改考生答案关联修改客观题
    modifyAnswerChange(value) {
      const index = _.findIndex(this.columns, (column) => {
        return column.prop === 'modifyAnswer'
      })
      const limitIndex = _.findIndex(this.columns, (column) => {
        return column.prop === 'modifyLimit'
      })
      if (value) {
        this.columns.splice(index + 1, 0, insertConfig)
      } else {
        this.columns.splice(limitIndex, 1)
      }
    },
    // 自动评定是否通过关联通过条件
    autoEvaluateChange(value) {
      const autoEvaluateIndex = _.findIndex(this.columns, (column) => {
        return column.prop === 'autoEvaluate'
      })
      const passTypeIndex = _.findIndex(this.columns, (column) => {
        return column.prop === 'passType'
      })
      const title6Index = _.findIndex(this.columns, (column) => {
        return column.prop === 'title6'
      })
      if (value) {
        this.columns.splice(autoEvaluateIndex + 1, 0, title6Config)
        this.columns.splice(autoEvaluateIndex + 2, 0, passTypeConfig)
      } else {
        this.columns.splice(passTypeIndex, 1)
        this.columns.splice(title6Index, 1)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.permission {
  /deep/ .el-form-item {
    margin-bottom: 0px;
  }
  .radio-group {
    display: flex;
    flex-direction: column;
    .radio-li {
      margin: 10px 0;
    }
  }
}
</style>
