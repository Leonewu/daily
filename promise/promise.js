


const queueMicrotask = window.queueMicrotask ? window.queueMicrotask : (process && process.nextTick ? process.nextTick : function() {
  console.error('浏览器没有queueMicrotask方法')
})

class Promise {

  constructor(executor) {
    this.state = "pending";
    this.resolveCallbacks = [];
    this.rejectCallbacks = [];
    this.nextPromise = undefined;
    this.value = undefined;
    this.reason = undefined;
    this.catchCallback = undefined;
    if (executor && typeof executor === "function") {
      try {
        executor(this._resolve.bind(this), this._reject.bind(this));
      } catch (e) {
        this._reject(e)
      }
    }
  }

  static resolve(value) {
    return new Promise((resolve, reject) => {
      resolve(value);
    });
  }

  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason);
    });
  }

  _resolve(value) {
    if (this.state === "pending") {
      this.state = "fulfilled";
      this.value = value;
      try {
        if (this.resolveCallbacks.length) {
          while (this.resolveCallbacks.length) {
            const onResolve = this.resolveCallbacks.pop();
            if (onResolve && typeof onResolve === "function") {
              const result = onResolve(value);
              // 如果有下一个promise，继续resolve
              if (result instanceof Promise) {
                result.then(v => {
                  this.nextPromise && this.nextPromise._resolve(v);
                });
              } else {
                this.nextPromise && this.nextPromise._resolve(result);
              }
            }
          }
        } else {
          // 如果回调是空的，value就一直传递下去
          this.nextPromise && this.nextPromise._resolve(value);
        }
      } catch (error) {
        this._reject(error)
      }
    }
  }

  then(onResolve, onReject) {
    // then 一直都会返回一个新的promise
    let promise = new Promise();
    if (this.state === "pending") {
      // 异步，存到队列中
      if (onResolve && typeof onResolve === "function") {
        this.resolveCallbacks.push(onResolve);
      }
      if (onReject && typeof onReject === "function") {
        this.rejectCallbacks.push(onReject);
      }
    } else if (this.state === "fulfilled") {
      // 执行then的时候状态已经是fulfilled
      promise = new Promise((resolve, reject) => {
        queueMicrotask(() => {
          try {
            if (onResolve && typeof onResolve === "function") {
              const result = onResolve(this.value);
              if (result instanceof Promise) {
                result.then(
                  v => {
                    resolve(v);
                  },
                  r => {
                    reject(r);
                  }
                );
              } else {
                resolve(result);
              }
            } else {
              resolve(this.value)
            }
          } catch (error) {
            reject(error)
          }
        });
      });
    } else if (this.state === "rejected") {
      // 执行then的时候状态已经是rejected
      promise = new Promise((resolve, reject) => {
        queueMicrotask(() => {
          try {
            if (onReject && typeof onReject === "function") {
              const result = onReject(this.reason);
              if (result instanceof Promise) {
                // 注意这里的result是内部return的promise的最后一个then返回的promise
                // 所以其实不管哪个promise的resolveCallbacks，长度都只是1或者0
                result.then(
                  v => {
                    resolve(v);
                  },
                  r => {
                    reject(r);
                  }
                  );
                }
            } else {
              reject(this.reason)
            }
          } catch (error) {
            reject(error)
          }
        });
      });
    }
    this.nextPromise = promise;
    return promise;
  }

  _reject(reason) {
    if (this.state === "pending") {
      this.state = "rejected";
      this.reason = reason;
      if (this.rejectCallbacks.length) {
        // reject的优先级比catch高，如果有onReject，就执行onReject
        while (this.rejectCallbacks.length) {
          const onReject = this.rejectCallbacks.pop();
          if (onReject) {
            const result = onReject(reason);
            if (result instanceof Promise) {
              result.then(
                v => {
                  this.nextPromise && this.nextPromise._resolve(v);
                },
                r => {
                  this.nextPromise && this.nextPromise._reject(r);
                }
              );
            }
          }
        }
      } else if (this.catchCallback) {
        queueMicrotask(() => {
          this.catchCallback(reason);
        });
      } else {
        // 如果catch没有回调或者then中的onReject是空的，reason就一直传递下去
        this.nextPromise && this.nextPromise._reject(reason);
      }
    }
  }

  catch(catchCallback) {
    if (catchCallback && typeof catchCallback === "function") {
      this.catchCallback = catchCallback;
    }
    if (this.state === "rejected") {
      // 如果已经是rejected就马上执行
      queueMicrotask(() => {
        this.catchCallback(this.reason);
      });
    }
    return new Promise();
  }

  all() {

  }

  race() {

  }

}

module.exports = Promise