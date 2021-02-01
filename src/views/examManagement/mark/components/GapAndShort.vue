<template>
  <div class="view-contain-box">
    <div class="dot-box">
      <div class="dot-content">
        <span class="dot"></span>
        <span class="dot-main">
          <span class="label">标准答案：</span>
          <span class="value is-correct">{{ getCorrect() }}</span>
        </span>
      </div>
    </div>
    <div class="mark-section">
      <div class="answer-li">
        <div class="li-left">
          <span class="label">考生答案：</span>
          <span class="value">{{ data.answerUser || '--' }}</span>
        </div>
        <!-- <el-button type="text">
          编辑
        </el-button> -->
      </div>
      <div class="split-line"></div>
      <common-form
        v-if="!isView"
        ref="form"
        :model="formData"
        :columns="columns"
        :config="{ labelPosition: 'left', labelWidth: '100px', labelPosition: 'right' }"
      >
        <template slot="scoreUser">
          <el-input-number
            v-model="formData.scoreUser"
            controls-position="right"
            :step="0.1"
          ></el-input-number>
        </template>
      </common-form>
      <div
        v-else
        class="view-box"
      >
        <div class="view-box-top">
          <div class="top-content">
            <span class="label">评分结果：</span>
            <span class="value">{{ getResult(data.result) || '--' }}</span>
          </div>
          <div class="top-content">
            <span class="label">得分：</span>
            <span class="value">{{ data.scoreUser || '--' }}</span>
          </div>
          <div v-if="data.review">
            <span class="label">评卷人：</span>
            <span class="value">{{ data.review || '--' }}</span>
          </div>
        </div>
        <div class="view-box-bottom">
          <span class="label">评语：</span>
          <span class="value">{{ data.reviewRemark || '--' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 填空题和简答题
const EventColumns = [
  {
    itemType: 'radio',
    span: 13,
    required: false,
    options: [
      {
        label: '对',
        value: '0'
      },
      {
        label: '错',
        value: '1'
      },
      {
        label: '部分对',
        value: '2'
      }
    ],
    prop: 'result',
    label: '评分结果：'
  },
  {
    itemType: 'slot',
    span: 10,
    prop: 'scoreUser',
    label: '得分：',
    placeholder: '请输入得分',
    rules: [{ required: false, message: '请输入得分', trigger: 'blur' }]
  },
  {
    itemType: 'input',
    span: 24,
    offset: 0,
    required: false,
    prop: 'reviewRemark',
    label: '考试评语：',
    rules: [{ required: false, message: '请输入评语', trigger: 'blur' }],
    placeholder: '请输入评语'
  }
]
export default {
  name: 'GapAndShort',
  inject: ['mark'],
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      isView: false,
      columns: _.cloneDeep(EventColumns),
      formData: {
        id: '',
        result: '',
        scoreUser: '',
        reviewRemark: ''
      }
    }
  },
  watch: {
    'formData.result': {
      handler(value) {
        if (value !== '-1') {
          this.columns[1].rules[0].required = true
          this.columns[2].rules[0].required = true
          switch (value) {
            case '0':
              this.formData.scoreUser = Number(this.data.scoreQuestion)
              break
            case '1':
              this.formData.scoreUser = 0
              break
            case '2':
              this.formData.scoreUser = Number(this.data.scoreQuestion) / 2
              break
          }
        }
      },
      deep: true
    },
    data: {
      handler(value) {
        if (value) {
          _.assign(this.formData, _.pick(this.data, _.keys(this.formData)))
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.isView = this.mark.isView
  },
  methods: {
    getResult(result) {
      const options = _.get(EventColumns, '[0].options', [])
      const target = _.find(options, (item) => {
        return item.value === result
      })
      return target.label
    },
    // 获取正确答案
    getCorrect() {
      // TODO: 填空题的标准答案获取
      return _.get(this.data, 'answerQuestion', '未设置标椎答案')
    },
    // 获取考生答案
    getAnswerValue() {
      const target = _.chain(this.data.options)
        .find((item) => {
          return item.id === this.data.answerUser
        })
        .get('content', '考生未作答')
        .value()
      return target
    }
  }
}
</script>

<style scoped lang="scss">
.view-contain-box {
  .label {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: rgba(0, 11, 21, 0.25);
  }
  .value {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: rgba(0, 11, 21, 0.85);
  }
  .is-correct {
    color: #00b061;
  }
  .is-fault {
    color: #ff4329;
  }
  .analysis-box {
    margin-top: 8px;
  }
  .common-box {
    padding: 24px;
    background-color: #fafafa;
  }
}
.dot-box {
  .dot-content {
    min-width: 60px;
    display: flex;
    align-items: center;
    .dot {
      align-self: flex-start;
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: rgba(0, 11, 21, 0.25);
      margin-right: 6px;
      margin-top: 6px;
    }
    .dot-main {
      flex: 1;
    }
  }
}
.mark-section {
  margin-top: 8px;
  background: #fafafa;
  padding: 10px 24px;
  .answer-li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .li-left {
      display: flex;
      align-items: center;
    }
  }
  .split-line {
    background: #ebeced;
    width: 100%;
    height: 1px;
    margin: 16px 0 24px;
  }
  /deep/ .el-form-item {
    margin-bottom: 16px;
  }
  .view-box {
    .view-box-top {
      margin-bottom: 30px;
      display: flex;
      .top-content {
        margin-right: 120px;
      }
    }
  }
}
</style>
