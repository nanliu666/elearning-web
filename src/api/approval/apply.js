import { post, get } from '@/router/axios'

// 提交课程开发申请
export const applyAddCourse = (params) => post('/api/margin/v1/web/course/dev/apply/add', params)

// 提交课程开发申请
export const applyAddCourseDetail = (params) =>
  get('/api/margin/v1/web/course/dev/apply/detail', params)

// 培训需求申请提交
export const applyAddTrainingNeeds = (params) => post('/api/margin/v1/trainingNeeds/add', params)

// 培训请假申请
export const applyTrainLeave = (params) => post('/api/manage/v1/bizApply/trainLeaveApply', params)

// 培训请假申请详情
export const trainLeaveDetail = (params) => get('/api/manage/v1/bizApply/trainLeaveDetail', params)

// 培训申请下拉选项框列表查询
export const trainOptionList = (params) => get('/api/manage/v1/bizApply/trainOptionList', params)

// 外训报名
export const applyJoinOuterTrain = (params) =>
  post('/api/manage/v1/train/applyJoinOuterTrain', params)

// 查询培训详情
export const getTrainDetail = (params) => get('/api/manage/v1/train/getTrainDetail', params)

// 外训列表
export const outerTrainList = (params) => get('/api/manage/v1/train/outerTrainList', params)

// 外训报名申请详情
export const applyJoinOuterTrainDetail = (params) =>
  get('/api/manage/v1/train/applyJoinOuterTrain/get', params)

// 添加导师认证申请
export const applyTutor = (params) => post('/api/margin/v1/web/tutor/auth/apply/add', params)

// 查询导师认证申请
export const applyTutorDetail = (params) =>
  get('/api/margin/v1/web/tutor/auth/apply/detail', params)

// 在职读博申请提交
export const doctorStudyApply = (params) => post('/api/margin/v1/doctorStudyApply/add', params)

// 在职读博申请提交
export const doctorStudyApplyDetails = (params) =>
  get('api/margin//v1/doctorStudyApply/get', params)

/**
 * 查询添加用户
 * @param {Object} courseId - 参数
 * */
export const queryUserList = (params) => get('/api/user/v1/user/work/list', params)

// 外购培训申请提交
export const trainingOuterBuy = (params) => post('/api/margin//v1/trainingOuterBuy/add', params)

// 外购培训申请审批详情
export const trainingOuterBuyDetails = (params) =>
  get('/api/margin//v1/trainingOuterBuy/get', params)

// 讲师认证申请提交
export const teacherAuthApply = (params) => post('/api/margin//v1/teacherAuthApply/add', params)

// 查看讲师申请者历任讲师基本信息
export const teacherAuthApplyRecord = (params) =>
  get('/api/margin/v1/teacherAuthApply/getHis', params)

// 讲师认证提交申请的审批详情
export const teacherAuthApplyDetail = (params) => get('/api/margin/v1/teacherAuthApply/get', params)

// 外派培训申请提交
export const trainingOuter = (params) => post('/api/margin/v1/trainingOuter/add', params)

// 外派培训申请的审批详情
export const trainingOuterDetails = (params) => get('/api/margin//v1/trainingOuter/get', params)
