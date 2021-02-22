export default {
  menuId: '1590112075699',
  sort: 5,
  menuName: '直播中心',
  menuType: 'Dir', // 菜单类型，Dir：目录，Menu：菜单；Button：按钮
  isOwn: 1, // 是否拥有 0：否，1：是
  isEnabled: 1,
  isShow: 1, // 是否显示在菜单栏 0：否，1：是
  isEnable: 1,
  code: 'approval',
  alias: 'approval',
  path: '',
  icon: 'iconfont iconicon_setting',
  children: [
    {
      menuId: '1590112075692666',
      menuName: '分类管理',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 1,
      code: 'approval_approval',
      alias: 'approval',
      path: '/live/classify',
      icon: 'iconfont iconicon_compile',
      children: [
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '新建分类',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/live/classify/add'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '启用/停用',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/live/classify/stop'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '权限配置',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/live/classify/auth'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '编辑',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/live/classify/edit'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '删除',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/live/classify/delete'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '新建子分类',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/live/classify/addNewGroup'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '调整排序',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/live/classify/sort'
        }
      ]
    },
    {
      menuId: '1590112075692666',
      menuName: '直播安排',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 1,
      code: 'approval_approval',
      alias: 'approval',
      path: '/live/liveList',
      icon: 'iconfont iconicon_compile',
      children: [
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '创建直播',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/live/liveList/add'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '编辑',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/live/liveList/edit'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '禁用',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/live/liveList/stop'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '删除',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/live/liveList/delete'
        }
      ]
    },
    {
      menuId: '1590112075692668',
      menuName: '直播回放',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 1,
      code: 'approval_approval',
      alias: 'approval',
      path: '/live/playBackList',
      icon: 'iconfont iconicon_compile'
    },
    {
      menuId: '1590112075692669',
      menuName: '查看直播回放',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 0,
      code: 'approval_approval',
      alias: 'approval',
      path: '/live/playBackListSingle',
      icon: 'iconfont iconicon_compile'
    },
    {
      menuId: '1590112075692670',
      menuName: '播放回放',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 0,
      code: 'approval_approval',
      alias: 'approval',
      path: '/live/replayPlaying',
      icon: 'iconfont iconicon_compile'
    },
    {
      menuId: '1590112075692666',
      menuName: '数据统计',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 1,
      code: 'approval_approval',
      alias: 'approval',
      path: '/live/stat',
      icon: 'iconfont iconicon_compile'
    },
    {
      menuId: '1590112075692666',
      menuName: '人员统计详情',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 0,
      code: 'approval_approval',
      alias: 'approval',
      path: '/live/person-stat-detail',
      icon: 'iconfont iconicon_compile'
    },
    {
      menuId: '159011207512323692666',
      menuName: '直播统计详情',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 0,
      code: 'approval_approval',
      alias: 'approval',
      path: '/live/live-stat-detail',
      icon: 'iconfont iconicon_compile'
    }
  ]
}
