import { post, put, get } from '@/router/axios'
/**
 * 创建培训
 */
export const createTrain = (params) => post('/manage/v1/train', params)
/**
 * 修改培训
 */
export const putTrain = (params) => put('/manage/v1/train', params)
/**
 * 修改培训
 */
export const getTrainDetail = (params) => get('/manage/v1/train/getTrainDetail', params)
