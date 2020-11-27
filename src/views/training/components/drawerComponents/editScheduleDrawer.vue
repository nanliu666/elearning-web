<template>
  <el-drawer
    :title="title"
    :visible.sync="innnerVisible"
  >
    <div class="wrapper">
      <common-form
        ref="form"
        :model="model"
        class="form"
        :columns="columns"
      >
      </common-form>
      <div class="footer">
        <el-button
          type="primary"
          @click="submit"
        >
          保存
        </el-button>
        <el-button @click="close">
          取消
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { createUniqueID } from '@/util/util'
import moment from 'moment'
const EventColumns = [
  {
    itemType: 'radio',
    prop: 'type',
    label: '类型',
    required: true,
    span: 24,
    options: [
      { label: '面授课程', value: '1' },
      { label: '活动', value: '2' }
    ]
  },
  { itemType: 'datePicker', span: 24, required: true, prop: 'todoDate', label: '活动日期' },
  {
    itemType: 'timePicker',
    span: 24,
    required: true,
    prop: 'todoTime',
    isRange: true,
    label: '活动时间'
  },
  { itemType: 'input', span: 24, required: true, prop: 'theme', label: '活动主题' },
  { itemType: 'input', span: 24, required: true, prop: 'lecturerName', label: '主持人' },
  { itemType: 'input', span: 24, prop: 'address', label: '授课地点' }
]
const CourseColumns = [
  {
    itemType: 'radio',
    prop: 'type',
    span: 24,
    label: '类型',
    required: true,
    options: [
      { label: '面授课程', value: '1' },
      { label: '活动', value: '2' }
    ]
  },
  {
    itemType: 'datePicker',
    span: 24,
    required: true,
    prop: 'todoDate',
    label: '授课日期'
  },
  {
    itemType: 'timePicker',
    span: 24,
    required: true,
    isRange: true,
    pickerOptions: {
      step: '00:15'
    },
    prop: 'todoTime',
    label: '授课时间'
  },
  {
    itemType: 'lazySelect',
    span: 24,
    required: false,
    prop: 'course',
    label: '关联课程',
    load: () => Promise.resolve({ data: [] })
  },
  { itemType: 'input', span: 24, disabled: true, prop: 'lecturerName', label: '讲师' },
  { itemType: 'input', span: 24, prop: 'address', label: '授课地点' }
]
const modelCopy = {
  type: '1',
  todoDate: null,
  todoTime: [new Date(), new Date()],
  theme: '',
  lecturerName: null,
  lecturerId: null,
  address: '',
  courseId: null,
  courseName: null
}
export default {
  name: 'EditScheduleDrawer',
  props: {
    schedule: { type: Object, default: () => ({}) },
    visible: { type: Boolean, default: false }
  },
  data() {
    return {
      title: '创建线下日程',
      columns: CourseColumns,
      editType: 'add',
      model: modelCopy
    }
  },
  computed: {
    innnerVisible: {
      get: function() {
        return this.visible
      },
      set: function(value) {
        this.$emit('update:visible', value)
      }
    }
  },
  watch: {
    visible: {
      handler: function(val) {
        if (val) {
          if (_.isNumber(this.schedule.id)) {
            this.model = _.cloneDeep(this.schedule)
            this.title = '编辑线下日程'
            this.editType = 'edit'
          } else {
            // 新增的时候重置数据
            this.editType = 'add'
            this.model.id = createUniqueID()
          }
        }
      }
    },
    'model.type': {
      handler(value) {
        if (value === '1') {
          this.columns = CourseColumns
        } else {
          this.columns = EventColumns
        }
      }
    },
    schedule(value) {
      this.model = {
        ...modelCopy,
        ...value
      }
      if (value.todoDate) {
        this.model.todoDate = moment(value.todoDate).toDate()
        if (value.todoTime) {
          this.model.todoTime = value.todoTime.map((time) =>
            moment(value.todoDate + ' ' + time).toDate()
          )
        }
      }
    }
  },
  methods: {
    close() {
      this.innnerVisible = false
    },
    submit() {
      this.$refs.form.validate().then(() => {
        const data = this.model
        data.todoDate = moment(data.todoDate).format('YYYY-MM-DD')
        data.todoTime = data.todoTime.map((time) => moment(time).format('HH:mm'))
        this.$emit('submit', data, this.editType)
        this.close()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.form {
  padding: 0 30px;
  flex: 1;
}

.footer {
  display: flex;
  padding: 20px 0;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #f5f5f7;
}
</style>
