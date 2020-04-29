import axios from '@/libs/api.request'
import Qs from 'qs'
/**
 * @description 获取登录时的验证码和key
 */
export const get_captcha = () => {
  return axios.request({
    url: '/admin/captcha',
    method: 'get'
  })
}
/**
 * @description 登录接口
 * @param {username, password, captcha, catKey} data 登录参数
 */
export const login = (data) => {
  return axios.request({
    url: '/admin/login',
    data: Qs.stringify(data),
    method: 'post'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}
