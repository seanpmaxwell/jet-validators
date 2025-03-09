import { isNumber, isString } from '../src';
import { transform, parseObjectPlus, TParser } from '../utils/dist';
// import { isBoolean } from '../../jet-validators';

console.log(isString('horse'))
console.log(transform(Number, isNumber)('5'))
// console.log(isBoolean(false))

interface IUser {
  id: number;
  name: string;
}

const parseUser: TParser<IUser> = parseObjectPlus({
  id: isNumber,
  name: isString,
});

const user: IUser = parseUser('adsf');
