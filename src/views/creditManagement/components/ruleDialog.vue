<template>
  <el-dialog
    :title="form.id ? '编辑积分规则' : '新建积分规则'"
    :visible.sync="roleVisible"
    width="500px"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :before-close="onClose"
    @opened="onOpened"
  >
    <div v-loading="loading">
      <commonForm
        ref="form"
        :model="form"
        :columns="columns"
      >
        <template #examineeName>
          {{ form.name }}
        </template>
        <template #answerTime>
          <el-input
            v-model="form.answerTime"
            placeholder="请输入答题时间"
            @input="numberInput($event, 'answerTime')"
          >
            <i
              slot="suffix"
              class="answerTime"
            >分钟</i>
          </el-input>
        </template>
        <template #score>
          <el-input
            v-model="form.score"
            placeholder="请输入成绩"
            type="Number"
          >
            <i
              slot="suffix"
              class="answerTime"
            >分</i>
          </el-input>
        </template>
        <template #totalScore>
          <el-input
            v-model="form.totalScore"
            placeholder="请输入试卷总分"
            type="Number"
          >
            <i
              slot="suffix"
              class="answerTime"
            >分</i>
          </el-input>
        </template>
      </commonForm>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="medium"
          @click="onClose"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          size="medium"
          @click="onsubmit"
        >
          保存
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { postAddStudentsRulus, getListSysRulus, editStudentsRulus } from '@/api/credit/credit'

export default {
  name: 'RuleDialog',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {
        return {}
      }
    },
    categoryId: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data() {
    const JOBS_COLUMN = {
      prop: 'jobs',
      itemType: 'slot',
      placeholder: '请选择关联职位',
      span: 24,
      label: '关联职位',
      required: true
    }
    const BASE_COLUMNS = [
      {
        prop: 'stuName',
        itemType: 'input',
        label: '积分规则名称',
        maxlength: 10,
        minlength: 2,
        span: 24,
        required: true
      },
      {
        prop: 'sysRuleId',
        itemType: 'select',
        label: '规则来源',
        span: 24,
        required: true,
        props: {
          label: 'sysRuleSource',
          value: 'id'
        },
        options: []
      },
      {
        prop: 'score',
        itemType: 'inputNumber',
        min: 0,
        precision: 1,
        step: 0.1,
        maxlength: 32,
        label: '积分分值',
        span: 24,
        required: true
      },
      {
        prop: 'dayLimit',
        itemType: 'inputNumber',
        min: 0,
        precision: 0,
        step: 1,
        maxlength: 32,
        label: '每日上限',
        span: 24,
        rules: [
          {
            required: true,
            message: '请输入每日上限',
            trigger: 'blur'
          }
        ]
      },
      {
        prop: 'ruleState',
        itemType: 'input',
        type: 'textarea',
        label: '分值规则说明',
        span: 24,
        required: false
      }
    ]
    return {
      jobColumn: JOBS_COLUMN,
      columns: BASE_COLUMNS,
      loading: false,
      roleVisible: true,
      form: {
        stuName: '',
        sysRuleId: '',
        dayLimit: '',
        score: undefined,
        ruleState: ''
      },
      jobDicData: []
    }
  },
  watch: {
    row: {
      handler(val) {
        let { id_str, stu_name, sys_rule_id_str, day_limit, score, rule_state } = val
        this.form = {
          id: id_str,
          stuName: stu_name,
          sysRuleId: sys_rule_id_str,
          dayLimit: day_limit,
          score,
          ruleState: rule_state
        }
      },
      immediate: true,
      deep: true
    },
    roleVisible: {
      handler: function() {
        this.$emit('update:visible', this.roleVisible)
        this.$emit('update:row', {})
      }
    }
  },
  mounted() {
    this.getsysRule()
  },
  methods: {
    getsysRule() {
      let params = {
        status: '1'
      }
      getListSysRulus(params).then((res) => {
        this.columns.find((it) => it.prop == 'sysRuleId').options = res
      })
    },
    onsubmit({ isContinue = false }) {
      this.$refs.form.validate().then((valid) => {
        if (!valid) return
        let form = _.cloneDeep(this.form)
        let params = {
          ...form
        }
        let rule = form.id ? editStudentsRulus : postAddStudentsRulus
        this.loading = true
        rule(params)
          .then(() => {
            this.$message.success('提交成功')
            this.$emit('loadData')
            if (isContinue) {
              this.$refs.form.resetFields()
            } else {
              this.onClose()
            }
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    numberInput(value, data) {
      this.form[data] = value.replace(/[^\d]/g, '')
    },
    onOpened() {},
    onClose() {
      this.roleVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__header {
  padding: 16px 0;
  margin: 0 24px;
  border-bottom: 1px solid rgba(208, 211, 214, 0.44);
  font-size: 18px;
  color: #202940;
  line-height: 24px;
}

/deep/ .el-dialog__body {
  padding: 24px;
}

/deep/ .el-dialog__footer {
  padding: 0px 24px 24px;
}

/deep/ .el-form-item__label {
  line-height: 20px;
  font-size: 14px;
  color: #0f0000;
}

/deep/ .el-form-item {
  margin-bottom: 24px;
}

.dialog-footer {
  text-align: right;
}

/deep/ .is-error {
  .tree-button {
    border-color: #f56c6c;
  }
}

/deep/ .el-radio {
  margin-right: 20px;
}

/deep/ .el-input__icon .el-input__validateIcon .el-icon-circle-close {
  display: none;
}

.answerTime {
  font-size: 14px;
  margin-right: 5px;
}
</style>
