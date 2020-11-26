<template>
  <div class="TestEnvironment">
    <CustomSwitch
      :config="switchConfig"
      :data.sync="switchForm"
    />
  </div>
</template>

<script>
import CustomSwitch from './customSwitch'
const switchConfig = [
  {
    label: '启用IP限制(需设定考生合法IP范围)',
    prop: 'isLimitIp'
  },
  {
    label: '生成试卷时打乱试题和选项顺序',
    prop: 'isShuffle'
  },
  {
    label: '交卷即时生成答案统计数据(建议大规模考试时不启用)',
    prop: 'createAnswers'
  },
  {
    label: '迟到后禁止考试',
    prop: 'lateBanExam',
    expand: {
      defaultValue: 15,
      pre: '迟到',
      before: '分钟禁止参见考试'
    }
  },
  {
    label: '答卷时间过少禁止交卷',
    prop: 'answerBanExam',
    expand: {
      defaultValue: 30,
      pre: '开始答卷',
      before: '分钟内禁止交卷'
    }
  },
  {
    label: '启用试卷预生成服务',
    prop: 'preCreate',
    expand: {
      pre: '试卷最多预生成',
      defaultValue: 10,
      before: '份'
    }
  },
  {
    label: '自动保存答案到服务器',
    prop: 'isHold'
  }
]
export default {
  name: 'TestEnvironment',
  components: {
    CustomSwitch
  },
  data() {
    return {
      switchConfig,
      switchForm: {
        isLimitIp: 0,
        isShuffle: 0,
        createAnswers: 0,
        lateBanExam: 0,
        answerBanExam: 0,
        preCreate: 0,
        isHold: 0
      }
    }
  }
}
</script>

<style scoped lang="scss">
.TestEnvironment {
  overflow: scroll;
  height: 100%;
}
</style>
