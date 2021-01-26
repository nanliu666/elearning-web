<template>
  <el-dialog
    title="前置条件"
    class="coursePreCourseDialog"
    :visible="visible"
    append-to-body
    @close="handleClose"
  >
    <div class="precondition_label">
      当前课程:{{ course && course.courseName }}
    </div>
    <ul class="precondition_container">
      <li class="container_title">
        <span class="precondition_left">当前课程</span>
        <span class="precondition_right">是否必须通过</span>
      </li>
      <li
        v-for="item in list"
        :key="item.id"
      >
        <div class="precondition_left">
          {{ item.courseName }}
        </div>
        <el-select
          v-model="item.required"
          class="precondition_right"
        >
          <el-option
            :value="1"
            label="是"
          >
          </el-option>
          <el-option
            :value="0"
            label="否"
          >
          </el-option>
        </el-select>
      </li>
    </ul>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="medium"
        @click="handleClose"
      >取 消</el-button>
      <el-button
        size="medium"
        type="primary"
        @click="handleSubmit"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'CoursePreCourseDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    course: {
      type: Object,
      default: () => ({})
    },
    courseList: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      list: []
    }
  },
  methods: {
    update() {
      let _list = []
      const requiredIdMap = _.reduce(
        this.course.beforeCourse,
        (pre, cur) => {
          pre[cur.courseId] = 1
          return pre
        },
        {}
      )
      _.forEach(this.courseList, (course) => {
        if (course.courseId !== this.course.courseId) {
          _list.push({
            courseId: course.courseId,
            courseName: course.courseName,
            required: requiredIdMap[course.courseId] || 0
          })
        }
      })
      this.list = _list
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleSubmit() {
      this.$emit(
        'submit',
        _.filter(this.list, (item) => item.required)
      )
      this.handleClose()
    }
  }
}
</script>

<style lang="scss">
.coursePreCourseDialog {
  /deep/.el-dialog {
    .precondition_label {
      margin-bottom: 16px;
      margin-top: 16px;
      line-height: 22px;
    }
    .precondition_container {
      li {
        margin-bottom: 16px;
      }
      .container_title {
        text-align: center;
        background: #fafafa;
        // color: #fff;
        line-height: 40px;
      }
      .precondition_left,
      .precondition_right {
        display: inline-block;
      }
      .precondition_left {
        width: 60%;
        .el-select {
          width: 100%;
        }
      }
      .precondition_right {
        width: 40%;
        .el-select {
          width: 150px;
        }
      }
    }
  }
}
</style>
