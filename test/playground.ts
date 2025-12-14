import { isNumber, isOptionalString, isString } from '../src';

import {
  transform,
  parseObject,
  testObject,
  testOptionalObject,
  parseOptionalObject,
  testNullishObject,
  type TParseOnError,
  type IParseObjectError,
  parseObjectArray,
  type TSchema,
  nonNullable,
} from '../src/utils';

import { isString as isStringRelativeImport } from '../';
import { parseBoolean as parseBooleanRelativeImport } from '../';


/******************************************************************************
                                Run
******************************************************************************/

// console.log(isString('horse'))
// console.log(transform(Number, isNumber)('5'))
// console.log(isBoolean(false))


// **** Basic parseObject test **** //

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


// **** Test multi-layered schema and generic on child parse function **** //

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


// **** Test making nest function external **** //

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


// **** Debug Parse Object Array **** //

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


// **** Debug Type Error Wrap Multiple Layers **** //

// interface IUser {
//   id: number;
//   name: string;
// }

// function parseReq<U extends TSchema>(schema: U) {
//   return parseObject(schema, errors => {
//     throw new Error(JSON.stringify(errors));
//   });
// }

// function testUser(arg: unknown, errCb?: TParseOnError): arg is IUser {
//   return !!parseUser(arg, errCb);
// }

// const parseUser = parseObject<IUser>({
//   id: isNumber,
//   name: isString,
// });

// const Validators = {
//   getUser1: parseReq({ user: testUser }),
// } as const;


// const user: { user: IUser } = Validators.getUser1('asdf');


// **** Test Wrapping **** //

interface IUser {
  id: number;
  name: string;
  address: {
    city: string;
    zip: number;
  }
}

// Wrap without generic
const customParse = (schema: TSchema) => {
  return parseObject(schema);
};

// Wrap with generic
const customParse2 = <T>(schema: TSchema<T>) => {
  return parseObject<T>(schema);
};

const parseUser = customParse2<IUser>({
  id: isNumber,
  name: isString,
  address: {
    city: isString,
    zip: isNumber,
    // foo: isString, // Causes type error
  },
});

const parseUser1 = customParse2<IUser>({
  id: isNumber,
  name: isString,
  address: testObject({
    city: isString,
    zip: isNumber,
    foo: isString, // Does not cause type error cause of typescript limitations
  }),
});

interface IUser2 {
  id: number;
  name: string;
  address?: {
    city: string;
    zip: number;
  }
}

const parseUser2 = customParse2<IUser2>({
  id: isNumber,
  name: isString,
  address: testOptionalObject({
    city: isString,
    zip: isNumber,
    foo: isString, // Does not cause type error cause of typescript limitations
  }),
});

const parseUser3 = customParse2<IUser2>({
  id: isNumber,
  name: isString,
  address: testOptionalObject<IUser2['address']>({
    city: isString,
    zip: isNumber,
    // foo: isString, // Causes type error
  }),
});

// pick up here, nonNullable breaks it
const parseUser4 = customParse2<IUser2>({
  id: isNumber,
  name: isString,
  address: nonNullable(testOptionalObject<IUser2['address']>({
    city: isString,
    zip: isNumber,
    // foo: isString, // Causes type error
  })),
});

parseUser4({
  id: 1,
  name: 'john',
  address: {
    city: 'b',
    zip: '123',
  },
}, errors => console.log(JSON.stringify(errors, null, 2)));

