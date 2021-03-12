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
            @select="selectContact"
          />
        </template>
        <template #classroomId>
          <div class="classroom__container">
            <lazy-select
              v-model="model.classroomId"
              :disabled="!model.todoDate"
              :searchable="true"
              :load="loadClassroom"
              :option-props="{ label: 'roomName', value: 'id', key: 'id' }"
              @select="selectClassroom"
            />
            <div
              class="classroom__title"
              :class="{ active__title: model.todoDate }"
              @click="viewReserve"
            >
              预订情况
            </div>
          </div>
        </template>
        <template #lecturerName>
          <lazy-select
            v-if="model.type === 1"
            v-model="model.lecturerName"
            :disabled="true"
            :searchable="true"
            :load="loadCoordinator"
            :option-props="{ label: 'name', value: 'userId', key: 'userId' }"
          />
          <el-input
            v-if="model.type === 2"
            v-model="model.lecturerName"
            maxlength="32"
            placeholder="请输入主持人"
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
  { itemType: 'datePicker', span: 24, required: true, prop: 'todoDate', label: '活动日期' },
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
  { itemType: 'input', span: 24, required: true, prop: 'courseName', label: '活动主题' },
  { itemType: 'slot', span: 24, required: true, prop: 'lecturerName', label: '主持人' },
  { itemType: 'input', span: 24, prop: 'address', label: '活动地点' }
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
  { itemType: 'slot', span: 24, prop: 'lecturerName', label: '讲师' },
  { itemType: 'input', span: 24, prop: 'address', label: '授课地点' }
]
const modelCopy = {
  type: 1,
  todoDate: null,
  todoTime: [moment().startOf('day'), moment().endOf('day')],
  lecturerName: null,
  classroomId: null,
  address: '',
  courseId: null,
  courseName: null
}
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
      reserveVisible: false,
      userList: [],
      title: '创建线下日程',
      columns: CourseColumns,
      editType: 'add',
      model: modelCopy
    }
  },
  computed: {
    reserveParams() {
      return {
        todoDate: this.model.todoDate,
        startTime: moment(_.get(this.model, 'todoTime[0]')).format('HH:mm'),
        endTime: moment(_.get(this.model, 'todoTime[1]')).format('HH:mm')
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
            this.model = _.cloneDeep(this.schedule)
            this.title = '编辑线下日程'
            this.editType = 'edit'
          } else {
            // 新增的时候重置数据
            this.editType = 'add'
            this.model.id = _.uniqueId('12454611451154')
          }
        }
      }
    },
    reserveParams: {
      handler() {
        this.loadClassroom()
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
      }
    },
    'model.todoDate': {
      handler(value) {
        if (!value) {
          this.model.classroomId = ''
          this.model.classroomName = ''
        }
      },
      deep: true
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
    // 选择了教室的数据处理。教室名称赋值
    selectClassroom(data) {
      _.set(this.model, 'classroomName', data.roomName)
    },
    // 查看预订情况
    viewReserve() {
      if (!this.model.todoDate) return
      this.reserveVisible = true
    },
    selectContact(data) {
      this.model = _.assign(this.model, data)
    },
    loadCoordinator(params) {
      getOrgUserList(_.assign(params, { orgId: 0 })).then((res) => {
        this.userList = [...this.userList, ...res.data]
      })
      return getOrgUserList(_.assign(params, { orgId: 0 }))
    },
    loadClassroom(params) {
      return getBookList(_.assign(params, this.reserveParams))
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
