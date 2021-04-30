# vue nextTick 的研究

vue 的 nextTick 源码都在一个文件 src/core/util/next-tick.js，里面有微任务和宏任务的实现，调用 nextTick 时，会根据任务去做区分，通过 useMacroTask 判断是否推入宏任务队列执行，否则就默认推入微任务队列执行

可以看出，nextTick 不止是暴露出 Vue.prototype.$nextTick 用，而且应用于 vue 的整个响应式更新过程中，包括 watcher  
所以说 nextTick 是 vue 的核心代码也不会过，通过 nextTick 的源码，可以了解到 vue 对于宏任务和微任务，dom 回调事件的处理

vue 的更新流程 this.xxx = xxx 后，调用栈为  
proxySetter => reactiveSetter => notify => update => queueWatcher => nextTick  

与 react 庞大的调度系统相比，vue 只有一个简单的 nextTick 作为任务处理中心

## 问题记录

在做虚拟列表的时候，发现通过 @scroll 绑定的效果和手动 addEventlisterner 的效果不一样，使用 @scroll 绑定会出现闪烁的现象
原因是，如果是通过 vue 模板的指令语法绑定 dom 事件，在触发的函数中产生的状态更新都会被推到宏任务队列执行

```vue
<template>
  <div @scroll="onScroll"></div>
</template>
<script>
  export default {
    data: () => ({
      count: 0
    }),
    methods: {
      onScroll(e) {
        console.log(1)
        this.count++
        console.log(2)
      }
    }
  }
</script>
```

上面的 this.count++ 引发的 dom 更新（）会在宏任务队列完成，可以看成 `setTimeout(() => { this.count++ }, 0)`

假设 onScroll 中有改变了 data 中某个属性的代码，并且
使用 refs 去访问 dom 对象可能会产生闪烁？$nextTick 调用的时机不准确，全靠手动调
