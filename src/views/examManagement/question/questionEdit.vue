<template>
  <div class="question-edit fill">
    <page-header
      :title="title"
      show-back
    />
    <basic-container
      v-loading="loading"
      block
    >
      <div class="main__container">
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
            v-else
            #content-label=""
          >
            题干
            <el-tooltip
              class="item"
              effect="dark"
              placement="top-start"
            >
              <div slot="content">
                支持上传png、jpg、jpeg格式文件，单个文件大小＜5MB，最多5个文件
              </div>
              <i class="el-icon-question" />
            </el-tooltip>
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
                <!-- 当前只能维护一卡片个被编辑的状态，未保存不能进行下一个新增 -->
                <!-- 开新的一个未保存会丢失，编辑之前的未保存会恢复到未编辑之前的数据 -->
                <!-- 试题组的保存的时候必须存在至少一个子试题 -->
                <question-item
                  ref="subQuestion"
                  :key="question.key"
                  :value="question"
                  :parent="form.subQuestions"
                  :index="index"
                  @delete="handleDeleteSubQuestion($event)"
                  @move="handleMoveSubQuestions"
                />
              </template>
              <div
                v-if="form.subQuestions.length < 20"
                class="sub-questions__add"
                @click="handleAddSub"
              >
                <i class="iconimage_icon_plus-outlined iconfont" />添加子试题（最多20项）
              </div>
            </div>
          </template>
        </common-form>
        <div class="page-footer">
          <el-button
            v-loading="submiting"
            type="primary"
            size="medium"
            @click="handleSubmit()"
          >
            保存
          </el-button>
          <el-button
            v-if="!id"
            v-loading="submitingAndContinue"
            size="medium"
            style="margin-left:16px;"
            @click="handleSubmit(true)"
          >
            完成并继续创建
          </el-button>
        </div>
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
  QUESTION_TYPE_BLANK,
  QUESTION_TYPE_GROUP
} from '@/const/examMange'
import QuestionOptions from './questionOptions'
import ImageUploader from './imageUploader'
import QuestionItem from './questionItem'
import { createUniqueID } from '@/util/util'
import {
  SELECT_COLUMNS,
  SHORT_COLUMNS,
  FILL_COLUMNS,
  GROUP_COLUMNS,
  MULTIPLE_SELECT_COLUMNS
} from './config'
import {
  createQuestion,
  getQuestion,
  modifyQuestion,
  getQuestionCategory
} from '@/api/examManage/question'
import { relatedKnowledgeList } from '@/api/knowledge/knowledge'
import moment from 'moment'

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
          label: 'name',
          disabled: 'disabled',
          value: 'id'
        }
      }
    },
    required: true
  },
  {
    prop: 'score',
    label: '试题分数',
    itemType: 'inputNumber',
    min: 0,
    max: 9999999,
    precision: 1,
    step: 0.1
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
  {
    label: '知识体系',
    itemType: 'treeSelect',
    prop: 'knowledgeSystemId',
    required: false,
    props: {
      selectParams: {
        placeholder: '请选择知识体系',
        multiple: false
      },
      treeParams: {
        'check-strictly': true,
        'default-expand-all': false,
        'expand-on-click-node': false,
        clickParent: true,
        data: [],
        filterable: true,
        props: {
          children: 'children',
          label: 'name',
          value: 'id'
        }
      }
    }
  },
  { span: 24, prop: 'title2', itemType: 'slotout' }
]
const BASIC_COLUMNS_GROUP = [
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
          label: 'name',
          disabled: 'disabled',
          value: 'id'
        }
      }
    }
  },
  {
    prop: 'score',
    label: '试题分数',
    itemType: 'inputNumber',
    disabled: true,
    desc: '分数根据子试题的分数自动计算总分',
    min: 0
  },
  {
    prop: 'difficulty',
    label: '试题难度',
    itemType: 'select',
    offset: 4,
    desc: '  ',
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
const createSubQustion = () => ({
  type: QUESTION_TYPE_SINGLE,
  content: '',
  score: 0,
  editType: 'add',
  options: createOptions(),
  attachments: [],
  key: createUniqueID()
})
export default {
  name: 'QuestionEdit',
  provide() {
    return {
      questionEditRef: this // 注入当前父实例
    }
  },
  components: {
    QuestionOptions,
    ImageUploader,
    QuestionItem
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
    from.meta.$keepAlive = false // 禁用页面缓存
    next()
  },
  data() {
    return {
      initStartTime: moment().startOf('year'),
      timeLimit: 0, // 答题限时单位秒
      activeQuestion: -1,
      cloneDeepOptions: {},
      form: {
        type: QUESTION_TYPE_SINGLE,
        categoryId: null,
        score: 0,
        difficulty: null,
        expiredTime: null,
        knowledgeSystemId: null,
        content: null,
        analysis: null,
        answer: null,
        attachments: [],
        timeLimitDate: moment()
          .startOf('year')
          .format('YYYY-MM-DD HH:mm:ss'),
        options: createOptions(),
        subQuestions: [createSubQustion()]
      },
      columns: [...BASIC_COLUMNS, ...SELECT_COLUMNS],
      scoreWatcher: null,
      submiting: false,
      submitingAndContinue: false,
      loading: false,
      categoryData: []
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
    /**
     * 根据试题类型切换表单内容
     */
    'form.type': {
      handler(val) {
        this.$nextTick(() => {
          this.$refs.form.clearValidate()
        })
        if (val === QUESTION_TYPE_SINGLE) {
          this.columns = [...BASIC_COLUMNS, ...SELECT_COLUMNS]
          this.getFormOptions(createOptions())
        } else if (val === QUESTION_TYPE_JUDGE) {
          this.columns = [...BASIC_COLUMNS, ...SELECT_COLUMNS]
          const initJudgeOptions = [
            { key: createUniqueID(), content: '正确', isCorrect: 1, url: '' },
            { key: createUniqueID(), content: '错误', isCorrect: 0, url: '' }
          ]
          this.getFormOptions(initJudgeOptions)
        } else if (QUESTION_TYPE_MULTIPLE === val) {
          const _SELECT_COLUMNS = _.cloneDeep(MULTIPLE_SELECT_COLUMNS)
          this.columns = [...BASIC_COLUMNS, ..._SELECT_COLUMNS]
          this.getFormOptions(createOptions())
        } else if (QUESTION_TYPE_SHOER === val) {
          this.columns = [...BASIC_COLUMNS, ...SHORT_COLUMNS]
        } else if (QUESTION_TYPE_BLANK === val) {
          this.columns = [...BASIC_COLUMNS, ...FILL_COLUMNS]
        } else if (QUESTION_TYPE_GROUP === val) {
          // 编辑一进来默认不打开所有卡片保持-1
          // 之前有激活卡片，在切换的时候回到激活状态
          if (!this.id) {
            this.activeQuestion = this.activeQuestion === -1 ? 0 : this.activeQuestion
          }
          this.columns = [...BASIC_COLUMNS_GROUP, ...GROUP_COLUMNS]
        }
        /**
         * 试题组自动计算总分数
         */
        if (QUESTION_TYPE_GROUP === val) {
          if (!this.scoreWatcher) {
            this.scoreWatcher = this.$watch(
              'form.subQuestions',
              () => {
                this.form.score = this.form.subQuestions.reduce((acc, item) => acc + item.score, 0)
              },
              { deep: true, immediate: true }
            )
          } else {
            this.form.score = this.form.subQuestions.reduce((acc, item) => acc + item.score, 0)
          }
          if (_.size(this.form.subQuestions) === 0) {
            this.form.subQuestions.push(createSubQustion())
          }
        }
      },
      deep: true
    },
    'form.timeLimitDate': {
      handler(val) {
        // 时间格式转换成多少秒
        if (val) {
          this.timeLimit = moment(val).diff(moment(_.cloneDeep(this.initStartTime)), 'seconds')
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    if (this.id) {
      this.loadData()
    }
    this.loadCategoryData()
    this.initRelatedKnowledgeList()
  },
  beforeDestroy() {
    this.scoreWatcher && this.scoreWatcher()
  },
  methods: {
    // 维护每一个题型的项
    setCloneOptions() {
      // 每一种题型有维护自己的单独选项
      _.set(this.cloneDeepOptions, this.form.type, this.form.options)
    },
    getFormOptions(initData) {
      // 题型初建，新增一个，题型切换时，恢复到之前的选项
      const selfOptions = _.get(this.cloneDeepOptions, this.form.type)
      this.form.options = !_.isEmpty(selfOptions) ? selfOptions : initData
      this.setCloneOptions()
    },
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
     * 恢复数据的方法
     * 入参backIndex，哪个卡片需要恢复数据
     */
    backDataItem(backIndex) {
      // 如果是编辑的数据，需要恢复到之前的数据
      const REF_TEMP = this.$refs.subQuestion
      const cloneTmep = _.cloneDeep(_.get(REF_TEMP, `[${backIndex}].cloneDeepValue`))
      this.form.subQuestions[backIndex] = cloneTmep
      this.$forceUpdate()
    },
    /**
     * 新增一条试题卡片
     */
    pushOneItem() {
      this.form.subQuestions.push(createSubQustion())
      this.activeQuestion = _.size(this.form.subQuestions) - 1
    },
    /**
     * 添加子试题
     */
    handleAddSub() {
      if (_.size(this.form.subQuestions) >= 20) {
        this.$message.error('最多只能添加20项子试题')
        return
      }
      // 没有子试题或者是之前所有的子试题都是已保存的状态，直接加一个子试题
      if (_.isEmpty(this.form.subQuestions) || this.activeQuestion === -1) {
        this.pushOneItem()
      } else {
        this.$confirm('离开修改内容将不会保存！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 如果是直接新的数据，在未保存的时候需要丢弃次卡片
          if (this.$refs.subQuestion[this.activeQuestion].value.editType === 'add') {
            this.form.subQuestions.splice(this.activeQuestion, 1)
          } else {
            // 不是新数据需要恢复数据
            this.backDataItem(this.activeQuestion)
          }
          // 并且新增一条
          this.pushOneItem()
        })
      }
    },
    handleRadioCheck(val, option) {
      this.form.options.forEach((item) => {
        if (item.key !== option.key) {
          item.isCorrect = 0
        }
      })
    },
    handleSubmit(isContinue) {
      this.$refs.form.validate().then(() => {
        if (this.form.type === QUESTION_TYPE_GROUP && this.activeQuestion !== -1) {
          this.$message.error('有子试题没有保存，请先保存')
          return
        }
        let data = _.pick(this.form, [
          'type',
          'categoryId',
          'score',
          'difficulty',
          'analysis',
          'options',
          'expiredTime',
          'attachments',
          'knowledgeSystemId'
        ])
        if (data.score) {
          data.score = parseInt(data.score)
        }
        data.content = _.escape(this.form.content)
        data.timeLimit = this.timeLimit
        if (this.form.answer && this.form.type === QUESTION_TYPE_BLANK) {
          data.options = [{ content: this.form.answer, isCorrect: 1 }]
        } else {
          data.options.forEach((item, index) => {
            item.sort = index
          })
        }

        if (data.type === QUESTION_TYPE_GROUP) {
          data.subQuestions = this.form.subQuestions
          _.forEach(data.subQuestions, (question, index) => {
            if (question.answer && question.type === QUESTION_TYPE_BLANK) {
              question.options = [{ content: question.answer, isCorrect: 1 }]
            } else {
              question.options.forEach((item, index) => {
                item.sort = index
              })
            }
            question.content = _.escape(question.content)
            question.sort = index
          })
        }
        data.id = this.id
        if (!isContinue) {
          this.submiting = true
        } else {
          this.submitingAndContinue = true
        }
        let func = createQuestion
        if (this.id) {
          func = modifyQuestion
        }
        func(data)
          .then(() => {
            this.$message.success(`试题${this.id ? '修改' : '创建'}成功`)
            this.resetFormData()
            if (!isContinue) {
              this.goBack()
            }
          })
          .finally(() => {
            this.submiting = false
            this.submitingAndContinue = false
          })
      })
    },
    goBack() {
      this.$router.go(-1)
      this.$store.commit('DEL_TAG', this.$store.state.tags.tag)
    },
    resetFormData() {
      this.$refs.form.resetFields()
      this.form.options = createOptions()
      this.form.attachments = []
      this.form.content = ''
      this.form.subQuestions = [createSubQustion()]
    },
    setFileList(options) {
      _.each(options, (option) => {
        option.key = createUniqueID()
        if (option.url) {
          option.fileList = [{ url: option.url }]
        } else {
          option.fileList = []
        }
      })
    },
    loadData() {
      this.loading = true
      getQuestion({ id: this.id })
        .then((res) => {
          this.form = res
          const { timeLimit } = res
          const editTime = _.cloneDeep(this.initStartTime)
            .add(timeLimit, 's')
            .format('YYYY-MM-DD HH:mm:ss')
          this.$set(this.form, 'timeLimitDate', editTime)
          this.form.score = res.score
          this.form.content = _.unescape(res.content)
          this.setFileList(this.form.options)
          if (res.type == QUESTION_TYPE_BLANK) {
            this.$set(this.form, 'answer', _.get(_.head(res.options), 'content', ''))
          }
          _.forEach(this.form.subQuestions, (question) => {
            if (question.type == QUESTION_TYPE_BLANK) {
              this.$set(question, 'answer', _.get(_.head(question.options), 'content', ''))
            }
            question.content = _.unescape(question.content)
          })
          if (!_.isEmpty(this.form.subQuestions)) {
            this.form.subQuestions = _.sortBy(this.form.subQuestions, 'sort')
            _.each(this.form.subQuestions, (sub) => {
              this.setFileList(sub.options)
            })
          }

          this.setCloneOptions()
        })
        .finally(() => {
          this.loading = false
        })
    },
    loadCategoryData() {
      getQuestionCategory({ parentId: '0', type: 0 }).then((res) => {
        this.categoryData = res
        _.forEach(BASIC_COLUMNS, (column) => {
          if (column.prop === 'categoryId') {
            column.props.treeParams.data = res
          }
        })
        _.forEach(BASIC_COLUMNS_GROUP, (column) => {
          if (column.prop === 'categoryId') {
            column.props.treeParams.data = res
          }
        })
      })
    },
    // 初始化知识体系列表
    initRelatedKnowledgeList() {
      let knowledgeSystemId = _.find(BASIC_COLUMNS, { prop: 'knowledgeSystemId' })
      //   各资源下的知识体系下拉框列表
      relatedKnowledgeList({ name: '' }).then(
        (res) => (knowledgeSystemId.props.treeParams.data = res)
      )
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
  .main__container {
    padding: 0px 60px;
  }
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
