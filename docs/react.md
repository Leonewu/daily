# react

react 内存中存再两棵树，workinProgress 和 current

## react fiber

fiber 是 react 对每个 dom 节点的抽象数据结构。其中，`return` 指向父节点，`sibling` 指向右节点，`child` 指向第一个子节点，通过这样一种链表的数据结构将每个 fiber 节点串联起来。

### 与 jsx 的关系

render 函数返回的是 jsx 对象，即调用 createElement 返回的对象。

1. 在首次渲染阶段，会根据该对象生成 workinProgress 的 Fiber 节点
2. 在更新阶段，会用该对象与当前组件对应的 current Fiber 做对比，生成该组件新的 workinProgress Fiber 节点。



## 首次渲染流程

1. 递归调用 performUnitWork(workInProgress)，包含 beginWork，completeWork 两个步骤，performUnitWork 会不断往下创建 fiber 节点  
beginwork 传入 returnFiber，current，创建当前节点（returnFiber）的第一个子节点  
completework 创建 dom 元素，设置属性，completework 递归执行完之后，此时内存中已经有一棵 dom 树
附录：react 对每个 fiber 节点都会有 effect 标记，如 placement
上面的情况的 fiber 的节点为，fiberRootNode-rootFiber(app)-div...，首次渲染，只需要对 app 打上 placement 的标记。

## 更新流程
