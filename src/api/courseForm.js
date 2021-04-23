import { get } from '@/router/axios'
/**
 * del, get, post, put
/**
 *  课件-章节-统计列表查询
 * @param {Object} params.courseId        课程id
 * @param {Object} params.userId      用户id
 **/
export const contentCountList = (params) => get('api/manage/v1/content/contentCountList', params)
/**
 *  课程报表
 * @param {Object} params.courseName        课程名称
 * @param {Object} params.orgId      部门id
 * @param {Object} params.pageNo        请求页码
 * @param {Object} params.pageSize      每页条数
 **/
export const queryCourseCountList = (params) =>
  get('api/manage/v1/web/coursecenter/queryCourseCountList', params)
/**
 *  课程报表详情
 * @param {Object} params.courseId        课程id
 * @param {Object} params.pageNo      请求页码
 * @param {Object} params.pageSize        每页条数
 **/
export const queryCourseCountStudentList = (params) =>
  get('api/manage/v1/web/coursecenter/queryCourseCountStudentList', params)
/**
 *  课程报表-导出
 * @param {Object} params.courseName        课程名称
 * @param {Object} params.orgId      部门id
 * @param {Object} params.pageNo        请求页码
 * @param {Object} params.pageSize      每页条数
 **/
export const queryCourseCountListExcelExport = (params) =>
  get('api/manage/v1/web/coursecenter/queryCourseCountListExcelExport', params)
/**
 *  课程报表详情-导出
 * @param {Object} params.courseId        课程id
 * @param {Object} params.pageNo          请求页码
 * @param {Object} params.pageSize        每页条数
 **/
export const queryCourseCountStudentListExcelExport = (params) =>
  get('api/manage/v1/web/coursecenter/queryCourseCountStudentListExcelExport', params)
/**
 *  课件-章节-统计列表导出
 * @param {Object} params.courseId        课程id
 * @param {Object} params.userId      用户id
 **/
export const exportContentList = (params) => get('api/manage/v1/content/exportContentList', params)
