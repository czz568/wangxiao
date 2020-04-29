/**
 * @description 学生模块接口
 */

import axios from '@/libs/api.request'
import Qs from 'qs'
/**
 * @description 获取学生列表
 */
export const get_studentList = ({ page, limit, status, nickname, mobile }) => {
  return axios.request({
    url: `/admin/student/list?page=${page}&limit=${limit}&status=${status}&nickname=${nickname}&mobile=${mobile}`,
    method: 'get'
  })
}

/**
 * @description 新增学生
 */
export const create_stud = (data) => {
  return axios.request({
    url: `/admin/student/create`,
    method: 'post',
    data: Qs.stringify(data)
  })
}

/**
 * @description 获取学生详情
 */
export const get_studInfo = (id) => {
  return axios.request({
    url: `/admin/student/info/${id}`,
    method: 'get'
  })
}
/**
 * @description 更新学生信息
 */
export const update_stud = (data) => {
  return axios.request({
    url: `/admin/student/update`,
    method: 'post',
    data: Qs.stringify(data)
  })
}

/**
 * @description 学生禁用启用
 */
export const stud_disable = (data) => {
  return axios.request({
    url: `/admin/student/disable`,
    method: 'post',
    data: Qs.stringify(data)
  })
}
/**
 * @description 修改学生密码
 */
export const reset_stuPwd = (data) => {
  return axios.request({
    url: `/admin/student/update/password`,
    method: 'post',
    data: Qs.stringify(data)
  })
}
/**
 * @description 删除学生
 */
export const delete_stud = (data) => {
  return axios.request({
    url: `/admin/student/delete`,
    method: 'post',
    data: Qs.stringify(data)
  })
}
