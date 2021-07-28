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
          <div class="name__container">
            <span class="name__label">考生姓名：</span>
            <span>{{ form.name || form.userName }}</span>
          </div>
        </template>
        <template #examTimeLabelRight>
          <div style="display: inline-block; float: right">
            <span>考试时间：</span>
            <span>{{ `${form.answerTime ? form.answerTime : 0}分钟` }}</span>
          </div>
        </template>
        <template #scoreLabelRight>
          <div style="display: inline-block; float: right">
            <span>试卷总分：</span>
            <span>{{ form.totalScore }}分</span>
          </div>
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
import { getExamineeAchievementEdit, updateOfflineGrade } from '@/api/examManagement/achievement'
import moment from 'moment'
export default {
  name: 'ExamineeDialog',
  components: {},
  props: {
    isOnline: {
      type: Boolean,
      default: true
    },
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
        itemType: 'slotout',
        label: '',
        span: 24,
        required: false
      },
      {
        prop: 'examTime',
        itemType: 'datePicker',
        hasLabelRight: true,
        isHidden: true,
        type: 'datetimerange',
        valueFormat: 'yyyy-MM-dd HH:mm:ss',
        label: '考试时间',
        span: 24,
        required: true
      },
      {
        prop: 'score',
        itemType: 'slot',
        hasLabelRight: true,
        label: '成绩',
        span: 24,
        rules: [{ required: true, message: '请输入成绩', trigger: ['blur', 'change'] }],
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
          { label: '是', value: '1' },
          { label: '否', value: '0' }
        ]
      },
      {
        prop: 'status',
        isHidden: true,
        itemType: 'select',
        label: '答卷状态',
        span: 24,
        required: true,
        props: {
          label: 'label',
          value: 'value'
        },
        // 答卷状态: 1-已发布 2-考试中 3-已提交 4-阅卷中 5-已阅卷
        options: [
          { label: '已发布', value: '1' },
          { label: '考试中', value: '2' },
          { label: '已提交', value: '3' },
          { label: '阅卷中', value: '4' },
          { label: '已阅卷', value: '5' }
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
    isOnline: {
      handler(val) {
        if (!_.isEmpty(this.columns)) {
          const examTimeProp = _.find(this.columns, { prop: 'examTime' })
          _.set(examTimeProp, 'isHidden', !val)
          _.set(examTimeProp, 'required', val)
          const scoreProp = _.find(this.columns, { prop: 'score' })
          _.set(scoreProp, 'hasLabelRight', val)
          const statusProp = _.find(this.columns, { prop: 'status' })
          _.set(statusProp, 'isHidden', !val)
          _.set(statusProp, 'required', val)
          this.$forceUpdate()
        }
      },
      deep: true,
      immediate: true
    },
    'form.examTime': {
      handler(val) {
        this.form.answerTime = this.getDiffTime(val)
      },
      immediate: true,
      deep: true
    },
    row: {
      handler: function(newVal) {
        let { examTime, ...others } = newVal
        this.form = {
          ...others,
          examTime: examTime && examTime.split('~')
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
  methods: {
    getDiffTime(examTime) {
      if (!examTime) return
      const timeDiff = Math.ceil(moment(examTime[1]).diff(moment(examTime[0]), 'seconds') / 60)
      return timeDiff
    },
    onsubmit() {
      this.$refs.form.validate().then((valid) => {
        if (!valid) return
        const tempParams = _.cloneDeep(this.form)
        const offlineParams = _.pick(tempParams, ['id', 'score', 'isPass'])
        const onLineParams = _.assign(tempParams, {
          isPass: this.form.isPass == '0' ? false : true
        })
        const params = this.isOnline ? onLineParams : offlineParams
        const loadFun = this.isOnline ? getExamineeAchievementEdit : updateOfflineGrade
        loadFun(params).then(() => {
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
.name__container {
  margin-bottom: 24px;
  .name__label {
    font-size: 14px;
    color: #0f0000;
  }
}
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
