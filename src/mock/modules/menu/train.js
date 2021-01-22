export default {
  sort: 1,
  menuId: '125946745674524567879382',
  menuName: '培训中心',
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
      menuId: '125905252435241424058',
      menuName: '培训详情',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 0,
      code: 'org_user',
      alias: 'user',
      path: '/training/trainingDetail',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: []
    },
    {
      menuId: '12590123136834562058',
      menuName: '培训中心',
      menuType: 'Menu',
      isOwn: 1,
      isShow: 1,
      code: 'org_user',
      alias: 'user',
      path: '/training/trainingArrange',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: [
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '创建培训',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/training/trainingArrange/add'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '新建分组',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/training/trainingArrange/addGroup'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '删除',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/training/trainingArrange/delete'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '编辑',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/training/trainingArrange/edit'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '开办下一期',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/training/trainingArrange/next'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '结办',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/training/trainingArrange/end'
        }
      ]
    },
    {
      menuId: '1214878678567464558',
      menuName: '编辑页面',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 0,
      code: 'org_user',
      alias: 'user',
      path: '/training/trainingEdit',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: []
    }
  ]
}
