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
  //---------------------------------------------------------------知识管理----------------------------------------//
  Mock.mock(new RegExp('/manage/v1/knowledge/update' + '(\\?.*)?$'), 'post', (req) => {
    return _.defaults({ req }, RESPONSE_COMMON)
  })
  Mock.mock(new RegExp('/manage/v1/knowledge/add' + '(\\?.*)?$'), 'post', (req) => {
    return _.defaults({ req }, RESPONSE_COMMON)
  })
  Mock.mock(new RegExp('/manage/v1/knowledge/list/move' + '(\\?.*)?$'), 'post', (req) => {
    return _.defaults({ req }, RESPONSE_COMMON)
  })
  Mock.mock(new RegExp('/manage/v1/knowledge/list/delete' + '(\\?.*)?$'), 'post', (req) => {
    return _.defaults({ req }, RESPONSE_COMMON)
  })
  Mock.mock(new RegExp('/manage/v1/knowledge/list/updateStatus' + '(\\?.*)?$'), 'post', (req) => {
    return _.defaults({ req }, RESPONSE_COMMON)
  })
  Mock.mock(new RegExp('/manage/v1/knowledge/list/toping' + '(\\?.*)?$'), 'post', (req) => {
    return _.defaults({ req }, RESPONSE_COMMON)
  })
  Mock.mock(new RegExp('/manage/v1/knowledge/manage/taglist' + '(\\?.*)?$'), 'get', (req) => {
    const response = _.times(4, () =>
      Mock.mock({
        id: '@integer(100000, 10000000000)',
        name: '@ctitle(2, 4)'
      })
    )
    window.console.debug(`${req.type} ${req.url}`, { req, response })
    return _.defaults({ response }, RESPONSE_COMMON)
  })
  Mock.mock(new RegExp('/manage/v1/knowledge/manage/list' + '(\\?.*)?$'), 'get', (req) => {
    const tags = _.times(2, () =>
      Mock.mock({
        id: '@integer(100000, 10000000000)',
        name: '@ctitle(1, 2)'
      })
    )
    const response = _.times(10, () =>
      Mock.mock({
        id: '@integer(100000, 10000000000)',
        resName: '@ctitle(1, 10)',
        createName: '@cname(1, 10)',
        'status|1': [0, 1],
        'uploadType|1': [0, 1],
        'isTop|1': [0, 1],
        catalogName: '@ctitle(1, 10)',
        tags
      })
    )
    window.console.debug(`${req.type} ${req.url}`, { req, response })
    return _.assign({ response: { data: response, totalNum: 100 } }, RESPONSE_COMMON)
  })
  Mock.mock(new RegExp('/manage/v1/knowledge/manage/details' + '(\\?.*)?$'), 'get', (req) => {
    const tags = _.times(2, () => {
      Mock.mock({
        id: '@integer(100000, 10000000000)',
        name: '@ctitle(1, 10)'
      })
    })
    let time = Math.floor(Math.random() * 4)
    const attachments = _.times(time, () =>
      Mock.mock({
        id: '@integer(100000, 10000000000)',
        fileName: '@ctitle(1, 10)',
        url: Mock.Random.image()
      })
    )
    const response = Mock.mock({
      id: '@integer(100000, 10000000000)',
      resName: '@ctitle(1, 10)',
      catalogName: '@ctitle(1, 10)',
      provideName: '@cname(1, 10)',
      createName: '@cname(1, 10)',
      resUrl: '@url',
      introduction: '@ctitle(1, 10)',
      'uploadType|1': [0, 1],
      'allowDownload|1': [0, 1],
      'status|1': [0, 1],
      'isTop|1': [0, 1],
      tags,
      catalogIds: [{ id: '@integer(100000, 10000000000)' }],
      attachments
    })
    window.console.debug(`${req.type} ${req.url}`, { req, response })
    return _.defaults({ response }, RESPONSE_COMMON)
  })
}
