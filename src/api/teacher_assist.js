/**
 * @description  讲师和助教模块接口
 */

import axios from '@/libs/api.request'
import Qs from 'qs'
/**
 * @description 获取老师助教列表
 */
export const get_teachList = ({ page, limit, status, nickname, mobile, teacher_type }) => {
  return axios.request({
    url: `/admin/teacher/list?teacher_type=${teacher_type}page=${page}&limit=${limit}&status=${status}&nickname=${nickname}&mobile=${mobile}`,
    method: 'get'
  })
}

/**
 * @description 新增讲师/助教
 */
export const create_teacher = (data) => {
  return axios.request({
    url: `/admin/teacher/create`,
    method: 'post',
    data: Qs.stringify(data)
  })
}

/**
 * @description 获取老师详情
 */
export const get_teacherInfo = (id) => {
  return axios.request({
    url: `/admin/teacher/info/${id}`,
    method: 'get'
  })
}
/**
 * @description 更新老师信息
 */
export const update_teacher = (data) => {
  return axios.request({
    url: `/admin/teacher/update`,
    method: 'post',
    data: Qs.stringify(data)
  })
}

/**
 * @description 老师显示隐藏
 */
export const teacher_display = (data) => {
  return axios.request({
    url: `/admin/teacher/display`,
    method: 'post',
    data: Qs.stringify(data)
  })
}
/**
 * @description 修改老师密码
 */
export const reset_teachPwd = (data) => {
  return axios.request({
    url: `/admin/teacher/update/password`,
    method: 'post',
    data: Qs.stringify(data)
  })
}
/**
 * @description 删除讲师
 */
export const delete_teacher = (data) => {
  return axios.request({
    url: `/admin/teacher/delete`,
    method: 'post',
    data: Qs.stringify(data)
  })
}
