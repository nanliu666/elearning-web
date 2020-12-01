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
