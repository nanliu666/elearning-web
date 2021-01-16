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
          :allow-create="true"
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
          :allow-create="true"
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

      <template #joinNum>
        <el-radio-group v-model="model.joinNum">
          <div class="flex-flow flex flexcenter">
            <el-radio :label="0">
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
          :default-value="2"
          :input-width="60"
          :input-props="{ maxLength: 4 }"
        ></checkbox-input>
      </template>
      <template #publishTime>
        <checkbox-input
          v-model="model.publishTime"
          text-before="考试开始前"
          text-after="分钟发布考试信息"
          :input-width="60"
        ></checkbox-input>
      </template>
    </common-form>
  </div>
</template>

<script>
import RadioInput from '@/components/radio-input/radio-input'
import CheckboxInput from '@/components/checkbox-input/checkbox-input'
import { getOrgUserList } from '@/api/system/user'
import { getExamList } from '@/api/examManage/schedule'
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
  name: 'BasicSetting',
  components: {
    RadioInput,
    CheckboxInput,
    LazySelect: () => import('@/components/lazy-select/lazySelect')
  },
  props: {
    // 父实体名称
    parentEntryCName: {
      type: String,
      default: '培训'
    }
  },
  data() {
    return {
      input: '',
      columns: [
        {
          itemType: 'datePicker',
          span: 24,
          type: 'datetimerange',
          rules: [
            {
              required: true,
              message: '请选择考试日期',
              trigger: 'blur'
            },
            { required: true, validator: this.validateExamTime, trigger: ['change'] }
          ],
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          prop: 'examTime',
          label: '考试日期'
        },
        {
          itemType: 'input',
          span: 24,
          required: true,
          prop: 'examName',
          label: '考试名称'
        },
        {
          itemType: 'slot',
          span: 24,
          rules: [
            {
              required: true,
              message: '请选择关联用卷',
              trigger: 'blur'
            }
          ],
          prop: 'testPaper',
          label: '关联用卷'
        },
        { itemType: 'slot', span: 24, required: false, prop: 'reviewer', label: '评卷人' },
        {
          itemType: 'radio',
          prop: 'answerMode',
          label: '答题模式',
          span: 24,
          options: [
            { label: '整卷模式', value: 1 },
            { label: '逐卷模式', value: 2 }
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
          prop: 'joinNum',
          label: '参加次数',
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
      ],
      model: {
        id: '',
        examTime: [],
        examName: '',
        testPaper: '',
        reviewer: null,
        answerMode: 1,
        reckonTime: false,
        reckonTimeValue: 60, // 限制时长60分钟
        joinNum: false,
        joinNumValue: 3, // 默认参加次数，不超过3次
        integral: 0,
        strategy: 0,
        publishTime: 0
      },
      testPaperList: []
    }
  },
  watch: {
    'model.testPaper': {
      handler(val) {
        this.$set(this.model, 'testPaperType', _.find(this.testPaperList, { id: val }).type)
      }
    }
  },
  computed: {
    ...mapGetters(['trainTimeInVuex'])
  },
  methods: {
    // 考试开始时间大于等于培训开始时间，考试结束时间要小于等于培训结束时间
    validateExamTime(rule, value, callback) {
      // 培训开始时间要在考试时间之前
      const isLegalBeginTime = moment(this.trainTimeInVuex[0]).isSameOrBefore(
        moment(this.model.examTime[0])
      )
      // 培训结束时间要在考试结束时间之后
      const isLegalEndTime = moment(this.trainTimeInVuex[1]).isSameOrAfter(
        moment(this.model.examTime[1])
      )
      if (!isLegalBeginTime) {
        callback(
          new Error(
            `考试开始日期要在${this.parentEntryCName}开始日期（${this.trainTimeInVuex[0]}）之后`
          )
        )
      } else if (!isLegalEndTime) {
        callback(
          new Error(
            `考试结束日期要在${this.parentEntryCName}结束日期（${this.trainTimeInVuex[1]}）之前`
          )
        )
      } else {
        callback()
      }
    },
    loadCoordinator(params) {
      return getOrgUserList(_.assign(params, { orgId: 0 }))
    },
    loadTestPaper(params) {
      return getExamList(params)
    }
  }
}
</script>

<style scoped lang="scss">
.basecSetting {
  overflow: scroll;
  height: 100%;
}
</style>
