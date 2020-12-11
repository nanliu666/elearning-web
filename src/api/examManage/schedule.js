import { del, get, post, put } from '@/router/axios'
/**
 * 新增考试安排
 */
export const postExamArrange = (params) => post('/manage/v1/exam/arrange', params)
/**
 * 分页查询试卷列表
 */
export const getExamList = (params) => get('/manage/v1/exam/paper/list', params)
/**
 * 分页查询试卷列表
 */
export const delExamList = (params) => del('/manage/v1/exam/paper', params)
/**
 * 考试详情
 */
export const getExamArrange = (params) => get('/manage/v1/exam/arrange', params)
/**
 * 编辑考试安排
 */
export const putExamArrange = (params) => put('/manage/v1/exam/arrange', params)
/**
 * 删除考试安排
 */
export const delExamArrange = (params) => del('/manage/v1/exam/arrange', params)
/**
 * 获取当前组织下的所有人
 */
export const getUserList = (params) => get('/user/v1/user/basis', params)
/**
 * 获取考试安排列表
 */
export const getArrangeList = (params) => get('/manage/v1/exam/arrange/list', params)
/**
 * 获取详情页-考生概况
 */
export const getBatchList = (params) => get('/manage/v1/examinee/batch', params)
/**
 * 获取考生批次
 */
export const getBatchexaminee = (params) => get('/manage/v1/exam/arrange/examinee', params)
/**
 * 获取考生批次
 */
export const getManualPreview = (params) => get('/manage/v1/exam/preview/manual', params)
/**
 * 预生成试卷列表
 */
export const getPreviewList = (params) => get('/manage/v1/exam/preview/list', params)
/**
 * 生成预览随机试卷
 */
export const generatePreviewList = (params) => get('/manage/v1/exam/preview/generate', params)
/**
 * 删除预生成试卷
 */
export const delExamPreview = (params) => del('/manage/v1/exam/preview', params)

/**
 * 获取批次
 */
export const getBatchNumber = (params) => get('/manage//v1/exam/batch/number', params)
/**
 * 获取证书模板
 */
export const getCertificateList = (params) =>
  get('/manage/v1/source/certificate/getCertificateList', params)
/**
 * 发布考生成绩
 */
export const putAchievement = (params) => put('/manage/v1/achievement/publish', params)
/**
 * 发布考生成绩
 */
export const putCertificate = (params) => put('/manage/v1/revoke/certificate', params)
