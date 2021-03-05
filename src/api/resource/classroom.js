/* eslint-disable no-unused-vars */
import { del, get, post, put } from '@/router/axios'
import qs from 'qs'
/**
 * 教室名称是否已存在
 * roomName 教室名称
 * id  教室主键，编辑状态下必传，创建状态下不需要
 */
export const checkClassroomName = (params) => post('/manage/v1/classroom/roomNameIsExit', params)
/**
 * 创建或编辑资源下的分类列表
 */
export const queryCategoryOrgList = (params) =>
  post('/manage/v1/classroom/queryCategoryOrgList', params)
/**
 * 创建教室
 */
export const addClassroom = (params) => post('/manage/v1/classroom/addClassroom', params)
/**
 * 查询教室详情
 */
export const queryClassroomInfo = (params) => get('/manage/v1/classroom/queryClassroomInfo', params)
/**
 * 编辑教室
 */
export const editClassroom = (params) => post('/manage/v1/classroom/updateClassroom', params)
/**
 * 权限配置-保存配置
 */
export const addCategoryOrgRelation = (params) =>
  get('/manage/v1/classroom/addCategoryOrgRelation', params)
/**
 * 修改教室状态
 */
export const updateClassroomStatus = (params) =>
  put(`/manage/v1/classroom/updateClassroomStatus?${qs.stringify(params)}`)
/**
 * 删除教室
 */
export const deleteClassroom = (params) => del('/manage/v1/classroom/deleteClassroom', params)
/**
 * 查询教室管理列表
 */
export const queryClassroom = (params) => get('/manage/v1/classroom/queryClassroomList', params)
/**
 * 查询预约列表
 */
export const getBookList = (params) => get('/manage/v1/classroom/book/list', params)
