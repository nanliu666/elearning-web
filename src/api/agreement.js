import { get, post } from '@/router/axios'

export const listTrainAgreement = (params) =>
  get('api/blade-margin/v1/trainAgreement/listTrainAgreement', params)
export const listTrain = (params) => get('api/blade-margin/v1/trainAgreement/listTrain', params)
export const returnTrainUser = (params) =>
  get('api/blade-margin/v1/trainAgreement/returnTrainUser', params)
export const getTrainAgreement = (params) =>
  get('api/blade-margin/v1/trainAgreement/getTrainAgreement', params)
export const save = (data) => post('api/blade-margin/v1/trainAgreement/save', data)
export const del = (data) => post('api/blade-margin/v1/trainAgreement/trainAgreementdelete', data)
export const editTrainAgreementUser = (data) =>
  post('api/blade-margin/v1/trainAgreement/editTrainAgreementUser', data)
export const trainAgreementBreak = (data) =>
  post('api/blade-margin/v1/trainAgreement/trainAgreementBreak', data)
export const trainAgreementSign = (data) =>
  post('api/blade-margin/v1/trainAgreement/trainAgreementSign', data)
