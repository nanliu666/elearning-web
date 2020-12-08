import Mock from 'mockjs'

const normalData = {
  code: 200,
  success: true,
  msg: '操作成功',
  response: ''
}
const info = {
  ...normalData,
  response: {
    totalNum: 10,
    totalPage: 1,
    data: [
      {
        id: '1236546464761',
        examName: 'EHS应知应会全员考试',
        effectiveTime: '2020-10-10 21:41:15  ~  2020-10-11 21:14:15',
        paperType: '手工试卷',
        peopleNumber: '100',
        paperMaker: '张勋'
      },
      {
        id: '12365464647612',
        examName: 'EHS应知应会全员考试',
        effectiveTime: '2020-10-10 21:41:15  ~  2020-10-11 21:14:15',
        paperType: '手工试卷',
        peopleNumber: '100',
        paperMaker: '张勋'
      },
      {
        id: '123654646476124',
        examName: 'EHS应知应会全员考试',
        effectiveTime: '2020-10-10 21:41:15  ~  2020-10-11 21:14:15',
        paperType: '手工试卷',
        peopleNumber: '100',
        paperMaker: '张勋'
      }
    ]
  }
}

const data = {
  ...normalData,
  response: {
    totalNum: 10,
    totalPage: 1,
    data: [
      {
        id: '131654',
        examineeName: '高杰',
        phoneNum: '13234567890',
        orgName: '广州地域/OA自动化',
        examTime: '2020-10-10 21:41:15  ~  2020-10-11 21:14:15',
        answerTime: '60',
        score: '90',
        totalScore: '100',
        isPass: 1,
        status: 1
      },
      {
        id: '13165234',
        examineeName: '高杰',
        phoneNum: '13234567890',
        orgName: '广州地域/OA自动化',
        examTime: '2020-10-10 21:41:15  ~  2020-10-11 21:14:15',
        answerTime: '60',
        score: '90',
        totalScore: '100',
        isPass: 1,
        status: 1
      },
      {
        id: '13162354',
        examineeName: '高杰',
        phoneNum: '13234567890',
        orgName: '广州地域/OA自动化',
        examTime: '2020-10-10 21:41:15  ~  2020-10-11 21:14:15',
        answerTime: '60',
        score: '90',
        totalScore: '100',
        isPass: 1,
        status: 1
      }
    ]
  }
}
const testPaper = {
  ...normalData,
  response: {
    totalNum: 1,
    totalPage: 10,
    data: [
      {
        id: '1',
        name: '考试名称',
        status: '1',
        categoryId: 'Java技能培训/中级',
        type: 'manual',
        testNum: '关联考试数',
        founder: '创建人',
        effectiveTime: '2020-10-10 21:41:15'
      },
      {
        id: '2',
        name: '考试名称',
        status: '2',
        categoryId: 'Java技能培训/中级',
        type: 'random',
        testNum: '关联考试数',
        founder: '创建人',
        effectiveTime: '2020-10-10 21:41:15'
      },
      {
        id: '3',
        name: '考试名称',
        status: '1',
        categoryId: 'Java技能培训/中级',
        type: 'random',
        testNum: '关联考试数',
        founder: '创建人',
        effectiveTime: '2020-10-10 21:41:15'
      }
    ]
  }
}
export default ({ mock }) => {
  if (!mock) return
  Mock.mock(new RegExp('/api/grade/achievement' + '.*'), 'get', () => {
    return info
  })
  Mock.mock(new RegExp('/api/grade/examineeAchievement' + '.*'), 'get', () => {
    return data
  })
  Mock.mock(new RegExp('/api/grade/examineeAchievement/edit' + '.*'), 'put', () => {
    return normalData
  })
  Mock.mock(new RegExp('/api/grade/testPaperList' + '.*'), 'get', () => {
    return testPaper
  })
  Mock.mock(new RegExp('/api/grade/testPaperList/delete' + '.*'), 'delete', () => {
    return testPaper
  })
  Mock.mock(new RegExp('/api/grade/testPaper' + '.*'), 'post', () => {
    return normalData
  })
  Mock.mock(new RegExp('/api/grade/testPaper' + '.*'), 'put', () => {
    return normalData
  })
  Mock.mock(new RegExp('/api/grade/testPaper' + '.*'), 'get', () => {
    return normalData
  })
}
