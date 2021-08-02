import request from '@/router/axios'
import website from '@/config/website'

// 获取用户的logo banner 首页布局等信息
export const getDiyInfor = (params) => {
  return request({
    url: '/api/manage/v1/cms/plan/my',
    method: 'get',
    params: params
  })
  //return get('/api/manage/v1/cms/plan/my', params)
}
// 获取用户的组织id（包括当前和当前以上的）
export const getOrgIds = (params) => {
  return request({
    url: '/api/manage/v1/web/index/queryOrgIds',
    method: 'get',
    params: params
  })
}

export const loginByUsername = (tenantId, username, password, type, key, code, account) =>
  request({
    url: '/api/blade-auth/oauth/token',
    method: 'post',
    headers: {
      'Tenant-Id': tenantId,
      'Captcha-Key': key,
      'Captcha-Code': code
    },
    params: {
      tenantId,
      account,
      username,
      password,
      grant_type: website.captchaMode ? 'captcha' : 'password',
      scope: 'all',
      type,
      user_type: 'staff'
    }
  })

export const refreshToken = (refresh_token, tenantId) =>
  request({
    url: '/api/blade-auth/oauth/token',
    method: 'post',
    headers: {
      'Tenant-Id': tenantId
    },
    params: {
      tenantId,
      refresh_token,
      grant_type: 'refresh_token',
      scope: 'all',
      user_type: 'staff'
    }
  })
export const getUserPrivilege = (userId) => {
  return request({
    url: '/api/sys/v1/user/menu/privilege',
    method: 'get',
    params: {
      userId
    }
  })
}

export const getCaptcha = () =>
  request({
    url: '/api/blade-auth/oauth/captcha',
    method: 'get'
  })

export const logout = () =>
  request({
    url: '/api/blade-auth/oauth/logout',
    method: 'get'
  })

export const getUserInfo = () =>
  request({
    url: '/api/blade-auth/oauth/user-info',
    method: 'get'
  })

export const sendLogs = (list) =>
  request({
    url: '/api/blade-auth/oauth/logout',
    method: 'post',
    data: list
  })

export const clearCache = () =>
  request({
    url: '/api/blade-auth/oauth/clear-cache',
    method: 'get'
  })

export const getTenantInfo = (domain) =>
  request({
    url: '/api/sys/v1/domain/info',
    method: 'get',
    params: domain
  })
// 通过token获取用户信息
export const userDetailByToken = (params) => {
  return request({
    url: '/blade-auth/oauth/userdetail/taken',
    method: 'get',
    params: params
  })
}
// 用户注册  发起审批流
export const userRegisterAppr = (params) => {
  return request({
    url: '/blade-user/v1/user/satrtRegisterAppr',
    method: 'post',
    params: params
  })
}

