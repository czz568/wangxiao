
/**
 * @description 公共开放接口
 */
import axios from '@/libs/api.request'
import Qs from 'qs'
/**
 * @description 获取省市区
 */
export const get_area = (pid) => {
  return axios.request({
    url: `/admin/area/${pid}`,
    method: 'get'
  })
}
/**
 * @description 获取各个模块枚举
 * @param {module} student
 * @param {module} teacher
 * @param {module} course
 */
export const get_enum = (module) => {
  return axios.request({
    url: `admin/get/enum/${module}`,
    method: 'get'
  })
}

//  获取权限菜单
export const get_nodeList = () => {
  return axios.request({
    url: '/admin/node',
    method: 'get'
  })
}

/**
 * @description 获取各种上传类型token
 * @param {type} file  文件token
 * @param {type} image  图片token
 * @param {type} video  视频token
 */
export const get_qiniuToken = (type) => {
  return axios.request({
    url: `admin/get/qiniu/token?type=${type}`,
    method: 'get'
  })
}
