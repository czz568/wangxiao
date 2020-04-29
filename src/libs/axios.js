import axios from 'axios'
import store from '@/store'
import { Message } from 'view-design'
import { getToken, setToken } from '@/libs/util'

const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  // if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
        'Authorization': getToken()
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      Message.error({
        content: '请求超时',
        duration: 8,
        closable: true
      })
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      // 判断一下响应中是否有 token，如果有就直接使用此 token 替换掉本地的 token。你可以根据你的业务需求自己编写更新 token 的逻辑
      var token = res.headers.authorization
      if (token) {
        // 如果 header 中存在 token，那么触发 refreshToken 方法，替换本地的 token
        axios.defaults.headers.common['Authorization'] = token
        setToken(token)
      }
      this.destroy(url)
      const { data, status, message } = res.data
      if (status === 0) {
        Message.error(message)
      }
      return { data, status }
    }, error => {
      this.destroy(url)
      let errorInfo = error.response
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      // switch (error.response.status) {
      //     case 401:
      //       // 这里写清除token的代码
      //       router.replace({
      //         name: 'login',
      //         query: {redirect: router.currentRoute.fullPath}//登录成功后跳入浏览的当前页面
      //       })
      // }
    //   addErrorLog(errorInfo) // 记录错误日志
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
