import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import type { NodePath } from '@babel/traverse';
import generate from "@babel/generator";
import type { GeneratorResult } from "@babel/generator";
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
 * exports.default = require('a')
 * exports.default = require('a').default
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

function findCallExpressionWrapper(node: t.MemberExpression): t.MemberExpression | null {
  // find out the callExpression node whose parent is memberExpression
  if (t.isMemberExpression(node)) {
    if (t.isCallExpression(node.object)) {
      return node as (t.MemberExpression & { object: t.CallExpression });
    }
    if (t.isMemberExpression(node.object)) {
      return findCallExpressionWrapper(node.object);
    }
  }
  return null;
}

class TransformError {
  public message: string;
  public filename: string;
  public column: number;
  public line: number;
  constructor(msg: string, options?: { filename?: string; column?: number; line?: number; }) {
    this.message = msg;
    this.filename = options.filename;
    this.column = options.column;
    this.line = options.line;
  }
}

type TransformOptions = {
  silent: boolean;
}

function transform(code: string, options?: TransformOptions): (GeneratorResult & { errors: TransformError[] }) {
  const { silent } = options || {};
  let root: NodePath<t.Program>;
  const errors = [];
  if (!code.trim()) return {
    code: '',
    errors: [],
    map: null
  };
  const ast = parse(code);
  traverse(ast, {
    Program(path) {
      root = path;
    },
    CallExpression(path) {
      if (t.isIdentifier(path.node.callee, { name: 'require' })) {
        const assignmentExpression = path.findParent(p => t.isAssignmentExpression(p));
        debugger
        if (assignmentExpression?.shouldSkip) {
          // skip when required then exports immediately 
          // it was handled in memberExpression
          return;
        }
        if (!t.isProgram(path.getStatementParent().parent)) {
          // not the top level require
          errors.push(new TransformError('There is a require statements inside a block.Please move it to the top level', {
            column: path.node.loc.end.column,
            line: path.node.loc.end.line,
            filename: (path.node.loc as any).filename
          }));
          return;
        }
        if (!t.isStringLiteral(path.node.arguments[0])) {
          errors.push(new TransformError("require's arguments should be a string", {
            column: path.node.loc.end.column,
            line: path.node.loc.end.line,
            filename: (path.node.loc as any).filename
          }));
          return;
        }
        if (t.isMemberExpression(path.parent)) {
          if (t.isVariableDeclarator(path.parentPath.parent)) { 
            if (t.isIdentifier(path.parent.property, { name: 'default' }) || t.isStringLiteral(path.parent.property, { value: 'default' })) {
              // const a = require('a').default
              // const a = require('a')['default']
              // const { a, b } = require('a').default
              // const { a, b } = require('a')['default']
              if (t.isObjectPattern(path.parentPath.parent.id)) {
                // const { a, b } = require('a').default;
                // => import _a from 'a'; const { a, b } = _a;
                const uid = path.scope.generateUidIdentifier(path.node.arguments[0].value);
                const importStatement = t.importDeclaration([t.importDefaultSpecifier(uid)], path.node.arguments[0]);
                root.node.body.unshift(importStatement);
                path.parentPath.replaceWith(uid);
              } else if (t.isIdentifier(path.parentPath.parent.id)) {
                // const a = require('a').default;
                // => import a from 'a';
                const uid = path.parentPath.parent.id;
                const importStatement = t.importDeclaration([t.importDefaultSpecifier(uid)], path.node.arguments[0]);
                root.node.body.unshift(importStatement);
                path.parentPath.parentPath.parentPath.remove();
              } else {
                // error
                errors.push(new TransformError("unhandled expression", {
                  column: path.node.loc.end.column,
                  line: path.node.loc.end.line,
                  filename: (path.node.loc as any).filename
                }));
                return;
              }
            } else {
              // const { a, b } = require('a').a
              // const { a, b } = require('a')['a']
              // const a = require('a').a
              // const a = require('a')['a']
              if (t.isObjectPattern(path.parentPath.parent.id)) {
                // const { a, b } = require('a').a;
                // const { a, b } = require('a')['a'];
                // => import * as _a from 'a'; const { a, b } = _a.a;
                const uid = path.scope.generateUidIdentifier(path.node.arguments[0].value);
                const importStatement = t.importDeclaration([t.importNamespaceSpecifier(uid)], path.node.arguments[0]);
                root.node.body.unshift(importStatement);
                path.parent.object = uid;
                const variableStatement = t.variableDeclaration('const', [path.parentPath.parent]);
                path.parentPath.parentPath.parentPath.replaceWith(variableStatement);
              } else if (t.isIdentifier(path.parentPath.parent.id)) {
                // const a = require('a').b;
                // => import { b as a } from 'a';
                // path.parent.property must be a StringLiteral or Identifier
                const importStatement = t.importDeclaration([t.importSpecifier(path.parentPath.parent.id, ((path.parent as t.MemberExpression).property as t.Identifier))], path.node.arguments[0]);
                root.node.body.unshift(importStatement);
                path.parentPath.parentPath.parentPath.remove();
              } else {
                // error
                errors.push(new TransformError("unhandled expression", {
                  column: path.node.loc.end.column,
                  line: path.node.loc.end.line,
                  filename: (path.node.loc as any).filename
                }));
                return;
              }
            }
          } else if (t.isMemberExpression(path.parentPath.parent)) {
            if (t.isIdentifier(path.parent.property, { name: 'default' }) || t.isStringLiteral(path.parent.property, { value: 'default' })) {
              // const a = require('a').default.b; 
              // => import _a from 'a'; const a = _a.b; 
              // const { a, b } = require('a').default.b.c;
              const uid = path.scope.generateUidIdentifier(path.node.arguments[0].value);
              const importStatement = t.importDeclaration([t.importDefaultSpecifier(uid)], path.node.arguments[0]);
              root.node.body.unshift(importStatement);
              // replace that memberExpression's object with uid;
              path.parentPath.parentPath.replaceWith(t.memberExpression(uid, path.parentPath.parent.property));
            } else {
              // const a = require('a').a.b.c;
              // => import * as _a from 'a'; const a = _a.b.c; 
              // const { a, b } = require('a').a.b.c; 
              const uid = path.scope.generateUidIdentifier(path.node.arguments[0].value);
              const importStatement = t.importDeclaration([t.importNamespaceSpecifier(uid)], path.node.arguments[0]);
              root.node.body.unshift(importStatement);
              // replace that memberExpression's object with uid;
              path.parentPath.replaceWith(t.memberExpression(uid, path.parent.property));
            }
          } else {
            // unhandled circumstance
            errors.push(new TransformError("unhandled expression", {
              column: path.node.loc.end.column,
              line: path.node.loc.end.line,
              filename: (path.node.loc as any).filename
            }));
            return;
          }
        } else if (t.isVariableDeclarator(path.parent)) {
          // const { a, b: c, d } = require('b');
          // const b = require('b');
          if (t.isObjectPattern(path.parent.id)) {
            const isPureNamespaceImport = path.parent.id.properties.every(property => {
              return t.isObjectProperty(property) && t.isIdentifier(property.key) && t.isIdentifier(property.value);
            });
            if (isPureNamespaceImport) {
              // const { a, b: c, d } = require('b'); => import { a, b as c, d } from 'b';
              const specifiers = path.parent.id.properties.map((property) => {
                return t.importSpecifier((property as t.ObjectProperty).value as t.Identifier, (property as t.ObjectProperty).key as t.Identifier);
              });
              root.node.body.push(t.importDeclaration(specifiers, path.node.arguments[0]));
              path.parentPath.parentPath.remove();
            } else {
              // const { a, b: { c, d } } = require('b'); => import * as _b from 'b'; const { a, b: { c, d } } = _b;
              const uid = path.scope.generateUidIdentifier(path.node.arguments[0].value);
              const importStatement = t.importDeclaration([t.importNamespaceSpecifier(uid)], path.node.arguments[0]);
              root.node.body.unshift(importStatement);
              path.replaceWith(uid);
            }
          } else if (t.isIdentifier(path.parent.id)) {
            // const a = require('a');
            const importStatement = t.importDeclaration([t.importNamespaceSpecifier(path.parent.id)], path.node.arguments[0]);
            root.node.body.unshift(importStatement);
            path.parentPath.parentPath.remove();
          } else {
            // const a.v.b = require('a');
            // const [a,b] = require('a');
            errors.push(new TransformError("illegal left side of require", {
              column: path.node.loc.end.column,
              line: path.node.loc.end.line,
              filename: (path.node.loc as any).filename
            }));
            return;
          }
        } else if (t.isExpressionStatement(path.parent)) {
          // require('index.less')
          path.parentPath.replaceWith(t.importDeclaration([], path.node.arguments[0]));
        } else {
          // error
          errors.push(new TransformError("require method couldn't be wrote inside an expression", {
            column: path.node.loc.end.column,
            line: path.node.loc.end.line,
            filename: (path.node.loc as any).filename
          }));
          return;
        }
      }
    },
    MemberExpression(path) {
      if (
        (
          t.isIdentifier(path.node.object, { name: 'exports' }) ||
          (
            t.isIdentifier(path.node.object, { name: 'module' }) && 
            t.isIdentifier(path.node.property, { name: 'exports' })
          )
        ) &&
        !t.isProgram(path.getStatementParent().parent)
      ) {
        // dynamic exports of not the top level scope exports
        errors.push(new TransformError("exports/module.exports should be declared at the top level", {
          column: path.node.loc.end.column,
          line: path.node.loc.end.line,
          filename: (path.node.loc as any).filename
        }));
        return;
      }
      // exports
      if (t.isIdentifier(path.node.object, { name: 'exports' }) && t.isAssignmentExpression(path.parent)) {
        const leftProperty = path.node.property;
        const right = path.parent.right;
        let leftIdentifier;
        let isExportDefault = false;
        let isPureImportDefault = false;
        if (t.isStringLiteral(leftProperty)) {
          // exports['xxx'] = xxx;
          if (leftProperty.value === 'default') {
            // exports['default'] = xxx
            isExportDefault = true;
          }
          if (path.scope.hasBinding(leftProperty.value)) {
            path.scope.bindings[leftProperty.value].scope.rename(leftProperty.value);
          }
          leftIdentifier = t.identifier(leftProperty.value);
        } else if (t.isIdentifier(leftProperty)) {
          // exports.xxx = xxx;
          if (leftProperty.name === 'default') {
            // exports['default'] = xxx
            isExportDefault = true;
          }
          if (path.scope.hasBinding(leftProperty.name)) {
            path.scope.bindings[leftProperty.name].scope.rename(leftProperty.name);
          }
          leftIdentifier = leftProperty;
        } else {
          // error
          errors.push(new TransformError("exports key should not be an expression like 'exports[a--]'", {
            column: path.node.loc.end.column,
            line: path.node.loc.end.line,
            filename: (path.node.loc as any).filename
          }));
          return;
        }
        if (t.isMemberExpression(right)) {
          // find the nested memberExpression
          const memberExpression = findCallExpressionWrapper(right);
          if (memberExpression && t.isCallExpression(memberExpression.object) && t.isIdentifier(memberExpression.object.callee, { name: 'require' })) {
            // exports.a = require('a').b.c.d => import * as _a from 'a'; export const a = _a.b.c.d;
            if (!t.isStringLiteral(memberExpression.object.arguments[0])) {
              errors.push(new TransformError("require's arguments should be a string", {
                column: path.node.loc.end.column,
                line: path.node.loc.end.line,
                filename: (path.node.loc as any).filename
              }));
              return;
            }
            let uid;
            if (t.isIdentifier(memberExpression.property, { name: 'default' }) || t.isStringLiteral(memberExpression.property, { value: 'default' })) {
              uid = path.scope.generateUidIdentifier(memberExpression.object.arguments[0].value);
              const importStatement = t.importDeclaration([t.importDefaultSpecifier(uid)], memberExpression.object.arguments[0]);
              root.node.body.unshift(importStatement);
              if (right === memberExpression) {
                // the right side are
                // require('a').default 
                // require('a')['default']
                // => import _a from 'a'
                path.parent.right = uid;
                isPureImportDefault = true;
              } else {
                // right side are
                // require('a').default.a
                // require('a').['default'].a
                function replaceRequireMemberExpressionWith(node, newNode) {
                  if (
                    t.isMemberExpression(node) && 
                    t.isMemberExpression(node.object) && 
                    t.isCallExpression(node.object.object) &&
                    t.isIdentifier(node.object.object.callee, { name: 'require' })
                  ) {
                    node.object = newNode;
                  } else if (t.isMemberExpression(node) && t.isMemberExpression(node.object)) {
                    replaceRequireMemberExpressionWith(node.object, newNode);
                  }
                }
                replaceRequireMemberExpressionWith(path.parent.right, uid);
              }
            } else {
              // require('a').a 
              // require('a')['a']
              // require('a')['a'].b
              uid = path.scope.generateUidIdentifier(memberExpression.object.arguments[0].value);
              const importStatement = t.importDeclaration([t.importNamespaceSpecifier(uid)], memberExpression.object.arguments[0]);
              root.node.body.unshift(importStatement);
              // replace the callExpression to the uid
              memberExpression.object = uid;
            }
            if (isExportDefault) {
              // exports.default = require('a').b.c.d; => import _a from 'a'; const _default = _a.b.c.d; export default _uid;
              const statement = [];
              if (isPureImportDefault) {
                const exportDeclaration = t.exportDefaultDeclaration(uid);
                statement.push(exportDeclaration);
              } else {
                // exports.default = require('a').default;
                // => import _a from 'a'; export default a;
                const defaultUid = path.scope.generateUidIdentifier('default');
                const variableDeclaration = t.variableDeclaration('const', [t.variableDeclarator(defaultUid, path.parent.right)]);
                const exportDeclaration = t.exportDefaultDeclaration(defaultUid);
                statement.push(variableDeclaration, exportDeclaration);
              }
              path.parentPath.parentPath.replaceWithMultiple(statement);
            } else {
              // exports.a = require('a').b.c.d => import * as _a from 'a'; export const a = _a.b.c.d;
              const exportStatement = t.exportNamedDeclaration(t.variableDeclaration('const', [t.variableDeclarator(leftIdentifier, path.parent.right)]));
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
          // exports.a = require('a'); => import * as _a from 'a'; export const a = _a;
          if (!t.isStringLiteral(right.arguments[0])) {
            errors.push(new TransformError("require's arguments should be a string", {
              column: path.node.loc.end.column,
              line: path.node.loc.end.line,
              filename: (path.node.loc as any).filename
            }));
            return;
          }
          const uid = path.scope.generateUidIdentifier(right.arguments[0].value);
          const importStatement = t.importDeclaration([t.importNamespaceSpecifier(uid)], right.arguments[0]);
          root.node.body.unshift(importStatement);
          if (isExportDefault) {
            // exports.default = require('a'); => import * as _a from 'a'; export default _a;
            const exportDeclaration = t.exportDefaultDeclaration(uid);
            path.parentPath.parentPath.replaceWith(exportDeclaration);
          } else {
            // exports.a = require('a'); => import * as _a from 'a'; export const a = _a;
            const exportStatement = t.exportNamedDeclaration(t.variableDeclaration('const', [t.variableDeclarator(leftIdentifier, uid)]));
            path.parentPath.parentPath.replaceWith(exportStatement);
          }
          // skip callExpression
          const assignmentExpression = path.findParent(p => t.isAssignmentExpression(p));
          assignmentExpression?.skip();
        } else {
          if (isExportDefault) {
            // exports.default = a; => export default a;
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
        if (!t.isObjectExpression(path.parent.right)) {
          // module.exports = a; module.exports = function () {}
          errors.push(new TransformError("module.exports right side should be an object. If you want to export an function or variable, using 'module.exports.default = expression' instead", {
            column: path.node.loc.end.column,
            line: path.node.loc.end.line,
            filename: (path.node.loc as any).filename
          }));
          return;
        } else {
          const isPureExport = path.parent.right.properties.every(property => {
            return t.isObjectProperty(property) && t.isIdentifier(property.key) && t.isIdentifier(property.value) && property.key.name === property.value.name;
          });
          if (isPureExport) {
            // module.exports = { a };  => export { a }
            // module.exports = {};  => export {}
            // const declaration = t.exportDefaultDeclaration(path.parent.right);
            const specifiers =  path.parent.right.properties.map(property => {
              return t.exportSpecifier((property as t.ObjectProperty).key as t.Identifier, (property as t.ObjectProperty).key as t.Identifier);
            });
            const declaration = t.exportNamedDeclaration(null, specifiers);
            path.parentPath.parentPath.replaceWith(declaration);
            return;
          }
        }
      }
      // module.exports.xxx = xxx; => export const xxx
      if (
        t.isIdentifier(path.node.object, { name: 'module' }) && 
        t.isIdentifier(path.node.property, { name: 'exports' }) &&
        t.isMemberExpression(path.parent) &&
        t.isAssignmentExpression(path.parentPath.parent)
      ) {
        const leftProperty = path.parent.property;
        const right = path.parentPath.parent.right;
        let leftIdentifier;
        let isExportDefault = false;
        let isPureImportDefault = false;
        if (t.isStringLiteral(leftProperty)) {
          // module.exports['xxx'] = xxx; => export const xxx = xxx;
          if (leftProperty.value === 'default') {
            // module.exports['default'] = xxx => export default xxx
            isExportDefault = true;
          }
          if (path.scope.hasBinding(leftProperty.value)) {
            path.scope.bindings[leftProperty.value].scope.rename(leftProperty.value);
          }
          leftIdentifier = t.identifier(leftProperty.value);
        } else if (t.isIdentifier(leftProperty)) {
          // module.exports.xxx = xxx; => export const xxx = xxx;
          if (leftProperty.name === 'default') {
            // module.exports.default = xxx; => export default xxx;
            isExportDefault = true;
          }
          if (path.scope.hasBinding(leftProperty.name)) {
            path.scope.bindings[leftProperty.name].scope.rename(leftProperty.name);
          }
          leftIdentifier = leftProperty;
        } else {
          // error
          errors.push(new TransformError("exports key should not be expression like 'exports[a--]'", {
            column: path.node.loc.end.column,
            line: path.node.loc.end.line,
            filename: (path.node.loc as any).filename
          }));
          return;
        }
        if (t.isMemberExpression(right)) {
          // find the nested memberExpression
          let memberExpression = findCallExpressionWrapper(right);
          if (memberExpression && t.isCallExpression(memberExpression.object) && t.isIdentifier(memberExpression.object.callee, { name: 'require' })) {
            // module.exports.a = require('a').b.c.d => import * as _a from 'a'; export const a = _a.b.c.d;
            if (!t.isStringLiteral(memberExpression.object.arguments[0])) {
              errors.push(new TransformError("require's arguments should be a string", {
                column: path.node.loc.end.column,
                line: path.node.loc.end.line,
                filename: (path.node.loc as any).filename
              }));
              return;
            }
            let uid;
            if (t.isIdentifier(memberExpression.property, { name: 'default' }) || t.isStringLiteral(memberExpression.property, { value: 'default' })) {
              uid = path.scope.generateUidIdentifier(memberExpression.object.arguments[0].value);
              const importStatement = t.importDeclaration([t.importDefaultSpecifier(uid)], memberExpression.object.arguments[0]);
              root.node.body.unshift(importStatement);
              if (right === memberExpression) {
                // the right side are
                // require('a').default 
                // require('a')['default']
                // => import _a from 'a'
                path.parentPath.parent.right = uid;
                isPureImportDefault = true;
              } else {
                // right side are
                // require('a').default.a
                // require('a').['default'].a
                // memberExpression = uid;
                function replaceRequireMemberExpressionWith(node, newNode) {
                  if (
                    t.isMemberExpression(node) && 
                    t.isMemberExpression(node.object) && 
                    t.isCallExpression(node.object.object) &&
                    t.isIdentifier(node.object.object.callee, { name: 'require' })
                  ) {
                    node.object = newNode;
                  } else if (t.isMemberExpression(node) && t.isMemberExpression(node.object)) {
                    replaceRequireMemberExpressionWith(node.object, newNode);
                  }
                }
                replaceRequireMemberExpressionWith(path.parentPath.parent.right, uid);
              }
            } else {
              // require('a').a 
              // require('a')['a']
              // require('a')['a'].b
              uid = path.scope.generateUidIdentifier(memberExpression.object.arguments[0].value);
              const importStatement = t.importDeclaration([t.importNamespaceSpecifier(uid)], memberExpression.object.arguments[0]);
              root.node.body.unshift(importStatement);
              // replace the callExpression to the uid
              memberExpression.object = uid;
            }
            if (isExportDefault) {
              // module.exports.default = require('a').b.c.d; => import * as _a from 'a'; const _default = _a.b.c.d; export default _uid;
              const statement = [];
              if (isPureImportDefault) {
                const exportDeclaration = t.exportDefaultDeclaration(uid);
                statement.push(exportDeclaration);
              } else {
                // module.exports.default = require('a').default;
                const defaultUid = path.scope.generateUidIdentifier('default');
                const variableDeclaration = t.variableDeclaration('const', [t.variableDeclarator(defaultUid, path.parentPath.parent.right)]);
                const exportDeclaration = t.exportDefaultDeclaration(defaultUid);
                statement.push(variableDeclaration, exportDeclaration);
              }
              path.parentPath.parentPath.parentPath.replaceWithMultiple(statement);
            } else {
              // module.exports.a = require('a').b.c.d => import * as _a from 'a'; export const a = _a.b.c.d;
              const exportStatement = t.exportNamedDeclaration(t.variableDeclaration('const', [t.variableDeclarator(leftIdentifier, path.parentPath.parent.right)]));
              path.parentPath.parentPath.parentPath.replaceWith(exportStatement);
            }
            // skip callExpression
            const assignmentExpression = path.findParent(p => t.isAssignmentExpression(p));
            assignmentExpression?.skip();
            // assignmentExpression.remove();
          } else {
            if (isExportDefault) {
              // module.exports.default = a.b.c; => cosnt _default = a.b.c; export default _default;
              const defaultUid = path.scope.generateUidIdentifier('default');
              const variableDeclaration = t.variableDeclaration('const', [t.variableDeclarator(defaultUid, path.parentPath.parent.right)]);
              const exportDeclaration = t.exportDefaultDeclaration(defaultUid);
              path.parentPath.parentPath.parentPath.replaceWithMultiple([
                variableDeclaration, exportDeclaration
              ]);
            } else {
              // module.exports.a = b.c; => export const a = b.c;
              const declaration = t.exportNamedDeclaration(t.variableDeclaration('const', [t.variableDeclarator(leftIdentifier, path.parentPath.parent.right)]));
              path.parentPath.parentPath.parentPath.replaceWith(declaration);
            }
          }
        } else if (t.isCallExpression(right) && t.isIdentifier(right.callee, { name: 'require' })) {
          // module.exports.a = require('a'); => import * as _a from 'a'; export const a = _a;
          if (!t.isStringLiteral(right.arguments[0])) {
            errors.push(new TransformError("require's arguments should be a string", {
              column: path.node.loc.end.column,
              line: path.node.loc.end.line,
              filename: (path.node.loc as any).filename
            }));
            return;
          }
          const uid = path.scope.generateUidIdentifier(right.arguments[0].value);
          const importStatement = t.importDeclaration([t.importNamespaceSpecifier(uid)], right.arguments[0]);
          root.node.body.unshift(importStatement);
          if (isExportDefault) {
            // module.exports.default = require('a') => import * as _a from 'a'; export default _a;
            const exportDeclaration = t.exportDefaultDeclaration(uid);
            path.parentPath.parentPath.parentPath.replaceWith(exportDeclaration);
          } else {
            // module.exports.a = require('a'); => import * as _a from 'a'; export const a = _a;
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
            // module.exports.default = a; => export default a;
            declaration = t.exportDefaultDeclaration(right);
          } else {
            // module.exports.a = a; => export const a = a;
            declaration = t.exportNamedDeclaration(t.variableDeclaration('const', [t.variableDeclarator(leftIdentifier, right)]));
          }
          path.parentPath.parentPath.parentPath.replaceWith(declaration);
        }
      }
    }
  });
  const res = generate(ast);
  if (errors.length && !silent) {
    console.error(`${errors[0].message} (${errors[0].filename}: ${errors[0].line}, ${errors[0].column})`);
  }
  return {
    ...res,
    errors
  };
}

const content = "exports['default'] = require('a').default.a";
fs.writeFileSync(path.resolve(__dirname, 'output.js'), transform(content).code)

export default transform;

