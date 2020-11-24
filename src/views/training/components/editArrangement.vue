<template>
  <div class="editArrangement">
    <section class="schedule">
      <div class="header">
        <span class="header--title">线下日程</span>
        <el-button
          type="primary"
          size="medium"
          @click="handleEditSchedule(null)"
        >
          添加线下日程
        </el-button>
      </div>
      <el-collapse
        v-model="activeName"
        accordion
      >
        <el-collapse-item
          name="1"
          title="第1天 2020-10-10"
        >
          <common-table
            :config="schedule.config"
            :columns="schedule.columns"
            :data="schedule.data"
          >
            <template #handler="{row}">
              <el-button
                type="text"
                @click="handleEdit(row)"
              >
                修改
              </el-button>
              <el-button
                type="text"
                @click="handleDelete(row)"
              >
                删除
              </el-button>
            </template>
          </common-table>
        </el-collapse-item>
      </el-collapse>
    </section>
    <section class="courses">
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
        <template #date="{row}">
          {{ row.date[0] }} 至 {{ row.date[1] }}
        </template>
        <template #type="{row}">
          {{ row.type === 'compulsory' ? '必修' : '选修' }}
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
        >
          添加考试
        </el-button>
      </div>
      <common-table
        :config="test.config"
        :columns="test.columns"
        :data="test.data"
      >
        <template #handler="{row}">
          <el-button
            type="text"
            @click="handleEdit(row)"
          >
            修改
          </el-button>
          <el-button
            type="text"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </common-table>
    </section>
    <EditScheduleDrawer
      :visible.sync="schedule.drawerVisible"
      :schedule="schedule.editingRecord"
    />
    <EditCourseDrawer
      :visible.sync="course.drawerVisible"
      :course="course.editingRecord"
      @submit="courseSubmit"
    />
  </div>
</template>

<script>
import EditScheduleDrawer from './editScheduleDrawer'
import EditCourseDrawer from './editCourseDrawer'
const ScheduleColumns = [
  {
    prop: 'time'
  },
  {
    prop: 'title',
    minWidth: 150
  },
  {
    prop: 'teacher'
  },
  {
    prop: 'location'
  }
]
const ScheduleConfig = {
  showHeader: false,
  showHandler: true,
  handlerColumn: { label: '操作', width: 150 }
}
const CourseColumns = [
  {
    prop: 'date',
    slot: true,
    label: '上课日期',
    width: 220
  },
  {
    prop: 'courses',
    label: '关联课程',
    minWidth: 150
  },
  {
    prop: 'teacher',
    label: '讲师'
  },
  { prop: 'type', slot: true, label: '修读类型' }
]
const CourseConfig = {
  showHandler: true,
  handlerColumn: { label: '操作', width: 150 }
}
const TestColumns = [
  { prop: 'date', label: '考试日期', width: 220 },
  { prop: 'tests', label: '关联考试', minWidth: 150 },
  { prop: 'time', label: '考试时间(分钟)' }
]
const TestConfig = {
  showHandler: true,
  handlerColumn: { label: '操作', width: 150 }
}
export default {
  name: 'EditArrangement',
  components: { EditScheduleDrawer, EditCourseDrawer },
  data() {
    return {
      activeName: '1',
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
      test: {
        config: TestConfig,
        columns: TestColumns,
        drawerVisible: false,
        editingRecord: {},
        data: []
      }
    }
  },
  methods: {
    handleEditSchedule(row) {
      this.schedule.editingRecord = row
      this.schedule.drawerVisible = true
    },
    // 在线课程
    handleEditCourse(row) {
      this.course.editingRecord = row
      this.course.drawerVisible = true
    },
    // 在线课程提交后
    courseSubmit(data) {
      this.course.data.push(data)
    },
    // 删除课程
    handleDeleteCourse(row) {
      let index = _.findIndex(this.course.data, (item) => item.id === row.id)
      this.course.data.splice(index, 1)
    },
    // eslint-disable-next-line
    handleEdit(row) {
      // console.log(row)
    },
    // eslint-disable-next-line
    handleDelete(row) {
      // console.log(row)
    }
  }
}
</script>

<style lang="scss" scoped>
.editArrangement {
  background-color: #fff;
  padding: 20px;
  height: calc(100% - 30px);
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
}
</style>
