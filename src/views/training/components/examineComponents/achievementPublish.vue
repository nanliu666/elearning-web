<template>
  <div class="achievementPublish">
    <div class="switch-container flex flex-justify-between flexcenter">
      <label class="switch-label">{{ evaluateObj.label }}</label>
      <!-- 控制显示隐藏 -->
      <el-switch
        v-model="evaluateObj['value']"
        @change="changeSwitch"
      />
    </div>
    <div class="content">
      <common-form
        ref="form"
        :model="model"
        class="form"
        :columns="columns"
      >
        <template #passType>
          <el-radio-group
            v-model="model.passType"
            :disabled="modelDisabled"
            style="display: flex;"
          >
            <condition-radio-input
              v-model="model.passScope"
              :label="1"
              :is-show="model.passType === 1"
              style="margin-right:40px"
              label-text="按成绩"
              text-before="成绩不低于"
              text-after="分"
              :input-props="{ maxLength: 4 }"
            />
            <condition-radio-input
              v-model="model.passPercentage"
              :label="2"
              :is-show="model.passType === 2"
              label-text="按得分率"
              text-before="得分率不低于"
              text-after="%"
              :input-props="{ maxLength: 4 }"
            />
          </el-radio-group>
        </template>
      </common-form>
    </div>
  </div>
</template>

<script>
import ConditionRadioInput from '@/components/condition-radio-input/condition-radio-input'
import moment from 'moment'
const defaultValue = {
  id: '',
  passType: 1,
  passScope: 60,
  passPercentage: 80,
  publishRules: 1,
  autoEvaluate: 1,
  fixedTime: new Date()
}
export default {
  name: 'AchievementPublish',
  components: {
    ConditionRadioInput
  },
  data() {
    return {
      evaluateObj: {
        label: '自动评定是否通过',
        value: ''
      },
      hideCondition: {},
      hideFixedTime: {},
      model: _.cloneDeep(defaultValue),
      columns: [
        {
          itemType: 'slot',
          span: 24,
          required: true,
          prop: 'passType',
          label: '通过条件'
        },
        {
          itemType: 'radio',
          span: 24,
          required: true,
          prop: 'publishRules',
          label: '发布规则',
          options: [
            { label: '系统即时发布', value: 1 },
            { label: '定时自动发布', value: 2 }
          ]
        },
        {
          itemType: 'datePicker',
          span: 24,
          type: 'datetime',
          rules: [
            { required: true, message: '定时发布日期不能为空', trigger: 'blur' },
            {
              required: true,
              validator: (rule, value, callback) => {
                // value成绩发布时间 isBefore 考试结束时间
                const examEndTime = _.get(this, '$parent.$children[0].model.examTime[1]', null)
                if (moment(value).isBefore(moment(examEndTime))) {
                  return callback(new Error('成绩发布时间不能早于考试结束时间'))
                }
                callback()
              },
              trigger: ['blur', 'change']
            }
          ],
          required: true,
          prop: 'fixedTime',
          label: '定时发布日期时间'
        }
      ]
    }
  },
  watch: {
    'model.publishRules': {
      handler(data) {
        if (data === 1) {
          this.columns = this.columns.filter((it) => {
            if (it.prop === 'fixedTime') {
              this.hideFixedTime = it
            } else {
              return it
            }
          })
        } else {
          this.columns.push(this.hideFixedTime)
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    resetFields() {
      this.model = _.cloneDeep(defaultValue)
    },
    changeSwitch(data) {
      this.model.autoEvaluate = data ? 1 : 0
      if (!data) {
        this.columns = this.columns.filter((it) => {
          if (it.prop === 'passType') {
            this.hideCondition = it
          } else {
            return it
          }
        })
      } else {
        this.columns.unshift(this.hideCondition)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.achievementPublish {
}

.switch-container {
  padding: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  .switch-label {
    color: #666666;
  }
}
.content {
  margin-top: 20px;
}
/deep/.el-date-range-picker {
  width: 600px !important;
}
</style>
