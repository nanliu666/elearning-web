/*
 * @Description:
 * @Version: 3.30
 * @Autor: Xie Mingwei
 * @Date: 2021-05-15 15:33:47
 * @LastEditors: Xie Mingwei
 * @LastEditTime: 2021-05-31 10:25:53
 */
import { get, post, del } from '@/router/axios'
const baseUrl = '/api/blade-margin/v1/ability/'

// 能力词典
/**
 * @description: 分页查询能力基础
 * @param {*} abilityName:能力名称,pageSize:每页条数,pageNo:页数
 * @return {*}
 */
export const queryAbility = (params) => get(`${baseUrl}queryAbility`, params)

/**
 * @description: 根据ID查询能力基础信息
 * @param {*} id:能力基础ID
 * @return {*}
 */
export const queryAbilityById = (params) => get(`${baseUrl}queryAbilityById`, params)

/**
 * @description: 删除能力基础
 * @param {*} abilityIds:能力名称ID,多个ID逗号隔开
 * @return {*}
 */
export const deleteAbility = (params) => post(`${baseUrl}deleteAbility`, params)

/**
 * @description: 删除能力等级
 * @param {*} abilityLevelIds:等级Id,多个逗号逗号隔开
 * @return {*}
 */
export const deleteAbilityLevel = (params) => post(`${baseUrl}deleteAbilityLevel`, params)

/**
 * @description: 删除能力等级途径
 * @param {*} abilityLevelRouteIds:学习途径ID，多个逗号隔开
 * @return {*}
 */
export const deleteAbilityLevelRoute = (params) => post(`${baseUrl}deleteAbilityLevelRoute`, params)

/**
 * @description: 编辑能力基础信息
 * @param {*}
 * @return {*}
 */
export const updateAbility = (params) => post(`${baseUrl}update`, params)

/**
 * @description: 根据能力ID查询能力是否绑定了岗位
 * @param {*} abilityId:能力ID
 * @return {*}
 */
export const queryAbilityBindPosition = (params) =>
  get(`${baseUrl}queryAbilityBindPosition`, params)

/**
 * @description: 添加基础能力
 * @param {*} abilityName,abilityDesc,abilityLevel:Array
 * @return {*}
 */
export const addAbility = (params) => post(`${baseUrl}save`, params)

/**
 * @description: 查询培训树状分类
 * @param {*} name:分类名称,creatorId:创建人id,addFlag:分类的新增和编辑才需要传这个字段，值固定写死，传1
 * @return {*}
 */
export const getTrainCategoryTree = (params) =>
  get('/api/blade-manage/v1/train/getCategoryTree', params)

//   岗位胜任力模型
/**
 * @description: 查询岗位能力
 * @param {*} ids:岗位Id，多个ID逗号隔开
 * @return {*}
 */
export const queryPositionAbility = (params) => get(`${baseUrl}queryPositionAbility`, params)

/**
 * @description: 添加岗位能力
 * @param {*} positionId:岗位ID,abilityLevelModels:array[object] abilityId:能力ID,abilityLevelId:能力对应的等级ID
 * @return {*}
 */
export const addPositionAbility = (params) => post(`${baseUrl}addPositionAbility`, params)

/**
 * @description: 岗位晋升管理列表
 * @param {*} name:岗位名称
 * @return {*}
 */
export const positionTreeRoute = (params) => get('/api/margin/v1/position/route/tree', params)

/**
 * @description: 生成默认路线
 * @param {*} positionId:岗位id
 * @return {*}
 */
export const getDefaultRoute = (params) => get('/api/margin/v1/position/route/init', params)

/**
 * @description: 岗位晋升路线
 * @param {*} positionId:岗位id,otherPositionId:岗位父ID
 * @return {*}
 */
export const getPromotionRoute = (params) => get('/api/margin/v1/position/route/info', params)

/**
 * @description: 晋升路线（高级）
 * @param {*} positionId:岗位id,otherPositionId:岗位父ID
 * @return {*}
 */
export const getPromotionRouteSenior = (params) => get('/api/margin/v1/position/route/conf', params)

/**
 * @description: 配置晋升路线
 * @param {*} positionId:岗位id,routeId:路线id
 * @return {*}
 */
export const configurationPromotionRoute = (params) =>
  post('/api/margin/v1/position/route/submit', params)

/**
 * @description: 删除晋升路线
 * @param {*} ids:路线ID，逗号隔开
 * @return {*}
 */
export const deletePromotionRoute = (params) => del('/api/margin/v1/position/route/delete', params)

/**
 * @description: 盘点列表
 * @param {*} positionId:岗位id,pageNo:页数,pageSize:条数
 * @return {*}
 */
export const getInventoryList = (params) => get('/api/margin/v1/position/route/user/page', params)

/**
 * @description: 学习概况
 * @param {*} userId
 * @return {*}
 */
export const getUserSituation = (params) => get('/api/margin/v1/position/route/user/detail', params)

/**
 * @description: 切换晋升路线
 * @param {*} userId
 * @return {*}
 */
export const switchRoutes = (params) => get('/api/margin/v1/position/route/user/route', params)

/**
 * @description: 学习途径
 * @param {*} positionId,userId
 * @return {*}
 */
export const getWayLearn = (params) =>
  get('/api/margin/v1/position/route/user/detail/way/all', params)

/**
 * @description: 查看材料
 * @param {*} ablrIds
 * @return {*}
 */
export const getMaterialReport = (params) =>
  get('/api/margin/v1/position/route/user/ability/file/my', params)
