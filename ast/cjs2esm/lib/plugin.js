"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const visitor_1 = tslib_1.__importDefault(require("./visitor"));
function transformPlugin() {
    const errors = [];
    const visitor = visitor_1.default(errors);
    return {
        visitor
    };
}
exports.default = transformPlugin;
