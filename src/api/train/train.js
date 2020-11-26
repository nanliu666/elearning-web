import { post, put, get } from '@/router/axios'
/**
 * 创建培训
 */
export const createTrain = (params) => post('/v1/train', params)
/**
 * 修改培训
 */
export const putTrain = (params) => put('/v1/train', params)
/**
 * 修改培训
 */
export const getTrainDetail = (params) => get('v1/train/getTrainDetail', params)
