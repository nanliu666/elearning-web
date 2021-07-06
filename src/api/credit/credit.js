import { post, get } from '@/router/axios'
/***
 * @author guanfenda
 * @desc 获取积分规则
 * @params params
 * */
export const getCreditList = (params) => post('/manage/v1/listStudentRules', params)

/***
 * @author guanfenda
 * @desc 积分规则的停用启用
 * @params params
 * */
export const postCreditStartAndStop = (params) =>
  post('/manage/v1/startAndStopStudentsRulus', params)
/***
 * @author guanfenda
 * @desc 积分规则的删除
 * @params params
 * */
export const deleteCredit = (params) => post('/manage/v1/deleteStudentsRulus', params)
/***
 * @author guanfenda
 * @desc 积分规则编辑
 * @params params
 * */
export const editStudentsRulus = (params) => post('/manage/v1/editStudentsRulus', params)
/***
 * @author guanfenda
 * @desc 积分规则的新增
 * @params params
 * */
export const postAddStudentsRulus = (params) => post('/manage/v1/addStudentsRulus', params)
/***
 * @desc 手动添加积分
 * */
export const handAddScore = (params) => post('/manage/v1/handAddScore', params)
/***
 * @desc excel批量导入用户积分
 * */
export const userScoreImport = (params) => post('/manage/v1/userScoreImport', params)
/***
 * @desc excel批量导入用户积分
 * */
export const errorScoreExcelImport = (params) =>
  get('/manage/v1/errorScoreExcelImport', params, { responseType: 'blob' })
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
 * @desc 积分明细列表
 * @params params
 * */
export const getListScoreDetails = (params) => post('/manage/v1/listScoreDetails', params)
/***
 * @author guanfenda
 * @desc 删除分数
 * @params params
 * */
export const deleteScoreDetails = (params) => post('/manage/v1/deleteScoreDetails', params)
