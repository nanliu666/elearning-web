<template>
  <div class="editArrangement">
    <section
      v-if="trainWay === 2 || trainWay === 3"
      class="schedule"
    >
      <div class="header">
        <span class="header--title">线下日程</span>
        <el-button
          type="primary"
          size="medium"
          @click="handleEditSchedule({})"
        >
          添加线下日程
        </el-button>
      </div>
      <el-collapse
        v-model="activeName"
        accordion
      >
        <el-collapse-item
          v-for="(item, index) in scheduleList"
          :key="item.date"
          :name="item.date"
          :title="`第${index + 1}天 ${item.date}`"
        >
          <common-table
            :config="schedule.config"
            :columns="schedule.columns"
            :data="item.list"
          >
            <template #handler="{row}">
              <el-button
                type="text"
                @click="handleEditSchedule(row)"
              >
                修改
              </el-button>
              <el-button
                type="text"
                @click="handleDeleteSchedule(row)"
              >
                删除
              </el-button>
            </template>
          </common-table>
        </el-collapse-item>
        <el-collapse-item
          v-if="scheduleList.length === 0"
          name="0"
          title=""
          class="empty-collapse-item"
        >
          <div class="empty-block">
            暂无数据
          </div>
        </el-collapse-item>
      </el-collapse>
    </section>
    <section
      v-if="trainWay === 1 || trainWay === 3"
      class="courses"
    >
      <div class="header">
        <span class="header--title">在线课程</span>
        <el-button
          type="primary"
          size="medium"
          @click="handleEditCourse(null)"
        >
          添加在线课程
        </el-button>
      </div>
      <common-table
        :config="course.config"
        :columns="course.columns"
        :data="course.data"
      >
        <template #classTime="{row}">
          {{ row.classTime[0] }} 至 {{ row.classTime[1] }}
        </template>
        <template #studyType="{row}">
          {{ row.studyType === '0' ? '必修' : '选修' }}
        </template>
        <template #handler="{row}">
          <el-button
            type="text"
            @click="handleEditCourse(row)"
          >
            修改
          </el-button>
          <el-button
            type="text"
            @click="handleDeleteCourse(row)"
          >
            删除
          </el-button>
        </template>
      </common-table>
    </section>
    <section class="test">
      <div class="header">
        <span class="header--title">考试安排</span>
        <el-button
          type="primary"
          size="medium"
          @click="handleEditExamine(null)"
        >
          添加考试
        </el-button>
      </div>
      <common-table
        :config="examine.config"
        :columns="examine.columns"
        :data="examine.data"
      >
        <template #reckonTime="{row}">
          {{ row.reckonTime === 0 ? '不计时' : row.reckonTime }}
        </template>
        <template #handler="{row}">
          <el-button
            type="text"
            @click="handleEditExamine(row)"
          >
            修改
          </el-button>
          <el-button
            type="text"
            @click="handleDeleteExamine(row)"
          >
            删除
          </el-button>
        </template>
      </common-table>
    </section>
    <EditScheduleDrawer
      :visible.sync="schedule.drawerVisible"
      :schedule="schedule.editingRecord"
      @submit="handleSubmitSchedule($event)"
    />
    <EditCourseDrawer
      :visible.sync="course.drawerVisible"
      :course="course.editingRecord"
      @submit="courseSubmit"
    />
    <EditExamineDrawer
      :visible.sync="examine.drawerVisible"
      :examine="examine.editingRecord"
      @submit="examineSubmit"
    />
  </div>
</template>

<script>
import EditScheduleDrawer from './drawerComponents/editScheduleDrawer'
import EditCourseDrawer from './drawerComponents/editCourseDrawer'
import EditExamineDrawer from './drawerComponents/editExamineDrawer'
const ScheduleColumns = [
  {
    prop: 'todoTime',
    formatter: function(record) {
      return record.todoTime.join(' ~ ')
    }
  },
  {
    prop: 'title',
    minWidth: 150,
    formatter(record) {
      if (record.type === '1') {
        return `【面授课程】${record.courseName}`
      } else {
        return `【活动】${record.theme}`
      }
    }
  },
  {
    prop: 'lecturerName',
    formatter(record) {
      if (record.type === '1') {
        return `讲师：${record.lecturerName}`
      } else {
        return `主持人：${record.lecturerName}`
      }
    }
  },
  {
    prop: 'address',
    formatter(record) {
      return `地点：${record.address}`
    }
  }
]
const ScheduleConfig = {
  showHeader: false,
  showHandler: true,
  handlerColumn: { label: '操作', width: 150 }
}
const CourseColumns = [
  {
    prop: 'classTime',
    slot: true,
    label: '上课日期',
    width: 220
  },
  {
    prop: 'courseName',
    label: '关联课程',
    minWidth: 150
  },
  {
    prop: 'lecturerName',
    label: '讲师'
  },
  { prop: 'studyType', slot: true, label: '修读类型' }
]
const CourseConfig = {
  showHandler: true,
  handlerColumn: { label: '操作', width: 150 }
}
const TestColumns = [
  { prop: 'examTime', label: '考试日期', width: 220 },
  { prop: 'testPaper', label: '关联考试', minWidth: 150 },
  { prop: 'reckonTime', slot: true, label: '考试时间(分钟)' }
]
const TestConfig = {
  showHandler: true,
  handlerColumn: { label: '操作', width: 150 }
}
export default {
  name: 'EditArrangement',
  components: { EditScheduleDrawer, EditCourseDrawer, EditExamineDrawer },
  props: {
    trainWay: {
      type: Number,
      default: 3 //1在线，2面授，3混合
    }
  },
  data() {
    return {
      activeName: '0',
      schedule: {
        config: ScheduleConfig,
        columns: ScheduleColumns,
        drawerVisible: false,
        editingRecord: {},
        data: []
      },
      course: {
        config: CourseConfig,
        columns: CourseColumns,
        drawerVisible: false,
        editingRecord: {},
        data: []
      },
      examine: {
        config: TestConfig,
        columns: TestColumns,
        drawerVisible: false,
        editingRecord: {},
        data: []
      }
    }
  },
  computed: {
    scheduleList() {
      return _.chain(this.schedule.data)
        .groupBy('todoDate')
        .map((list) => ({
          date: list[0].todoDate,
          list: _.sortBy(list, (i) => i.todoTime && i.todoTime[0])
        }))
        .value()
    }
  },
  methods: {
    getData() {
      return new Promise((resolve) => {
        resolve({
          trainOfflineTodo: this.schedule.data,
          trainOnlineCourse: this.course.data,
          trainExam: this.examine.data
        })
      })
    },
    // 新增与编辑考试
    handleEditExamine(row) {
      this.examine.editingRecord = row
      this.examine.drawerVisible = true
    },
    // 考试安排提交后
    examineSubmit(data, type) {
      if (type == 'add') {
        this.examine.data.push(data)
      } else {
        let index = _.findIndex(this.examine.data, (item) => {
          return item.id === data.id
        })
        this.$set(this.examine.data, index, data)
      }
    },
    // 删除考试安排
    handleDeleteExamine(row) {
      let index = _.findIndex(this.examine.data, (item) => item.id === row.id)
      this.examine.data.splice(index, 1)
    },
    // 新增与编辑在线课程
    handleEditCourse(row) {
      this.course.editingRecord = row
      this.course.drawerVisible = true
    },
    // 在线课程提交后
    courseSubmit(data, type) {
      if (type == 'add') {
        this.course.data.push(data)
      } else {
        let index = _.findIndex(this.course.data, (item) => {
          return item.id === data.id
        })
        this.$set(this.course.data, index, data)
      }
    },
    // 删除在线课程
    handleDeleteCourse(row) {
      let index = _.findIndex(this.course.data, (item) => item.id === row.id)
      this.course.data.splice(index, 1)
    },
    // 编辑与新增线下日程
    handleEditSchedule(row) {
      this.schedule.editingRecord = row
      this.schedule.drawerVisible = true
    },
    // 删除线下日程
    handleDeleteSchedule(row) {
      this.schedule.data = this.schedule.data.filter((item) => item !== row)
    },
    // 线下日程提交后的数据处理
    handleSubmitSchedule(data) {
      const index = _.findIndex(this.schedule.data, { id: data.id })
      if (index >= 0) {
        this.$set(this.schedule.data, index, data)
      } else {
        this.schedule.data.push(data)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.editArrangement {
  background-color: #fff;
  padding: 20px;
  min-height: calc(100% - 30px);
  margin-bottom: 30px;
  section {
    margin-bottom: 30px;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      margin-bottom: 8px;
      font-size: 16px;
    }
  }
  /deep/.el-collapse-item__header {
    background-color: #f7f8fa;
  }
  .empty-block {
    margin-top: 25px;
    line-height: 20px;
    text-align: center;
    color: #718199;
  }
}
</style>
