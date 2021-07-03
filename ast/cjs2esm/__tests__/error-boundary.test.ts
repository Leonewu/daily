import transform from '../index';

export const cases = {

  "require('index.less').a;": `require('index.less').a;`,

  "exports[a--] = 123;": `exports[a--] = 123;`,

  "exports[a--] = require('a');": `exports[a--] = require('a');`,

  "module.exports[a--] = require('a');": `module.exports[a--] = require('a');`,

  "module.exports[a--] = a ? require('a') : require('b');": `module.exports[a--] = a ? require('a') : require('b');`,

  "function a() {\nexports.a = 123;\n}": "function a() {\n  exports.a = 123;\n}",

  "const a = n ? require('a') : require('b');": `const a = n ? require('a') : require('b');`,

  "const a = n || require('s');": `const a = n || require('s');`,

  "const a = n + require('s');": `const a = n + require('s');`,

  "const d = 'a';\nconst a = require(d);": "const d = 'a';\n\nconst a = require(d);",

  "module.exports[a--] = 123;": `module.exports[a--] = 123;`,

  "function a() {\nconst s = require('b')\n}": "function a() {\n  const s = require('b');\n}",

  "if (true) {\nconst a = require('a');\n}": "if (true) {\n  const a = require('a');\n}",

  "exports = require('a');": "exports = require('a');",
}
Object.entries(cases).forEach(([key, value]) => {

  test(key, () => {
    const res = transform(key, { silent: true });
    expect(res.code).toBe(value.trim());
    expect(res.errors.length).toBeGreaterThan(0);
  });

});