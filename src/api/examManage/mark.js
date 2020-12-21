/* eslint-disable no-unused-vars */
import { del, get, post, put } from '@/router/axios'
/**
 * 获取手工评卷列表
 */
export const listManualEvaluation = (params) => post('/manage/v1/listManualEvaluation', params)
/**
 * 获取逐人评卷列表
 */
export const listManualEvaluationOnce = (params) =>
  post('/manage/v1/listManualEvaluationOnce', params)
