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

  // es6中的const和let和var的区别，内存暂死区
  // 即let和const上面都是暂死区，不能访问，访问就会报错