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
 * 2. 排除动态 require 和 exports
 * 3. exports.default, module.exports.default, module.exports['default'], exports['default']
 * */

/**
 * @test require
 * const a = require('a');
 * const { a, b } = require('a');
 * const { a: d, b } = require('a'); 
 * const { a: d, b: c } = require('a');
 * const { b: { s: g } } = require('a');
 * const a = require('a').a;
 * const { a: d, b: c } = require('a').a;
 * const a = require('a').a.a.a;
 * const { b: { s: g } } = require('a').a.a.a;
 * const { b: { s: g }, ...rest } = require('a').a.a.a;
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
 * module.exports.default = ''
 * module.exports['default'] = ''
 * module.exports['default'] = require('a');
 * module.exports['default'] = require('a').b.c;
 * exports.default = require('a')
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
 * module.exports['a'] = require('a')
 * @todo
 */

const a = fs.readFileSync(path.resolve(__dirname, 'cjs/c.js'), 'utf-8');
// const b = fs.readFileSync(path.resolve(__dirname, 'cjs/b.js'));
// const c = fs.readFileSync(path.resolve(__dirname, 'cjs/c.js'));
const astA = parse(a);

traverse(astA, {
  CallExpression(path) {
    if (t.isIdentifier(path.node.callee, { name: 'require' })) {
      const assignmentExpression = path.findParent(p => t.isAssignmentExpression(p));
      if (assignmentExpression?.shouldSkip) {
        // skip if exports immediately when required
        // it was handled in memberExpression
        return;
      }
      if (!t.isProgram(path.getStatementParent().parent)) {
        // dynamic require or not the top require
        console.warn('There are some require statements inside a block.Please move it to the top level')
        return;
      }
      const root = path.findParent(t.isProgram);
      if (t.isMemberExpression(path.parent)) {
        // const a = require('a').a.b.c; => import uid from 'a'; const a = uid.a.b.c;
        const uid = path.scope.generateUidIdentifier("uid");
        const importStatement = t.importDeclaration([t.importDefaultSpecifier(uid)], path.node.arguments[0]);
        root.node.body.unshift(importStatement);
        path.parent.object = uid;
        const variableDeclarator = path.find(p => t.isVariableDeclarator(p));
        let id = variableDeclarator.node.id;
        if (t.isObjectPattern(id)) {
          // const { a, b, ...rest } = require('a').e.f; 
          // => import uid from 'a'; 
          //    const uid1 = uid.e.f; 
          //    const { a, b, ...rest } = uid1;
          const variableStatement = [];
          const uid2 = path.scope.generateUidIdentifier("uid");
          const statement1 = t.variableDeclaration('const', [t.variableDeclarator(uid2, variableDeclarator.node.init)]);
          variableStatement.push(statement1);
          const statement2 = t.variableDeclaration('const', [t.variableDeclarator(id, uid2)]);
          variableStatement.push(statement2);
          variableDeclarator.parentPath.replaceWithMultiple(variableStatement);
        } else {
          // const a = require('a').b.c => import uid from 'a'; const a = uid.b.c;
          variableDeclarator.parentPath.replaceWith(t.variableDeclaration('const', [t.variableDeclarator(id, variableDeclarator.node.init)]));
        }
        // replace the callExpression to the uid
      } else if (t.isObjectPattern(path.parent.id)) {
        // const { a, b: s } = require('b'); => import uid from 'b'; const { a, b: s } = uid;
        const uid = path.scope.generateUidIdentifier("uid");
        const importStatement = t.importDeclaration([t.importDefaultSpecifier(uid)], path.node.arguments[0]);
        root.node.body.unshift(importStatement);
        const variableStatement = t.variableDeclaration('const', [t.variableDeclarator(path.parent.id, uid)]);
        path.parentPath.parentPath.replaceWith(variableStatement);
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
    if (
      (t.isIdentifier(path.node.object, { name: 'exports' }) ||
      (t.isIdentifier(path.node.object, { name: 'module' }) && 
      t.isIdentifier(path.node.property, { name: 'exports' }))) &&
      !t.isProgram(path.getStatementParent().parent)
    ) {
      // dynamic exports of not the top level scope exports
      console.warn('There are some exports/module.exports statements inside a block.Please move it to the top level')
      return;
    }
    // exports
    if (t.isIdentifier(path.node.object, { name: 'exports' }) && t.isAssignmentExpression(path.parent)) {
      const leftProperty = path.node.property;
      const right = path.parent.right;
      let leftIdentifier;
      let isExportDefault = false;
      if (t.isStringLiteral(leftProperty)) {
        // exports['xxx'] = xxx;
        if (leftProperty.value === 'default') {
          // module.exports['default'] = ''
          isExportDefault = true;
        }
        if (path.scope.hasBinding(leftProperty.value)) {
          path.scope.bindings[leftProperty.value].scope.rename(leftProperty.value);
        }
        leftIdentifier = t.identifier(leftProperty.value);
      } else {
        // exports.xxx = xxx;
        if (leftProperty.name === 'default') {
          // module.exports['default'] = ''
          isExportDefault = true;
        }
        if (path.scope.hasBinding(leftProperty.name)) {
          path.scope.bindings[leftProperty.name].scope.rename(leftProperty.name);
        }
        leftIdentifier = leftProperty;
      }
      if (t.isMemberExpression(right)) {
        // find the nested memberExpression
        const memberExpression = findCallExpressionWrapper(right);
        if (memberExpression && t.isIdentifier(memberExpression.object.callee, { name: 'require' })) {
          // exports.a = require('a').b.c.d => import _uid = from 'a'; export const a = _uid.b.c.d;
          const uid = path.scope.generateUidIdentifier("uid");
          const importStatement = t.importDeclaration([t.importDefaultSpecifier(uid)], memberExpression.object.arguments[0] as t.StringLiteral);
          const root = path.findParent(t.isProgram);
          root.node.body.unshift(importStatement);
          // replace the callExpression to the uid
          memberExpression.object = uid;
          if (isExportDefault) {
            // exports.default = require('a').b.c.d; 
            // => import uid from 'a'
            // const _default = uid.b.c.d
            // export default _default;
            const defaultUid = path.scope.generateUidIdentifier('default');
            const variableDeclaration = t.variableDeclaration('const', [t.variableDeclarator(defaultUid, right)]);
            const exportDeclaration = t.exportDefaultDeclaration(defaultUid);
            path.parentPath.parentPath.replaceWithMultiple([
              variableDeclaration,
              exportDeclaration
            ]);
          } else {
            // exports.a = require('a').b.c.d => import _uid = from 'a'; export const a = _uid.b.c.d;
            const exportStatement = t.exportNamedDeclaration(t.variableDeclaration('const', [t.variableDeclarator(leftIdentifier, right)]));
            path.parentPath.parentPath.replaceWith(exportStatement);
          }
          // skip callExpression
          const assignmentExpression = path.findParent(p => t.isAssignmentExpression(p));
          assignmentExpression?.skip();
        } else {
          // exports.a = b.c => export const a = b.c;
          const exportStatement = t.exportNamedDeclaration(t.variableDeclaration('const', [t.variableDeclarator(leftIdentifier, right)]));
          path.parentPath.parentPath.replaceWith(exportStatement);
        }
      } else if (t.isCallExpression(right) && t.isIdentifier(right.callee, { name: 'require' })) {
        // exports.a = require('a'); => import _uid from 'a'; export const a = _uid;
        const uid = path.scope.generateUidIdentifier("uid");
        const importStatement = t.importDeclaration([t.importDefaultSpecifier(uid)], right.arguments[0] as t.StringLiteral);
        const root = path.findParent(t.isProgram);
        root.node.body.unshift(importStatement);
        if (isExportDefault) {
          // exports.default = require('a'); => import _uid from 'a'; export default _uid;
          const exportDeclaration = t.exportDefaultDeclaration(uid);
          path.parentPath.parentPath.replaceWith(exportDeclaration);
        } else {
          // exports.a = require('a'); => import _uid from 'a'; export const a = _uid;
          const exportStatement = t.exportNamedDeclaration(t.variableDeclaration('const', [t.variableDeclarator(leftIdentifier, uid)]));
          path.parentPath.parentPath.replaceWith(exportStatement);
        }
        // skip callExpression
        const assignmentExpression = path.findParent(p => t.isAssignmentExpression(p));
        assignmentExpression?.skip();
      } else {
        // exports.default = a; => export default a;
        if (isExportDefault) {
          const declaration = t.exportDefaultDeclaration(right);
          path.parentPath.parentPath.replaceWith(declaration);
        } else {
          // exports.a = a; => export const a = a;
          const declaration = t.exportNamedDeclaration(t.variableDeclaration('const', [t.variableDeclarator(leftIdentifier, right)]));
          path.parentPath.parentPath.replaceWith(declaration);
        }
      }
    }


    // module.exports = xxx; => export default xxx
    if (
      t.isIdentifier(path.node.object, { name: 'module' }) && 
      t.isIdentifier(path.node.property, { name: 'exports' }) && 
      t.isAssignmentExpression(path.parent)
    ) {
      const right = path.parent.right;
      if (t.isMemberExpression(right)) {
        // module.exports = require('a').a; => import uid0 from 'a'; const uid1 = uid0.a; export default uid;
        // find the nested memberExpression
        const memberExpression = findCallExpressionWrapper(right);
        if (memberExpression && t.isIdentifier(memberExpression.object.callee, { name: 'require' })) {
          // module.exports = require('a').b.c.d => import uid from 'a'; const a = _uid.b.c.d; export default a;
          const uid = path.scope.generateUidIdentifier("uid");
          const importStatement = t.importDeclaration([t.importDefaultSpecifier(uid)], memberExpression.object.arguments[0] as t.StringLiteral);
          const root = path.findParent(t.isProgram);
          root.node.body.unshift(importStatement);
          // replace the callExpression to the uid
          memberExpression.object = uid;
          // generate const state
          const variableName = path.scope.generateUidIdentifier("uid");
          const variableStatement = t.variableDeclaration('const', [t.variableDeclarator(variableName, right)]);
          const exportStatement = t.exportDefaultDeclaration(variableName);
          path.parentPath.parentPath.replaceWithMultiple([variableStatement, exportStatement]);
          // skip callExpression
          const assignmentExpression = path.findParent(p => t.isAssignmentExpression(p));
          assignmentExpression?.skip();
        } else {
          // module.exports = b.c => const uid = b.c; export default uid;
          const variableName = path.scope.generateUidIdentifier("uid");
          const variableStatement = t.variableDeclaration('const', [t.variableDeclarator(variableName, right)]);
          const exportStatement = t.exportDefaultDeclaration(variableName);
          path.parentPath.parentPath.replaceWithMultiple([variableStatement, exportStatement]);
        }
      } else if (t.isCallExpression(right) && t.isIdentifier(right.callee, { name: 'require' })) {
        // module.exports = require('a') => export { default } from 'a';
        const exportStatement = t.exportNamedDeclaration(
          null, 
          [t.exportSpecifier(t.identifier('default'), t.identifier('default'))],
          right.arguments[0] as t.StringLiteral
        );
        path.parentPath.parentPath.replaceWith(exportStatement);
        // skip callExpression
        const assignmentExpression = path.findParent(p => t.isAssignmentExpression(p));
        assignmentExpression?.skip();
      } else {
        // module.exports = xxx;
        const declaration = t.exportDefaultDeclaration(path.parent.right);
        // 要注意替换的位置
        path.parentPath.parentPath.replaceWith(declaration);
      }
    }
    // module.exports.xxx = xxx; => export const xxx
    if (
      t.isIdentifier(path.node.object, { name: 'module' }) && 
      t.isIdentifier(path.node.property, { name: 'exports' }) &&
      t.isMemberExpression(path.parent)
    ) {
      const leftProperty = path.parent.property;
      const right = path.parentPath.parent.right;
      let leftIdentifier;
      let isExportDefault = false;
      if (t.isStringLiteral(leftProperty)) {
        // module.exports['xxx'] = xxx;
        if (leftProperty.value === 'default') {
          // module.exports['default'] = ''
          isExportDefault = true;
        }
        if (path.scope.hasBinding(leftProperty.value)) {
          path.scope.bindings[leftProperty.value].scope.rename(leftProperty.value);
        }
        leftIdentifier = t.identifier(leftProperty.value);
      } else {
        // module.exports.xxx = xxx;
        if (leftProperty.name === 'default') {
          // module.exports.default = ''
          isExportDefault = true;
        }
        if (path.scope.hasBinding(leftProperty.name)) {
          path.scope.bindings[leftProperty.name].scope.rename(leftProperty.name);
        }
        leftIdentifier = leftProperty;
      }
      if (t.isMemberExpression(right)) {
        // find the nested memberExpression
        const memberExpression = findCallExpressionWrapper(right);
        if (memberExpression && t.isIdentifier(memberExpression.object.callee, { name: 'require' })) {
          // module.exports.a = require('a').b.c.d => import _uid from 'a'; export const a = _uid.b.c.d;
          const uid = path.scope.generateUidIdentifier("uid");
          const importStatement = t.importDeclaration([t.importDefaultSpecifier(uid)], memberExpression.object.arguments[0] as t.StringLiteral);
          const root = path.findParent(t.isProgram);
          root.node.body.unshift(importStatement);
          // replace the callExpression to the uid
          memberExpression.object = uid;
          if (isExportDefault) {
            const defaultUid = path.scope.generateUidIdentifier('default');
            const variableDeclaration = t.variableDeclaration('const', [t.variableDeclarator(defaultUid, right)]);
            const exportDeclaration = t.exportDefaultDeclaration(defaultUid);
            path.parentPath.parentPath.parentPath.replaceWithMultiple([
              variableDeclaration,
              exportDeclaration
            ]);
          } else {
            const exportStatement = t.exportNamedDeclaration(t.variableDeclaration('const', [t.variableDeclarator(leftIdentifier, right)]));
            path.parentPath.parentPath.parentPath.replaceWith(exportStatement);
          }
          // skip callExpression
          const assignmentExpression = path.findParent(p => t.isAssignmentExpression(p));
          assignmentExpression?.skip();
        } else {
          if (isExportDefault) {
            // module.exports.default = a.b.c => cosnt _default = a.b.c; export default _default;
            const defaultUid = path.scope.generateUidIdentifier('default');
            const variableDeclaration = t.variableDeclaration('const', [t.variableDeclarator(defaultUid, right)]);
            const exportDeclaration = t.exportDefaultDeclaration(defaultUid);
            path.parentPath.parentPath.parentPath.replaceWithMultiple([
              variableDeclaration, exportDeclaration
            ]);
          } else {
            // module.exports.a = b.c => export const a = b.c;
            const declaration = t.exportNamedDeclaration(t.variableDeclaration('const', [t.variableDeclarator(leftIdentifier, right)]));
            path.parentPath.parentPath.parentPath.replaceWith(declaration);
          }
        }
      } else if (t.isCallExpression(right) && t.isIdentifier(right.callee, { name: 'require' })) {
        // exports.a = require('a'); => import _uid from 'a'; export const a = _uid;
        const uid = path.scope.generateUidIdentifier("uid");
        const importStatement = t.importDeclaration([t.importDefaultSpecifier(uid)], right.arguments[0] as t.StringLiteral);
        const root = path.findParent(t.isProgram);
        root.node.body.unshift(importStatement);
        if (isExportDefault) {
          // module.exports.default = require('a') => import a from 'a'; export default a;
          const exportDeclaration = t.exportDefaultDeclaration(uid);
          path.parentPath.parentPath.parentPath.replaceWith(exportDeclaration);
        } else {
          const exportStatement = t.exportNamedDeclaration(t.variableDeclaration('const', [t.variableDeclarator(leftIdentifier, uid)]));
          path.parentPath.parentPath.parentPath.replaceWith(exportStatement);
        }
        // skip callExpression
        const assignmentExpression = path.findParent(p => t.isAssignmentExpression(p));
        assignmentExpression?.skip();
      } else {
        // module.exports.a = a; => export const a = a;
        let declaration;
        if (isExportDefault) {
          declaration = t.exportDefaultDeclaration(right);
        } else {
          declaration = t.exportNamedDeclaration(t.variableDeclaration('const', [t.variableDeclarator(leftIdentifier, right)]));
        }
        path.parentPath.parentPath.parentPath.replaceWith(declaration);
      }
    }
  }
});

const output = generate(astA);

fs.writeFileSync(path.resolve(__dirname, './output.js'), output.code);

function findCallExpressionWrapper(node) {
  // find out the callExpression node whose parent is memberExpression
  if (t.isMemberExpression(node)) {
    if (t.isCallExpression(node.object)) {
      return node;
    }
    return findCallExpressionWrapper(node.object);
  }
  return null;
}
