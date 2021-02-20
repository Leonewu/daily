# fibonacci & factorial

fibonacci: 0, 1, 1, 2, 3, 5, 8, ...

factorial: 阶乘

## 简单实现

```javascript
function fibonacci(n) {
  if (n === 1 || n === 2) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

time complexity 计算

可以将计算过程中分解成：

f(4)

/     \

f(3)     f(2)

/ \

f(2)   f(1)

复杂度其实就是二叉树的节点个数，而节点个数可以近似看成完全二叉树的节点个数，即等比数列 2^n 的求和

2^0 + 2^1 + 2^2 + 2^3 , 求和公式为  2^ (n + 1) - 2，也就是 O(2^n)

复杂度太高

许多已经被计算过的值，被重复计算过很多次，比如当计算 f(20) 的时候 f(18) 就会被计算两次， f(20) = f(19) + f(18) = f(17) + f(18) + f(18)，依此类推，存在很多冗余的计算。

## 优化

所以我们可以将计算过的值缓存起来，即备忘录，保证相同的值只会被计算一次

```javascript
// memorization 版本
function fibonacci(v) {
  const memo= {};
  function run(n) {
    if (n === 2 || n === 1) return 1;
    if (cache[n]) return cache[n];
    memo[n] = (memo[n - 1] || run(n-1)) + (memo[n - 2] || run(n-2));
    return memo[n];
  }
  return run(v);
}
```

可以发现，从 f(1) 到 f(n) 的每个值只会被计算一次，总共计算次数为 n 次，所以时间复杂度为 O(1)

## 尾递归优化

简单实现的示例中，其实不止时间复杂度高，空间复杂度也高，存在栈溢出的问题

需要做尾递归优化，即在函数最后 return 时，才做递归，不保存本次函数执行的局部变量，降低空间复杂度。

如果没有尾递归优化局部变量会开辟新的堆栈来存储，递归次数过多会造成栈溢出

```javascript
function fibonacci(n) {
  if (n === 1 || n === 2) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
// 相当于
function fibonacci(n) {
  if (n === 1 || n === 2) return 1;
  const a = fibonacci(n - 1);
  const b = fibonacci(n - 2);
  return a + b;
}
// 在中间调用递归，在计算 b 的递归时，要保存 a 的值，如果 b 的计算路径很长，a 会一直存起来，知道 b 计算结束
// 局部变量会开辟新的堆栈来存储，递归次数过多会造成栈溢出
// 优化目的: 只用一次递归，并在函数末尾调用
function fibonacci(n, n1 = 0, n2 = 1) {
    if (n === 1) return n1;
    return fib(n - 1, n2, n1 + n2);
}
// 注意，在 memorization 版本中，也可能会出现堆栈溢出的情况，因为没有做尾递归优化
```

## 循环实现

```javascript
// 自底向上
function fibonacci(n) {
    let n1 = 0;
    let n2 = 1;
    for(let i = 1; i < n; i++) {
        [n1, n2] = [n2, n1 + n2];
    }
    return n2;
}
```

以上为 fibonacci 的几种实现，factorial 同理
总结：

1. 递归的时间复杂度可以通过画树状图来计算
2. 递归有风险，如果递归次数过多，要注意尾递归优化，无法优化，也可以通过循环去实现
3. 递归时要注意时间复杂度
4. 本文的抛砖引玉下，继续发散能够涉及到动态规划，DP table，状态转移方程，状态压缩等概念，具体可以阅读 [动态规划详解-labuladong](https://github.com/labuladong/fucking-algorithm/blob/master/%E5%8A%A8%E6%80%81%E8%A7%84%E5%88%92%E7%B3%BB%E5%88%97/%E5%8A%A8%E6%80%81%E8%A7%84%E5%88%92%E8%AF%A6%E8%A7%A3%E8%BF%9B%E9%98%B6.md)
