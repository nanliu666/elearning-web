/**
 * 选择题配置
 */
export const SELECT_COLUMNS = [
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
  { prop: 'attachments', span: 24, itemType: 'slotout' },
  {
    prop: 'options',
    span: 24,
    itemType: 'slot',
    label: '选项',
    required: true,
    rules: [
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
export const SHORT_COLUMNS = [
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
export const FILL_COLUMNS = [
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
/**
 * 试题组配置
 */
export const GROUP_COLUMNS = [
  {
    prop: 'content',
    span: 24,
    itemType: 'richtext',
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
