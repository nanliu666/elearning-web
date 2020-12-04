import { get, post, put, del } from '@/router/axios'
/**
 *  del, get, post, put
 * 查询培训详情
 * @param {Object} courseId - 参数
 * */
export const getTrainDetail = (params) => get('/api/blade-manage/v1/train/getTrainDetail', params)

/**
 * 学员培训列表
 * @param {Object} courseId - 参数
 * */
export const studentList = (params) => get('/api/blade-manage/v1/train/studentList', params)
/**
 * 查询培训线上课程
 * @param {Object} courseId - 参数
 * */
export const getOnlineCourse = (params) => get('/api/blade-manage/v1/train/getOnlineCourse', params)
/**
 * 学员发放证书
 * @param {Object} courseId - 参数
 * */
export const certificateOperate = (params) =>
  get('/api/blade-manage/v1/train/certificateOperate', params)
/**
 * 查询培训线下日程
 * @param {Object} courseId - 参数
 * */
export const getOfflineTodo = (params) => get('/api/blade-manage/v1/train/getOfflineTodo', params)
/**
 * 查询培训评估结果
 * @param {Object} courseId - 参数
 * */
export const getTrainEvaluate = (params) =>
  get('/api/blade-manage/v1/train/getTrainEvaluate', params)
/**
 * 发放学员证书
 * @param {Object} courseId - 参数
 * */
export const grantCertificate = (params) =>
  post('/api/blade-manage/v1/train/grantCertificate', params)
/**
 * 撤回学员证书
 * @param {Object} courseId - 参数
 * */
export const revokeCertificate = (params) =>
  post('/api/blade-manage/v1/train/revokeCertificate', params)
/**
 * 查询培训考试安排
 * @param {Object} courseId - 参数
 * */
export const examList = (params) => get('/api/blade-manage/v1/train/examList', params)
/**
 * 查询培训考试安排详情
 * @param {Object} courseId - 参数
 * */
export const examDetail = (params) => get('/api/blade-manage/v1/train/examDetail', params)
/**
 * 查询培训考试结果列表
 * @param {Object} courseId - 参数
 * */
export const examResult = (params) => get('/api/blade-manage/v1/train/examResult', params)

/**
 *  查询分类
 * @param {Object} courseId - 参数
 * */
export const queryClassify = (params) => get('/api/blade-manage/v1/train/queryClassify', params)

// 贺磊接口

/**
 *  新增
 * @param {Object} courseId - 参数
 * */
export const addCatalog = (params) => post('/api/blade-manage/v1/train/addCatalog', params)
/**
 *   查询分组&分类
 * @param {Object} courseId - 参数
 * */
export const getCatalogs = (params) => get('/api/blade-manage/v1/train/getCatalogs', params)
/**
 *   移动
 * @param {Object} courseId - 参数
 * */
export const move = (params) => put('/api/blade-manage/v1/train/move', params)
/**
 *   删除分组分类
 * @param {Object} courseId - 参数
 * */
export const delCatalogs = (params) => del('/api/blade-manage/v1/train/delCatalogs', params)
/**
 *   编辑分组分类
 * @param {Object} courseId - 参数
 * */
export const updateCatalogs = (params) => put('/api/blade-manage/v1/train/updateCatalogs', params)
/**
 *   查询培训安排
 * @param {Object} courseId - 参数
 * */
export const getScheduleList = (params) => get('/api/blade-manage/v1/train/getScheduleList', params)
/**
 *   删除培训安排
 * @param {Object} courseId - 参数
 * */
export const delTrain = (params) => del('/api/blade-manage/v1/train/delTrain', params)
/**
 *   结办培训安排
 * @param {Object} courseId - 参数
 * */
export const stopSchedule = (params) => put(`/api/blade-manage/v1/stopSchedule/${params}`)
