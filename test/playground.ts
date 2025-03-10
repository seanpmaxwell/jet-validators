import { isNumber, isOptionalString, isString } from '../src';

import {
  transform,
  parseObject,
  testObject,
  testOptionalObject,
} from '../utils/src';


/******************************************************************************
                                Run
******************************************************************************/

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
  message: string;
  nested: {
    id: number;
    message: string;
  };
}

const parsePost = parseObject<IPost>({
  id: isNumber,
  message: isString,
  nested: {
    id: isNumber,
    message: isString,
  },
});

const testPost = testObject<IPost>({
  id: isNumber,
  message: isString,
  nested: {
    id: isNumber,
    message: isString,
  },
});

interface IPostAlt {
  id: number;
  message: string;
  nested?: {
    id: number;
    message: string;
  };
}

const parsePostAlt = parseObject<IPostAlt>({
  id: isNumber,
  message: isString,
  nested: testOptionalObject<IPostAlt['nested']>({
    id: isNumber,
    message: isString,
  }),
});
