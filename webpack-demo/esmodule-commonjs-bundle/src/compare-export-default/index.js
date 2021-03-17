import * as esmWithoutDefault from './esm-without-default.js';
import esmWithDefault from './esm-with-default.js';

console.log('esmWithDefault 的行为：')
console.log(esmWithDefault.counter);
console.log(esmWithDefault.add());
console.log(esmWithDefault.counter);

console.log('esmWithoutDefault 的行为：')
console.log(esmWithoutDefault.counter);
console.log(esmWithoutDefault.add());
console.log(esmWithoutDefault.counter);