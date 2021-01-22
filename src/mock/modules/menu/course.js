export default {
  sort: 0,
  menuId: '1259467456745245678793811',
  menuName: '课程中心',
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
      menuId: '1259074567456731235058',
      menuName: '课程管理',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 1,
      code: 'org_user',
      alias: 'user',
      path: '/course/courseDraft',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: [
        {
          menuType: 'Button',
          menuName: '创建课程',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/course/courseDraft/add'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '置顶/取消置顶',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/course/courseDraft/top'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '编辑',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/course/courseDraft/edit'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '删除',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/course/courseDraft/delete'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '移动',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/course/courseDraft/move'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '上架/下架',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/course/courseDraft/putaway'
        }
      ]
    },
    {
      menuId: '12590734567456735058',
      menuName: '分类管理',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 1,
      code: 'org_user',
      alias: 'user',
      path: '/course/catalog',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: [
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '新建分类',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/course/catalog/add'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '停用',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/course/catalog/stop'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '权限配置',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/course/catalog/author'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '编辑',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/course/catalog/edit'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '删除',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/course/catalog/delete'
        },
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '新建子分类',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          path: '/course/catalog/addNewGroup'
        }
      ]
    },
    {
      menuId: '1259073456754674589',
      menuName: '调整排序',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 0,
      code: 'org_user',
      alias: 'user',
      path: '/course/courseSort',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: []
    },
    {
      menuId: '125123412355342345058',
      menuName: '学习情况',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 0,
      code: 'org_user',
      alias: 'user',
      path: '/course/detail',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: []
    },
    {
      menuId: '12590567456745635058',
      menuName: '创建课程',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 0,
      code: 'org_user',
      alias: 'user',
      path: '/course/establishCourse',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: []
    },
    {
      menuId: '12590562352352565562058',
      menuName: '编辑课程',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 0,
      code: 'org_user',
      alias: 'user',
      path: '/course/compileCourse',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: []
    },
    {
      menuId: '125901123834562058',
      menuName: '考试详情',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 0,
      code: 'org_user',
      alias: 'user',
      path: '/training/examination',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: []
    },
    {
      menuId: '12234523464567254058',
      menuName: '课程审核',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 1,
      code: 'org_user',
      alias: 'user',
      path: '/approvalCenter/center',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: []
    },
    {
      menuId: '125945634575684562358',
      menuName: '审核详情',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 0,
      code: 'org_user',
      alias: 'user',
      path: '/approvalCenter/details',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: []
    },
    {
      menuId: '1259123124353455058',
      menuName: '查看章节内容',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 0,
      code: 'org_user',
      alias: 'user',
      path: '/approvalCenter/chapter',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: []
    }
  ]
}
