<template>
  <div class="mark-section">
    <div class="mark-top">
      <span class="top-left">
        <span class="label">考生姓名：</span>
        <span class="value">******</span>
      </span>
      <span>
        <span class="label">归属组织：</span>
        <span class="value">{{ data.dept || '--' }}</span>
      </span>
    </div>
    <div class="li">
      <span class="label">考生答案：</span>
      <span class="value">{{ data.answerUser || '--' }}</span>
    </div>
    <div class="split-line"></div>
    <common-form
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
  </div>
</template>

<script>
const EventColumnsS = [
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
  name: 'ByPaperForm',
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formData: {
        result: '', // 评价结果
        scoreUser: '', // 评分
        reviewRemark: '', // 评语
        id: '' //考生答卷答题卡id
      },
      columns: _.cloneDeep(EventColumnsS)
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
  methods: {}
}
</script>

<style scoped lang="scss">
.mark-section {
  margin-top: 8px;
  background: #fafafa;
  padding: 24px;
  .mark-top {
    margin-bottom: 16px;
    .top-left {
      margin-right: 50px;
    }
  }
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
}
</style>
