import { isNumber, isString } from '../dist';
import { transform } from '../dist/utils';
import { isBoolean } from '../../jet-validators';

console.log(isString('horse'))
console.log(transform(Number, isNumber)('5'))
console.log(isBoolean(false))