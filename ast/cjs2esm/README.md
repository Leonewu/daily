# CommonJs to EsModule

This plugin builds for transforming commonjs to esModule.

## Usage

```js
import transform from 'cjs2sem';
const { errors, code } = transform('your code');
```

## Example

- require expression

```js
const a = require('a');
// => import * as a from 'a';
const { a } = require('a');
// => import { a } from 'a';
const a = require('a').default;
// => import a from 'a';
require('index.less');
// => import 'index.less';
```

- exports expression

```js
exports.a = 123;
// => export const a = 123;
exports.default = a;
// => export default a;
module.exports.a = 123;
// => export const a = 123;
module.exports = a;
// => export default a;
module.exports.default = a;
// => export default a;
```

- some unhandled cases  
The cases below will be preserved and the errors will show up in array `transform(code).errors`.  
Remember to check whether the errors is empty or not.
  1. dynamic require

      ```js
      const a = f ? require('a') : require('b');
      ```

  2. dynamic exports

      ```js
      module.exports[a--] = 123;
      ```

This plugin covers other complex cases.Learn more in directory `__tests__`.

## Cli

There is also a cli tool.

- transform file
`npx cjs2esm index.js --out-file ./index-esm.js`
- transform directory
`npx cjs2esm ./cjs --out-dir ./esm`

## 注意

1. 无法将被 babel-plugin-transform-modules-commonjs 转换过的 commonJs 模块再次还原成 esModule
2. 只适用于未编译过的 commonJs 模块，不适用于包含了 _interopRequireDefault 这种运行时的模块
3. 不规范的 commonJs 语法将不会被转换，会被保留
4. 动态的 require, exports 不会被转换，会被保留
