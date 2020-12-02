<template>
  <div class="basecSetting">
    <common-form
      ref="form"
      :model="model"
      :columns="columns"
    >
      <template #title1>
        基础信息
      </template>
      <template #title2>
        基础设置
      </template>
      <template #testPaper>
        <lazy-select
          v-model="model.testPaper"
          :allow-create="true"
          :searchable="true"
          :load="loadCoordinator"
          :option-props="personOptionProps"
        />
      </template>
      <template #reviewer>
        <lazy-select
          v-model="model.reviewer"
          :allow-create="true"
          :searchable="true"
          :load="loadCoordinator"
          :option-props="personOptionProps"
        />
      </template>
      <template #reckonTime>
        <el-radio-group v-model="model.reckonTime">
          <el-radio :label="0">
            不计时
          </el-radio>
          <radioInput
            v-model="model.reckonTime"
            text-before="限制时长"
            text-after="分钟"
            :default-value="60"
            :input-width="60"
            :input-props="{ maxLength: 4 }"
          ></radioInput>
        </el-radio-group>
      </template>

      <template #joinNum>
        <el-radio-group v-model="model.joinNum">
          <div class="flex-flow flex flexcenter">
            <el-radio :label="0">
              不限次数
            </el-radio>
            <radioInput
              v-model="model.joinNum"
              text-before="限制次数 不超过"
              text-after="次"
              :default-value="3"
              :input-width="60"
              :input-props="{ maxLength: 4 }"
            ></radioInput>
          </div>
        </el-radio-group>
      </template>
      <template #joinNum1>
        <el-radio-group v-model="model.joinNum1Boo">
          <div class="flex-flow flex flexcenter">
            <el-radio :label="false">
              不允许
            </el-radio>
            <el-radio :label="true">
              允许补考
              <el-input
                v-model.number="model.joinNum1"
                :disabled="!model.joinNum1Boo"
                style="width: 60px;"
              ></el-input>
              次
            </el-radio>
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
          :default-value="10"
          :input-props="{ maxLength: 4 }"
        ></checkbox-input>
      </template>
    </common-form>
  </div>
</template>

<script>
import radioInput from '@/components/radioInput/radioInput'
import checkboxInput from '@/components/checkboxInput/checkboxInput'
const personOptionProps = {
  label: 'name',
  value: 'userId',
  key: 'userId'
}
const checkMakeUp = (rule, value, callback) => {
  if (value === '') {
    return callback(new Error('补考次数不能为空'))
  } else {
    callback()
  }
}
const EventColumns = [
  {
    prop: 'title1',
    itemType: 'slotout',
    span: 24,
    label: ''
  },
  {
    itemType: 'input',
    span: 11,
    required: true,
    prop: 'examName',
    label: '考试名称'
  },
  {
    itemType: 'select',
    span: 11,
    offset: 2,
    required: true,
    options: [],
    prop: 'examName1',
    label: '考试分类'
  },
  {
    itemType: 'slot',
    span: 11,
    required: true,
    options: [],
    prop: 'testPaper',
    label: '考试用卷'
  },
  { itemType: 'slot', span: 11, offset: 2, required: false, prop: 'reviewer', label: '评卷人' },
  { itemType: 'switch', span: 11, required: false, prop: 'reviewer1', label: '是否发放证书' },
  { itemType: 'input', span: 11, offset: 2, required: true, prop: 'testPaper1', label: '证书模板' },
  {
    prop: 'title2',
    itemType: 'slotout',
    span: 24,
    label: ''
  },
  {
    itemType: 'radio',
    prop: 'answerMode',
    label: '答题模式',
    span: 11,
    options: [
      { label: '整卷模式', value: 1 },
      { label: '逐卷模式', value: 2 }
    ]
  },
  {
    itemType: 'slot',
    prop: 'reckonTime',
    label: '考试时长',
    offset: 2,
    span: 11
  },
  {
    itemType: 'slot',
    prop: 'joinNum',
    label: '参加次数',
    span: 11
  },
  {
    itemType: 'slot',
    prop: 'joinNum1',
    label: '补考次数',
    offset: 2,
    span: 11,
    rules: [{ validator: checkMakeUp, trigger: 'change' }]
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
    span: 11
  },
  {
    itemType: 'slot',
    prop: 'publishTime',
    label: '发布考试',
    offset: 2,
    span: 11
  }
]
import { getOrgUserList } from '@/api/system/user'
export default {
  name: 'BasicSetting',
  components: {
    radioInput,
    checkboxInput,
    LazySelect: () => import('@/components/lazy-select/lazySelect')
  },
  data() {
    return {
      personOptionProps,
      input: '',
      columns: EventColumns,
      model: {
        id: '',
        examTime: '',
        examName: '',
        testPaper: '',
        reviewer: '',
        answerMode: 1,
        reckonTime: 0,
        joinNum: 0,
        joinNum1: 3,
        joinNum1Boo: false,
        integral: 0,
        strategy: 0,
        publishTime: 0
      }
    }
  },
  watch: {
    // 补考次数因为存在0有检验，所以手动添加校验规则
    'model.joinNum1Boo': {
      handler(value) {
        const checkMakeUpZero = (rule, value, callback) => {
          if (value === 0) {
            return callback(new Error('补考次数必须大于0'))
          } else {
            callback()
          }
        }
        const zeroRuler = { validator: checkMakeUpZero, trigger: 'change' }
        const target = _.chain(this.columns)
          .filter((item) => {
            return item.prop === 'joinNum1'
          })
          .get('[0].rules', {})
          .value()
        value ? target.push(zeroRuler) : target.pop()
      },
      deep: true
    }
  },
  created() {},
  methods: {
    loadCoordinator() {
      let params = {
        pageNo: 1,
        pageSize: 10,
        search: '',
        orgId: this.$store.getters.userInfo.org_id || 0
      }
      return getOrgUserList(params)
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
