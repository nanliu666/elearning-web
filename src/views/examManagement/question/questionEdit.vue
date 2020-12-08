<template>
  <div class="question-edit fill">
    <page-header
      :title="title"
      show-back
    />
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
              <h3 class="title">
                基础信息
              </h3>
            </template>
            <template #title2="">
              <h3 class="title">
                试题内容
              </h3>
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
              题干
              <span
                class="tips"
              >（说明：在需要填空的地方，用英文输入法输入三根下划线表示，即“___”。）</span>
            </template>
            <template
              v-if="form.type === QUESTION_TYPE_BLANK"
              #answer-label=""
            >
              标准答案
              <span
                class="tips"
              >（说明：1.多个答案应该用“|”隔开； 2.如果一个空有多个标准答案请用“&”隔开。）</span>
            </template>
            <template slot="attachments">
              <image-uploader
                ref="uploader"
                v-model="form.attachments"
              />
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
            <template #subQuestions="">
              <div class="sub-questions">
                <template v-for="(question, index) in form.subQuestions">
                  <question-item
                    :key="question.key"
                    :value="question"
                    :parent="form.subQuestions"
                    :index="index"
                    @move="handleMoveSubQuestions"
                  />
                </template>
                <div
                  class="sub-questions__add"
                  @click="handleAddSub"
                >
                  <i class="iconimage_icon_plus-outlined iconfont"> </i>添加子试题（最多20项）
                </div>
              </div>
            </template>
          </common-form>
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
              style="margin-left:16px;"
              @click="handleSubmit"
            >
              完成并继续创建
            </el-button>
          </div>
        </el-col>
      </el-row>
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
  QUESTION_TYPE_BLANK,
  QUESTION_TYPE_GROUP
} from '@/const/examMange'
import QuestionOptions from './questionOptions'
import ImageUploader from './imageUploader'
import QuestionItem from './questionItem'
import { createUniqueID } from '@/util/util'
import { SELECT_COLUMNS, SHORT_COLUMNS, FILL_COLUMNS, GROUP_COLUMNS } from './config'
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
const createOptions = () => [
  { key: createUniqueID(), content: '', isCorrect: 0, url: '', fileList: [] },
  { key: createUniqueID(), content: '', isCorrect: 0, url: '', fileList: [] },
  { key: createUniqueID(), content: '', isCorrect: 0, url: '', fileList: [] }
]
export default {
  name: 'QuestionEdit',
  components: {
    QuestionOptions,
    ImageUploader,
    QuestionItem
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
        attachments: [],
        timeLimitDate: new Date(2020, 1, 1, 0, 0, 0),
        options: createOptions(),
        subQuestions: [
          {
            type: QUESTION_TYPE_SINGLE,
            content: '',
            score: 0,
            options: createOptions(),
            attachments: [],
            key: createUniqueID()
          }
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
      } else if (QUESTION_TYPE_GROUP === val) {
        this.columns = [...BASIC_COLUMNS, ...GROUP_COLUMNS]
      }
      // 从多选题切换到单选题时把正确答案置空
      if (oldVal === QUESTION_TYPE_MULTIPLE && val === QUESTION_TYPE_SINGLE) {
        _.forEach(this.form.options, (item) => {
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
    handleDeleteSubQuestion(index) {
      this.form.subQuestions.splice(index, 1)
    },
    handleMoveSubQuestions(index, flag) {
      const subQuestions = this.form.subQuestions
      if (subQuestions[index + flag]) {
        let temp = subQuestions[index]
        this.$set(subQuestions, index, subQuestions[index + flag])
        this.$set(subQuestions, index + flag, temp)
      }
    },
    /**
     * 添加子试题
     */
    handleAddSub() {
      if (this.form.subQuestions.length >= 20) {
        this.$message.error('最多只能添加20项子试题')
        return
      }
      this.form.subQuestions.push({
        type: QUESTION_TYPE_SINGLE,
        content: '',
        score: 0,
        options: createOptions(),
        attachments: [],
        key: createUniqueID()
      })
    },
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
  height: initial;
  min-height: calc(100% - 92px);
}
.question-edit {
  .title {
    font-size: 18px;
  }
  .tips {
    font-size: 12px;
    color: rgba(0, 11, 21, 0.25);
  }
  .page-footer {
    text-align: center;
  }
  .sub-questions {
    margin-bottom: 12px;
    &__add {
      margin-top: 16px;
      width: 100%;
      background: #ffffff;
      border: 1px dashed #d9dbdc;
      border-radius: 4px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      i {
        font-size: 16px;
        margin-right: 8px;
      }
      &:hover {
        background-color: rgba($primaryColor, 0.1);
        color: $primaryColor;
      }
    }
  }
}
</style>
