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
    </common-form>
  </div>
</template>

<script>
const personOptionProps = {
  label: 'name',
  value: 'userId',
  key: 'userId'
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
    label: '生成试卷时打乱试题和选项顺序'
  },
  {
    itemType: 'switch',
    span: 24,
    prop: 'isShuffle',
    label: '交卷即时生成答案统计数据(建议大规模考试时不启用)'
  },
  {
    itemType: 'switch',
    span: 24,
    prop: 'createAnswers',
    label: '迟到后禁止考试'
  },
  {
    itemType: 'switch',
    span: 24,
    prop: 'lateBanExam',
    label: '答卷时间过少禁止交卷'
  },
  {
    itemType: 'switch',
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
    itemType: 'switch',
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
  }
]
export default {
  name: 'Permission',
  components: {},
  data() {
    return {
      personOptionProps,
      input: '',
      columns: EventColumns,
      model: {
        isLimitIp: true,
        isShuffle: true,
        createAnswers: true,
        lateBanExam: true,
        answerBanExam: true,
        preCreate: true,
        isHold: true,
        lateBanExamValue: 15, // 迟到15
        answerBanExamValue: 30, // 最低30分钟才可交卷
        preCreateValue: 10, // 预打印10份
        isDecoil: true,
        openResults: true,
        openAnswerSheet: true,
        selfMarking: true,
        publicAnswers: true,
        openEntrance: true,
        isExamine: true,
        openResultsValue: 0 // 默认值0，表示永久
      }
    }
  },
  created() {},
  methods: {}
}
</script>

<style scoped lang="scss">
.permission {
  /deep/ .el-form-item {
    margin-bottom: 0px;
  }
}
</style>
