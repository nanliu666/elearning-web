import request, { get, post } from '@/router/axios'

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-system/dict-biz/list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

/**
 * @desc 查询年度教育经费
 */
export const getEducatList = (params) => get('/api/blade-margin/v1/education/budget/get', params)

/**
 * @desc 创建年度经费
 */
export const addEducat = (params) => post('/api/blade-margin/v1/education/budget/add', params)

/**
 * @desc 删除年度经费
 */
export const removeEducat = (params) => get('/api/blade-margin/v1/education/budget/remove', params)

/**
 * @desc 修改年度教育经费
 */
export const updateEducat = (params) => post('/api/blade-margin/v1/education/budget/update', params)

/****经费类型 **/
/**
 * @desc 添加经费类型
 */
export const addCatalogue = (params) => post('/api/blade-margin/v1/education/catalogue/add', params)

/**
 * @desc 删除经费类型
 */
export const delCatalogue = (params) =>
  get('/api/blade-margin/v1/education/catalogue/deleted', params)

/**
 * @desc 查询经费类型列表
 */
export const getCatalogueList = (params) =>
  get('/api/blade-margin/v1/education/catalogue/list', params)

/**
 * @desc 修改经费类型
 */
export const updateCatalogue = (params) =>
  post('/api/blade-margin/v1/education/catalogue/update', params)

/**
 * @desc 经费类型重复校验
 */
export const repeatCatalogue = (params) =>
  post('/api/blade-margin/v1/catalogue/budget/repeat', params)

/**
 * @desc 经费明细列表
 */
export const projectList = (params) => post('/api/blade-margin/v1/project/budget/get', params)

/**
 * @desc 经费明细删除
 */
export const delProject = (params) => get('/api/blade-margin/v1/project/budget/delete', params)

/**
 * @desc 经费明细修改
 */
export const updateProject = (params) => post('/api/blade-margin/v1/project/budget/update', params)

/**
 * @desc 经费明细修改
 */
export const addProject = (params) => post('/api/blade-margin//v1/project/budget/add', params)

/**
 * @desc 经费明细导出
 */
export const exportProject = (params) =>
  get('/api/blade-margin/v1/project/budget/export', params, { responseType: 'blob' })

/**
 * @desc 年限列表
 */
export const yearsList = (params) => get('/api/blade-margin/v1/education/budget/years', params)
