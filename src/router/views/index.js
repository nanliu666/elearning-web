import Layout from '@/page/index/'
import ProcessDesign from '@/views/processDesign/ProcessDesign'
import TrainingEdit from '@/views/training/trainingEdit'
// import establishCourse from '@/views/course/establishCourse'
// import compileCourse from '@/views/course/compileCourse'
import ExamEdit from '@/views/examManagement/examSchedule/edit'
import EditPlan from '@/views/learnPlan/EditPlan'
import MenuAll from '@/views/system/menuAll'
import demoRoutes from './demo'
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
    name: '编辑培训',
    component: TrainingEdit,
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
  {
    path: '/examManagement/examSchedule/edit',
    name: '新建考试',
    component: ExamEdit,
    meta: {
      keepAlive: true,
      isTab: false
    }
  },
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
      {
        path: '',
        name: '工作台',
        meta: {
          i18n: 'dashboard'
        },
        component: () => import('@/views/wel/index')
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
