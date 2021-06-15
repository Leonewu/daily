# react-debug

该目录 clone 了 react 的仓库，目的是为了调试 react 源码

## 步骤

1. `cd react`
2. 安装依赖 `yarn`
3. 打包 `yarn build react/index,react/jsx,react-dom/index,scheduler --type=NODE` (build 需要 java 环境)
4. 创建软链接 `cd build/node_modules/react && yarn link`,`cd build/node_modules/react-dom && yarn link`
5. 在项目中使用软链接 `yarn link react react-dom`
6. 尝试修改 react.dom.development.js 或 react.development.js 就能看到生效的代码
