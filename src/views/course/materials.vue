<template>
  <div class="materials">
    <page-header
      title="查看附件材料"
      show-back
    />
    <div class="materials_top">
      <div class="materials_top_title">
        {{ courseData.name }}的附件材料
      </div>
      <div class="materials_top_box">
        <div class="materials_top_box_item">
          <span>手机：</span>
          <span>{{ courseData.phonenum }}</span>
        </div>
        <div class="materials_top_box_item">
          <span>所属部门：</span>
          <span>{{ courseData.deptName }}</span>
        </div>
        <div class="materials_top_box_item">
          <span>课程名称：</span>
          <span>{{ courseData.courseName }}</span>
        </div>
        <div class="materials_top_box_item">
          <span>作业提交次数：</span>
          <span>{{ courseData.jobTimes || 0 }} / {{ courseData.totalJob || 0 }}次</span>
        </div>
      </div>
    </div>
    <div class="materials_content">
      <div class="materials_content_bar">
        <span
          :class="{ Select: Select == 1 }"
          @click="setSelect(1)"
        >课程作业</span>
        <span
          :class="{ Select: Select == 2 }"
          @click="setSelect(2)"
        >学习心得</span>
      </div>
      <EourseTask v-show="Select == 1"></EourseTask>
      <Experience v-show="Select == 2"></Experience>
    </div>
  </div>
</template>

<script>
import EourseTask from './components/courseTask'
import Experience from './components/Experience'
export default {
  components: {
    EourseTask,
    Experience
  },
  data() {
    return {
      Select: 1,
      courseData: {}
    }
  },
  activated() {
    this.courseData = JSON.parse(this.$route.query.row)
  },
  methods: {
    setSelect(i) {
      this.Select = i
    }
  }
}
</script>

<style lang="scss" scoped>
.materials {
  &_top {
    background-color: #fff;
    padding: 25px 50px;
    &_title {
      font-size: 18px;
      font-weight: bold;
    }
    &_box {
      display: flex;
      flex-wrap: wrap;
      &_item {
        margin-top: 15px;
        width: 33%;
      }
    }
  }
  &_content {
    background-color: #fff;
    padding: 10px 50px 100px;
    margin-top: 25px;
    &_bar {
      border-bottom: 1px solid #ccc;
      margin-bottom: 20px;
      display: flex;
      span {
        margin-left: 50px;
        line-height: 70px;
        font-size: 18px;
      }
      .Select {
        font-weight: bold;
        border-bottom: 4px solid #1677ff;
      }
    }
  }
}
</style>
