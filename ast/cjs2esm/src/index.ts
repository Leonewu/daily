import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from "@babel/generator";
import type { GeneratorResult } from "@babel/generator";
import TransformError from './Error';
import getVisitors from './visitor';
import plugin from './plugin';
import babel from '@babel/core';
import fs from 'fs';
import path from 'path';

/**
 * @case1 处理 require 转换成 import {} 或者 import default, 并且移至顶层
 * @visitor CallExpression
 * @api importDeclaration importDefaultSpecifier importSpecifier
 * @case2 处理 exports module.exports 转换成 export const 或者 export default
 * @visitor MemberExpression
 * @api exportNamedDeclaration exportDefaultDeclaration
 * @notice 
 * 1. 命名空间被使用时，不能直接转 export const s = xxx; 
 * 判断 scope.hasBinding(namespace) === true 时，通过 scope.rename(namespace) 重新命名
 * 2. 排除动态 require 和 exports
 * 3. exports.default, module.exports.default, module.exports['default'], exports['default']
 * */

/**
 * @test require
 * const a = require('a');
 * const a = require('a').default;
 * const a = require('a').default.a;
 * const a = require('a').default.a.b;
 * const { a, b } = require('a');
 * const { a, b } = require('a').default;
 * const { a, b } = require('a').default.a;
 * const { a, b } = require('a').default.a.b;
 * const { a: d, b } = require('a'); 
 * const { a: d, b } = require('a').default; 
 * const { a: d, b } = require('a').default.a; 
 * const { a: d, b: c } = require('a');
 * const { a: d, b: c } = require('a').default;
 * const { a: d, b: c } = require('a').default.a;
 * const { b: { s: g } } = require('a');
 * const a = require('a').a;
 * const { a: d, b: c } = require('a').a;
 * const a = require('a').a.a.a;
 * const { b: { s: g } } = require('a').a.a.a;
 * const { b: { s: g }, ...rest } = require('a').a.a.a;
 * require('index.less')
 * require('a')
 * @todo
 */

/**
 * @test exports/module.exports
 * exports.a = 1;
 * exports['a'] = a;
 * exports.a = { a: 1 };
 * module.exports.a = 1;
 * module.exports['a'] = a;
 * module.exports.a = { a: 1 };
 * exports.a = b.c;
 * module.exports = ''
 * module.exports = { a: 123 }
 * exports.default = 1
 * exports.default = { a: 123 }
 * exports.['default'] = ''
 * exports.['a'] = require('a')
 * module.exports.default = ''
 * module.exports['default'] = ''
 * module.exports['default'] = {}
 * module.exports['default'] = require('a');
 * module.exports['default'] = require('a').default;
 * module.exports['default'] = require('a').b.c;
 * module.exports['a'] = require('a').default;
 * module.exports['a'] = require('a').default.a;
 * exports.default = require('a')
 * exports.default = require('a').default
 * exports.default = require('a').default.a
 * exports.default = require('a').b.c
 * @todo
 */

/**
 * @test combine
 * const a = require('a');
 * const { b: c } = require('b');
 * exports.a = a;
 * module.exports.b = b;
 * const e = 1;
 * exports['e'] = e;
 * exports['a'] = require('a').b
 * exports['a'] = require('a').b.c
 * exports.a = require('a')
 * exports['a'] = require('a')
 * exports['a'] = require('a').default
 * exports['a'] = require('a').default.a
 * module.exports['a'] = require('a')
 * module.exports['a'] = require('a').default
 * module.exports['a'] = require('a').default.a
 * @todo
 */

/**
 * @errorboundary
 * 
 * @pass
 * require('index.less').a
 * exports[a--] = 123;
 * exports[a--] = require('a');
 * module.exports[a--] = require('a');
 * module.exports[a--] = require('a') : require('b');
 * function a() {
 *  exports.a = 123;
 * }
 * const a = n ? require('a') : require('b');
 * const a = n || require('s');
 * const a = n + require('s');
 * const d = 'a'; const a = require(d);
 * module.exports[a--] = 123;
 * const s = r.require('a');
 * function a() {
 *  const s = require('b')
 * }
 * if (true) {
 *  const a = require('a');
 * }
 */

type TransformOptions = {
  silent: boolean;
}

function transform(code: string, options?: TransformOptions): (GeneratorResult & { errors: TransformError[] }) {
  const { silent } = options || {};
  const errors = [];
  if (!code.trim()) return {
    code: '',
    errors: [],
    map: null
  };
  const ast = parse(code);
  const visitors = getVisitors(errors);
  traverse(ast, visitors);
  const res = generate(ast);
  if (errors.length && !silent) {
    console.error(`${errors[0].message} (${errors[0].filename}: ${errors[0].line}, ${errors[0].column})`);
  }
  return {
    ...res,
    errors
  };
}

// const content = "module.exports = { a, b }";
// fs.writeFileSync(path.resolve(__dirname, 'output.js'), transform(content).code)

export function babelTransform(code: string) {
  return babel.transform(code, { plugins: [plugin] });
}

export default transform;

