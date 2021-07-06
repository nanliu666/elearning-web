import { del, get, post, put } from '@/router/axios'
/**
 * 知识库目录列表查询接口
 */
export const getKnowledgeCatalogList = (params) => get('/manage/v1/knowledge/catalog/list', params)
/**
 * 筛选条件创建人查询接口
 */
export const getCreatUsers = (params) => get('/manage/v1/knowledge/catalog/creatUsers', params)
/**
 * 删除目录
 */
export const deleteKnowledgeCatalog = (params) => del('/manage/v1/knowledge/catalog/delete', params)
/**
 * 停/启用目录
 */
export const updateStatusKnowledgeCatalog = (params) =>
  put('/manage/v1/knowledge/catalog/updateStatus', params)
/**
 * 新增目录
 */
export const addKnowledgeCatalog = (params) => post('/manage/v1/knowledge/catalog/add', params)
/**
 * 编辑目录
 */
export const updateKnowledgeCatalog = (params) => put('/manage/v1/knowledge/catalog/update', params)
/**
 * 知识库目录排序保存
 */
export const sortSaveKnowledgeCatalog = (params) =>
  post('/manage/v1/knowledge/catalog/sort', params)

//---------------------------------------------------------------知识管理----------------------------------------//
/**
 * 知识管理列表
 */
export const getKnowledgeManageList = (params) => get('/manage/v1/knowledge/manage/list', params)
/**
 * 知识明细
 */
export const getKnowledgeManageDetails = (params) =>
  get('/manage/v1/knowledge/manage/details', params)
/**
 * 查询标签
 */
export const getKnowledgeManageTaglist = (params) =>
  get('/manage/v1/knowledge/manage/taglist', params)
/**
 * 置顶
 */
export const topingKnowledge = (params) => put('/manage/v1/knowledge/list/toping', params)
/**
 * 上下架
 */
export const updateStatusKnowledgeList = (params) =>
  post('/manage/v1/knowledge/list/updateStatus', params)
/**
 * 删除
 */
export const deleteKnowledgeList = (params) => del('/manage/v1/knowledge/list/delete', params)
/**
 * 移动
 */
export const moveKnowledgeList = (params) => post('/manage/v1/knowledge/list/move', params)
/**
 * 新增
 */
export const addKnowledgeList = (params) => post('/manage/v1/knowledge/add', params)
/**
 * 修改
 */
export const updateKnowledge = (params) => put('/manage/v1/knowledge/update', params)
/**
 * 移动
 */
export const moveKnowledge = (params) => post('/manage/v1/knowledge/list/move', params)
/**
 * 查询知识库评价
 * @param {string} params.knowledgeId  知识库id
 * @param {string} params.pageNo  页码
 * @param {string} params.pageSize  页面数量
 */
export const getScopeList = (params) => get('/manage/v1/web/knowledge/getScopeList', params)
/**
 * 删除知识库评论
 */
export const deleteScope = (params) => get('/manage/v1/web/knowledge/deleteScope', params)

/**
 * 导出知识库评论
 */
export const exportScopeList = (params) =>
  get('/manage/v1/web/knowledge/exportScopeList', params, { responseType: 'blob' })

// 获取知识详情
export const getDetailsById = (params) => get('/api/manage/v1/knowledge/manage/details', params)
export const queryCategoryOrgList = (params) => get('/manage/v1/knowledge/catalog/list', params)
