## react 和 vue 的区别，优缺点，适用场景
## 共同点
* 数据驱动
* 虚拟dom
* dom diff
### react
* 手动 setState
* jsx + js 原生的循环，判断语法
* dom diff 对比 state 差异和节点复用性，再更新到真实 dom
* 状态管理有 redux，mobx
* 路由有 react-router
* ui 组件库有 antdesign
* 脚手架有 umi，create-react-app
* 封装性比 vue 少很多，自由度比 vue 高
* 由于 dom diff 比较费时，所以后面用了 fiber 去解决dom diff 的性能问题
* 高阶组件，无状态组件，render props
* react hooks
### vue
* 模板字符串 + 指令语法
* 自动更新
* 发布订阅者模式，内部存储了依赖对应的订阅者的数据结构
* dom diff 更多是为了节点的复用
* 集成了一整套基本的解决方案，vue-router，vuex
* ui 组件库有 element-ui 等
* 脚手架有 vue-cli，vue-element-admin
* mixin
* composition api