<template>
  <div class="TestEnvironment">
    <CustomSwitch
      :config="switchConfig"
      :data.sync="model"
    />
  </div>
</template>

<script>
import CustomSwitch from '../atomComponents/customSwitch'
const switchConfig = [
  // {
  //   label: '启用IP限制(需设定考生合法IP范围)',
  //   prop: 'isLimitIp'
  // },
  // {
  //   label: '生成试卷时打乱试题和选项顺序',
  //   prop: 'isShuffle'
  // },
  // {
  //   label: '交卷即时生成答案统计数据(建议大规模考试时不启用)',
  //   prop: 'createAnswers'
  // },
  {
    label: '迟到后禁止考试',
    prop: 'lateBanExam',
    expand: {
      pre: '迟到',
      before: '分钟禁止参见考试'
    }
  },
  {
    label: '答卷时间过少禁止交卷',
    prop: 'answerBanExam',
    expand: {
      pre: '开始答卷',
      before: '分钟内禁止交卷'
    }
  }
  // {
  //   label: '启用试卷预生成服务',
  //   prop: 'preCreate',
  //   expand: {
  //     pre: '试卷最多预生成',
  //     before: '份'
  //   }
  // },
  // {
  //   label: '自动保存答案到服务器',
  //   prop: 'isHold'
  // }
]
export default {
  name: 'TestEnvironment',
  components: {
    CustomSwitch
  },
  data() {
    return {
      switchConfig,
      model: {
        id: '',
        isLimitIp: false,
        isShuffle: false,
        createAnswers: false,
        lateBanExam: false,
        answerBanExam: false,
        preCreate: true,
        isHold: false,
        lateBanExamValue: 15, // 迟到15
        answerBanExamValue: 30, // 最低30分钟才可交卷
        preCreateValue: 10 // 预打印10份
      }
    }
  },
  methods: {
    resetFields() {
      _.assign(this.$data, this.$options.data())
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
