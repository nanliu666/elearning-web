<template>
  <div class="question-item">
    <div class="question-item__header">
      <common-form
        v-if="value.editing"
        ref="formHeader"
        :columns="headerColumns"
        :model="value"
        :config="{ inline: true, labelPosition: 'left', labelWidth: '70px' }"
      ></common-form>
      <span v-else>
        <span>试题类型：{{ QUESTION_TYPE_MAP[value.type] }}</span>
        <span style="margin-left:12px;">试题分数：{{ value.score }}分</span>
      </span>
      <span class="question-item__handler">
        <el-button
          v-if="value.editing"
          type="text"
          @click="handleSubmit"
        >
          保存
        </el-button>
        <el-button
          v-if="!value.editing"
          type="text"
          @click="handleEdit"
        >
          修改
        </el-button>
        <el-button
          type="text"
          @click="handleDelete"
        >
          删除
        </el-button>
        <el-button
          type="text"
          :disabled="index == 0"
          @click="handleMoveUp"
        >
          上移
        </el-button>
        <el-button
          type="text"
          :disabled="index == parent.length - 1"
          @click="handleMoveDown"
        >
          下移
        </el-button>
      </span>
    </div>
    <div class="question-item__content">
      <common-form
        v-if="value.editing"
        ref="formContent"
        :columns="contentColumns"
        :model="value"
      >
        <template #options-label="">
          选项
          <el-tooltip
            v-if="[QUESTION_TYPE_SINGLE, QUESTION_TYPE_MULTIPLE].includes(value.type)"
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
          v-if="value.type === QUESTION_TYPE_BLANK"
          #content-label=""
        >
          题干
          <span
            class="tips"
          >（说明：在需要填空的地方，用英文输入法输入三根下划线表示，即“___”。）</span>
        </template>
        <template
          v-if="value.type === QUESTION_TYPE_BLANK"
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
            v-model="value.attachments"
          />
        </template>
        <template #options="">
          <question-options
            v-if="value.type !== QUESTION_TYPE_JUDGE"
            v-model="value.options"
            :is-check-box="value.type === QUESTION_TYPE_MULTIPLE"
          ></question-options>
          <template v-else>
            <el-radio
              v-for="item in value.options"
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
      <question-preview
        v-else
        :data="value"
      ></question-preview>
    </div>
  </div>
</template>

<script>
import QuestionOptions from './questionOptions'
import ImageUploader from './imageUploader'
import QuestionPreview from './questionPreview'
import {
  QUESTION_TYPE_MAP,
  QUESTION_TYPE_MULTIPLE,
  QUESTION_TYPE_SINGLE,
  QUESTION_TYPE_JUDGE,
  QUESTION_TYPE_SHOER,
  QUESTION_TYPE_BLANK
  // QUESTION_TYPE_GROUP
} from '@/const/examMange'
import { SELECT_COLUMNS, SHORT_COLUMNS, FILL_COLUMNS } from './config'
import { createUniqueID } from '@/util/util'
export default {
  name: 'QuestionItem',
  components: {
    QuestionOptions,
    ImageUploader,
    QuestionPreview
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    index: { type: Number, default: null },
    // 子试题列表数据
    parent: { type: Array, default: () => [] }
  },
  data() {
    return {
      headerColumns: [
        {
          prop: 'type',
          label: '试题类型',
          span: 11,
          itemType: 'select',
          labelWidth: '70px',
          options: _.map(
            _.pick(QUESTION_TYPE_MAP, [
              'single_choice',
              'multi_choice',
              'judgment',
              'short_answer',
              'blank'
            ]),
            (val, key) => ({ label: val, value: key })
          )
        },
        {
          prop: 'score',
          label: '试题分数',
          itemType: 'inputNumber',
          span: 11,
          labelWidth: '70px',
          offset: 2,
          min: 0,
          required: true,
          rules: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (value <= 0) {
                  return callback(new Error('试题分数必须大于零'))
                }
                callback()
              },
              trigger: 'input'
            }
          ]
        }
      ],
      contentColumns: SELECT_COLUMNS
    }
  },
  computed: {
    QUESTION_TYPE_MULTIPLE: () => QUESTION_TYPE_MULTIPLE,
    QUESTION_TYPE_SINGLE: () => QUESTION_TYPE_SINGLE,
    QUESTION_TYPE_JUDGE: () => QUESTION_TYPE_JUDGE,
    QUESTION_TYPE_BLANK: () => QUESTION_TYPE_BLANK,
    QUESTION_TYPE_SHOER: () => QUESTION_TYPE_SHOER,
    QUESTION_TYPE_MAP: () => QUESTION_TYPE_MAP
  },
  watch: {
    'value.type'(val, oldVal) {
      if (val === QUESTION_TYPE_SINGLE) {
        this.contentColumns = SELECT_COLUMNS
      } else if (QUESTION_TYPE_MULTIPLE === val) {
        const _SELECT_COLUMNS = _.cloneDeep(SELECT_COLUMNS)
        _SELECT_COLUMNS[2].rules = [
          {
            validator: (rule, value, callback) => {
              if (_.some(value, (item) => !item.content && !item.url)) {
                return callback(new Error('选项内容请填写完整'))
              } else if (!_.some(value, { isCorrect: 1 })) {
                return callback(new Error('请设置正确选项'))
              } else if (_.filter(value, { isCorrect: 1 }).length < 2) {
                return callback(new Error('多选题请最少选择两个正确答案'))
              }
              callback()
            },
            trigger: 'change'
          }
        ]
        this.contentColumns = _SELECT_COLUMNS
      } else if (val === QUESTION_TYPE_JUDGE) {
        this.contentColumns = SELECT_COLUMNS
        this.value.options = [
          { key: createUniqueID(), content: '正确', isCorrect: 1, url: '' },
          { key: createUniqueID(), content: '错误', isCorrect: 0, url: '' }
        ]
      } else if (QUESTION_TYPE_SHOER === val) {
        this.contentColumns = SHORT_COLUMNS
      } else if (QUESTION_TYPE_BLANK === val) {
        this.contentColumns = FILL_COLUMNS
      } else {
        SELECT_COLUMNS[2].rules = [
          {
            validator: (rule, value, callback) => {
              if (_.some(value, (item) => !item.content && !item.url)) {
                return callback(new Error('选项内容请填写完整'))
              } else if (!_.some(value, { isCorrect: 1 })) {
                return callback(new Error('请设置正确选项'))
              }
              callback()
            },
            trigger: 'change'
          }
        ]
        this.contentColumns = SELECT_COLUMNS
      }
      // 从多选题切换到单选题时把正确答案置空
      if (oldVal === QUESTION_TYPE_MULTIPLE && val === QUESTION_TYPE_SINGLE) {
        _.forEach(this.value.options, (item) => {
          item.isCorrect = 0
        })
      }
    }
  },
  methods: {
    handleRadioCheck(val, option) {
      this.value.options.forEach((item) => {
        if (item.key !== option.key) {
          item.isCorrect = 0
        }
      })
    },
    handleDelete() {
      this.$confirm('您确认要删除该试题吗？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$emit('delete', this.index)
        })
        .catch()
    },
    handleEdit() {
      this.$set(this.value, 'editing', true)
    },
    handleSubmit() {
      Promise.all([this.$refs.formHeader.validate(), this.$refs.formContent.validate()])
        .then(() => {
          this.$set(this.value, 'editing', false)
        })
        .catch()
    },
    handleMoveUp() {
      this.$emit('move', this.index, -1)
    },
    handleMoveDown() {
      this.$emit('move', this.index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.question-item {
  & + .question-item {
    margin-top: 20px;
  }
  background: #fafafa;
  padding: 24px;
  &__header {
    padding-bottom: 12px;
    position: relative;
    line-height: 36px;
    &::after {
      content: '';
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background: #ebeced;
      position: absolute;
    }
    form {
      width: 60%;
      min-width: 400px;
      display: inline-block;
    }
    /deep/ .el-form-item {
      width: 100%;
      margin: 0;
    }
    /deep/ .el-form-item__label {
      padding: 0;
      line-height: 36px;
    }
    /deep/ .el-form-item__content {
      width: calc(100% - 70px);
    }
    /deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
      margin-right: 0;
    }
    /deep/ .el-col {
      margin-bottom: 0;
    }
    button {
      padding: 0;
    }
  }
  &__handler {
    float: right;
    line-height: 36px;
  }
  &__content {
    padding-top: 16px;
  }
}
</style>
