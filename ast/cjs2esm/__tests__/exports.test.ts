import transform from '../index';


export const cases = {

  "exports.a = 1;": `export const a = 1;`,

  "exports['a'] = a;": `export const a = a;`,

  "exports.a = { a: 1 };": `
export const a = {
  a: 1
};`,

  "module.exports.a = 1;": `export const a = 1;`,

  "module.exports['a'] = a;": `export const a = a;`,

  "module.exports.a = { a: 1 };": `
export const a = {
  a: 1
};`,

  "exports.a = b.c;": `export const a = b.c;`,

  "module.exports = '';": `export default '';`,

  "module.exports = { a: 123 };": `
export default {
  a: 123
};`,

  "exports.default = 1;": `export default 1;`,

  "exports.default = { a: 123 }": `
export default {
  a: 123
};`,

  "exports.['default'] = '';": `export default '';`,

  "module.exports.default = '';": `export default '';`,

  "module.exports['default'] = '';": `export default '';`,

  "module.exports['default'] = require('a');": `
import _uid from 'a';
export default _uid;`,

  "module.exports['default'] = require('a').b.c;": `
import _uid from 'a';
const _default = _uid.b.c;
export default _default;`,

  "exports.default = require('a');": `
import _uid from 'a';
export default _uid;`,

  "exports.default = require('a').b.c;": `
import _uid from 'a';
const _default = _uid.b.c;
export default _default;`,

}

Object.entries(cases).forEach(([key, value]) => {
  test(key, () => {
    const res = transform(key);
    expect(res.code).toBe(value.trim());
    expect(res.errors.length).toBe(0);
  });
});