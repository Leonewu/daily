# CommonJs to EsModule

This plugin builds for transforming commonjs to esModule.

## Usage

```js
import transform from 'cjs2sem';
const { errors, code } = transform('your code');
```

## Rules

- `require('a').default` is regarded as default import
- `require('a')` is regarded as namespace import
- `exports.default`, `module.exports`, `module.export.default` are regarded as default export
- `export.xxx`, `module.exports.xxx` are regarded as namespace export
- illegal `require/exports` expression will not be transform

## Example

see the transform example below

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

- complex cases

```js
module.exports = require('a');
// => 
// import * as _a from 'a';
// export default _a;
module.exports.a = require('a').default;
// =>
// import _a from 'a';
// export const a = _a;
module.exports.a = require('a').b.c;
// =>
// import _a from 'a';
// export const a = _a.b.c;
```

- some unhandled cases  
The cases below will be preserved and errors will show up in `transform(code).errors`.  
Remember to check whether the errors is empty or not.
    1. dynamic require

        ```js
        const a = f ? require('a') : require('b');
        ```

    2. dynamic exports

        ```js
        module.exports[a--] = 123;
        ```

    3. require/exports isn't at top level or in a block

        ```js
        if (true) require('a');
        ```

Other cases can be found in test files at directory `__tests__`.

## CLI

There is also a cli tool.

- transform file
`npx cjs2esm ./index.js --out-file ./index-esm.js`
- transform directory
`npx cjs2esm ./cjs --out-dir ./esm`

## ??????

1. ???????????? babel-plugin-transform-modules-commonjs ???????????? commonJs ????????????????????? esModule
2. ??????????????????????????? commonJs ?????????????????????????????? _interopRequireDefault ????????????????????????
3. ???????????? commonJs ???????????????????????????????????????
4. ????????? require, exports ??????????????????????????????
