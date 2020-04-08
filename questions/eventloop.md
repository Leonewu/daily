## 事件循环

## macrotask 和 microtask
* setTimeout 是将回调放在下一次宏任务的顶部
* Promise.resolve，MutationObserver，queueMicrotask 都是放在下一次微任务的顶部
## Dom 更新在哪个阶段
* 渲染进程和 js 引擎进程是互斥的，所以渲染会发生在 js 计算后
## requestAnimationFrame
## 流程
1. js 计算（ macroTask, microTask ）
2. requestAnimationFrame
3. style computed
4. layout
5. paint
## hack
1. 嵌套两个 requestAnimationFrame 的函数会在下下次渲染之前执行，即本次 styleComputed-layout-paint，执行，下次 styleComputed-layout-paint
2. 读取一些属性，会强制提前渲染
## 参考
* [从浏览器多进程到单进程...](https://segmentfault.com/a/1190000012925872)
* [js conf](https://www.youtube.com/watch?v=cCOL7MC4Pl0&t=752s)