
const fs = require('fs-extra')


// 低配版 glob
// {dir1,dir2}/**/*.{scss,less,styl,css}
// 只支持的语法： **, *, {dir1,dir2,!dir3}, *.{ts,js} 如上
// 思路：
// 1. 确定入口 entry，即 * 之前的路径
// 2. 将除入口之外，剩余的路径按照 / 分割
// 3. 分割出来的数组 routes，假设 routes 有两层，就生成一个相同长度的数组 results
// 4. 遍历 routes，从入口 entry 开始，将每一层的结果塞进 results 相同层的数组中
// 5. 遍历过程中，从第二层开始的父路径，都从 results 拿
// 6. 遍历结束，从结果 results 中拿出最后一层的结果，再根据 {index}.{vue} 之类的条件过滤
function glob(str) {
  let files = []
  // 最后的结果是否为目录
  const shouldPickDir = str.substr(-1) === '/'
  const entry = str.match(/([^*{}]+)\//)[1]
  let fileNames = [], fileExts = [] 
  const routes = str.replace(entry, '').split('/')
  if (routes[routes.length - 1] && routes[routes.length - 1].includes('.')) {
    // 有指定文件名
    const file = routes.pop().split('.')
    if (/\{(.+)\}/.test(file[0])) {
      fileNames = file[0].match(/\{(.+)\}/)[1].split(',')
    } else {
      fileNames = [file[0]]
    }
    if (/\{(.+)\}/.test(file[1])) {
      fileExts = file[1].match(/\{(.+)\}/)[1].split(',')
    } else {
      fileExts = file[1] ? [file[1]] : []
    }
    if (fileExts.length || fileNames.length) {
      routes.push('*')
    }
  }
  console.log('names: ', fileNames)
  console.log('exts:', fileExts)
  routes[0] === '' && routes.shift()
  routes[routes.length - 1] === '' && routes.pop()
  console.log(routes)
  const results = routes.map(() => [])
  routes.forEach((route, index) => {
    let res = []
    if (route === '*') {
      if (index === 0) {
        if (index === routes.length - 1 && !shouldPickDir) {
          // 刚好第一层就是最后一层，并且不用只筛出目录
          res = fs.readdirSync(entry).map(s => `${entry}/${s}`)
        } else {
          res = fs.readdirSync(entry).map(s => `${entry}/${s}`)
          res = res.filter(p => isDirectory(p))
        }
      } else {
        // 不是第一个 *
        results[index - 1].forEach(parent => {
          const sub = fs.readdirSync(parent).map(s => `${parent}/${s}`)
          if (index < routes.length - 1 || shouldPickDir) {
            // 不是最后一个
            // 或者是最后一个，并且要筛出目录
            res = res.concat(sub.filter(p => isDirectory(p)))
          } else {
            res = res.concat(...sub)
          }
        })
      }
      results[index] = res
    } else if (route === '**') {
      if (index === 0) {
        if (index === routes.length - 1 && !shouldPickDir) {
          // 刚好第一层就是最后一层，并且不用只筛出目录
          res = getAllPath(entry, false)
        } else {
          res = getAllPath(entry, true)
        }
      } else {
        results[index - 1].forEach(parent => {
          if (index < routes.length - 1 || shouldPickDir) {
            // 不是最后一个，拿出所有目录
            // 或者是最后一个，并且要筛出目录
            res = res.concat(getAllPath(parent, true))
          } else {
            res = res.concat(getAllPath(parent, false))
          }
        })
      }
    } else if (/\{(.+)\}/.test(route)) {
      // {} 的情况
      const conditions = route.match(/\{(.+)\}/)[1].split(',')
      const includeDirs = conditions.filter(s => !s.includes('!'))
      const excludeDirs = conditions.filter(s => s.includes('!'))
      if (index === 0) {
        if (index === routes.length - 1 && !shouldPickDir) {
          // 刚好第一层就是最后一层，并且不用只筛出目录
          res = fs.readdirSync(entry).filter(s => {
            return includeDirs.includes(s) && !excludeDirs.includes(s)
          }).map(s => `${entry}/${s}`)
        } else {
          res = fs.readdirSync(entry).filter(s => {
            return includeDirs.includes(s) && !excludeDirs.includes(s)
          }).map(s => `${entry}/${s}`)
          res = res.filter(p => isDirectory(p))
        }
      } else {
        // 不是第一个 *
        results[index - 1].forEach(parent => {
          const sub = fs.readdirSync(parent).filter(s => {
            return includeDirs.includes(s) && !excludeDirs.includes(s)
          }).map(s => `${parent}/${s}`)
          if (index < routes.length - 1 || shouldPickDir) {
            // 不是最后一个
            // 或者是最后一个，并且要筛出目录
            res = res.concat(sub.filter(p => isDirectory(p)))
          } else {
            res = res.concat(...sub)
          }
        })
      }
    }
    results[index] = res
  })
  files = results[results.length - 1]
  // 过滤最后的文件名
  if (fileNames.length || fileExts.length) {
    files = files.filter(filePath => {
      const file = filePath.match(/([^./]+\.[^./]+)$/)
      if (!file) {
        return false
      }
      const name = file[0].split('.')[0]
      const ext = file[0].split('.')[1]
      const includeName = fileNames.includes(name) || fileNames.includes('*')
      const includeExt = fileExts.includes(ext) || fileExts.includes('*')
      if (includeName && includeExt) {
        return true
      }
      return false
    })
  }
  return files
}

function getAllPath(filePath, shouldPickDir) {
  // 获取路径下的所有文件或者文件夹
  let res = []
  res.push(filePath)
  if (fs.lstatSync(filePath).isDirectory()) {
    const subPath = fs.readdirSync(filePath).map(p => `${filePath}/${p}`)
    subPath.forEach(p => {
      const sub = getAllPath(p, shouldPickDir)
      res = res.concat(sub)
    })
  }
  if (shouldPickDir) {
    res = res.filter(p => isDirectory(p))
  }
  return res
}

function isDirectory(filePath) {
  return fs.lstatSync(filePath).isDirectory()
}

// console.log(glob('/home/leone/lib/*/'))
// console.log(glob('/home/leone/lib/*'))
// select 下第二层目录的所有文件和文件夹 select/components/index.vue
// console.log(glob('/home/leone/lib/xiao-ui/src/select/*/*'))
// select 下第二层目录下所有文件夹，即 select/components/dir
// console.log(glob('/home/leone/lib/xiao-ui/src/select/*/*/'))
// console.log(glob('/home/leone/lib/xiao-ui/src/select/*/{index}.{vue,jsx,tsx}'))
// select 下的所有目录下的所有文件和所有文件夹
// console.log(glob('/home/leone/lib/xiao-ui/src/select/**'))
// select 下的所有目录下的所有文件夹
// console.log(glob('/home/leone/lib/xiao-ui/src/select/**'))
// select 下指定文件
// console.log(glob('/home/leone/lib/xiao-ui/src/select/**/*.{vue,md}'))
// select 下的指定目录目录下的所有文件和文件夹
// console.log(glob('/home/leone/lib/xiao-ui/src/{select}/{*,!components}/**/*'))
// console.log(glob('/home/leone/lib/xiao-ui/package.json'))



module.exports = {
  glob
}