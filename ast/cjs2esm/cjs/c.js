// const a = require('a').a;
// =>
// import _a from 'a';
// const a = _a.a;


// exports.a = require('a').a;

// exports.a = a.a;
// exports.a = require('a').b.c

// exports.a = require('a');

// exports.a = b.c;

// exports.a = {
//   d: 123
// }

// export { default as a } from 'a';

// exports['a'] = require('a').b.c
// module.exports.a = require('a')
// module.exports.a = require('a').b.c
// module.exports['a'] = require('a')
// module.exports['a'] = require('a').b.c;
// module.exports = a;
// module.exports = a.b.c;


// const { b: { s: g } } = require('a');

// const a = require('a').b;
// const e = require('a').b.c.d;

// const { a, b: s } = require('b');
//  const { b: { s: g2 } } = require('a');
//  const a1 = require('a').a;
//  const { a: d, b: c } = require('a').a;
//  const a2 = require('a').a.a.a;
//  const { b: { s: g1 } } = require('a').a.a.a;

// exports['default'] = require('a').b.c;
// exports.default = require('a').b.c.d
// exports.default = require('a');
exports.a = function a() {
  console.log(123)
};