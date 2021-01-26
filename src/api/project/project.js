import { del, get, post, put } from '@/router/axios'

/**
 * @desc 获取客户列表数据
 * @param {Object} params 过滤条件
 */
export const getCustomers = (params) => post('/project/v1/customer/list', params)

/**
 * @desc 新增客户信息
 * @param {Object} params 客户信息
 */
export const submitCustomer = (params) => post('/project/v1/customer/create', params)

/**
 * @desc 编辑客户信息
 * @param {Object} params 客户信息
 */

export const editCustomer = (params) => put('/project/v1/customer/update', params)

/**
 * @desc 删除客户信息
 * @param {Number} customerId 客户ID
 */
export const deleteCustomer = (customerId) => del(`/project/v1/customer/delete/${customerId}`)

/**
 * @desc 获取客户详情
 * @param {Number} customerId 客户ID
 */
export const getCustomerInfo = (customerId) => get(`/project/v1/customer/detail/${customerId}`)

/**
 * @desc 获取联系人列表数据
 * @param {Object} params 过滤条件
 */
export const getUserList = (params) => get('/project/v1/contactPerson/list', params)

/**
 * @desc 获取联系人详情
 * @param {Number} userId 联系人ID
 */
export const getUserInfo = (userId) => get(`/api/project/v1/contactPerson/detail/${userId}`)

/**
 * @desc 编辑联系人信息
 * @param {Object} params 联系人信息
 */
export const editUserInfo = (params) => put('/project/v1/contactPerson/update', params)

/**
 * @desc 删除联系人
 * @param {Number} userId 联系人ID
 */
export const deleteUserInfo = (userId) => del(`/project/v1/contactPerson/delete/${userId}`)

/**
 * @desc 新增联系人
 * @param {Object} params 联系人信息
 */
export const addUserInfo = (params) => post('/project/v1/contactPerson/create', params)

/**
 * @desc 获取商机列表数据
 * @param {Object} params 过滤条件
 */
export const getBusinessData = (params) => get('/project/v1/opportunity/list', params)

/**
 * @desc 删除商机
 * @param {Number} businessId 商机ID
 */
export const deleteBusiness = (businessId) => del(`/project/v1/opportunity/delete/${businessId}`)

/**
 * @desc 编辑商机
 * @param {Obejct} params 商机信息
 */
export const editBusiness = (params) => put('/project/v1/opportunity/update', params)

/**
 * @desc 新增商机
 * @param {Object} params 商机信息
 */
export const addBusiness = (params) => post('/project/v1/opportunity/create', params)

/**
 * @desc 获取商机详情
 * @param {Number} businessId 商机ID
 */
export const getBusinessInfo = (businessId) => get(`/project/v1/opportunity/detail/${businessId}`)

/**
 * @desc 新增拜访记录
 * @param {Object} params 拜访记录信息
 */
export const addVisitingRecord = (params) => post('/project/v1/visitRecord/create', params)

/**
 * @desc 获取拜访记录列表
 * @param {Object} params 过滤参数
 */
export const getVisitingRecordList = (params) => get('/project/v1/visitRecord/list', params)

/**
 * @desc 编辑拜访记录
 * @param {Obecjt} params 拜访记录信息
 */
export const editVisitingRecord = (params) => put('/project/v1/visitRecord/update', params)

/**
 * @desc 删除拜访记录
 * @param {Number} recordId 拜访记录ID
 */
export const deleteVisitingRecord = (recordId) => del(`/project/v1/visitRecord/delete/${recordId}`)

/**
 * @desc 获取拜访记录详情
 * @param {Number} recordId 拜访记录ID
 */
export const getVisitingRecordDetail = (recordId) =>
  get(`/project/v1/visitRecord/detail/${recordId}`)

/**
 * @description:  编辑商机
 * @param {Object} params
 */

export const businessUpdate = (params) => put('/project/v1/opportunity/update', params)

/**
 * @description:  获取客户列表
 * @param {Object} params
 */

export const getContactPersonList = (params) => post('/project/v1/customer/list', params)
