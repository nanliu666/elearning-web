/*
 * @Description: 运营管理-首页定制-API
 * @Version: 3.30
 * @Autor: Xie Mingwei
 * @Date: 2021-04-08 15:23:36
 * @LastEditors: Xie Mingwei
 * @LastEditTime: 2021-04-21 16:08:37
 */
import { get, put, del, post } from '@/router/axios'
/**
 * @description: 首页定制方案查询
 * @param {*} device：终端：0，手机端；1.PC端，orgId：组织ID，name：方案名称,pageNo:页码,pageSize:条数
 * @return {*}
 */
export const getHomePc = (params) => get('/api/manage/v1/cms/plan', params)

/**
 * @description: 定制方案发布
 * @param {*} id:方案ID
 * @return {*}
 */
export const releaseHomePc = (params) => put('/api/manage/v1/cms/plan/release', params)

/**
 * @description: 定制方案删除
 * @param {*} ids:方案列表，逗号隔开
 * @return {*}
 */
export const deleteHomePc = (params) => del('/api/manage/v1/cms/plan', params)

/**
 * @description: 获取banner列表
 * @param {*} orgId：组织ID，pageNo:页码,pageSize:条数
 * @return {*}
 */
export const getBannerList = (params) => post('/api/common/v1/banner/listBanner', params)

/**
 * @description: 添加Banner图
 * @param {*} orgId：组织ID，picUrl:图片存储路径,deviceType:设备类型,remark:备注,linkUrl:链接跳转地址,sort:排序
 * @return {*}
 */
export const addBanner = (params) => post('/api/common/v1/banner/saveBanner', params)

/**
 * @description: 修改Banner图
 * @param {*} id:banner图id,orgId：组织ID，picUrl:图片存储路径,deviceType:设备类型,remark:备注,linkUrl:链接跳转地址,sort:排序
 * @return {*}
 */
export const updateBanner = (params) => post('/api/common/v1/banner/updateBanner', params)

/**
 * @description: 删除Banner图
 * @param {*} ids:需要删除的Banner图id，当有多个id是用逗号分隔
 * @return {*}
 */
export const removeBanner = (params) => post('/api/common/v1/banner/removeBanner', params)

/**
 * @description: 查询logo定制列表
 * @param {*} pageNo，pageSize，deviceType，orgId
 * @return {*}
 */
export const logoList = (params) => post('/api/common/v1/base/logo/list', params)

/**
 * @description: 添加修改logo接口
 * @param {*} id,orgId,frontUrl,backgroundUrl,deviceType,remark
 * @return {*}
 */
export const updateLogo = (params) => post('/api/common/v1/base/logo/update', params)

/**
 * @description: 重置logo
 * @param {*} ids:需要重置的logo id，有多个时用逗号隔开
 * @return {*}
 */
export const removeLogo = (params) => post('/api/common/v1/base/logo/remove', params)
