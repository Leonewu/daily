const path = require('path');

// 测试 esm 和 cjs 相互引用会打包成什么样

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'main.js'
  },
  devtool: false
}