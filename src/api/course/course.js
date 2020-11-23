import { get } from '@/router/axios'
/**
 * del, get, post, put
 * 创建课程数据导出接口
 * @param {Object} courseId - 参数
 * */
export const getCourseList = (params) => get(`/api/manage/v1/course/getCourse?courseId=${params}`)
/**
 * 删除课程内容接口
 * @param {Object} contentId - 参数
 * */
export const delCourseContent = (params) =>
  get(`/api/blade-manage/v1/course/delCourseContent?contentId=${params}`)
/**
 * 删除课程接口
 * @param {Object} courseId - 参数
 * */
export const delCourseInfo = (params) =>
  get(`/api/blade-manage/v1/course/delCourseInfo?courseId=${params}`)
/**
 * 查询课程信息列表
 * @param {Object} courseId - 参数
 * */
export const getCourseListData = (params) =>
  get('/api/blade-manage/v1/course/getCourseList', params)
/**
 * 新增课程
 * @param {Object} courseId - 参数
 * */
export const addCourse = (params) => get('/api/blade-manage/v1/course/addCourse', params)
/**
 * 编辑课程
 * @param {Object} courseId - 参数
 * */
export const editCourseInfo = (params) => get('/api/blade-manage/v1/course/editCourseInfo', params)
/**
 * 课程目录查询
 * @param {Object} courseId - 参数
 * */
export const getCatalog = (params) => get('/api/blade-manage/v1/course/getCatalog', params)
/**
 * 新增课程目录
 * @param {Object} courseId - 参数
 * */
export const addCatalog = (params) => get('/api/blade-manage/v1/course/addCatalog', params)
/**
 * 删除课程目录
 * @param {Object} courseId - 参数
 * */
export const delCatalag = (params) => get('/api/blade-manage/v1/course/delCatalag', params)

/**
 * 编辑课程目录
 * @param {Object} courseId - 参数
 * */
export const editCatalog = (params) => get('/api/blade-manage/v1/course/editCatalog', params)
/**
 * 确认某个课程目录id下是否有课程信息
 * @param {Object} courseId - 参数
 * */
export const getCourseByCatalogId = (params) =>
  get('/api/blade-manage/v1/course/getCourseByCatalogId', params)
