import Mock from 'mockjs'
/**
 * menuPrivileges是所有菜单权限
 * orgPrivileges是所有组织，暂时用不到
 *
 * 注意：menuType为Menu的菜单，它的下级menuType只能为Button
 *
 * menuType为Menu的菜单,它的path在页面渲染时会生成对应的路由，所以path的值要和实际文件路径相同
 * 例如：页面文件的路径是：src\views\system\role.vue,它对应的path就是/system/role
 *
 */
const res = {
  resCode: 200,
  success: true,
  response: {
    orgPrivileges: [
      {
        orgId: '1252523599903072257',
        orgName: '百利宏12',
        orgType: 'Company',
        isOwn: 1
      },
      {
        orgId: '1252523599903072259',
        orgName: '广州易宝分公司',
        orgType: 'Company',
        isOwn: 1
      },
      {
        orgId: '1259787152448147458',
        orgName: '出差',
        orgType: 'Company',
        isOwn: 1
      }
    ],
    menuPrivileges: [
      {
        menuId: '1259069584261287938',
        menuName: '系统管理',
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
                children: []
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
                children: []
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
                children: []
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
                children: []
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
                path: '/system/permissionConfig'
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
                path: '/system/roleUsers'
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
            children: []
          },
          // {
          //   menuId: '125907843471874',
          //   menuName: '原始菜单管理',
          //   menuType: 'Menu',
          //   isEnabled: 1,
          //   isOwn: 1,
          //   isShow: 0,
          //   code: 'system_menu_all',
          //   alias: 'menuAll ',
          //   path: '/system/menuAll',
          //   icon: 'iconfont iconicon_compile',
          //   dataPrivileges: [],
          //   children: []
          // },
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
                path: '/newsCenter/newsManage',
                icon: 'iconfont iconicon_study',
                dataPrivileges: []
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
                path: '/newsCenter/newsEdit',
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
                path: '/newsCenter/newsCenter',
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
                path: '/newsCenter/newsDetail',
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
                path: '/newsCenter/newsDrafts',
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
                path: '/newsCenter/newsPublished',
                icon: '',
                dataPrivileges: [],
                children: []
              }
            ]
          }
        ]
      },
      {
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
      },
      {
        menuId: '12594674567452456787938',
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
            menuId: '12590734567456735058',
            menuName: '目录管理',
            menuType: 'Menu',
            isEnabled: 1,
            isOwn: 1,
            isShow: 1,
            code: 'org_user',
            alias: 'user',
            path: '/course/catalog',
            icon: 'iconfont iconicon_boss',
            dataPrivileges: [],
            children: []
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
            children: []
          },
          {
            menuId: '125123412355342345058',
            menuName: '学习情况',
            menuType: 'Menu',
            isEnabled: 1,
            isOwn: 1,
            isShow: 1,
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
            menuName: '培训安排',
            menuType: 'Menu',
            isOwn: 1,
            isShow: 1,
            code: 'org_user',
            alias: 'user',
            path: '/training/trainingArrange',
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
            menuId: '12591231312434234658',
            menuName: '讲师管理',
            menuType: 'Menu',
            isEnabled: 1,
            isOwn: 1,
            isShow: 1,
            code: 'org_user',
            alias: 'user',
            path: '/lecturer/lecturer',
            icon: 'iconfont iconicon_boss',
            dataPrivileges: [],
            children: []
          },
          {
            menuId: '12512312345778934534558',
            menuName: '添加讲师',
            menuType: 'Menu',
            isEnabled: 1,
            isOwn: 1,
            isShow: 0,
            code: 'org_user',
            alias: 'user',
            path: '/lecturer/addLecturer',
            icon: 'iconfont iconicon_boss',
            dataPrivileges: [],
            children: []
          },
          {
            menuId: '12567867895468534558',
            menuName: '编辑讲师',
            menuType: 'Menu',
            isEnabled: 1,
            isOwn: 1,
            isShow: 0,
            code: 'org_user',
            alias: 'user',
            path: '/lecturer/compileLecturer',
            icon: 'iconfont iconicon_boss',
            dataPrivileges: [],
            children: []
          },
          {
            menuId: '1212312312345626364558',
            menuName: '讲师详情',
            menuType: 'Menu',
            isEnabled: 1,
            isOwn: 1,
            isShow: 0,
            code: 'org_user',
            alias: 'user',
            path: '/lecturer/particularsLecturer',
            icon: 'iconfont iconicon_boss',
            dataPrivileges: [],
            children: []
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
          },
          {
            menuId: '12123141231226142158',
            menuName: '证书管理',
            menuType: 'Menu',
            isEnabled: 1,
            isOwn: 1,
            isShow: 1,
            code: 'org_user',
            alias: 'user',
            path: '/certificate/certificateManage',
            icon: 'iconfont iconicon_boss',
            dataPrivileges: [],
            children: []
          },
          {
            menuId: '1212437546742158',
            menuName: '新建证书模版',
            menuType: 'Menu',
            isEnabled: 1,
            isOwn: 1,
            isShow: 0,
            code: 'org_user',
            alias: 'user',
            path: '/certificate/addCertificate',
            icon: 'iconfont iconicon_boss',
            dataPrivileges: [],
            children: []
          },
          {
            menuId: '12679683472345158',
            menuName: '证书发放明细',
            menuType: 'Menu',
            isEnabled: 1,
            isOwn: 1,
            isShow: 0,
            code: 'org_user',
            alias: 'user',
            path: '/certificate/certificateDetail',
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
            isShow: 1,
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
            isShow: 1,
            code: 'org_user',
            alias: 'user',
            path: '/approvalCenter/chapter',
            icon: 'iconfont iconicon_boss',
            dataPrivileges: [],
            children: []
          }
        ]
      },
      {
        menuId: '1259467456745245678718',
        menuName: '考评管理',
        menuType: 'Dir', // 菜单类型，Dir：目录，Menu：菜单；Button：按钮
        isOwn: 1, // 是否拥有 0：否，1：是
        isShow: 1, // 是否显示在菜单栏 0：否，1：是
        isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
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
            menuId: '12590734567456735058',
            menuName: '分类管理',
            menuType: 'Menu',
            isOwn: 1,
            isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
            isShow: 1,
            code: 'org_user',
            alias: 'user',
            path: '/examManagement/category/management',
            icon: 'iconfont iconicon_boss',
            dataPrivileges: [],
            children: []
          },
          {
            menuId: '125907345334589',
            menuName: '试题创建',
            menuType: 'Menu',
            isOwn: 1,
            isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
            isShow: 0,
            path: '/examManagement/question/questionEdit',
            code: 'questionEdit',
            alias: 'questionEdit',
            icon: 'iconfont iconicon_boss'
          },
          {
            menuId: '125907334589',
            menuName: '试题导入',
            menuType: 'Menu',
            isOwn: 1,
            isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
            isShow: 0,
            path: '/examManagement/question/questionImport',
            code: 'questionImport',
            alias: 'questionImport',
            icon: 'iconfont iconicon_boss'
          },
          {
            menuId: '125907345674589',
            menuName: '题库管理',
            menuType: 'Menu',
            isOwn: 1,
            isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
            isShow: 1,
            path: '/examManagement/question/questionList',
            code: 'questionList',
            alias: 'questionList',
            icon: 'iconfont iconicon_boss'
          },

          {
            menuId: '1567454768323454620582323',
            menuName: '试卷管理',
            menuType: 'Menu',
            isOwn: 1,
            isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
            isShow: 1,
            code: 'org_user',
            alias: 'user',
            path: '/examManagement/testPaper/testPaper',
            icon: 'iconfont iconicon_boss',
            dataPrivileges: [],
            children: []
          },
          {
            menuId: '1567454768323454620582323',
            menuName: '试卷管理',
            menuType: 'Menu',
            isOwn: 1,
            isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
            isShow: 0,
            code: 'org_user',
            alias: 'user',
            path: '/examManagement/testPaper/randomTestPaper',
            icon: 'iconfont iconicon_boss',
            dataPrivileges: [],
            children: []
          },
          {
            menuId: '1567454768323454620582323',
            menuName: '新建手工试卷',
            menuType: 'Menu',
            isOwn: 1,
            isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
            isShow: 0,
            code: 'org_user',
            alias: 'user',
            path: '/examManagement/testPaper/handmadeTestPaper',
            icon: 'iconfont iconicon_boss',
            dataPrivileges: [],
            children: []
          },
          {
            menuId: '12590567456745635058',
            menuName: '考试安排',
            menuType: 'Menu',
            isOwn: 1,
            isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
            isShow: 1,
            code: 'org_user',
            alias: 'user',
            path: '/examManagement/examSchedule/list',
            icon: 'iconfont iconicon_boss',
            dataPrivileges: [],
            children: []
          },
          {
            menuId: '12590567456745635058',
            menuName: '考试详情',
            menuType: 'Menu',
            isOwn: 1,
            isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
            isShow: 0,
            code: 'org_user',
            alias: 'user',
            path: '/examManagement/examSchedule/detail',
            icon: 'iconfont iconicon_boss',
            dataPrivileges: [],
            children: []
          },
          {
            menuId: '12590567456745635058',
            menuName: '查看关联考卷',
            menuType: 'Menu',
            isOwn: 1,
            isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
            isShow: 0,
            code: 'org_user',
            alias: 'user',
            path: '/examManagement/examSchedule/relevanceList',
            icon: 'iconfont iconicon_boss',
            dataPrivileges: [],
            children: []
          },
          {
            menuId: '125905674567456351058',
            menuName: '预览试卷',
            menuType: 'Menu',
            isOwn: 1,
            isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
            isShow: 0,
            code: 'org_user',
            alias: 'user',
            path: '/examManagement/examSchedule/preview',
            icon: 'iconfont iconicon_boss',
            dataPrivileges: [],
            children: []
          },
          {
            menuId: '15674547683454620582323',
            menuName: '手工评卷',
            menuType: 'Menu',
            isOwn: 1,
            isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
            isShow: 1,
            code: 'org_user',
            alias: 'user',
            path: '/examManagement/mark/MarkList',
            icon: 'iconfont iconicon_boss',
            dataPrivileges: [],
            children: []
          },
          {
            menuId: '15674547683454620582323',
            menuName: '试卷列表',
            menuType: 'Menu',
            isOwn: 1,
            isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
            isShow: 0,
            code: 'org_user',
            alias: 'user',
            path: '/examManagement/mark/ExamineeList',
            icon: 'iconfont iconicon_boss',
            dataPrivileges: [],
            children: []
          },
          {
            menuId: '15674547683454620582323',
            menuName: '试卷详情',
            menuType: 'Menu',
            isOwn: 1,
            isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
            isShow: 0,
            code: 'org_user',
            alias: 'user',
            path: '/examManagement/mark/MarkByExaminee',
            icon: 'iconfont iconicon_boss',
            dataPrivileges: [],
            children: []
          },
          {
            menuId: '15674547683454620582323',
            menuName: '试卷详情',
            menuType: 'Menu',
            isOwn: 1,
            isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
            isShow: 0,
            code: 'org_user',
            alias: 'user',
            path: '/examManagement/mark/ViewByExaminee',
            icon: 'iconfont iconicon_boss',
            dataPrivileges: [],
            children: []
          },
          {
            menuId: '15674547683454620582323',
            menuName: '逐题评卷',
            menuType: 'Menu',
            isOwn: 1,
            isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
            isShow: 0,
            code: 'org_user',
            alias: 'user',
            path: '/examManagement/mark/MarkByPaper',
            icon: 'iconfont iconicon_boss',
            dataPrivileges: [],
            children: []
          },
          {
            menuId: '15674547683454620582323',
            menuName: '成绩管理',
            menuType: 'Menu',
            isOwn: 1,
            isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
            isShow: 1,
            code: 'org_user',
            alias: 'user',
            path: '/examManagement/grade/achievement',
            icon: 'iconfont iconicon_boss',
            dataPrivileges: [],
            children: []
          },
          {
            menuId: '15674547683454620582323',
            menuName: '成绩管理',
            menuType: 'Menu',
            isOwn: 1,
            isEnabled: 1, // 是否显示在菜单栏 0：否，1：是
            isShow: 0,
            code: 'org_user',
            alias: 'user',
            path: '/examManagement/grade/examineeAchievement',
            icon: 'iconfont iconicon_boss',
            dataPrivileges: [],
            children: []
          }
        ]
      },
      {
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
            children: []
          },
          {
            menuId: '1259073412671256735058',
            menuName: '系统规则管理',
            menuType: 'Menu',
            isEnabled: 1,
            isOwn: 1,
            isShow: 1,
            code: 'systemRule',
            alias: 'systemRule',
            path: '/creditManagement/systemRule',
            icon: 'iconfont iconicon_boss',
            dataPrivileges: [],
            children: []
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
            children: []
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
      },
      {
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
            isEnabled: 0, // 是否显示在菜单栏 0：否，1：是
            isShow: 0,
            code: 'approval_approval',
            alias: 'approval',
            path: '/apprProcess/apprDetail',
            icon: 'iconfont iconicon_compile'
          }
        ]
      },
      {
        menuId: '1590112075692',
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
            icon: 'iconfont iconicon_compile'
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
            icon: 'iconfont iconicon_compile'
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
      },
      {
        menuId: '1590112075699',
        menuName: '直播管理',
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
            path: '/live/list',
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
    ]
  },
  resMsg: '操作成功'
}

export default ({ mock }) => {
  if (!mock) return
  Mock.mock(new RegExp('/api/sys/v1/user/menu/privilege' + '.*'), 'get', () => {
    return res
  })
}
