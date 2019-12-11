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
      executor(this.resolve.bind(this), this.reject.bind(this));
    }
  }

  resolve(value) {
    if (this.state === "pending") {
      this.state = "fulfilled";
      this.value = value;
      while (this.resolveCallbacks.length) {
        const onResolve = this.resolveCallbacks.pop();
        if (onResolve && typeof onResolve === "function") {
          const result = onResolve(value);
          // 如果有下一个promise，继续resolve
          if (result instanceof Promise) {
            result.then(v => {
              this.nextPromise && this.nextPromise.resolve(v);
            });
          } else {
            this.nextPromise && this.nextPromise.resolve(result);
          }
        }
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
          }
        });
      });
    } else if (this.state === "rejected") {
      // 执行then的时候状态已经是rejected
      promise = new Promise((resolve, reject) => {
        queueMicrotask(() => {
          const result = onReject(this.reason);
          if (result instanceof Promise) {
            result.then(
              v => {
                resolve(v);
              },
              r => {
                reject(r);
              }
            );
          }
        });
      });
    }
    this.nextPromise = promise;
    return promise;
  }

  reject(reason) {
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
                  this.nextPromise && this.nextPromise.resolve(v);
                },
                r => {
                  this.nextPromise && this.nextPromise.reject(r);
                }
              );
            }
          }
        }
      } else if (this.catchCallback) {
        queueMicrotask(() => {
          this.catchCallback(reason);
        });
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