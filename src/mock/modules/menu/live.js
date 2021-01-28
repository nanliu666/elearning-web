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
      menuName: '直播列表',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 1,
      code: 'approval_approval',
      alias: 'approval',
      path: '/live/liveList',
      icon: 'iconfont iconicon_compile'
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
      path: '/learnPlan/CoursePlanList',
      icon: 'iconfont iconicon_compile'
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
      path: '/live/statistics',
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
      path: '/live/statisticsDetails',
      icon: 'iconfont iconicon_compile'
    }
  ]
}
