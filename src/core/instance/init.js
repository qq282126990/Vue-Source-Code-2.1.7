/* @flow */

import { initProxy } from './proxy'
import { initState } from './state'
import { initRender } from './render'
import { initEvents } from './events'
import { initLifecycle, callHook } from './lifecycle'
import { mergeOptions } from '../util/index'

let uid = 0

export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    // 在this上定义两个属性 _uid 和 _isVue
    const vm: Component = this

    // 一个uid
    // a uid
    vm._uid = uid++

    // 一个标志可以避免这种情况的发生
    // a flag to avoid this being observed
    vm._isVue = true

    console.log(options)
    console.log(options._isComponent)

    // 合并选项 Vue 内部使用
    // merge options
    if (options && options._isComponent) {
      // 优化内部组件实例
      // 因为动态选项合并很慢
      // 并且内部组件选项都不需要特殊处理

      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.

      // 安装Component组件
      initInternalComponent(vm, options)
    }
    // 使用策略对象合并参数选项
    else {
      // 合并选项
      // mergeOptions 方法的
      // 第一个参数就是 Vue.options。
      // 第二个参数是我们调用Vue构造函数时的参数选项
      // 第三个参数是 vm 也就是 this 对象
      vm.$options = mergeOptions(
        // 解析构造器选项
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    initLifecycle(vm)
    initEvents(vm)
    callHook(vm, 'beforeCreate')
    initState(vm)
    callHook(vm, 'created')
    initRender(vm)
  }
}

function initInternalComponent (vm: Component, options: InternalComponentOptions) {
  const opts = vm.$options = Object.create(vm.constructor.options)
  // doing this because it's faster than dynamic enumeration.
  opts.parent = options.parent
  opts.propsData = options.propsData
  opts._parentVnode = options._parentVnode
  opts._parentListeners = options._parentListeners
  opts._renderChildren = options._renderChildren
  opts._componentTag = options._componentTag
  opts._parentElm = options._parentElm
  opts._refElm = options._refElm
  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}

export function resolveConstructorOptions (Ctor: Class<Component>) {
  /*
  * 接收一个参数ctor，通过传入的vm.constructor 可以知道其实是vue的构造函数本身
  * Vue.options
  * 如下
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
  let options = Ctor.options

  // 判断是否定义了 Vue.super，这个是用来处理继承的
  if (Ctor.super) {
    const superOptions = Ctor.super.options
    const cachedSuperOptions = Ctor.superOptions
    const extendOptions = Ctor.extendOptions
    if (superOptions !== cachedSuperOptions) {
      // super option changed
      Ctor.superOptions = superOptions
      extendOptions.render = options.render
      extendOptions.staticRenderFns = options.staticRenderFns
      extendOptions._scopeId = options._scopeId
      options = Ctor.options = mergeOptions(superOptions, extendOptions)
      if (options.name) {
        options.components[options.name] = Ctor
      }
    }
  }

  // 直接返回了 Vue.options, 传递给 mergeOptions 方法的第一个参数就是 Vue.options
  return options
}
