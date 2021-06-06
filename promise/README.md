
## 手写Promise过程

### 概念和流程

1. `promise`中有三种状态，`pending`，`fulfilled`，`rejected`
2. 每一个`promise`一旦`resolve`，他的状态马上变成`fulfilled`，再执行自己的`onResolve`函数后，`resolve`下一个`promise`，依次类推
3. `then`接收`onResolve`和`onReject`作为参数，如果这两个函数返回值为`promise`，则要等待这个`promise`，如果返回值不是`promise`，则将这个返回值传递给下一个`promise`
4. `then`会返回一个`promise`对象

### 测试函数

首先写一些主要的测试代码  

```
<!-- 异步 -->
new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("executor")
    resolve(1)
  }, 1000)
})
.then(value => {
  console.log("then1", value)
  return 2
})
.then(value => {
  console.log("then2", value)
})
```

```
<!-- 同步 -->
new Promise((reeolve, reject) => {
  console.log("executor")
  resolve(1)
})
.then(value => {
  console.log("then1", value)
  return 2
})
.then(value => {
  console.log("then2", value)
})
```

```
<!-- 同步 异步 嵌套promise -->
new Promise((resolve, reject) => {
  console.log("外部promise")
  resolve(1)
})
.then(value => {
  console.log("外部then1", value)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("内部promise")
      resolve(2)
    }, 1000)
  })
  .then(value => {
    console.log("内部then1", value);
    return 3
  })
  .then(value => {
    console.log("内部then2", value);
    return 4
  })
})
.then(value => {
  console.log("外部then2", value);
})
```

### 实现executor

首先要实现`new Promise(executor)`的写法，调用`promise`的构造函数，传入一个参数为`resolve`和`reject`的函数，并立即执行

```
constructor(executor) {
  this.state = "pending";
  this.value = undefined;
  this.reason = undefined;
  this.resolveCallbacks = [];
  this.nextPromise = undefined;
  if (executor && typeof executor === "function") {
    executor(this.resolve.bind(this), this.reject.bind(this));
  }
}
```

### 实现resolve

* `resolve`接受一个`value`，并且改变promise的状态
* `resolve`改变状态后，执行自己的`onResolve`回调
* 执行下一个`promise`的`resolve`，其中还要判断`onResolve`返回的是否为`promise`对象，是的话要等待这个promise

```
resolve(value) {
  if (this.state === "pending") {
    this.state = "fulfilled"
    this.value = value
    if (this.resolveCallbacks.length) {
      // 调用then中注册的onResolve回调
      while(this.resolveCallbacks.length) {
        const onResolve = this.resolveCallbacks.pop()
        const result = onResolve(value)
        if (result instanceof Promise) {
          // 如果是promise对象，调用这个promise的then
          result.then(v => {
            this.nextPromise && this.nextPromise.resolve(value)
          })
        } else {
          this.nextPromise && this.nextPromise.resolve(value)
        }
      }
    } else {
      // 没有的话就执行下一个promise的回调
      this.nextPromise && this.nextPromise.resolve(value)
    }
    
  }
}
```

### 实现then

* 如果状态已经是`fulfilled`，这个时候就马上执行`onResolve`回调
* 如果状态是`pending`，这个时候要把`onResolve`存起来
* `then`一直会返回一个`promise`对象

```
then(onResolve, onReject) {
  let promise = new Promise()
  if (this.state === "fulfilled") {
    // 如果onResolve返回的不是一个promise对象，就返回一个马上resolve的promise
    // 如果onResolve返回的是promise，就在该promise对象的then里面resolve
    promise = new Promise((resolve, reject) => {
      if (onResolve && typeof onResolve === "function") {
        const result = onResolve(this.value)
        if (result instanceof Promise) {
          result.then(value => {
            resolve(value)
          })
        } else {
          resolve(result)
        }
      } else {
        resolve(this.value)
      }
    })
  } else if (this.state === "pending") {
    if (onResolve && typeof onResolve === "function") {
      this.resolveCallbacks.push(onResolve)
    }
  }
  this.nextPromise = promise
  return promise
}
```

## 待完成

* `then`和`catch`的回调必须放到微任务队列执行的(`window.queueMicrotask`或者`proess.nextTick`)，注意不是`setTimeout`
* 添加`try catch` 和 `reject`，注意`catch`和`reject`都是异常捕获，并且发生异常的时候`catch`和`reject`会按照声明顺序，只执行一个最先声明的一个
* 添加静态方法`resolve`和`reject`

## 其他

* 完整版可以参考下面的链接
* <https://github.com/Leonewu/daily/tree/master/promise>
* 写完之后对`eventloop`，`microTask`，`macroTask`，`promise`的执行机制的理解都清晰很多了

## 参考

* [掘金  promise A+ 规范](https://juejin.im/post/5c4b0423e51d4525211c0fbc)  
* [Youtube How JavaScript Promises Work Under the Hood](https://www.youtube.com/watch?v=C3kUMPtt4hY&t=247s)  
* [MDN queueMicrotask](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_DOM_API/Microtask_guide)
