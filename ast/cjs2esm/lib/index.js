"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.babelTransform = void 0;
const tslib_1 = require("tslib");
const parser_1 = require("@babel/parser");
const traverse_1 = tslib_1.__importDefault(require("@babel/traverse"));
const generator_1 = tslib_1.__importDefault(require("@babel/generator"));
const visitor_1 = tslib_1.__importDefault(require("./visitor"));
const plugin_1 = tslib_1.__importDefault(require("./plugin"));
const babel = tslib_1.__importStar(require("@babel/core"));
function transform(code, options) {
    const { silent } = options || {};
    const errors = [];
    if (!code.trim())
        return {
            code: '',
            errors: [],
            map: null
        };
    const ast = parser_1.parse(code);
    const visitors = visitor_1.default(errors);
    traverse_1.default(ast, visitors);
    const res = generator_1.default(ast);
    if (errors.length && !silent) {
        console.error(`${errors[0].message} (${errors[0].filename}: ${errors[0].line}, ${errors[0].column})`);
    }
    return Object.assign(Object.assign({}, res), { errors });
}
// const content = "module.exports = { a, b }";
// fs.writeFileSync(path.resolve(__dirname, 'output.js'), transform(content).code)
function babelTransform(code) {
    // use as a babel plugin
    return babel.transform(code, { plugins: [plugin_1.default] });
}
exports.babelTransform = babelTransform;
exports.default = transform;
