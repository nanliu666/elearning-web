import request from '@/router/axios'


export const add = (params) => {
  return request({
    url: '/api/msg/v1/apk/add',
    method: 'post',
    params
  })
}


export const updateStatus = (params) => {
  let str = ''
	for(let key in params){
		str += `${key}=${params[key]}&`
	}
	str = str.substr(0,str.length-1)
    return request({
      url: '/api/msg/v1/apk/updateStatus?'+str,
      method: 'POST',
      params
    })
  }


  export const getAppList = (params) => {
    return request({
      url: '/api/msg/v1/apk/list',
      method: 'post',
      params
    })
  }


  export const getDetail = (params) => {
    let str = ''
	for(let key in params){
		str += `${key}=${params[key]}&`
	}
	str = str.substr(0,str.length-1)
    return request({
      url: '/api/msg/v1/apk/getDetail?'+str,
      method: 'post',
      params
    })
  }

  export const updateApp = (params) => {
    return request({
      url: '/api/msg/v1/apk/edit',
      method: 'post',
      params
    })
  }