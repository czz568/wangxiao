
/**
 * 课时课时模块接口
 */

import axios from '@/libs/api.request'
import Qs from 'qs'

/**
 * @description 创建课时
 * @param {*course_id} 课程主表ID
 * @param {*course_chapter_id} 课程章节表ID
 * @param {*title} 名称
 * @param {*start_play} 上课时间
 * @param {*play_time} 本节课程时间（分钟）
 * @param {*end_play} 下课时间
 * @param {*teacher_id} 老师/助教ID
 * @param {*advance_time} 提前进入教室时间/分钟 0表示任意时间
 * @param {*is_playback} 是否支持查看回放 1支持 2不支持
 * @param {*is_try_see} 是否可以试看 1支持 2不支持
 * @param {*items_teacher} 是否可以试看 1支持 2不支持
 * @param {*items_datum} 讲义
 */
export const create_class = (data) => {
  return axios.request({
    url: `/admin/course/items/create`,
    method: 'post',
    data: Qs.stringify(data)
  })
}

/**
 * @description 创建课时
 * @param {*id} 课时id
 * @param {*course_id} 课程主表ID
 * @param {*course_chapter_id} 课程章节表ID
 * @param {*title} 名称
 * @param {*start_play} 上课时间
 * @param {*play_time} 本节课程时间（分钟）
 * @param {*end_play} 下课时间
 * @param {*teacher_id} 老师/助教ID
 * @param {*advance_time} 提前进入教室时间/分钟 0表示任意时间
 * @param {*is_playback} 是否支持查看回放 1支持 2不支持
 * @param {*is_try_see} 是否可以试看 1支持 2不支持
 * @param {*items_teacher} 是否可以试看 1支持 2不支持
 * @param {*items_datum} 讲义
 */
export const update_class = (data) => {
  return axios.request({
    url: `/admin/course/items/update`,
    method: 'post',
    data: Qs.stringify(data)
  })
}

/**
 * @description 获取课时详情
 * @param {id} 获取课时id
 */
export const get_classInfo = (id) => {
  return axios.request({
    url: `/admin/course/items/info/${id}`,
    method: 'get',
    data: Qs.stringify(id)
  })
}
/**
 * @description 排序课时
 */
export const sort_class = (data) => {
  return axios.request({
    url: `/admin/course/items/sort`,
    method: 'post',
    data: Qs.stringify(data)
  })
}

/**
 * @description 删除课时
 * @param {id} 课时id
 */
export const delete_class = (data) => {
  return axios.request({
    url: `/admin/course/items/delete`,
    method: 'post',
    data: Qs.stringify(data)
  })
}
