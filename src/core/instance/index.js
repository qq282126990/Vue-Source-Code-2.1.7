import { initMixin } from './init' // 初始化相关代码
import { stateMixin } from './state' // 状态相关代码
import { renderMixin } from './render' // 渲染相关代码
import { eventsMixin } from './events' // 事件相关代码
import { lifecycleMixin } from './lifecycle' // 生命周期相关代码
import { warn } from '../util/index' // 错误警告提示相关代码

// 定义Vue构造函数
function Vue (options) {
  // 安全模式处理告诉开发者必须使用 new 操作符调用 Vue。
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }

  // 将参数options 传入进_init()
  this._init(options)
}

// 引入依赖，定义Vue构造函，然后以Vue构造函数为参数调用这5个方法

/**
 * 初始化相关
 * Vue.prototype._init = function (options?: Object) {}
 * */
initMixin(Vue)

/*
 * 状态相关
 * // Vue 实例观察的数据对象。Vue 实例代理了对其 data 对象属性的访问。
 * Vue.prototype.$data
 *
 * // 设置对象的属性。如果对象是响应式的，确保属性被创建后也是响应式的，同时触发视图更新。这个方法主要用于避开 Vue 不能检测属性被添加的限制。
 * Vue.prototype.$set = set
 *
 * // 删除对象的属性。如果对象是响应式的，确保删除能触发更新视图。这个方法主要用于避开 Vue 不能检测到属性被删除的限制，但是你应该很少会使用它。
 * Vue.prototype.$delete = del
 *
 * // 回调函数得到的参数为新值和旧值。表达式只接受监督的键路径。对于更复杂的表达式，用一个函数取代。
 * Vue.prototype.$watch = function (){}
 * */
stateMixin(Vue)

/**
 * 事件相关
 * // 监听当前实例上的自定义事件。事件可以由vm.$emit触发。回调函数会接收所有传入事件触发函数的额外参数。
 * Vue.prototype.$on = function (event: string, fn: Function): Component {}
 *
 * // 监听一个自定义事件，但是只触发一次，在第一次触发之后移除监听器
 * Vue.prototype.$once = function (event: string, fn: Function): Component {}
 *
 * // 移除自定义事件监听器
 * Vue.prototype.$off = function (event?: string, fn?: Function): Component {}
 *
 * // 触发当前实例上的事件。附加参数都会传给监听器回调
 * Vue.prototype.$emit = function (event: string): Component {}
 * */
eventsMixin(Vue)

/*
 * 生命周期相关
 * // 挂载 beforeMount和mounted生命钩子
 * Vue.prototype._mount = function (el?: Element | void,hydrating?: boolean): Component {}
 *
 * // 挂载 beforeUpdate和updated生命钩子
 * Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {}
 *
 * // 更新props、propsData、$listeners、$forceUpdate、$slots、$parent、$children等详细请参见该方法
 * Vue.prototype._updateFromParent = function (propsData: ?Object,listeners: ?Object,parentVnode: VNode,renderChildren: ?Array<VNode>) {}
 *
 * // 迫使 Vue 实例重新渲染。注意它仅仅影响实例本身和插入插槽内容的子组件，而不是所有子组件。
 * Vue.prototype.$forceUpdate = function () {}
 *
 * // 完全销毁一个实例。清理它与其它实例的连接，解绑它的全部指令及事件监听器。
 * // 触发 beforeDestroy 和 destroyed 的钩子
 * Vue.prototype.$destroy = function () {}
 * */
lifecycleMixin(Vue)

/*
 * 渲染相关
 *
 * // 将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。它跟全局方法 Vue.nextTick 一样，不同的是回调的 this 自动绑定到调用它的实例上。
 * Vue.prototype.$nextTick = function (fn: Function) {}
 *
 * // 字符串模板的代替方案，允许你发挥 JavaScript 最大的编程能力。该渲染函数接收一个 createElement 方法作为第一个参数用来创建 VNode。
 * Vue.prototype._render
 *
 * // toString方法
 * Vue.prototype._s = _toString
 *
 * // 将文本转换为vnode
 * Vue.prototype._v = createTextVNode
 *
 * // number转换
 * Vue.prototype._n = toNumber
 *
 * // 创建一个空节点
 * Vue.prototype._e = createEmptyVNode
 *
 * // 检查两个值是否宽松相等 —— 也就是说，如果它们是纯对象，它们是否具有相同的形状？
 * Vue.prototype._q = looseEqual
 *
 * // 寻找该数组对应值的索引值，如果找到了，返回索引值；否则返回 -1
 * Vue.prototype._i = looseIndexOf
 *
 * // 渲染静态节点
 * Vue.prototype._m = function renderStatic (index: number,isInFor?: boolean): VNode | Array<VNode> {}
 *
 * // 将节点标记为静态（v-once）只渲染元素和组件一次。随后的重新渲染，元素/组件及其所有的子节点将被视为静态内容并跳过。这可以用于优化更新性能。
 * Vue.prototype._o = function markOnce () {}
 *
 * // 过滤器 filters
 * Vue.prototype._f = function resolveFilter (id) {}
 *
 * // 渲染v-for
 * Vue.prototype._l = function renderList (){}
 *
 * // 渲染Slot
 * Vue.prototype._t = function (){}
 *
 * // 调用 v-bind 方法
 * Vue.prototype._b = function bindProps (data: any,tag: string,value: any,asProp?: boolean): VNodeData {}
 *
 * // 检查 v-on 建码
 * Vue.prototype._k = function checkKeyCodes (
 * */
renderMixin(Vue)

// 最后导出Vue
export default Vue