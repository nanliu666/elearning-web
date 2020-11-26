<template>
  <div class="ExamineePermissions">
    <CustomSwitch
      :config="switchConfig"
      :data.sync="model"
    />
  </div>
</template>

<script>
import CustomSwitch from './customSwitch'
const switchConfig = [
  {
    label: '允许考生查看本机资料(开卷考试)',
    prop: 'isDecoil'
  },
  {
    label: '允许考生查看成绩',
    prop: 'openResults',
    expand: {
      defaultValue: 0,
      pre: '考生在',
      before: '天内可以查看成绩（0代表永久）'
    }
  },
  {
    label: '允许考生查看答卷',
    prop: 'openAnswerSheet'
  },
  {
    label: '允许考生自己评卷',
    prop: 'selfMarking'
  },
  {
    label: '允许考生查看标准答案',
    prop: 'publicAnswers'
  },
  {
    label: '允许考生报名参加考试',
    prop: 'openEntrance'
  },
  {
    label: '考生报名考试需要审批',
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
      model: {
        isDecoil: 0,
        openResults: 0,
        openAnswerSheet: 0,
        selfMarking: 0,
        publicAnswers: 0,
        openEntrance: 0,
        isExamine: 0
      }
    }
  }
}
</script>

<style scoped lang="scss">
.ExamineePermissions {
  overflow: scroll;
  height: 100%;
}
</style>
