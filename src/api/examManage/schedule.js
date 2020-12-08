import { del, get, post, put } from '@/router/axios'
/**
 * 新增考试安排
 */
export const postExamArrange = (params) => post('/manage/v1/exam/arrange', params)
/**
 * 考试详情
 */
export const getExamArrange = (params) => get('/manage/v1/exam/arrange', params)
/**
 * 编辑考试安排
 */
export const putExamArrange = (params) => put('/manage/v1/exam/arrange', params)
/**
 * 删除考试安排
 */
export const delExamArrange = (params) => del('/manage/v1/exam/arrange', params)
/**
 * 获取当前组织下的所有人
 */
export const getUserList = (params) => get('/user/v1/user/basis', params)
/**
 * 获取考试安排列表
 */
export const getArrangeList = (params) => get('/manage/v1/exam/arrange/list', params)
/**
 * 获取详情页-考生概况
 */
export const getBatchList = (params) => get('/manage/v1/examinee/batch', params)
