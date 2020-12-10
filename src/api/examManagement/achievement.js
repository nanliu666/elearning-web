import { del, get, put, post } from '@/router/axios'
/***
 * @author guanfenda
 * @desc 获取成绩管理列表
 * @params params .examName 试卷名称 .paperType试卷类型 .peopleNumber参加人数 .paperMaker 出卷人
 * */
export const getAchievement = (params) => get('/api/grade/achievement', params)

/***
 * @author guanfenda
 * @desc 获取考生成绩列表
 * @params params .examName 试卷名称 .paperType试卷类型 .peopleNumber参加人数 .paperMaker 出卷人
 * */
export const getExamineeAchievement = (params) => get('/api/grade/examineeAchievement', params)
/***
 * @author guanfenda
 * @desc 修改考生成绩
 * @params params
 * */
export const getExamineeAchievementEdit = (params) =>
  put('/api/grade/examineeAchievement/edit', params)
/***
 * @author guanfenda
 * @desc 查看试卷列表
 * @params params
 * */
export const getTestPaperList = (params) => get('/api/grade/testPaperList', params)
// /api/grade/testPaperList/delete
/**
 * @author guanfenda
 * @path /api/grade/testPaperList/delete
 * @desc 删除试卷
 * @params params .id
 * */
export const deleteTestPaper = (params) => del('/api/grade/testPaperList/delete', params)
// /api/grade/testPaperList
/**
 * @author guanfenda
 * @path /api/grade/testPaperList
 * @desc 添加试卷
 * @params params
 * */
export const postTestPaper = (params) => post('/api/grade/testPaper', params)
/**
 * @author guanfenda
 * @path /api/grade/testPaperList
 * @desc 修改试卷
 * @params params
 * */
export const putTestPaper = (params) => put('/api/grade/testPaper', params)
/**
 * @author guanfenda
 * @path /api/grade/testPaperList
 * @desc 获取试卷
 * @params params
 * */
export const getTestPaper = (params) => get('/api/grade/testPaper', params)
