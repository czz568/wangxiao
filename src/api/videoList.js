

/**
 * @description 视频模块接口
 */

import axios from '@/libs/api.request'
import Qs from 'qs'
/**
 * @description 获取视频列表
 * @param {status} 1.已上架 2.未上架 3.已下架
 * @param {keywords} 视频名称
 * @param {page} 当前页码
 * @param {limit} 当前页条数
 */
export const get_videoList = ({  page, limit, status, keywords }) => {
  return axios.request({
    url: `/admin/video/list?page=${page}&limit=${limit}&status=${status}&keywords=${keywords}`,
    method: 'get'
  })
}
/**
 * @description 新增视频
 */
export const create_video = (data) => {
  return axios.request({
    url: `/admin/video/create`,
    method: 'post',
    data: Qs.stringify(data)
  })
}

/**
 * @description 获取视频详情
 */
export const get_videoInfo = (id) => {
  return axios.request({
    url: `/admin/video/info/${id}`,
    method: 'get'
  })
}
/**
 * @description 更新视频信息
 */
export const update_video = (data) => {
  return axios.request({
    url: `/admin/video/update`,
    method: 'post',
    data
  })
}

/**
 * @description 视频上架下架
 */
export const video_disable = (data) => {
  return axios.request({
    url: `/admin/video/index/status`,
    method: 'post',
    data: Qs.stringify(data)
  })
}
/**
 * @description 删除视频
 */
export const delete_video = (data) => {
  return axios.request({
    url: `/admin/video/delete`,
    method: 'post',
    data: Qs.stringify(data)
  })
}
