
class Promise {
  constructor(executor) {
    this._state = "pending";
    this._value = undefined;
    this._error = undefined;
    this._resolveCallback = [];
    this._rejectCallback = [];
    this._catchCallback = undefined;
    this._finallyCallback = undefined;
    if (typeof executor !== "function") {
      throw new Error("executor is not a function");
    }
    executor(this.resolve.bind(this), this.reject.bind(this));
  }
  resolve(v) {
    if (this === v) {
      throw new TypeError('refer to the same promise');
    }
    if (this._state === "pending") {
      if (v !== null && (typeof v === 'object' || typeof v === 'function')) {
        let used = false;
        try {
          // thenable 接管控制权
          const then = v.then;
          if (typeof then === 'function') {
            let promise = {};
            promise = new Promise((resolve, reject) => {
              promise.resolve = resolve;
              promise.reject = reject;
            });
            promise.then(value => {
              this.resolve(value);
            }, err => {
              this.reject(err);
            });
            // 2.3.3.3 调用 then 时的 this 需要指向对象本身
            then.call(v, a => {
              // 2.3.3.3.1
              // 如果 thenable 嵌套了 thenable
              // 如以下代码，正确输出值是 innervalue
              /* 
                {
                  then: (fulfill1) => {
                    fulfill1({
                      then: (fulfill2) => {
                        fulfill2('innervalue');
                        fulfill2('innervalue2');
                      }
                    });
                    fulfill1('outervalue');
                  }
                }
              */
              // 最外层两个 fulfill 是同步执行
              // 外层第一个 fulfill 控制权转移了，由于 promise.then 是微任务执行
              // 所以外层第二个 fulfill 马上就把值 resolve 掉了
              if (used) return;
              used = true;
              promise.resolve(a);
            }, b => {
              if (used) return;
              used = true;
              promise.reject(b);
            });
            return;
          }
        } catch (e) {
          if (!used) {
            this.reject(e);
          }
          return;
        }
      }
      this._value = v;
      this._state = "fulfilled";
      this._resolveCallback.forEach(callback => {
        queueMicrotask(() => {
          callback(this._value);
        });
      });
    }
  }
  reject(e) {
    if (this._state === "pending") {
      this._error = e;
      this._state = "rejected";
      if (this._rejectCallback.length) {
        this._rejectCallback.forEach(callback => {
          queueMicrotask(() => {
            callback(this._error);
          });
        });
      } else if (this._catchCallback) {
        queueMicrotask(() => {
          this._catchCallback(this._error);
        });
      }
    }
  }
  then(onResolve, onReject) {
    return new Promise((resolve, reject) => {
      if (this._state === "pending") {
        this._resolveCallback.push((value) => {
          if (typeof onResolve === "function") {
            try {
              const res = onResolve(value);
              resolve(res);
            } catch (e) {
              reject(e);
            }
          } else {
            resolve(value);
          }
        });
        this._rejectCallback.push((err) => {
          if (typeof onReject === "function") {
            try {
              const res = onReject(err);
              resolve(res);
            } catch (e) {
              reject(e);
            }
          } else {
            reject(err);
          }
        });
      }
      if (this._state === "fulfilled") {
        queueMicrotask(() => {
          try {
            if (typeof onResolve === "function") {
              const res = onResolve(this._value);
              resolve(res);
            } else {
              resolve(this._value);
            }
          } catch (e) {
            reject(e);
          }
        });
      }
      if (this._state === "rejected") {
        queueMicrotask(() => {
          try {
            if (typeof onReject === "function") {
              const res = onReject(this._error);
              resolve(res);
            } else {
              // 没有传 onReject 函数就继续
              reject(this._error);
            }
          } catch (e) {
            reject(e);
          }
        });
      }
    });
  }
  finally(finallyFn) {
    return new Promise((resolve, reject) => {
      if (this._state === "pending") {
        if (typeof finallyFn === "function") {
          this._finallyCallback = () => {
            try {
              const res = finallyFn();
              resolve(res);
            } catch (e) {
              reject(e);
            }
          };
        }
      }
      if (["fulfilled", "rejected"].includes(this._state)) {
        queueMicrotask(() => {
          if (typeof finallyFn === "function") {
            try {
              const res = finallyFn();
              resolve(res);
            } catch (e) {
              reject(e);
            }
          } else {
            resolve(this._value);
          }
        });
      }
    });
  }
  catch(catchFn) {
    return new Promise((resolve, reject) => {
      if (this._state === "pending") {
        if (typeof catchFn === "function") {
          this._catchCallback = (err) => {
            try {
              const res = catchFn(err);
              resolve(res);
            } catch (e) {
              reject(e);
            }
          };
        }
      }
      if (this._state === "rejected") {
        queueMicrotask(() => {
          if (typeof catchFn === "function") {
            try {
              const res = catchFn(this._error);
              resolve(res);
            } catch (e) {
              reject(e);
            }
          } else {
            resolve(this._value);
          }
        });
      }
      if (this._state === "fulfilled") {
        resolve(this._value);
      }
    });
  }
}



Promise.resolve = function (v) {
  return new Promise((r) => {
    r(v);
  });
};
Promise.reject = function (v) {
  return new Promise((_, r) => {
    r(v);
  });
};

Promise.all = function (args) {
  if (!args.length) return Promise.resolve();
  let resolvedCount = 0;
  if (args.every((p) => !(p instanceof Promise))) {
    return Promise.resolve(args);
  }
  const res = new Array(args.length);
  return new Promise((resolve, reject) => {
    for (let i = 0; i < args.length; i++) {
      let p = args[i];
      if (!(p instanceof Promise)) {
        p = Promise.resolve(args[i]);
      }
      p.then((v) => {
        res[i] = v;
        resolvedCount++;
        if (resolvedCount === args.length) {
          resolve(res);
        }
      }).catch((e) => {
        reject(e);
      });
    }
  });
};


Promise.any = function (args) {
  return new Promise((resolve, reject) => {
    if (args.length === 0) {
      reject(new AggregateError("", "No Promise in Promise.any was resolved"));
      return;
    }
    if (args.every((p) => !(p instanceof Promise))) {
      resolve(args[0]);
      return;
    }
    let isResolved = false;
    let rejectCount = 0;
    for (let p of args) {
      p.then((v) => {
        if (!isResolved) {
          resolve(v);
        }
      }).catch(() => {
        rejectCount++;
        if (rejectCount === args.length) {
          reject(
            new AggregateError("", "No Promise in Promise.any was resolved")
          );
        }
      });
    }
  });
};


Promise.allSettled = function (args) {
  return new Promise((resolve) => {
    if (args.length === 0) {
      resolve([]);
      return;
    }
    const res = [];
    let count = 0;
    for (let i = 0; i < args.length; i++) {
      let p = args[i];
      if (!(p instanceof Promise)) {
        p = Promise.resolve(args[i]);
      }
      p.then((v) => {
        res[i] = v;
      })
        .catch((e) => {
          res[i] = e;
        })
        .finally(() => {
          count++;
          if (count === args.length) {
            resolve(res);
          }
        });
    }
  });
};


Promise.race = function (args) {
  return new Promise((resolve, reject) => {
    let flag = false;
    const temp = args.find((p) => !(p instanceof Promise));
    if (temp) {
      resolve(temp);
      return;
    }
    for (let i = 0; i < args.length; i++) {
      let p = args[i];
      if (!(p instanceof Promise)) {
        p = Promise.resolve(args[i]);
      }
      p.then((v) => {
        if (!flag) {
          resolve(v);
        }
      }).catch((e) => {
        if (!flag) {
          reject(e);
        }
      });
    }
  });
};

// for promises-aplus-tests
Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
}

module.exports = Promise;