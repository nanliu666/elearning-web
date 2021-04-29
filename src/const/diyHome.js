/**
 * 首页左侧模块总共的配置
 * id是前端自定义的id
 * name为组件中文名字
 * coms是vue的的name的名字
 * 前端需要加模块必须在后台配置此文件，coms必须与前台的页面name保持一致
 */
export const DIY_LEFT_CONFIG = [
  { id: 'diyPcL1', name: '我的任务' },
  { id: 'diyPcL2', name: '最新直播' },
  { id: 'diyPcL3', name: '热门课程' },
  { id: 'diyPcL4', name: '培训中心' },
  { id: 'diyPcL5', name: '新闻中心' },
  { id: 'diyPcL6', name: '制度清单' }
]
/**
 * 首页右侧模块总共的配置
 * key为前端自定义的id
 * value为组件名字
 * 前端需要加模块必须在前后台前端const/diyHome文件夹下同步增删
 */
export const DIY_RIGHT_CONFIG = [
  { id: 'diyPcR1', name: '个人信息' },
  { id: 'diyPcR2', name: '学习中的课程' },
  { id: 'diyPcR3', name: '月度积分排行榜' },
  { id: 'diyPcR4', name: '月度学时排行榜' },
  { id: 'diyPcR5', name: '讲师风采' }
]
