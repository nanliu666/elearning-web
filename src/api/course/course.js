import { get } from '@/router/axios'
/**
 * del, get, post, put
 * 创建课程数据导出接口
 * @param {Object} courseId - 参数
 * */
export const getCourseList = (params) => get(`/api/manage/v1/course/getCourse?courseId=${params}`)
