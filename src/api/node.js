
/**
 * 菜单节点管理模块接口
 */

import axios from '@/libs/api.request'
import Qs from 'qs'

/**
 * @description 创建菜单节点
 */
export const create_node = (data) => {
  return axios.request({
    url: `/admin/node/create`,
    method: 'post',
    data: Qs.stringify(data)
  })
}
/**
 * @description 获取菜单节点详情
 */
export const get_nodeInfo = (id) => {
  return axios.request({
    url: `/admin/node/info/${id}`,
    method: 'get'
  })
}
/**
 * @description 更新菜单节点
 */
export const update_node = (data) => {
  return axios.request({
    url: `/admin/node/update`,
    method: 'post',
    data: Qs.stringify(data)
  })
}

/**
 * @description 删除菜单节点
 */
export const delete_node = (data) => {
  return axios.request({
    url: `/admin/node/delete`,
    method: 'post',
    data: Qs.stringify(data)
  })
}
