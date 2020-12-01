<template>
  <div class="basecSetting">
    <common-form
      ref="form"
      :model="model"
      class="form"
      :columns="columns"
    >
      <template #title1>
        基础信息
      </template>
      <template #title2>
        基础设置
      </template>

      <template #reckonTime>
        <el-radio-group v-model="model.reckonTime">
          <el-radio :label="0">
            不计时
          </el-radio>
          <radioInput
            v-model="model.reckonTime"
            text-before="限制时长"
            text-after="分钟"
            :input-width="60"
            :input-props="{ maxLength: 4 }"
          ></radioInput>
        </el-radio-group>
      </template>

      <template #joinNum>
        <el-radio-group v-model="model.joinNum">
          <div class="flex-flow flex flexcenter">
            <el-radio :label="0">
              不限次数
            </el-radio>
            <radioInput
              v-model="model.joinNum"
              text-before="限制次数 不超过"
              text-after="次"
              :input-width="60"
              :input-props="{ maxLength: 4 }"
            ></radioInput>
          </div>
        </el-radio-group>
      </template>
      <template #integral>
        <checkbox-input
          v-model="model.integral"
          text-before="本考试记录系统积分，积分值为"
          text-after="分"
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
          :input-props="{ maxLength: 4 }"
        ></checkbox-input>
      </template>
    </common-form>
  </div>
</template>

<script>
import radioInput from '@/components/radioInput/radioInput'
import checkboxInput from '@/components/checkboxInput/checkboxInput'
const EventColumns = [
  {
    prop: 'title1',
    itemType: 'slotout',
    span: 24,
    label: ''
  },
  {
    itemType: 'input',
    span: 11,
    required: true,
    prop: 'examName',
    label: '考试名称'
  },
  {
    itemType: 'select',
    span: 11,
    offset: 2,
    required: true,
    options: [],
    prop: 'examName1',
    label: '考试分类'
  },
  {
    itemType: 'select',
    span: 11,
    required: true,
    options: [],
    prop: 'examName2',
    label: '考试用卷'
  },
  { itemType: 'input', span: 11, offset: 2, required: false, prop: 'reviewer', label: '评卷人' },
  { itemType: 'switch', span: 11, required: false, prop: 'reviewer1', label: '是否发放证书' },
  { itemType: 'input', span: 11, offset: 2, required: true, prop: 'testPaper', label: '证书模板' },
  {
    prop: 'title2',
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
    prop: 'reckonTime',
    label: '考试时长',
    offset: 2,
    span: 11
  },
  {
    itemType: 'slot',
    prop: 'joinNum',
    label: '参加次数',
    span: 11
  },
  {
    itemType: 'slot',
    prop: 'joinNum1',
    label: '补考次数',
    offset: 2,
    span: 11
  },
  {
    itemType: 'radio',
    prop: 'strategy',
    label: '考试时间策略',
    span: 24,
    options: [
      { label: '允许进入考试的时间', value: 0 },
      { label: '允许参考时间（到结束时间，会自动提交。）', value: 1 }
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
  }
]
export default {
  name: 'BasicSetting',
  components: {
    radioInput,
    checkboxInput
  },
  data() {
    return {
      input: '',
      columns: EventColumns,
      model: {
        id: '',
        examTime: '',
        examName: '',
        testPaper: '',
        reviewer: '',
        answerMode: 1,
        reckonTime: 0,
        joinNum: 0,
        integral: 0,
        strategy: 0,
        publishTime: 0
      }
    }
  },
  created() {},
  methods: {}
}
</script>

<style scoped lang="scss">
.basecSetting {
  overflow: scroll;
  height: 100%;
}
</style>
