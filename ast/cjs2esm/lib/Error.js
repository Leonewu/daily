"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TransformError {
    constructor(msg, options) {
        this.message = msg;
        this.filename = options.filename;
        this.column = options.column;
        this.line = options.line;
    }
}
exports.default = TransformError;
