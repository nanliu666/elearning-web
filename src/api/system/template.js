import { get, post, put, del } from '@/router/axios'

/**
 * 模板管理-添加
 */
export const templateAdd = (params) => post('/api/margin/v1/xls/import/template/add', params)

/**
 * 模板管理-g更新
 */
export const templateUpdate = (params) => put('/api/margin/v1/xls/import/template/update', params)

/**
 * 模板管理-list
 */
 export const templateList = (params) => get('/api/margin/v1/xls/import/template/list', params)
 
/**
 * 模板管理-获取
 */
export const getTemplate = (params) => get('/api/margin/v1/xls/import/template/code', params)
/**
 * 模板管理-删除 
 */
 export const delTemplate = (params) => del(`/api/margin/v1/xls/import/template/delete?ids=${params}`, params)