# 浏览器原理

## 浏览器内核

## 浏览器进程和线程

## 输入 url 之后发生了什么

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

- [从浏览器多进程到单进程...](https://segmentfault.com/a/1190000012925872)
- [js conf](https://www.youtube.com/watch?v=cCOL7MC4Pl0&t=752s)
