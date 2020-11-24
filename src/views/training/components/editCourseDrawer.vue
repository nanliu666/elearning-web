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
      />
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
const EventColumns = [
  {
    itemType: 'datePicker',
    span: 24,
    required: true,
    prop: 'date',
    type: 'daterange',
    label: '上课日期'
  },
  // TODO：关联课程应该用lazy-select
  { itemType: 'input', span: 24, required: true, prop: 'courses', label: '关联课程' },
  { itemType: 'input', span: 24, required: false, prop: 'teacher', label: '讲师' },
  {
    itemType: 'radio',
    prop: 'type',
    label: '修读类型',
    required: true,
    span: 24,
    options: [
      { label: '必修', value: 'compulsory' },
      { label: '选修', value: 'elective' }
    ]
  }
]
export default {
  name: 'EditCourseDrawer',
  props: {
    course: { type: Object, default: null },
    visible: { type: Boolean, default: false }
  },
  data() {
    return {
      columns: EventColumns,
      title: '添加在线课程',
      model: {
        id: createUniqueID(),
        type: 'compulsory',
        courses: '',
        teacher: '',
        date: []
      }
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
          if (!_.isEmpty(this.course)) {
            this.model = _.cloneDeep(this.course)
            this.title = '编辑在线课程'
          } else {
            this.$refs.form.resetFields()
          }
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
        this.close()
        this.$emit('submit', this.model)
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
