/**
 * @description 课程模块接口
 */

import axios from '@/libs/api.request'
import Qs from 'qs'
/**
 * @description 获取课程列表
 * @param {course_type} 1:大班课 2:点播课
 * @param {teacher_Id} 讲师Id
 * @param {status} 1.已上架 2.未上架 3.已下架
 * @param {title} 课程名称
 * @param {page} 当前页码
 * @param {limit} 当前页条数
 */
export const get_courseList = ({ course_type, page, limit, status, title, teacher_Id }) => {
  return axios.request({
    url: `/admin/course/list?course_type=${course_type}&teacher_Id=${teacher_Id}&page=${page}&limit=${limit}&status=${status}&title=${title}`,
    method: 'get'
  })
}
/**
 * @description 获取课程列表
 * @param {course_type} 1:大班课 2:点播课
 * @param {teacher_Id}  讲师Id
 * @param {type}  打包类型
 * @param {status} 1.已上架 2.未上架 3.已下架
 * @param {title} 课程名称
 * @param {page} 当前页码
 * @param {limit} 当前页条数
 */
export const get_course_packList = ({ course_type, page, limit, status, title, type, teacher_Id }) => {
  return axios.request({
    url: `/admin/course/list?course_type=${course_type}&teacher_Id=${teacher_Id}&type=${type}&page=${page}&limit=${limit}&status=${status}&title=${title}`,
    method: 'get'
  })
}

/**
 * @description 新增课程
 */
export const create_course = (data) => {
  return axios.request({
    url: `/admin/course/create`,
    method: 'post',
    data: Qs.stringify(data)
  })
}

/**
 * @description 获取课程详情
 */
export const get_courseInfo = (id) => {
  return axios.request({
    url: `/admin/course/info/${id}`,
    method: 'get'
  })
}
/**
 * @description 更新课程信息
 */
export const update_course = (data) => {
  return axios.request({
    url: `/admin/course/update`,
    method: 'post',
    data
  })
}

/**
 * @description 课程上架下架
 */
export const course_disable = (data) => {
  return axios.request({
    url: `/admin/course/status`,
    method: 'post',
    data: Qs.stringify(data)
  })
}
/**
 * @description 删除课程
 */
export const delete_course = (data) => {
  return axios.request({
    url: `/admin/course/delete`,
    method: 'post',
    data: Qs.stringify(data)
  })
}
