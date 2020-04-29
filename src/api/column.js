
/**
 * 运营栏目模块接口
 */

import axios from '@/libs/api.request'
import Qs from 'qs'

/**
 * @description 获取栏目列表
 * @param {*keyword} 关键字
 * @param {*page} 页码
 * @param {*limit} 页数
 */
export const get_columnList = ({ page, limit }) => {
  return axios.request({
    url: `/admin/recommend/channel/list?page=${page}&limit=${limit}`,
    method: 'get'
  })
}

/**
 * @description 创建栏目
 */
export const create_column = (data) => {
  return axios.request({
    url: `/admin/recommend/channel/create`,
    method: 'post',
    data: Qs.stringify(data)
  })
}
/**
 * @description 获取栏目详情
 */
export const get_columnInfo = (id) => {
  return axios.request({
    url: `/admin/recommend/channel/info/${id}`,
    method: 'get',
  })
}
/**
 * @description 更新栏目
 */
export const update_column = (data) => {
  return axios.request({
    url: `/admin/recommend/channel/update`,
    method: 'post',
    data: Qs.stringify(data)
  })
}

/**
 * @description 上架下架栏目
 */
export const change_columnStatus = (data) => {
  return axios.request({
    url: `/admin/recommend/channel/index/status`,
    method: 'post',
    data,
  })
}
/**
 * @description 上架下架栏目
 * 
 */
export const delete_column = (data) => {
  return axios.request({
    url: `/admin/recommend/channel/delete`, 
    method: 'post',
    data,
  })
}
