export default {
  sort: 8,
  menuId: '12594674567452456787938111',
  menuName: '资源管理',
  menuType: 'Dir', // 菜单类型，Dir：目录，Menu：菜单；Button：按钮
  isOwn: 1, // 是否拥有 0：否，1：是
  isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
  isShow: 1, // 是否显示在菜单栏 0：否，1：是
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
      sort: 0,
      menuId: '1212437546742158',
      menuName: '教室管理',
      menuType: 'Dir',
      isEnabled: 1,
      isOwn: 1,
      isShow: 1,
      code: 'org_user',
      alias: 'user',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: [
        {
          menuId: '1212437546742158',
          menuName: '分类管理',
          menuType: 'Menu',
          isEnabled: 1,
          isOwn: 1,
          isShow: 1,
          code: 'org_user',
          alias: 'user',
          path: '/resource/classroom/classify',
          icon: 'iconfont iconicon_boss',
          dataPrivileges: [],
          children: []
        },
        {
          menuId: '1212437546742158',
          menuName: '教室列表',
          menuType: 'Menu',
          isEnabled: 1,
          isOwn: 1,
          isShow: 1,
          code: 'org_user',
          alias: 'user',
          path: '/resource/classroom/list',
          icon: 'iconfont iconicon_boss',
          dataPrivileges: [],
          children: []
        },
        {
          menuId: '1212437546742158',
          menuName: '创建教室',
          menuType: 'Menu',
          isEnabled: 1,
          isOwn: 1,
          isShow: 0,
          code: 'org_user',
          alias: 'user',
          path: '/resource/classroom/edit',
          icon: 'iconfont iconicon_boss',
          dataPrivileges: [],
          children: []
        },
        {
          menuId: '1212437546742158',
          menuName: '教室详情',
          menuType: 'Menu',
          isEnabled: 1,
          isOwn: 1,
          isShow: 0,
          code: 'org_user',
          alias: 'user',
          path: '/resource/classroom/detail',
          icon: 'iconfont iconicon_boss',
          dataPrivileges: [],
          children: []
        }
      ]
    },
    {
      menuId: '12591231312434234658',
      menuName: '讲师管理',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 1,
      code: 'org_user',
      alias: 'user',
      path: '/resource/lecturer/lecturer',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: [
        {
          menuType: 'Button',
          menuName: '添加讲师',
          isOwn: 1,
          isEnabled: 1,
          path: '/lecturer/lecturer/add'
        },
        {
          menuType: 'Button',
          menuName: '停用',
          isOwn: 1,
          isEnabled: 1,
          path: '/lecturer/lecturer/stop'
        },
        {
          menuType: 'Button',
          menuName: '编辑',
          isOwn: 1,
          isEnabled: 1,
          path: '/lecturer/lecturer/edit'
        },
        {
          menuType: 'Button',
          menuName: '删除',
          isOwn: 1,
          isEnabled: 1,
          path: '/lecturer/lecturer/delete'
        },
        {
          menuType: 'Button',
          menuName: '新建分组',
          isOwn: 1,
          isEnabled: 1,
          path: '/lecturer/lecturer/addNewGroup'
        }
      ]
    },
    {
      menuId: '12512312345778934534558',
      menuName: '添加讲师',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 0,
      code: 'org_user',
      alias: 'user',
      path: '/resource/lecturer/addLecturer',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: []
    },
    {
      menuId: '12567867895468534558',
      menuName: '编辑讲师',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 0,
      code: 'org_user',
      alias: 'user',
      path: '/resource/lecturer/compileLecturer',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: []
    },
    {
      menuId: '1212312312345626364558',
      menuName: '讲师详情',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 0,
      code: 'org_user',
      alias: 'user',
      path: '/resource/lecturer/particularsLecturer',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: []
    },
    {
      menuId: '12123141231226142158',
      menuName: '证书模板管理',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 1,
      code: 'org_user',
      alias: 'user',
      path: '/resource/certificate/certificateManage',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: [
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '新建模板',
          isEnabled: 1,
          path: '/certificate/certificateManage/add'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '停用',
          isEnabled: 1,
          path: '/certificate/certificateManage/stop'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '预览',
          isEnabled: 1,
          path: '/certificate/certificateManage/preview'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '删除',
          isEnabled: 1,
          path: '/certificate/certificateManage/delete'
        }
      ]
    },
    {
      menuId: '1212437546742158',
      menuName: '新建证书模版',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 0,
      code: 'org_user',
      alias: 'user',
      path: '/resource/certificate/addCertificate',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: []
    },
    {
      menuId: '12679683472345158',
      menuName: '证书发放明细',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 1,
      code: 'org_user',
      alias: 'user',
      path: '/resource/certificate/certificateDetail',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: [
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '导出Excel',
          isEnabled: 1,
          path: '/certificate/certificateDetail/export'
        }
      ]
    }
  ]
}
