import * as qiniu from 'qiniu-js'
import { getQiniuToken } from '../api/common'
import { v4 as uuidv4 } from 'uuid'

/**
 * 上传文件到七牛
 * 参考：https://developer.qiniu.com/kodo/sdk/1283/javascript
 * @param file
 * @param hooks {Object} 钩子函数
 * @param hooks.next {Function}
 * @param hooks.error {Function}
 * @param hooks.complete {Function}
 */
export async function uploadQiniu(file, hooks) {
  const suffix = file.name.substr(file.name.lastIndexOf('.'))
  const fileName = uuidv4().replace(/-/g, '') + suffix
  let observable
  let subscription
  let chunks
  const config = {
    useCdnDomain: true
  }
  try {
    chunks = qiniu.getHeadersForChunkUpload(uploadToken)
    // 获取token
    const { uploadToken, domain } = await getQiniuToken()
    observable = qiniu.upload(file, fileName, uploadToken, config, {
      fname: fileName
    })
    const completeFn = hooks.complete
    hooks.complete = function complete(res) {
      completeFn.call(hooks, { ...res, url: domain + '/' + res.key, fileName })
    }
    // 注册上传监听
    subscription = observable.subscribe(hooks)
  } catch (error) {
    hooks.error('token获取失败')
  }

  return {
    hooks,
    observable,
    subscription,
    chunks
  }
}
// 断点续传
// void (async function continuationQiniu() {
//   // const suffix = file.name.substr(file.name.lastIndexOf('.'))
//   // const fileName = uuidv4().replace(/-/g, '') + suffix
//   const { uploadToken, domain } = await getQiniuToken()
//   console.log(uploadToken, domain)
//   const params = {
//     bucketName: 'zexueyuan-test',
//     objName: 'testName',
//     host: 'up-z2.qiniup.com',
//     token: uploadToken
//   }
//   const res = await getQiniuUploadId(params)
//   console.log(res)
// })()
