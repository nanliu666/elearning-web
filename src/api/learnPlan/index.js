import { get } from '@/router/axios'

/**
 * 查询证书发放列表
 * @param {Object} params - 参数
 * */
export const getlearnPlanList = (params) => get('/api/blade-manage/v1/study/plan/queryPlan', params)
