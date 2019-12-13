//  es5实现继承 以及 new 和 object.create
// object.assign

// 原型继承，缺点： 改变父类的复杂对象引用会在子类的实例会共享
// 因为 B.prototype = new A() 是指向同一个A的实例
// function Parent() {
//   this.name = "parent"
//   this.obj = {}
// }

// function Child() {
//   this.name = "child"
// }

// Child.prototype = new Parent()

// var child1 = new Child()
// var child2 = new Child()
// child1.obj.name = "child1"
// console.log(child2.obj.name)
// 输出 'child1'


// 构造函数继承
// 由于每次新建子类实例的时候都会调用父类的构造函数，所以父类中的复杂引用类型并不会共享
// 缺点 如果在继承之后，在父类原型添加新对象，即 C.prototype.type = 1 ，则子类实例并不会继承到该对象

// function Parent() {
//   this.name = "parent"
//   this.obj = {}
// }

// function Child() {
//   Parent.call(this)
//   this.name = "child"
// }

// Parent.prototype.fn = () => console.log(1)
// var child = new Child()
// child.fn()
// TypeError: child.fn is not a function


// 综上所述，原型继承会造成内存共享，构造函数继承写法繁琐，要注意顺序，还无法在原型链添加函数
// 组合继承（构造函数继承 + 改进版原型继承），缺一不可
// Object.create 是浅拷贝哦，所以组合继承在 Object.create(Parent.prototype)的时候，如果prototype中有复杂引用类型的时候
// function F() {}
// F.prototype = proto
// return new F()
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create

function Parent() {
  this.name = "parent"
  this.obj = {}
}

function Child() {
  Parent.call(this)
  this.name = "child"
}

Child.prototype = Object.create(Parent.prototype)
