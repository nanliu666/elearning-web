<template>
  <div>
    <common-form
      ref="form"
      :model="model"
      class="form"
      :columns="columns"
    />
    <el-checkbox v-model="checked">
      限制时长<el-input
        v-model="input"
        :disabled="!checked"
        style="width: 80px"
        placeholder="请输入内容"
      ></el-input>分钟
    </el-checkbox>
  </div>
</template>

<script>
import { createUniqueID } from '@/util/util'
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
  }
]
export default {
  name: 'BasicSetting',
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
        date: []
      }
    }
  },
  created() {},
  methods: {}
}
</script>

<style scoped lang="scss"></style>
