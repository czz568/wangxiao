export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: '网校系统',
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: false,
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    // dev: 'http://101.132.104.123',
    dev: 'http://192.168.155.80',
    // pro: 'http://192.168.155.80'
    // dev: 'https://www.easy-mock.com/mock/5add9213ce4d0e69998a6f51/iview-admin/',
    // pro: 'https://produce.com'
  },
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home',
  /**
   * @description 需要加载的插件
   */
  plugin: {
    'error-store': {
      showInHeader: false, // 设为false后不会在顶部显示错误日志徽标
      developmentOff: false // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
    }
  },
  /**
   * @description 百度ueditor 默认配置
   */
  ueditorConfig: {
    // 编辑器不自动被内容撑高
    autoHeightEnabled: false,
    autoFloatEnabled: false,
    // 初始容器高度
    initialFrameHeight: 300,
    // 初始容器宽度
    initialFrameWidth: '100%',
    // 上传文件接口地址，为空的话则不能上传
    serverUrl: 'http://192.168.155.80/php/controller.php',
    UEDITOR_HOME_URL: '/UEditor/' // 需要令此处的URL等于对应 ueditor.config.js 中的配置。
  },
}
