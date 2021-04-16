
import request from '@/router/axios'

export const queryPlanDetail = (params) => {
  return request({
    url: '/api/blade-margin/v1/asq/plan/detail',
    method: 'get',
    params
  })
}

export const question = (params) => {
  return request({
    url: '/api/margin/v1/asq/plan/detail/question',
    method: 'get',
    params
  })
}

export const students = (params) => {
  return request({
    url: '/api/blade-margin/v1/asq/plan/detail/students',
    method: 'get',
    params
  })
}

export const suspend = (data) => {
  return request({
    url: '/api/blade-margin/v1/cms/plan/suspend',
    method: 'put',
    data
  })
}

export const end = (data) => {
  return request({
    url: '/api/blade-margin/v1/cms/plan/finish',
    method: 'put',
    data
  })
}

export const start = (data) => {
  return request({
    url: '/api/blade-margin/v1/cms/plan/start',
    method: 'put',
    data
  })
}

export const save = (data) => {
  return request({
    url: '/api/blade-margin/v1/asq/plan/save',
    method: 'post',
    data
  })
}

export const update = (data) => {
  return request({
    url: '/api/blade-margin/v1/asq/plan/update',
    method: 'post',
    data
  })
}

export const saveQuery = (params) => {
  return request({
    url: '/api/blade-margin/v1/asq/plan/saveQuery',
    method: 'get',
    params
  })
}

export const querySubject = (params) => {
  return request({
    url: '/api/blade-margin/v1/asq/plan/querySubject',
    method: 'get',
    params
  })
}

export const queryQuestionnaireList = (data) => {
  return request({
    url: '/api/blade-margin/v1/QuestionnaireArrange/queryQuestionnaireList',
    method: 'post',
    data
  })
}

export const deleteQuestionnaire = (data) => {
  return request({
    url: '/api/blade-margin/v1/QuestionnaireArrange/deleteQuestionnaire',
    method: 'post',
    data
  })
}