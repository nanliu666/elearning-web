export default {
  sort: 7,
  menuId: '1590112075691',
  menuName: '流程管理',
  menuType: 'Dir', // 菜单类型，Dir：目录，Menu：菜单；Button：按钮
  isOwn: 1, // 是否拥有 0：否，1：是
  isEnabled: 1,
  isShow: 1, // 是否显示在菜单栏 0：否，1：是
  code: 'approval',
  alias: 'approval',
  path: '',
  icon: 'iconfont iconicon_setting',
  children: [
    {
      menuId: '15901120756913',
      menuName: '审批流程',
      menuType: 'Menu',
      isOwn: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      isShow: 1,
      code: 'approval_approval',
      alias: 'approval',
      path: '/apprProcess/approvalList',
      icon: 'iconfont iconicon_compile'
    },
    {
      menuId: '15901120756920',
      menuName: '审批记录',
      menuType: 'Menu',
      isOwn: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      isShow: 1,
      code: 'approval_recordList',
      alias: '/apprProcess/recordList',
      path: '/apprProcess/recordList',
      icon: 'iconfont iconicon_compile'
    },
    {
      menuId: '0000006',
      menuName: '审批详情',
      menuType: 'Menu',
      isOwn: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      isShow: 0,
      code: 'approval_approval',
      alias: 'approval',
      path: '/apprProcess/apprDetail',
      icon: 'iconfont iconicon_compile'
    }
  ]
}
