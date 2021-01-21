export default {
  sort: 3,
  menuId: '1259467456745245678718',
  menuName: '考评管理',
  menuType: 'Dir', // 菜单类型，Dir：目录，Menu：菜单；Button：按钮
  isOwn: 1, // 是否拥有 0：否，1：是
  isShow: 1, // 是否显示在菜单栏 0：否，1：是
  isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
  code: 'system',
  alias: 'system',
  path: '',
  icon: 'iconfont iconicon_setting',
  dataPrivileges: [
    {
      dataId: '1',
      scopeName: '个人可见',
      isOwn: 1
    }
  ],
  children: [
    {
      menuId: '12590734567456735058',
      menuName: '分类管理',
      menuType: 'Menu',
      isOwn: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      isShow: 1,
      code: 'org_user',
      alias: 'user',
      path: '/examManagement/category/management',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: [
        {
          menuType: 'Button',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/examManagement/category/management/add'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/examManagement/category/management/disable'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/examManagement/category/management/limit'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/examManagement/category/management/others'
        }
      ]
    },
    {
      menuId: '125907345334589',
      menuName: '试题创建',
      menuType: 'Menu',
      isOwn: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      isShow: 0,
      path: '/examManagement/question/questionEdit',
      code: 'questionEdit',
      alias: 'questionEdit',
      icon: 'iconfont iconicon_boss'
    },
    {
      menuId: '125907334589',
      menuName: '试题导入',
      menuType: 'Menu',
      isOwn: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      isShow: 0,
      path: '/examManagement/question/questionImport',
      code: 'questionImport',
      alias: 'questionImport',
      icon: 'iconfont iconicon_boss'
    },
    {
      menuId: '125907345674589',
      menuName: '题库管理',
      menuType: 'Menu',
      isOwn: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      isShow: 1,
      path: '/examManagement/question/questionList',
      code: 'questionList',
      alias: 'questionList',
      icon: 'iconfont iconicon_boss',
      children: [
        {
          menuType: 'Button',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/examManagement/question/questionList/delete'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/examManagement/question/questionList/edit'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/examManagement/question/questionList/deleteAll'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/examManagement/question/questionList/add'
        }
      ]
    },

    {
      menuId: '1567454768323454620582323',
      menuName: '试卷管理',
      menuType: 'Menu',
      isOwn: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      isShow: 1,
      code: 'org_user',
      alias: 'user',
      path: '/examManagement/testPaper/testPaper',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: [
        {
          menuType: 'Button',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/examManagement/testPaper/testPaper/copy'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/examManagement/testPaper/testPaper/delete'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/examManagement/testPaper/testPaper/edit'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/examManagement/testPaper/testPaper/deleteAll'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/examManagement/testPaper/testPaper/add'
        }
      ]
    },
    {
      menuId: '1567454768323454620582323',
      menuName: '随机试卷',
      menuType: 'Menu',
      isOwn: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      isShow: 0,
      code: 'org_user',
      alias: 'user',
      path: '/examManagement/testPaper/randomTestPaper',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: []
    },
    {
      menuId: '1567454768323454620582323',
      menuName: '新建手工试卷',
      menuType: 'Menu',
      isOwn: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      isShow: 0,
      code: 'org_user',
      alias: 'user',
      path: '/examManagement/testPaper/handmadeTestPaper',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: []
    },
    {
      menuId: '12590567456745635058',
      menuName: '考试安排',
      menuType: 'Menu',
      isOwn: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      isShow: 1,
      code: 'org_user',
      alias: 'user',
      path: '/examManagement/examSchedule/list',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: [
        {
          menuType: 'Button',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/examManagement/examSchedule/list/add'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/examManagement/examSchedule/list/edit'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/examManagement/examSchedule/list/deleteAll'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/examManagement/examSchedule/list/delete'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/examManagement/examSchedule/list/others'
        }
      ]
    },
    {
      menuId: '12590567456745635058',
      menuName: '考试详情',
      menuType: 'Menu',
      isOwn: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      isShow: 0,
      code: 'org_user',
      alias: 'user',
      path: '/examManagement/examSchedule/detail',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: []
    },
    {
      menuId: '12590567456745635058',
      menuName: '查看关联考卷',
      menuType: 'Menu',
      isOwn: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      isShow: 0,
      code: 'org_user',
      alias: 'user',
      path: '/examManagement/examSchedule/relevanceList',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: []
    },
    {
      menuId: '125905674567456351058',
      menuName: '预览试卷',
      menuType: 'Menu',
      isOwn: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      isShow: 0,
      code: 'org_user',
      alias: 'user',
      path: '/examManagement/examSchedule/preview',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: []
    },
    {
      menuId: '15674547683454620582323',
      menuName: '手工评卷',
      menuType: 'Menu',
      isOwn: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      isShow: 1,
      code: 'org_user',
      alias: 'user',
      path: '/examManagement/mark/MarkList',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: [
        {
          menuType: 'Button',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          menuName: '逐人评卷',
          path: '/examManagement/mark/MarkList/byPerson'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          menuName: '逐题评卷',
          path: '/examManagement/mark/MarkList/byQuestion'
        }
      ]
    },
    {
      menuId: '15674547683454620582323',
      menuName: '试卷列表',
      menuType: 'Menu',
      isOwn: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      isShow: 0,
      code: 'org_user',
      alias: 'user',
      path: '/examManagement/mark/ExamineeList',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: []
    },
    {
      menuId: '15674547683454620582323',
      menuName: '试卷详情',
      menuType: 'Menu',
      isOwn: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      isShow: 0,
      code: 'org_user',
      alias: 'user',
      path: '/examManagement/mark/MarkByExaminee',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: []
    },
    {
      menuId: '15674547683454620582323',
      menuName: '试卷详情',
      menuType: 'Menu',
      isOwn: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      isShow: 0,
      code: 'org_user',
      alias: 'user',
      path: '/examManagement/mark/ViewByExaminee',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: []
    },
    {
      menuId: '15674547683454620582323',
      menuName: '逐题评卷',
      menuType: 'Menu',
      isOwn: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      isShow: 0,
      code: 'org_user',
      alias: 'user',
      path: '/examManagement/mark/MarkByPaper',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: []
    },
    {
      menuId: '15674547683454620582323',
      menuName: '成绩管理',
      menuType: 'Menu',
      isOwn: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      isShow: 1,
      code: 'org_user',
      alias: 'user',
      path: '/examManagement/grade/achievement',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: [
        {
          menuType: 'Button',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          menuName: '逐题评卷',
          path: '/examManagement/grade/achievement/view'
        }
      ]
    },
    {
      menuId: '15674547683454620582323',
      menuName: '成绩管理',
      menuType: 'Menu',
      isOwn: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      isShow: 0,
      code: 'org_user',
      alias: 'user',
      path: '/examManagement/grade/examineeAchievement',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: []
    }
  ]
}
