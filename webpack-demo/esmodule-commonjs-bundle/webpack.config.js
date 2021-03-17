const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'cjs': './src/cjs/index.js',
    'esm': './src/esm/index.js',
    'compare-export-default': './src/compare-export-default/index.js',
    'esm-and-cjs': './src/esm-and-cjs/index.js',
    'esm-import-cjs': './src/esm-import-cjs/index.js',
    'destruct-when-import-default': './src/destruct-when-import-default/index.js',
  },
  // 设置成 development 方便看
  mode: 'development',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name]/[name].js'
  },
  devtool: false,
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack demo',
      template: './index.html',
      filename: 'compare-export-default/compare-export-default.html',
      chunks: ['compare-export-default']
    }),
    new HtmlWebpackPlugin({
      title: 'webpack demo',
      template: './index.html',
      filename: 'cjs/cjs.html',
      chunks: ['cjs']
    }),
    new HtmlWebpackPlugin({
      title: 'webpack demo',
      template: './index.html',
      filename: 'esm/esm.html',
      chunks: ['esm']
    }),
    new HtmlWebpackPlugin({
      title: 'webpack demo',
      template: './index.html',
      filename: 'esm-and-cjs/esm-and-cjs.html',
      chunks: ['esm-and-cjs']
    }),
    new HtmlWebpackPlugin({
      title: 'webpack demo',
      template: './index.html',
      filename: 'esm-import-cjs/esm-import-cjs.html',
      chunks: ['esm-import-cjs']
    }),
    new HtmlWebpackPlugin({
      title: 'webpack demo',
      template: './index.html',
      filename: 'destruct-when-import-default/destruct-when-import-default.html',
      chunks: ['destruct-when-import-default']
    }),
  ]
}