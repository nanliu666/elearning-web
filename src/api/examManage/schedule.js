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
