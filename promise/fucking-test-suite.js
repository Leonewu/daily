// 一些测试用例
// 主要是在运行 promises-aplus-tests 的时候总结出来的
// 2.3.3 是最恶心的


// 1
var sentinel = { sentinel: 23 }
var other = { other: 2444 }
function yFactory() {
  return {
    then: function (onFulfilled) {
        onFulfilled(sentinel);
        throw other;
    }
  };
}
function xFactory() {
    return {
        then: function (resolvePromise) {
            resolvePromise(yFactory());
        }
    };
}
new Promise((resolve, reject) => {
  resolve();
}).then(() => {
  return xFactory();
}).then(res => {
  console.log(res);
  console.log(res === sentinel);
});


// 2
var sentinel = { sentinel: 23 }
var other = { other: 2444 }
function yFactory() {
    return {
      then: function (onFulfilled) {
        onFulfilled(sentinel);
      }
    };
}
function xFactory() {
  return {
      then: function (resolvePromise) {
          resolvePromise(yFactory());
      }
  };
}
new Promise((resolve, reject) => {
  resolve();
}).then(() => {
  return xFactory();
}).then(res => {
  console.log(res);
  console.log(res === sentinel);
});


// 3
var sentinel = { sentinel: 23 }
var other = { other: 2444 }
function yFactory() {
  function fn(reason) {
      return Object.create(null, {
          then: {
              get: function () {
                  throw reason;
              }
          }
      });
  }
  return fn(sentinel);
}
function xFactory() {
  return {
      then: function (resolvePromise) {
          resolvePromise(yFactory());
      }
  };
}
new Promise((resolve, reject) => {
  resolve();
}).then(() => {
  return xFactory();
}).then(null, res => {
  console.log(res);
  console.log(res === sentinel);
});

// 4
var sentinel = { sentinel: "sentinel" }; // a sentinel fulfillment value to test for with strict equality
var sentinel2 = { sentinel2: "sentinel2" };
var sentinel3 = { sentinel3: "sentinel3" };

p3 = new Promise((r,g) => setTimeout(() => g(1)));
p3.then(null, function () {
  return sentinel;
}).then(function (v) {
  console.log(v, v === sentinel);
});
p3.then(null, function () {
  throw sentinel2;
}).then(null, function (v) {
  console.log(v, v === sentinel2)
});

p3.then(null, function () {
  return sentinel3;
}).then(function (v) {
  console.log(v, v === sentinel3)
});

// 5
// 2.2.6.1 expect true true
p2 = new Promise((r,g) => setTimeout(() => r(1)));
p2.then(function () {
  return 2;
}).then(function (v) {
  console.log(v === 2);
});
p2.then(function () {
  throw 3;
}).then(null, function (v) {
  console.log(v === 3);
});
p2.then(function () {
  return 4;
}).then(function (v) {
  console.log(v === 4);
});

// 6
// 2.2.6.1 expect 1 1 1 
p = new Promise((r,g) => setTimeout(() => r(1)));
p.then(r => {console.log(r)});
p.then(r => {console.log(r)});
p.then(r => {console.log(r)});


// 7
var reason = { then: () => {} };
var promise2 = new Promise((r) => r()).then(function onFulfilled() {
    throw reason;
});

promise2.then(null, function onPromise2Rejected(actualReason) {
    // assert.strictEqual(actualReason, expectedReason);
    console.log(reason === actualReason);
});


// 8

var sentinel = { s: 13 }
function yFactory() {
  return {
      then: function (f){
          f({
              then: function(ff){
                  ff(sentinel);
                  ff('innerother');
              }
          });
          f('outerother')
      }
  }
}
function xFactory() {
  return {
      then: function (resolvePromise) {
          resolvePromise(yFactory());
      }
  };
}
var promise = new Promise(r => r()).then(function onBasePromiseFulfilled() {
  return xFactory();
});

promise.then(function onPromiseFulfilled(value) {
  console.log(value === sentinel);
  console.log(value);
});

// 9

var sentinel = { s: 13 }
var other = { o: 444 }
function factory(value) {
  return {
      then: function (onFulfilled) {
          onFulfilled(value);
          onFulfilled(other);
      }
  };
}
function yFactory() {
  return {
      then: function (f){
          f({
              then: function(ff){
                  ff(sentinel);
                  ff('innerother');
              }
          });
          f('outerother');
      }
  }
}
function xFactory() {
  return {
      then: function (resolvePromise) {
          setTimeout(function () {
              resolvePromise(yFactory());
          }, 0);
      }
  };
}
var promise = new Promise(r => r()).then(function onBasePromiseFulfilled() {
  return xFactory();
});

promise.then(function onPromiseFulfilled(value) {
  console.log(value === sentinel);
  console.log(value);
});