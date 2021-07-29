import { get, post } from '@/router/axios'

export const cancelKnowledgeSystem = (data) =>
  post('/api/blade-resource/v1/live/plan/cancelKnowledgeSystem', data)

export const removeKnowledgeSystem = (params) =>
  get('/api/manage/v1/knowledge/remove/knowledgeSystem', params)

export const queryCategoryDetail = (params) =>
  get('/api/blade-resource/v1/category/queryCategoryDetail', params)

export const getKnowledgeList = (data) => post('/api/manage/v1/knowledge/system/list', data)

export const getKnowledgeCatalogList = (params) =>
  get('/api/manage/v1/knowledge/catalog/list', params)

export const getCourseCatalogList = (params) => get('/api/manage/v1/course/getCatalog', params)

export const queryPlan = (params) => get('/api/manage/v1/study/plan/queryPlan', params)

export const getCourseList = (params) => get('/api/manage/v1/course/getCourseList', params)

export const getQuestionList = (params) => get('/api/manage/v1/question/list', params)

export const commonCancelRelation = (data) =>
  post('/api/blade-resource/v1/category/cancelRelation', data)

export const cancelKnowledgeRel = (data) =>
  post('/api/blade-manage/v1/question/cancelKnowledgeRel', data)

export const trainCancelRelation = (data) => post('/api/manage/v1/train/cancelRelation', data)
