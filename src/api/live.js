import { get, post } from '@/router/axios'

export const addCategory = (data) => post('/common/v1/category/addCategory', data)

export const getCategoryTree = (params) => get('/common/v1/category/getCategoryTree', params)

export const checkCategory = (data) => post('/common/v1/category/checkCategory', data)

export const deleteCategory = (params) => get('/common/v1/category/deleteCategory', params)
// 查询创建人列表
export const getCreatorList = (params) => get('/common/v1/category/getCreatorList', params)
export const getCreatorList2 = (params) =>
  get('/manage/v1/study/plan/catalog/getCreatorList', params)

export const updateCategorySort = (data) => post('/common/v1/category/updateCategorySort', data)

export const updateCategoryStatus = (data) => post('/common/v1/category/updateCategoryStatus', data)

export const editCategory = (data) => post('/common/v1/category/editCategory', data)

export const lecturer = (params) => get('/common/v1/live/lecturer', params)

export const getLiveList = (params) => get('/common/v1/live/data/list', params)

export const getSummary = (params) => get('/common/v1/live/data/summary', params)

export const getAudience = (params) => get('/common/v1/live/data/audience', params)

export const getAudienceListPerson = (params) => get('/common/v1/live/audience/list', params)

export const getAudienceDetail = (params) => get('/common/v1/live/audience/detail', params)

export const getChannelAuthInfo = (params) => get('/common/v1/live/getChannelAuthInfo', params)
