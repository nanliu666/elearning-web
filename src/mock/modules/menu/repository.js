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
      children: [
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '创建分类',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/repository/catalogManagement/add'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '停用/启用',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/repository/catalogManagement/stop'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '权限配置',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/repository/catalogManagement/author'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '编辑',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/repository/catalogManagement/edit'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '删除',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/repository/catalogManagement/delete'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '创建子分类',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/repository/catalogManagement/addNewChild'
        }
      ]
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
      path: '/repository/knowledgeEdit',
      children: [
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '创建资源',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/repository/knowledgeManagement/add'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '置顶',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/repository/knowledgeManagement/top'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '查看详情',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/repository/knowledgeManagement/view'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '下架/上架',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/repository/knowledgeManagement/slotOut'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '编辑',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/repository/knowledgeManagement/edit'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '移动',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/repository/knowledgeManagement/move'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '删除',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/repository/knowledgeManagement/delete'
        }
      ]
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
