
/**
 * @description 公共开放接口
 */
import axios from '@/libs/api.request'
import Qs from 'qs'
/**
 * @description 获取属性 ----带有顶级类目
 * @param {	3 学生 4 老师 5前台直播 6前台小视频 0全部 }
 */
export const get_attributeList = () => {
  return axios.request({
    url: `/admin/attr/list`,
    method: 'get'
  })
}
/**
 * @description 获取属性 ----不带顶级类目
 * @param {	3 学生 4 老师 5前台直播 6前台小视频 0全部 }
 */
export const get_attribute = ({ type }) => {
  return axios.request({
    url: `/admin/attr/attribute/${type}`,
    method: 'get'
  })
}
/**
 * @description 新增属性
 * @param {	name } 属性名称
 * @param {	sort } 排序字段
 * @param {	pid } 属性父ID
 */
export const create_attribute = (data) => {
  return axios.request({
    url: `/admin/attr/create`,
    method: 'post',
    data: Qs.stringify(data)
  })
}
/**
 * @description 获取属性详情
 * @param {	id } 属性id
 */
export const get_attributeInfo = (id) => {
  return axios.request({
    url: `/admin/attr/info/${id}`,
    method: 'get'
  })
}

/**
 * @description 更新属性
 * @param {	name } 属性名称
 * @param {	is_show_front } 是否前端展示 1:展示 2:不展示
 * @param {	type } 属性值类型 1:单选 2:多选
 * @param {	is_required } 是否必填 1:必填 2:选填
 * @param {	sort } 排序字段
 * @param {	pid } 属性父ID
 * @param {	module } 所属模块 1:学员模块 2:课程模块 3:讲师模块
 */
export const update_attribute = (data) => {
  return axios.request({
    url: `/admin/attr/update`,
    method: 'post',
    data: Qs.stringify(data)
  })
}

/**
 * @description 删除属性
 * @param {	id } 属性id
 */
export const delete_attribute = (data) => {
  return axios.request({
    url: `/admin/attr/delete`,
    method: 'post',
    data: Qs.stringify(data)
  })
}
