
/* 
  正则速记 
    \d 代表 digit  \w 代表 word \s 代表space
    大写代表反集
    或逻辑：(a|b) a或者b，不一定要用括号，也可在断言中使用
    集合：[a-z0-9a-Z] 这个集合里的内容 
    反集：[^abc] 除了abc 
    捕获(\d) 反捕获 (?:\d) 捕获可以再replace，exec，match获取，注意在match中如果是全局模式就获取不了捕获
    前断言 windows(?=\d) 或者 windows(?!=\d)
    后断言 (?<=\d)windows 或者 (?<!\d)windows
    开头^ 结束$
    次数 +: >=1 *: >=0 ?: 0或1 区间写法{0,}
    模式： g全局模式 m多行multiple匹配 i大小写不敏感

  javascript 中 replace的用法
    这里只说明replace的回调函数的参数
    match, groups, offset, string
    match就是匹配到的字符串
    groups就是捕获组，即()里面的内容
    offset就是下标
    string就是原字符串

  javascript 中 match 注意事项
    match 在全局模式下不会返回捕获组

  使用 new RegExp()注意事项 
    构造函数创建正则对象时需注意对反斜杠的转义，不然会报错
    如 new RegExp('\\w+', 'g', 'i')
    javascript中RegExp对象是有状态的，可以多次调用regexp.exec(str)来获取每一次的结果

  调试链接
    https://regex101.com  https://regexper.com/
*/




// 例子： trim 千分位 邮箱 手机 模板字符串 url 小数/整数

// 不以 _开头的邮箱
const email_reg = /^[^_].+@[a-zA-Z0-9]+\.(com|cn)/

// 电话号码
const phone_reg = /1(35|88|56|59)\d{8}/

// trim
const trim = str => {
  return str.replace(/^\s+/g, '').replace(/\s+$/, '')
}

// 千分位逗号
const commafy = str => {
  if (typeof str !== 'string' && typeof str !== 'number') {
    return ''
  }
  const arr = str.toString().split('.')
  const float_part = arr[1] ? '.' + arr[1] : ''
  const int_part = arr[0].replace(/(\B)(?=(?:\d{3})+$)/g, ',')
  return int_part + float_part
}

// 模板字符串${}
const template = (obj, str) => {
  // 这里还可以写成 /(?<=\$\{)([^\$\{\}]+)(?=\})/g 直接可以拿出变量名
  // 下面这种写法变量名要在replace 回调的第二个参数才拿的到
  str.replace(/\$\{([^\$\{\}]+)\}/g, (a, b) => {
    if (obj && obj.hasOwnProperty(b)) {
      return obj[b]
    }
    return ''
  })
}

// 提取标签内容<a></a>，不支持嵌套
const getTag = (tag, str) => {
  const reg = new RegExp('(?<=<' + tag + '>)' + '([^<\/>]+)' + '(?=<\/' + tag + '>)', ['g'])
  return str.match(reg)
}

// query to obj
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

// get url value by key
const getUrlParam = (key, url) => {
  /* 根据key获取url的值 */
  if (!key || !url) return null
  url = decodeURI(url)
  const reg = new RegExp('(?<=\\?|&)' + key + '=' + '([^?&=]*)', 'g')
  const result = reg.exec(url)
  if (result === null) return null
  return result[1]
}
