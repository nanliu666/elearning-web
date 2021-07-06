import { post } from '@/router/axios'

/**
 * 导师管理-导师列表
 */
export const selectTutorList = (params) =>
  post('/api/blade-manage/v1/tutorManage/selectTutorList', params)

/**
 * 导师管理-新增导师
 */
export const addTutor = (params) => post('/api/blade-manage/v1/tutorManage/addTutor', params)

/**
 * 导师管理-编辑导师
 */
export const editTutor = (params) => post('/api/blade-manage/v1/tutorManage/editTutor', params)

/**
 * 导师管理-删除导师
 */
export const deleteTutor = (params) => post('/api/blade-manage/v1/tutorManage/deleteTutor', params)

/**
 * 导师管理-导师详情
 */
export const tutorDetail = (params) => post('/api/blade-manage/v1/tutorManage/tutorDetail', params)

/**
 * 导师管理-获取工作经历
 */
export const queryExperienceList = (params) =>
  post('/api/blade-manage/v1/tutorManage/queryExperienceList', params)

/***
 * 导师管理-获取徒弟列表
 */
export const studentList = (params) => post('/api/blade-manage/v1/tutorManage/studentList', params)
/***
 * 导师管理-判断徒弟是否可以添加
 */
export const isExitTutor = (params) => post('/api/blade-manage/v1/tutorManage/isExitTutor', params)

/***
 * 导师管理-评价学徒
 */
export const evaluateStudent = (params) =>
  post('/api/blade-manage//v1/tutorManage/evaluateStudent', params)

/***
 * 导师管理-学徒出师或解约
 */
export const updateStatus = (params) =>
  post('/api/blade-manage/v1/tutorManage/updateStatus', params)

/***
 * 导师管理-校验是否可以出师
 */
export const isExpired = (params) => post('/api/blade-manage/v1/tutorManage/isExpired', params)

/***
 * 导师管理-添加导师时，校验该用户是否可以添加
 */
export const checkTutor = (params) => post('/api/blade-manage/v1/tutorManage/checkTutor', params)
