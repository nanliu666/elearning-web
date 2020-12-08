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
          @click="publish(2)"
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
          @click="publish(1)"
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
          @changeWay="changeWay"
        />
        <EditArrangement
          v-show="activeStep === 1"
          ref="editArrangement"
          :train-way="trainWay"
        />
        <EditDetail
          v-show="activeStep === 2"
          ref="editDetail"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import EditArrangement from './components/editArrangement'
import EditBasicInfo from './components/editBasicInfo'
import EditDetail from './components/editDetail'
import { createTrain, putTrain, getTrainDetail } from '@/api/train/train'
const REFS_LIST = ['editBasicInfo', 'editArrangement', 'editDetail']
// 培训编辑
export default {
  name: 'TrainingEdit',
  components: {
    EditArrangement,
    EditBasicInfo,
    EditDetail
  },
  data() {
    return {
      refsList: REFS_LIST,
      trainWay: 0,
      loading: false,
      activeStep: 0,
      steps: [
        {
          label: '填写基本信息',
          icon: 'icon-approval-info-outlined'
        },
        {
          label: '填写培训安排',
          icon: 'icon-approval-form-outlined'
        },
        {
          label: '配置详细信息',
          icon: 'icon-approval-flow-outlined'
        }
      ]
    }
  },
  computed: {
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
      this.$refs[REFS_LIST[this.activeStep]].getData().then(() => {
        this.activeStep = index
      })
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
        const basicKeyList = _.keys(this.$refs.editBasicInfo.formData)
        const detailKeyList = _.keys(this.$refs.editDetail.formData)
        this.loading = true
        getTrainDetail({ id: this.id })
          .then(({ trainExam, trainInfo, trainOfflineTodo, trainOnlineCourse }) => {
            this.loading = false
            const basicInfo = _.pick(trainInfo, basicKeyList)
            basicInfo['introduction'] = _.unescape(basicInfo['introduction'])
            const detailData = _.pick(trainInfo, detailKeyList)
            this.$refs.editBasicInfo.formData = basicInfo
            this.$refs.editDetail.formData = detailData
            this.$refs.editArrangement.schedule.data = trainOfflineTodo
            this.$refs.editArrangement.course.data = trainOnlineCourse
            this.$refs.editArrangement.examine.data = trainExam
          })
          .catch((error) => {
            this.$message.error(error)
            this.loading = false
          })
      }
    },
    // 培训方式改变，会导致培训安排内的线下日程/在线课程存在形式改变
    changeWay(data) {
      this.trainWay = data
    },
    // 发布区分编辑发布还是新增发布
    publish(type) {
      const basicData = this.$refs.editBasicInfo.getData()
      const editArrangement = this.$refs.editArrangement.getData()
      const detailData = this.$refs.editDetail.getData()
      Promise.all([basicData, editArrangement, detailData]).then((res) => {
        let params = this.handleParams(res, type)
        let editFun = this.id ? putTrain : createTrain
        editFun(params).then((resData) => {
          if (resData) {
            this.$message.success('发布成功')
            this.$router.go(-1)
          }
        })
      })
    },
    // 统一处理入参
    handleParams(res, type) {
      // 培训对象
      let trainObjectsList = []
      const pickTrain = _.get(res[0], 'trainObjectsList')
      _.each(pickTrain, (item) => {
        trainObjectsList.push({
          type: item.type,
          bizId: item.type === 'User' ? item.userId : item.bizId
        })
      })
      // 基本信息(除培训对象外)详细信息
      const trainInfo = _.chain(res[0])
        .omit('trainObjectsList')
        .assign(res[2])
        .value()
      trainInfo['introduction'] = _.escape(trainInfo['introduction'])
      trainInfo['type'] = type
      const { trainExam, trainOfflineTodo, trainOnlineCourse } = res[1]
      let params = {
        id: this.id,
        trainInfo,
        trainObjectsList,
        trainExam,
        trainOfflineTodo,
        trainOnlineCourse
      }
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
