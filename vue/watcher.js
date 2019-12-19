
import Dep from './dep.js'
export default class Watcher {

  constructor(vm, exp, cb) {
    this.vm = vm
    this.exp = exp
    this.cb = cb
    this.value = this.init()
  }

  update(newVal) {
    // 更新视图
    console.log('update', this.vm.data[this.exp]);
    if (this.cb) {
      this.cb.call(this.vm, newVal)
    }
  }

  init() {
    Dep.target = this
    let value = this.vm.data[this.exp]
    this.value = value
    Dep.target = null
    return value
  }

}