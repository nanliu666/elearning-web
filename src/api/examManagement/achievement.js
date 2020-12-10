import { del, get, put, post } from '@/router/axios'
/***
 * @author guanfenda
 * @desc 获取成绩管理列表
 * @params params .examName 试卷名称 .paperType试卷类型 .peopleNumber参加人数 .paperMaker 出卷人
 * */
export const getAchievement = (params) => get('/manage/v1/achievement/manage', params)

/***
 * @author guanfenda
 * @desc 获取考生成绩列表
 * @params params .examName 试卷名称 .paperType试卷类型 .peopleNumber参加人数 .paperMaker 出卷人
 * */
export const getExamineeAchievement = (params) => get('/manage/v1/examniee/achievement', params)
/***
 * @author guanfenda
 * @desc 修改考生成绩
 * @params params
 * */
export const getExamineeAchievementEdit = (params) => put('/manage/v1/examniee/achievement', params)
/***
 * @author guanfenda
 * @desc 查看试卷列表
 * @params params
 * */
export const getTestPaperList = (params) => get('/manage/v1/exam/paper/list', params)
// /api/grade/testPaperList/delete
/**
 * @author guanfenda
 * @path /api/grade/testPaperList/delete
 * @desc 删除试卷
 * @params params .id
 * */
export const deleteTestPaper = (params) => del('/manage/v1/exam/paper', params)
// /api/grade/testPaperList
/**
 * @author guanfenda
 * @path /api/grade/testPaperList
 * @desc 添加试卷
 * @params params
 * */
export const postTestPaper = (params) => post('/manage/v1/exam/paper', params)
/**
 * @author guanfenda
 * @path /api/grade/testPaperList
 * @desc 修改试卷
 * @params params
 * */
export const putTestPaper = (params) => put('/manage/v1/exam/paper', params)
/**
 * @author guanfenda
 * @path /api/grade/testPaperList
 * @desc 获取试卷
 * @params params
 * */
export const getTestPaper = (params) => get('/manage/v1/exam/paper', params)

/**
 * @author guanfenda
 * @path v1/examniee/paper/maker
 * @desc 获取出卷人
 * */
export const getPaperMaker = (params) => get('/manage/v1/examniee/paper/maker', params)
