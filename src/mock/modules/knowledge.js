/**
 * @file 数据看板 mock数据
 */

import Mock from 'mockjs'

const RESPONSE_COMMON = {
  resCode: 200,
  resMsg: 'success(mock)'
}

export default ({ mock }) => {
  if (!mock) {
    return
  }
  Mock.mock(new RegExp('/manage/v1/knowledge/catalog/list' + '(\\?.*)?$'), 'get', (req) => {
    const children = _.times(10, (item, index) =>
      Mock.mock({
        id: '@integer(100000, 10000000000)',
        parentId: '@integer(100000, 10000000000)',
        name: '@ctitle(1, 10)',
        createName: '@cname',
        'status|1': [0, 1],
        sort: index,
        updateTime: '@date',
        children: []
      })
    )
    const response = _.times(1, (item, index) =>
      Mock.mock({
        id: '@integer(100000, 10000000000)',
        parentId: '@integer(100000, 10000000000)',
        name: '@ctitle(1, 10)',
        createName: '@cname',
        'status|1': [0, 1],
        sort: index,
        updateTime: '@date',
        children: children
      })
    )
    window.console.debug(`${req.type} ${req.url}`, { req, response })
    return _.defaults({ response }, RESPONSE_COMMON)
  })
  Mock.mock(new RegExp('/manage/v1/knowledge/catalog/creatUsers' + '(\\?.*)?$'), 'get', (req) => {
    const response = _.times(10, () =>
      Mock.mock({
        userId: '@integer(100000, 10000000000)',
        name: '@cname'
      })
    )
    window.console.debug(`${req.type} ${req.url}`, { req, response })
    return _.defaults({ response }, RESPONSE_COMMON)
  })
  Mock.mock(new RegExp('/manage/v1/knowledge/catalog/delete' + '(\\?.*)?$'), 'post', (req) => {
    return _.defaults({ req }, RESPONSE_COMMON)
  })
  Mock.mock(
    new RegExp('/manage/v1/knowledge/catalog/updateStatus' + '(\\?.*)?$'),
    'post',
    (req) => {
      return _.defaults({ req }, RESPONSE_COMMON)
    }
  )
  Mock.mock(new RegExp('/manage/v1/knowledge/catalog/add' + '(\\?.*)?$'), 'post', (req) => {
    return _.defaults({ req }, RESPONSE_COMMON)
  })
  Mock.mock(new RegExp('/manage/v1/knowledge/catalog/sortSave' + '(\\?.*)?$'), 'post', (req) => {
    return _.defaults({ req }, RESPONSE_COMMON)
  })
}
