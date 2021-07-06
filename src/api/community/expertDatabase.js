import { get, post } from '@/router/axios'

// 获取专家列表
export const getExpertList = (params) =>
  get('/api/blade-margin/v1/community/expert/queryAll', params)
// 删除专家
export const delExpert = (params) =>
  post('/api/blade-margin/v1/community/expert/delete?id=' + params)
// 批量删除
export const batchDel = (params) =>
  post('/api/blade-margin/v1/community/expert/deleteCommunityExperts?ids=' + params)
// 编辑专家
export const editExpert = (params) => post('/api/blade-margin/v1/community/expert/edit', params)
// 创建专家
export const addExpert = (params) => post('/api/blade-margin/v1/community/expert/add', params)
// 查询全部专区
export const queryZone = (params) =>
  get('/api/blade-margin/v1/community/area/queryAllForDropList', params)
// 查询单个专家
export const queryExpert = (params) => get('/api/blade-margin/v1/community/expert/getOne', params)
