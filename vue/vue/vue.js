
// 变化通知 observer(setter) => dep => watcher => view
// 依赖收集 Observer(getter)中注册
// 用dep是为了方便，所以在上下文定义一个dep，方便get和set同时使用
// 在watcher初始化的时候，去绑定依赖
// 注意事项： 不能在声明get和set的同时声明writable和value
// 实现效果： 
// let vm = new Vue({
  // data: {
  // }, 
  // el: document.querySelector('#app')
// })


import compile from './compile.js'
import Observer from './observer.js'


export default class Vue {
  constructor(opts) {
    this.el = opts.el
    this.data = opts.data
    this.init()
    this.proxyData(opts.data)
  }

  proxyData(data) {
    // vm.data.name = 'leone' 可以直接写成 vm.name = 'leone' 
    // 将data的key挂载在this上面去
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        configurable: true,
        enumerable: true,
        get() {
          return this.data[key]
        },
        set(newVal) {
          this.data[key] = newVal
        }
      })   
    })
  }

  init() {
    new Observer(this.data)
    compile(this.el, this.data, this)
  }
}
