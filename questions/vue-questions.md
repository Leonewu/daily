# vue

- Object.defineProperty 和 proxy 的对比，为什么 proxy 更快
- vue 的更新流程是怎样的，如 this.xxx = 1
- dom diff 过程
- $nextTick 是宏任务还是微任务，为什么？
2.4 以下 nextTick 统统是微任务，可能导致的问题：如果在 @click 事件中绑定了某个函数，函数的逻辑是 this.xxx = xxx，触发 click 时，首先是先更新 this.xxx = xxx （这部分的 dom 更新被推到微任务队列执行），然后才会冒泡到父元素（宏任务），例如这个[issue#6566](https://github.com/vuejs/vue/issues/6566)  
2.4 以上默认会走微任务，除了 dom 回调中调用的 nextTick 是宏任务之外
- 为什么 vue 默认把 dom 更新放在微任务队列
- vue 开发遇到过哪些让你印象深刻的问题？
