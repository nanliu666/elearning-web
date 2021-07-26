// 配置编译环境和线上环境之间的切换
let systemName = '易宝教育管理后台' // 系统名称
var isQiNiu = false // 判断是用七牛(true)还是用内部(false)上传
let baseUploadUrl = {
  // 内部上传服务，各环境上传地址
  dev: 'https://file-test.epro-edu.com',
  sit: 'https://file-test.epro-edu.com',
  pro: 'https://file-test.epro-edu.com',
  zehui: 'https://file-test.epro-edu.com',
  xugong: 'https://xlms-file.xcmg.com:11443'
}

let backBaseUrl = '' // 后台管理地址
let frontBaseUrl = '' // 用户前台地址
let iconfontVersion = [
  '2232073_jslvmfqvu2g',
  '1857563_sw5dkyhhh1o',
  '2178669_zbls3ovulic',
  '2232073_tpxdts67v'
]
let iconfontUrl = '//at.alicdn.com/t/font_$key.css'
let codeUrl = `${backBaseUrl}/code`
const env = process.env
let uploadUrl = env.VUE_APP_ENV ? baseUploadUrl[env.VUE_APP_ENV] : baseUploadUrl.sit

if (env.VUE_APP_ENV == 'dev') {
  backBaseUrl = 'http://172.16.4.55:8081' // 深圳本地开发环境地址(后台管理)
} else if (env.VUE_APP_ENV == 'sit') {
  backBaseUrl = 'https://admin-test.epro-edu.com/' // 深圳本地开发环境地址(后台管理)
  systemName = '徐工管理后台' //临时修改
} else if (env.VUE_APP_ENV == 'pro') {
  backBaseUrl = 'http://172.16.0.16:8081' //生产环境地址(后台管理)
} else if (env.VUE_APP_ENV == 'zehui') {
  backBaseUrl = 'http://admin.zexueyuan.com.cn' //泽汇生产环境地址（后台管理）
  systemName = '泽学院管理后台'
} else if (env.VUE_APP_ENV == 'xugong') {
  backBaseUrl = 'https://xlms-manager.xcmg.com:12443' //徐工环境地址（后台管理）
  systemName = '徐工管理后台'
}

if (env.VUE_APP_ENV == 'dev') {
  frontBaseUrl = 'http://172.16.4.55:7071' // 深圳本地开发环境地址（用户前台）
} else if (env.VUE_APP_ENV == 'sit') {
  frontBaseUrl = 'https://user-test.epro-edu.com' // 线上sit环境地址（用户前台）
} else if (env.VUE_APP_ENV == 'pro') {
  frontBaseUrl = 'http://172.16.0.16:7071' //生产环境地址（用户前台）
} else if (env.VUE_APP_ENV == 'zehui') {
  frontBaseUrl = 'https://user.zexueyuan.com.cn' //泽汇生产环境地址（用户前台）
} else if (env.VUE_APP_ENV == 'xugong') {
  frontBaseUrl = 'https://xlms-web.xcmg.com:12443' //徐工环境地址（用户前台）
}

// 预览地址
const previewUrl = 'https://convert.zexueyuan.com.cn/fcscloud/composite/httpfile'
export {
  backBaseUrl,
  frontBaseUrl,
  iconfontUrl,
  iconfontVersion,
  codeUrl,
  env,
  systemName,
  isQiNiu,
  uploadUrl,
  previewUrl
}
