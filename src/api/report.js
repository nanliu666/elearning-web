import request from '@/router/axios'

export const systemDashboard = (params) => {
  return request({
    url: '/api/manage/v1/count/system/dashboard',
    method: 'get',
    params
  })
}

export const systemMember = (params) => {
  return request({
    url: '/api/manage/v1/count/system/member',
    method: 'get',
    params
  })
}

export const systemLogin = (params) => {
  return request({
    url: '/api/manage/v1/count/system/login',
    method: 'get',
    params
  })
}

export const studyCourse = (params) => {
  return request({
    url: '/api/manage/v1/count/study/course',
    method: 'get',
    params
  })
}

export const studyLive = (params) => {
  return request({
    url: '/api/manage/v1/count/study/live',
    method: 'get',
    params
  })
}

export const studyPlan = (params) => {
  return request({
    url: '/api/manage/v1/count/study/plan',
    method: 'get',
    params
  })
}

export const studyTrain = (params) => {
  return request({
    url: '/api/manage/v1/count/study/train',
    method: 'get',
    params
  })
}

export const getExam = (params) => {
  return request({
    url: '/api/manage/v1/count/study/exam',
    method: 'get',
    params
  })
}

export const analysis = (params) => {
  return request({
    url: '/api/manage/v1/count/analysis',
    method: 'get',
    params
  })
}
