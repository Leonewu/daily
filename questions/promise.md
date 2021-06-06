# Promise

promise 是一种异步编程范式，遵循 promiseA+ 规范

## 手写 promise

大致的思路如下，由简入繁：

1. 实现 Promise 的同步 resolve 时的情况
2. 链式调用
3. then 方法返回 promise 实例时，需要转换控制权
4. 值穿透，当没有传入函数时，会穿透到下一个 then
5. 异步
6. catch
7. finally

手写 promise 的关键在于 then 方法的处理，以下为 promise 的一个最简单的雏形，只是覆盖了同步 resolve 的情况，虽然只有 70 行代码，但已经表达出了 promise 的核心思路。

```js
class Promise1 {
  constructor(exector) {
    this._state = 'pending';
    this._value = undefined;
    this._error = undefined;
    if (typeof exector === 'function') {
      exector(this.resolve.bind(this), this.reject.bind(this));
    }
  }
  resolve(v) {
    if (this._state === 'pending') {
      this._value = v;
      this._state = 'fulfilled';
    }
  }
  reject(v) {
    if (this._state === 'pending') {
      this._error = v;
      this._state = 'rejected';
    }
  }
  then(onResolve, onReject) {
    return new Promise1((resolve, reject) => {
      // 同步 resolve
      if (this._state === 'fulfilled') {
        if (typeof onResolve === 'function') {
          try {
            const res = onResolve(this._value);
            if (res instanceof Promise1) {
              // 如果返回的是 promise，控制权交给这个 promise，等待这个 promise
              res.then((v) => {
                resolve(v);
              }, (e) => {
                reject(e);
              })
            } else {
              // 不是的话就将返回值传给下一个
              resolve(res);
            }
          } catch(e) {
            // 调用 onResolve 出现错误
            reject(e);
          }
        } else {
          // 没有传入 onResolve 函数，值穿透
          resolve(this._value);
        }
      }
      if (this._state === 'rejected') {
        // 同步 reject
      }
      if (this._state === 'pending') {
        // 异步，将 onResolve/onReject 存起来
      }
    });
  }
}
```

完整版可以参考[这里]('https://github.com/Leonewu/daily/blob/master/promise/promise.js')

### Q & A

Q: 为什么 then 方法链式调用不是 return this，而是返回一个新的 promise 实例？  
A: 假设我们用 return this，那么整个链条只会有一个 primise 实例，所有的 then 回调都只能存储在该实例的回调队列中。当中间有控制权转换时（即链式调用过程中返回一个新的 promise 对象），那该 promise 的状态就就会无可避免地发生变更，这会导致维护回调队列成本的增加。例如：当已经是 fulfilled 状态的 promise 的 then 方法中返回了一个 rejected 的 promise，此时 promise 的状态需要由 fulfilled 变成 rejected。
然而，如果在 then 方法中返回新的 promise 对象，每一个对象只需关注自身的状态和回调，是完全独立的，这显然更加清晰。

## Promise 类方法的实现

类方法的实现比较简单，并且实现的思路基本是一致的  
在 MDN 文档中，我们会看到返回值有**已完成的promise**和**异步完成的promise**，如 Promise.all 的返回值阐述
>Promise.all 返回值
>
> - 如果传入的参数是一个空的可迭代对象，则返回一个已完成（already resolved）状态的 Promise。
> - 如果传入的参数不包含任何 promise，则返回一个异步完成（asynchronously resolved） Promise。注意：Google Chrome 58 在这种情况下返回一个已完成（already resolved）状态的 Promise。
> - 其它情况下返回一个处理中（pending）的Promise。这个返回的 promise 之后会在所有的 promise 都完成或有一个 promise 失败时异步地变为完成或失败。 见下方关于“Promise.all 的异步或同步”示例。返回值将会按照参数内的 promise 顺序排列，而不是由调用 promise 的完成顺序决定。
>
以上例子中的两种不同的返回值，可以通过以下代码直观地看出来

```js
// 同步已完成的 promise
var a = Promise.all([]);
console.log(a); 
// Promise {<fulfilled>: Array(0)}
// 打印出 promise 的状态是 fulfilled

// 异步已完成的 promise
var b = Promise.all([1]);
console.log(b); 
// Promise {<pending>}
// 打印出 promise 的状态是 pending
```

### Promise.all

[Promise.all]('https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all') 传入为一个数组，返回一个 promise，该 promise 只有在全部成功时才会 resolve，并且将结果的数组作为 resolve 的参数；如果其中一个失败，则将失败的原因 reject 出去。Promise.all 传入的数组中如果有任意一个 promise 失败了，会立刻 reject。  
需要注意的细节：

- 当传入空数组时，则返回一个已完成的 promise
- 当传入的数组包含非 Promise 对象时，将该对象作为结果返回
- Promise.all 执行的总时间不是所有 promise 的叠加，而是最长的 promise 花费的时间
- 当有某个 promise 失败时，promise.all 花费的时间是失败的 promise 的时间

所以，不能用 for await of 去实现，因为无论成功和失败，for await 的执行时间为最长的 promise 花费的时间。

```js
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
// for await 版本，执行时长是不准确的
// Promise.all2 = function (args) {
//   return new Promise(async (resolve, reject) => {
//     if (args.length === 0) {
//       resolve();
//       return;
//     }
//     const res = [];
//     try {
//       for await (const p of args) {
//         res.push(p);
//       }
//       resolve(res);
//     } catch (e) {
//       reject(e);
//     }
//   });
// };
```

测试用例

```js
var p1 = new Promise((resolve,reject)=> setTimeout(resolve, 6000, 1));
var p2 = new Promise((resolve,reject)=> setTimeout(resolve, 3000, 2));
console.time();
Promise.all2([p1, p2]).then((values) => {
  console.timeEnd();
  console.log(values);
}).catch(e => {
  console.log(e);
  console.timeEnd();
});
// [1, 2]  
// 6000ms

var p3 = new Promise((resolve,reject)=> setTimeout(resolve, 6000, 3));
var p4 = new Promise((resolve,reject)=> setTimeout(reject, 3000, 4));
console.time();
Promise.all2([p3, p4]).then((values) => {
  console.timeEnd();
  console.log(values);
}).catch(e => {
  console.log(e);
  console.timeEnd();
});
// 4   
// 3000ms
```

### Promise.allSettled

[Promise.allSettled]('https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled')传入一个 promise 的可迭代对象，返回每一个 promise 的结果，无论是成功还是失败。

```js
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
```

### Promise.any

[Promise.any]('https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/any')接收一个Promise 可迭代对象，只要其中的一个 promise 成功，就返回那个已经成功的 promise 。如果可迭代对象中没有一个 promise 成功（即所有的 promises 都失败/拒绝），就返回一个失败的 promise 和AggregateError类型的实例。

```js
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
```

### Promise.race

[Promise.race]('https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/race')接收一个 promise 的可迭代队形，返回一个 promise，一旦迭代器中的某个 promise 成功或失败，返回的 promise 就会成功或失败，即返回最先成功或失败的结果。

```js

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
```
