# webpack 的模块系统

webpack 模块系统是自己实现的，模块经过打包后将导出的变量放在 exports 中给外部访问  
webpack 模块定义是比较贴近于 commonJS 规范的，原因大概能猜到，commonJs 规范并不是采用关键字的语法，可以通过函数实现，这样有利于 webpack 做模块缓存，并且兼容两种规范(esModule 和 commonJs)时可以基本不对 commonJs 模块做处理  
这篇文章主要讨论 webpack 对不同规范模块的处理，以下代码示例均采用 webpack 5 打包，相关代码在 [这里](https://github.com/Leonewu/daily/tree/fdeeb00136851a0f97f1c391c7bb9fd79f696775/webpack/esmodule-commonjs-bundle) 可以看到

## webpack runtime 关键代码

### 变量 `__webpack_modules__`

模块经过 webpack 的打包后，变成一个键值对，挂载在 `__webpack_modules__` 对象上，下面是 commonJs 和 esModule 模块打包后的代码。  

```js
var __webpack_modules__ = ({

/***/ "./src/esm-and-cjs/cjs.js":
/*!********************************!*\
  !*** ./src/esm-and-cjs/cjs.js ***!
  \********************************/
/***/ ((module) => {
        // 模块内容
        const name = 'cjs';
        module.exports = {
          log() {
            console.log(name);
          }
        }
/***/ }),

/***/ "./src/esm/esm.js":
/*!************************!*\
  !*** ./src/esm/esm.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "log": () => (/* binding */ log),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function log() {
  console.log(1);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  log() {
    console.log(2);
  }
});

/***/ })

})
```

打包之后的模块变成了一个有副作用的函数，对传进来的参数加上模块的导出变量。

### 函数对象 `__webpack_require__`

`__webpack_require__` 是模块的引入方法 ，当引入一个模块时，首先会通过缓存去拿，缓存没有再通过模块 id 作为索引，拿到`__webpack_modules__` 的模块函数去执行，并且设置一遍缓存，返回该模块的 exports 变量。  
`__webpack_require__` 不止是一个方法，还包括了其他变量，下文会有所介绍。

```js
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/   // Check if module is in cache
/******/   if(__webpack_module_cache__[moduleId]) {
/******/    return __webpack_module_cache__[moduleId].exports;
/******/   }
/******/   // Create a new module (and put it into the cache)
/******/   var module = __webpack_module_cache__[moduleId] = {
/******/    // no module.id needed
/******/    // no module.loaded needed
/******/    exports: {}
/******/   };
/******/  
/******/   // Execute the module function
/******/   __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/  
/******/   // Return the exports of the module
/******/   return module.exports;
/******/ }
```

### 函数 `__webpack_require__.d`

`__webpack_require__.d` 是对模块导出变量 exports 设置代理的函数。例如 `export { a: 1, b: 2 }` 中的 `{ a: 1, b: 2 }`，都会经过这个函数，将导出的对象都搬到 exports 中去，原理是 `Object.defineProperty`

```js
/******/  // define getter functions for harmony exports
/******/  __webpack_require__.d = (exports, definition) => {
/******/    for(var key in definition) {
/******/     if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/      Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/     }
/******/    }
/******/  };
```

### 函数 `__webpack_require__.r`

`__webpack_require__.r` 是 esModule 模块用的包装函数，标记这个模块是 esModule 语法的，commonJs 模块不会调用这个方法

```js
/******/  /* webpack/runtime/make namespace object */
/******/  // define __esModule on exports
/******/  __webpack_require__.r = (exports) => {
/******/    if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/     Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/    }
/******/    Object.defineProperty(exports, '__esModule', { value: true });
/******/  };
```

### 函数 `__webpack_require__.n`

`__webpack_require__.n` 是默认导入模块时调用的函数，如果引入的模块是 esModule 就返回 default，不是就直接返回模块

```js
// getDefaultExport function for compatibility with non-harmony modules
/******/   __webpack_require__.n = (module) => {
/******/    var getter = module && module.__esModule ?
/******/     () => (module['default']) :
/******/     () => (module);
/******/    __webpack_require__.d(getter, { a: getter });
/******/    return getter;
/******/   };
```

另外，下面的情况会报错

- 使用 require 引入只有默认导出的 esModule 模块

因为这种情况 webpack 是不会调用 `__webpack_require__.n` 的，但其实导出的变量实际上在 `export.default` 上，没有调用 `__webpack_require__.n` 会导致拿不到变量

## webpack 对 esModule 和 commonJs 模块的处理

对于 commonJs 规范的，webpack 基本不做处理，直接将代码搬运过来

```js
// commonJs 规范的模块
const name = 'cjs';
module.exports = {
  log() {
    console.log(name);
  }
}

// 编译后的代码
var __webpack_modules__ = ({

/***/ "./src/esm-and-cjs/cjs.js":
/*!********************************!*\
  !*** ./src/esm-and-cjs/cjs.js ***!
  \********************************/
/***/ ((module) => {
        const name = 'cjs';
        module.exports = {
          log() {
            console.log(name);
          }
        }
/***/ })

})
```

对于 esModule 规范的，通过 `__webpack_require__.r` 打上标记，设置 `exports._esModule = true`,`__webpack_require__.d` 将模块的导出的变量做一层代理，将 export 导出的变量搬到 exports 中去  
值得注意的是，这里使用了 `Object.defineProperty(exports, key, { enumerable: true, get: definition[key] })` 方法做了代理，所有 exports 中变量的读写都代理到 definition 上去，通过这种方法对齐 esModule 强绑定的标准

```js
// esModule 模块
export const name = 'esm';
export function log() {
  console.log(name);
}


// 编译后的代码 
var __webpack_modules__ = ({

/***/ "./src/esm-and-cjs/esm.js":
/*!********************************!*\
  !*** ./src/esm-and-cjs/esm.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "name": () => (/* binding */ name),
/* harmony export */   "log": () => (/* binding */ log)
/* harmony export */ });
const name = 'esm';
function log() {
  console.log(name);
}
/***/ })
})
```

## webpack 对 esModule 的导出差异的处理

esModule 导出有两种，一种是直接 export，另一种是默认导出 export default，乍看之下只是语法上的区别，但其实不然

### export default 和 export 的差异

export default 和 export 导出的表现不一样，这种差异如下  
示例一：esm-without-default.js 使用 export 导出

```js
export let counter = 1;
export function add() {
  counter++;
  return counter;
}
```

示例二：esm-with-default.js 使用 export default 导出

```js
let counter = 1;
function add() {
  counter++;
  return counter;
}
export default {
  counter,
  add
}
```

接着我们调用两个打印并调用两个示例中的 add 方法

```js
import esmWithoutDefault from './esm-without-default.js';
import esmWithDefault from './esm-with-default.js';

console.log('esmWithDefault 的行为：');
console.log(esmWithDefault.counter);      // 1
console.log(esmWithDefault.add());        // 2
console.log(esmWithDefault.counter);      // 1

console.log('esmWithoutDefault 的行为：');
console.log(esmWithoutDefault.counter);   // 1
console.log(esmWithoutDefault.add());     // 2
console.log(esmWithoutDefault.counter);   // 1
```

可以看出 export default 导出的变量并不是强绑定，即类似函数传参的形式

那 webpack 是如何处理这种差异呢？我们看看下面的代码  

### webpack 对 esModule 普通导出的处理

示例一：esm-without-default.js 编译后的代码

```js
/***/ "./src/compare-export-default/esm-without-default.js":
/*!***********************************************************!*\
  !*** ./src/compare-export-default/esm-without-default.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "counter": () => (/* binding */ counter),
/* harmony export */   "add": () => (/* binding */ add)
/* harmony export */ });
let counter = 1;
function add() {
  counter++;
  return counter;
}

/***/ })
```

对于 export 的变量，是直接挂载在 exports 中的，调用 add 方法，改变了局部变量 counter，读取时通过代理找到了该局部变量，所以是强绑定

### webpack 对 esModule 默认导出的处理

示例二：esm-with-default.js 编译后的代码

```js
/***/ "./src/compare-export-default/esm-with-default.js":
/*!********************************************************!*\
  !*** ./src/compare-export-default/esm-with-default.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
let counter = 1;
function add() {
  counter++;
  return counter;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  counter,
  add
});

/***/ })
```

可以看到，对于 export default，将导出的变量放在局部变量 `__WEBPACK_DEFAULT_EXPORT__` 中，并代理了 `exports.default` 这个中间变量，从代码上很明显看出，调用 add 方法并不是直接改变 `__WEBPACK_DEFAULT_EXPORT__.counter`，而是改变了局部变量 counter，由于是简单类型，这两者并不是指向同一内存区域

## webpack 对 esModule 默认导入的处理

esModule 引入模块有两种形式

下面的情况，引入时 webpack 读取的是 exports 变量

```js
import { log } from 'a';
log();
// 或者
import * as a from 'a';
a.log();
```

默认导入，webpack 通过上文提到的 `__webpack_require__.n` 读取 `exports.default` 变量

```js
import a from 'a';
a.log();
```

当一个模块同时有默认导出和普通导出时，webpack 的处理原则是，默认导入的读取默认导出的变量(`exports.default`)，普通导出的读取普通导出的变量(`exports`)，如下

```js
// esm.js 模块
export function log() {
  console.log(1);
}
export default {
  log() {
    console.log(2)
  }
}

// index.js 引入 esm.js
import * as esm from './esm';
import esmDefaultImport from './esm'

esm.log();  // 1
esmDefaultImport.log(); // 2
```

另外，如果默认导入一个没有默认导出的模块，会报错

## 拓展

## 为什么有时候 import xxx from 'xxx' 会报错

这个报错只会出现在以下两种情况

- 使用默认导入的方式引入没有默认导出的 esModule 模块
- 使用默认导入的方式引入 commonJs 模块

解决方法：

- `import * as xxx from 'xxx'`
- 使用 [@babel/plugin-transform-modules-commonjs](https://babeljs.io/docs/en/babel-plugin-transform-modules-commonjs) 这个插件有个配置项 `noInterop`，默认为 false，会在导入的时候做一层 polyfill，为 commonJs 规范的代码加上 default 变量

```
var _foo = _interopRequireDefault(require("foo"));
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
```

注意，这个插件是 @babel/preset-env 自带的。  
举个例子：lodash 的代码中是只遵循 commonJs 规范的，只能通过非默认导入的形式引入，但有时却有 `import _ from 'lodash'` 的写法，正因为用了这个插件

## export default 的问题

export default 在过去其实是有坑的，因为可能会跟对象解构的语法冲突

```js
// esm.js
export default {
  log() {
    console.log(2);
  }
}

// index.js 引入时解构
import { log } from './esm';
log();
```

这种情况可以有两种理解

1. 单纯只是引入普通导入，不会解构
2. 在引入的时候结构了默认引入，即

```js
import esm from './esm'
const { log } = esm;
log();
```

按照 esModule 的标准，结果应该是 1，调用 log 会报错，但是用 babel5 却能正确输出  
不过，在实际测试中，webpack 5中这样使用也会报错  
鉴于历史，我们还是要注意一下规范编码

## 总结

了解 webpack 的模块系统，对我们平时的编码习惯也有所启发，使用 esModule 时，也要注意以下几点

- 不要在一个模块同时使用普通导出和默认导出
- 默认导出和默认导入，普通导入和普通导入，两者要一一对应
- 如果一个文件有多个导出时，使用普通导出，如函数库
- 如果一个文件只有单个导出时，可以使用默认导出，如 class、组件、配置项
- esModule 默认导出不是强绑定，这个和 commonJs 是一样的，普通导出则是强绑定

## 参考

- [禁用export default object - 知乎](https://zhuanlan.zhihu.com/p/40733281)
