import { get } from '@/router/axios'
/**
 * 待我审批-列表
 * */
export const waitApproveList = (params) => get('/api/v2/appr/wait/approve/list', params)
/**
 * 我已审批列表
 * */
export const hasApproveList = (params) => get('/api/appr/v2/appr/has/approve/list', params)
/**
 * 我已审批列表
 * */
export const myApproveList = (params) => get('/api/appr/v2/appr/my/approve/list', params)
/**
 * 抄送我的审批列表
 * */
export const ccApproveList = (params) => get('/api/appr/v2/appr/cc/approve/list', params)
