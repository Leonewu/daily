
/* 该测试用例只覆盖到promise的基本功能，没有覆盖到promise中微任务和宏任务的执行顺序 */

const Promise = require('./promise')

test('asynchronous promise', done => {
  const testValue = 1
  new Promise(resolve => {
    setTimeout(() => {
      resolve(testValue)
    }, 1000)
  })
  .then(value => {
    return value + 1
  })
  .then(value => {
    return value + 1
  })
  .then(value => {
    expect(value).toBe(testValue + 2)
    done()
  });
});

test('synchronous promise', done => {
  const testValue = 1
  new Promise(resolve => {
    resolve(testValue)
  })
  .then(value => {
    return value
  })
  .then(value => {
    expect(value).toBe(testValue)
    done()
  });
});

test('mix resolve and reject', done => {
  const testValue = 1
  new Promise((resolve, reject) => {
    reject(testValue);
  })
  .then(null, reason => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(reason + 1);
      }, 0);
    })
    .then(value => {
      return value + 1
    });
  })
  .then(value => {
    expect(value).toBe(testValue + 2)
    done()
  });
});

test('nest promise', done => {
  const testValue = 1
  new Promise(function(resolve, reject) {
    resolve(testValue);
  })
  .then(function(value) {
    return new Promise(resolve => {
      // console.log("内部第一个promise");
      setTimeout(() => {
        resolve(value + 1);
      }, 0);
    })
    .then(value => {
      // console.log("内部then", value);
      return value + 1;
    })
    .then(value => {
      return new Promise(resolve => {
        // console.log("内部第二个promise");
        setTimeout(() => {
          resolve(value + 1);
        }, 0);
      })
      .then(value => {
        // console.log('内部第二个promise的then')
        return value + 1
      })
    });
  })
  .then(
    value => {
      // console.log("外部then", value);
      expect(value).toBe(testValue + 4)
      done()
    }
  );
})

test('static resolve', done => {
  const testValue = 1
  Promise.resolve(testValue + 1).then(value => {
    expect(value).toBe(testValue + 1)
    done()
  })
})