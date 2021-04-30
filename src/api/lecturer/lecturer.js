import { get, post, del, put } from '@/router/axios'
/**
 * 查询讲师分类列表接口
 * @param {Object} courseId - 参数
 * */
export const listTeacherCategory = (params) =>
  post('/api/manage/v1/teacher/listTeacherCategory', params)

/**
 * 新增分组/分类
 * @param {Object} courseId - 参数
 * */
export const addCatalog = (params) => post('/api/manage/v1/teacher/addCatalog', params)
/**
 * 查询讲师列表
 * @param {Object} courseId - 参数
 * */
export const listTeacher = (params) => post('/api/manage/v1/teacher/listTeacher', params)
/**
 * 添加讲师
 * @param {Object} courseId - 参数
 * */
export const addTeacher = (params) => post('/api/manage/v1/teacher/add', params)

/**
 * 查询添加讲师的数据
 * @param {Object} courseId - 参数
 * */
export const queryTeacherlist = (params) => get('/api/user/v1/user/work/list', params)

/**
 * 启动/停用系统规则列表
 * @param {Object} courseId - 参数
 * */
export const editSysRulus = (params) => post('/api/manage/v1/teacher/list/updateStatus', params)
/**
 * 删除分组/分类
 * @param {Object} courseId - 参数
 * */
export const deleteTeacherCatalog = (params) =>
  post('/api/manage/v1/teacher/deleteTeacherCatalog', params)
/**
 * 删除讲师
 * @param {Object} courseId - 参数
 * */
export const Teacherdelete = (params) => del('/api/manage/v1/teacher/list/delete', params)
/**
 * 查询讲师详情
 * @param {Object} courseId - 参数
 * */
export const getTeacher = (params) => post('/api/manage/v1/teacher/get', params)

/**
 * 编辑讲师
 * @param {Object} courseId - 参数
 * */
export const update = (params) => put('/api/manage/v1/teacher/update', params)
/**
 *  移动
 * @param {Object} courseId - 参数
 * */
export const move = (params) => post('/api/manage/v1/teacher/catalog/move', params)
/**
 *  编辑讲师分类
 * @param {Object} courseId - 参数
 * */
export const editTeacherCatalog = (params) =>
  post('/api/manage/v1/teacher/editTeacherCatalog', params)
/**
 *  查询讲师授课情况
 * */
export const getCourseList = (params) => post('/api/manage/v1/teacher/courseList', params)
/**
 *  讲师分类管理列表
 * */
export const queryTeacherCataList = (params) =>
  post('/api/manage/v1/teacher/queryTeacherCataList', params)
/**
 *  讲师分类创建人
 * */
export const getCreatorList = (params) => get('/api/manage/v1/teacher/getCreatorList', params)
/**
 *  讲师分类停用启用
 * */
export const updateStatus = (params) => post('/api/manage/v1/teacher/catalog/updateStatus', params)
