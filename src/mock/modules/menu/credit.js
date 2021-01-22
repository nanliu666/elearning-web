export default {
  sort: 6,
  menuId: '1259467674524567872318',
  menuName: '学分管理',
  menuType: 'Dir', // 菜单类型，Dir：目录，Menu：菜单；Button：按钮
  isOwn: 1, // 是否拥有 0：否，1：是
  isShow: 1, // 是否显示在菜单栏 0：否，1：是
  isEnabled: 1,
  code: 'credit',
  alias: 'credit',
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
      menuId: '125907341267456735058',
      menuName: '学分规则管理',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 1,
      code: 'creditRule',
      alias: 'creditRule',
      path: '/creditManagement/creditRule',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: [
        {
          menuType: 'Button',
          menuName: '删除',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/creditManagement/creditRule/delete'
        },
        {
          menuType: 'Button',
          menuName: '编辑',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/creditManagement/creditRule/edit'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '停用',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/creditManagement/creditRule/stop'
        },
        {
          menuType: 'Button',
          menuName: '新建规则',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/creditManagement/creditRule/add'
        }
      ]
    },
    {
      menuId: '1259073412671256735058',
      menuName: '系统规则来源',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 1,
      code: 'systemRule',
      alias: 'systemRule',
      path: '/creditManagement/systemRule',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: [
        {
          menuType: 'Button',
          menuName: '启用/停用',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/creditManagement/systemRule/stop'
        }
      ]
    },
    {
      menuId: '1259073412671256735038',
      menuName: '学分明细',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 1,
      code: 'credit',
      alias: 'credit',
      path: '/creditManagement/credit',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: [
        {
          menuType: 'Button',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/creditManagement/credit/view'
        }
      ]
    },
    {
      menuId: '1259073412671256735032',
      menuName: '学分详情',
      menuType: 'Menu',
      isEnabled: 0,
      isOwn: 1,
      isShow: 0,
      code: 'creditDetails',
      alias: 'creditDetails',
      path: '/creditManagement/creditDetails',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: []
    }
  ]
}
