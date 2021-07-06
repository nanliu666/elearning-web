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
 * 不定项选择
 */
export const QUESTION_TYPE_RANDOM = 'not_sure_choice'

/**
 * 试题类型字典
 */
export const QUESTION_TYPE_MAP = {
  single_choice: '单选题',
  multi_choice: '多选题',
  // not_sure_choice: '不定项题',
  judgment: '判断题',
  short_answer: '简答题',
  blank: '填空题',
  question_group: '试题组(阅读题)'
}

/**
 * 所有的试题类型字典
 */
export const QUESTION_TYPE_MAP_TOTAL = {
  single_choice: '单选题',
  multi_choice: '多选题',
  not_sure_choice: '不定项题',
  judgment: '判断题',
  short_answer: '简答题',
  blank: '填空题',
  question_group: '试题组(阅读题)'
}
// 所有的试题，包括不定项
export const QUESTION_TATOL_ARR = [
  { value: 'single_choice', label: '单选题' },
  { value: 'multi_choice', label: '多选题' },
  { value: 'not_sure_choice', label: '不定项题' },
  { value: 'judgment', label: '判断题' },
  { value: 'short_answer', label: '简答题' },
  { value: 'blank', label: '填空题' }
  // { value: 'question_group', label: '试题组(阅读题)' } // 此版本先关闭试题组
]
/**
 * 试题状态字典
 */
export const QUESTION_STATUS_MAP = {
  normal: '正常',
  expired: '已过期'
}

/**
 * 试题类型字典
 */
export const QUESTION_PREFACE = {
  0: 'A',
  1: 'B',
  2: 'C',
  3: 'D',
  4: 'E',
  5: 'F',
  6: 'G',
  7: 'H',
  8: 'I',
  9: 'J',
  10: 'K',
  11: 'L',
  12: 'M',
  13: 'N',
  14: 'O',
  15: 'P',
  16: 'Q',
  17: 'R',
  18: 'S',
  19: 'T',
  20: 'U',
  21: 'V',
  22: 'W',
  23: 'X',
  24: 'Y',
  25: 'Z'
}
