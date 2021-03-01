/* eslint-disable no-unused-vars */
import { del, get, post, put } from '@/router/axios'
/**
 * 教室名称是否已存在
 * roomName 教室名称
 * id  教室主键，编辑状态下必传，创建状态下不需要
 */
export const checkClassroomName = (params) => post('/manage/v1/classroom/updateClassroom', params)
/**
 * 创建教室
 */
export const addClassroom = (params) => get('/manage/v1/classroom/addClassroom', params)
/**
 * 查询教室详情
 */
export const queryClassroomInfo = (params) => get('/manage/v1/classroom/queryClassroomInfo', params)
/**
 * 编辑教室
 */
export const editClassroom = (params) => get('/manage/v1/classroom/updateClassroom', params)
/**
 * 权限配置-保存配置
 */
export const addCategoryOrgRelation = (params) =>
  get('/manage/v1/classroom/addCategoryOrgRelation', params)
/**
 * 权限配置-组织架构列表
 */
export const queryCategoryOrgList = (params) =>
  get('/manage/v1/classroom/queryCategoryOrgList', params)
/**
 * 修改教室状态
 */
export const updateClassroomStatus = (params) =>
  get('/manage/v1/classroom/updateClassroomStatus', params)
/**
 * 删除教室
 */
export const deleteClassroom = (params) => get('/manage/v1/classroom/deleteClassroom', params)
/**
 * 查询教室管理列表
 */
export const queryClassroom = (params) => get('/manage/v1/classroom/queryClassroom', params)
