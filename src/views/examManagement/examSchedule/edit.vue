<template>
  <div class="page">
    <page-header
      :title="pageTitle"
      show-back
    />
    <div class="step__container">
      <div class="step__box">
        <el-steps
          :space="200"
          :active="activeStep"
          finish-status="success"
          align-center
        >
          <el-step
            title="信息配置"
            @click.native="changeTab(0)"
          ></el-step>
          <el-step
            title="考生批次"
            @click.native="changeTab(1)"
          ></el-step>
        </el-steps>
      </div>
    </div>
    <div class="main__container">
      <ExamInfo
        v-show="activeStep === 0"
        ref="examInfo"
      />
      <ExamBatch
        v-show="activeStep === 1"
        ref="examBatch"
        @jump="jumpStepByBatch"
      />
    </div>
    <div class="footer__container">
      <el-button
        v-if="activeStep === 0"
        type="primary"
        @click="handleNextStep"
      >
        下一步
      </el-button>
      <el-button
        v-if="activeStep === 1"
        v-loading="submitLoading && publishType === 'publish'"
        type="primary"
        @click="publishFun('publish')"
      >
        完成
      </el-button>
      <el-button
        v-if="!id || isDraft"
        v-loading="submitLoading && publishType === 'draft'"
        @click="publishFun('draft')"
      >
        存草稿
      </el-button>
      <el-button
        v-if="activeStep !== 0"
        @click="handlePreviousStep"
      >
        上一步
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { postExamArrange, putExamArrange } from '@/api/examManage/schedule'
import moment from 'moment'
const REFS_LIST = ['examInfo', 'examBatch']
// 培训编辑
export default {
  name: 'ExamEdit',
  components: {
    ExamInfo: () =>
      import('@/views/examManagement/examSchedule/components/editComponents/examInfo'),
    ExamBatch: () =>
      import('@/views/examManagement/examSchedule/components/editComponents/examBatch')
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
    pageTitle() {
      return this.$route.query.tagName
    },
    ...mapGetters(['userId']),
    isDraft() {
      return _.get(this.$route.query, 'isDraft', 0) == 1
    },
    id() {
      return _.get(this.$route.query, 'id', null)
    }
  },
  beforeRouteLeave(to, from, next) {
    from.meta.$keepAlive = false
    this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
    next()
  },
  methods: {
    changeTab(i) {
      this.activeStep = i
    },
    jumpStepByBatch() {
      if (this.activeStep === 0) {
        this.jumpStep(1)
      }
    },
    jumpStep(index) {
      this.activeStep = index
    },
    /***
     * @desc 返回上一步
     *
     * */
    handlePreviousStep() {
      this.activeStep = this.activeStep === 0 ? 0 : this.activeStep - 1
    },
    /***
     * @desc 处理下一步 验证当前form是否符合规范
     *
     * */
    handleNextStep() {
      this.activeStep = this.activeStep === 1 ? 0 : this.activeStep + 1
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
          const tips = type === 'draft' ? '已发布草稿' : `已成功${this.id ? '保存' : '创建'}考试`
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
  .step__container {
    display: flex;
    justify-items: center;
    align-items: center;
    height: 100px;
    width: 100%;
    background-color: #fff;
    border-bottom: 1px solid #d7d7d7;
    .step__box {
      width: 100%;
    }
    /deep/ .el-steps {
      justify-content: center;
    }
  }
  .main__container {
    padding: 40px 120px;
    background-color: #fff;
  }
  .footer__container {
    padding: 0 120px 40px;
    background-color: #fff;
  }
}
</style>
