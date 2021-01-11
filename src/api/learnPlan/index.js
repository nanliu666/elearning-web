import { get, post, del, put } from '@/router/axios'

/**
 * 新增学习计划
 * @param {Object} params - 参数
 * */
export const getlearnPlanList = (params) => get('/api/manage/v1/study/plan/queryPlan', params)

/**
 * 修改学习计划
 * @param {Object} params - 参数
 * */
export const updatePlan = (params) => put('/api/manage/v1/study/plan/updatePlan', params)

/**
 * 新增分组分类
 * @param {Object} params - 参数
 * */
export const addCatalog = (params) => post('/api/manage/v1/study/plan/catalog/addCatalog', params)

/**
 * 删除分组分类
 * @param {Object} params - 参数
 * */
export const delCatalogs = (params) => del('/api/manage/v1/study/plan/catalog/delCatalogs', params)

/**
 * 查询分组分类
 * @param {Object} params - 参数
 * */
export const getCatalogs = (params) => get('/api/manage/v1/study/plan/catalog/getCatalogs', params)

/**
 * 分类移动
 * @param {Object} params - 参数
 * */
export const moveCatalogs = (params) => put('/api/manage/v1/study/plan/catalog/move', params)

/**
 * 编辑分组分类
 * @param {Object} params - 参数
 * */
export const updateCatalogs = (params) =>
  put('/api/manage/v1/study/plan/catalog/updateCatalogs', params)

/**
 * 编辑分组分类
 * @param {Object} params - 参数
 * */
export const addPlan = (params) => post('/api/manage/v1/study/plan/addPlan', params)

/**
 * 人员信息
 * @param {Object} params - 参数
 * */
export const getUserList = (params) => get('/api/user/v1/user/work/list', params)

/**
 * 查看完成率
 * @param {Object} params - 参数
 * */
export const queryPercentageComplete = (params) =>
  get('/api/manage/v1/study/plan/queryPercentageComplete', params)

/**
 * 选修课查询
 * @param {Object} params - 参数
 * */
export const queryLog = (params) => get('/api/manage/v1/study/plan/course/queryLog', params)

/**
 * 选修课删除
 * @param {Object} params - 参数
 * */
export const delLog = (params) => del('/api/manage/v1/study/plan/course/delLog', params)

/**
 * 选修课浏览记录添加
 * @param {Object} params - 参数
 * */
export const addLog = (params) => del('/api/manage/v1/study/plan/course/addLog', params)

/**
 * 删除学习计划
 * @param {Object} params - 参数
 * */
export const deletePlan = (params) => del('/api/manage/v1/study/plan/deletePlan', params)
/**
 * 发布学习计划
 * @param {Object} params - 参数
 * */
export const releasePlan = (params) => del('/api/manage/v1/study/plan/release', params)

/**
 * 查询学习计划详情
 * @param {Object} params - 参数
 * */
export const planDetail = (params) => get('/api/manage/v1/study/plan/planDetail', params)

/**
 * 查询课程详情
 * @param {Object} params - 参数
 * */
export const courseDetail = (params) => get('/api/manage/v1/study/plan/courseDetail', params)

/**
 * 查询课程信息列表
 * @param {Object} params - 参数
 * */
export const getCourseList = (params) => get('/api/manage/v1/course/getCourseList', params)
