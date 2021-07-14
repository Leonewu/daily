export default class TransformError {
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