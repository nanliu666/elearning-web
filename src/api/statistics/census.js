import { get, post } from '@/router/axios'

/**
 * 查询培训协议签订情况
 * */
export const getTrainAgreement = (params) => get('/api/manage/v1/count/trainAgreement/list', params)

/**
 * 查询培训协议签订情况----导出
 * */
export const exportTrainAgreement = (params) =>
  get('/api/manage/v1/count/trainAgreement/export', params, { responseType: 'blob' })

/**
 * 查询教育经费统计
 * */
export const getEductionBudget = (params) => get('/api/manage/v1/count/eductionBudget/list', params)

/**
 * 教育经费统计-导出
 * */
export const exportEductionBudget = (params) =>
  get('/api/manage/v1/count/eductionBudget/export', params, { responseType: 'blob' })

/**
 * 查询积分明细
 * */
export const getScord = (params) => get('/api/manage/v1/count/scord/detail', params)
/**
 * 个人积分统计-导出
 * */
export const exportOverview = (params) =>
  get('/api/manage/v1/count/scord/overview/export', params, { responseType: 'blob' })

/**
 * 查询个人积分统计
 * */
export const getOverview = (params) => get('/api/manage/v1/count/scord/overview', params)
/**
 * 积分明细-导出
 * */
export const exportScordDetail = (params) =>
  get('/api/manage/v1/count/scord/detail/export', params, { responseType: 'blob' })

/**
 * 查询外购培训统计
 * */
export const getTrainOutbuy = (params) => get('/api/manage/v1/count/trainOutbuy/list', params)
/**
 * 外购培训统计   -导出
 * */
export const exportTrainOutbuy = (params) =>
  get('/api/manage/v1/count/trainOutbuy/export', params, { responseType: 'blob' })

/**
 * 查询考试参加明细
 * */
export const getExam = (params) => get('/api/manage/v1/count/exam/detail', params)

/**
 * 查询考试总览统计
 * */
export const getExamOverview = (params) => get('/api/manage/v1/count/exam/overview', params)

/**
 * 考试参加明细-导出
 * */
export const exportExamdetail = (params) =>
  get('/api/manage/v1/count/exam/detail/export', params, { responseType: 'blob' })

/**
 * 考试总览统计-导出
 * */
export const exportExamoverview = (params) =>
  get('/api/manage/v1/count/exam/overview/export', params, { responseType: 'blob' })

/**
 * 查询个人学习情况
 * */
export const getStudyUser = (params) => get('/api/manage/v1/count/study/user/list', params)

/**
 * 个人学习情况-导出
 * */
export const exportStudyUser = (params) =>
  get('/api/manage/v1/count/study/user/export', params, { responseType: 'blob' })

/**
 * 查询知识库学习明细
 * */
export const getKnowledgeDetail = (params) => get('/margin/v1/count/knowledge/detail', params)

/**
 * 查询知识库总览统计
 * */
export const getKnowledgeOverview = (params) => get('/margin/v1/count/knowledge/overview', params)

/**
 * 查询直播总览统计
 * */
export const getLiveOverview = (params) => get('/margin/v1/count/live/overview', params)

/**
 * 查询直播考试统计
 * */
export const getLiveExam = (params) => get('/margin/v1/count/live/exam', params)

/**
 * 查询直播参加明细
 * */
export const getLiveDetail = (params) => get('/margin/v1/count/live/detail', params)

/**
 * 查询线上选修总览统计
 * */
export const getElectiveOverview = (params) => get('/margin/v1/count/elective/overview', params)

/**
 * 查询线上选修学习明细
 * */
export const getElectiveDetail = (params) => get('/margin/v1/count/elective/detail', params)

/**
 * 查询线上必修总览统计
 * */
export const getCompulsoryOverview = (params) => get('/margin/v1/count/compulsory/overview', params)

/**
 * 查询线上必修考试统计
 * */
export const getCompulsoryExam = (params) => get('/margin/v1/count/compulsory/exam', params)

/**
 * 查询线上必修学习明细
 * */
export const getCompulsoryDetail = (params) => get('/margin/v1/count/compulsory/detail', params)

/**
 * 查询培训总览统计
 * */
export const getTrainOveriew = (params) => get('/margin/v1/count/train/overview', params)

/**
 * 查询培训课程统计
 * */
export const getTrainCourse = (params) => get('/margin/v1/count/train/course', params)
/**
 * 查询培训考试统计
 * */
export const getTrainExam = (params) => get('/margin/v1/count/train/exam', params)

/**
 * 查询参培人员明细
 * */
export const getTrainTrainersdetail = (params) =>
  get('/margin/v1/count/train/trainersdetail', params)

/**
 * 查询部门学习统计
 * */
export const getStudyList = (params) => get('/api/manage/v1/count/study/dept/list', params)

/**
 * 查询部门学习统计-导出
 * */
export const exportStudyLsit = (params) =>
  get('/api/manage/v1/count/study/dept/export', params, { responseType: 'blob' })

/**
 * 查询部门学习趋势统计
 * */
export const getStudyDaily = (params) => get('/api/manage/v1/count/study/dept/daily', params)

/**
 * 查询部门学习趋势统计-导出
 * */
export const exportStudyDaily = (params) =>
  get('/api/manage/v1/count/study/dept/daily/export', params, { responseType: 'blob' })

/**
 * 查询考试批次
 * */
export const getExamBatch = (params) => post('/api/manage/v1/exam/arrange/examBatchList', params)

/**
 * 查询考试列表
 * */
export const getExamList = (params) => get('/api/manage/v1/count/exam/listByName', params)

/**
 * 查询知识库总览统计-导出
 * */
export const getKnowledgeOverviewExport = (params) =>
  get('/margin/v1/count/knowledge/overview/export', params, { responseType: 'blob' })

/**
 * 查询知识库学习明细-导出
 * */
export const getKnowledgeDetailExport = (params) =>
  get('/margin/v1/count/knowledge/detail/export', params, { responseType: 'blob' })

/**
 * 查询直播总览统计-导出
 * */
export const exportLiveOverview = (params) =>
  get('/margin/v1/count/live/overview/export', params, { responseType: 'blob' })

/**
 * 查询直播考试统计-导出
 * */
export const exportLiveExam = (params) =>
  get('/margin/v1/count/live/exam/export', params, { responseType: 'blob' })

/**
 * 查询知识库学习明细-导出
 * */
export const exportLiveDetail = (params) =>
  get('/margin/v1/count/live/detail/export', params, { responseType: 'blob' })

/**
 * 查询线上选修总览统计-导出
 * */
export const exportElectiveOverview = (params) =>
  get('/margin/v1/count/elective/overview/export', params, { responseType: 'blob' })

/**
 * 查询线上必修总览统计-导出
 * */
export const exportElectiveDetail = (params) =>
  get('/margin/v1/count/elective/detail/export', params, { responseType: 'blob' })

/**
 * 查询线上选修总览统计-导出
 * */
export const exportCompulsoryOverview = (params) =>
  get('/margin/v1/count/compulsory/overview/export', params, { responseType: 'blob' })

/**
 * 查询线上必修考试统计-导出
 * */
export const exportCompulsoryExam = (params) =>
  get('/margin/v1/count/compulsory/exam/export', params, { responseType: 'blob' })

/**
 * 查询线上必修学习明细-导出
 * */
export const exportCompulsoryDetail = (params) =>
  get('/margin/v1/count/compulsory/detail/export', params, { responseType: 'blob' })

/**
 * 查询培训总览统计-导出
 * */
export const exportTrainOverview = (params) =>
  get('/margin/v1/count/train/overview/export', params, { responseType: 'blob' })
/**
 * 查询培训课程统计-导出
 * */
export const exportTrainCourse = (params) =>
  get('/margin/v1/count/train/course/export', params, { responseType: 'blob' })
/**
 * 查询培训考试统计-导出
 * */
export const exportTrainExam = (params) =>
  get('/margin/v1/count/train/exam/export', params, { responseType: 'blob' })
/**
 * 查询参培人员明细-导出
 * */
export const exportTrainTrainersdetail = (params) =>
  get('/margin/v1/count/train/trainersdetail/export', params, { responseType: 'blob' })

/**
 * 查询培训计划
 * */
export const getTrainPlan = (params) => get('/margin/v1/count/train/getTrainPlan', params)

/**
 * 个人课程明细
 * */
export const getCourseDetails = (params) => get('/manage/v1/count/course/user/record', params)

/**
 * 个人课程明细-导出
 * */
export const exportCourseDetails = (params) =>
  get('/manage/v1/count/course/user/export', params, { responseType: 'blob' })

/**
 * 未参加考试明细
 * */
export const getNotJoinDetail = (params) => get('/manage/v1/count/exam/notJoin/detail', params)

/**
 * 未参加考试明细-导出
 * */
export const exportNotJoinDetail = (params) =>
  get('/manage/v1/count/exam/notJoin/export', params, { responseType: 'blob' })

/**
 * 考试活动题目统计
 * */
export const getQuestionList = (params) => get('/manage/v1/count/exam/question/list', params)

/**
 * 考试活动题目统计-导出
 * */
export const exportQuestionList = (params) =>
  get('/manage/v1/count/exam/question/export', params, { responseType: 'blob' })
