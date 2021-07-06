import request from '@/router/axios'

/**
 * 职级管理-查询所有职级
 */
export const getRankTree = (params) => {
    return request({
      url: '/blade-system/v1/system/jobLevel/all',
      method: 'get',
      params: {
        ...params
      }
    })
  }

/**
 * 职级管理查询
 */
export const queryRank = (params) => {
  return request({
    url: '/blade-system/v1/system/jobLevel/searchJobLevel',
    method: 'get',
    params: {
      ...params
    }
  })
}


/**
 * 职级管理-查询子节点
 */
export const getRankChild = (params) => {
    return request({
      url: '/blade-system/v1/system/jobLevel/child',
      method: 'get',
      params: {
        ...params
      }
    })
  }
  

/**
 * 职级管理新建职级
 */
export const addRank= (params) => {
    return request({
      url: '/blade-system/v1/system/jobLevel/save',
      method: 'post',
      params: {
        ...params
      }
    })
  }


/**
 * 职级管理——编辑
 */
export const editRank = (params) => {
    return request({
      url: '/blade-system/v1/system/jobLevel/update',
      method: 'post',
      params: {
        ...params
      }
    })
  }

/**
 * 职级管理——删除
 */
export const deleteRank = (params) => {
    return request({
      url: '/blade-system/v1/system/jobLevel/delete',
      method: 'post',
      params: {
        ...params
      }
    })
  }
  