<template>
  <div class="basecSetting">
    <common-form
      ref="form"
      :model="model"
      class="form"
      :columns="columns"
    >
      <template #testPaper>
        <lazy-select
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
      <template #reviewer>
        <lazy-select
          v-model="model.reviewer"
          :allow-create="true"
          :searchable="true"
          :load="loadCoordinator"
          :multiple="true"
          :option-props="{ label: 'name', value: 'userId', key: 'userId' }"
        />
      </template>
      <template #reckonTime>
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

      <template #joinNum>
        <el-radio-group v-model="model.joinNum">
          <div class="flex-flow flex flexcenter">
            <el-radio :label="0">
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
        ></checkbox-input>
      </template>
    </common-form>
  </div>
</template>

<script>
import RadioInput from '@/components/radio-input/radio-input'
import CheckboxInput from '@/components/checkbox-input/checkbox-input'
const EventColumns = [
  {
    itemType: 'datePicker',
    span: 24,
    type: 'datetimerange',
    required: true,
    valueFormat: 'yyyy-MM-dd HH:mm:ss',
    prop: 'examTime',
    label: '考试日期'
  },
  {
    itemType: 'input',
    span: 24,
    required: true,
    prop: 'examName',
    label: '考试名称'
  },
  { itemType: 'slot', span: 24, required: true, prop: 'testPaper', label: '关联用卷' },
  { itemType: 'slot', span: 24, required: false, prop: 'reviewer', label: '评卷人' },
  {
    itemType: 'radio',
    prop: 'answerMode',
    label: '答题模式',
    span: 24,
    options: [
      { label: '整卷模式', value: 1 },
      { label: '逐卷模式', value: 2 }
    ]
  },
  {
    itemType: 'slot',
    prop: 'reckonTime',
    label: '考试时长',
    span: 24
  },
  {
    itemType: 'slot',
    prop: 'joinNum',
    label: '参加次数',
    span: 24
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
    span: 24
  },
  {
    itemType: 'slot',
    prop: 'publishTime',
    label: '发布考试',
    span: 24
  }
]
import { getOrgUserList } from '@/api/system/user'
import { getExamList } from '@/api/examManage/schedule'

export default {
  name: 'BasicSetting',
  components: {
    RadioInput,
    CheckboxInput,
    LazySelect: () => import('@/components/lazy-select/lazySelect')
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
        reviewer: null,
        answerMode: 1,
        reckonTime: false,
        reckonTimeValue: 60, // 限制时长60分钟
        joinNum: false,
        joinNumValue: 3, // 默认参加次数，不超过3次
        integral: 0,
        strategy: 0,
        publishTime: 0
      }
    }
  },
  created() {},
  methods: {
    loadCoordinator(params) {
      return getOrgUserList(_.assign(params, { orgId: this.$store.getters.userInfo.org_id }))
    },
    loadTestPaper(params) {
      return getExamList(params)
    }
  }
}
</script>

<style scoped lang="scss">
.basecSetting {
  overflow: scroll;
  height: 100%;
}
</style>
