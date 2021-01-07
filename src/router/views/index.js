import Layout from '@/page/index/'
import ProcessDesign from '@/views/processDesign/ProcessDesign'
import TrainingEdit from '@/views/training/trainingEdit'
import ExamEdit from '@/views/examManagement/examSchedule/edit'
import EditPlan from '@/views/learnPlan/EditPlan'
import demoRoutes from './demo'
import todo from './todo'
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
      keepAlive: true,
      isTab: false
    }
  },
  {
    path: '/learnPlan/edit',
    name: '编辑学习计划',
    component: EditPlan,
    meta: {
      keepAlive: true,
      isTab: false
    }
  },
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
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '/taskCenter/taskCenter',
        name: '任务中心',
        meta: {
          fullscreen: true
        },
        component: () => import('@/views/taskCenter/taskCenter')
      },
      {
        path: '/quickAccess/mailList',
        name: '通讯录',
        meta: {
          fullscreen: true
        },
        component: () => import('@/views/quickAccess/mailList')
      },
      {
        path: '/taskCenter/scheduleCenter',
        name: '日程中心',
        meta: {
          fullscreen: true
        },
        component: () => import('@/views/taskCenter/scheduleCenter')
      }
    ]
  },
  ...todo,
  ...(process.env.NODE_ENV === 'development' ? demoRoutes : [])
]
