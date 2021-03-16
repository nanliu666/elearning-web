import request from '@/router/axios'
/**
 * 七牛云上传凭证获取接口
 * @param {Object} params - 不需要参数
 * */
export const queryStudyInfo = (params) => {
  return request({
    url: '/api/manage/v1/study/plan/queryStudyInfo',
    method: 'get',
    params
  })
}

export const queryCourseWork = (params) => {
  return request({
    url: '/api/manage/v1/train/course/work',
    method: 'get',
    params
  })
}

export const experience = (params) => {
  return request({
    url: '/api/manage/v1/train/learning/experience',
    method: 'get',
    params
  })
}

export const materials = (params) => {
  return request({
    url: '/api/manage/v1/train/report/materials',
    method: 'get',
    params
  })
}

export const queryStudyList = (params) => {
  return request({
    url: '/api/blade-manage/v1/study/plan/queryStudyList',
    method: 'get',
    params
  })
}

export const queryStudyPlanWork = (params) => {
  return request({
    url: '/api/blade-manage/v1/study/plan/course/work',
    method: 'get',
    params
  })
}

export const queryStudyPlanExperience = (params) => {
  return request({
    url: '/api/blade-manage/v1/study/plan/learning/experience',
    method: 'get',
    params
  })
}

export const queryStudyAllCorseList = (params) => {
  return request({
    url: '/api/blade-manage/v1/study/plan/queryStudyAllCorseList',
    method: 'get',
    params
  })
}

export const getQrcode = (params) => {
  return request({
    url: '/api/manage/v1/train/offline/qrcode',
    method: 'get',
    params
  })
}
