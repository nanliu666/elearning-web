<template>
  <el-drawer
    :title="title"
    :visible.sync="innnerVisible"
  >
    <div class="wrapper">
      <common-form
        v-if="innnerVisible"
        ref="form"
        :model="model"
        class="form"
        :columns="columns"
      >
        <template #courseId>
          <lazy-select
            v-model="model.courseId"
            :searchable="true"
            :load="loadCourse"
            :option-props="{ label: 'courseName', value: 'courseId', key: 'courseId' }"
            @select="selectCourse"
          />
        </template>
        <template #classroomId>
          <div class="classroom__container">
            <lazy-select
              ref="classroomRef"
              v-model="model.classroomId"
              :searchable="true"
              :first-option="classroomDefault"
              :load="loadClassroom"
              :option-props="{ label: 'roomName', value: 'id', key: 'id' }"
              @select="selectClassroom"
            />
            <div
              class="classroom__title"
              :class="{ active__title: model.todoDate }"
              @click="viewReserve"
            >
              预定情况
            </div>
          </div>
        </template>
        <template #lecturerId>
          <lazy-select
            v-model="model.lecturerId"
            :disabled="model.type === 1"
            :searchable="true"
            :first-option="lecturerDefault"
            :load="loadCoordinator"
            :option-props="{ label: 'name', value: 'userId', key: 'userId' }"
            @select="selectLecturer"
          />
        </template>
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
    <classroom-reserve
      :visible.sync="reserveVisible"
      :params="reserveParams"
    />
  </el-drawer>
</template>

<script>
import { getOrgUserList } from '@/api/system/user'
import { getTrainCource, getBookList } from '@/api/train/train'
import moment from 'moment'
import ClassroomReserve from './ClassroomReserve'
const EventColumns = [
  {
    itemType: 'radio',
    prop: 'type',
    label: '类型',
    required: true,
    span: 24,
    options: [
      { label: '面授课程', value: 1 },
      { label: '活动', value: 2 }
    ]
  },
  {
    itemType: 'datePicker',
    span: 24,
    prop: 'todoDate',
    label: '活动日期'
  },
  {
    itemType: 'timePicker',
    span: 24,
    required: true,
    prop: 'todoTime',
    isRange: true,
    label: '活动时间'
  },
  {
    itemType: 'slot',
    span: 24,
    required: true,
    prop: 'classroomId',
    label: '活动教室'
  },
  { itemType: 'input', span: 24, required: true, prop: 'theme', maxLength: 32, label: '活动主题' },
  { itemType: 'slot', span: 24, required: true, prop: 'lecturerId', label: '主持人' }
]
const CourseColumns = [
  {
    itemType: 'radio',
    prop: 'type',
    span: 24,
    label: '类型',
    required: true,
    options: [
      { label: '面授课程', value: 1 },
      { label: '活动', value: 2 }
    ]
  },
  {
    itemType: 'datePicker',
    span: 24,
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
    itemType: 'slot',
    span: 24,
    required: true,
    prop: 'classroomId',
    label: '授课教室'
  },
  {
    itemType: 'slot',
    span: 24,
    required: true,
    prop: 'courseId',
    label: '关联课程'
  },
  { itemType: 'slot', span: 24, prop: 'lecturerId', label: '讲师' }
]
// 教室时间的使用范围为06:00-23:00
const START_TIME = moment().set({ hour: 6, minute: 0, second: 0 })
const END_TIME = moment().set({ hour: 23, minute: 0, second: 0 })
import { mapGetters } from 'vuex'
export default {
  name: 'OfflineCourseDrawer',
  components: {
    LazySelect: () => import('@/components/lazy-select/lazySelect'),
    ClassroomReserve
  },
  props: {
    schedule: { type: Object, default: () => ({}) },
    visible: { type: Boolean, default: false }
  },
  data() {
    return {
      classroomDefault: [],
      lecturerDefault: [],
      reserveVisible: false,
      title: '创建线下日程',
      columns: CourseColumns,
      editType: 'add',
      model: {
        type: 1,
        todoDate: null,
        theme: null,
        // 给datepick显示用的数据
        todoTime: [START_TIME, END_TIME],
        // 入参数据，以及列表的展示数据
        todoTimeParams: [START_TIME.format('HH:mm'), END_TIME.format('HH:mm')],
        lecturerId: null,
        lecturerName: null,
        classroomId: null,
        courseId: null,
        courseName: null
      }
    }
  },
  computed: {
    ...mapGetters(['trainTimeInVuex']),
    reserveParams() {
      return {
        todoDate: this.model.todoDate,
        startTime: _.get(this.model, 'todoTimeParams[0]'),
        endTime: _.get(this.model, 'todoTimeParams[1]')
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
    visible: {
      handler: function(val) {
        if (val) {
          if (!_.isEmpty(this.schedule)) {
            this.initEditData()
            this.title = '编辑线下日程'
            this.editType = 'edit'
          } else {
            // 新增的时候重置数据
            this.editType = 'add'
            _.assign(this.$data, this.$options.data())
            _.set(this.model, 'id', _.uniqueId())
          }
        }
      }
    },
    reserveParams: {
      handler() {
        // 拉取课室的前提条件
        this.$refs.form &&
          this.$refs.form.validateField('todoDate', (value) => {
            if (_.isEmpty(value)) {
              // 手动更新教室列表
              this.$refs.classroomRef.loadOptionData(true)
            }
          })
      },
      deep: true
    },
    'model.todoTime': {
      handler() {
        this.model.todoTimeParams = [
          moment(this.model.todoTime[0]).format('HH:mm'),
          moment(this.model.todoTime[1]).format('HH:mm')
        ]
      },
      deep: true
    },
    'model.type': {
      handler(value) {
        if (value === 1) {
          this.columns = CourseColumns
        } else {
          this.columns = EventColumns
        }
        this.$refs.form && this.$refs.form.clearValidate()
        this.setRules()
      },
      deep: true,
      immediate: true
    },
    'model.todoDate': {
      handler(value) {
        if (!value) {
          this.model.classroomId = ''
          this.model.classroomName = ''
        }
      },
      deep: true
    }
  },
  methods: {
    // 初始编辑的数据
    initEditData() {
      this.model = _.assign(this.model, _.cloneDeep(this.schedule))
      if (this.model.todoDate) {
        this.model.todoDate = moment(this.model.todoDate).toDate()
      }
      // 初始化教室、讲师默认值
      if (this.model.lecturerId) {
        this.lecturerDefault = [
          {
            userId: this.model.lecturerId,
            name: this.model.lecturerName
          }
        ]
      }
      if (this.model.classroomId) {
        this.classroomDefault = [
          {
            roomName: this.model.classroomName,
            id: this.model.classroomId
          }
        ]
      }
    },
    setRules() {
      const todoDateProps = _.find(this.columns, { prop: 'todoDate' })
      const todoDateRules = [
        { required: true, validator: this.validateTodoDate, trigger: ['blur', 'change'] }
      ]
      _.set(todoDateProps, 'rules', todoDateRules)
    },
    // 授课开始时间大于等于培训开始时间，授课结束时间要小于等于培训结束时间
    validateTodoDate(rule, value, callback) {
      if (_.isEmpty(this.trainTimeInVuex)) {
        callback(new Error('请先选择培训时间'))
      } else {
        // 授课开始时间要在考试时间之间
        const isLegalTime = moment(this.model.todoDate).isBetween(
          moment(this.trainTimeInVuex[0]),
          moment(this.trainTimeInVuex[1])
        )
        // 与培训开始日期或结束日期相同
        const isSame =
          moment(this.model.todoDate).isSame(this.trainTimeInVuex[0]) ||
          moment(this.model.todoDate).isSame(this.trainTimeInVuex[1])
        if (!isLegalTime && !isSame) {
          callback(
            new Error(
              `${this.model.type === 1 ? '授课' : '活动'}日期要在培训日期（${
                this.trainTimeInVuex[0]
              }至${this.trainTimeInVuex[1]}）之间`
            )
          )
        } else {
          callback()
        }
      }
    },
    // 选择了教室的数据处理。教室名称赋值
    selectClassroom(data) {
      _.set(this.model, 'classroomName', data.roomName)
    },
    // 选择了讲师的数据处理。讲师名称赋值
    selectLecturer(data) {
      _.set(this.model, 'lecturerName', data.name)
    },
    // 查看预定情况
    viewReserve() {
      if (!this.model.todoDate) return
      this.reserveVisible = true
    },
    selectCourse(data) {
      this.model = _.assign(this.model, data)
      this.model.lecturerName = data.name
      this.model.lecturerId = data.userId
      this.lecturerDefault = [
        {
          name: data.name,
          userId: data.userId
        }
      ]
    },
    loadCoordinator(params) {
      return getOrgUserList(_.assign(params, { orgId: 0 }))
    },
    loadClassroom(params) {
      const param = _.assign(params, this.reserveParams)
      return getBookList(param)
    },
    loadCourse(params) {
      //courseType 2-线下日程
      return getTrainCource(_.assign(params, { courseType: 2 }))
    },
    close() {
      this.innnerVisible = false
    },
    submit() {
      this.$refs.form.validate().then(() => {
        const data = _.cloneDeep(this.model)
        data.todoDate = moment(data.todoDate).format('YYYY-MM-DD')
        this.$emit('submit', { data: data, type: this.editType })
        this.close()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.classroom__container {
  position: relative;
  .classroom__title {
    position: absolute;
    right: 0;
    top: -30px;
    font-size: 12px;
    color: #dadada;
  }
  .active__title {
    cursor: pointer;
    color: #606266;
  }
}
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
