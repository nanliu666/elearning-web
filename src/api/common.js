import request from '@/router/axios'
/**
 * 七牛云上传凭证获取接口
 * @param {Object} params - 不需要参数
 * */
export const getQiniuToken = (params) => {
  return request({
    url: '/api/common/v1/upload/token',
    method: 'get',
    params
  })
}
// 获取uploadId
export const getQiniuUploadId = (params) => {
  return request({
    url: `http://up-z2.qiniup.com/${params.bucketName}/myBucket/objects/${params.objName}/uploads`,
    method: 'post',
    host: params.host,
    Authorization: params.token
  })
}
