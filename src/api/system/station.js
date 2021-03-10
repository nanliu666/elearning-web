import request from '@/router/axios'

/**
 * 岗位管理树形机构查询接口
 */
export const getStationTree = (params) => {
  return request({
    url: '/api/manage/v1/source/base/position/all',
    method: 'get',
    params: {
      ...params
    }
  })
}

/**
 * 岗位管理-顶级节点
 */
export const getStationParent = (params) => {
  return request({
    url: '/api/manage/v1/source/base/position/page',
    method: 'get',
    params: {
      ...params
    }
  })
}

/**
 * 岗位管理-查询子节点
 */
export const getStationChild = (params) => {
  return request({
    url: '/api/manage/v1/source/base/position/child',
    method: 'get',
    params: {
      ...params
    }
  })
}

/**
 * 岗位管理新建岗位
 */
export const queryStation = (params) => {
  return request({
    url: '/api/manage/v1/source/base/position/info',
    method: 'get',
    params: {
      ...params
    }
  })
}

/**
 * 岗位管理新建岗位
 */
export const addStation = (params) => {
  return request({
    url: '/api/manage/v1/source/base/position/info',
    method: 'post',
    params: {
      ...params
    }
  })
}

/**
 * 岗位管理岗位编辑
 */
export const editStation = (params) => {
  return request({
    url: '/api/manage/v1/source/base/position/info',
    method: 'put',
    params: {
      ...params
    }
  })
}

/**
 * 岗位管理岗位删除
 */
export const deleteStation = (params) => {
  return request({
    url: '/api/manage/v1/source/base/position/info',
    method: 'delete',
    params: {
      ...params
    }
  })
}
