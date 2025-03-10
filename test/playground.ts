import { isNumber, isOptionalString, isString } from '../src';

import {
  transform,
  parseObject,
  testObject,
  testOptionalObject,
  parseOptionalObject,
  testNullishObject,
  TParseOnError,
  IParseObjectError,
  parseObjectArray,
  TSchema,
} from '../utils/src';


/******************************************************************************
                                Run
******************************************************************************/

// console.log(isString('horse'))
// console.log(transform(Number, isNumber)('5'))
// // console.log(isBoolean(false))

// interface IUser {
//   id: number;
//   name: string;
//   address?: string;
// }

// const parseUser = parseObject({
//   id: isNumber,
//   name: isString,
// });

// const user: IUser = parseUser('adsf');

// const parseUserAlt = parseObject<IUser>({
//   id: isNumber,
//   name: isString,
//   address: isOptionalString,
// });

// const testUser = testObject({
//   id: isNumber,
//   name: isString,
// });


// interface IPost {
//   id: number;
//   message: string;
//   nested: {
//     id: number;
//     message: string;
//   };
// }

// const parsePost = parseObject<IPost>({
//   id: isNumber,
//   message: isString,
//   nested: {
//     id: isNumber,
//     message: isString,
//   },
// });

// const testPost = testObject<IPost>({
//   id: isNumber,
//   message: isString,
//   nested: {
//     id: isNumber,
//     message: isString,
//   },
// });

// interface IPostAlt {
//   id: number;
//   message: string;
//   nested?: {
//     id: number;
//     message: string;
//   };
// }

// const parsePostAlt = parseObject<IPostAlt>({
//   id: isNumber,
//   message: isString,
//   nested: testOptionalObject<IPostAlt['nested']>({
//     id: isNumber,
//     message: isString,
//   }),
// });

// const parseOptUser = parseOptionalObject({
//   id: isNumber,
//   name: isString,
// }, errors => console.log(errors));

// const userArrBad = parseOptUser([
//   { id: 1, name: 'a' },
//   { idd: 2, name: 'b' },
// ]);

// console.log(userArrBad)

// let errArr: IParseObjectError[] = [];

// const parseUser = parseObject({
//   id: isNumber,
//   name: isString,
//   address: (arg: unknown, errCb?: TParseOnError) => testAddr(arg, errCb),
//   address2: testAddr2(),
// }, errors => { errArr = errors; });

// const testAddr = testNullishObject({
//   city: isString,
//   zip: isNumber,
// });

// function testAddr2() {
//   return testObject({
//     city: isString,
//     zip: isNumber,
//   });
// }

// parseUser({
//   id: 1,
//   name: 'sean',
//   address: {
//     city: 'asdf',
//     zip: '1234',
//   },
// });

// const c = errArr[0].children?.[0]

// console.log(JSON.stringify(errArr, null, 2));


// const parseUserArr = parseObjectArray({
//   id: isNumber,
//   name: isString,
// }, errors => {
//   console.log(errors);
// });

// parseUserArr([
//   { id: 1, name: '1' },
//   { id: 2, name: '2' },
//   { id: '3', name: '3' },
// ]);

interface IUser {
  id: number;
  name: string;
}

function parseReq<U extends TSchema>(schema: U) {
  return parseObject(schema, errors => {
    throw new Error(JSON.stringify(errors));
  });
}

function testUser(arg: unknown, errCb?: TParseOnError): arg is IUser {
  return !!parseUser(arg, errCb);
}

const parseUser = parseObject<IUser>({
  id: isNumber,
  name: isString,
});

const Validators = {
  getUser1: parseReq({ user: testUser }),
} as const;


const user: { user: IUser } = Validators.getUser1('asdf');

