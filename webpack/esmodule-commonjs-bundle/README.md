# webpack demo

这是一个比较 webpack 对 esModule，commonJs 模块打包产物的 demo  
src 为源码目录  
dist 为编译目录  
编译：

1. 在 webpack 目录下 npm i
2. 在 esmodule-commonjs-bundle 目录下执行 npx webpack

目录解释

- cjs：只使用 commonJs 规范的打包编译
- esm：只使用 esModule 规范的打包编译  
- compare-export-default：比较 esModule 的普通导出和默认导出的打包编译  
- exm-and-cjs：比较 esModule + commonJs 的打包编译  
- esm-import-cjs：使用 esModule 的语法引入 commonJs 模块后的打包编译
- destruct-when-import-default：在 esModule 默认引入的时候解构
