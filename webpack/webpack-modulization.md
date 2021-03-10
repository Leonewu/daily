# webpack 的模块系统

## 兼容 esm 和 cjs 写法

统一使用 module.exports 的接口

## 对齐 esm 标准

esm 中 export default 和 export 导出的表现不一样
webpack 特地对此做了兼容

### 为什么有些库需要这样引入 import * as _ from 'lodash'
