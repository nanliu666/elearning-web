import { del, get, post, put } from '@/router/axios'

/**
 * 查询直播安排
 * */
export const getLiveList = (params) => get('api/common/v1/live/plan/getLivePlanList', params)

/**
 * 删除直播
 * */
export const delLive = (params) => del('api/common/v1/live/plan/deleteLivePlan', params)

/**
 * 修改直播状态
 * */
export const toggleLiveStatus = (params) => post('api/common/v1/live/plan/updateIsUsed', params)

/**
 * 验证当前直播是否处于直播状态
 * */
export const getLiveStatus = (params) => get('/api/common/v1/live/plan/verifyIsLiving', params)

/**
 * 查询创建人列表
 * */
export const getCreateUserId = (params) =>
  get('api/common/v1/live/plan/getLivePlanCreatorList', params)

/**
 * 分类查询接口
 * */
// export const getCategoryList = (params) => get('/manage/v1/evaluation/category', params)
/**
 * 修改分类
 * */
export const putCategory = (params) => put('/manage/v1/evaluation/category', params)
/**
 * 删除分类
 * */
// export const delCategory = (params) => del('/manage/v1/evaluation/category', params)
/**
 * 新增分类接口
 * */
// export const postCategory = (params) => post('/manage/v1/evaluation/category', params)
/**
 * 分类查询接口
 * */
// export const ableCategory = (params) => put('/manage/v1/evaluation/category/able', params)
