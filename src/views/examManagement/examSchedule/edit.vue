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
              :class="[item.icon]"
              class="iconfont"
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
          v-loading="submitLoading && publishType === 'draft'"
          size="medium"
          @click="publishFun('draft')"
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
          v-if="activeStep === 0"
          size="medium"
          type="primary"
          @click="handleNextStep"
        >
          下一步
        </el-button>
        <el-button
          v-if="activeStep === 1"
          v-loading="submitLoading && publishType === 'publish'"
          size="medium"
          type="primary"
          @click="publishFun('publish')"
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
        :md="20"
        :sm="22"
        :xs="24"
        class="page__content--inner"
      >
        <ExamInfo
          v-show="activeStep === 0"
          ref="examInfo"
        />
        <ExamBatch
          v-show="activeStep === 1"
          ref="examBatch"
          @jump="jumpStepByBatch"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ExamInfo from './components/examInfo'
import ExamBatch from './components/examBatch'
import { postExamArrange, putExamArrange, getExamArrange } from '@/api/examManage/schedule'
import moment from 'moment'
const REFS_LIST = ['examInfo', 'examBatch']
// 培训编辑
export default {
  name: 'ExamEdit',
  components: {
    ExamInfo,
    ExamBatch
  },
  data() {
    return {
      submitLoading: false,
      publishType: 'publish',
      refsList: REFS_LIST,
      loading: false,
      activeStep: 0,
      formData: {},
      steps: [
        {
          label: '考试信息',
          icon: 'iconimage_icon_Examinationinformation'
        },
        {
          label: '考生批次',
          icon: 'iconimage_icon_Candidatesbatch'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['userId']),
    translateX() {
      return `translateX(${this.steps.findIndex((item, index) => index === this.activeStep) *
        100}%)`
    },
    id() {
      return _.get(this.$route.query, 'id', null)
    }
  },
  mounted() {
    this.$route.meta.keepAlive = false
    this.initData()
  },
  methods: {
    jumpStepByBatch() {
      if (this.activeStep === 0) {
        this.jumpStep(1)
      }
    },
    jumpStep(index) {
      this.activeStep = index
      // if (index === 0) {
      // } else {
      //   this.$refs[REFS_LIST[this.activeStep]].getData().then(() => {
      //     this.activeStep = index
      //   })
      // }
    },
    /***
     * @author guanfenda
     * @desc 返回上一步
     *
     * */
    handlePreviousStep() {
      this.activeStep = this.activeStep === 0 ? 0 : this.activeStep - 1
    },
    /***
     * @author guanfenda
     * @desc 处理下一步 验证当前form是否符合规范
     *
     * */
    handleNextStep() {
      this.activeStep = this.activeStep === 1 ? 0 : this.activeStep + 1
      // this.$refs[REFS_LIST[0]].getData().then(() => {
      // })
    },
    initData() {
      const examInfo = this.$refs.examInfo
      if (this.id) {
        // 编辑的时候的数据回显
        getExamArrange({ id: this.id }).then((res) => {
          //TODO: 不知为何测试环境不能置灰，先测试下
          if (examInfo) {
            examInfo.model = res
            this.$nextTick(() => {
              this.setDisabled(examInfo)
            })
            this.setLazySelectFisrt(examInfo, res)
            examInfo.loadTestPaper()
          }
          this.$store.commit('SET_PAPER_TIME', res.paperExpiredTime)
        })
      } else {
        examInfo.modelDisabled = false
        examInfo.setColumnsDisable(false)
      }
    },
    // 懒加载的默认值
    setLazySelectFisrt(examInfo, res) {
      examInfo.testPaperDefault = [
        {
          name: res.paperName,
          id: res.testPaper
        }
      ]
      _.each(res.reviewerNames, (item, index) => {
        _.set(examInfo, `reviewerDefault[${index}].name`, item)
      })
      _.each(res.reviewer, (item, index) => {
        _.set(examInfo, `reviewerDefault[${index}].userId`, item)
      })
    },
    // 设置置灰原则
    setDisabled(examInfo) {
      const type = _.get(this.$route, 'query.type')
      let disable = false
      //非草稿箱
      if (
        type === 'edit' &&
        examInfo.model.type === 0 &&
        (examInfo.model.status === '2' || examInfo.model.status === '3')
      ) {
        // 正在进行中的考试以及已结束的考试需要置灰
        disable = true
      } else {
        // 草稿与未开始的考试不要置灰
        disable = false
      }
      examInfo.modelDisabled = disable
      examInfo.setColumnsDisable(disable)
    },
    // 发布区分编辑发布还是新增发布
    publishFun(type) {
      this.publishType = type
      // 草稿提交不需要校验,  发布提交需要校验
      const examInfoData = this.$refs.examInfo.getData(type)
      const examBatchData = this.$refs.examBatch.getData(type)
      Promise.all([examInfoData, examBatchData]).then((res) => {
        this.handleSubmit(res, type)
      })
    },
    handleSubmit(res, type) {
      let params = this.handleParams(res, type)
      // 完全新增 无id
      // 复制 有id type为copy
      // 编辑有id 且type为edit
      let editFun = Object.create(null)
      if ((this.$route.query && this.$route.query.type === 'copy') || !this.id) {
        editFun = postExamArrange
      } else {
        editFun = putExamArrange
      }
      if (this.submitLoading) return
      this.submitLoading = true
      editFun(params)
        .then(() => {
          const tips = type === 'draft' ? '已发布草稿' : '已成功创建考试'
          this.$message.success(`${tips}，1秒后将自动返回`)
          setTimeout(() => {
            this.submitLoading = false
            this.$router.push({
              path: '/examManagement/examSchedule/list',
              query: { activeIndex: type === 'draft' ? '1' : '0' }
            })
          }, 1000)
        })
        .catch(() => {
          this.submitLoading = false
          window.console.error(JSON.stringify(params))
        })
    },
    // 统一处理入参
    handleParams(res, type) {
      let [examArrangeBasis, examineeBatchList] = res
      let examPattern = { examPattern: this.$route.query.examPattern }
      if (this.id) {
        let id = { id: this.id }
        _.assign(examArrangeBasis, id)
      }
      _.assign(examArrangeBasis, { type: type === 'publish' ? 0 : 1 })
      _.assign(examArrangeBasis, examPattern)
      _.assign(examArrangeBasis, { creatorId: this.userId })
      examArrangeBasis.fixedTime = !examArrangeBasis.fixedTime
        ? examArrangeBasis.fixedTime
        : moment(examArrangeBasis.fixedTime).format('YYYY-MM-DD HH:mm:ss')
      let params = {
        examArrangeBasis,
        examineeBatchList
      }
      return params
    },
    exit() {
      this.$confirm('离开此页面您的修改将会丢失, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$router.go(-1)
        })
        .catch(() => {})
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
      width: 20%;
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
