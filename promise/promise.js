
class Promise {
  constructor(executor) {
    this._state = "pending";
    // this._value = undefined;
    // this._error = undefined;
    // this._resolveCallback = undefined;
    // this._rejectCallback = undefined;
    // this._catchCallback = undefined;
    // this._finallyCallback = undefined;
    if (typeof executor !== "function") {
      throw new Error("executor is not a function");
    }
    executor(this.resolve.bind(this), this.reject.bind(this));
  }
  resolve(v) {
    if (this._state === "pending") {
      if (v instanceof Promise) {
        v.then(value => {
          this.resolve(value);
        }, err => {
          this.reject(err);
        });
        return;
      }
      if (v !== null && (typeof v === 'object' || typeof v === 'function')) {
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
          try {
            then.call(promise, promise.resolve.bind(promise), promise.reject.bind(promise));
          } catch (e) {
            this.reject(e);
          }
          return;
        }
      }
      this._value = v;
      this._state = "fulfilled";
      if (this._resolveCallback) {
        queueMicrotask(() => {
          try {
            this._resolveCallback(this._value);
          } catch (e) {
            this._state = 'pending';
            this.reject(e);
          }
        });
      }
    }
  }
  reject(e) {
    if (this._state === "pending") {
      if (e instanceof Promise) {
        e.then(value => {
          this.resolve(value);
        }, err => {
          this.reject(err);
        });
        return;
      }
      if (e !== null && (typeof e === 'object' || typeof e === 'function')) {
        const then = e.then;
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
          try {
            then.call(promise, promise.resolve.bind(promise), promise.reject.bind(promise));
          } catch (e) {
            this.reject(e);
          }
          return;
        }
      }
      this._error = e;
      this._state = "rejected";
      const callback = this._rejectCallback || this._catchCallback;
      if (callback) {
        queueMicrotask(() => {
          try {
            callback(this._error);
          } catch (e) {
            this._state = 'pending';
            this.reject(e);
          }
        });
      }
    }
  }
  then(onResolve, onReject) {
    return new Promise((resolve, reject) => {
      if (this._state === "pending") {
        this._resolveCallback = (value) => {
          if (typeof onResolve === "function") {
            try {
              const res = onResolve(value);
              if (res instanceof Promise) {
                res.then(
                  (v) => {
                    resolve(v);
                  },
                  (e) => {
                    reject(e);
                  }
                );
              } else if (res !== null && (typeof res === 'object' || typeof res === 'function')) {
                const then = res.then;
                if (typeof then === 'function') {
                  let promise = {};
                  promise = new Promise((a, b) => {
                    promise.resolve = a;
                    promise.reject = b;
                  });
                  promise.then(v => {
                    resolve(v);
                  }, e => {
                    reject(e);
                  });
                  then.call(promise, promise.resolve.bind(promise), promise.reject.bind(promise));
                } else {
                  resolve(res);
                }
              } else {
                resolve(res);
              }
            } catch (e) {
              reject(e);
            }
          } else {
            resolve(value);
          }
        };
        this._rejectCallback = (err) => {
          if (typeof onReject === "function") {
            try {
              const res = onReject(err);
              if (res instanceof Promise) {
                res.then(
                  (v) => {
                    resolve(v);
                  },
                  (e) => {
                    reject(e);
                  }
                );
              } else if (res !== null && (typeof res === 'object' || typeof res === 'function')) {
                const then = res.then;
                if (typeof then === 'function') {
                  let promise = {};
                  promise = new Promise((a, b) => {
                    promise.resolve = a;
                    promise.reject = b;
                  });
                  promise.then(v => {
                    resolve(v);
                  }, e => {
                    reject(e);
                  });
                  then.call(promise, promise.resolve.bind(promise), promise.reject.bind(promise));
                }
              } else {
                resolve(res);
              }
            } catch (e) {
              reject(e);
            }
          } else {
            reject(err);
          }
        };
      }
      if (this._state === "fulfilled") {
        queueMicrotask(() => {
          try {
            if (typeof onResolve === "function") {
              const res = onResolve(this._value);
              if (res instanceof Promise) {
                // 返回实例是 promise，等待这个 promise
                res.then(
                  (v) => {
                    resolve(v);
                  },
                  (e) => {
                    reject(e);
                  }
                );
              } else if (res !== null && (typeof res === 'object' || typeof res === 'function')) {
                const then = res.then;
                if (typeof then === 'function') {
                  let promise = {};
                  promise = new Promise((a, b) => {
                    promise.resolve = a;
                    promise.reject = b;
                  });
                  promise.then(v => {
                    resolve(v);
                  }, e => {
                    reject(e);
                  });
                  then.call(promise, promise.resolve.bind(promise), promise.reject.bind(promise));
                } else {
                  resolve(res);
                }
              } else {
                resolve(res);
              }
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
              if (res instanceof Promise) {
                res.then(
                  (v) => {
                    resolve(v);
                  },
                  (e) => {
                    reject(e);
                  }
                );
              } else if (res !== null && (typeof res === 'object' || typeof res === 'function')) {
                const then = res.then;
                if (typeof then === 'function') {
                  let promise = {};
                  promise = new Promise((a, b) => {
                    promise.resolve = a;
                    promise.reject = b;
                  });
                  promise.then(v => {
                    resolve(v);
                  }, e => {
                    reject(e);
                  });
                  then.call(promise, promise.resolve.bind(promise), promise.reject.bind(promise));
                }
              } else {
                resolve(res);
              }
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
              if (res instanceof Promise) {
                res.then(
                  (v) => {
                    resolve(v);
                  },
                  (e) => {
                    reject(e);
                  }
                );
              } else {
                resolve();
              }
            } catch (e) {
              reject(e);
            }
          };
        }
      }
      if (["fulfilled", "rejected"].includes(this._state)) {
        if (typeof finallyFn === "function") {
          try {
            const res = finallyFn();
            if (res instanceof Promise) {
              res.then(
                (v) => {
                  resolve(v);
                },
                (e) => {
                  reject(e);
                }
              );
            } else {
              resolve();
            }
          } catch (e) {
            reject(e);
          }
        } else {
          resolve(this._value);
        }
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
              if (res instanceof Promise) {
                res.then(
                  (v) => {
                    resolve(v);
                  },
                  (e) => {
                    reject(e);
                  }
                );
              } else {
                resolve(res);
              }
            } catch (e) {
              reject(e);
            }
          };
        }
      }
      if (this._state === "rejected") {
        if (typeof catchFn === "function") {
          try {
            const res = catchFn(this._error);
            if (res instanceof Promise) {
              reject.then(
                (v) => {
                  resolve(v);
                },
                (e) => {
                  reject(e);
                }
              );
            } else {
              resolve(res);
            }
          } catch (e) {
            reject(e);
          }
        } else {
          resolve(this._value);
        }
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

Promise.all1 = function (args) {
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


Promise.any1 = function (args) {
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


Promise.allSettled1 = function (args) {
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


Promise.race1 = function (args) {
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

Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
      dfd.resolve = resolve;
      dfd.reject = reject;
  });
  return dfd;
}

module.exports = Promise;