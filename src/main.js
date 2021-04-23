import Vue from 'vue'
import axios from './router/axios'
import VueAxios from 'vue-axios'
import App from './App'
import router from './router/router'
import './permission' // 权限
import './error' // 日志
import './cache' //页面缓存
import store from './store'
import { loadStyle } from './util/util'
import * as urls from '@/config/env'
import Element, { Message } from 'element-ui'
import { iconfontUrl, iconfontVersion } from '@/config/env'
import '@/styles/oa-custom/theme/index.css'
import './styles/common.scss'
import basicContainer from './components/basic-container/main'
import pageHeader from './components/page-header/pageHeader'
import commonForm from './components/common-form/commonForm'
import OrgSelect from './components/OrgSelect/orgSelect'
import commonTable from 'vue-common-table'
import website from '@/config/website'
// 在 main.js 中导入插件
import pdf from '@/util/jspdf'
// 注册插件
Vue.use(pdf)
import Permission from '@/directive/pcheck'
import _ from 'lodash'
import loadmore from './directive/loadmore'
Vue.prototype._ = _

import tinymce from '@/components/tinymce'

if (!HTMLCanvasElement.prototype.toBlob) {
  Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    value: function(callback, type, quality) {
      var dataURL = this.toDataURL(type, quality).split(',')[1]
      setTimeout(function() {
        var binStr = atob(dataURL),
          len = binStr.length,
          arr = new Uint8Array(len)

        for (var i = 0; i < len; i++) {
          arr[i] = binStr.charCodeAt(i)
        }

        callback(new Blob([arr], { type: type || 'image/png' }))
      })
    }
  })
}

// if (process.env.NODE_ENV !== 'production') {
//   const mock = require('@/mock')
//   mock.default(true)
// }
const $message = (options) => {
  return Message({
    ...options,
    showClose: true
  })
}
;['success', 'warning', 'info', 'error'].forEach((type) => {
  $message[type] = (options) => {
    if (typeof options === 'string') {
      options = {
        message: options,
        showClose: true
      }
    }
    options.type = type
    return Message(options)
  }
})

Vue.use(router)
Vue.use(VueAxios, axios)
Vue.use(Element)
// 自定义vue指令
Vue.use(loadmore)
Vue.use(Permission)
//注册全局容器
Vue.component('FcOrgSelect', OrgSelect)
Vue.component('basicContainer', basicContainer)
Vue.component('commonTable', commonTable)
Vue.component('tinymce', tinymce)
Vue.component('pageHeader', pageHeader)
Vue.component('commonForm', commonForm)
// 加载相关url地址
Object.keys(urls).forEach((key) => {
  Vue.prototype[key] = urls[key]
})
// 加载website
Vue.prototype.website = website
// 动态加载阿里云字体库
iconfontVersion.forEach((ele) => {
  loadStyle(iconfontUrl.replace('$key', ele))
})
Vue.prototype.$message = $message

Vue.config.productionTip = false

// 页面初始化
import init from '@/init'

new Vue({
  router,
  store,
  mounted() {
    init()
  },
  render: (h) => h(App)
}).$mount('#app')
