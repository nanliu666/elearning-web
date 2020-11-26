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
        :model="formData"
        class="form"
        :columns="columns"
      >
        <template #passType>
          <el-radio-group v-model="formData.passType">
            <achivementRadioInput
              v-model="formData.passType"
              label-text="按成绩"
              text-before="成绩不低于"
              text-after="分"
              :input-width="60"
              :default-value="passCondition[0].passType"
              :number.sync="passCondition[0].passScope"
              :pass-scope="formData.passScope"
              :input-props="{ maxLength: 4 }"
            ></achivementRadioInput>
            <achivementRadioInput
              v-model="formData.passType"
              label-text="按得分率"
              text-before="得分率不低于"
              text-after="%"
              :input-width="60"
              :default-value="passCondition[1].passType"
              :number.sync="passCondition[1].passScope"
              :input-props="{ maxLength: 4 }"
            ></achivementRadioInput>
          </el-radio-group>
        </template>
      </common-form>
    </div>
  </div>
</template>

<script>
import achivementRadioInput from './achivementRadioInput'
export default {
  name: 'AchievementPublish',
  components: {
    achivementRadioInput
  },
  data() {
    return {
      evaluateObj: {
        label: '自动评定是否通过',
        value: ''
      },
      hideCondition: {},
      hideFixedTime: {},
      passCondition: [
        {
          passType: 1,
          passScope: 60
        },
        {
          passType: 2,
          passScope: 80
        }
      ],
      formData: {
        passType: 1,
        passScope: 0,
        publishRules: 1,
        autoEvaluate: 1,
        fixedTime: []
      },
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
          type: 'datetimerange',
          required: true,
          prop: 'fixedTime',
          label: '定时发布日期时间'
        }
      ]
    }
  },
  watch: {
    'formData.passType': {
      handler(i) {
        this.formData.passScope = this.passCondition[i - 1]['passScope']
      },
      deep: true
    },
    'formData.publishRules': {
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
    changeSwitch(data) {
      this.formData.autoEvaluate = data ? 1 : 0
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
