/* eslint-disable no-console */

import Mock from 'mockjs'

const normalData = {
  code: 200,
  success: true,
  msg: '操作成功',
  response: ''
}
export default ({ mock }) => {
  if (!mock) return
  Mock.mock(new RegExp('/manage/v1/question/list' + '(\\?.*)?$'), 'get', () => {
    const list = _.times(10, () =>
      Mock.mock({
        questionId: '@integer(100000, 10000000000)',
        // 单选题single_choice，多选题 multi_choice，判断题judgment，简答题short_answer，试题组question_group
        'type|1': ['single_choice', 'multi_choice', 'judgment', 'short_answer', 'question_group'],
        'status|1': ['normal', 'expired'],
        examNum: '@integer(1, 10)',
        content: '@cparagraph(1, 2)'
      })
    )
    return {
      ...normalData,
      response: {
        data: list
      }
    }
  })
  Mock.mock(new RegExp('/manage/v1/question' + '(\\?.*)?$'), 'get', () => {
    const response = Mock.mock({
      // 单选题single_choice，多选题 multi_choice，判断题judgment，简答题short_answer，试题组question_group
      'type|1': ['single_choice', 'multi_choice', 'judgment', 'short_answer', 'question_group'],
      'status|1': ['normal', 'expired'],
      examNum: '@integer(1, 10)',
      content: '@cparagraph(1, 2)'
    })
    return response
  })
  Mock.mock(new RegExp('/manage/v1/question' + '(\\?.*)?$'), 'post', () => {
    return normalData
  })
}
