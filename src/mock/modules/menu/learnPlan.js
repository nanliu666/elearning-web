export default {
  menuId: '1590112075692',
  sort: 4,
  menuName: '学习计划',
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
      menuId: '15901120756921',
      menuName: '必修课安排',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 1,
      code: 'approval_approval',
      alias: 'approval',
      path: '/learnPlan/CoursePlanList',
      icon: 'iconfont iconicon_compile',
      children: [
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '新建必修课程',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/learnPlan/CoursePlanList/add'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          menuName: '编辑',
          path: '/learnPlan/CoursePlanList/edit'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '删除',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/learnPlan/CoursePlanList/delete'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          menuName: '查看完成率',
          path: '/learnPlan/CoursePlanList/view'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          menuName: '创建分组',
          path: '/learnPlan/CoursePlanList/addGroup'
        },
        {
          menuType: 'Button',
          menuName: '结办',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/learnPlan/CoursePlanList/stop'
        }
      ]
    },
    {
      menuId: '15901120756922',
      menuName: '选修课安排',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 1,
      code: 'approval_approval',
      alias: 'approval',
      path: '/learnPlan/ElectivePlanList',
      icon: 'iconfont iconicon_compile',
      children: [
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '查看',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/learnPlan/ElectivePlanList/view'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '删除',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/learnPlan/ElectivePlanList/delete'
        }
      ]
    },
    {
      menuId: '15901120756924',
      menuName: '必修课完成率',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 0,
      code: 'approval_approval',
      alias: 'approval',
      path: '/learnPlan/CourseUserList',
      icon: 'iconfont iconicon_compile'
    }
  ]
}
