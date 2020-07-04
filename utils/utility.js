
/* 深拷贝 注意循环引用的时候 */
const deepCopy = (obj, map = new Map()) => {
  function _typeof(obj) {
    // {'Object'|'String'|'Undefined'|'Null'|'Array'|'Number'}
    return Object.prototype.toString.call(obj).match(/\[object\s([a-zA-Z]+)\]/)[1]
  }
  let newObj
  if (_typeof(obj) === 'Object') {
    if (map.has(obj)) {
      newObj = map.get(obj)
    } else {
      newObj = {}
      map.set(obj, newObj)
      Object.keys(obj).forEach(key => {
        newObj[key] = deepCopy(obj[key], map)
      })
    }
  } else if (_typeof(obj) === 'Array') {
    if (map.has(obj)) {
      newObj = map.get(obj)
    } else {
      newObj = []
      map.set(obj, newObj)
      obj.forEach(val => {
        newObj.push(deepCopy(val, map))
      })
    }
  } else {
    return obj
  }
  return newObj
}

const debounce = (fn, delay) => {

}

const throttle = (fn, delay) => {

}

/** trim */
const trim = (str) => {
  return str.replace(/^\s+/, '').replace(/\s+$/, '')
}

/* 将url query转成对象  */
const getUrlParams = (url) => {
  /* 
    将url query转成对象
    注意事项： 对中文的接码，exec的用法
   */
  if (!url) return {}
  url = decodeURI(url)
  const params = {}
  const reg = /(?<=\?|&)([^=]+)=([^?&#]*)/g
  let result = reg.exec(url)
  while (result !== null) {
    params[result[1]] = result[2]
    result = reg.exec(url)
  }
  return params
}

const getUrlParam = (key, url) => {
  /* 根据key获取url的值 */
  if (!key || !url) return null
  url = decodeURI(url)
  const reg = new RegExp('(?<=\\?|&)' + key + '=' + '([^?&=]*)', 'g')
  const result = reg.exec(url)
  if (result === null) return null
  return result[1]
}

const myCall = function(that, ...args) {
  const fn = this
  if (that['temp']) {
    let temp = that['temp']
    that['temp'] = fn
    that['temp'](...args)
    that['temp'] = temp
  } else {
    that['temp'] = fn
    that['temp'](...args)
    delete that['temp']
  }
}
Function.prototype.myCall = myCall

const myBind = function(that, ...args) {
  const bindFn = () => {
    const fn = this
    if (that['temp']) {
      let temp = that['temp']
      that['temp'] = fn
      that['temp'](...args)
      that['temp'] = temp
    } else {
      that['temp'] = fn
      that['temp'](...args)
      delete that['temp']
    }
  }
  return bindFn
}
Function.prototype.myBind = myBind


const sleep = (delay) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, delay)
  })  
}


const descates = () => {
  // 笛卡尔乘积，场景：两个sku的笛卡尔积
  var a = [{ name: '红色' }]
  var b = [{ name: 'S' }, { name: 'M' }]

  function descates(...args) {
    return args.reduce((acc, cur) => {
      const res = []
      acc.forEach(a => {
        cur.forEach(b => {
          res.push(a.concat([b]))
        })
      })
      return res
    }, [[]])
  }

}


const currify = () => {
  /* 柯里化主要是方便对函数的复用，将基本的传参固定，生成一个固定参数的函数，然后将可以将剩余的参数分多次传入 */
  const self = this;
  if (args.length >= fn.length) {
    return fn.call(self, ...args);
  }
  return function(...args2) {
    return currify(fn, ...args, ...args2);
  }
}


const commafy = (str) => {
  // 千分位
  if (typeof str !== 'string' && typeof str !== 'number') {
    return ''
  }
  const arr = str.toString().split('.')
  const float_part = arr[1] ? '.' + arr[1] : ''
  const int_part = arr[0].replace(/(\B)(?=(?:\d{3})+$)/g, ',')
  return int_part + float_part
}


const randomNum = (min, max) => {
  if (min >= max) return false
  return min + Math.floor(Math.random() * (max - min))
}

/* 精度运算 */


const add = function (num1, num2) {
  if (typeof num1 !== 'number' || typeof num2 !== 'number') return 0
  num1 = num1.toString()
  num2 = num2.toString()
  const num1_scale = num1.split('.')[1] ? num1.split('.')[1].length : 0
  const num2_scale = num2.split('.')[1] ? num2.split('.')[1].length : 0
  const scale = Math.max(num1_scale, num2_scale)
  return (Math.pow(10, scale) * num1 + Math.pow(10, scale) * num2) / Math.pow(10, Math.max(num1_scale, num2_scale))
}

const substract = function (num1, num2) {
  if (typeof num1 !== 'number' || typeof num2 !== 'number') return 0
  num1 = num1.toString()
  num2 = num2.toString()
  const num1_scale = num1.split('.')[1] ? num1.split('.')[1].length : 0
  const num2_scale = num2.split('.')[1] ? num2.split('.')[1].length : 0
  const scale = Math.max(num1_scale, num2_scale)
  return (Math.pow(10, scale) * num1 - Math.pow(10, scale) * num2) / Math.pow(10, Math.max(num1_scale, num2_scale))
}

const multiply = function (num1, num2) {
  if (typeof num1 !== 'number' || typeof num2 !== 'number') return 0
  num1 = num1.toString()
  num2 = num2.toString()
  const num1_scale = num1.split('.')[1] ? num1.split('.')[1].length : 0
  const num2_scale = num2.split('.')[1] ? num2.split('.')[1].length : 0
  return (Math.pow(10, num1_scale) * num1 * Math.pow(10, num2_scale) * num2) / Math.pow(10, num1_scale * num2_scale)

}

const devide = function (num1, num2) {
  if (typeof num1 !== 'number' || typeof num2 !== 'number') return 0
  num1 = num1.toString()
  num2 = num2.toString()
  const num1_scale = num1.split('.')[1] ? num1.split('.')[1].length : 0
  const num2_scale = num2.split('.')[1] ? num2.split('.')[1].length : 0
  const scale = Math.max(num1_scale, num2_scale)
  return (Math.pow(10, scale) * num1) / (Math.pow(10, scale) * num2)
}

// 数组中任意选取 n 个元素
const combine = function(left, n, right = [], res = []) {
  if (n == 0) {
    res.push(right)
    return res
  }
  if (left.length == n) {
    res.push(right.concat(left))
    return res
  }
  for (var i = 0; i <= left.length - n; i++) {
    var temp = right.slice()
    temp.push(left[i])
    combine(left.slice(i + 1), n - 1, temp, res)
  }
  return res
}
combine([1, 2, 3, 4], 3)
