# 基础知识

## es5

Undefined Number String Boolean null Object Symbol Bigint

## 原型

- 没有 `__proto__` 的对象：`null`，`Object.create(null)`
- 原型链顶端：`Object.prototype.__proto__ === null`

### new

```js
function myNew(T) {
  let a = {};
  a.__proto__ = T.prototype;
  let obj = T.call(a);
  return obj;
}
```

### Object.create

Object.create 方法创建一个新对象，使用现有的对象来提供新创建的对象的 `__proto__`

```js
function create(proto) {
  function F() {}
  F.prototype = proto;
  return new F();
}
```

### Object.assign

Object.assign(target, source) 方法用于将所有可枚举属性的值从一个或多个源对象分配到目标对象。它将返回目标对象。相同的键 source 会覆盖 target

### Object.defineProperty

Object.defineProperty() 方法直接在一个对象上定义新的属性或修改现有属性，并返回该对象  
Object.defineProperty(obj, 'key', descriptor);  
describtor:

- value
- enumerable
为 true 时，能在 for in 和 Object.keys 中被枚举
- writable
是否可以通过赋值改变其 value，为 true 时，修改后不会生效
- configurable
表示对象的属性是否可以被删除，以及除 value 和 writable 特性外的其他特性是否可以被修改。
- get
- set

#### enumerable

注意 enumerable 的细节：

```js
let a = {};
Object.defineProperty(a, 'b', {
  enumerable: false,
  value: 1
});
console.log(a);
// {b: 1}
for (let v in a) { console.log(v); }
// 什么都没打印
console.log(Object.keys(a));
console.log(Object.values(a));
console.log(Object.entries(a));
// [] [] []
console.log(Reflect.has(a, 'b'));
console.log('b' in a);
console.log(a.hasOwnProperty('b'));
// true true true
```

当 enumerable 为 false 时，任何批量遍历枚举方法都无法访问到该对象，只有以下方法能访问到

- Reflect.has
- 不在 for in 中的 in 操作符
- hasOwnProperty

记住一点 enumerable 只跟批量枚举有关

### Object.freeze

Object.freeze() 方法可以冻结一个对象。一个被冻结的对象再也不能被修改；冻结了一个对象则不能向这个对象添加新的属性，不能删除已有属性，不能修改该对象已有属性的可枚举性、可配置性、可写性，以及不能修改已有属性的值。此外，冻结一个对象后该对象的原型也不能被修改。freeze() 返回和传入的参数相同的对象。注意 Object.freeze 是浅冻结。

```js
obj1 = {
  internal: {}
};

Object.freeze(obj1);
obj1.internal.a = 'aValue';
obj1.internal.a // 'aValue'
```

#### 深冻结

```js
function deepFreeze(obj) {
  var keys = Object.keys(obj);
  keys.forEach((k) => {
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      deepFreeze(obj[k]);
    }
  });
  return Object.freeze(obj);
}
```

### instanceof

instanceof 判断对象的类型，原理是判断左侧原型链是否等于右侧的 `prototype`，反过来就是 isPrototypeof

```js
function myInstanceof(left, right) {
  if (right === null || right === undefined || !right.prototype) {
    return false;
  }
  if (left === null && right === Object) return true;
  if (left === undefined) return false;
  let flag = false;
  let p = left.__proto__;
  while (p) {
    if (p === right.prototype) {
      flag = true;
      break;
    }
    p = p.__proto__;
  }
  return flag;
}
```

### hasOwnProperty

hasOwnProperty 方法会返回一个布尔值，指示对象自身属性中是否具有指定的属性（也就是，是否有指定的键），不会访问到原型链上的对象和 enumberable 为 false 的属性。

### for in

for...in 语句以任意顺序遍历一个对象的除 Symbol 以外的**可枚举属性**。对象 `{ [Symbol('k')]: 1 }` 中的 Symbol 不会被遍历到  

#### for in 遍历数组会输出什么

```js
let a = [1,2,3];
for (let v in a) { console.log(v) }
// 0 1 2
```

会输出数组的下标  

### for of

与 for...in 语句以任意顺序迭代对象的**可枚举属性**不同的是，for...of 语句遍历**可迭代对象**定义要迭代的数据  
只要对象有 `[Symbol.iterator]` 属性，就能被 for...of 遍历

```js
console.log([1][Symbol.iterator]);
// native code
var iterable = {
  [Symbol.iterator]() {
    return {
      i: 0,
      next() {
        if (this.i < 3) {
          return { value: this.i++, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};
for (var value of iterable) {
  console.log(value);
}
// 0
// 1
// 2
```

### 如何防止一个对象属性被修改

- Object.freeze
- Object.defineProperty 设置 writable 为 true
- Object.defineProperty set 的时候判断 key 的值，让其设置不生效

注意 Object.freeze 是浅冻结

```js
obj1 = {
  internal: {}
};

Object.freeze(obj1);
obj1.internal.a = 'aValue';
obj1.internal.a // 'aValue'
```

递归实现深冻结

```js
function deepFreeze(obj) {
  var keys = Object.keys(obj);
  keys.forEach((k) => {
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      deepFreeze(obj[k]);
    }
  });
  return Object.freeze(obj);
}
```

## es6

### Proxy

Proxy 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等。  
注意：proxy 的对象不能配置为不可写（writable: false）和不可配置（configurable: false）  
语法：

```js
let obj = {};
let proxy = new Proxy(obj, {
  get(target, prop, receiver) {
    console.log(target, prop, receiver);
    return target[prop];
  },
  set(target, prop, val) {
    target[prop] = val;
    return true;
  }
});
```

主要是传入 handler 的书写，包含属性：

- get 拦截对象的读取属性操作
  - target 目标对象
  - prop 属性名
  - receiver Proxy 对象或者继承 Proxy 的对象
- set 拦截对象的写入操作
  - target 目标对象
  - prop 属性名
  - receiver 通常是 proxy 本身，但 handler 的 set 方法也有可能在原型链上，或以其他方式被间接地调用（因此不一定是 proxy 本身）
    > 比如：假设有一段代码执行 obj.name = "jen"， obj 不是一个 proxy，且自身不含 name 属性，但是它的原型链上有一个 proxy，那么，那个 proxy 的 set() 处理器会被调用，而此时，obj 会作为 receiver 参数传进来。
    >
- has 针对 in 操作符的代理方法  
...

#### Proxy 搭配 Reflect 使用

考虑以下场景，对象 a 继承了对象 b 的 proxy，并且对象 b 本身有自己的 getter。

```js
// animal 对象本身就有 getter
let animal = new Proxy({
  _name: 'animal',
  get name() {
    return this._name;
  },
  log() {
    console.log(this.name);
  }
}, {
  get: function (target, prop, receiver) {
    return target[prop];
    // return Reflect.get(target, prop, receiver);
  }
})
let cat = { _name: 'cat' };
cat.__proto__ = animal; // 继承 animal
console.log(cat._name); // cat
console.log(cat.name); // animal
```

如果改成 `Reflect.get`，最后一个参数是 this 指向，当原型链上存在 proxy 时，`handle.get` 的最后一个参数 receiver 指向的是原对象，所以作为 `Reflect.get` 的最后一个参数传入。

```js
// animal 对象本身就有 getter
let animal = new Proxy({
  _name: 'animal',
  get name() {
    return this._name;
  },
  log() {
    console.log(this.name);
  }
}, {
  get: function (target, prop, receiver) {
    return Reflect.get(target, prop, receiver);
    // return target[prop];
  }
})
let cat = { _name: 'cat' };
cat.__proto__ = animal; // 继承 animal
console.log(cat._name); // cat
console.log(cat.name); // cat
```

### Proxy 与 Object.defineProperty

- Object.defineProperty 无法监听到动态添加的属性，数组方法
- Proxy 无法使用 polyfill

### Reflect

[Reflect](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect) 是一个内置的对象，它提供拦截 JavaScript 操作的方法。在此不赘述。主要是统一了函数式的对象操作，部分 es5 的命令式操作变成了 Reflect 的一个函数，如

- es5 中 `delete a['key']` 相当于 `Reflect.deleteProperty(a, 'key')`

### Symbol

每个从 Symbol() 返回的 symbol 值都是唯一的。一个 symbol 值能作为对象属性的标识符。一个对象的 Symbol 键不会被 for in 遍历到。  
Symbol 有一些内置对象和方法：

- Symbol.iterator, 被 for...of 使用
- Symbol.asyncIterator, 被 for await of 使用

```js
Symbol("foo") === Symbol("foo");
// false
let a = { [Symbol('k')]: 1 };
for (let k in a) { console.log(k); }
// nothing output
```

### use strict

use strict 是一个 js 指令，表示指定代码在严格模式下执行。严格模式有一系列安全规则，如不能使用未声明变量。这些将会在执行阶段抛出错误。

### WeakMap 和 WeakSet

WeakMap 和 WeakSet 只能传入对象作为 key，并且键名是弱引用，一旦 key 被销毁，对应的 WeakMap 记录会自动移除。  
WeakMap 实例没有 seze，forEach，clear 方法。  
由于在 `new Map().set(key, xxx)` 中如果传入的 key 为对象时，当该对象被销毁时，由于 map 实例中对应的记录会引用到该对象，所以该对象不会被自动垃圾回收，造成内存泄露。

```js
let obj1 = { name: 'obj1' }
let a1 = new WeakMap();
a1.set(obj1, '1');
obj1 = null;
// a 对应的 obj 记录会被清除
let obj2 = { name: 'obj2' }
let a2 = new Map();
a2.set(obj2, '2');
obj2 = null;
// a 对应的 obj 记录不会被清除
```

附：在浏览器无法观察到 WeakMap 对应的记录是否被清除，需要在 node 环境通过 `process.memoryUsage()` 查看
