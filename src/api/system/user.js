import request, { del, get, post, put } from '@/router/axios'

/**
 * 组织机构查询接口
 */
export const getOrganization = (params) => {
  return get('/org/v1/organization', params)
}

export const delUser = (params) => {
  return del('/api/user/v1/user/info', params)
}
/**
 * 组织架构员工查询接口
 * @deprecated 使用 /org/v1/org/user/child 代替
 */
export const getOrgUserTree = () => {
  return get('/org/v1/org/user/tree')
}

/**
 * 获取子组织架构和直属员工接口
 * @param {object} params 参数
 * @param {string} params.parentId 父组织ID，顶级父节点为"0"
 * @param {string} [params.search] 工号或姓名，支持模糊查询
 * @returns {{orgs: Array<any>; users: Array<any>}}
 */
export const getOrgUserChild = (params) => get('/org/v1/org/user/child', params)
/**
 * 获取子组织岗位和直属员工接口
 * @param {object} params 参数
 * @param {string} params.parentId 父组织ID，顶级父节点为"0"
 * @param {string} [params.search] 工号或姓名，支持模糊查询
 * @returns {{orgs: Array<any>; users: Array<any>}}
 */
export const getPostionUserChild = (params) => get('/manage/v1/position/user/child', params)
/**
 * 获取子业务部门和直属员工接口
 * @param {object} params 参数
 * @param {string} params.parentId 父组织ID，顶级父节点为"0"
 * @param {string} [params.search] 工号或姓名，支持模糊查询
 * @returns {{bizs: Array<any>; users: Array<any>}}
 */
export const getBizUserChild = (params) => get('/org/v1/biz/org/user/child', params)
/**
 * 获取外部用户
 * @param {object} params 参数
 * @param {string} params.pageNo
 * @param {string} params.pageSize
 */
export const getOuterUser = (params) => get('/user/v1/user/outer', params)
/* 获取外部用户
 * @param {object} params 参数
 * @param {string} params.pageNo
 * @param {string} params.pageSize
 */
export const getOuterUserList = (params) => get('/user/v1/user/outer/list', params)
/**
 * 类目列表
 * @param {String} userId - 用户ID
 * */
export const resetPwd = (userIds) => {
  return post('/user/v1/user/pwd/reset', { userIds })
}

/**
 * 标签所属用户查询接口
 * @param {Object} params - 参数
 * @param {String} params.pageNo - 请求页码
 * @param {String} params.pageSize - 每页条数
 * @param {String} params.tagId - 标签ID
 * @param {String} params.search - 工号或姓名，支持模糊查询
 * */
export const getTagUserList = (params) => {
  return get('/user/v1/tag/user', params)
}

/**
 * 用户账号冻结接口
 * @param {String} userId - 用户ID,支持多个以英文逗号分隔
 * @param {String} userStatus - 用户状态，1-正常（解冻），2-禁用（冻结）
 * */
export const modifyUserStatus = (userId, userStatus) => {
  return post('/user/v1/user/status/reset', { userId, userStatus })
}

/**
 * 组织所属用户查询接口
 * @param {Object} params - 参数
 * @param {String} params.pageNo - 请求页码
 * @param {String} params.pageSize - 每页条数
 * @param {String} params.orgId - 组织ID
 * @param {String} params.search - 工号或姓名，支持模糊查询
 * */
export const getOrgUserList = (params) => {
  return get('/org/v1/org/user', params)
}
export const getWorkList = (params) => {
  return get('/user/v1/user/work/list', params)
}
// 搜索所有人员，包括外部员工
export const getAllUserList = (params) => {
  return get('/user/v1/user/all', params)
}
/**
 * 标签所属用户移除接口
 * @param {String} tagId 标签ID
 * @param {String} userId 用户ID，多个以英文逗号分隔
 */
export const delTagUser = (tagId, userId) => {
  return del('/user/v1/tag/user', { tagId, userId })
}

/**
 * 标签所属用户添加接口
 * @param {String} tagId  标签ID
 * @param {Array<String>} users 用户ID
 */
export const createTagUser = (tagId, users) => {
  return post('/user/v1/tag/user', { tagId, users })
}
/**
 * 用户拥有角色查询接口
 * @param {String} userId 用户ID
 */
export const getUserRole = (userId) => {
  return get('/user/v1/user/role', { userId })
}

/**
 * 用户拥有角色修改接口
 * @param {String} userId 用户ID
 * @param {Array<Object>} roles 角色
 */
export const modifyUserRole = (userId, roles) => {
  return put('/user/v1/user/role', { userId, roles })
}

/**
 * 角色列表查询接口
 * @param {String} roleName 角色名称
 */
export const getRoleList = (params) => {
  return get('/sys/v1/role', params)
}

/**
 * 类目列表
 * @param {Object} params - 参数
 * @param {String} params.pageNo - 请求页码
 * @param {String} params.pageSize - 每页条数
 * @param {String} params.name - 类目名称
 * */
export const getTagList = (params) => {
  return request({
    url: '/user/v1/user/tag/define',
    method: 'get',
    params
  })
}
/**
 * 类目创建
 * @param {Object} params - 参数
 * @param {String} params.name - 类目名称
 * */
export const createTag = (data) => {
  return request({
    url: '/api/user/v1/user/tag/define',
    method: 'post',
    data
  })
}
/**
 * 类目修改
 * @param {Object} params - 参数
 * @param {String} params.name - 类目名称
 * */
export const modifyTag = (data) => {
  return request({
    url: '/api/user/v1/user/tag/define',
    method: 'put',
    data
  })
}
/**
 * 类目删除
 * @param {Object} params - 参数
 * @param {String} params.id - 类目id
 * */
export const deleteTag = (params) => {
  return request({
    url: '/api/user/v1/user/tag/define',
    method: 'delete',
    params
  })
}

//操作日志
export const getActionLog = (params) => {
  return request({
    // url: '/api/sys/log/v1/action/log',
    url: '/api/log/v1/action/log',
    method: 'get',
    params
  })
}

/**
 * @desc 查询所有外部联系人分类
 * @param {Obeject} params 过滤条件
 */
export const getAllCategory = (params) => get('/user/v1/user/category/define', params)

/**
 * @desc 新增分类
 * @param {Object} params 外部联系人分类
 */
export const addCategory = (params) => post('/user/v1/user/category/define', params)

/**
 * @desc 删除分类
 * @param {String} categoryIds 删除类别ID
 */
export const deleteCategory = (categoryIds) => del('/user/v1/user/category/define', categoryIds)

/**
 * @desc 编辑分类
 * @param {Object} params 类别信息
 */
export const editCategory = (params) => put('/user/v1/user/category/define', params)

/**
 * @desc 添加外部联系人
 * @param {Object} params 外部联系人信息
 */
export const addExternalContact = (params) => post('/user/v1/user/outer', params)

/**
 * @desc 获取外部联系人信息
 * @param {Object} params 过滤条件
 */
export const getExternalContactDatas = (params) => get('/user/v1/user/outer', params)

/**
 * @desc 编辑外部联系人
 * @param {Object} params 外部联系人信息
 */
export const editExternalContact = (params) => put('/user/v1/user/outer', params)

/**
 * @desc 删除外部联系人
 * @param {Object} params 外部联系人ID
 */
export const deleteExternalContact = (params) => del('/user/v1/user/outer', params)

/**
 * 角色列表查询接口
 * @param {String} roleName 角色名称
 */
export const getRolesList = (params) => {
  return get('/sys/v1/role/list', params)
}

/**
 * @desc 获取业务架构数据
 * @param {Object} params 业务架构数据过滤条件
 */
export const getBusinessTree = (params) => get('/org/v1/business/org', params)

/**
 * @desc 获取业务架构下用户列表
 * @param {Object} params 业务架构下用户列表过滤条件
 */
export const getBusinessUserList = (params) => get('/org/v1/business/org/user', params)

/**
 * @desc 角色菜单权限查询
 * @param {Object} params 过滤条件
 */
export const getMenuPrivilege = (params) => get('/sys/v1/role/menu/privilege', params)

/**
 * @desc 角色组织机构权限查询
 * @param {Object} params 过滤条件
 */
export const getOrgPrivilege = (params) => get('/sys/v1/role/org/privilege', params)

/**
 * @desc 角色业务部门权限查询
 * @param {Object} params 过滤条件
 */
export const getBizPrivilege = (params) => get('/sys/v1/role/biz/privilege', params)
// /manage/v1/train/getCatalogs
/**
 * @desc 角色业务部门权限查询
 * @param {Object} params 过滤条件
 */
export const getTrainGetCatalogs = (params) => get('/api/manage/v1/train/getCatalogs', params)
/**
 * @desc 获取所有的培训分类
 */
export const getAllCatalog = (params) => get('/api/manage/v1/train/queryAllCatalog', params)
/**
 * @desc 批量离职
 */
export const bulkDepartures = (params) => post('/api/user/v1/user/status/reset', params)
/**
 * @desc 批量修改部门
 */
export const updateUserIdBatchOrg = (params) =>
  post('/api/user/v1/user/updateUserIdBatchOrg', params)
