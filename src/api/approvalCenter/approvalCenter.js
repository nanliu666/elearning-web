import {
  get,
  post
} from '@/router/axios'
/**
 * 待我审批-列表
 * */
export const waitApproveList = (params) => get('/api/appr/v2/appr/wait/approve/list', params)
/**
 * 我已审批列表
 * */
export const hasApproveList = (params) => get('/api/appr/v2/appr/has/approve/list', params)
/**
 * 我发起的审批列表
 * */
export const myApproveList = (params) => get('/api/appr/v2/appr/my/approve/list', params)
/**
 * 抄送我的审批列表
 * */
export const ccApproveList = (params) => get('/api/appr/v2/appr/cc/approve/list', params)
/**
 * 待我审批->详情编辑
 * @param {String} params.apprNo
 * */
export const detail = (params) => get('/api/appr/v2/appr/process/apply/detail', params)
/**
 * 流程节点审批记录（针对每个节点的审批记录）
 * @param {String} params.apprNo
 * */
export const record = (params) => get('/api/appr/v2/appr/apply/record', params)
/**
 * 催一下
 * @param {String} params.apprNo
 * @param {String} params.processInstanceId
 * */
export const urge = (params) => post('/api/appr/v2/appr/apply/urge', params)
/**
 * 同意审批
 * @param {String} params.userId
 * @param {String} params.taskId
 * @param {String} params.processInstanceId
 * @param {String} params.comment
 * */
export const pass = (params) => post('/api/appr/v2/appr/apply/pass', params)
/**
 * 课程审核列表(根据分类、状态来刷选)
 * @param {String} params.categoryId  分类id,比如课程是1
 * @param {String} params.status 审批状态：待审核Approve；已经审核Pass,Reject（多个用逗号隔开）
 * @param {String} params.pageNo
 * @param {String} params.pageSize
 * */
export const fulllist = (params) => get('/api/appr/v2/appr/approve/fulllist', params)
/**
 * 课程审核列表-撤回
 * @param {String} params.processInstanceId
 * */
export const cancel = (params) => get('/api/appr/v2/appr/approve/course/cancel', params)
