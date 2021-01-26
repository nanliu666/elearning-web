/**
 * 单选题
 */
export const QUESTION_TYPE_SINGLE = 'single_choice'

/**
 * 多选题
 */
export const QUESTION_TYPE_MULTIPLE = 'multi_choice'

/**
 * 判断题
 */
export const QUESTION_TYPE_JUDGE = 'judgment'

/**
 * 简答题
 */
export const QUESTION_TYPE_SHOER = 'short_answer'

/**
 * 填空题
 */
export const QUESTION_TYPE_BLANK = 'blank'

/**
 * 试题组
 */
export const QUESTION_TYPE_GROUP = 'question_group'

/**
 * 试题类型字典
 */
export const QUESTION_TYPE_MAP = {
  single_choice: '单选题',
  multi_choice: '多选题',
  judgment: '判断题',
  short_answer: '简答题',
  blank: '填空题',
  question_group: '试题组(阅读题)'
}

/**
 * 试题状态字典
 */
export const QUESTION_STATUS_MAP = {
  normal: '正常',
  expired: '已过期'
}
