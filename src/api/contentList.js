
/**
 * 运营栏目模块接口
 */

import axios from '@/libs/api.request'
import Qs from 'qs'


/**
 * @description 获取内容列表
 * @param {*keyword} 关键字
 * @param {*page} 页码
 * @param {*limit} 页数
 */
export const get_contentList = ({ page, limit, client_type, recommend_channel_id }) => {
    return axios.request({
      url: `/admin/recommend/list?page=${page}&limit=${limit}&recommend_channel_id=${recommend_channel_id}&client_type=${client_type}`,
      method: 'get'
    })
}
/**
 * @description 创建内容
 * @param {name}
 * @param {client_link client_type}
 * @param {recommend_channel_id}
 * @param {img}
 * @param {img2}
 * @param {sort}
 * @param {intro}
 */
export const create_content = (data) => {
  return axios.request({
    url: `/admin/recommend/create`,
    
    method: 'post',
    data: Qs.stringify(data)
  })
}
/**
 * @description 获取内容详情
 */
export const get_contentInfo = (id) => {
  return axios.request({
    url: `/admin/recommend/info/${id}`,
    method: 'get',
  })
}
/**
 * @description 更新内容
 */
export const update_content = (data) => {
  return axios.request({
    url: `/admin/recommend/update`,
    method: 'post',
    data
  })
}

/**
 * @description 上架下架内容
 */
export const change_contentStatus = (data) => {
  return axios.request({
    url: `/admin/recommend/index/status`,
    method: 'post',
    data,
  })
}
/**
 * @description 刪除内容
 */
export const delete_content = (data) => {
  return axios.request({
    url: `/admin/recommend/delete`,
    method: 'post',
    data,
  })
}