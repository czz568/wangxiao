
/**
 * 菜单节点管理模块接口
 */

import axios from '@/libs/api.request'
import Qs from 'qs'

/**
 * @description 获取网站配置组
 */
export const getConfigGroup = () => {
  return axios.request({
    url: `/admin/config/group`,
    method: 'get',
  })
}
/**
 * @description 获取网站表单配置
 */
export const getConfigForm = (group_id) => {
  return axios.request({
    url: `/admin/config/list/${group_id}`,
    method: 'get',
  })
}
/**
 * @description 更新网站配置
 * @params config_group_id
 * @params config {id, value}
 */
export const updateConfigForm = (data) => {
  return axios.request({
    url: `/admin/config/update`,
    method: 'post',
    data,
  })
}
