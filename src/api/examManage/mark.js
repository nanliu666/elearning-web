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

/**
 * 获取考生答卷详情基本信息（头部信息概览，客/主观题题目数量以及分数展示）
 */
export const getExamineePaperDetail = (params) => get('/manage/v1/getExamineePaperDetail', params)

/**
 * 获取逐人评卷考生答卷详情
 */
export const getExamineePaperDetailist = (params) =>
  get('/manage/v1/getExamineePaperDetailist', params)
/**
 * 逐人评卷提交
 */
export const postSubmitByOne = (params) => post('/manage/v1/actionExamineePaperIng', params)
