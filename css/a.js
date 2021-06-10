import Promise from "../promise/promise";

console.log('a文件')
export let counter = 1;
export function add() {
  counter++;
  return counter;
}

function testPromiseResolution(xFactory, test) {
  specify("via return from a fulfilled promise", function (done) {
      var promise = resolved(dummy).then(function onBasePromiseFulfilled() {
          return xFactory();
      });

      test(promise, done);
  });

}

function testCallingResolvePromise(yFactory, stringRepresentation, test) {
  describe("`y` is " + stringRepresentation, function () {
      describe("`then` calls `resolvePromise` synchronously", function () {
          function xFactory() {
              return {
                  then: function (resolvePromise) {
                      resolvePromise(yFactory());
                  }
              };
          }

          testPromiseResolution(xFactory, test);
      });
  });
}

function testCallingResolvePromiseFulfillsWith(yFactory, stringRepresentation, fulfillmentValue) {
  describe("`y` is " + stringRepresentation, function () {
    describe("`then` calls `resolvePromise` synchronously", function () {
        function xFactory() {
            return {
                then: function (resolvePromise) {
                    resolvePromise(yFactory());
                }
            };
        }

        specify("via return from a fulfilled promise", function (done) {
          var promise = resolved(dummy).then(function onBasePromiseFulfilled() {
              return xFactory();
          });
          promise.then(function onPromiseFulfilled(value) {
            assert.strictEqual(value, fulfillmentValue);
            done();
          });
        });
    });
});
}


describe("`y` is a thenable", function () {

    describe("`y` is " + stringRepresentation, function () {
      describe("`then` calls `resolvePromise` synchronously", function () {
        var sentinel = { sentinel: 23 }
        // function yFactory() {
        //     return {
        //       then: function (onFulfilled) {
        //         onFulfilled(sentinel);
        //       } 
        //     };
        // }
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
        }).then(res => {
          console.log(res);
        });


          specify("via return from a fulfilled promise", function (done) {
            var promise = resolved(dummy).then(function onBasePromiseFulfilled() {
                return xFactory();
            });
            promise.then(function onPromiseFulfilled(value) {
              assert.strictEqual(value, sentinel);
              done();
            });
          });
      });
    });

});

new Promise((resolve) => resolve({then: (r) => r(1)})).then(res => console.log(res))





var reason = { then: () => {} };
var promise2 = new Promise((r) => r()).then(function onFulfilled() {
    throw reason;
});

promise2.then(null, function onPromise2Rejected(actualReason) {
    // assert.strictEqual(actualReason, expectedReason);
    console.log(reason === actualReason);
});

// 
  var reason = { then: () => {} };
    var promise2 = new Promise((r) => r()).then(function onFulfilled() {
        throw reason;
    });

    promise2.then(null, function onPromise2Rejected(actualReason) {
        // assert.strictEqual(actualReason, expectedReason);
        console.log(reason === actualReason);
    });

      testRejected(dummy, function (promise1, done) {
          var promise2 = promise1.then(null, function onRejected() {
              throw expectedReason;
          });

          promise2.then(null, function onPromise2Rejected(actualReason) {
              assert.strictEqual(actualReason, expectedReason);
              done();
          });
      });

Object.keys(reasons).forEach(function (stringRepresentation) {
  testReason(reasons[stringRepresentation](), stringRepresentation);
});

function xFactory() {
  var x = {
      then: function (onFulfilled, onRejected) {
          console.log(this);
          onFulfilled();
      }
  };
  return x;
}
new Promise((r,g) => r(1)).then(() => {
  return xFactory();
}).then(v => {
  console.log(v)
})

// 2.2.6.1 expect 1 1 1 
// p = new Promise((r,g) => setTimeout(() => r(1)));
// p.then(r => {console.log(r)});
// p.then(r => {console.log(r)});
// p.then(r => {console.log(r)});

// 2.2.6.1 expect true true
// p2 = new Promise((r,g) => setTimeout(() => r(1)));
// p2.then(function () {
//   return 2;
// }).then(function (v) {
//   console.log(v === 2);
// });
// p2.then(function () {
//   throw 3;
// }).then(null, function (v) {
//   console.log(v === 3);
// });
// p2.then(function () {
//   return 4;
// }).then(function (v) {
//   console.log(v === 4);
// });

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