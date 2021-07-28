/*
 * @Description: 培训计划模块接口
 * @Version: 3.30
 * @Autor: Xie Mingwei
 * @Date: 2021-05-28 09:41:46
 * @LastEditors: Xie Mingwei
 * @LastEditTime: 2021-06-10 15:41:55
 */
import { get, post } from '@/router/axios'
const baseUrl = '/blade-margin/v1/trainPlan/' // 培训计划上报

// 培训计划上报
/**
 * @description: 培训计划列表
 * @param {*} pageSize:每页条数,pageNo:页数
 * @return {*}
 */
export const listTrainPlan = (params) => get(`${baseUrl}listTrainPlan`, params)

/**
 * @description: 删除培训计划
 * @param {*} planId
 * @return {*}
 */
export const deleteTrainPlan = (params) => post(`${baseUrl}deleteTrainPlan`, params)

/**
 * @description: 获取所有的子计划列表
 * @param {*}
 * @return {*}
 */
export const listTrainPlanDetail = (params) => get(`${baseUrl}listTrainPlanDetail`, params)

/**
 * @description: 获取培训计划子计划详情
 * @param {*} id
 * @return {*}
 */
export const getTrainPlanDetail = (params) => get(`${baseUrl}getTrainPlanDetail`, params)

/**
 * @description: 培训计划保存
 * @param {*}
 * @return {*}
 */
export const saveTrainPlan = (params) => post(`${baseUrl}save`, params)

/**
 * @description: excel导入培训子计划
 * @param {*}
 * @return {*}
 */
export const importTrainPlan = (params) => post(`${baseUrl}importTrainPlan`, params)

/**
 * @description: 撤回审核
 * @param {*} planId
 * @return {*}
 */
export const reCallTrainPlan = (params) => post(`${baseUrl}reCallTrainPlan`, params)

/**
 * @description: 获取培训计划详情
 * @param {*} planId
 * @return {*}
 */
export const getTrainPlan = (params) => get(`${baseUrl}getTrainPlan`, params)

/**
 * @description: 获取审批流培训计划详情
 * @param {*} planId
 * @return {*}
 */
export const getTrainPlanAppr = (params) => get(`${baseUrl}getTrainPlanAppr`, params)

/**
 * @description: 删除培训子计划
 * @param {*} detailId
 * @return {*}
 */
export const deleteDetail = (params) => post(`${baseUrl}deleteDetail`, params)

/**
 * @description: 删除预算
 * @param {*} budgetId
 * @return {*}
 */
export const deleteBudget = (params) => post(`${baseUrl}deleteBudget`, params)

/**
 * @description: 培训计划编辑
 * @param {*}
 * @return {*}
 */
export const updateTrainPlan = (params) => post(`${baseUrl}updateTrainPlan`, params)

/**
 * @description: 培训计划查看
 * @param {*} year,orgId,month,type
 * @return {*}
 */
export const trainPlanYearMap = (params) => get('/api/margin/v1/trainPlan/trainPlanYearMap', params)

/**
 * @description: 子计划关联培训
 * @param {*} planDetailId:子计划id,trainIds:选择的培训id集合,多个逗号拼接,relatedMonth:绑定月份:5
 * @return {*}
 */
export const saveTrainRel = (params) => post('/api/margin/v1/trainPlan/saveTrainRel', params)

/**
 * @description: 子计划关联培训取消
 * @param {*} id
 * @return {*}
 */
export const cancelTrainRel = (params) => get('/api/margin/v1/trainPlan/cancelTrainRel', params)

// 培训计划制定
/**
 * @description: 培训计划列表
 * @param {*} pageNo,pageSize
 * @return {*}
 */
export const trainPlanPreList = (params) =>
  get('/api/blade-margin/v1/trainPlanPre/listTrainPlan', params)

/**
 * @description: 删除培训计划
 * @param {*} planId
 * @return {*}
 */
export const deleteTrainPlanPre = (params) =>
  post('/api/blade-margin/v1/trainPlanPre/deleteTrainPlan', params)

/**
 * @description: 培训计划制定创建
 * @param {*}
 * @return {*}
 */
export const saveTrainPlanPre = (params) => post('/api/blade-margin/v1/trainPlanPre/save', params)

/**
 * @description: 删除培训子计划
 * @param {*} detailId
 * @return {*}
 */
export const deleteDetailPre = (params) =>
  post('/api/blade-margin/v1/trainPlan/deleteDetail', params)

/**
 * @description: 培训计划制定编辑
 * @param {*}
 * @return {*}
 */
export const updateTrainPlanPre = (params) =>
  post('/api/blade-margin/v1/trainPlanPre/updateTrainPlan', params)

/**
 * @description: 培训计划制定详情
 * @param {*} id
 * @return {*}
 */
export const getTrainPlanPre = (params) =>
  get('/api/blade-margin/v1/trainPlanPre/getTrainPlan', params)

/**
 * @description: 删除预算
 * @param {*} budgetId
 * @return {*}
 */
export const deleteBudgetPre = (params) =>
  post('/api/blade-margin/v1/trainPlanPre/deleteBudget', params)

/**
 * @description: 获取培训计划子计划详情
 * @param {*} id
 * @return {*}
 */
export const getTrainPlanPreDetail = (params) =>
  get('/api/blade-margin/v1/trainPlanPre/getTrainPlanDetail', params)

/**
 * @description: 改变培训计划状态为待删除
 * @param {*} planId
 * @return {*}
 */
export const changeStatusToDelete = (params) => post(`${baseUrl}changeStatusToDelete`, params)
