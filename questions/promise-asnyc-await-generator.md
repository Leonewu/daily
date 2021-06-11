# 异步编程

## promise

Promise 是遵循 promiseA+ 规范的异步编程范式，最大的特点就是通过链式调用的方式来控制函数调用的时序性。
优点：

- 链式调用
- 统一错误捕获
- 类方法 all, any, race, allSettled

## for await of

- for await of 的上下文执行是同步的

  ```js
  console.log('start');
  for await (p of [1,2]) {
    console.log(p)
  }
  console.log('end');
  // start 
  // 1 
  // 2 
  // end
  ```

- for await of 执行花费的时长是数组中 promise 对象执行时长最多的那个，不是所有时长的总和。即同时触发，顺序输出。

  ```js
  let p1 = new Promise((r) => setTimeout(r, 2000, 1));
  let p2 = new Promise((r) => setTimeout(r, 3000, 2));
  let start = performance.now();
  try {
    for await (p of [p1, p2]) {
      console.log(p);
    }
  } catch(e) {

  } finally {
    console.log(performance.now() - start);
  }
  // 1
  // 2
  // 3000ms
  ```

### 与 Promise.all 的小差异

Promise.all 一旦发生错误，会马上 reject  
for await of 不管是否发生错误，都会等数组中所有 promise 执行完再返回

```js
let p1 = new Promise((r) => setTimeout(r, 3000, 1));
let p2 = new Promise((_, reject) => setTimeout(reject, 2000, 2));
let start1 = performance.now();
try {
  for await (p of [p1, p2]) {
    console.log(p);
  }
} catch(e) {

} finally {
  console.log(performance.now() - start1);
}
let start2 = performance.now();
let p3 = new Promise((r) => setTimeout(r, 3000, 3));
let p4 = new Promise((_, reject) => setTimeout(reject, 2000, 4));
try {
  await Promise.all([p3, p4]).then(res => {
    console.log(res);
  });
} catch (e) {

} finally {
  console.log(performance.now() - start2);
}
// 3000
// 2000
```

所以，面试的时候不要用 for await of 去实现 Promise.all

## async 和 await 原理

async await 会对返回值进行包装

相关题目
await 执行时间不同

## generator
