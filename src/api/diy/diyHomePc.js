/*
 * @Description: 运营管理-首页定制-API
 * @Version: 3.30
 * @Autor: Xie Mingwei
 * @Date: 2021-04-08 15:23:36
 * @LastEditors: Xie Mingwei
 * @LastEditTime: 2021-04-09 11:08:04
 */
import { get, put, del } from '@/router/axios'
/**
 * @description: 首页定制方案查询
 * @param {*} device：终端：0，手机端；1.PC端，orgId：组织ID，name：方案名称
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
