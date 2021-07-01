import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import generate from "@babel/generator";
import fs from 'fs';
import path from 'path';

/**
 * @case1 处理 require 转换成 import {} 或者 import default, 并且移至顶层
 * @visitor CallExpression
 * @api importDeclaration importDefailtSpecifier importSpecifier
 * @case2 处理 exports module.exports 转换成 export const 或者 export default
 * @visitor MemberExpression
 * @api exportNamedDeclaration exportDefaultDeclaration
 * @notice 
 * 1. 命名空间被使用时，不能直接转 export const s = xxx; 
 * 判断 scope.hasBinding(namespace) === true 时，通过 scope.rename(namespace) 重新命名
 * 2. 
 * */

/**
 * @test require
 * const a = require('a');
 * const { a, b } = require('a');
 * const { a: d, b } = require('a'); 
 * const { a: d, b: c } = require('a');
 * @todo
 * const { b: { s: g } } = require('a');
 * const a = require('a').a;
 * const { a: d, b: c } = require('a').a;
 * const a = require('a').a.a.a;
 * const { b: { s: g } } = require('a').a.a.a;
 */

/**
 * @test exports/module.exports
 * exports.a = 1;
 * exports['a'] = a;
 * exports.a = { a: 1 };
 * 
 * module.exports.a = 1;
 * module.exports['a'] = a;
 * module.exports.a = { a: 1 };
 */

/**
 * @test combine
 * const a = require('a');
 * const { b: c } = require('b');
 * exports.a = a;
 * module.exports.b = b;
 * const e = 1;
 * exports['e'] = e;
 * @todo
 * exports = require('a');
 * exports['a'] = require('a')
 * exports.a = require('a')
 * exports['a'] = require('a').a
 * exports['a'] = require('a').a.a
 * module.exports['a'] = require('a')
 */

const a = fs.readFileSync(path.resolve(__dirname, 'cjs/c.js'), 'utf-8');
// const b = fs.readFileSync(path.resolve(__dirname, 'cjs/b.js'));
// const c = fs.readFileSync(path.resolve(__dirname, 'cjs/c.js'));
const astA = parse(a);

traverse(astA, {
  CallExpression(path) {
    debugger
    if (t.isIdentifier(path.node.callee, { name: 'require' })) {
      // const { a, b: s } = require('b');
      const root = path.findParent(t.isProgram);
      if ( t.isObjectPattern(path.parent.id)) {
        const specfiers = [];
        path.parent.id.properties.forEach(property => {
          const { key, value } = property;
          specfiers.push(t.importSpecifier(value, key));
        });
        // path.parentPath.parentPath.replaceWith(t.importDeclaration(specfiers, path.node.arguments[0]));
        path.parentPath.parentPath.remove();
        root.node.body.unshift(t.importDeclaration(specfiers, path.node.arguments[0]));
      } else {
        // cosnt a = require('a')
        const defaultImport = t.importDeclaration([
          t.importDefaultSpecifier(path.parent.id)
        ], path.node.arguments[0]);
        // path.parentPath.parentPath.replaceWith(defaultImport);
        path.parentPath.parentPath.remove();
        root.node.body.unshift(defaultImport);
      }
    }
  },
  MemberExpression(path) {
    // exports.xxx = xxx;
    debugger
    if (t.isIdentifier(path.node.object, { name: 'exports' }) && t.isAssignmentExpression(path.parent)) {
      const leftProperty = path.node.property;
      const right= path.parent.right;
      let leftIdentifier;
      if (t.isStringLiteral(leftProperty)) {
        // exports['xxx'] = xxx
        if (path.scope.hasBinding(leftProperty.value)) {
          path.scope.bindings[leftProperty.value].scope.rename(leftProperty.value);
        }
        leftIdentifier = t.identifier(leftProperty.value);
      } else {
        // exports.xxx = xxx;
        if (path.scope.hasBinding(leftProperty.name)) {
          path.scope.bindings[leftProperty.name].scope.rename(leftProperty.name);
        }
        leftIdentifier = leftProperty;
      }
      const declaration = t.exportNamedDeclaration(t.variableDeclaration('const', [t.variableDeclarator(leftIdentifier, right)]));
      path.parentPath.parentPath.replaceWith(declaration);
    }
    // module.exports = xxx; => export default xxx
    if (
      t.isIdentifier(path.node.object, { name: 'module' }) && 
      t.isIdentifier(path.node.property, { name: 'exports' }) && 
      t.isAssignmentExpression(path.parent)
    ) {
      const declaration = t.exportDefaultDeclaration(path.parent.right);
      // 要注意替换的位置
      path.parentPath.parentPath.replaceWith(declaration);
    }
    // module.exports.xxx = xxx; => export const xxx
    if (
      t.isIdentifier(path.node.object, { name: 'module' }) && 
      t.isIdentifier(path.node.property, { name: 'exports' }) && 
      t.isMemberExpression(path.parent) && 
      t.isAssignmentExpression(path.parentPath.parent)
    ) {
      const leftProperty = path.parent.property;
      const right= path.parentPath.parent.right;
      let leftIdentifier;
      if (t.isStringLiteral(leftProperty)) {
        // module.exports['xxx'] = xxx
        if (path.scope.hasBinding(leftProperty.value)) {
          path.scope.bindings[leftProperty.value].scope.rename(leftProperty.value);
        }
        leftIdentifier = t.identifier(leftProperty.value);
      } else {
        // module.exports.xxx = xxx;
        if (path.scope.hasBinding(leftProperty.name)) {
          path.scope.bindings[leftProperty.name].scope.rename(leftProperty.name);
        }
        leftIdentifier = leftProperty;
      }
      const declaration = t.exportNamedDeclaration(t.variableDeclaration('const', [t.variableDeclarator(leftIdentifier, right)]));
      path.parentPath.parentPath.parentPath.replaceWith(declaration);
    }
  }
});

const output = generate(astA);

fs.writeFileSync(path.resolve(__dirname, './output.js'), output.code);
// console.log(JSON.stringify(output));