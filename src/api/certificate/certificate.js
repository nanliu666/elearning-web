import { del, get, post, put } from '@/router/axios'
/**
 * del, get, post, put
 * 查询模板列表
 * @param {Object} params - 参数
 * */
export const getCertificateList = (params) =>
  get('/api/manage/v1/source/certificate/getCertificateList', params)

/**
 * 删除证书模板
 * @param {Object} params - 参数
 * */
export const delTemplate = (params) => del('/api/manage/v1/source/certificate/delTemplate', params)

/**
 * 修改证书模板状态
 * @param {Object} params - 参数
 * */
export const updateStatus = (params) =>
  put(
    `/api/manage/v1/source/certificate/updateStatus?templateId=${params.templateId}&choice=${params.choice}`
  )

/**
 * 预览模板
 * @param {Object} params - 参数
 * */
export const getSingleCertificate = (params) =>
  get('/api/manage/v1/source/certificate/getSingleCertificate', params)

/**
 * 添加证书模板
 * @param {Object} params - 参数
 * */
export const addCertificate = (params) =>
  post('/api/manage/v1/source/certificate/addCertificate', params)
/**
 * 查询证书发放列表
 * @param {Object} params - 参数
 * */
export const getCertificateGrantList = (params) =>
  get('/api/manage/v1/source/certificate/getCertificateGrantList', params)

/**
 * 删除证书发放明细
 * @param {Object} params - 参数
 * */
export const delGrantDetails = (params) =>
  del('/api/manage/v1/source/certificate/delGrantDetails', params)

/**
 * 导出证书发放列表Excel
 * */
export const exportGrantExcel = (params) =>
  get('/api/manage/v1/source/certificate/exportGrantExcel', params, { responseType: 'blob' })
/**
 * 导出证书模板
 * */
export const exportTemplateExcel = (params) =>
  get('/api/manage/v1/source/certificate/exportTemplateExcel', params, { responseType: 'blob' })
/**
 * 查询证书发放明细
 * */
export const getCertificateGrantDetail = (params) =>
  get('/api/manage/v1/source/certificate/getCertificateGrantDetail', params)
/**
 * 撤回证书
 * @param {Object} params - 参数
 * */
export const revokeCertificate = (params) =>
  post('/api/manage/v1/source/certificate/revoke', params)
