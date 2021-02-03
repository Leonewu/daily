
import Dep from './dep.js'

export default class Observer {

  constructor(data) {
    this.observe(data)
  }

  /* 对data对象的每一个属性进行get和set劫持 */
  defineReactive(data, key, val) {
    this.observe(val)
    const dep = new Dep()
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get() {
        if (Dep.target) {
          // 收集依赖
          dep.addDep(Dep.target)
        }
        return val
      },
      set(newVal) {
        if (val === newVal) return
        val = newVal
        console.log('newVal', newVal);
        dep.notify(newVal)
      }
    })
  }

  /* 对data对象的每一个属性进行get和set的劫持 */
  observe(data) {
    if (Object.prototype.toString.call(data) !== '[object Object]') {
      return
    }
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }

}
