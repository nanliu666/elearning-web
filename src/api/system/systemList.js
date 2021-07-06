import { get, post } from '@/router/axios'

/**
 * 制度清单-培训制作列表
 */
export const getArrayList = (params) => post('/api/blade-margin/v1/regulation/back/list', params)

/**
 * 制度清单-置顶或取消置顶
 */
export const toTopData = (params) => get('/api/blade-margin/v1/regulation/setTop', params)
/**
 * 制度清单-删除制度
 */
export const delList = (params) => post('/api/blade-margin/v1/regulation/remove', params)
/**
 * 制度清单-上传文档
 */
export const uploadDoc = (params) => post('/api/blade-margin/v1/regulation/add', params)

/**
 * 制度清单-课程列表
 */
export const getAllCourse = (params) => get('/api/margin/v1/regulation/getAllCourse', params)

/**
 * 制度清单-新增课程申请
 */
export const addCourseApplication = (params) =>
  post('/api/margin/v1/regulation/addCourseApplication', params)

/**
 * 制度清单-课程申请-回显课程信息
 */
export const regGetCourseInfo = (params) => get('/api/margin/v1/regulation/getCourseInfo', params)

/**
 * 制度清单-课程申请-创建人
 */
export const createCourseUser = (params) =>
  get('/api/manage/v1/course/getCourseInfoUserList', params)

/**
 * 制度清单-课程申请-知识体系
 */
export const getKnowledgeSystem = (params) => get('/api/common/v1/category/getCategoryTree', params)

/**
 * 制度清单-课程申请-项目经理
 */
export const getAllPM = (params) => get('/api/org/v1/org/user/child', params)

/**
 * 制度清单-课程申请-课程分类
 */
export const listCatalog = (params) => get('/api/manage/v1/course/getCatalog', params)

/**
 * 制度清单-课程申请-讲师列表
 */
export const listTeacherComboBox = (params) =>
  get('/api/manage/v1/teacher/listTeacherComboBox', params)

/**
 * 制度清单-课程申请-无权限的组织架构
 */
export const noPrivilegeTree = (params) => get('/api/org/v1/organization/noPrivilegeTree', params)
