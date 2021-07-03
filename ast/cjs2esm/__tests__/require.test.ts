import transform from '../index';

export const cases = {
  
  "const a = require('a');": `import a from 'a';`,

  "const { a, b } = require('a');": `import { a, b } from 'a';`,

  "const { a: d, b } = require('a');": `import { a as d, b } from 'a';`,

  "const { a: d, b: c } = require('a');": `import { a as d, b as c } from 'a';`,

  "const { b: { s: g } } = require('a');": `
import _uid from 'a';
const {
  b: {
    s: g
  }
} = _uid;`,

  "const a = require('a').a;": `
import _uid from 'a';
const a = _uid.a;`,

  "const { a: d, b: c } = require('a').a;": `
import _uid from 'a';
const _uid2 = _uid.a;
const {
  a: d,
  b: c
} = _uid2;`,

  "const a = require('a').a.a.a;": `
import _uid from 'a';
const a = _uid.a.a.a;`,

  "const { b: { s: g } } = require('a').a.a.a;": `
import _uid from 'a';
const _uid2 = _uid.a.a.a;
const {
  b: {
    s: g
  }
} = _uid2;`,

  "const { b: { s: g }, ...rest } = require('a').a.a.a;": `
import _uid from 'a';
const _uid2 = _uid.a.a.a;
const {
  b: {
    s: g
  },
  ...rest
} = _uid2;`,

  "require('index.less');": `import 'index.less';`,

  "require('a');": `import 'a';`,

  "const s = r.require('a');": `const s = r.require('a');`,

}

Object.entries(cases).forEach(([key, value]) => {
  test(key, () => {
    const res = transform(key);
    expect(res.code).toBe(value.trim());
    expect(res.errors.length).toBe(0);
  });
});