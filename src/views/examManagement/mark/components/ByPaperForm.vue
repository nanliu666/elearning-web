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
      :model="data"
      :columns="columns"
      :config="{ labelPosition: 'left', labelWidth: '100px', labelPosition: 'right' }"
    >
      <template slot="scoreUser">
        <el-input-number
          v-model="data.scoreUser"
          controls-position="right"
          :step="0.1"
        ></el-input-number>
      </template>
      <template slot="result">
        <el-radio-group
          v-model="data.result"
          @change="reslutChange"
        >
          <el-radio :label="0">
            对
          </el-radio>
          <el-radio :label="1">
            错
          </el-radio>
          <el-radio :label="2">
            部分对
          </el-radio>
        </el-radio-group>
      </template>
    </common-form>
  </div>
</template>

<script>
// 逐题评卷内的表格
const EventColumnsS = [
  {
    itemType: 'slot',
    span: 14,
    required: false,
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
      columns: _.cloneDeep(EventColumnsS)
    }
  },
  watch: {
    data: {
      handler(value) {
        if (value) {
          this.columns[1].rules[0].required = true
          this.columns[2].rules[0].required = true
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  methods: {
    reslutChange(value) {
      switch (value) {
        case 0:
          this.data.scoreUser = this.data.scoreQuestion
          break
        case 1:
          this.data.scoreUser = 0
          break
        case 2:
          this.data.scoreUser = this.data.scoreQuestion / 2
          break
      }
    }
  }
}
</script>

<style scoped lang="scss">
.mark-section {
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
  /deep/ .el-input-number--medium {
    width: 100%;
  }
}
</style>
