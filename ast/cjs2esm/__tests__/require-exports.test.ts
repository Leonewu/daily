import transform from '../src/index';

export const cases = {

  "exports.a = a;": `export const a = a;`,

  "const a = 1;\nexports.a = a;": `const _a = 1;
export const a = _a;`,
  
  "module.exports.b = b;": `export const b = b;`,
  
  "const e = 1;": `const e = 1;`,
  
  "exports['e'] = e;": `export const e = e;`,
  
  "exports['a'] = require('a').b;": `import * as _a from 'a';
export const a = _a.b;`,
  
  "exports['a'] = require('a').b.c;": `import * as _a from 'a';
export const a = _a.b.c;`,
  
  "exports.a = require('a');": `import * as _a from 'a';
export const a = _a;`,
  
  "exports['a'] = require('a');": `import * as _a from 'a';
export const a = _a;`,
  
  "exports['a'] = require('a').default;": `import _a from 'a';
export const a = _a;`,
  
  "exports['a'] = require('a').default.a;": `import _a from 'a';
export const a = _a.a;`,
  
  "exports['a'] = require('a')['default'].a;": `import _a from 'a';
export const a = _a.a;`,
  
  "module.exports['a'] = require('a');": `import * as _a from 'a';
export const a = _a;`,
  
  "module.exports['a'] = require('a').default;": `import _a from 'a';
export const a = _a;`,
  
  "module.exports['a'] = require('a')['default'];": `import _a from 'a';
export const a = _a;`,
  
  "module.exports = require('a');": `import * as _a from 'a';
export default _a;`,
  
  "module.exports = require('a').default;": `import _a from 'a';
export default _a;`,
  
  "module.exports = require('a')['default'];": `import _a from 'a';
export default _a;`,
  
  "module.exports = require('a')['default'].a;": `import _a from 'a';
const _default = _a.a;
export default _default;`,
  
  "module.exports = require('a').default.a;": `import _a from 'a';
const _default = _a.a;
export default _default;`,
  
  "module.exports.default = require('a');": `import * as _a from 'a';
export default _a;`,
  
  "module.exports['default'] = require('a').default;": `import _a from 'a';
export default _a;`,
  
  "module.exports.default = require('a')['default'];": `import _a from 'a';
export default _a;`,
  
  "module.exports['default'] = require('a')['default'].a;": `import _a from 'a';
const _default = _a.a;
export default _default;`,
  
  "module.exports.default = require('a').default.a;": `import _a from 'a';
const _default = _a.a;
export default _default;`,
  
}

Object.entries(cases).forEach(([key, value]) => {
  test(key, () => {
    const res = transform(key);
    expect(res.code).toBe(value.trim());
    expect(res.errors.length).toBe(0);
  });
});