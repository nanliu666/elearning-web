import request from '@/router/axios'
export const getJobList = (params) => {
  //岗位查询接口
  return request({
    url: '/api/org/v1/job/list',
    method: 'get',
    params: {
      ...params
    }
  })
}

export const getSkillList = (params) => {
  //技能表格查询接口
  return request({
    url: '/api/org/v1/job/skill',
    method: 'get',
    params: {
      ...params
    }
  })
}

export const addSkill = (params) => {
  //新增技能接口
  return request({
    url: '/api/org/v1/job/skill',
    method: 'post',
    data: {
      ...params
    }
  })
}

export const editSkill = (params) => {
  //修改技能接口
  return request({
    url: '/api/org/v1/job/skill',
    method: 'put',
    params: {
      ...params
    }
  })
}

export const deleteSkill = (params) => {
  //修改技能接口
  return request({
    url: '/api/org/v1/job/skill',
    method: 'delete',
    params: {
      ...params
    }
  })
}
