
class Promise {
  constructor(executor) {
    this._state = "pending";
    this._next = undefined;
    this._value = undefined;
    this._error = undefined;
    this._resolveCallback = undefined;
    this._rejectCallback = undefined;
    this._catchCallback = undefined;
    this._finallyCallback = undefined;
    if (typeof executor !== "function") {
      throw new Error("executor is not a function");
    }
    executor(this.resolve.bind(this), this.reject.bind(this));
  }
  resolve(v) {
    if (this._state === "pending") {
      this._value = v;
      this._state = "fulfilled";
      if (this._resolveCallback) {
        queueMicrotask(() => {
          this._resolveCallback(this._value);
        });
      }
    }
  }
  reject(e) {
    if (this._state === "pending") {
      this._error = e;
      this._state = "rejected";
      const callback = this._rejectCallback || this._catchCallback;
      if (callback) {
        queueMicrotask(() => {
          callback(this._error);
        });
      }
    }
  }
  then(onResolve, onReject) {
    return new Promise((resolve, reject) => {
      if (this._state === "pending") {
        if (typeof onResolve === "function") {
          this._resolveCallback = (value) => {
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
              } else {
                resolve(res);
              }
            } catch (e) {
              reject(e);
            }
          };
        }
        if (typeof onReject === "function") {
          this._rejectCallback = (err) => {
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
              } else {
                resolve(res);
              }
            } catch (e) {
              reject(e);
            }
          };
        } else {
          reject(this._error);
        }
      }
      if (this._state === "fulfilled") {
        if (typeof onResolve === "function") {
          try {
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
      if (this._state === "rejected") {
        if (typeof onReject === "function") {
          try {
            const res = onReject(this._error);
            if (res instanceof Promise) {
              res.then(
                (v) => {
                  resolve(v);
                },
                (e) => {
                  resolve(e);
                }
              );
            } else {
              resolve(res);
            }
          } catch (e) {
            reject(e);
          }
        } else {
          // 没有传 onReject 函数就继续
          reject(this._error);
        }
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
