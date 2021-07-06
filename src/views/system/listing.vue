<template>
  <div class="fill">
    <page-header>
      <div slot="title">
        <span>制度清单</span>
        <el-tooltip placement="bottom">
          <div
            slot="content"
            class="title-tooltip"
          >
            培训制度、业务表单上传规则：<br />
            上传格式包括：word、Excle、pdf、图片<br />
            支持每次选择单个或多个上传，限制一次最多上传20个文件，且每个文件大小不超过10M，图片不超过5M
          </div>
          <i class="el-icon-question" />
        </el-tooltip>
      </div>
    </page-header>
    <basic-container block>
      <el-tabs
        v-model="activeIndex"
        @tab-click="handleSelect"
      >
        <el-tab-pane
          label="培训制度"
          name="0"
        >
          <TrainSystem
            v-if="activeIndex == 0"
            :active-index="activeIndex"
          />
        </el-tab-pane>
        <el-tab-pane
          label="业务表单"
          name="1"
        >
          <TrainSystem
            v-if="activeIndex == 1"
            :active-index="activeIndex"
          />
        </el-tab-pane>
        <el-tab-pane
          label="课程清单"
          name="2"
        >
          <Course
            v-if="activeIndex == 2"
            ref="myCourse"
          ></Course>
        </el-tab-pane>
      </el-tabs>
    </basic-container>
  </div>
</template>

<script>
import Course from './listTab/course'
import TrainSystem from './listTab/trainSystem'
export default {
  name: 'Listing',
  components: {
    Course,
    TrainSystem
  },
  data() {
    return {
      activeIndex: '0'
    }
  },
  activated() {
    if (this.activeIndex == '2') {
      this.$refs.myCourse.loadTableData()
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   to.meta.$keepAlive = false // 禁用页面缓存
  //   next()
  // },
  methods: {
    handleSelect() {}
  }
}
</script>

<style lang="scss" scoped>
.title-tooltip {
  width: 250px;
  line-height: 1.6;
}
.el-icon-question {
  font-size: 18px;
  margin-left: 6px;
}
.basic-container--block {
  height: calc(100% - 92px);
  min-height: calc(100% - 92px);
  .title {
    color: $primaryColor;
    cursor: pointer;
  }
  /deep/ .el-menu--horizontal {
    border-bottom: 1px solid #cccccc !important;
  }
}
</style>
