import { post, put } from '@/router/axios'
/**
 * del, get, post, put
 * 添加diy模板
 * @param {Object} params - 参数
 * */
export const postSaveTemp = (params) => post('/api/manage/v1/cms/plan', params)

/**
 * del, get, post, put
 * 修改diy模板
 * @param {Object} params - 参数
 * */
export const putUpdataTemp = (params) => put('/api/manage/v1/cms/plan', params)

/**
 * del, get, post, put
 * 发布
 * @param {Object} params - 参数
 * */
export const putReleaseTemp = (params) => put('/api/manage/v1/cms/plan/release', params)
