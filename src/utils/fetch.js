// import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import store from '@/store'
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 10000, // 请求超时时间
  headers: {
  },
  withCredentials: true
})
service.interceptors.request.use(function (config) {
  if (store.getters.token) {
    config.headers['bimToken'] = store.getters.token
  }
  // 在发送请求之前做些什么
  // 随便写个值 绕过if判段
  if (config.method === 'get') {
    config.data = true
  }
  config.headers['H-TOKEN'] = '111'
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

service.interceptors.response.use(response => {
  return response
}, error => {
  if (error.response) {
    console.log(error.response.data.obj.url)
    if (error.response.data.obj.eType === '2') {
      // alert(error.response.data.obj.message)
      if (error.response.data.obj.url.indexOf('findBimMapType') !== -1) {
        alert(error.response.data.obj.message)
      }
      if (error.response.data.obj.url.indexOf('findAll') !== -1) {
        alert(error.response.data.obj.message)
      }
      router.push('/login')
      return
    }
    console.log(error.response.status)
  }
  Promise.reject(error)
})

export default service
