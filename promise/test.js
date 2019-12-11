
/* 以下为手写promise时，自己写的测试函数 */
/* 懒得搬到jest上 */

// new Promise((resolve, reject) => {
//   reject(1)
// })
//   .then().then()
//   .then(null, r => console.log(1, r)).then(c => console.log(c))

// new Promise((resolve, reject) => {
//   reject(1);
//   console.log("c");
// })
//   .then(
//     v => {},
//     reason => {
//       return new Promise((resolve, reject) => {
//         setTimeout(() => {
//           reject(3);
//         }, 0);
//       })
//         .then(
//           v => {
//             console.log(v);
//           },
//           reason => {
//             console.log("内部reject", 5);
//           }
//         )
//         .catch(r => {
//           console.log("catch");
//         });
//     }
//   )
//   .then(
//     v => {
//       console.log(v);
//     },
//     reason => {
//       console.log(5);
//     }
//   )
//   .catch(r => {
//     console.log(r);
//   });

// Promise.resolve(1).then(v => console.log(v));

// test return promise 异步
// new Promise(function(resolve, reject) {
//   resolve(12);
// })
//   .then(function(value) {
//     return new Promise(resolve => {
//       console.log("内部第一个promise");
//       setTimeout(() => {
//         resolve(value);
//       }, 0);
//     })
//       .then(value => {
//         console.log("内部then", value);
//         return 2;
//       })
//       .then(value => {
//         return value;
//       });
//   })
//   .then(value => {
//     console.log("外部then", value);
//   });

// test 同步
// new Promise(function(resolve, reject) {
//   setTimeout(() => resolve(12), 100)
// }).then(value => {
//   console.log(value)
//   return 2
// }, reason => {
//   console.log(reason)
// }).then(value => {
//   console.log(value)
//   return 3
// }, reason => {
//   console.log(reason)
// }).then(value => {
//   console.log(value)
//   return 4
// }, reason => {
//   console.log(reason)
// })

// test setTimeout异步
// new Promise(function(resolve, reject) {
//   console.log('wait')
//   setTimeout(function() {
//     resolve(1)
//   }, 1000)
// }).then(value => {
//   console.log('accept last value', value)
// }, reason => {
//   console.log(reason)
// })

// setTimeout(() => {
//   console.log(1)
// }, 0)
// new Promise(function(resolve) {
//   resolve(3)
//   console.log(2)
// }).then(function(v){
//   setTimeout(() => {
//     console.log(v)
//   })
// })
// setTimeout(() => {
//   console.log(4)
// }, 0)

// let p = new Promise(resolve => {
//   setTimeout(() => {
//     console.log(1);
//     resolve(1);
//   }, 1000);
// });

// p.then(value => {
//   console.log("last promise 1", value);
//   return 2;
// }).then(value => {
//   console.log("last promise 2", value);
// });



// new Promise((resolve, reject) => {
//   reject(1)
// }).then(null, r => {
//   console.log(1, r)
// })

// new Promise((resolve, reject) => {
//   throw new Error(123)
// }).then(null, r => {
//   console.log(1, r)
// })

// new Promise((resolve, reject) => {
//   setTimeout(() => resolve(1), 1000)
// })
// .then(value => {
//    throw new Error(value + 1)
// })
// .then(null, r => {
//   console.log(1, r)
// })

// new Promise((resolve, reject) => {
//   setTimeout(() => reject(1), 100)
// })
//   .then(null, value => {
//     throw new Error(value + 1)
//   })
//   .then(null, r => {
//     console.log(1, r)
//   })