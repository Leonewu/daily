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

### 为什么有些库需要这样引入 import * as _ from 'lodash'
