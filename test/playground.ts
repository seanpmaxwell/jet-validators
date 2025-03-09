import { isNumber, isOptionalString, isString, isBoolean, isObject } from '../src';
import { transform, parseObject, testObject } from '../utils/src';
// import { isBoolean } from '../../jet-validators';

console.log(isString('horse'))
console.log(transform(Number, isNumber)('5'))
// console.log(isBoolean(false))

interface IUser {
  id: number;
  name: string;
  address?: string;
}

const parseUser = parseObject({
  id: isNumber,
  name: isString,
});

const user: IUser = parseUser('adsf');

const parseUserAlt = parseObject<IUser>({
  id: isNumber,
  name: isString,
  address: isOptionalString,
});

const testUser = testObject({
  id: isNumber,
  name: isString,
});


interface IPost {
  id: number;
  text: {
    state: boolean;
    content: string;
  };
}

const parsePost = parseObject<IPost>({
  id: isNumber,
  // text: isObject,
  text: {
    state: isBoolean,
    content: isString,
  }
})
