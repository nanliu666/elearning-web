<template>
  <div class="basecSetting">
    <common-form
      ref="form"
      :model="model"
      class="form"
      :columns="columns"
    >
      <template #testPaper>
        <lazy-select
          ref="testPaperRef"
          v-model="model.testPaper"
          :searchable="true"
          :load="loadTestPaper"
          :option-list.sync="testPaperList"
          :option-props="{
            label: 'name',
            value: 'id',
            key: 'id'
          }"
        />
      </template>
      <template #reviewer>
        <lazy-select
          v-model="model.reviewer"
          :searchable="true"
          :load="loadCoordinator"
          :multiple="true"
          :option-props="{ label: 'name', value: 'userId', key: 'userId' }"
        />
      </template>
      <template #reckonTime>
        <el-radio-group v-model="model.reckonTime">
          <el-radio :label="false">
            不计时
          </el-radio>
          <radio-input
            :label="true"
            :input-value.sync="model.reckonTimeValue"
            text-before="限制时长"
            text-after="分钟"
            :input-props="{ maxLength: 4, disabled: !model.reckonTime }"
          />
        </el-radio-group>
      </template>
      <template #questionTimeLimitType>
        <el-radio-group
          v-model="model.questionTimeLimitType"
          :disabled="modelDisabled"
        >
          <el-radio :label="0">
            不计时
          </el-radio>
          <el-radio :label="1">
            按试题原设置时间
          </el-radio>
          <radio-input
            :label="2"
            :input-value.sync="model.questionTimeLimit"
            text-before="每题限时"
            text-after="分钟"
            :input-props="{
              maxLength: 4,
              disabled: modelDisabled || model.questionTimeLimitType !== 2
            }"
          />
        </el-radio-group>
      </template>
      <template #joinNum>
        <el-radio-group v-model="model.joinNum">
          <div class="flex-flow flex flexcenter">
            <el-radio :label="false">
              不限次数
            </el-radio>
            <radio-input
              :label="true"
              :input-value.sync="model.joinNumValue"
              text-before="限制次数 不超过"
              text-after="次"
              :input-props="{ maxLength: 2, disabled: !model.joinNum }"
            />
          </div>
        </el-radio-group>
      </template>
      <template #integral>
        <checkbox-input
          v-model="model.integral"
          text-before="本考试记录系统积分，积分值为"
          text-after="分"
          :default-value.sync="model.integralValue"
          :input-width="60"
          :input-props="{ maxLength: 4, disabled: !model.integral }"
        ></checkbox-input>
      </template>
      <template #publishTime>
        <checkbox-input
          v-model="model.publishTime"
          text-before="考试开始前"
          text-after="分钟发布考试信息"
          :input-width="60"
          :default-value.sync="model.publishTimeValue"
          :input-props="{ maxLength: 4, disabled: !model.publishTime }"
        ></checkbox-input>
      </template>
    </common-form>
  </div>
</template>

<script>
import RadioInput from '@/components/radio-input/radio-input'
import CheckboxInput from '@/components/checkbox-input/checkbox-input'
import { getWorkList } from '@/api/system/user'
import { getExamList } from '@/api/examManage/schedule'
import moment from 'moment'
import { mapGetters } from 'vuex'
import { Validate } from '../validate'
const BASIC_COLUMNS = [
  {
    itemType: 'datePicker',
    span: 24,
    type: 'datetimerange',
    valueFormat: 'yyyy-MM-dd HH:mm:ss',
    prop: 'examTime',
    label: '考试日期'
  },
  {
    itemType: 'input',
    span: 24,
    required: true,
    maxLength: 20,
    prop: 'examName',
    label: '考试名称'
  },
  {
    itemType: 'slot',
    span: 24,
    required: true,
    prop: 'testPaper',
    label: '关联用卷'
  },
  {
    itemType: 'slot',
    span: 24,
    required: true,
    trigger: ['blur', 'change'],
    prop: 'reviewer',
    label: '评卷人'
  },
  {
    itemType: 'radio',
    prop: 'answerMode',
    label: '答题模式',
    span: 24,
    options: [
      { label: '整卷模式', value: 1 },
      { label: '逐题考试', value: 2 }
    ]
  },
  {
    itemType: 'slot',
    prop: 'reckonTime',
    label: '考试时长',
    span: 24
  },
  {
    itemType: 'slot',
    prop: 'questionTimeLimitType',
    label: '逐题计时',
    span: 24
  },
  {
    itemType: 'radio',
    prop: 'strategy',
    label: '考试时间策略',
    span: 24,
    options: [
      { label: '允许进入考试的时间', value: 0 },
      { label: '允许参考时间（到结束时间，会自动提交。）', value: 1 }
    ]
  },
  {
    itemType: 'slot',
    prop: 'joinNum',
    label: '参加次数',
    span: 24
  },
  {
    itemType: 'slot',
    prop: 'integral',
    label: '积分',
    span: 24
  },
  {
    itemType: 'slot',
    prop: 'publishTime',
    label: '发布考试',
    span: 24
  }
]
export default {
  name: 'BasicSetting',
  components: {
    RadioInput,
    CheckboxInput,
    LazySelect: () => import('@/components/lazy-select/lazySelect')
  },
  props: {
    // 实体名称
    entryCName: {
      type: String,
      default: '培训'
    }
  },
  data() {
    return {
      input: '',
      columns: BASIC_COLUMNS,
      model: {
        id: '',
        reviewerNames:'',
        reviewer:'',
        questionTimeLimitType: 0, // 0-不计时,1-按原试题设置,2-重新设置
        questionTimeLimit: 1, //每题限时默认为1
        examTime: [],
        examName: '',
        testPaper: '',
        testPaperName:'',
        reviewer: null,
        answerMode: 1,
        reckonTime: false,
        reckonTimeValue: 60, // 限制时长60分钟
        joinNum: false,
        joinNumValue: 3, // 默认参加次数，不超过3次
        integral: false,
        integralValue: 2,
        strategy: 0,
        publishTime: false,
        publishTimeValue: 10
      },
      testPaperList: []
    }
  },
  computed: {
    ...mapGetters(['trainTimeInVuex'])
  },
  watch: {
    entryCName: {
      handler(val) {
        // 直播不需要校验直播时间与考试时间的关系
        const basicRule = {
          required: true,
          message: '请选择考试日期',
          trigger: 'blur'
        }
        const validateExamTimeRule = {
          required: true,
          validator: this.validateExamTime,
          trigger: ['change']
        }
        let targetRule = val === '直播' ? [basicRule] : [basicRule, validateExamTimeRule]
        _.set(this.columns, '[0].rules', targetRule)
      },
      deep: true,
      immediate: true
    },
    'model.testPaper': {
      handler(val) {
        // 设置试卷校验
        const rules = [
          { required: true, validator: this.validateTestPaper, trigger: ['blur', 'change'] }
        ]
        _.set(_.find(this.columns, { prop: 'testPaper' }), 'rules', rules)
        this.$set(
          this.model,
          'testPaperType',
          _.get(_.find(this.testPaperList, { id: val }), 'type')
        )
        
      }
    }
  },
  methods: {
    // 考试结束日期在试卷有效期之前
    validateTestPaper(rule, value, callback) {
      if (!value) callback('请选择关联同卷')
      if (_.get(this.$refs, 'testPaperRef')) {
        const temp = _.find(this.$refs.testPaperRef.optionList, (item) => {
          return item.id === value
        })
        const paperExpiredTime = _.get(temp, 'expiredTime')
        // 培训结束日期在卷子有效期之前
        const isLegalExpiredTime = moment(this.model.examTime[1]).isSameOrBefore(paperExpiredTime)
        if (paperExpiredTime && !isLegalExpiredTime) {
          callback(
            new Error(
              `此卷结束日${paperExpiredTime}在考试结束日时（${this.model.examTime[1]}）已过期`
            )
          )
        } else {
          callback()
        }
      }
    },
    // 考试开始时间大于等于培训开始时间，考试结束时间要小于等于培训结束时间
    validateExamTime(rule, value, callback) {
      Validate.validateLegalTime(
        callback,
        this.trainTimeInVuex,
        this.model.examTime,
        '考试日期',
        this.entryCName
      )
      // 如果有考卷再去校验一次考卷的过期时间与考试时间的关系
      if (this.model.testPaper) {
        this.$refs.form.validateField('testPaper')
      }
    },
    async loadCoordinator(params) {
      let res = await getWorkList(_.assign(params, { orgId: 0 }))
      //如果萍评卷人列表没有当前用户  自己添加一个
      if(this.model.reviewer && this.model.reviewer.length>0){
        this.model.reviewer.forEach((item,index)=>{
          if(!_.find(res.data, { id: item })){
            // let nameArr =  this.model.reviewerNames.split(',')
            res.data.push({
                name:this.model.reviewerNames[index],
                userId:item
            })
          }
        })
      }
        
      return res
    },
    async loadTestPaper(params) {
      let res = await getExamList(_.assign(params, { status: 'normal' }))
      //如果试卷列表没有当前试卷  自己添加一个
        if(!_.find(res.data, { id: this.model.testPaper })){
          res.data.push({
              name:this.model.testPaperName,
              id:this.model.testPaper
          })
        }
        return res
    }
  }
}
</script>

<style scoped lang="scss">
.basecSetting {
  overflow: scroll;
  height: 75vh;
}
</style>
