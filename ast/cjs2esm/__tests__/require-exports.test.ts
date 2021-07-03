import transform from '../index';

export const cases = {

  "exports.a = a;": `export const a = a;`,

  "const a = 1;\nexports.a = a;": "const _a = 1;\nexport const a = _a;",

  "module.exports.b = b;": `export const b = b;`,

  "const e = 1;": `const e = 1;`,

  "exports['e'] = e;": `export const e = e;`,

  "exports['a'] = require('a').b;": `
import _uid from 'a';
export const a = _uid.b;`,

  "exports['a'] = require('a').b.c;": `
import _uid from 'a';
export const a = _uid.b.c;`,

  "exports.a = require('a');": `
import _uid from 'a';
export const a = _uid;`,

  "exports['a'] = require('a');": `
import _uid from 'a';
export const a = _uid;`,

  "module.exports['a'] = require('a');": `
import _uid from 'a';
export const a = _uid;`,

 "module.exports = require('a');": `export { default } from 'a';`
}

Object.entries(cases).forEach(([key, value]) => {
  test(key, () => {
    const res = transform(key);
    expect(res.code).toBe(value.trim());
    expect(res.errors.length).toBe(0);
  });
});