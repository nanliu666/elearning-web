export default {
  sort: 2,
  menuId: '1259073456778285158',
  menuName: '知识库',
  menuType: 'Dir',
  isOwn: 1,
  isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
  isShow: 1,
  code: 'repository',
  alias: 'repository',
  icon: 'iconfont iconicon_group',
  dataPrivileges: [],
  children: [
    {
      menuId: '1260401852546387969',
      menuName: '分类管理',
      menuType: 'Menu',
      isOwn: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      isShow: 1,
      code: 'role',
      alias: '目录管理',
      path: '/repository/catalogManagement',
      dataPrivileges: [],
      children: []
    },
    {
      menuId: '12604101852546387969',
      menuName: '知识管理',
      menuType: 'Menu',
      isOwn: 1,
      isShow: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      code: 'role',
      alias: '知识管理',
      path: '/repository/knowledgeManagement'
    },
    {
      menuId: '12604101852546387969',
      menuName: '创建资源',
      menuType: 'Menu',
      isOwn: 1,
      isShow: 0,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      code: 'role',
      alias: '知识管理',
      path: '/repository/knowledgeEdit'
    },
    {
      menuId: '12604101852546387969',
      menuName: '学习情况',
      menuType: 'Menu',
      isOwn: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      isShow: 0,
      code: 'role',
      alias: '学习情况',
      path: '/repository/knowledgeDetail'
    },
    {
      menuId: '12604101852546387969',
      menuName: '调整排序',
      menuType: 'Menu',
      isOwn: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      isShow: 0,
      code: 'role',
      alias: '调整排序',
      path: '/repository/catalogSort'
    }
  ]
}
