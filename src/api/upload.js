/* eslint-disable no-unused-vars */
import { del, get, post, put } from '@/router/axios'
import axios from 'axios'
import { uploadUrl } from '@/config/env'
/**
 * 上传
 * */

export const uploadNew = (params, config, file) => {
  const CancelToken = axios.CancelToken
  //let cancel
  let conf = {
    // Headers:{'Content-Type':'multipart/form-data'},
    cancelToken: new CancelToken(function executor(c) {
      // executor 函数接收一个 cancel 函数作为参数
      file.subscription.unsubscribe = c
    })
  }
  config = { ...config, ...conf }
  //return axios.post('/eln/upload',params, config)
  // config.CancelToken=new CancelToken(function executor(c) {
  //     // executor 函数接收一个 cancel 函数作为参数
  //     backFn = c
  // })
  return post(`${uploadUrl}/eln/upload`, params, config)
}
