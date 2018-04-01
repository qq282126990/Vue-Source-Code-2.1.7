// 导入已经在原型上加载了方法和属性后的Vue
import Vue from './instance/index'
// 导入全局API
import { initGlobalAPI } from './global-api/index'
// 导入服务渲染
import { isServerRendering } from 'core/util/env'

/*
 * 该方法作用是在Vue构造函数上面挂载静态属性和方法
 * // 导出Vue的全部配置
 * Vue.config
 *
 * // 一些工具方法
 * Vue.util
 *
 * // 在一个对象上设置一个属性。 添加新的属性和
 * Vue.set = set
 *
 * // 删除一个属性，并在必要时触发更改。
 * Vue.delete = del
 *
 * // 推迟任务以异步执行它。
 * Vue.nextTick = util.nextTick
 *
 * // 组件可以拥有的资源列表。包含 Vue 实例
 * Vue.options = {
 components: {
 KeepAlive
 },
 directives: {},
 filters: {},
 _base: Vue
 }
 *
 * // 安装 Vue.js 插件。如果插件是一个对象，必须提供 install 方法。如果插件是一个函数，它会被作为 install 方法。install 方法调用时，会将 Vue 作为参数传入
 * Vue.use
 *
 * // 全局注册一个混入，影响注册之后所有创建的每个 Vue 实例。
 * Vue.mixin
 *
 * Vue.cid = 0
 *
 * // 使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象。
 * Vue.extend
 *
 * // 注册或获取全局组件。注册还会自动使用给定的id设置组件的名称
 * Vue.component = function(){}
 *
 * // 注册或获取全局指令。
 * Vue.directive = function(){}
 *
 * // 注册或获取全局过滤器。
 * Vue.filter = function(){}
 *
 * // 当前 Vue 实例是否运行于服务器。
 * Vue.prototype.$isServer
 *
 * // 版本号
 * Vue.version = '__VERSION__'
 * */
initGlobalAPI(Vue)

// 在Vue.prototype上挂载 $isServer
Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
})

// 挂载版本属性
Vue.version = '__VERSION__'

export default Vue