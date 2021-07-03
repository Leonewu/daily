# commonJs to esModule

将 commonjs 语法转成 esModule

## 注意

1. 无法将被 babel-plugin-transform-modules-commonjs 转换过的 commonJs 模块再次还原成 esModule
2. 只适用于未编译过的 commonJs 模块，不适用于包含了 _interopRequireDefault 这种运行时的模块
3. 不规范的 commonJs 语法将不会被转换，会被保留
4. 动态的 require, exports 不会被转换，会被保留
