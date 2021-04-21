export default {
  sort: 9,
  menuId: '1259069584261287938',
  menuName: '系统管理',
  menuType: 'Dir', // 菜单类型，Dir：目录，Menu：菜单；Button：按钮
  isOwn: 1, // 是否拥有 0：否，1：是
  isEnabled: 1, // 在后台管理菜单管理的，设置启用停用  0：否，1：是。（是否显示在菜单栏）只有这个页面在menu页面配置
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
      menuId: '125907515306392371',
      menuName: '组织管理',
      menuType: 'Dir',
      isOwn: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      isShow: 1,
      code: 'org_management',
      alias: 'orgManagement',
      path: '',
      icon: 'iconfont iconicon_subordinate',
      dataPrivileges: [],
      children: [
        {
          menuId: '1259075153063923714',
          menuName: '组织管理',
          menuType: 'Menu',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          isOwn: 1,
          isShow: 1,
          code: 'org_management',
          alias: 'orgManagement',
          path: '/orgs/orgManagement',
          icon: 'iconfont iconicon_subordinate',
          dataPrivileges: [],
          children: [
            {
              menuType: 'Button',
              isOwn: 1,
              menuName: '新建组织',
              isEnabled: 1,
              path: '/orgs/orgManagement/add'
            },
            {
              menuType: 'Button',
              isOwn: 1,
              menuName: '创建子组织',
              isEnabled: 1,
              path: '/orgs/orgManagement/addChild'
            },
            {
              menuType: 'Button',
              isOwn: 1,
              menuName: '编辑',
              isEnabled: 1,
              path: '/orgs/orgManagement/edit'
            },
            {
              menuType: 'Button',
              isOwn: 1,
              menuName: '删除',
              isEnabled: 1,
              path: '/orgs/orgManagement/delete'
            }
          ]
        },
        {
          menuId: '1260118258720522241',
          menuName: '组织排序',
          menuType: 'Menu',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          isOwn: 1,
          isShow: 0,
          code: 'org_sort',
          alias: 'org_sort',
          path: '/orgs/orgSort',
          icon: 'iconfont icon-caidanguanli',
          dataPrivileges: [],
          children: [
            {
              menuType: 'Button',
              isOwn: 1,
              menuName: '编辑',
              isEnabled: 1,
              path: '/orgs/orgDetail/edit'
            },
            {
              menuType: 'Button',
              isOwn: 1,
              menuName: '删除',
              isEnabled: 1,
              path: '/orgs/orgDetail/delete'
            }
          ]
        },
        {
          menuId: '1260118573335265281',
          menuName: '组织详情',
          menuType: 'Menu',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          isShow: 0,
          code: 'org_detail',
          alias: 'org_detail',
          path: '/orgs/orgDetail',
          icon: 'iconfont icon-daohanglanmoshi02',
          dataPrivileges: [],
          children: []
        }
      ]
    },
    {
      menuId: '1259073456778285058',
      menuName: '用户管理',
      menuType: 'Dir',
      isOwn: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      isShow: 1,
      code: 'org_user',
      alias: 'user',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: [
        {
          menuId: '12590356778285058',
          menuName: '用户管理',
          menuType: 'Menu',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          isShow: 1,
          code: 'org_user',
          alias: 'user',
          path: '/system/user',
          icon: 'iconfont iconicon_boss',
          dataPrivileges: [],
          children: [
            {
              menuType: 'Button',
              isOwn: 1,
              menuName: '添加用户',
              isEnabled: 1,
              path: '/system/user/add'
            },
            {
              menuType: 'Button',
              isOwn: 1,
              menuName: '角色设置',
              isEnabled: 1,
              path: '/system/user/setting'
            },
            {
              menuType: 'Button',
              isOwn: 1,
              menuName: '密码重置',
              isEnabled: 1,
              path: '/system/user/resetPassword'
            },
            {
              menuType: 'Button',
              isOwn: 1,
              menuName: '编辑',
              isEnabled: 1,
              path: '/system/user/edit'
            },
            {
              menuType: 'Button',
              isOwn: 1,
              menuName: '冻结',
              isEnabled: 1,
              path: '/system/user/end'
            },
            {
              menuType: 'Button',
              isOwn: 1,
              menuName: '删除',
              isEnabled: 1,
              path: '/system/user/delete'
            }
          ]
        },
        {
          menuId: '1259034522778285058',
          menuName: '用户详情',
          menuType: 'Menu',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          isShow: 0,
          code: 'user_detail',
          alias: 'userDetail',
          path: '/system/userDetail',
          icon: 'iconfont iconicon_boss',
          dataPrivileges: [],
          children: []
        },
        {
          menuId: '125903456778285058',
          menuName: '添加用户',
          menuType: 'Menu',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          isShow: 0,
          code: 'editUser',
          alias: 'editUser',
          path: '/system/editUser',
          icon: 'iconfont iconicon_boss',
          dataPrivileges: [],
          children: []
        }
      ]
    },
    {
      menuId: '1260401852546387969',
      menuName: '角色管理',
      menuType: 'Dir',
      isOwn: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      isShow: 1,
      code: 'role',
      alias: '角色',
      children: [
        {
          menuId: '1260401852546387969',
          menuName: '角色管理',
          menuType: 'Menu',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          isOwn: 1,
          isShow: 1,
          code: 'role',
          alias: '角色',
          path: '/system/role',
          icon: 'iconfont iconicon_group',
          dataPrivileges: [],
          children: [
            {
              menuType: 'Button',
              isOwn: 1,
              menuName: '创建角色',
              isEnabled: 1,
              path: '/system/role/add'
            },
            {
              menuType: 'Button',
              isOwn: 1,
              menuName: '查看用户',
              isEnabled: 1,
              path: '/system/role/view'
            },
            {
              menuType: 'Button',
              isOwn: 1,
              menuName: '权限配置',
              isEnabled: 1,
              path: '/system/role/author'
            },
            {
              menuType: 'Button',
              isOwn: 1,
              menuName: '编辑',
              isEnabled: 1,
              path: '/system/role/edit'
            },
            {
              menuType: 'Button',
              isOwn: 1,
              menuName: '删除',
              isEnabled: 1,
              path: '/system/role/delete'
            },
            {
              menuType: 'Button',
              isOwn: 1,
              menuName: '创建分类',
              isEnabled: 1,
              path: '/system/role/addCatalog'
            }
          ]
        },
        {
          menuId: '12604101852546387969',
          menuName: '角色权限',
          menuType: 'Menu',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          isOwn: 1,
          isShow: 0,
          code: 'role',
          alias: '角色权限',
          path: '/system/permissionConfig',
          children: [
            {
              menuType: 'Button',
              isOwn: 1,
              menuName: '新增权限',
              isEnabled: 1,
              path: '/system/permissionConfig/add'
            },
            {
              menuType: 'Button',
              isOwn: 1,
              menuName: '管理范围',
              isEnabled: 1,
              path: '/system/permissionConfig/range'
            },
            {
              menuType: 'Button',
              isOwn: 1,
              menuName: '删除',
              isEnabled: 1,
              path: '/system/permissionConfig/delete'
            }
          ]
        },

        {
          menuId: '12604101852546387969',
          menuName: '查看用户',
          menuType: 'Menu',
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          isOwn: 1,
          isShow: 0,
          code: 'role',
          alias: '查看用户',
          path: '/system/roleUsers',
          children: [
            {
              menuType: 'Button',
              isOwn: 1,
              menuName: '添加用户',
              isEnabled: 1,
              path: '/system/roleUsers/add'
            },
            {
              menuType: 'Button',
              isOwn: 1,
              menuName: '删除',
              isEnabled: 1,
              path: '/system/roleUsers/delete'
            }
          ]
        }
      ]
    },
    {
      menuId: '1259073456778285058234',
      menuName: '岗位管理',
      menuType: 'Dir',
      isOwn: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      isShow: 1,
      code: 'station',
      alias: '岗位管理',
      icon: 'iconfont iconicon_boss',
      dataPrivileges: [],
      children: [
        {
          menuId: '125634453478285058',
          menuName: '岗位管理',
          menuType: 'Menu',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          isShow: 1,
          code: 'station',
          alias: '岗位管理',
          path: '/system/station',
          icon: 'iconfont iconicon_boss',
          dataPrivileges: [],
          children: [
            {
              menuType: 'Button',
              isOwn: 1,
              menuName: '岗位新增',
              isEnabled: 1,
              path: '/system/station/add'
            },
            {
              menuType: 'Button',
              isOwn: 1,
              menuName: '批量导出',
              isEnabled: 1,
              path: '/system/station/exports'
            },
            {
              menuType: 'Button',
              isOwn: 1,
              menuName: '查看用户',
              isEnabled: 1,
              path: '/system/station/detail'
            },
            {
              menuType: 'Button',
              isOwn: 1,
              menuName: '岗位编辑',
              isEnabled: 1,
              path: '/system/station/edit'
            },
            {
              menuType: 'Button',
              isOwn: 1,
              menuName: '岗位删除',
              isEnabled: 1,
              path: '/system/station/delete'
            }
          ]
        },
        {
          menuId: '12590123458285058',
          menuName: '查看用户',
          menuType: 'Menu',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          isShow: 0,
          code: 'station_detail',
          alias: 'stationsDetail',
          path: '/system/stationDetail',
          icon: 'iconfont iconicon_boss',
          dataPrivileges: [],
          children: [
            {
              menuType: 'Button',
              isOwn: 1,
              menuName: '批量删除',
              isEnabled: 1,
              path: '/system/stationDetail/exports'
            }
          ]
        }
      ]
    },
    {
      menuId: '1259070994843471874',
      menuName: '菜单管理',
      menuType: 'Menu',
      isOwn: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      isShow: 1,
      code: 'system_menu',
      alias: 'menu',
      path: '/system/menu',
      icon: 'iconfont iconicon_compile',
      dataPrivileges: [],
      children: [
        {
          menuType: 'Button',
          isOwn: 1,
          menuName: '启用/停用',
          isEnabled: 1,
          path: '/system/menu/stop'
        }
      ]
    },
    {
      menuId: '125907843471874',
      menuName: '原始菜单管理',
      menuType: 'Menu',
      isEnabled: 1,
      isOwn: 1,
      isShow: 1,
      code: 'system_menu_all',
      alias: 'menuAll ',
      path: '/system/menuAll',
      icon: 'iconfont iconicon_compile',
      dataPrivileges: [],
      children: []
    },
    {
      menuId: '1259071409534308354',
      menuName: '操作日志',
      menuType: 'Menu',
      isOwn: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      isShow: 1,
      code: 'system_actionLog',
      alias: 'actionLog',
      path: '/system/actionLog',
      icon: 'iconfont iconicon_addresslist',
      dataPrivileges: [],
      children: []
    },
    // {
    //   menuId: '1259072341233010217985',
    //   menuName: '商户管理',
    //   menuType: 'Menu',
    //   isOwn: 1,
    //   isShow: 1,
    //   code: 'system_tenant',
    //   alias: 'tenant',
    //   path: '/system/tenant',
    //   icon: 'iconfont el-icon-key',
    //   dataPrivileges: [],
    //   children: []
    // },
    {
      menuId: '81585ddd-7bab-4db1-848c-91103ffc9014',
      menuName: '新闻管理',
      menuType: 'Dir',
      isOwn: 1,
      isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
      isShow: 1,
      code: 'news_manage',
      alias: '新闻管理',
      icon: 'iconfont iconicon_study',
      dataPrivileges: [],
      children: [
        {
          menuId: '81585ddd-7bab-4db1-848c-91103ffc9014',
          menuName: '新闻管理',
          menuType: 'Menu',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          isShow: 1,
          code: 'news_manage',
          alias: '新闻管理',
          path: '/system/newsCenter/newsManage',
          icon: 'iconfont iconicon_study',
          dataPrivileges: [],
          children: [
            {
              menuType: 'Button',
              isOwn: 1,
              menuName: '新建公告',
              isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
              path: '/system/newsCenter/newsManage/add'
            },
            {
              menuType: 'Button',
              isOwn: 1,
              menuName: '删除',
              isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
              path: '/system/newsCenter/newsManage/delete'
            },
            {
              menuType: 'Button',
              menuName: '编辑',
              isOwn: 1,
              isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
              path: '/system/newsCenter/newsManage/edit'
            },
            {
              menuType: 'Button',
              menuName: '置顶',
              isOwn: 1,
              isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
              path: '/system/newsCenter/newsManage/top'
            }
          ]
        },
        {
          menuId: 'e407bfbd-6f90-4628-97c4-eac6949e0a5b',
          menuName: '新闻发布',
          menuType: 'Menu',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          isShow: 0,
          code: 'news_publish',
          alias: '新闻发布',
          path: '/system/newsCenter/newsEdit',
          icon: '',
          dataPrivileges: [],
          children: []
        },
        {
          menuId: '2ddb4048-c735-4bd0-a85e-5c31037d9649',
          menuName: '新闻中心',
          menuType: 'Menu',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          isShow: 0,
          code: 'news_manage',
          alias: '新闻中心',
          path: '/system/newsCenter/newsCenter',
          icon: 'iconfont iconicon_study',
          dataPrivileges: [],
          children: []
        },
        {
          menuId: 'fa198d3f-46fc-4857-bcae-4a67b89d7071',
          menuName: '新闻详情',
          menuType: 'Menu',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          isShow: 0,
          code: 'news_detail',
          alias: '新闻详情',
          path: '/system/newsCenter/newsDetail',
          icon: 'icon-basics-detailed-outlined',
          dataPrivileges: [],
          children: []
        },
        {
          menuId: 'a12f338d-279f-43f9-b13a-c28689052dec',
          menuName: '草稿箱',
          menuType: 'Menu',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          isShow: 0,
          code: 'news_drafts',
          alias: '新闻详情',
          path: '/system/newsCenter/newsDrafts',
          icon: '',
          dataPrivileges: [],
          children: []
        },
        {
          menuId: 'acb97380-40dc-4918-972c-bed5b7450641',
          menuName: '已发布的',
          menuType: 'Menu',
          isOwn: 1,
          isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
          isShow: 0,
          code: 'news_published',
          alias: 'news_published',
          path: '/system/newsCenter/newsPublished',
          icon: '',
          dataPrivileges: [],
          children: []
        }
      ]
    }
  ]
}
