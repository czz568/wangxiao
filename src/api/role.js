
/**
 * 角色管理模块接口
 */

import axios from '@/libs/api.request'
import Qs from 'qs'

/**
 * @description 获取管理角色列表
 * @param {*keyword} 关键字
 * @param {*page} 页码
 * @param {*limit} 页数
 */
export const get_roleList = ({ keyword, page, limit }) => {
  return axios.request({
    url: `/admin/role/list?keyword=${keyword}&page=${page}&limit=${limit}`,
    method: 'get'
  })
}

/**
 * @description 创建角色
 */
export const create_role = (data) => {
  return axios.request({
    url: `/admin/role/create`,
    method: 'post',
    data: Qs.stringify(data)
  })
}
/**
 * @description 获取角色详情
 */
export const get_roleInfo = (id) => {
  return axios.request({
    url: `/admin/role/info/${id}`,
    method: 'get'
  })
}
/**
   * @description 获取角色权限详情
   */
export const get_rolePermission = (id) => {
  return axios.request({
    url: `/admin/role/node/list?id=${id}`,
    method: 'get'
  })
}
/**
 * @description 更新角色
 */
export const update_role = (data) => {
  return axios.request({
    url: `/admin/role/update`,
    method: 'post',
    data: Qs.stringify(data)
  })
}

/**
 * @description 删除角色
 */
export const delete_role = (data) => {
  return axios.request({
    url: `/admin/role/delete`,
    method: 'post',
    data: Qs.stringify(data)
  })
}

/**
 * @description 绑定权限
 */
export const distribut_permission = (data) => {
  return axios.request({
    url: `/admin/role/node`,
    method: 'post',
    data,
  })
}


