<template>
  <div class="view-contain-box">
    <div class="dot-box">
      <div class="dot-content">
        <span class="dot"></span>
        <span>
          <span class="label">标准答案：</span>
          <span class="value is-correct">{{ getCorrect() }}</span>
        </span>
      </div>
    </div>
    <div class="mark-section">
      <div class="answer-li">
        <div class="li-left">
          <span class="answer-label">考生答案：</span>
          <span class="answer-value">{{ data.answerUser || '--' }}</span>
        </div>
        <el-button type="text">
          编辑
        </el-button>
      </div>
      <div class="split-line"></div>
      <common-form
        ref="form"
        :model="formData"
        :columns="columns"
        :config="{ labelPosition: 'left', labelWidth: '100px', labelPosition: 'right' }"
      >
      </common-form>
    </div>
  </div>
</template>

<script>
const EventColumns = [
  {
    itemType: 'radio',
    span: 14,
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
    itemType: 'input',
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
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
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
        if (value) {
          this.columns[1].rules[0].required = true
          this.columns[2].rules[0].required = true
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
  created() {},
  methods: {
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
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: rgba(0, 11, 21, 0.25);
      margin-right: 6px;
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
      .answer-label {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.25);
      }
      .answer-value {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.85);
      }
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
}
</style>
