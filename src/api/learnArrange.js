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
    url: '/api/manage/v1/train/course/workFront',
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
    url: '/api/blade-manage/v1/study/plan/course/workFront',
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

export const saveCourseLinkedStudentOrTeacher = (data) => {
  return request({
    url: '/api/manage/v1/web/coursecenter/coursework/saveCourseLinkedStudentOrTeacher',
    method: 'post',
    data
  })
}

export const downloadZip = (c) => {
  const config = Object.assign(
    {
      url: '/api/common/oss/download/zip',
      method: 'get'
    },
    c
  )
  return request(config)
}

export const offlineSignExcel = (params) => {
  return request({
    url: '/api/manage/v1/train/offline/sign/excel',
    method: 'get',
    params
  })
}

//查询线上必修课程情况
export const queryStudyCourseList = (params) => {
  return request({
    url: '/blade-manage/v1/study/plan/queryStudyCourseList',
    method: 'get',
    params
  })
}

//查询线上必修考试情况  
export const queryStudyExamList = (params) => {
  return request({
    url: '/blade-manage/v1/study/plan/queryStudyExamList',
    method: 'get',
    params
  })
}

//查询线上必修考试详情列表
export const getExamineeList = (params) => {
  return request({
    url: '/api/manage/v1/web/teacher/getExamineeList',
    method: 'get',
    params
  })
}

//查询线上必修考试详情情况    
export const getExamDetail = (params) => {
  return request({
    url: '/api/manage/v1/web/teacher/getExamDetail',
    method: 'get',
    params
  })
}

