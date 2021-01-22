// 课程管理页面的鉴权
export const ADD_COURSE = '/course/courseDraft/add'
export const DELETEALL_COURSE = '/course/courseDraft/deleteAll'
export const TOP_COURSE = '/course/courseDraft/top'
export const EDIT_COURSE = '/course/courseDraft/edit'
export const DELETE_COURSE = '/course/courseDraft/delete'
export const MOVE_COURSE = '/course/courseDraft/move'
export const PUTAWAY_COURSE = '/course/courseDraft/putaway'
export const ALL_COURSE_PRIVI = [
  ADD_COURSE,
  DELETEALL_COURSE,
  TOP_COURSE,
  EDIT_COURSE,
  DELETE_COURSE,
  MOVE_COURSE,
  PUTAWAY_COURSE
]
// 课程中心的分类管理的鉴权
export const ADD_COURSE_CATALOG = '/course/catalog/add'
export const STOP_COURSE_CATALOG = '/course/catalog/stop'
export const AUTH_COURSE_CATALOG = '/course/catalog/author'
export const EDIT_COURSE_CATALOG = '/course/catalog/edit'
export const DELETEALL_COURSE_CATALOG = '/course/catalog/deleteAll'
export const DELETE_COURSE_CATALOG = '/course/catalog/delete'
export const ADD_GROUNP_COURSE_CATALOG = '/course/catalog/addNewGroup'
export const ALL_COURSE_CATALOG_PRIVI = [
  ADD_COURSE_CATALOG,
  STOP_COURSE_CATALOG,
  AUTH_COURSE_CATALOG,
  EDIT_COURSE_CATALOG,
  DELETEALL_COURSE_CATALOG,
  DELETE_COURSE_CATALOG,
  ADD_GROUNP_COURSE_CATALOG
]
// 培训中心的分类管理的鉴权
export const ADD_TRAIN = '/training/trainingArrange/add' // 新增培训
export const ADD_GROUNP_TRAIN = '/training/trainingArrange/addGroup' // 新增分组
export const DELETE_ALL_TRAIN = '/training/trainingArrange/deleteAll' // 批量删除
export const DELETE_TRAIN = '/training/trainingArrange/delete' // 删除
export const EDIT_TRAIN = '/training/trainingArrange/edit' //编辑
export const NEXT_TRAIN = '/training/trainingArrange/next' // 开办下一期
export const END_TRAIN = '/training/trainingArrange/end' // 结办
export const ALL_TRAIN_PRIVI = [DELETE_TRAIN, EDIT_TRAIN, NEXT_TRAIN, END_TRAIN]
