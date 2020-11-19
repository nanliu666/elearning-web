import request, { del, get, put, post } from '@/router/axios'

export const delPrivilege = (params) => del('/api/sys/v1/role/menu/privilege', params)
export const getPrivilege = (params) => get('/api/sys/v1/role/menu/privilege', params)
export const putPrivilege = (params) => put('/api/sys/v1/role/menu/privilege', params)
export const postOrgPrivilege = (params) => post('/api/sys/v1/role/privilege', params)
export const getMenuList = (current, size, params) => {
  return request({
    url: '/api/blade-system/menu/menu-list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

export const getMenuTree = (parentId = '0') => {
  return request({
    url: '/api/sys/v1/menu/tree',
    method: 'get',
    params: {
      parentId,
      clientId: 'Admin'
    }
  })
}

export const getMenuInfo = (parentId, query = {}) => {
  if (!query.clientId) query.clientId = 'Admin'
  return request({
    url: '/api/sys/v1/menu/info',
    method: 'get',
    params: {
      parentId,
      ...query
    }
  })
}
export const putMenuInfo = (params) => {
  return put('/api/sys/v1/menu/info', params)
}
export const postMenuInfo = (data) => {
  if (!data.clientId) data.clientId = 'Admin'
  return request({
    url: '/api/sys/v1/menu/info',
    method: 'post',
    data
  })
}

export const deleteMenuInfo = (menuId, clientId) => {
  let cid = clientId
  if (!cid) cid = 'Admin'
  return request({
    url: '/api/sys/v1/menu/info',
    method: 'delete',
    params: {
      menuId,
      clientId: cid
    }
  })
}

//--------------------liufuze-------------------------
//获取组织机构的权限
export const getOrgPermission = (params) =>
  request({
    url: '/api/sys/v1/role/org/privilege',
    method: 'get',
    params: {
      ...params
    }
  })
//获取业务部门的权限
export const getBizPermission = (params) =>
  request({
    url: '/api/sys/v1/role/biz/privilege',
    method: 'get',
    params: {
      ...params
    }
  })
//获取自定义的权限
export const getDataPermission = (params) =>
  request({
    url: '/api/sys/v1/role/data/privilege',
    method: 'get',
    params: {
      ...params
    }
  })
//角色数据权限修改接口
export const putRolePermission = (params) =>
  request({
    url: '/api/sys/v1/role/data/privilege',
    method: 'put',
    params: {
      ...params
    }
  })
//获取页面控件权限列表
export const getPagePermission = (params) =>
  request({
    url: '/api/sys/v1/role/menu/privilege',
    method: 'get',
    params: {
      ...params
    }
  })
//获取角色菜单权限
export const getRoleMenuPermission = (params) =>
  request({
    url: '/api/sys/v1/role/menu/privilege',
    method: 'get',
    params: {
      ...params
    }
  })
//角色新增或者修改权限
export const updateRoleMenuPermission = (params) =>
  request({
    url: '/api/sys/v1/role/privilege',
    method: 'post',
    params: {
      ...params
    }
  })
