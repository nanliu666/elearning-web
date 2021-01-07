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
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
        </li>
        <li @click="handleDeleteCourse">
          <i class="el-icon-delete"></i>删除
        </li>
        <li @click="handleBatchEdit">
          <i class="el-icon-edit-outline"></i>批量修改
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
        <el-collapse-item
          v-for="course in courseList"
          :key="course.courseId"
          :name="course.courseId"
        >
          <template slot="title">
            <div class="layout_content_label">
              <i class="icon-drag"></i>
              <el-checkbox :label="course.courseId"></el-checkbox>
              {{ course.courseName }}
            </div>
          </template>
          <div class="layout_content_detail">
            <common-form
              :model="course"
              :columns="formColumns"
            >
              <div
                slot="courseName"
                class="course-name-input"
              >
                <el-input
                  :value="course.courseName"
                  @click.native="replaceCourse(course)"
                />
                <span
                  class="precondition"
                  @click="handleSetPrecondition(course)"
                >设置前置条件</span>
              </div>
              <template slot="studyFrequency">
                <el-input-number
                  v-model="course.studyFrequency"
                  controls-position="right"
                  :min="0"
                ></el-input-number>
              </template>
              <template slot="timeList">
                <el-date-picker
                  v-for="(time, index) in course.timeList"
                  :key="index"
                  v-model="time.list"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                >
                </el-date-picker>
              </template>
            </common-form>
            <el-tabs value="first">
              <el-tab-pane
                label="关联考试"
                name="first"
              >
                <div
                  v-for="(list, indexs) in course.examList"
                  :key="indexs"
                  class="tab_list clearfix"
                >
                  {{ list.name }}
                  <div class="tab_right">
                    <span>预览</span><span>编辑</span>
                    <el-dropdown @command="commandClick">
                      <i class="el-icon-more"></i>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="a">
                          人员列表
                        </el-dropdown-item>
                        <el-dropdown-item command="b">
                          前置条件
                        </el-dropdown-item>
                        <el-dropdown-item command="c">
                          删除
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
                <div class="tabsAddBtn">
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
        </el-collapse-item>
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
      :visible.sync="courseDialogVisible"
      @submit="handleCourseSelectSubmit"
    />
  </basicContainer>
</template>

<script>
import CourseSelectDialog from './CourseSelectDialog'
import CoursePreCourseDialog from './CoursePreCourseDialog'
import CourseBatchEditDialog from './CourseBatchEditDialog'
const COURSE_TEMPLATE = {
  timeRange: [], //开课日期
  passRule: [], // 通过条件
  studyFrequency: 0, //允许学习次数
  examList: [],
  beforeCourse: [], // 前置课程
  timeList: [{ list: [] }, { list: [] }, { list: [] }]
}
export default {
  components: {
    CourseSelectDialog,
    CoursePreCourseDialog,
    CourseBatchEditDialog
  },
  data() {
    return {
      courseDialogVisible: false, // 课程选择弹窗标记
      replacingCourse: null, // 当前要重新选择的课程
      batchDialogVisible: false, // 批量操作的弹窗标记
      precondDialogVisible: false, // 前置条件弹窗隐藏和显示
      settingPreCourse: null, // 当前要设置前置条件的课程
      courseList: [],
      checkAll: false,
      checkedCourseIds: [],
      isIndeterminate: false,
      formColumns: [
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
            { label: '教师评定', value: 1 },
            { label: '考试通过', value: 2 },
            { label: '达到课程学时', value: 3 }
          ],
          offset: 4,
          required: true
        },
        {
          prop: 'startTime',
          itemType: 'datePicker',
          type: 'dateRange',
          label: '开课时间',
          required: true
        },
        {
          prop: 'studyFrequency',
          itemType: 'slot',
          label: '允许学习次数',
          offset: 4,
          required: true
        },
        {
          prop: 'timeList',
          label: '允许时间段',
          itemType: 'slot',
          required: false
        }
      ],
      activeCollapses: []
    }
  },
  computed: {},
  methods: {
    replaceCourse(course) {
      this.replacingCourse = course
      this.courseDialogVisible = true
    },
    setCourseList(list) {
      this.courseList = list
    },
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
            this.courseList.push({
              ..._.cloneDeep(COURSE_TEMPLATE),
              courseId: item.id,
              courseName: item.courseName
            })
          }
        })
      }
    },
    handleCheckAllChange(val) {
      // 全选回调
      this.checkedCourseIds = val ? this.courseList.map((item) => item.courseId) : []
      this.isIndeterminate = false
    },
    checkboxGroupChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.courseList.length && checkedCount !== 0
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.courseList.length
    },
    commandClick(val) {
      // 关联开始删除
      switch (val) {
        case 'a':
          break
        case 'b':
          break
        case 'c': // 删除
          this.$confirm('您确定要删除当前课程吗?', '提醒', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          })
            .then(() => {})
            .catch(() => {})
          break
      }
    },
    handleBatchEdit() {
      // 批量修改
      this.batchDialogVisible = true
    },
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

    handleSetPrecondition(course) {
      // 设置前置条件
      this.settingPreCourse = course
      this.precondDialogVisible = true
      setTimeout(() => {
        this.$refs['preEdit'].update()
      })
    },
    handleSetPrecondSubmit(list) {
      this.settingPreCourse.beforeCourse = list
    },
    handleDeleteCourse() {
      this.courseList = _.filter(
        this.courseList,
        (item) => !this.checkedCourseIds.includes(item.courseId)
      )
      this.checkedCourseIds = []
      this.checkboxGroupChange(this.checkedCourseIds)
    },
    handleAddCourse() {
      this.courseDialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.addSchedule {
  /deep/.el-input-number {
    width: 100%;
  }
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
  .layout_header {
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
    .layout_content_label {
      width: 100%;
      position: relative;
      /deep/.el-checkbox {
        margin: 0 10px;
        .el-checkbox__label {
          display: none;
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
    .layout_content_detail {
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
        .tabsAddBtn {
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
/deep/.el-dialog {
  //   max-width: 420px;
  .el-date-editor {
    width: 100%;
    margin-bottom: 8px;
  }
  width: 80%;
  max-width: 600px;
}
.commonTable {
  /deep/.el-form-item {
    width: 45%;
  }
}
</style>
