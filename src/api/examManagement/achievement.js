import { get, put } from '@/router/axios'
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
