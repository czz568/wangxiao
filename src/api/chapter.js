
/**
 * 课程章节模块接口
 */

import axios from '@/libs/api.request'
import Qs from 'qs'

/**
 * @description 课程章节列表 --包含课时
 * @param {*id} 课程id
 */
export const get_chapter_outline = (course_id) => {
  return axios.request({
    url: `/admin/course/chapter/outline?course_id=${course_id}`,
    method: 'get'
  })
}
/**
 * @description 课程章节列表 ---不包含课时
 * @param {*id} 课程id
 */
export const get_chapter_list = (course_id) => {
  return axios.request({
    url: `/admin/course/chapter/list?course_id=${course_id}`,
    method: 'get'
  })
}
/**
 * @description 创建章节
 * @param {*id} 课程id
 */
export const create_chapter = (data) => {
  return axios.request({
    url: `/admin/course/chapter/create`,
    method: 'post',
    data: Qs.stringify(data)
  })
}
/**
 * @description 更新章节
 * @param {*id} 章节id
 * @param {course_id} 课程id
 */
export const update_chapter = (data) => {
  return axios.request({
    url: `/admin/course/chapter/update`,
    method: 'post',
    data: Qs.stringify(data)
  })
}
/**
 * @description 排序章节
 */
export const sort_chapter = (data) => {
  return axios.request({
    url: `/admin/course/chapter/sort`,
    method: 'post',
    data: Qs.stringify(data)
  })
}
/**
 * @description 排序章节
 */
export const get_chapter_info = (id) => {
  return axios.request({
    url: `/admin/course/chapter/info/${id}`,
    method: 'get'
  })
}
/**
 * @description 删除章节
 */
export const delete_chapter = (data) => {
  return axios.request({
    url: `/admin/course/chapter/delete`,
    method: 'post',
    data: Qs.stringify(data)
  })
}
