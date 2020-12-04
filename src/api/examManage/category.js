import { del, get, post, put } from '@/router/axios'
/**
 * 分类查询接口
 * */
export const getCategoryList = (params) => get('/manage/v1/evaluation/category', params)
/**
 * 修改分类
 * */
export const putCategory = (params) => put('/manage/v1/evaluation/category', params)
/**
 * 删除分类
 * */
export const delCategory = (params) => del('/manage/v1/evaluation/category', params)
/**
 * 新增分类接口
 * */
export const postCategory = (params) => post('/manage/v1/evaluation/category', params)
/**
 * 分类查询接口
 * */
export const ableCategory = (params) => put('/manage/v1/evaluation/category/able', params)
