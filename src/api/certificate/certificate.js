import { del, get, post, put } from '@/router/axios'
/**
 * del, get, post, put
 * 查询模板列表
 * @param {Object} params - 参数
 * */
export const getCertificateList = (params) =>
  get('/api/blade-manage/v1/source/certificate/getCertificateList', params)

/**
 * 删除证书模板
 * @param {Object} params - 参数
 * */
export const delTemplate = (params) =>
  del('/api/blade-manage/v1/source/certificate/delTemplate', params)

/**
 * 修改证书模板状态
 * @param {Object} params - 参数
 * */
export const updateStatus = (params) =>
  put('/api/blade-manage/v1/source/certificate/updateStatus', params)

/**
 * 预览模板
 * @param {Object} params - 参数
 * */
export const getSingleCertificate = (params) =>
  get('/api/blade-manage/v1/source/certificate/getSingleCertificate', params)

/**
 * 添加证书模板
 * @param {Object} params - 参数
 * */
export const addCertificate = (params) =>
  post('/api/blade-manage/v1/source/certificate/addCertificate', params)
/**
 * 查询证书发放列表
 * @param {Object} params - 参数
 * */
export const getCertificateGrantList = (params) =>
  get('/api/blade-manage/v1/source/certificate/getCertificateGrantList', params)

/**
 * 删除证书发放明细
 * @param {Object} params - 参数
 * */
export const delGrantDetails = (params) =>
  del('/api/blade-manage/v1/source/certificate/delGrantDetails', params)

/**
 * 导出证书发放列表Excel
 * @param {Object} params - 参数
 * */
export const exportGrantExcel = (params) =>
  get('/api/blade-manage/v1/source/certificate/exportGrantExcel', params)
