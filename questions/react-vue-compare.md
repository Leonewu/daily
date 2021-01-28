## react 和 vue 的区别，优缺点，适用场景

## 区别

* react 自由度较高
* vue 对绝大部分东西做了封装，所以更容易上手，比如 vue-router 是配置型路由，而且有很好的钩子函数支持，很方便
* react-router 是分散的路由，如果要封装成配置型的需要自己手写一遍，但是 react 自由度高，在分散的路由中，你可以决定路由的具体匹配方式
* vue 有一套稳定成熟的体系，vue-router，vuex
* vue 写法倾向于单文件组件，如果要创建组件就要创建一个文件，粒度太细，会造成目录管理起来比较麻烦。react 自由度很高，没有单文件组件的限制，你可以很随意的抽离组件，而不用新增文件
* 所以搭建 vue 项目会快很多，并且 vue 的语法简单，细粒度的 api，开发速度也挺快，项目结构不复杂
* 搭建 react 项目可能要考虑更多的问题，如使用哪些状态管理
* react 缺点是 jsx 太灵活，只能在运行时做优化， vue 可以在编译时优化

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
* composition api 拥抱函数式编程
* vue 的 devTool 比 react 好用很多
