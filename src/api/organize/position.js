import request from '@/router/axios'
export const getCategoryList = (params) => {
  //职位类别查询接口
  return request({
    url: '/api/org/v1/job/category/list',
    method: 'get',
    params: {
      ...params
    }
  })
}
// /api/org/v1/job
export const gotV1Job = (params) => {
  //职位分页查询接口
  return request({
    url: '/api/org/v1/job',
    method: 'get',
    params: {
      ...params
    }
  })
}
export const postV1Job = (params) => {
  //职位新增接口
  return request({
    url: '/api/org/v1/job',
    method: 'post',
    data: {
      ...params
    }
  })
}
export const putV1Job = (params) => {
  //职位修改接口
  return request({
    url: '/api/org/v1/job',
    method: 'put',
    data: {
      ...params
    }
  })
}
export const deleteV1Job = (params) => {
  //职位删除接口
  return request({
    url: '/api/org/v1/job',
    method: 'delete',
    params: {
      ...params
    }
  })
}
export const deleteV1jobLevel = (params) => {
  //职级删除接口
  return request({
    url: '/api/org/v1/jobLevel',
    method: 'delete',
    params: {
      ...params
    }
  })
}
// /org/v1/job/category/define
export const getCategoryDefine = (params) => {
  //职位类别查询接口
  return request({
    url: '/api/org/v1/job/category/define',
    method: 'get',
    params: {
      ...params
    }
  })
}
export const deleteCategoryDefine = (params) => {
  //职位类别删除接口
  return request({
    url: '/api/org/v1/job/category/define',
    method: 'delete',
    params: {
      ...params
    }
  })
}
export const postCategoryDefine = (params) => {
  //职位类别添加接口
  return request({
    url: '/api/org/v1/job/category/define',
    method: 'post',
    data: {
      ...params
    }
  })
}
export const putCategoryDefine = (params) => {
  //职位类别添加接口
  return request({
    url: '/api/org/v1/job/category/define',
    method: 'put',
    data: {
      ...params
    }
  })
}

export const getV1Position = (params) => {
  //岗位添加接口
  return request({
    url: '/api/org/v1/position',
    method: 'get',
    params: {
      ...params
    }
  })
}
export const deleteV1Position = (params) => {
  //岗位删除接口
  return request({
    url: '/api/org/v1/position',
    method: 'delete',
    params: {
      ...params
    }
  })
}
export const postV1Position = (params) => {
  //岗位添加接口
  return request({
    url: '/api/org/v1/position',
    method: 'post',
    data: {
      ...params
    }
  })
}
export const putV1Position = (params) => {
  //岗位修改接口
  return request({
    url: '/api/org/v1/position',
    method: 'put',
    data: {
      ...params
    }
  })
}
export const getJobTree = (params) => {
  //组织机构职位树查询接口
  return request({
    url: '/api/org/v1/organization/tree',
    method: 'get',
    params: {
      ...params
    }
  })
}
export const getJobList = (params) => {
  //职位汇总查询接口
  return request({
    url: '/api/org/v1/job/list',
    method: 'get',
    params: {
      ...params
    }
  })
}
//-------------------liufuze---------------------------
//职级列表
export const getClassList = (params) => {
  return request({
    url: '/api/org/v1/jobLevel',
    method: 'get',
    params: {
      ...params
    }
  })
}
//职级类别列表
export const getClassCategoryList = (params) => {
  return request({
    url: '/api/org/v1/jobLevel/category',
    method: 'get',
    params: {
      ...params
    }
  })
}
//新增职级
export const addNewClass = (params) => {
  return request({
    url: '/api/org/v1/jobLevel',
    method: 'post',
    params: {
      ...params
    }
  })
}
export const postCategory = (params) => {
  //职级类别添加接口
  return request({
    url: '/api/org/v1/jobLevel/category',
    method: 'post',
    data: {
      ...params
    }
  })
}
export const putCategory = (params) => {
  //职级编辑接口
  return request({
    url: '/api/org/v1/jobLevel',
    method: 'put',
    data: {
      ...params
    }
  })
}
export const putCategoryCategory = (params) => {
  //职级类别编辑接口
  return request({
    url: '/api/org/v1/jobLevel/category',
    method: 'put',
    data: {
      ...params
    }
  })
}
export const addCategoryCategory = (params) => {
  //职级类别新增接口
  return request({
    url: '/api/org/v1/jobLevel/category',
    method: 'post',
    data: {
      ...params
    }
  })
}
export const delCategoryCategory = (params) => {
  //职级类别删除接口
  return request({
    url: '/api/org/v1/jobLevel/category',
    method: 'delete',
    data: {
      ...params
    }
  })
}
