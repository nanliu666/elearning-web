import Layout from '@/page/index/'
import ProcessDesign from '@/views/processDesign/ProcessDesign'
// import establishCourse from '@/views/course/establishCourse'
// import compileCourse from '@/views/course/compileCourse'
// import ExamEdit from '@/views/examManagement/examSchedule/edit'
import EditPlan from '@/views/learnPlan/EditPlan'
import MenuAll from '@/views/system/menuAll'
import demoRoutes from './demo'
import questionnaireArrange from '@/views/questionnaire/arrange/edit'
import trainingEdit from '@/views/training-edit/index'
// import trainingEdit from '@/views/training/trainingEdit'
import agreementEdit from '@/views/agreement/edit'
export default [
  {
    path: '/',
    redirect: '/wel'
  },
  {
    path: '/process/design',
    name: '流程设计器',
    component: ProcessDesign,
    meta: {
      keepAlive: true,
      isTab: false
    }
  },
  {
    path: '/training/edit',
    component: trainingEdit,
    meta: {
      keepAlive: false,
      isTab: false
    }
  },
  {
    path: '/agreement/edit',
    component: agreementEdit,
    meta: {
      keepAlive: false,
      isTab: false
    }
  },
  {
    path: '/questionnaire-arrange',
    name: 'questionnaire-arrange',
    component: questionnaireArrange,
    meta: {
      keepAlive: false,
      isTab: false
    }
  },
  // {
  //   path: '/course/establishCourse',
  //   name: '创建课程',
  //   component: establishCourse,
  //   meta: {
  //     keepAlive: true,
  //     isTab: false
  //   }
  // },
  // {
  //   path: '/course/compileCourse',
  //   name: '编辑课程',
  //   component: compileCourse,
  //   meta: {
  //     keepAlive: true,
  //     isTab: false
  //   }
  // },
  // {
  //   path: '/examManagement/examSchedule/edit',
  //   name: '新建考试',
  //   component: ExamEdit,
  //   meta: {
  //     keepAlive: true,
  //     isTab: false
  //   }
  // },
  {
    path: '/wel',
    component: Layout,
    children: [
      {
        path: '/menuAll',
        name: '平台后台菜单管理',
        component: MenuAll,
        meta: {}
      },
      {
        path: '/learnPlan/edit',
        name: '编辑学习计划',
        component: EditPlan,
        meta: {
          $keepAlive: true,
          noHeader: true,
          fullscreen: true,
          isTab: false
        }
      },
      // {
      //   path: '',
      //   name: '工作台',
      //   meta: {
      //     i18n: 'dashboard'
      //   },
      //   component: () => import('@/views/wel/index')
      // }
      {
        path: '',
        name: '统计报表',
        meta: {
          i18n: 'dashboard'
        },
        component: () => import('@/views/report/index')
      }
    ]
  },
  {
    path: '/info',
    component: Layout,
    redirect: '/info/index',
    children: [
      {
        path: 'index',
        name: '个人信息',
        meta: {
          i18n: 'info'
        },
        component: () => import('@/views/system/userinfo')
      },
      {
        path: 'securitySetting',
        name: '安全设置',
        component: () => import('@/views/system/securitySetting')
      }
    ]
  },
  ...(process.env.NODE_ENV === 'development' ? demoRoutes : [])
]
