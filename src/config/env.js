// 配置编译环境和线上环境之间的切换

let backBaseUrl = '' // 后台管理地址
let frontBaseUrl = '' // 用户前台地址
let iconfontVersion = [
  '1066523_6bvkeuqao36',
  '1857563_sw5dkyhhh1o',
  '2178669_zbls3ovulic',
  '2232073_5nxhufhqcst'
]
let iconfontUrl = '//at.alicdn.com/t/font_$key.css'
let codeUrl = `${backBaseUrl}/code`
const env = process.env
if (location.host.indexOf('localhost') !== -1) {
  backBaseUrl = '' // 本地开发环境地址(后台管理)
} else if (env.NODE_ENV == 'development') {
  backBaseUrl = '' // 线上开发环境地址(后台管理)
} else if (env.NODE_ENV == 'production') {
  backBaseUrl = '' //生产环境地址(后台管理)
} else if (env.NODE_ENV == 'test') {
  backBaseUrl = '' //测试环境地址(后台管理)
}
if (location.host.indexOf('localhost') !== -1) {
  frontBaseUrl = 'http://localhost:1888' // 本地开发环境地址（用户前台）
} else if (env.NODE_ENV == 'development') {
  frontBaseUrl = 'http://139.159.141.248:7071' // 线上开发环境地址（用户前台）
} else if (env.NODE_ENV == 'production') {
  frontBaseUrl = 'http://139.159.141.248:7071' //生产环境地址（用户前台）
} else if (env.NODE_ENV == 'test') {
  frontBaseUrl = 'http://139.159.141.248:7071' //测试环境地址（用户前台）
}
export { backBaseUrl, frontBaseUrl, iconfontUrl, iconfontVersion, codeUrl, env }
