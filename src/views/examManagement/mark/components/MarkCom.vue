<template>
  <div class="mark-section">
    <div class="answer-li">
      <div class="li-left">
        <span class="answer-label">考生答案：</span>
        <span class="answer-value">{{ answer }}</span>
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
      :config="{ labelPosition: 'left', labelWidth: '70px' }"
    >
    </common-form>
  </div>
</template>

<script>
const EventColumns = [
  {
    itemType: 'radio',
    span: 11,
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
    label: '评分结果'
  },
  {
    itemType: 'input',
    span: 8,
    offset: 5,
    required: false,
    prop: 'score',
    label: '得分'
  },
  {
    itemType: 'input',
    span: 24,
    required: false,
    prop: 'comment',
    label: '评语'
  }
]
export default {
  name: 'MarkCom',
  props: {
    answer: {
      type: [String, Number, Array, Boolean],
      default: '春秋|战国'
    }
  },
  data() {
    return {
      columns: EventColumns,
      formData: {
        result: '',
        score: '',
        comment: ''
      }
    }
  },
  watch: {
    'formData.result': {
      handler(value) {
        if (value) {
          this.columns[1].required = true
          this.columns[2].required = true
        }
      },
      deep: true
    }
  },
  created() {},
  methods: {}
}
</script>

<style scoped lang="scss">
.mark-section {
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
