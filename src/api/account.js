
/**
 * 账号管理模块接口
 */

import axios from '@/libs/api.request'
import Qs from 'qs'

/**
 * @description 获取管理账号列表
 * @param {*keyword} 关键字
 * @param {*page} 页码
 * @param {*limit} 页数
 */
export const get_accountList = ({ keyword, page, limit }) => {
  return axios.request({
    url: `/admin/list?keyword=${keyword}&page=${page}&limit=${limit}`,
    method: 'get'
  })
}

/**
 * @description 创建账号
 */
export const create_account = (data) => {
  return axios.request({
    url: `/admin/create`,
    method: 'post',
    data: Qs.stringify(data)
  })
}
/**
 * @description 获取账号详情
 */
export const get_accountInfo = (id) => {
  return axios.request({
    url: `/admin/info/${id}`,
    method: 'get',
    data: Qs.stringify(id)
  })
}
/**
 * @description 更新右边自己的密码
 */
export const updateMyPassword = (data) => {
  return axios.request({
    url: `/admin/update/password`,
    method: 'post',
    data: Qs.stringify(data)
  })
}
/**
 * @description 更新账号
 */
export const update_account = (data) => {
  return axios.request({
    url: `/admin/update`,
    method: 'post',
    data: Qs.stringify(data)
  })
}

/**
 * @description 重置管理员账号密码
 */
export const reset_accountPwd = (data) => {
  return axios.request({
    url: `/admin/reset/password`,
    method: 'post',
    data: Qs.stringify(data)
  })
}

/**
 * @description 删除账号
 */
export const delete_account = (data) => {
  return axios.request({
    url: `/admin/delete`,
    method: 'post',
    data: Qs.stringify(data)
  })
}
