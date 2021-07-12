import transform from '../index';

export const cases = {
  
  "const a = require('a');": `import * as a from 'a';`,

  "const { a, b } = require('a');": `import { a, b } from 'a';`,
  
  "const { a: d, b } = require('a');": `import { a as d, b } from 'a';`,
  
  "const { a: d, b: c } = require('a');": `import { a as d, b as c } from 'a';`,
  
  "const { b: { s: g } } = require('a');": `import * as _a from 'a';
const {
  b: {
    s: g
  }
} = _a;`,
  
  "const a = require('a').a;": `import { a } from 'a';`,
  
  "const { a: d, b: c } = require('a').a;": `import * as _a from 'a';
const {
  a: d,
  b: c
} = _a.a;`,
  
  "const a = require('a').a.a.a;": `import * as _a from 'a';
const a = _a.a.a.a;`,
  
  "const { b: { s: g } } = require('a').a.a.a;": `import * as _a from 'a';
const {
  b: {
    s: g
  }
} = _a.a.a.a;`,
  
  "const { b: { s: g }, ...rest } = require('a').a.a.a;": `import * as _a from 'a';
const {
  b: {
    s: g
  },
  ...rest
} = _a.a.a.a;`,
  
  "require('index.less');": `import 'index.less';`,
  
  "require('a');": `import 'a';`,
  
  "const s = r.require('a');": `const s = r.require('a');`,
  
  "const a = require('a').default": `import a from 'a';`,
  
  "const { a } = require('a').default": `import _a from 'a';
const {
  a
} = _a;`,
  
  "const { a, b: c } = require('a').default": `import _a from 'a';
const {
  a,
  b: c
} = _a;`,
  
  "const a = require('a').default.a": `import _a from 'a';
const a = _a.a;`,
  
  "const { a } = require('a').default.a": `import _a from 'a';
const {
  a
} = _a.a;`,
  
  "const { a, b: c } = require('a').default.a": `import _a from 'a';
const {
  a,
  b: c
} = _a.a;`,


}

Object.entries(cases).forEach(([key, value]) => {
  test(key, () => {
    const res = transform(key);
    expect(res.code).toBe(value.trim());
    expect(res.errors.length).toBe(0);
  });
});