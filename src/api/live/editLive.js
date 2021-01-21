import { get, post } from '@/router/axios'

// 添加直播
export const postAddLive = (params) => post('/api/common/v1/live/plan/addLivePlan', params)

// 分类查询接口
export const getcategoryTree = (params) => get('/api/common/v1/category/getCategoryTree', params)

// 回播中直播列表
export const getLivePlanList = (params) => get('/api/common/v1/live/plan/getLivePlanList', params)

// 回播列表
export const getCategoryTree = (params) => get('/api/common/v1/category/getCategoryTree', params)

/**
 * 分类查询接口
 * */
// export const getCategoryList = (params) => get('/manage/v1/evaluation/category', params)
/**
 * 修改分类
 * */
// export const putCategory = (params) => put('/manage/v1/evaluation/category', params)
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
