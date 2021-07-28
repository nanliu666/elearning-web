import request from '@/router/axios'
import { get, post } from '@/router/axios'
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

/**
 * 岗位管理查看用户
 */
export const viewUser = (params) => {
  return request({
    url: '/api/manage/v1/source/base/position/users',
    method: 'get',
    params: {
      ...params
    }
  })
}

/**
 * 根据岗位id查询用户基本信息
 */
export const positionUserList = (params) => {
  return request({
    url: '/api/manage/v1/positions/userList',
    method: 'get',
    params: {
      ...params
    }
  })
}

/**
 * 岗位顶级列表
 */
export const positionLevelList = (params) => {
  return request({
    url: '/api/manage/v1/source/base/position/top/list',
    method: 'get',
    params: {
      ...params
    }
  })
}

/**
 * @desc 导入岗位
 */
export const importPosition = (params) => post('/api/manage/v1/positions/import', params)
/**
 * @desc 下载导入岗位模板
 */
export const downloadPositionTemplate = (params) =>
  get('/api/manage/v1/positions/exportTemplate', params, { responseType: 'blob' })
/**
 * @desc 导入岗位错误报告
 */
export const importPositionErrorFile = (params) =>
  get('/api/manage/v1/positions/exportErrFile', params, { responseType: 'blob' })

/**
 * 顶级查询（分页）
 */
export const positionTop = (params) => {
  return request({
    url: '/api/manage/v1/source/base/position/top/page',
    method: 'get',
    params: {
      ...params
    }
  })
}

/**
 * 列表查询（分页）
 */
export const positionSearch = (params) => {
  return request({
    url: '/api/manage/v1/source/base/position/info/page',
    method: 'get',
    params: {
      ...params
    }
  })
}

/**
 * 子节点查询（分页）
 */
export const positionChild = (params) => {
  return request({
    url: '/api/manage/v1/source/base/position/child/page',
    method: 'get',
    params: {
      ...params
    }
  })
}
