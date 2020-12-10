import { get, del } from '@/router/axios'
/**
 * del, get, post, put
 * 查询模板列表
 * @param {Object} params - 参数
 * */
export const getCertificateList = (params) =>
  get('/api/blade-manage/v1/source/certificate/getCertificateList', params)

/**
 * 查询模板列表
 * @param {Object} params - 参数
 * */
export const delTemplate = (params) =>
  del('/api/blade-manage/v1/source/certificate/delTemplate', params)

/**
 * 修改证书模板状态
 * @param {Object} params - 参数
 * */
export const updateStatus = (params) =>
  del('/api/blade-manage/v1/source/certificate/updateStatus', params)
