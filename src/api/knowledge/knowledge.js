import { get, post } from '@/router/axios'
/**
 * 知识库目录列表查询接口
 */
export const getKnowledgeCatalogList = (params) => get('/manage/v1/knowledge/catalog/list', params)
/**
 * 筛选条件创建人查询接口
 */
export const getKnowledgeCreatUsers = (params) =>
  get('/manage/v1/knowledge/catalog/creatUsers', params)
/**
 * 删除目录
 */
export const deleteKnowledgeCatalog = (params) =>
  post('/manage/v1/knowledge/catalog/delete', params)
/**
 * 停/启用目录
 */
export const updateStatusKnowledgeCatalog = (params) =>
  post('/manage/v1/knowledge/catalog/updateStatus', params)
/**
 * 新增目录
 */
export const addKnowledgeCatalog = (params) => post('/manage/v1/knowledge/catalog/add', params)
/**
 * 编辑目录
 */
export const updateKnowledgeCatalog = (params) =>
  post('/manage/v1/knowledge/catalog/update', params)
/**
 * 知识库目录排序保存
 */
export const sortSaveKnowledgeCatalog = (params) =>
  post('/manage/v1/knowledge/catalog/sortSave', params)
