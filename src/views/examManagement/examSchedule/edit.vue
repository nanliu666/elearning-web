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
            <i :class="[item.icon]" />
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
        <!-- v-if="activeStep === 2" -->
        <el-button
          size="medium"
          type="primary"
          @click="publish('publish')"
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
      refsList: REFS_LIST,
      loading: false,
      activeStep: 0,
      formData: {},
      steps: [
        {
          label: '考试信息',
          icon: 'el-icon-warning-outline'
        },
        {
          label: '考生批次',
          icon: 'el-icon-setting'
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
    this.initData()
  },
  methods: {
    jumpStep(index) {
      this.activeStep = index
      // this.$refs[REFS_LIST[this.activeStep]].getData().then(() => {
      //   this.activeStep = index
      // })
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
      this.$refs[REFS_LIST[this.activeStep]].getData().then(() => {
        this.activeStep = this.activeStep === 2 ? 0 : this.activeStep + 1
      })
    },
    initData() {
      if (this.id) {
        // 编辑的时候的数据回显
        getExamArrange({ id: this.id }).then(() => {})
      }
    },
    // 发布区分编辑发布还是新增发布
    publish(type) {
      const examInfoData = this.$refs.examInfo.getData()
      const examBatchData = this.$refs.examBatch.getData()
      Promise.all([examInfoData, examBatchData]).then((res) => {
        let params = this.handleParams(res, type)
        let editFun = this.id ? putExamArrange : postExamArrange
        editFun(params).then((resData) => {
          if (resData) {
            this.$message.success('已成功创建考试，3秒后自动返回考试列表')
            setTimeout(() => {
              this.$router.go(-1)
            }, 3000)
          }
        })
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
      _.assign(examArrangeBasis, { type: type === 'publish' ? 1 : 2 })
      _.assign(examArrangeBasis, examPattern)
      _.assign(examArrangeBasis, { creatorId: this.userId })
      examArrangeBasis.fixedTime = moment(examArrangeBasis.fixedTime).format('YYYY-MM-DD HH:mm:ss')
      let params = {
        examArrangeBasis,
        examineeBatchList
      }
      // console.log('处理后的总参数==', params)
      // console.log('处理后的总参数==', JSON.stringify(params))
      return params
    },
    exit() {
      this.$confirm('离开此页面您得修改将会丢失, 是否继续?', '提示', {
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
