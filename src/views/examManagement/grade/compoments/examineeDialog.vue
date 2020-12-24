<template>
  <el-dialog
    title="修改考生成绩"
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
            @input="numberInput($event, 'score')"
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
          @click="onsubmit"
        >
          保存
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { getExamineeAchievementEdit } from '@/api/examManagement/achievement'

export default {
  name: 'ExamineeDialog',
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
        prop: 'examineeName',
        itemType: 'slot',
        label: '考生姓名',
        span: 24,
        required: false
      },
      {
        prop: 'examTime',
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
        prop: 'isPass',
        itemType: 'radio',
        label: '是否通过',
        span: 24,
        required: false,
        props: {},
        options: [
          { label: '是', value: true },
          { label: '否', value: false }
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
          { label: '已发布', value: '5' },
          { label: '已提交', value: '4' },
          { label: '已阅卷', value: '3' },
          { label: '考试中', value: '2' },
          { label: '阅卷中', value: '1' }
        ]
      }
    ]
    return {
      jobColumn: JOBS_COLUMN,
      columns: BASE_COLUMNS,
      loading: false,
      roleVisible: true,
      form: {
        answerTime: '',
        totalScore: '',
        examineeName: '',
        examTime: '',
        score: '',
        isPass: '',
        status: ''
      },
      jobDicData: []
    }
  },
  watch: {
    row: {
      handler: function(newVal) {
        let { answerTime, totalScore, name, examTime, score, isPass, status, id } = newVal
        examTime = examTime.split('~')
        totalScore = totalScore / 10
        score = score / 10
        this.form = {
          answerTime: answerTime / 60,
          totalScore,
          name,
          examTime,
          score,
          isPass: isPass == 0 ? false : true,
          status,
          id
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
    onsubmit() {
      this.$refs.form.validate().then((valid) => {
        if (!valid) return
        let form = _.cloneDeep(this.form)
        let params = {
          ...form,
          totalScore: form.totalScore * 10,
          score: form.score * 10
        }
        getExamineeAchievementEdit(params).then(() => {
          this.$message.success('修改成功')
          this.$emit('loadData')
          this.onClose()
        })
      })
    },
    numberInput(value, data) {
      let str = (value && value.split('')) || []
      let reg1 = /\d/
      let reg2 = /\./
      // 第一个字符不能为小数点
      if (str[0] == '.') {
        this.form[name] = ''
        return
      }
      // 过滤掉除数字和小数点外的字符
      value = str.filter((e) => reg1.test(e) || reg2.test(e))
      // 匹配小数点后只能有一位小数
      let valJoin = value.join('')
      this.form[data] = valJoin.match(/^\d*(\.?\d{0,1})/g)[0] || null
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
