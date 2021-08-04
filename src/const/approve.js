export const categoryMap = {
  '1': '课程审批',
  '2': '外训报名',
  '3': '培训需求',
  '4': '培训请假',
  '5': '外派培训',
  '6': '在职读博',
  '7': '讲师认证',
  '8': '导师认证',
  '9': '课程开发',
  '10': '外购培训',
  '11': '一点分享',
  '12': '课程使用',
  '13': '培训计划',
  '14': '创建用户',
  '15': '编辑用户'
}
export const baseDictionaries = {
  // formKey 对应的类型字典
  CourseApplyInfo: 'courseDetail', //课程审批
  TrainOuterApplyJoin: 'applyOutsideTrainingDet', //外训报名申请
  applyTrainingNeeds: 'applyTrainingNeedsDet', //培训需求申请
  trainLeaveApply: 'applyLeaveDet', //培训请假申请
  applyTrainingOuters: 'applyOutsideTrainBookbuildingDet', //外派培训申请
  applyDoctorStudy: 'applyStudyDoctorateDet', //在职读博申请
  applyTeacherAuth: 'applyTeacherIdentificationDet', //讲师认证申请
  tutorAuth: 'applyTutorAuthDet', //导师认证申请
  ApplyCourseDev: 'applyCourseDevDet', //课程开发申请
  applyTrainingOuterBuy: 'applyTrainingOuterBuyDet', //外购培训申请
  CourseApplication: 'courseDetail', //-制度清单-课程清单-课程使用申请
  applyKnowledgeShare: 'applyKnowledgeShare', //一点分享
  trainPlan: 'trainPlanDet', // 培训计划
  updateUserAudit: 'userAudit', //用户审批  更新
  addUserAudit: 'userAudit' //创建用户审批
}
export const baseFormKey = {
  // formKey 对应的类型字典
  CourseApplyInfo: '课程审批', //课程审批
  TrainOuterApplyJoin: '外训报名申请', //外训报名申请
  applyTrainingNeeds: '培训需求申请', //培训需求申请
  trainLeaveApply: '培训请假申请', //培训请假申请
  applyTrainingOuters: '外派培训申请', //外派培训申请
  applyDoctorStudy: '在职读博申请', //在职读博申请
  applyTeacherAuth: '讲师认证申请', //讲师认证申请
  tutorAuth: '导师认证申请', //导师认证申请
  ApplyCourseDev: '课程开发申请', //课程开发申请
  applyTrainingOuterBuy: '外购培训申请', //外购培训申请
  CourseApplication: '课程使用申请', //-制度清单-课程清单-课程使用申请
  applyKnowledgeShare: '一点分享申请', //一点分享
  trainPlan: '培训计划', // 培训计划
  updateUserAudit: '编辑用户', //编辑用户审批
  addUserAudit: '创建用户'  // 创建用户审批
}
export const categoryOptions = [
  {
    label: '课程审批',
    value: '1'
  },
  // {
  //   label: '外训报名申请',
  //   value: '2'
  // },
  {
    label: '培训需求申请',
    value: '3'
  },
  {
    label: '培训请假申请',
    value: '4'
  },
  // {
  //   label: '外派培训申请',
  //   value: '5'
  // },
  // {
  //   label: '在职读博申请',
  //   value: '6'
  // },
  {
    label: '讲师认证申请',
    value: '7'
  },
  {
    label: '导师认证申请',
    value: '8'
  },
  {
    label: '课程开发申请',
    value: '9'
  },
  // {
  //   label: '外购培训申请',
  //   value: '10'
  // },
  {
    label: '一点分享申请',
    value: '11'
  },
  {
    label: '课程使用申请',
    value: '12'
  },
  {
    label: '培训计划',
    value: '13'
  },
  {
    label: '创建用户',
    value: '14'
  },
  {
    label: '编辑用户',
    value: '15'
  }
]
export const formKeyMap = {
  CourseApplyInfo: '课程审批',
  ApplyCourseDev: '课程开发申请'
}
export const apprStatusCN = {
  Approve: '审批中',
  Pass: '已通过',
  Reject: '已拒绝',
  Cancel: '已撤回'
}
export const STATUS_DICTS = [
  {
    dictKey: 'Approve',
    dictValue: '审批中'
  },
  {
    dictKey: 'Pass',
    dictValue: '已通过'
  },
  {
    dictKey: 'Reject',
    dictValue: '已拒绝'
  },
  {
    dictKey: 'Cancel',
    dictValue: '已撤回'
  }
]
export const STATUS_TO_TEXT = {
  Approve: {
    text: '审批中',
    color: '#6AAFFF',
    backgroundColor: '#EDF8FF'
  },
  Pass: {
    text: '已通过',
    color: '#7AD683',
    backgroundColor: '#F0FFF0'
  },
  Reject: {
    text: '已拒绝',
    color: '#FF8B8A',
    backgroundColor: '#FFF2F1'
  },
  Corvidae: {
    text: '待完善',
    color: '#FFD122',
    backgroundColor: '#FFFBE6'
  },
  Cancel: {
    text: '已撤回',
    color: '#718199',
    backgroundColor: '#F2F5F7'
  }
}
