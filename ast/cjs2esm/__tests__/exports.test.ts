import transform from '../index';


export const cases = {

  "exports.a = 1;": `export const a = 1;`,

  "exports['a'] = a;": `export const a = a;`,
  
  "exports.a = { a: 1 };": `export const a = {
  a: 1
};`,
  
  "module.exports.a = 1;": `export const a = 1;`,
  
  "module.exports['a'] = a;": `export const a = a;`,
  
  "module.exports.a = { a: 1 };": `export const a = {
  a: 1
};`,
  
  "exports.a = b.c;": `export const a = b.c;`,
  
  "module.exports = '';": `export default '';`,
  
  "module.exports = { a: 123 };": `export default {
  a: 123
};`,
  
  "module.exports = { a };": `export default {
  a
};`,
  
  "module.exports = { a, b };": `export default {
  a,
  b
};`,
  
  "module.exports = function () {};": `export default (function () {});`,
  
  "exports.default = 1;": `export default 1;`,
  
  "exports.default = { a: 123 }": `export default {
  a: 123
};`,
  
  "exports.['default'] = '';": `export default '';`,
  
  "module.exports.default = '';": `export default '';`,
  
  "module.exports['default'] = '';": `export default '';`,
  
  "module.exports['default'] = require('a');": `import * as _a from 'a';
export default _a;`,
  
  "module.exports['default'] = require('a').default.a;": `import _a from 'a';
const _default = _a.a;
export default _default;`,
  
  "module.exports['default'] = require('a').default;": `import _a from 'a';
export default _a;`,
  
  "module.exports['default'] = require('a').b.c;": `import * as _a from 'a';
const _default = _a.b.c;
export default _default;`,
  
  "exports.default = require('a');": `import * as _a from 'a';
export default _a;`,
  
  "exports['default'] = require('a');": `import * as _a from 'a';
export default _a;`,
  
  "exports['default'] = require('a').a;": `import * as _a from 'a';
const _default = _a.a;
export default _default;`,
  
  "exports.default = require('a').default;": `import _a from 'a';
export default _a;`,
  
  "exports.default = require('a').default.a;": `import _a from 'a';
const _default = _a.a;
export default _default;`,
  
  "exports.default = require('a').b.c;": `import * as _a from 'a';
const _default = _a.b.c;
export default _default;`,

}

Object.entries(cases).forEach(([key, value]) => {
  test(key, () => {
    const res = transform(key);
    expect(res.code).toBe(value.trim());
    expect(res.errors.length).toBe(0);
  });
});