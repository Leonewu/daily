## 参考
[掘金  promise A+ 规范](https://juejin.im/post/5c4b0423e51d4525211c0fbc)  
[Youtube How JavaScript Promises Work Under the Hood](https://www.youtube.com/watch?v=C3kUMPtt4hY&t=247s)  
[MDN queueMicrotask](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_DOM_API/Microtask_guide)

## 总结
* 每一个`then`都会返回一个新的`promise`
* 链式调用时，`promise`是逐个从状态`pending`变成`fulfilled`/`rejected`的
* 链式调用的`promise`处理有两种情况，一种是一直`resolve`，没有碰到`return new Promise`，这种情况下，一旦`resolve`了之后，就会不断地去调用下一个`promise`的`resolve`函数；另一种是`then`中`return new Promise`的情况，这种情况会用一个`promise`将这个`return的promise`包住，当`return的promise`的最后一个`then`已经`resolve`后，再去`resolve`外面的`promise`
* 不管是`onResolve`，`onReject`，`catch`，都不是同步执行，而是放到microtask执行
* `catch`的回调和then的`onReject`都是对错误的捕获，优先级是`onReject` > `catch`