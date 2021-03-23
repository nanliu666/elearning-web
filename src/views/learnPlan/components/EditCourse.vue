<template>
  <basicContainer
    block
    class="addSchedule"
  >
    <!-- 添加课程页面 -->
    <div class="layout_header">
      <ul class="header_left">
        <li>
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            :disabled="!courseList.length"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
        </li>
        <li>
          <el-button
            type="text"
            size="medium"
            :disabled="!courseList.length"
            @click="handleDeleteCourse"
          >
            <i class="el-icon-delete"></i>删除
          </el-button>
        </li>
        <li>
          <el-button
            type="text"
            size="medium"
            :disabled="!courseList.length"
            @click="handleBatchEdit"
          >
            <i class="el-icon-edit-outline"></i>批量修改
          </el-button>
        </li>
      </ul>
      <el-button
        class="header_right"
        type="primary"
        size="medium"
        @click="handleAddCourse"
      >
        添加课程
      </el-button>
    </div>
    <el-checkbox-group
      v-model="checkedCourseIds"
      @change="checkboxGroupChange"
    >
      <el-collapse
        v-model="activeCollapses"
        class="layout_content"
      >
        <draggable
          v-model="courseList"
          :animation="200"
        >
          <el-collapse-item
            v-for="course in courseList"
            :key="course.courseId"
            :name="course.courseId"
          >
            <template slot="content">
              <i
                class="el-icon-edit edit-button"
                @click.prevent="course.isEdit = !course.isEdit"
              ></i>
            </template>
            <template slot="title">
              <div class="layout_content_label">
                <div class="layout_content_label__head">
                  <i
                    v-if="activeCollapses.includes(course.courseId)"
                    class="el-icon-arrow-down"
                  ></i>
                  <i
                    v-else
                    class="el-icon-arrow-right"
                  ></i>
                  <el-checkbox :label="course.courseId"></el-checkbox>
                  <input
                    v-if="course.isEdit"
                    v-model="course.courseName"
                    type="text"
                  />
                  <span v-else>{{ course.courseName }}</span>
                </div>
                <i class="icon-drag"></i>
              </div>
            </template>
            <CourseItem
              ref="courseItem"
              :course="course"
              :plan-time-range="planTimeRange"
              @exam-edit="handleExamEdit"
              @course-pre="handleSetPrecondition"
              @course-replace="handleReplaceCourse"
            />
          </el-collapse-item>
        </draggable>
      </el-collapse>
    </el-checkbox-group>

    <!-- 批量修改的弹窗 -->
    <CourseBatchEditDialog
      ref="batchEdit"
      :visible.sync="batchDialogVisible"
      @submit="handleBatchEditSubmit"
    />
    <!-- 前置条件的弹窗 -->
    <CoursePreCourseDialog
      ref="preEdit"
      :course="settingPreCourse"
      :course-list="courseList"
      :visible.sync="precondDialogVisible"
      @submit="handleSetPrecondSubmit"
    />
    <!-- 课程列表的弹窗 -->
    <CourseSelectDialog
      ref="listSelect"
      :multiple="!replacingCourse"
      :course-list="courseList"
      :visible.sync="courseDialogVisible"
      @submit="handleCourseSelectSubmit"
    />
    <!-- 课程考试编辑 -->
    <EditExamineDrawer
      :visible.sync="examDrawerVisible"
      :examine="editingExam"
      entry-c-name="学习计划"
      @submit="handleExamineSubmit"
    />
  </basicContainer>
</template>

<script>
import CourseSelectDialog from './CourseSelectDialog'
import CoursePreCourseDialog from './CoursePreCourseDialog'
import CourseBatchEditDialog from './CourseBatchEditDialog'
import CourseItem from './EditCourseItem'
import EditExamineDrawer from '@/views/training/components/drawerComponents/editExamineDrawer'
import { getCourseExam } from '@/api/learnPlan/index'
import { createUniqueID } from '@/util/util'
import draggable from 'vuedraggable'
const COURSE_TEMPLATE = {
  timeRange: [], //开课日期
  passRule: [], // 通过条件
  studyFrequency: 0, //允许学习次数
  studyExam: [],
  beforeCourse: [], // 前置课程
  timeList: [{ list: ['', ''] }, { list: ['', ''] }, { list: ['', ''] }]
}
export default {
  name: 'EditCourse',
  components: {
    draggable,
    CourseSelectDialog,
    CoursePreCourseDialog,
    CourseBatchEditDialog,
    EditExamineDrawer,
    CourseItem
  },
  props: {
    planId: {
      type: String,
      default: ''
    },
    /**
     * 学习计划时间范围
     */
    planTimeRange: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      courseDialogVisible: false, // 课程选择弹窗标记
      replacingCourse: null, // 当前要重新选择的课程
      batchDialogVisible: false, // 批量操作的弹窗标记
      precondDialogVisible: false, // 前置条件弹窗隐藏和显示
      settingPreCourse: null, // 当前要设置前置条件的课程
      examDrawerVisible: false, // 考试编辑弹窗编辑
      editingExamCourse: null, // 当前要编辑考试的课程
      editingExam: null, // 当前要编辑考试
      courseList: [],
      checkAll: false,
      checkedCourseIds: [],
      isIndeterminate: false,
      activeCollapses: []
    }
  },
  computed: {},
  methods: {
    // 清空数据
    reset() {
      Object.assign(this.$data, this.$options.data())
    },
    // 考试安排提交后
    handleExamineSubmit(data, type) {
      if (type == 'add') {
        this.editingExamCourse.studyExam.push(data)
        this.editingExamCourse = null
      } else {
        let index = _.findIndex(this.editingExamCourse.studyExam, (item) => {
          return item.id === data.id
        })
        this.$set(this.editingExamCourse.studyExam, index, data)
        this.editingExamCourse = null
        this.editingExam = null
      }
    },
    // 编辑课程考试
    handleExamEdit(course, exam) {
      this.editingExamCourse = course
      this.editingExam = exam || null
      this.examDrawerVisible = true
    },
    // 替换课程
    handleReplaceCourse(course) {
      this.replacingCourse = course
      this.courseDialogVisible = true
    },
    // 父组件调用的更新方法,更新已选择的课程并组装数据
    setCourseList(list) {
      const res = _.map(list, (course) => {
        let _course = {
          ...course,
          timeRange: [course.startTime, course.endTime],
          timeList: _.map(course.timeList, (time) => ({
            ...time,
            list: [time.startTime, time.endTime]
          })),
          beforeCourse: _.map(course.beforeCourse, (c) => ({ courseId: c, required: 1 }))
        }
        return _course
      })
      this.courseList = res
    },
    // 批量校验所有课程，校验通过即返回所有课程数据
    getData() {
      return new Promise((resolve, reject) => {
        Promise.all(_.map(this.$refs.courseItem, (ref) => ref.$refs.form.validate()))
          .then(() => {
            const data = _.map(this.courseList, (course, index) => {
              let _course = {
                courseName: course.courseName,
                courseId: course.courseId,
                id: course.id,
                sequence: index + 1,
                studyFrequency: course.studyFrequency,
                passRule: course.passRule,
                studyPlanId: this.planId,
                startTime: _.get(course, 'timeRange[0]'),
                endTime: _.get(course, 'timeRange[1]'),
                studyExam: _.map(course.studyExam, (exam) => ({
                  ...exam,
                  id: typeof exam.id === 'string' ? exam.id : null,
                  studyPlanCourseId: course.id
                })),
                timeList: _.map(course.timeList, (time) => ({
                  startTime: _.get(time, 'list[0]'),
                  endTime: _.get(time, 'list[1]'),
                  id: time.id,
                  studyPlanCourseId: course.id
                })),
                beforeCourse: _.map(course.beforeCourse, 'courseId'),
                beforeCourseName: _.map(course.beforeCourse, 'courseName')
              }
              return _course
            })
            resolve(data)
          })
          .catch(reject)
      })
      // this.$refs.form
    },
    // 课程添加回调
    handleCourseSelectSubmit(selected) {
      if (this.replacingCourse) {
        this.replacingCourse.courseId = selected[0].id
        this.replacingCourse.courseName = selected[0].courseName
        this.replacingCourse = null
      } else {
        const idMap = _.reduce(
          this.courseList,
          (pre, cur) => {
            pre[cur.courseId] = 1
            return pre
          },
          {}
        )
        _.forEach(selected, (item) => {
          if (!idMap[item.id]) {
            let course = {
              ..._.cloneDeep(COURSE_TEMPLATE),
              courseId: item.id,
              courseName: item.courseName
            }
            this.loadExamsOfCourse(course)
            this.courseList.push(course)
          } else {
            this.$message.info(`课程【${item.courseName}】已被安排，无法执行重复操作`)
          }
        })
      }
    },
    // 加载课程关联的考试
    loadExamsOfCourse(course) {
      getCourseExam({ id: course.courseId }).then((exams) => {
        course.studyExam.push(..._.map(exams, (exam) => ({ ...exam, id: createUniqueID() })))
      })
    },
    // 全选回调
    handleCheckAllChange(val) {
      this.checkedCourseIds = val ? this.courseList.map((item) => item.courseId) : []
      this.isIndeterminate = false
    },
    // 控制全选复选框的状态
    checkboxGroupChange(value) {
      let checkedCount = value.length
      // 全选状态
      this.checkAll = checkedCount === this.courseList.length && checkedCount !== 0
      // 半选状态
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.courseList.length
    },
    // 批量修改
    handleBatchEdit() {
      this.batchDialogVisible = true
    },
    // 批量修改回调
    handleBatchEditSubmit(data) {
      _.forEach(this.courseList, (course) => {
        if (this.checkedCourseIds.includes(course.courseId)) {
          course.studyFrequency = data.studyFrequency
          _.forEach(data.timeList, (time, index) => {
            _.set(course, `timeList[${index}].list`, time.list)
            // this.$set(course, `timeList[${index}].list`, time.list)
          })
        }
      })
    },
    // 设置前置条件
    handleSetPrecondition(course) {
      this.settingPreCourse = course
      this.precondDialogVisible = true
      setTimeout(() => {
        this.$refs['preEdit'].update()
      })
    },
    // 设置前置条件回调
    handleSetPrecondSubmit(list) {
      this.settingPreCourse.beforeCourse = list
    },
    // 删除课程
    handleDeleteCourse() {
      if (!this.checkedCourseIds.length) {
        this.$message.warning('请选择要删除的课程')
        return
      }
      this.$confirm('是否删除已选中的课程?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.courseList = _.filter(
            this.courseList,
            (item) => !this.checkedCourseIds.includes(item.courseId)
          )
          this.checkedCourseIds = []
          this.checkboxGroupChange(this.checkedCourseIds)
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
        .catch(() => {})
    },
    // 添加课程
    handleAddCourse() {
      this.courseDialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.addSchedule {
  .icon-drag {
    cursor: move;
  }
  /deep/.el-input-number {
    width: 100%;
  }

  /deep/.el-collapse {
    border-bottom: none;
  }
  .layout_header {
    margin-bottom: 16px;
    &::after {
      content: '';
      clear: both;
      display: block;
    }
    .header_left {
      display: inline-block;
      line-height: 36px;
      li {
        display: inline-block;
        margin-right: 33px;
        cursor: pointer;
        i {
          margin-right: 5px;
        }
      }
    }
    .header_right {
      float: right;
    }
  }
  .layout_content {
    /deep/.el-collapse-item {
      margin-bottom: 2px;
    }
    .layout_content_label {
      background: #fafafa;
      border-bottom: 1px solid #ebeced;
      width: 100%;
      position: relative;
      display: flex;
      justify-content: space-between;
      padding: 0 16px 0 24px;
      &__head {
        i {
          font-size: 16px;
        }
      }
      /deep/.el-checkbox {
        margin: 0 24px 0 16px;
        .el-checkbox__label {
          display: none;
        }
        .el-checkbox__inner {
          width: 16px;
          height: 16px;
        }
      }
      .el-icon-s-grid {
        right: 0;
        top: 18.5px;
        position: absolute;
      }
      .el-icon-arrow-down {
        transform: rotate(180deg);
        transition: transform 0.3s linear;
      }
    }
    .is-active {
      .el-icon-arrow-down {
        transform: rotate(0);
      }
    }
    /deep/.el-collapse-item__arrow {
      display: none;
    }
  }
}
.clearfix::after {
  clear: both;
  display: block;
  content: '';
}
// /deep/.el-dialog {
//   //   max-width: 420px;
//   .el-date-editor {
//     width: 100%;
//     margin-bottom: 8px;
//   }
//   width: 80%;
//   max-width: 600px;
// }
// .commonTable {
//   /deep/.el-form-item {
//     width: 45%;
//   }
// }

.edit-button {
  position: absolute;
  width: 45px;
  margin-left: 20px;
  margin-top: 15px;
  font-size: 18px;
}
</style>
