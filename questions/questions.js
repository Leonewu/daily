var a = 1, obj = {};
(function (obj) {
  console.log(JSON.stringify(obj))
  obj.a = 2
  console.log(a)
  a = 2
  obj = {}
  var a = 4
  obj.a = 5
  console.log(a)
}(obj))
console.log('obj.a', obj.a)

// 解释
// obj = {}执行之前，内部和外部obj的指向同一块内存
// 执行之后，内部的obj进行了重写，指向另外一块内存，跟外部没关系了


// setTimeout(() => {
//   console.log(1);
// }, 0);
// new Promise((resolve) => {
//   console.log(2);
//   for (let i = 0; i < 5; i++) {
//     resolve()
//   }
//   console.log(3);
// }).then(() => {
//   console.log(4);
// })
// console.log(5)

new Promise((resolve, reject) => {
  console.log("外部promise");
  resolve();
})
  .then(() => {
    console.log("外部第一个then");
    new Promise((resolve, reject) => {
      console.log("内部promise");
      resolve();
    })
      .then(() => {
        console.log("内部第一个then");
      })
      .then(() => {
        console.log("内部第二个then");
      })
      .then(() => {
        console.log("内部第三个then");
      })
  })
  .then(() => {
    console.log("外部第二个then");
  })
  .then(() => {
    console.log("外部第三个then");
  })

  // 解释： then的时候会把回调存到数组中，resolve的时候会把then里面的回调依次放到微任务中
  // 为什么 settimeout0 和 Promise.resolve().then()同样是回调，为什么会执行时间不一样
  // 因为 settimeout0 的回调，是放到下一个macrotask中的，而Promise.resolve().then()的回调是放到下一个microtask中的
  // 所以说 settimeout0 是放在next top of eventloop
  // 因为eventloop是从macrotask开始执行，执行完毕才执行microtask
  // 参考 https://www.zhihu.com/question/36972010


  // 变量提升，函数提升
  console.log(a)
  console.log(b)
  function a() {
    console.log(1)
  }
  var a = 1
  var b = function (){
    console.log(2)
  }

  // 变量提升，题2
  console.log(a)
  a()
  var a = 1
  function a() {
    console.log(10)
  }
  function a() {
    console.log(20)
  }
  console.log(a)
  a = 2
  a()

  // 作用域问题
  for (var i = 1; i < 4; i++) { }
  console.log(i)

  // 块级作用域 + 变量提升（考察 块级作用域，词法环境，变量环境）
  function foo() {
    var a = 1
    let b = 2
    {
      let b = 3
      var c = 4
      let d = 5
      console.log(a)
      console.log(b)
    }
    console.log(b)
    console.log(c)
    console.log(d)
  }
  foo()

  // 考察this指向

  this.a = 20
  function go() {
    console.log(this.a)
    this.a = 30
  }
  go.prototype.a = 40
  var test = {
    a: 50,
    init: function(fn) {
      fn()
      console.log(this.a)
      return fn
    }
  }
  console.log(new go().a)
  test.init(go)
  var p = test.init(go)
  p()


  // 闭包的原理（通过函数作用域将函数内变量永久保存起来）
  // 闭包的原理（作用域链）



  // es6中的const和let和var的区别，内存暂死区
  // 即let和const上面都是暂死区，不能访问，访问就会报错
  // function 表达式定义的函数提升优先级比变量提升高
  // function f() { var a = b = 2 } 这个b是挂在windows上的


  // onload 和 ready 的区别
  // onload 是所有静态资源加载完毕 ready 是 dom 结构加载完毕
  // async 和 defer 的区别 查一下？TODO
  // 两者在下载js文件的时候并不会阻塞dom的解析
  // async 在下载完毕后马上执行，可用于打印时间点
  // defer 在 DomContentLoad 的时候执行，即先下载文件，在 dom 结构生成后执行，这个可以用于预加载 js 文件

  // prefetch preload （vue 打包出来的文件有  prefetch 还是 preload ？）
  // preload 解析头的时候去请求 ？
  // prefetch ？

  // https
  // https://juejin.im/post/5e11ff54e51d4541013f12ba
  // https://github.com/ljianshu/Blog/issues/50

  // 缓存 ，强缓存200（from cache），协商缓存（304）

  // 规范 git https://juejin.im/post/5d0b3f8c6fb9a07ec07fc5d0