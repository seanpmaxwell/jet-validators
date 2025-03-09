import { isNumber, isString } from '../src';
import { transform, parseObject, testObject, TParser } from '../utils/src';
import { TTester } from '../utils/src';
// import { isBoolean } from '../../jet-validators';

console.log(isString('horse'))
console.log(transform(Number, isNumber)('5'))
// console.log(isBoolean(false))

interface IUser {
  id: number;
  name: string;
}

const parseUser: TParser<IUser> = parseObject({
  id: isNumber,
  name: isString,
});

const testUser: TTester<IUser> = testObject({
  id: isNumber,
  name: isString,
});

const user: IUser = parseUser('adsf');
