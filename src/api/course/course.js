import {
  get,
  post,
  put,
  del
} from '@/router/axios'
/**
 * del, get, post, put
 * 创建课程数据导出接口
 * @param {Object} params - 参数
 * */
export const getCourseList = (params) => get('/api/manage/v1/course/getCourse', params)
/**
 * 删除课程内容接口
 * @param {Object} contentId - 参数
 * */
export const delCourseContent = (params) => get('/api/manage/v1/course/delCourseContent', params)
/**
 * 删除课程接口
 * @param {Object} courseId - 参数
 * */
export const delCourseInfo = (params) => del('/api/manage/v1/course/delCourseInfo', params)
/**
 * 查询课程信息列表
 * @param {Object} courseId - 参数
 * */
export const getCourseListData = (params) => get('/api/manage/v1/course/getCourseList', params)
/**
 * 新增课程
 * @param {Object} courseId - 参数
 * */
export const addCourse = (params) => post('/api/manage/v1/course/addCourse', params)
/**
 * 编辑课程
 * @param {Object} courseId - 参数
 * */
export const editCourseInfo = (params) => put('/api/manage/v1/course/editCourseInfo', params)
/**
 * 课程目录查询
 * @param {Object} courseId - 参数
 * */
export const getCatalog = (params) => get('/manage/v1/course/getCatalog', params)
/**
 * 新增课程目录
 * @param {Object} courseId - 参数
 * */
export const addCatalog = (params) => post('/api/manage/v1/course/addCatalog', params)
/**
 * 删除课程目录
 * @param {Object} courseId - 参数
 * */
export const delCatalag = (params) => del('/api/manage/v1/course/delCatalog', params)

/**
 * 编辑课程目录
 * @param {Object} courseId - 参数
 * */
export const editCatalog = (params) => put('/api/manage/v1/course/editCatalog', params)
/**
 * 停用&启用
 * @param {Object} courseId - 参数
 * */
export const updateStatus = (params) => put('/api/manage/v1/course/updateStatus', params)
/**
 * 确认某个课程目录id下是否有课程信息
 * @param {Object} courseId - 参数
 * */
export const getCourseByCatalogId = (params) =>
  get('/api/manage/v1/course/getCourseByCatalogId', params)
/**
 * 创建人信息列表
 * @param {Object} courseId - 参数
 * */
export const catalogUserList = (params) => get('/api/manage/v1/course/catalogUserList', params)
/**
 * 课程目录--修改排序
 * @param {Object} params - 参数
 * */
export const updateCatalogSort = (params) => put('/api/manage/v1/course/updateCatalogSort', params)
/**
 * 上下架操作
 * @param {Object} params - 参数
 * */
export const putawayOperate = (params) => put('/api/manage/v1/course/putawayOperate', params)
/**
 * 置顶、取消置顶操作操作
 * @param {Object} params - 参数
 * */
export const updateCourseTop = (params) => put('/api/manage/v1/course/updateCourseTop', params)
/**
 * 移动课程
 * @param {Object} params - 参数
 * */
export const moveCourse = (params) => put('/api/manage/v1/course/moveCourse', params)
/**
 * 创建课程--标签信息
 * @param {Object} params - 参数
 * */
export const getCourseTags = (params) => get('/api/manage/v1/course/getCourseTags', params)
/**
 * 查询单个课程信息  // 编辑页面的数据前
 * @param {Object} params - 参数
 * */
export const getCourse = (params) => get('/api/manage/v1/course/getCourse', params)
/**
 * 查询单个课程信息  // 编辑页面的数据前
 * @param {Object} params - 参数
 * */
export const getCourseContents = (params) => get('/api/manage/v1/course/getCourseContents', params)
/**
 *  查询讲师列表
 * @param {Object} params - 参数
 * */
export const listTeacher = (params) => get('/api/manage/v1/teacher/listTeacherComboBox', params)
/**
 *  学习详情
 * @param {Object} params - 参数
 * */
export const getCourseStudyDetail = (params) =>
  get('/api/manage/v1/course/getCourseStudyDetail', params)
/**
 *  学习人员列表
 * @param {Object} params - 参数
 * */
export const getStudyList = (params) => get('/api/manage/v1/course/getStudyList', params)
/**
 *  课程管理--创建人信息下拉框
 * @param {Object} params - 参数
 * */
export const getCourseInfoUserList = (params) => get('/api/manage/v1/course/getCourseInfoUserList', params)
