<template>
  <div class="editArrangement">
    <section
      v-if="trainWay === 2 || trainWay === 3"
      class="schedule"
    >
      <div class="header">
        <span class="header--title">线下日程</span>
        <div>
          <span>
            <span style="padding-right: 4px">开启签到功能</span>
            <el-tooltip
              class="item"
              effect="dark"
              content="启用签到功能后，学员每一节线下课程/活动都需要扫描二维码进行签到"
              placement="top-start"
            >
              <i class="el-icon-warning" />
            </el-tooltip>
            <el-switch
              v-model="signIn"
              style="margin: 0 40px 0 10px;"
              :disabled="signInDisabled"
            />
          </span>
          <el-button
            type="primary"
            size="medium"
            @click="handleEditSchedule({})"
          >
            添加线下日程
          </el-button>
        </div>
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
          @click="handleEditCourse({})"
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
          {{ row.studyType == 0 ? '必修' : '选修' }}
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
        <template #examTime="{row}">
          {{ row.examTime[0] }} 至 {{ row.examTime[1] }}
        </template>
        <template #reckonTimeValue="{row}">
          {{ !row.reckonTime ? '不计时' : row.reckonTimeValue }}
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
    <offline-course-drawer
      :visible.sync="schedule.drawerVisible"
      :schedule="schedule.editingRecord"
      @submit="handleSubmitSchedule"
    />
    <online-course-drawer
      :visible.sync="course.drawerVisible"
      :course="course.editingRecord"
      @submit="courseSubmit"
    />
    <edit-examine-drawer
      :visible.sync="examine.drawerVisible"
      :examine="examine.editingRecord"
      @submit="examineSubmit"
    />
  </div>
</template>

<script>
import OfflineCourseDrawer from '../drawerComponents/OfflineCourseDrawer'
import EditExamineDrawer from '../drawerComponents/editExamineDrawer'
import OnlineCourseDrawer from '../drawerComponents/OnlineCourseDrawer'
const ScheduleColumns = [
  {
    prop: 'todoTimeParams',
    formatter: function(record) {
      return record.todoTimeParams.join(' ~ ')
    }
  },
  {
    prop: 'title',
    minWidth: 150,
    formatter(record) {
      return `${record.type === 1 ? '【面授课程】' : '【活动】'}${
        record.type === 1 ? _.get(record, 'courseName', '') : _.get(record, 'theme', '')
      }`
    }
  },
  {
    prop: 'lecturerId',
    formatter(record) {
      return `${record.type === 1 ? '讲师：' : '主持人：'}${_.get(record, 'lecturerName', '')}`
    }
  },
  {
    prop: 'classroomName',
    formatter(record) {
      return `${record.type === 1 ? '授课教室：' : '活动教室：'}${_.get(
        record,
        'classroomName',
        ''
      )}`
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
  { prop: 'examTime', label: '考试时间', slot: true, width: 220 },
  { prop: 'examName', label: '考试名称', minWidth: 120 },
  { prop: 'reckonTimeValue', slot: true, label: '考试时间(分钟)' }
]
const TestConfig = {
  showHandler: true,
  handlerColumn: { label: '操作', width: 150 }
}
import moment from 'moment'
export default {
  name: 'EditArrangement',
  components: { OfflineCourseDrawer, OnlineCourseDrawer, EditExamineDrawer },
  props: {
    trainWay: {
      type: Number,
      default: 3 //1在线，2面授，3混合
    }
  },
  data() {
    return {
      signIn: false,
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
    signInDisabled() {
      return _.isEmpty(this.schedule.data)
    },
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
      // 不管是不是草稿，直接返回数据
      return new Promise((resolve) => {
        resolve({
          signIn: this.signIn,
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
      this.$message.success('删除成功！')
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
      this.$message.success('删除成功！')
    },
    // 编辑与新增线下日程
    handleEditSchedule(row) {
      this.schedule.editingRecord = row
      this.schedule.drawerVisible = true
    },
    // 删除线下日程
    handleDeleteSchedule(row) {
      this.schedule.data = this.schedule.data.filter((item) => item !== row)
      this.signIn = !_.isEmpty(this.schedule.data)
      this.$message.success('删除成功！')
    },
    checkOverlapTime(data) {
      let isOverlapping = false
      // 同一天使用的相同教室
      const sameClassrommAndDate = _.find(this.schedule.data, {
        classroomId: data.classroomId,
        todoDate: data.todoDate
      })
      if (sameClassrommAndDate) {
        const time1 = sameClassrommAndDate.todoTimeParams
        const time2 = data.todoTimeParams
        const time1List = [
          moment(`${data.todoDate} ${time1[0]}`),
          moment(`${data.todoDate} ${time1[1]}`)
        ]
        const time2List = [
          moment(`${data.todoDate} ${time2[0]}`),
          moment(`${data.todoDate} ${time2[1]}`)
        ]
        // 被选日期开始日期isSameOrBefore已选结束日期 and 被选日期结束日期isSameOrAfter已选开始日期
        if (
          moment(time1List[0]).isSameOrBefore(moment(time2List[1], 'minute')) &&
          moment(time1List[1]).isSameOrAfter(moment(time2List[0], 'minute'))
        ) {
          this.$message.error('您所选的教室存在重叠时段，请重新选择！')
          isOverlapping = true
        }
      }
      // 有重叠时段就不进行补充
      return isOverlapping
    },
    // 线下日程提交后的数据处理
    handleSubmitSchedule(msg) {
      // 默认不存在同一个教室的重叠时段
      const { data, type } = msg
      if (type === 'add') {
        if (this.checkOverlapTime(data)) return
      }
      this.signIn = true
      const index = _.findIndex(this.schedule.data, { id: data.id })
      if (index >= 0 && type === 'edit') {
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
