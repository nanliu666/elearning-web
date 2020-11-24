<template>
  <div
    v-loading="loading"
    class="trainingEdit page"
  >
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
          :class="[activeStep == item.key ? 'active' : '']"
          @click="changeSteps(item)"
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
          class="publish-btn"
          size="medium"
          type="primary"
        >
          发布
        </el-button>
      </div>
    </header>
    <el-row
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
        <EditBasicInfo v-if="activeStep === 'basicInfo'" />
        <EditArrangement v-if="activeStep === 'arrangement'" />
        <EditDetail v-if="activeStep === 'detail'" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import EditArrangement from './components/editArrangement'
import EditBasicInfo from './components/editBasicInfo'
import EditDetail from './components/editDetail'

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
      loading: false,
      activeStep: 'basicInfo',
      steps: [
        {
          label: '填写基本信息',
          key: 'basicInfo',
          icon: 'icon-approval-info-outlined'
        },
        {
          label: '填写培训安排',
          key: 'arrangement',
          icon: 'icon-approval-form-outlined'
        },
        {
          label: '配置详细信息',
          key: 'detail',
          icon: 'icon-approval-flow-outlined'
        }
      ]
    }
  },
  computed: {
    translateX() {
      return `translateX(${this.steps.findIndex((t) => t.key === this.activeStep) * 100}%)`
    }
  },
  methods: {
    changeSteps(item) {
      this.activeStep = item.key
    },
    exit() {
      this.$confirm('离开此页面您得修改将会丢失, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$router.push({
            path: '/apprProcess/approvalList'
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
$header-height: 54px;
.trainingEdit {
}
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
          border-bottom: 2px solid #207efa;
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
