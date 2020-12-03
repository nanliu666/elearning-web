<template>
  <div class="question-edit">
    <page-header :title="title">
    </page-header>
    <basic-container block>
      <el-row
        type="flex"
        justify="center"
      >
        <el-col
          :xl="16"
          :lg="16"
          :md="18"
          :sm="20"
          :xs="22"
        >
          <common-form
            ref="form"
            :columns="columns"
            :model="form"
          >
            <template #title1="">
              <h2>基础信息</h2>
            </template>
            <template #title2="">
              <h2>试题内容</h2>
            </template>
            <template #score-label="">
              试题分数
              <el-tooltip
                class="item"
                effect="dark"
                content="试题分数设置仅可应用手工试卷，随机试卷需要重新设置分数"
                placement="top-start"
              >
                <i class="el-icon-question" />
              </el-tooltip>
            </template>
            <template #options-label="">
              选项
              <el-tooltip
                v-if="[QUESTION_TYPE_SINGLE, QUESTION_TYPE_MULTIPLE].includes(form.type)"
                class="item"
                effect="dark"
                placement="top-start"
              >
                <div slot="content">
                  1.选中的选项为试题的正确答案；<br />2.最多添加10个选项，每项最多150个字；<br />3.每个选项最多插入一个图片。
                </div>
                <i class="el-icon-question" />
              </el-tooltip>
            </template>
            <template
              v-if="form.type === QUESTION_TYPE_BLANK"
              #content-label=""
            >
              题干（说明：在需要填空的地方，用英文输入法输入三根下划线表示，即“___”。）
            </template>
            <template
              v-if="form.type === QUESTION_TYPE_BLANK"
              #answer-label=""
            >
              标准答案（说明：1.多个答案应该用“|”隔开； 2.如果一个空有多个标准答案请用“&”隔开。）
            </template>
            <template #options="">
              <question-options
                v-if="form.type !== QUESTION_TYPE_JUDGE"
                v-model="form.options"
                :is-check-box="form.type === QUESTION_TYPE_MULTIPLE"
              ></question-options>
              <template v-else>
                <el-radio
                  v-for="item in form.options"
                  :key="item.key"
                  v-model="item.isCorrect"
                  :label="1"
                  @change="(val) => handleRadioCheck(val, item)"
                >
                  {{ item.content }}
                </el-radio>
              </template>
            </template>
          </common-form>
        </el-col>
      </el-row>
      <div class="page-footer">
        <el-button
          type="primary"
          size="medium"
          @click="handleSubmit"
        >
          保存
        </el-button>
        <el-button
          size="medium"
          @click="handleSubmit"
        >
          完成并继续创建
        </el-button>
      </div>
    </basic-container>
  </div>
</template>

<script>
import {
  QUESTION_TYPE_MAP,
  QUESTION_TYPE_MULTIPLE,
  QUESTION_TYPE_SINGLE,
  QUESTION_TYPE_JUDGE,
  QUESTION_TYPE_SHOER,
  QUESTION_TYPE_BLANK
  // QUESTION_TYPE_GROUP
} from '@/const/examMange'
import QuestionOptions from './questionOptions'
import { createUniqueID } from '@/util/util'
import { createQuestion, getQuestion } from '@/api/examManage/question'
const BASIC_COLUMNS = [
  { prop: 'title1', span: 24, itemType: 'slotout' },
  {
    prop: 'type',
    label: '试题类型',
    required: true,
    itemType: 'select',
    options: _.map(QUESTION_TYPE_MAP, (val, key) => ({ label: val, value: key }))
  },
  {
    prop: 'categoryId',
    itemType: 'treeSelect',
    label: '所在分类',
    offset: 4,
    props: {
      selectParams: {
        placeholder: '请选择所在分类',
        multiple: false
      },
      treeParams: {
        data: [],
        'check-strictly': true,
        'default-expand-all': false,
        'expand-on-click-node': false,
        clickParent: true,
        filterable: false,
        props: {
          children: 'children',
          label: 'orgName',
          disabled: 'disabled',
          value: 'orgId'
        }
      }
    }
  },
  {
    prop: 'score',
    label: '试题分数',
    itemType: 'inputNumber',
    min: 0
  },
  {
    prop: 'difficulty',
    label: '试题难度',
    itemType: 'select',
    offset: 4,
    options: [
      { label: '易', value: '1' },
      { label: '中', value: '2' },
      { label: '难', value: '3' }
    ]
  },
  {
    prop: 'timeLimitDate',
    label: '答题限时',
    itemType: 'timePicker'
  },
  {
    prop: 'expiredTime',
    label: '过期时间',
    type: 'datetime',
    valueFormat: 'yyyy-MM-dd HH:mm:ss',
    offset: 4,
    itemType: 'datePicker'
  },
  { span: 24, prop: 'title2', itemType: 'slotout' }
]
/**
 * 选择题配置
 */
const SELECT_COLUMNS = [
  {
    prop: 'content',
    span: 24,
    itemType: 'input',
    type: 'textarea',
    label: '题干',
    required: true,
    resize: 'none',
    rows: 6
  },
  {
    prop: 'options',
    span: 24,
    itemType: 'slot',
    label: '选项',
    required: true,
    rules: [
      {
        validator: (rule, value, callback) => {
          if (_.some(value, { content: '' })) {
            return callback(new Error('选项内容请填写完整'))
          } else if (!_.some(value, { isCorrect: 1 })) {
            return callback(new Error('请设置正确选项'))
          }
          callback()
        },
        trigger: 'change'
      }
    ]
  },
  {
    prop: 'analysis',
    span: 24,
    itemType: 'input',
    type: 'textarea',
    label: '试题分析',
    resize: 'none',
    rows: 6
  }
]
/**
 * 简答题配置
 */
const SHORT_COLUMNS = [
  {
    prop: 'content',
    span: 24,
    itemType: 'richtext',
    label: '题干',
    height: 500,
    required: true
  },
  {
    prop: 'analysis',
    span: 24,
    itemType: 'input',
    type: 'textarea',
    label: '试题分析',
    resize: 'none',
    rows: 6
  }
]
/**
 * 填空题配置
 */
const FILL_COLUMNS = [
  {
    prop: 'content',
    span: 24,
    itemType: 'richtext',
    label: '题干',
    height: 500,
    required: true
  },
  {
    prop: 'answer',
    span: 24,
    itemType: 'input',
    label: '正确答案',
    required: true
  },
  {
    prop: 'analysis',
    span: 24,
    itemType: 'input',
    type: 'textarea',
    label: '试题分析',
    resize: 'none',
    rows: 6
  }
]
export default {
  name: 'QuestionEdit',
  components: {
    QuestionOptions
  },
  data() {
    return {
      form: {
        type: QUESTION_TYPE_SINGLE,
        categoryId: null,
        score: null,
        difficulty: null,
        expiredTime: null,
        content: null,
        analysis: null,
        timeLimitDate: new Date(2020, 1, 1, 0, 0, 0),
        options: [
          { key: createUniqueID(), content: '', isCorrect: 0, url: '' },
          { key: createUniqueID(), content: '', isCorrect: 0, url: '' },
          { key: createUniqueID(), content: '', isCorrect: 0, url: '' }
        ]
      },
      columns: [...BASIC_COLUMNS, ...SELECT_COLUMNS]
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    title() {
      if (this.id) {
        return '编辑试题'
      } else {
        return '创建试题'
      }
    },
    QUESTION_TYPE_MULTIPLE: () => QUESTION_TYPE_MULTIPLE,
    QUESTION_TYPE_SINGLE: () => QUESTION_TYPE_SINGLE,
    QUESTION_TYPE_JUDGE: () => QUESTION_TYPE_JUDGE,
    QUESTION_TYPE_BLANK: () => QUESTION_TYPE_BLANK,
    QUESTION_TYPE_SHOER: () => QUESTION_TYPE_SHOER
  },
  watch: {
    'form.type'(val, oldVal) {
      if ([QUESTION_TYPE_SINGLE, QUESTION_TYPE_MULTIPLE].includes(val)) {
        this.columns = [...BASIC_COLUMNS, ...SELECT_COLUMNS]
      } else if (val === QUESTION_TYPE_JUDGE) {
        this.columns = [...BASIC_COLUMNS, ...SELECT_COLUMNS]
        this.form.options = [
          { key: createUniqueID(), content: '正确', isCorrect: 1, url: '' },
          { key: createUniqueID(), content: '错误', isCorrect: 0, url: '' }
        ]
      } else if (QUESTION_TYPE_SHOER === val) {
        this.columns = [...BASIC_COLUMNS, ...SHORT_COLUMNS]
      } else if (QUESTION_TYPE_BLANK === val) {
        this.columns = [...BASIC_COLUMNS, ...FILL_COLUMNS]
      } else {
        this.columns = [...BASIC_COLUMNS, ...SELECT_COLUMNS]
      }
      // 从多选题切换到单选题时把正确答案置空
      if (oldVal === QUESTION_TYPE_MULTIPLE && val === QUESTION_TYPE_SINGLE) {
        this.form.options.forEach((item) => {
          item.isCorrect = 0
        })
      }
    }
  },
  mounted() {
    if (this.id) {
      this.loadData()
    }
  },
  methods: {
    handleRadioCheck(val, option) {
      this.form.options.forEach((item) => {
        if (item.key !== option.key) {
          item.isCorrect = 0
        }
      })
    },
    handleSubmit() {
      this.$refs.form.validate().then(() => {
        let data = _.pick(this.form, [
          'type',
          'categoryId',
          'score',
          'difficulty',
          'content',
          'analysis',
          'options'
        ])
        data.timeLimit = (this.form.timeLimitDate.getTime() - new Date(2020, 1, 1)) / 1000
        if (this.form.answer && this.form.type === QUESTION_TYPE_BLANK) {
          data.options = [{ content: this.form.answer, isCorrect: 1 }]
        }
        createQuestion(data).then(() => {
          // console.log('成功')
        })
      })
    },
    loadData() {
      getQuestion({ id: this.id }).then((res) => {
        // console.log(res)
        this.form = res
        this.form.timeLimitDate = new Date(
          new Date(2020, 1, 1).getTime() + (res.timeLimit || 0) * 1000
        )
        if (res.type == QUESTION_TYPE_BLANK) {
          this.$set(this.form, 'answer', _.get(_.head(res.options), 'content', ''))
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-container--block {
  height: calc(100% - 92px);
  min-height: calc(100% - 92px);
}
.question-edit {
}
</style>
