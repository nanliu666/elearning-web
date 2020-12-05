/* eslint-disable no-unused-vars */
import { del, get, post, put } from '@/router/axios'
/**
 * 获取题库列表
 * @param {Object} params - 参数
 * @param {String} params.pageNo - 请求页码
 * @param {String} params.pageSize - 每页条数
 * @param {String} params.status - 状态
 * @param {String} params.type - 类型
 * @param {String} params.search
 * */
export const getQuestionList = (params) => get('/manage/v1/question/list', params)

/**
 * 新增试题
 * @param {*} params
 */
export const createQuestion = (params) => post('/manage/v1/question', params)
/**
 * 修改试题
 * @param {*} params
 */
export const modifyQuestion = (params) => put('/manage/v1/question', params)

/**
 * 获取试题
 * @param {*} params
 */
export const getQuestion = (params) => get('/manage/v1/question', params)
