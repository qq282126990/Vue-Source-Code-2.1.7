/* @flow */

import {initProxy} from './proxy'
import {initState} from './state'
import {initRender} from './render'
import {initEvents} from './events'
import {initLifecycle, callHook} from './lifecycle'
import {mergeOptions} from '../util/index'

let uid = 0

export function initMixin (Vue: Class<Component>) {
  // 处理Vue实例对象，以及做一些初始化的工作
  Vue.prototype._init = function (options?: Object) {
    // 在this上定义两个属性 _uid 和 _isVue
    const vm: Component = this

    // 设置每一个新的vue实例都是一个新的实例
    // a uid
    vm._uid = uid++

    // 一个标志可以避免这种情况的发生
    // a flag to avoid this being observed
    vm._isVue = true

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
      /* 合并选项
       * mergeOptions 方法的
       * 第一个参数就是 Vue.options。
       * 第二个参数是我们调用Vue构造函数时的参数选项
       * 第三个参数是 vm 也就是 this 对象
       * 最终options如下
       vm.$options = mergeOptions(
         {
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
         },
         // 调用Vue构造函数时传入的参数选项 options
         {
             el: '#app',
             data: {
               a: 1,
               b: [1, 2, 3]
             }
         },
         // this
         vm
       )
       */

      vm.$options = mergeOptions(
        // 解析构造器选项
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }

    //  _init() 方法合并完选项之后的代码：
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }

    // 暴露Vue.self
    // expose real self
    vm._self = vm

    /* 上面的代码，在生产环境下会为实例添加两个属性，并且属性值都为实例本身
     * vm._renderProxy = vm
     * vm._self = vm
     */

    /*
    * 初始化生命周期钩子
    * this.$parent = parent
      this.$root = parent ? parent.$root : this

     this.$children = []
     this.$refs = {}

     this._watcher = null
     this._inactive = false
     this._isMounted = false
     this._isDestroyed = false
     this._isBeingDestroyed = false
    * */
    initLifecycle(vm)
    /*
    * 初始化事件方法
    * this._events = {}
      this._updateListeners = function(){}
      在 initEvents 中除了添加属性之外，
      如果有 vm.$options._parentListeners 还要调用 vm._updateListeners() 方法
    * */
    initEvents(vm)
    // 回调生命周期钩子 beforeCreate
    callHook(vm, 'beforeCreate')
    /*
    * 初始化状态
    * this._watchers = []
      // initData
      this._data

      在 initState 中又调用了一些其他init方法
      vm._watchers = []
      initProps(vm)
      initMethods(vm)
      initData(vm)
      initComputed(vm)
      initWatch(vm)
    * */
    initState(vm)
    // 回调生命周期钩子 created
    callHook(vm, 'created')
    /*
    * 初始化渲染
    * this.$vnode = null // the placeholder node in parent tree
      this._vnode = null // the root of the child tree
      this._staticTrees = null
      this.$slots
      this.$scopedSlots
      this._c
      this.$createElement

      最后在 initRender 中如果有 vm.$options.el 还要调用 vm.$mount(vm.$options.el)
      if (vm.$options.el) {
         vm.$mount(vm.$options.el)
      }
      这就是为什么如果不传递 el 选项就需要手动 mount 的原因了
    * */
    initRender(vm)

    // 看到这里，也就明白了为什么 created 的时候不能操作DOM了
    // 这个时候还没有渲染真正的DOM元素到文档中
    // created 仅仅代表数据状态的初始化完成
  }
}

function initInternalComponent (vm: Component, options: InternalComponentOptions) {
  const opts = vm.$options = Object.create(vm.constructor.options)
  // 这样做是因为它比动态枚举更快。
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
