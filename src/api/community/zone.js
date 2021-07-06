import axios, { get, post } from '@/router/axios'

//获取专区列表
export const zoneList = (params) => get('/api/blade-margin/v1/community/area/queryAll', params)
// 删除专区
export const delZone = (params) => post(`/api/blade-margin/v1/community/area/delete?id=${params}`)
// 停用专区
export const stopZone = (data) =>
  axios({
    url: '/api/blade-margin/v1/community/area/close?id=' + data,
    method: 'post'
  })
// 启用专区
export const startZone = (params) => post(`/api/blade-margin/v1/community/area/open?id=${params}`)
// 添加专区
export const addZone = (params) => post('/api/blade-margin/v1/community/area/add', params)
// 查看单个专区
export const quertZone = (params) => get('/api/blade-margin/v1/community/area/getOne', params)
// 编辑专区
export const aditZone = (params) => post('/api/blade-margin/v1/community/area/edit', params)
// 批量删除专区
export const batchDel = (params) =>
  post(`/api/blade-margin/v1/community/area/deleteCommunityAreas?ids=${params}`)
// 获取专区管理员
export const getOrgTreeSearch = (params) => get('/api/org/v1/org/user', params)
