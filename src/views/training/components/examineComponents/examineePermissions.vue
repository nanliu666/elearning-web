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
    label: '允许考生查看本机资料(开卷考试)',
    prop: 'isDecoil',
    value: false
  },
  {
    label: '允许考生查看成绩',
    prop: 'openResults',
    value: false,
    expand: {
      defaultValue: 0,
      pre: '考生在',
      before: '天内可以查看成绩（0代表永久）'
    }
  },
  {
    label: '允许考生查看答卷',
    prop: 'openAnswerSheet',
    value: false
  },
  {
    label: '允许考生自己评卷',
    prop: 'selfMarking',
    value: false
  },
  {
    label: '允许考生查看标准答案',
    prop: 'publicAnswers',
    value: false
  },
  {
    label: '允许考生报名参加考试',
    prop: 'openEntrance',
    value: false
  },
  {
    label: '考生报名考试需要审批',
    value: false,
    prop: 'isExamine'
  }
]
export default {
  name: 'ExamineePermissions',
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
