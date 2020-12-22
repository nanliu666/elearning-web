/* eslint-disable no-unused-vars */
import { post, get } from '@/router/axios'
/**
 * 获取手工评卷列表
 */
export const listManualEvaluation = (params) => post('/manage/v1/listManualEvaluation', params)
/**
 * 获取逐人评卷列表
 */
export const listManualEvaluationOnce = (params) =>
  post('/manage/v1/listManualEvaluationOnce', params)
/**
 * 逐人评卷列表表头的评卷数量统计
 */
export const listManualEvaluationOnceCount = (params) =>
  post('/manage/v1/listManualEvaluationOnceCount', params)
