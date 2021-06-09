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
function testReason(expectedReason, stringRepresentation) {
  describe("The reason is " + stringRepresentation, function () {
    testFulfilled(dummy, function (promise1, done) {
        var reason = { then: () => {} };
          var promise2 = new Promise((r) => r()).then(function onFulfilled() {
              throw reason;
          });

          promise2.then(null, function onPromise2Rejected(actualReason) {
              // assert.strictEqual(actualReason, expectedReason);
              console.log(reason === actualReason);
          });
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
  });
}

Object.keys(reasons).forEach(function (stringRepresentation) {
  testReason(reasons[stringRepresentation](), stringRepresentation);
});