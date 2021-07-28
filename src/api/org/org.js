import request from '@/router/axios'
import { get, post } from '@/router/axios'
// 组织机构查询
export const getOrgTree = (params) => {
  return request({
    url: '/api/org/v1/organization',
    method: 'get',
    params: params
  })
}

// 简洁-组织机构查询
export const getOrgTreeSimple = (params) => {
  return request({
    url: '/api/org/v1/organization/tree',
    method: 'get',
    params: params
  })
}
// 简洁-组织机构部门查询
export const getOrgTreeSearch = (params) => {
  return request({
    url: '/api/org/v1/org/user/child',
    method: 'get',
    params: params
  })
}
// 简洁-业务机构部门查询
export const getbusinessTreeSearch = (params) => {
  return request({
    url: '/api/org/v1/biz/org/user/child',
    method: 'get',
    params: params
  })
}

// 组织机构排序
export const sortOrgTree = (params) => {
  return request({
    url: '/api/org/v1/organization/sort',
    method: 'post',
    data: params
  })
}

// 组织机构删除
export const deleteOrg = (params) => {
  return request({
    url: '/api/org/v1/organization',
    method: 'delete',
    params: params
  })
}

// 组织机构编辑
export const editOrg = (params) => {
  return request({
    url: '/api/org/v1/organization',
    method: 'put',
    params: params
  })
}

// 组织机构新增
export const createOrg = (params) => {
  return request({
    url: '/api/org/v1/organization',
    method: 'post',
    params: params
  })
}

//负责人查询

export const getOrgLeader = (params) => {
  return request({
    url: '/api/org/v1/organization/leader',
    method: 'get',
    params: params
  })
}

// 在职员工查询
export const getUserWorkList = (params) => {
  return request({
    url: '/api/user/v1/user/work/list',
    method: 'get',
    params: params
  })
}
export const getJob = (params) => get('/api/org/v1/organization/job', params)
export const getPosition = (params) => get('/api/org/v1/position', params)
export const getTagList = (params) => get('/api/user/v1/user/tag/list', params)

//导入组织
export const importOrgs = (params) => post('/api/blade-system/v1/organization/import', params)

//导入组织失败文件
export const exportErrOrgs = (params) =>
  get('/api/blade-system/v1/organization/exportErrFile', params, { responseType: 'blob' })

//下载导入模板
export const exportTemplateOrgs = (params) =>
  get('/api/blade-system/v1/organization/exportTemplate', params, { responseType: 'blob' })

// 组织管理-列表
// export const getOrganization = (params) => get('/api/blade-resource/v1/organization', params)

export const getorganizationNew = (params) => get('/api/blade-system/v1/organization/new', params)

  