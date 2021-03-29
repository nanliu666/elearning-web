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
        delFlag: 1,
        score: '84',
        sysRuleId: '5640856744317372',
        createTime: '2020-12-02 14:13:32',
        dayLimit: '每日上限',
        sysRuleSource: '系统规则来源名称',
        ruleState: '积分规则说明',
        creatorId: '1857747990264664',
        stuName: '积分规则名称',
        id: '6907175156130421',
        status: 1,
        updateTime: '2020-12-03 17:20:35'
      }
    ]
  }
}
const sysInfo = {
  ...normalData,
  response: [
    {
      id: '5640856744317372',
      sysRuleSource: '系统规则名称',
      ruleState: '暂无规则说明',
      createTime: '2020-12-01 17:17:09',
      updateTime: '2020-12-01 17:18:11',
      status: 1,
      creatorId: '5650119966578100'
    }
  ]
}
const listScoreDetails = {
  ...normalData,
  response: {
    totalNum: 10,
    totalPage: 1,
    list: [
      {
        score: '分值',
        createTime: '2020-12-03 14:15:36',
        userTd: '1333945383927181300',
        sysRule: '系统规则来源',
        name: '用户名字',
        stuName: '积分规则名称',
        pid: '1331842528187191300',
        id: '积分明细ID',
        scoreRuleId: '1333750525227774000',
        dept: '部门',
        code: 'A01A02A07',
        updateTime: '2020-12-03 14:15:36',
        userStatus: 1
      }
    ]
  }
}

export default ({ mock }) => {
  if (!mock) return
  Mock.mock(new RegExp('/manage/v1/listStudentRules' + '.*'), 'post', () => {
    return info
  })
  Mock.mock(new RegExp('/manage/v1/startAndStopStudentsRulus' + '.*'), 'post', () => {
    return normalData
  })
  Mock.mock(new RegExp('/manage/v1/deleteStudentsRulus' + '.*'), 'post', () => {
    return normalData
  })
  Mock.mock(new RegExp('/manage/v1/addStudentsRulus' + '.*'), 'post', () => {
    return normalData
  })
  Mock.mock(new RegExp('/manage/v1/editSysRulus' + '.*'), 'post', () => {
    return normalData
  })
  Mock.mock(new RegExp('/manage/v1/listSysRulus' + '.*'), 'post', () => {
    return sysInfo
  })
  Mock.mock(new RegExp('/manage/v1/listScoreDetails' + '.*'), 'post', () => {
    return listScoreDetails
  })
  Mock.mock(new RegExp('/manage/v1/deleteScoreDetails' + '.*'), 'post', () => {
    return normalData
  })
  Mock.mock(new RegExp('/manage/v1/editStudentsRulus' + '.*'), 'post', () => {
    return normalData
  })
}
