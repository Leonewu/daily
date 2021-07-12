# react

react 内存中存再两棵树，workinProgress 和 current

## react fiber

fiber 是 react 对每个 dom 节点的抽象数据结构。其中，`return` 指向父节点，`sibling` 指向右节点，`child` 指向第一个子节点，通过这样一种链表的数据结构将每个 fiber 节点串联起来。

### 双缓存机制

每一个 fiber 节点有 current 属性，current 指向上一次更新时的 fiber 节点。  
在 mount 阶段，current 为 null。在 update 阶段，current 不为 null。

### beginwork 和 completework

mount 阶段：

- beginwork：根据 jsx 对象，往下创建 fiber 节点，打上 effectTag
- completework：创建 fiber 节点对应的 dom 示例，保存在 stateNode 属性中
update 阶段：

### 与 jsx 的关系

render 函数返回的是 jsx 对象，即调用 createElement 返回的对象。

1. 在首次渲染阶段，会根据该对象生成 workinProgress 的 Fiber 节点
2. 在更新阶段，会用该对象与当前组件对应的 current Fiber 做对比，生成该组件新的 workinProgress Fiber 节点。

### 执行流程

1. 调用 reactDOM.render(<App />, document.getElementById('app'))

2. 创建唯一根节点 fiberRoot 将 jsx 对象

## 首次渲染流程

1. 递归调用 performUnitWork(workInProgress)，包含 beginWork，completeWork 两个步骤，performUnitWork 会不断往下创建 fiber 节点  
beginwork 传入 returnFiber，current，创建当前节点（returnFiber）的第一个子节点  
completework 创建 dom 元素，设置属性，completework 递归执行完之后，此时内存中已经有一棵 dom 树
附录：react 对每个 fiber 节点都会有 effect 标记，如 placement
上面的情况的 fiber 的节点为，fiberRootNode-rootFiber(app)-div...，首次渲染，只需要对 app 打上 placement 的标记。

## 更新流程

## useLayoutEffect 和 useEffect

useLayoutEffect 是在 dom 更新之后执行，上一个 useLayoutEffect 的销毁函数和本次 useLayoutEffect 的回调函数是同步执行，在 dom 渲染之后同步执行  
useEffect 则是在 dom 渲染之后异步执行，执行时机比 useLayoutEffect 慢

## 双缓存树

即 current 和 current.alternate

1. 第一次渲染时，会创建 rootFiber 并且创建 rootFiber.alternate
2. setState 更新时，进入 createWorkInProgress 时，会沿着 rootFiber 创建每一个子节点的 alternate，此时每一个 fiber 都有对应的 alternate，双缓存树已经完成了
3. 再次 setState 时，已经有了双缓冲树了。

setState 之后，createWorkInProgress(current, pendingProps) => 此时 wrokInProgress = current.alternate !== null，根据 workInProgress 节点生成新的 fiber 节点
=> reconcileChildren
