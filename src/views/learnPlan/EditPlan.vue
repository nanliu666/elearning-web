<template>
  <div class="page">
    <header class="page__header">
      <div class="page-actions">
        <div
          style="border-right: 1px solid #c5c5c5; cursor: pointer"
          @click="exit"
        >
          <i class="el-icon-arrow-left" /> 返回
        </div>
      </div>
      <div class="step-tab">
        <div
          v-for="(item, index) in steps"
          :key="index"
          class="step"
          :class="[activeStep === index ? 'active' : '']"
          @click="jumpStep(index)"
        >
          <span class="step-index">
            <i
              class="iconfont"
              :class="[item.icon]"
            />
          </span>
          {{ item.label }}
        </div>
        <div
          class="ghost-step step"
          :style="{ transform: translateX }"
        />
      </div>

      <div class="page-right">
        <el-button
          v-if="!id"
          size="medium"
          @click="publish('draft')"
        >
          存草稿
        </el-button>
        <el-button
          v-if="activeStep !== 0"
          size="medium"
          @click="handlePreviousStep"
        >
          上一步
        </el-button>
        <el-button
          v-if="activeStep !== 2"
          size="medium"
          type="primary"
          @click="handleNextStep"
        >
          下一步
        </el-button>
        <el-button
          v-if="activeStep === 2"
          size="medium"
          type="primary"
          @click="publish(0)"
        >
          发布
        </el-button>
      </div>
    </header>
    <el-row
      v-loading="loading"
      type="flex"
      justify="center"
      class="page__content"
    >
      <el-col
        :xl="16"
        :lg="16"
        :md="18"
        :sm="20"
        :xs="22"
        class="page__content--inner"
      >
        <EditBasicInfo
          v-show="activeStep === 0"
          ref="editBasicInfo"
          :model="formData"
        />
        <EditCourse
          v-show="activeStep === 1"
          ref="editCourse"
        />
        <EditPerson
          v-show="activeStep === 2"
          ref="editPerson"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import EditBasicInfo from './components/EditBasicInfo' // 基本信息
import EditCourse from './components/EditCourse' // 添加课程
import EditPerson from './components/EditPerson' // 人员信息
import { addPlan, updatePlan, planDetail, courseDetail } from '@/api/learnPlan'
import { mapGetters } from 'vuex'
import moment from 'moment'
const REFS_LIST = ['editBasicInfo', 'editCourse', 'editPerson']
const defaultFormData = {
  automaticIntegralCount: false,
  courseCatalogId: '',
  courseCatalogName: '',
  coursePlanName: '',
  coursePlanNo: '',
  endDate: '',
  endTime: '',
  sponsor: '',
  creatorName: '',
  createTime: null,
  startTime: '',
  participantsList: [],
  courseList: [],
  timeRange: '' // 时间范围
}
export default {
  name: 'EditPlan',
  components: {
    EditBasicInfo,
    EditCourse,
    EditPerson
  },
  data() {
    return {
      loading: false,
      activeStep: 0,
      steps: [
        {
          label: '填写基本信息',
          icon: 'icon-approval-info-outlined'
        },
        {
          label: '添加课程',
          icon: 'icon-approval-form-outlined'
        },
        {
          label: '人员信息',
          icon: 'icon-approval-flow-outlined'
        }
      ],
      timer: null,
      formData: _.cloneDeep(defaultFormData)
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    translateX() {
      return `translateX(${this.steps.findIndex((item, index) => index === this.activeStep) *
        100}%)`
    },
    ...mapGetters(['userInfo'])
  },
  provide() {
    return {
      parentObj: this
    }
  },
  created() {
    if (this.id) {
      this.getPlanDetail()
    } else {
      this.setupDefaultFields()
    }
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    setupDefaultFields() {
      this.formData.creatorName = this.userInfo.user_name
      this.formData.coursePlanNo =
        moment().format('YYYYMMDDHHmmss') + this.userInfo.user_id.slice(0, 2)
      let that = this
      this.timer = setInterval(() => {
        if (that.id) return
        that.formData.createTime = moment().format('yyyy-MM-DD HH:mm:ss')
      }, 1000)
    },
    exit() {
      this.$confirm('离开此页面您得修改将会丢失, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$router.go(-1)
          this.resetData()
        })
        .catch(() => {})
    },
    handlePreviousStep() {
      this.$refs[REFS_LIST[this.activeStep]].getData().then(() => {
        this.activeStep = this.activeStep === 0 ? 0 : this.activeStep - 1
      })
    },

    handleNextStep() {
      this.$refs[REFS_LIST[this.activeStep]].getData().then(() => {
        this.activeStep = this.activeStep === 2 ? 0 : this.activeStep + 1
      })
    },
    handleSubmit(type) {
      let data = JSON.parse(JSON.stringify(this.formData))
      let [startTime, endTime] = data.timeRange
      data.startTime = startTime
      data.endTime = endTime
      let func
      if (this.id) {
        func = updatePlan
      } else {
        func = addPlan
      }
      func(data)
        .then(() => {
          const tips = type === 'draft' ? '已发布草稿' : '已成功发布课程安排'
          this.$message.success(`${tips}，1秒后将自动返回课程安排列表`)
          setTimeout(() => {
            this.$router.push({ path: '/examManagement/examSchedule/list' })
            this.resetData()
          }, 1000)
        })
        .catch((err) => window.console.log(err))
    },
    resetData() {
      this.formData = _.cloneDeep(defaultFormData)
    },
    getPlanDetail() {
      this.loading = true
      // 获取学习计划详情
      planDetail({ id: this.id })
        .then((res) => {
          this.formData = res
          let formData = this.formData
          formData.timeRange = [formData.startTime, formData.endTime]
        })
        .catch((err) => {
          window.console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
    },
    getCourseDetail() {
      // 获取课程详情
      let data = { id: this.id }
      courseDetail(data)
        .then(() => {})
        .catch((err) => {
          window.console.log(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
$header-height: 54px;
.page {
  width: 100vw;
  height: 100vh;
  padding-top: $header-height;
  box-sizing: border-box;

  .page__header {
    width: 100%;
    height: $header-height;
    justify-content: space-between;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    background: #fff;
    color: #757c85;
    font-size: 14px;
    position: fixed;
    top: 0;
    .page-actions {
      height: 100%;
      text-align: center;
      line-height: $header-height;

      > div {
        height: 100%;
        padding-left: 20px;
        padding-right: 20px;
        display: inline-block;
      }

      i {
        font-size: 22px;
        vertical-align: middle;
      }
    }

    .step-tab {
      display: flex;
      justify-content: space-between;
      height: 100%;
      position: relative;
      width: 50%;
      > .step {
        font-size: 16px;
        line-height: $header-height;
        text-align: center;
        cursor: pointer;
        position: relative;

        &.ghost-step {
          position: absolute;
          height: $header-height;
          left: 0;
          z-index: -1;
          /*background: #4483f2;*/
          background: #fff;
          transition: transform 0.5s;

          &::after {
            content: '';
            border-width: 6px 6px 6px;
            border-style: solid;
            border-color: transparent transparent white;
            position: absolute;
            bottom: 0;
            left: 50%;
            margin-left: -6px;
          }
        }

        &.active {
          font-size: 16px;
          color: #202940;
          border-bottom: 2px solid $primaryColor;
        }

        &.active > .step-index {
          background: white;
          color: #202940;
        }

        &.disable {
          opacity: 0.5;
        }

        > .step-index {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 1px solid #fff;
          border-radius: 8px;
          line-height: 18px;
          text-align: center;
          box-sizing: border-box;
        }
      }
    }
    .page-right {
      padding-right: 20px;
    }
  }
  .page__content {
    width: 100%;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
    background: #f5f5f7;
    .page__content--inner {
      margin-top: 20px;
    }
  }
}
</style>
