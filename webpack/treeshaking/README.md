# webpack tree shaking

这是一个测试 webpack 的 tree shaking 功能的仓库，测试场景如下：

- 使用 export default 的模块
- 使用 export 的模块
- 使用 commonJs 的模

经测试，webpack 只会对 export 和 export default 的模块做 tree shaking  
