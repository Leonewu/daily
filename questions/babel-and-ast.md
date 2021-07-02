# babel and ast

## babel

`@babel/polyfill`

`useBuiltins`

.babelrc 配置

## AST

AST 为 Abstract Syntax Tree，是描述代码的抽象数据结构。  
一段代码通过换行符或者`;`可以分割成若干个表达式，每个表达式都有对应的类型，如 `VariableDeclaration` 变量定义类型，`FunctionDeclaration` 函数声明类型，等等...，每种表达式里面又有一些子表达式，如 `ExpressionStatement` 赋值表达式。最外层的表达式构成了一个数组，这个数组就是这段代码的 AST 结构。

- parse
- traverse
- generate

## @babel/parser

前身是 babylon，是从 acorn fork 出来的一个分支

## @babel/traverse

遍历 ast 的工具，如果我们深度遍历一个 ast 结构，手写会很麻烦，这个模块可以让我们以接口的形式访问对应的表达式，并且修改它

## @babel/types

babel 关于 ast 的一个工具库，暴露出一些判断表达式和生成表达式对象的函数。

## @babel/generator

一个将 ast 还原成代码的工具

## astexplorer

写 ast 插件必备 [astexplorer](https://astexplorer.net/)

### 应用

- 加上 try catch
- 为 console.log 加上行数
- 箭头函数转普通函数
