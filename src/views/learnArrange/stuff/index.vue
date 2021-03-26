<template>
  <div class="stuff-detail">
    <div
      class="back-btn"
      @click="back"
    >
      <i class="icon el-icon-arrow-left"></i>
      <span class="text">查看学员上报材料</span>
    </div>

    <div class="intro">
      <div class="title">
        <div class="name">
          {{ data.stuName || data.name }}的上报材料情况
        </div>
      </div>
      <div class="intro-list">
        <div class="intro-item">
          手机：
          <span class="text">{{ data.phone || data.phonenum }}</span>
        </div>
        <div class="intro-item">
          所属部门：
          <span class="text">{{ data.deptName }}</span>
        </div>
        <div class="intro-item">
          培训名称：
          <span class="text">{{ data.trainName || data.studyName }}</span>
        </div>
      </div>
      <div class="intro-list">
        <div class="intro-item">
          作业提交率：
          <span class="text">{{
            typeof data.jobTimes == 'number' && typeof data.jobPercent == 'number'
              ? data.jobTimes + '次/' + data.jobPercent + '%'
              : '--'
          }}</span>
        </div>
        <div class="intro-item">
          培训上报材料：
          <span class="text">{{ data.isSubmit === 'Yes' ? '已提交' : '未提交' }}</span>
        </div>
        <div class="intro-item">
          <span class="text"></span>
        </div>
      </div>
    </div>

    <div class="container">
      <el-tabs
        v-model="activeTab"
        class="tabs"
      >
        <el-tab-pane
          v-for="tab in tabs"
          :key="tab"
          :label="reference[tab]"
          :name="tab"
        >
          <div class="main-content">
            <component
              :is="tab"
              :data="tabData"
              :parent-vm="parentVm"
            ></component>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { study, course, train } from './contents'
import {
  queryCourseWork,
  experience,
  materials,
  queryStudyPlanWork,
  queryStudyPlanExperience,
  queryStudyAllCorseList
} from '@/api/learnArrange'
import { getOnlineCourse } from '@/api/training/training'

export default {
  name: 'StuffDetail',
  components: {
    study,
    train,
    course
  },
  data() {
    return {
      data: {},
      tabs: ['course', 'study', 'train'],
      activeTab: 'course',
      reference: {
        course: '课程作业',
        study: '学习心得',
        train: '培训上报材料'
      },
      tabData: {
        course: [],
        courseOpitons: [],
        study: [],
        train: []
      }
    }
  },
  computed: {
    parentVm() {
      return this
    }
  },
  activated() {
    const query = this.$route.query
    Object.keys(this.$route.query).forEach((key) => {
      this.data[key] = query[key]
    })
    this.$forceUpdate()
    this.getData()
  },
  deactivated() {
    this.data = {}
    this.tabData = {
      course: [],
      courseOpitons: [],
      study: [],
      train: []
    }
    this.activeTab = 'course'
  },
  methods: {
    getData() {
      this.queryWork()

      this.getOnlineCourse()

      this.queryExperience()
      if (this.data.type === 'plan') {
        this.tabs = ['course', 'study']
        return
      }
      const { trainId, stuId: userId } = this.data
      materials({ trainId, userId }).then((res) => {
        this.tabData.train = res
      })
    },
    queryWork(courseId = '') {
      const { trainId, stuId, type, studyPlanId } = this.data
      const params = { userId: stuId }
      let api
      if (type === 'plan') {
        api = queryStudyPlanWork
        params.studyPlanId = studyPlanId
      } else {
        api = queryCourseWork
        params.trainId = trainId
      }

      if (courseId) {
        params.courseId = courseId
      }

      api(params).then((res) => {
        res.forEach((item) => {
          const { trainAttachmentVOS: rows } = item
          if (!rows.find((r) => r.fileCategory === 'user')) {
            rows.push({
              fileCategory: 'user',
              updateTime: '--'
            })
          }
          if (!rows.find((r) => r.fileCategory === 'teacher')) {
            rows.push({
              fileCategory: 'teacher',
              updateTime: '--'
            })
          }
        })
        this.tabData.course = res
      })
      this.$forceUpdate()
    },
    getOnlineCourse() {
      const { trainId, studyPlanId, type } = this.data
      let api = ''
      const params = {}
      if (type === 'plan') {
        api = queryStudyAllCorseList
        params.id = studyPlanId
      } else {
        api = getOnlineCourse
        params.trainId = trainId
      }
      api(params).then((res) => {
        this.tabData.courseOpitons = res
        this.$forceUpdate()
      })
    },
    queryExperience() {
      const { trainId, stuId, type, studyPlanId } = this.data
      const params = { userId: stuId }
      let api
      if (type === 'plan') {
        api = queryStudyPlanExperience
        params.studyPlanId = studyPlanId
      } else {
        api = experience
        params.trainId = trainId
      }
      api(params).then((res) => {
        this.tabData.study = res
        this.$forceUpdate()
      })
    },
    back() {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
.stuff-detail {
  .back-btn {
    display: flex;
    align-items: center;
    cursor: pointer;
    width: fit-content;
    margin: 16px 0;
    font-size: 16px;
    color: rgba(0, 11, 21, 0.85);
    .icon {
      font-weight: 700;
      margin-right: 4px;
    }
  }
  .intro {
    padding: 24px;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    cursor: default;
    .title {
      font-size: 0;
      margin-bottom: 18px;
      .name {
        display: inline-block;
        font-size: 18px;
        color: rgba(0, 11, 21, 0.85);
        margin-right: 16px;
      }
    }
    .intro-list {
      display: flex;
      color: rgba(0, 11, 21, 0.45);
      font-size: 14px;
      &:not(:last-child) {
        margin-bottom: 16px;
      }
      .intro-item {
        display: flex;
        flex: 1;
        align-items: center;
        .text {
          width: 287px;
          color: rgba(0, 11, 21, 0.85);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }

  .container {
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 24px;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    .el-tabs__item {
      font-size: 16px;
      padding: 0 !important;
      margin: 0 20px;
      &:first-child {
        margin-left: 0;
      }
    }
    .main-content {
    }
  }
}
</style>
