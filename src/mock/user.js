import Mock from 'mockjs'

const RESPONSE_COMMON = {
  resCode: 200,
  resMsg: 'success(mock)'
}

export default ({ mock }) => {
  if (!mock) return
  Mock.mock(new RegExp('/api/org/v1/organization' + '.*'), 'get', () => {
    return {
      resCode: 0,
      resMsg: '',
      response: [
        {
          orgId: '0',
          orgName: '@word(3, 5)',
          orgType: 'Enterprise',
          orgCode: '@string( 2, 10)',
          userId: '@string( 2, 10)',
          workNo: '@string( 2, 10)',
          userName: '@name',
          jobNum: 1,
          userNum: 2,
          workNum: 3,
          sort: 1,
          remark: '@sentence(3, 5)',
          children: [
            {
              orgId: '8J&3',
              orgName: '@word(3, 5)',
              orgType: 'Company',
              orgCode: '8i9',
              userId: '@string( 2, 10)',
              workNo: '@string( 2, 10)',
              userName: '@name',
              jobNum: 1,
              userNum: 1,
              workNum: 1,
              sort: 2,
              remark: '@sentence(3, 5)',
              children: [
                {
                  orgId: '@string( 2, 10)',
                  orgName: '@word(3, 5)',
                  orgType: 'Department',
                  orgCode: '@string( 2, 10)',
                  userId: '@string( 2, 10)',
                  workNo: '@string( 2, 10)',
                  userName: '@name',
                  jobNum: 1,
                  userNum: 2,
                  workNum: 3,
                  sort: 3,
                  remark: '@sentence(3, 5)',
                  children: [
                    {
                      orgId: '@string( 2, 10)',
                      orgName: '@string(3, 5)',
                      orgType: 'Group',
                      orgCode: '@string( 2, 10)',
                      userId: '@string( 2, 10)',
                      workNo: '@string( 2, 10)',
                      userName: '@name',
                      jobNum: 1,
                      userNum: 2,
                      workNum: 3,
                      sort: 4,
                      remark: '@sentence(3, 5)',
                      children: []
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  })

  // 获取子组织架构和直属员工接口
  Mock.mock(new RegExp('/org/v1/org/user/child' + '(\\?.*)?$'), 'get', (req) => {
    const response = {
      orgs: _.times(5, () =>
        Mock.mock({
          id: '@id()',
          name: '@cname()组织',
          workNum: _.random(100),
          'type|+1': ['Enterprise', 'Company', 'Department', 'Group']
        })
      ),
      users: _.times(5, () =>
        Mock.mock({
          userId: '@id()',
          workNum: _.random(10000),
          name: '@cname()',
          avatarUrl: '@image()',
          sex: _.random()
        })
      )
    }
    window.console.debug(`${req.type} ${req.url}`, { req, response })
    return _.defaults({ response }, RESPONSE_COMMON)
  })

  // 获取子业务架构和直属员工接口
  Mock.mock(new RegExp('/org/v1/biz/org/user/child' + '(\\?.*)?$'), 'get', (req) => {
    const response = {
      bizs: _.times(5, () =>
        Mock.mock({
          id: '@id()',
          name: '@cname()业务部',
          workNum: _.random(100),
          'type|+1': ['Enterprise', 'Product', 'Department', 'PDU']
        })
      ),
      users: _.times(5, () =>
        Mock.mock({
          userId: '@id()',
          workNum: _.random(10000),
          name: '@cname()',
          avatarUrl: '@image()',
          sex: _.random()
        })
      )
    }
    window.console.debug(`${req.type} ${req.url}`, { req, response })
    return _.defaults({ response }, RESPONSE_COMMON)
  })

  //获取用户标签
  Mock.mock(new RegExp('/api/user/v1/user/tag/define' + '.*'), 'get', () => {
    let list = []
    for (let i = 0; i < 5; i++) {
      list.push(
        Mock.mock({
          id: '@increment',
          name: '@cname',
          'userNum|0-100': 0,
          createTime: '@date',
          updateTime: '@date'
        })
      )
    }
    return {
      resCode: 200,
      resMsg: '描述',
      response: {
        totalNum: 5,
        totalPage: 5,
        data: list
      }
    }
  })
}
