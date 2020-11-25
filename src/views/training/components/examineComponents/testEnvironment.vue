<template>
  <div>
    <CustomSwitch
      :config="switchConfig"
      :data.sync="switchForm"
    />
  </div>
</template>

<script>
import { createUniqueID } from '@/util/util'
import CustomSwitch from './customSwitch'
const switchConfig = [
  {
    label: '启用IP限制(需设定考生合法IP范围)',
    prop: 'isLimitIp',
    value: false
  },
  {
    label: '生成试卷时打乱试题和选项顺序',
    prop: 'isShuffle',
    value: false
  },
  {
    label: '交卷即时生成答案统计数据(建议大规模考试时不启用)',
    prop: 'createAnswers',
    value: false
  },
  {
    label: '迟到后禁止考试',
    prop: 'lateBanExam',
    value: false,
    expand: {
      defaultValue: 15,
      pre: '迟到',
      before: '分钟禁止参见考试'
    }
  },
  {
    label: '答卷时间过少禁止交卷',
    prop: 'answerBanExam',
    value: false,
    expand: {
      defaultValue: 30,
      pre: '开始答卷',
      before: '分钟内禁止交卷'
    }
  },
  {
    label: '启用试卷预生成服务',
    prop: 'preCreate',
    value: false,
    expand: {
      defaultValue: 10,
      pre: '试卷最多预生成',
      before: '份'
    }
  },
  {
    label: '自动保存答案到服务器',
    value: false,
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
      switchForm: {},
      model: {
        id: createUniqueID()
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
