<template>
  <el-dialog
    :title="form.roleId ? '编辑角色' : '新建角色'"
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
            @input="numberInput($event, 'score')"
          >
            <i
              slot="suffix"
              class="answerTime"
            >分</i>
          </el-input>
        </template>
        <template #answerTime>
          <el-input
            v-model="form.totalScore"
            placeholder="请输入试卷总分"
            @input="numberInput($event, 'totalScore')"
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
        >
          保存
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ExamineeDialog',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    jobs: {
      type: Array,
      default: () => []
    },
    positions: {
      type: Array,
      default: () => []
    },
    jobProps: {
      type: Object,
      default: () => {
        return {}
      }
    },
    positionProps: {
      type: Object,
      default: () => {
        return {}
      }
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
        prop: 'roleName',
        itemType: 'input',
        label: '考生姓名',
        span: 24,
        disabled: true,
        required: false
      },
      {
        prop: 'remark',
        itemType: 'datePicker',
        type: 'datetimerange',
        label: '考试时间',
        span: 24,
        required: true
      },
      {
        prop: 'answerTime',
        itemType: 'slot',
        type: 'datetimerange',
        label: '答题时间',
        span: 24,
        required: true,
        props: {
          onlyNumber: true
        }
      },
      {
        prop: 'score',
        itemType: 'slot',
        label: '成绩',
        span: 24,
        required: true,
        props: {
          onlyNumber: true
        }
      },
      {
        prop: 'totalScore',
        itemType: 'slot',
        label: '试卷总分',
        span: 24,
        required: true,
        props: {
          onlyNumber: true
        }
      },
      {
        prop: 'radiso',
        itemType: 'radio',
        label: '是否通过',
        span: 24,
        required: false,
        props: {},
        options: [
          { label: '是', value: 1 },
          { label: '否', value: 0 }
        ]
      },
      {
        prop: 'status',
        itemType: 'select',
        label: '答卷状态',
        span: 24,
        required: true,
        props: {
          label: 'label',
          value: 'value'
        },
        options: [
          { label: '已发布', value: 4 },
          { label: '已提交', value: 3 },
          { label: '已阅卷', value: 2 },
          { label: '考试中', value: 1 },
          { label: '阅卷中', value: 0 }
        ]
      }
    ]
    return {
      jobColumn: JOBS_COLUMN,
      columns: BASE_COLUMNS,
      loading: false,
      roleVisible: true,
      form: {
        roleId: '',
        roleName: '',
        remark: '',
        answerTime: '',
        totalScore: ''
      },
      jobDicData: []
    }
  },
  watch: {
    row: {
      handler: function(newVal) {
        let { roleId, roleName, remark } = { ...newVal }
        this.form = {
          roleId,
          roleName,
          remark
        }
      },
      immediate: true,
      deep: true
    },
    roleVisible: {
      handler: function() {
        this.$emit('update:visible', this.roleVisible)
      }
    }
  },
  mounted() {},
  methods: {
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
