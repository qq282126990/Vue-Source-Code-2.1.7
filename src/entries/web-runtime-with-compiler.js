/* @flow */

import Vue from './web-runtime'
import { warn, cached } from 'core/util/index'
import { query } from 'web/util/index'
import { shouldDecodeNewlines } from 'web/util/compat'
import { compileToFunctions } from 'web/compiler/index'

// 缓存Template模板
const idToTemplate = cached(id => {
  const el = query(id)
  return el && el.innerHTML
})

// 缓存来自 web-runtime.js 文件的 $mount 函数 =》获取到对应元素的内容
const mount = Vue.prototype.$mount

// 覆盖了 Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)

  /* istanbul ignore if */
  // 判断是否有节点
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options

  // 解析 模板/el 并转换为渲染函数
  // resolve template/el and convert to render function
  if (!options.render) {
    let template = options.template
    // 如果有传入 template模板
    if (template) {
      // 判断是否 template 是否是字符串
      if (typeof template === 'string') {
        // 如果模板template第一个字符是 # 就返回错误
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      }
      // 如果不是字符串就获取template里面的内容 ：如<template></template>
      else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    }
    // 如果没有传入template模板，就把 el节点 转换成模板字符串
    else if (el) {
      template = getOuterHTML(el)
    }
    // Vue 上挂载 compile
    // compileToFunctions 函数的作用，就是将模板 template 编译为render函数。
    if (template) {
      const { render, staticRenderFns } = compileToFunctions(template, {
        warn,
        shouldDecodeNewlines,
        delimiters: options.delimiters
      }, this)

      options.render = render
      options.staticRenderFns = staticRenderFns
    }
  }

  return mount.call(this, el, hydrating)
}

/**
 * 获取元素的外部HTML，注意
 * IE中的SVG元素
 * 输出外部HTML
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el: Element): string {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))

    return container.innerHTML
  }
}

Vue.compile = compileToFunctions

export default Vue
