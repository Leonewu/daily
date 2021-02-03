export default class Dep {
  
  static target = null

  constructor() {
    this.subs = []
    this.target = null
  }

  addDep(sub) {
    this.subs.push(sub)
  }

  notify(newVal) {
    this.subs.forEach(sub => {
      sub.update(newVal)
    })
  }

}