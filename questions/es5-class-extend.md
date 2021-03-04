# ES5 中的继承

以下为`ES5`中的三种继承方式

## 原型继承

原型继承指的是将子类的`prototype`指到父类的实例上，代码如下

```js
function Parent() {
  this.name = "parent"
  this.obj = {}
}

function Child() {
  this.name = "child"
}

Child.prototype = new Parent()

var child1 = new Child()
var child2 = new Child()
child1.obj.name = "child1"
console.log(child2.obj.name)
// 输出 'child1'
// 正常应该输出undefined
```

缺点也显而易见，由于在继承的时候只创建了一个父类的实例，所以继承下来的复杂引用类型会内存共享

## 构造函数继承

构造函数继承是指在声明子类构造函数的时候手动调用一次父类的构造函数(相当于`ES6`的`super`)，如下所示

```js
function Parent() {
  this.name = "parent"
  this.obj = {}
}

function Child() {
  Parent.call(this)
  this.name = "child"
}
// 测试是否会共享内存
var child1 = new Child()
var child2 = new Child()
child1.obj.name = "child1"
console.log(child2.obj.name)
// 输出 undefined
// 往父类的prototype添加新方法
Parent.prototype.fn = () => console.log(1)
var child = new Child()
child.fn()
// TypeError: child.fn is not a function
```

好处是不会发生内存共享了，缺点就是如果想要往父类原型链上添加新方法，子类并不会继承该方法

## 组合继承

组合继承就是构造函数继承+改进版原型继承，改进版原型继承是通过`Object.create`方法将子类的原型和父类的原型绑到一起  
[MDN Object.create中的polyfill](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)主要逻辑如下所示

```js
Object.create = function(proto) {
  function F() {}
  F.prototype = proto
  return new F()
}
```

意思就是先声明一个构造函数，然后将传入的原型赋值给该构造函数的原型，最后返回该构造函数的实例  
看到这里不免有个疑问，为什么上面的原型继承不直接用`Object.create`呢
因为`Object.create`仅仅只是操作了原型`prototype`上的东西，对于内部定义的变量（上面的`this.name`）并不会继承下去
下面是组合继承的代码

```js
function Parent() {
  this.name = "parent"
  this.obj = {}
}

function Child() {
  Parent.call(this)
  this.name = "child"
}

Child.prototype = Object.create(Parent.prototype)
```

## 结语

了解继承可以让我们明白原型链的机制和怎么利用原型链实现继承，虽然现在继承已经有了方便的`ES6`的`extends`语法，但了解其中原理也是很有必要的

## 参考

[MDN Object.create()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
