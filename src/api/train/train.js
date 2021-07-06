import { post, put, get } from '@/router/axios'
/**
 * 创建培训
 */
export const createTrain = (params) => post('/manage/v1/train', params)

export const getCreatorList = (params) => get('/manage/v1/train/getCreatorList', params)

/**
 * 修改培训
 */
export const putTrain = (params) => put('/manage/v1/train', params)
/**
 * 修改培训
 */
export const getTrainDetail = (params) => get('/manage/v1/train', params)
/**
 * 获取关联课程
 */
export const getTrainCource = (params) => get('/manage/v1/course', params)
/**
 * 培训线下日程-教室预览接口
 */
export const getBookList = (params) => get('/manage/v1/classroom/book/list', params)
/**
 * 分类查询
 */
export const getCategoryTree = (params) => get('/blade-manage/v1/train/getCategoryTree', params)
/**
 * 分类新增
 */
export const addCatalog = (data) => post('/blade-manage/v1/train/addCatalog', data)
/**
 * 编辑分类
 */
export const editCategory = (data) => post('/blade-manage/v1/train/editCategory', data)
/**
 * 修改分类状态
 */
export const updateCategoryStatus = (data) =>
  post('/blade-manage/v1/train/updateCategoryStatus', data)
/**
 * 删除分类
 */
export const deleteCategory = (params) => get('/blade-manage/v1/train/deleteCategory', params)

//---

// 添加外训
export const addOuterTrain = (data) => post('/manage/v1/train/addOuterTrain', data)

// 编辑外训
export const updateOuterTrain = (data) => put('/manage/v1/train/updateOuterTrain', data)

// 编辑外训回显
export const editEchoOuterTrain = (params) => get('/manage/v1/train/editEchoOuterTrain', params)

// 外训关联人员列表接口
export const queryOuterTrainObject = (params) =>
  get('/manage/v1/train/queryOuterTrainObject', params)

// 人员校验
export const userImportCheck = (data) => post('/user/v1/user/userImportCheck', data)

// 校验岗位、部门是否包含当前所选人
export const userCheck = (data) => post('/org/v1/org/position/userCheck', data)

// 添加/编辑内训
export const addTrain = (data) => post('/manage/v1/train', data)
export const editTrain = (data) => put('/manage/v1/train', data)
export const getTrain = (data) => get('/manage/v1/train', data)

//查询岗位
export const getPositonChild = (params) => get('/manage/v1/position/usgeter/child', params)

//查询组织
export const getOrgChild = (params) => get('/api/org/v1/org/user/child', params)

// 项目经理评定成绩
export const manualScoring = (data) => post('/api/blade-manage/v1/train/manualScoring', data)

// 查询用户评定权重
export const getAssessment = (params) => get('/api/blade-manage/v1/train/queryAssessment', params)

// 查询用户评定权重
export const executeTrainObjectUsers = (data) =>
  post('/api/manage/v1/train/executeTrainObjectUsers', data)
