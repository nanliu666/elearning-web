<template>
  <div>
    <common-form
      ref="form"
      :model="model"
      class="form"
      :columns="columns"
    >
      <template #testTime>
        <el-radio-group v-model="model.testTime">
          <el-radio :label="0">
            不计时
          </el-radio>
          <radioInput
            v-model="model.testTime"
            text-before="限制时长"
            text-after="分钟"
            :input-width="60"
            :input-props="{ maxLength: 4 }"
          ></radioInput>
        </el-radio-group>
      </template>

      <template #testNumber>
        <el-radio-group v-model="model.testNumber">
          <div class="flex-flow flex flexcenter">
            <el-radio :label="0">
              不限次数
            </el-radio>
            <radioInput
              v-model="model.testNumber"
              text-before="限制次数 不超过"
              text-after="次"
              :input-width="60"
              :input-props="{ maxLength: 4 }"
            ></radioInput>
          </div>
        </el-radio-group>
      </template>
    </common-form>
  </div>
</template>

<script>
import { createUniqueID } from '@/util/util'
import radioInput from './radioInput'
const EventColumns = [
  {
    itemType: 'datePicker',
    span: 24,
    required: true,
    prop: 'date',
    type: 'daterange',
    label: '考试日期'
  },
  {
    itemType: 'input',
    span: 24,
    required: true,
    prop: 'name',
    label: '考试名称'
  },
  // TODO：关联课程应该用lazy-select
  { itemType: 'input', span: 24, required: true, prop: 'courses', label: '关联用卷' },
  { itemType: 'input', span: 24, required: false, prop: 'teacher', label: '评卷人' },
  {
    itemType: 'radio',
    prop: 'type',
    label: '考试名称',
    required: true,
    span: 24,
    options: [
      { label: '必修', value: 'compulsory' },
      { label: '选修', value: 'elective' }
    ]
  },
  {
    itemType: 'slot',
    prop: 'testTime',
    label: '考试时长',
    required: true,
    span: 24,
    options: [
      { label: '必修', value: 'compulsory' },
      { label: '选修', value: 'elective' }
    ]
  },
  {
    itemType: 'slot',
    prop: 'testNumber',
    label: '参加次数',
    required: true,
    span: 24
  },
  {
    itemType: 'radio',
    prop: 'type',
    label: '考试名称',
    required: true,
    span: 24,
    options: [
      { label: '允许进入考试的时间', value: 'compulsory' },
      { label: '允许参考时间（到结束时间，会自动提交。）', value: 'elective' }
    ]
  }
]
export default {
  name: 'BasicSetting',
  components: {
    radioInput
  },
  data() {
    return {
      checked: true,
      input: '',
      columns: EventColumns,
      model: {
        id: createUniqueID(),
        type: 'compulsory',
        courses: '',
        teacher: '',
        date: [],
        testTime: 0,
        testNumber: 0
      }
    }
  },
  created() {},
  methods: {}
}
</script>

<style scoped lang="scss"></style>
