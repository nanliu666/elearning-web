//export const QUESTION_IMPORT_URL = '"https://oa-file-dev.bestgrand.com.cn/题库导入模板.xls"'
import { deleteHTMLTag } from '@/util/util'
export const QUESTION_IMPORT_URL = {
  xugong:"https://xlms-file.xcmg.com:11443/eln/default/20210706/14/55/0/77d0b8bbc8c98fe9d8aba4222a6d59b5.xls",
  zehui:'https://file-test.zexueyuan.com.cn/fe942c7cee4a4f5baff6a7f94182be6d.xls',
  dev:'https://oa-file-dev.bestgrand.com.cn/386b097398e949e4a045218fcf8ac5d8.xls'
}

const _RICH_TETX_CONFIG = [
  {
    validator: (rule, value, callback) => {
      if (_.size(deleteHTMLTag(value)) > 500) {
        return callback(new Error('题干内容超过500个中文字'))
      } else {
        callback()
      }
    },
    trigger: 'change'
  }
]
/**
 * 选择题配置
 */
export const SELECT_COLUMNS = [
  {
    prop: 'content',
    span: 24,
    itemType: 'richtext',
    label: '题干',
    rules: _RICH_TETX_CONFIG,
    height: 500,
    required: true
  },
  // { prop: 'attachments', span: 24, itemType: 'slotout' },
  {
    prop: 'options',
    span: 24,
    itemType: 'slot',
    label: '选项',
    required: true,
    rules: [
      {
        validator: (rule, value, callback) => {
          // 每一项都存在至少一个图片或者内容
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
  },
  {
    required: false,
    prop: 'analysis',
    span: 24,
    itemType: 'input',
    type: 'textarea',
    label: '试题分析',
    maxlength: 1000,
    showWordLimit: true,
    resize: 'none',
    rows: 6
  }
]
/**
 * 多选题配置
 */
export const MULTIPLE_SELECT_COLUMNS = [
  {
    prop: 'content',
    span: 24,
    itemType: 'richtext',
    label: '题干',
    rules: _RICH_TETX_CONFIG,
    height: 500,
    required: true
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
          // 每一项都存在至少一个图片或者内容
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
  },
  {
    required: false,
    prop: 'analysis',
    span: 24,
    itemType: 'input',
    type: 'textarea',
    label: '试题分析',
    maxlength: 1000,
    showWordLimit: true,
    resize: 'none',
    rows: 6
  }
]
/**
 * 简答题配置
 */
export const SHORT_COLUMNS = [
  {
    prop: 'content',
    span: 24,
    itemType: 'richtext',
    rules: _RICH_TETX_CONFIG,
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
    maxlength: 1000,
    showWordLimit: true,
    resize: 'none',
    rows: 6
  }
]
/**
 * 填空题配置
 */
export const FILL_COLUMNS = [
  {
    prop: 'content',
    span: 24,
    itemType: 'richtext',
    rules: _RICH_TETX_CONFIG,
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
    maxlength: 1000,
    showWordLimit: true,
    resize: 'none',
    rows: 6
  }
]
/**
 * 试题组配置
 */
export const GROUP_COLUMNS = [
  {
    prop: 'content',
    span: 24,
    itemType: 'richtext',
    rules: _RICH_TETX_CONFIG,
    label: '题干',
    height: 500,
    required: true
  },
  {
    prop: 'subQuestions',
    itemType: 'slotout',
    span: 24
  }
]
