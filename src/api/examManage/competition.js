import axios from '@/router/axios'

// 获取积分规则默认值
export function getScoreRule() {
  return axios({
    url: '/api/manage/v1/race/getScoreRule',
    method: 'get'
  })
}
// 添加关卡
export function addLevel(data) {
  return axios({
    url: '/api/manage/v1/race/add',
    method: 'post',
    data
  })
}
// 获取竞赛列表
export function getCompetitionList(data) {
  return axios({
    url: '/api/manage/v1/race/list',
    method: 'post',
    data
  })
}
// 竞赛下拉框创建人
export function creatUser(data) {
  return axios({
    url: '/api/manage/v1/race/creatUsers',
    method: 'post',
    data
  })
}
// 删除竞赛
export function delCompetition(data) {
  return axios({
    url: '/api/manage/v1/race/del?ids=' + data,
    method: 'post'
  })
}
// 获取竞赛详情
export function details(params) {
  return axios({
    url: '/api/manage/v1/race/details',
    method: 'get',
    params
  })
}
// 编辑竞赛
export function upDateLevel(data) {
  return axios({
    url: '/api/manage/v1/race/update',
    method: 'post',
    data
  })
}
// 获取参与学员情况
export function detailsStudens(data) {
  return axios({
    url: '/api/manage/v1/race/detailsJoinUsers',
    method: 'post',
    data
  })
}
// 获取关卡列表
export function getBarrierList(params) {
  return axios({
    url: '/api/manage/v1/race/barrierList',
    method: 'get',
    params
  })
}
