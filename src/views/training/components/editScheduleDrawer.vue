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
          :loading="loading"
        >
          {{ loading ? '提交中 ...' : '保存' }}
        </el-button>
        <el-button @click="close">
          取消
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
const EventColumns = [
  {
    itemType: 'radio',
    prop: 'type',
    label: '类型',
    required: true,
    span: 24,
    options: [
      { label: '面授课程', value: 'course' },
      { label: '活动', value: 'event' }
    ]
  },
  { itemType: 'datePicker', span: 24, required: true, prop: 'eventDate', label: '活动日期' },
  {
    itemType: 'timePicker',
    span: 24,
    required: true,
    prop: 'eventTime',
    isRange: true,
    label: '活动时间'
  },
  { itemType: 'input', span: 24, required: true, prop: 'eventTheme', label: '活动主题' },
  { itemType: 'input', span: 24, required: true, prop: 'eventHost', label: '主持人' },
  { itemType: 'input', span: 24, prop: 'eventLocation', label: '授课地点' }
]
const CourseColumns = [
  {
    itemType: 'radio',
    prop: 'type',
    span: 24,
    label: '类型',
    required: true,
    options: [
      { label: '面授课程', value: 'course' },
      { label: '活动', value: 'event' }
    ]
  },
  {
    itemType: 'datePicker',
    span: 24,
    required: true,
    prop: 'courseDate',
    type: 'daterange',
    label: '授课日期'
  },
  {
    itemType: 'timePicker',
    span: 24,
    required: true,
    isRange: true,
    prop: 'courseTime',
    label: '授课时间'
  },
  {
    itemType: 'lazySelect',
    span: 24,
    required: true,
    prop: 'course',
    label: '关联课程',
    load: () => Promise.resolve({ data: [] })
  },
  { itemType: 'input', span: 24, disabled: true, prop: 'courseTeacher', label: '讲师' },
  { itemType: 'input', span: 24, prop: 'courseLocation', label: '授课地点' }
]
export default {
  name: 'EditScheduleDrawer',
  props: {
    schedule: { type: Object, default: null },
    visible: { type: Boolean, default: false }
  },
  data() {
    return {
      loading: false,
      columns: CourseColumns,
      model: {
        type: 'course',
        eventDate: '',
        eventTime: [],
        eventTheme: '',
        eventHost: '',
        eventLocation: '',
        courseDate: '',
        courseTime: [],
        course: null,
        courseLocation: ''
      }
    }
  },
  computed: {
    title() {
      if (this.schedule && this.schedule.scheduleId) {
        return '编辑线下日程'
      } else {
        return '创建线下日程'
      }
    },

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
    'model.type': {
      handler(value) {
        if (value === 'course') {
          this.columns = CourseColumns
        } else {
          this.columns = EventColumns
        }
      }
    }
  },
  methods: {
    close() {
      this.innnerVisible = false
    },
    submit() {
      this.$refs.form.validate().then(function() {
        // console.log('校验通过')
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
