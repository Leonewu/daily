const deepCopy = (obj) => {

}

const debounce = (fn, delay) => {

}

const throttle = (fn, delay) => {

}

const trim = (str) => {
  return str.replace(/^\s+/, '').replace(/\s+$/, '')
}


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