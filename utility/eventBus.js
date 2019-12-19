class EventBus {

  constructor() {
    this.listeners = {}
  }

  _addListener(type, callback, once = false) {
    if (callback && typeof callback === 'function') {
      if (type) {
        if (!this.listeners[type]) {
          this.listeners[type] = []
        }
        this.listeners[type].push({
          callback,
          once,
          times: 0
        })
      }
    }
  }

  once(type, callback) {
    this._addListener(type, callback, true)
  }

  on(type, callback) {
    this._addListener(type, callback, false)
  }

  emit(type) {
    if (type && this.listeners[type]) {
      const listeners = this.listeners[type]
      listeners.forEach(listener => {
        if (!listener.once || (listener.once && listener.times === 0)) {
          listener.callback()
          listener.times++
        }
      })
    }
  }

  off(type, callback) {
    if (type && this.listeners[type]) {
      const listeners = this.listeners[type]
      this.listeners[type] = listeners.filter(listener => listener.callback !== callback)
    }
  }

}