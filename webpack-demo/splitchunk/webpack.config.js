const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'index': './src/index.js',
  },
  // 设置成 development 方便看
  // mode: 'development',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js'
  },
  devtool: false,
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack demo',
      template: './index.html',
      filename: 'index.html',
      chunks: ['index']
    }),
  ],
  // optimization: {
  //   usedExports: true,
  // }
}