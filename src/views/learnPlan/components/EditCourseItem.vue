<template>
  <div class="EditCourseItem">
    <common-form
      ref="form"
      :model="course"
      :columns="columns"
    >
      <div
        slot="courseName"
        class="course-name-input"
      >
        <el-input
          :value="course.courseName"
          @click.native="handleReplaceCourse(course)"
        />
        <el-tooltip
          class="item"
          effect="dark"
          content="学习当前课程之前需满足的条件"
          placement="top"
        >
          <span
            class="precondition"
            @click="handleSetPrecondition(course)"
          >设置前置条件</span>
        </el-tooltip>
      </div>
      <template slot="studyFrequency">
        <el-input-number
          v-model="course.studyFrequency"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </template>
      <template slot="timeList">
        <el-time-picker
          v-for="(time, index) in course.timeList"
          :key="index"
          v-model="time.list"
          is-range
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
          value-format="HH:mm:ss"
        />
      </template>
    </common-form>
    <el-tabs value="first">
      <el-tab-pane
        label="关联考试"
        name="first"
      >
        <div
          v-for="(exam, indexs) in course.studyExam"
          :key="indexs"
          class="tab_list clearfix"
        >
          {{ exam.examName }}
          <div class="tab_right">
            <span @click="handleViewTextPaper(course, exam)">预览</span>
            <span @click="handleExamEdit(course, exam)">编辑</span>
            <el-dropdown @command="handleExamCommand(course, indexs, $event)">
              <i class="el-icon-more"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="del">
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div
          class="exam-add"
          @click="handleExamEdit(course)"
        >
          添加
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="关联练习"
        name="second"
      >
      </el-tab-pane>
      <el-tab-pane
        label="关联作业"
        name="third"
      >
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import moment from 'moment'
import { validateTimeList } from './config'
export default {
  name: 'EditCourseItem',
  props: {
    course: { type: Object, default: null },
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
      columns: [
        {
          prop: 'courseName',
          label: '课程名称',
          itemType: 'slot',
          required: true
        },
        {
          prop: 'passRule',
          itemType: 'checkbox',
          label: '通过条件',
          options: [
            { label: '教师评定', value: '1' },
            { label: '考试通过', value: '2' },
            { label: '达到课程学时', value: '3' }
          ],
          offset: 4,
          required: true
        },
        {
          prop: 'timeRange',
          itemType: 'datePicker',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          label: '开课时间',
          required: true,
          rules: [
            {
              validator: this.validateDateRange,
              trigger: 'change'
            }
          ]
        },
        {
          prop: 'studyFrequency',
          itemType: 'slot',
          label: '允许学习次数',
          offset: 4,
          desc: '0：表示无限制',
          required: true
        },
        {
          prop: 'timeList',
          label: '允许时间段',
          itemType: 'slot',
          rules: [{ validator: validateTimeList }],
          required: false
        }
      ]
    }
  },
  methods: {
    validateDateRange(rule, value, callback) {
      if (moment(value[0]).isBefore(this.planTimeRange[0])) {
        callback(new Error('课程开始时间需要大于等于计划开始时间'))
      } else if (moment(value[1]).isAfter(this.planTimeRange[1])) {
        callback(new Error('课程结束时间需要小于等于计划结束时间'))
      } else {
        callback()
      }
    },
    handleExamEdit(course, exam) {
      this.$emit('exam-edit', course, exam)
    },
    handleSetPrecondition(course) {
      this.$emit('course-pre', course)
    },
    handleReplaceCourse(course) {
      this.$emit('course-replace', course)
    },
    handleViewTextPaper(course, exam) {
      if (exam.testPaperType === 'manual') {
        this.$router.push({
          path: '/examManagement/examSchedule/preview',
          query: { paperId: exam.testPaper, paperType: exam.testPaperType }
        })
      } else {
        this.$message.error('随机试卷不支持预览')
      }
    },
    handleExamCommand(course, index, command) {
      if (command === 'del') {
        this.$confirm('您确定要删除当前关联的考试吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            course.studyExam.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
          .catch(() => {})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.EditCourseItem {
  padding-top: 16px;
  .course-name-input {
    position: relative;
    .precondition {
      color: #01aafc;
      cursor: pointer;
      position: absolute;
      right: -90px;
      top: 0;
    }
  }
  /deep/.el-tabs {
    .tab_list {
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      padding-left: 15px;
      color: rgba(0, 11, 21, 0.85);
      border-bottom: 1px solid #ebeced;
      .tab_right {
        float: right;
        span {
          display: inline-block;
          color: #01aafc;
          margin-right: 10px;
          cursor: pointer;
        }
        i {
          cursor: pointer;
        }
      }
    }
    .exam-add {
      width: 100%;
      height: 42px;
      line-height: 42px;
      margin-top: 10px;
      cursor: pointer;
      text-align: center;
      border: 1px dashed rgb(230, 218, 218);
    }
  }
}
</style>
