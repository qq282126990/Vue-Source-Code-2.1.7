/* @flow */

import Vue from 'core/index'
import config from 'core/config'
import {extend, noop} from 'shared/util'
import {devtools, inBrowser, isEdge} from 'core/util/index'
import {patch} from 'web/runtime/patch'
import platformDirectives from 'web/runtime/directives/index'
import platformComponents from 'web/runtime/components/index'
import {
  query,
  isUnknownElement,
  isReservedTag,
  getTagNamespace,
  mustUseProp
} from 'web/util/index'

/*
 * install platform specific utils
 *
 * 覆盖Vue.config的值
 *
 * isUnknownElement 获取元素
 * isReservedTag 获取标签
 * getTagNamespace 获取标签名称
 * mustUseProp 获取标签定义
 * */
Vue.config.isUnknownElement = isUnknownElement
Vue.config.isReservedTag = isReservedTag
Vue.config.getTagNamespace = getTagNamespace
Vue.config.mustUseProp = mustUseProp


/*
 * 安装平台运行时指令和组件
 * install platform runtime directives & components
 *
 * 包含 Vue 实例可用指令的哈希表。
 * Vue.options.directives(componentUpdated、inserted、bind、unbind、update)
 *
 * 包含 Vue 实例可用组件
 * Vue.options.components(KeepAlive、Transition、TransitionGroup)
 *
 * Vue.options变化为
 *
 * Vue.options = {
   components: {
     KeepAlive,
     Transition,
     TransitionGroup
   },
   directives: {
     model,
     show
   },
   filters: {},
  _base: Vue
 }
 * */
extend(Vue.options.directives, platformDirectives)
extend(Vue.options.components, platformComponents)

/*
 * 安装补丁功能
 * install platform patch function
 * */
Vue.prototype.__patch__ = inBrowser ? patch : noop

/*
 * 手动地挂载一个未挂载的实例。
 * wrap mount
 * */
Vue.prototype.$mount = function (el?: string | Element,
                                 hydrating?: boolean): Component {
  // 根据浏览器环境决定用不用 query(el)获取元素
  el = el && inBrowser ? query(el) : undefined

  // 然后将 el 作为参数传递给 this._mount()
  return this._mount(el, hydrating)
}

/*
 * 配置是否允许 vue-devtools 检查代码。开发版本默认为 true，生产版本默认为 false。生产版本设为 true 可以启用检查。
 * devtools global hook
 * */

/* istanbul ignore next */
setTimeout(() => {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue)
    } else if (
      process.env.NODE_ENV !== 'production' &&
      inBrowser && !isEdge && /Chrome\/\d+/.test(window.navigator.userAgent)
    ) {
      console.log(
        'Download the Vue Devtools for a better development experience:\n' +
        'https://github.com/vuejs/vue-devtools'
      )
    }
  }
}, 0)

export default Vue
