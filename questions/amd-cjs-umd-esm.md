# 前端模块化

## 历史

## IIFE

立即调用函数表达式（英文：immediately-invoked function expression，缩写：IIFE）  
IIFE 有自己的独立作用域，不会污染全局变量

### IIFE 怎么定义模块

```js
// IIFE 示例
// my-module-iife.js
(function(window) {
  var x = 20;
  const myModule = {
    add() {
      x++;
      console.log(x);
    }
  }
  window.myModule = myModule;
})(window);
```

上述代码将 window 对象作为参数传入立即执行函数，再将我们定义的对象挂载到 window 上，局部变量 x 被永久保存下来，并且无法被外部直接访问  
使用时通过 `<script type="text/javascript" src="./my-module-iife.js"></script>` 引入  
假设我们不用 IIFE，如下所示，x 变量是直接定义在全局的，会污染全局变量

```js
// my-module.js
var x = 20;
const myModule = {
  add() {
    x++;
    console.log(x);
  }
}
window.myModule = myModule;
```

### 为 IIFE 添加依赖

首先通过 script 标签提前引入依赖，然后将依赖作为参数传入 IIFE，下面以 jQuery 为例

```html
<script type="text/javascript" src="jquery.js"></script>
<script type="text/javascript">
(function(window, $) {
  var x = 20;
  const myModule = {
    add() {
      x++;
      console.log(x);
      console.log($('body').width());
    }
  }
  window.myModule = myModule;
})(window, window.jQuery);
</script>
<script type="text/javascript">
  myModule.add();
</script>
```

## amd

异步模块定义（英文：Asynchronous Module Definition，缩写：amd）  

## commonJs

## umd

## esModule

## esModule 和 commonJs 的区别

- 静态和动态
- 编译器友好，容易 treeShaking
- 强绑定

## 拓展和思考

### 编译器的 treeShaking

### npm package 打包规范

### script 标签的 async 和 defer 属性

首先复习一下 `DOMContentLoaded` 和 `load`

- `DOMContentLoaded`：当 html 文档被下载并解析完成，包括同步 script 脚本的下载和解析，具有 defer 属性的 script 脚本的下载和解析
，不包括 css 解析，iframe 的加载，具有 async 属性的 script 脚本，和 document.createElement('script) 创建的脚本
- `load`：整个页面，包括样式、图片和其他异步资源被加载解析完成时

#### defer 延迟加载

- 声明 defer 属性的脚本会在后台下载，等 DOM 树构建完成之后再执行，下载和执行时都不会阻塞页面渲染
- 声明 defer 属性的脚本总是要等到 DOM 解析完毕时触发，但在 `DOMContentLoaded` 事件之前执行，会阻塞 `DOMContentLoaded` 事件
- 多个声明 defer 的脚本，会并行下载，并会按照声明的顺序执行脚本，而不是下载完成的顺序，即脚本之间会相互等待

#### async 异步加载

- 声明 async 属性的脚本会在后台下载，下载完立即执行，下载是不会阻塞页面渲染，但执行时会阻塞页面渲染
- 声明 async 属性的脚本总是要等到 DOM 解析完毕时触发，但不会阻塞 `DOMContentLoaded` 事件，可能会在之前或之后触发
- 多个声明 async 的脚本，会并行下载，并在下载完成之后执行，不会等待其他 async 脚本，即谁先下载完谁执行

#### 动态脚本

通过 `createElement('script')` 创建的脚本，默认行为是 async，即先加载先执行，当指定了 `script.async = false` 时，执行顺序会和 append 到页面的顺序一样

#### 使用场景

- 如果脚本是完全独立的，使用 async，如百度数据统计
- 如果脚本依赖于其他脚本，使用 defer
- 如果脚本比较小并且被另一个 async 脚本依赖，使用不带 async 和 defer 属性的 script 标签，并且放在该 async 脚本前面

[![async vs defer attributes](./script-defer-async.png)](https://www.growingwiththeweb.com/2014/02/async-vs-defer-attributes.html)

### 为什么有些库需要这样引入 import * as _ from 'lodash'

## 参考

- [script-async-defer - javascript.info](https://zh.javascript.info/script-async-defer)
- [async vs defer attributes - growingwiththeweb](https://www.growingwiththeweb.com/2014/02/async-vs-defer-attributes.html)
