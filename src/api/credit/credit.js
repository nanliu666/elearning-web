import { post } from '@/router/axios'
/***
 * @author guanfenda
 * @desc 获取学分规则
 * @params params
 * */
export const getCreditList = (params) => post('/manage/v1/listStudentRules', params)

/***
 * @author guanfenda
 * @desc 学分规则的停用启用
 * @params params
 * */
export const postCreditStartAndStop = (params) =>
  post('/manage/v1/startAndStopStudentsRulus', params)
/***
 * @author guanfenda
 * @desc 学分规则的删除
 * @params params
 * */
export const deleteCredit = (params) => post('/manage/v1/deleteStudentsRulus', params)
/***
 * @author guanfenda
 * @desc 学分规则编辑
 * @params params
 * */
export const editStudentsRulus = (params) => post('/manage/v1/editStudentsRulus', params)
/***
 * @author guanfenda
 * @desc 学分规则的新增
 * @params params
 * */
export const postAddStudentsRulus = (params) => post('/manage/v1/addStudentsRulus', params)
/***
 * @author guanfenda
 * @desc 获取系统规则
 * @params params
 * */
export const getListSysRulus = (params) => post('/manage/v1/listSysRulus', params)
/***
 * @author guanfenda
 * @desc 系统规则的停用启用
 * @params params
 * */
export const putEditSysRulus = (params) => post('/manage/v1/editSysRulus', params)
/***
 * @author guanfenda
 * @desc 学分明细列表
 * @params params
 * */
export const getListScoreDetails = (params) => post('/manage/v1/listScoreDetails', params)
/***
 * @author guanfenda
 * @desc 删除分数
 * @params params
 * */
export const deleteScoreDetails = (params) => post('/manage/v1/deleteScoreDetails', params)
