import { expect, test } from 'vitest';

import {
  isUndef,
  isBoolean,
  isNumber,
  isString,
  isOptionalValidDate,
  isUnsignedInteger,
  isOptionalString,
} from '../../src';

import {
  parseNullishObjectArray,
  parseObject,
  parseObjectArray,
  parseOptionalObject,
  testObject,
  transform,
  testOptionalObject,
  testObjectArray,
  strictParseObject,
  looseParseObject,
  looseTestObject,
  type Schema,
  type ParseError,
} from '../../src/utils';

/******************************************************************************
                                 Tests
******************************************************************************/

/**
 * Test "parseObject" function
 */
test('test "parseObject()" function', () => {
  interface IUser {
    id: number;
    name: string;
  }

  // Basic Test
  const parseUser = parseObject<IUser>({
    id: transform(Number, isNumber),
    name: isString,
  });
  const user: IUser = parseUser({
    id: '5',
    name: 'john',
    email: '--',
  });
  expect(user).toStrictEqual({ id: 5, name: 'john' });

  // ** Test passing a type to parseObject ** //
  const parseUserNew = parseObject<IUser>({
    id: isNumber,
    name: isString,
  });
  expect(parseUserNew({ id: '5', name: 'a' })).toBeFalsy();

  // Parse optional object
  const parseOptUser = parseOptionalObject({
    id: isNumber,
    name: isString,
  });
  const optUser = parseOptUser({
    id: 15,
    name: 'joe',
    email: '--',
  });
  const optUser2 = parseOptUser(false);
  expect(optUser).toStrictEqual({ id: 15, name: 'joe' });
  expect(optUser2).toStrictEqual(false);

  // ** Array Test ** //
  const userArr = [user, { id: 1, name: 'a' }, { id: 2, name: 'b' }],
    userArrBad = [user, { id: 1, name: 'a' }, { idd: 2, name: 'b' }];
  // Normal array test
  const parseUserArr = parseObjectArray({
    id: isNumber,
    name: isString,
  });
  const parsedUserArr = parseUserArr(userArr),
    parsedUserArrBad = parseUserArr(userArrBad),
    parsedUserArrBad2 = parseOptUser(userArrBad);
  expect(userArr).toStrictEqual(parsedUserArr);
  expect(parsedUserArrBad).toStrictEqual(false);
  expect(parsedUserArrBad2).toStrictEqual(false);
  // Nullish or array
  const parseNishUserArr = parseNullishObjectArray({
    id: isNumber,
    name: isString,
  });
  const parsedNishUserArr = parseNishUserArr(null);
  expect(parsedNishUserArr).toStrictEqual(null);
  const parsedNishUserArr2 = parseNishUserArr(userArr);
  expect(parsedNishUserArr2).toStrictEqual(userArr);

  // ** Nested Object Test (Good) ** //
  const parseUserWithAddr = parseObject({
    id: isNumber,
    name: isString,
    address: {
      city: isString,
      zip: isNumber,
    },
  });
  const userWithAddr = parseUserWithAddr({
    id: 5,
    name: 'john',
    address: {
      city: 'seattle',
      zip: 98111,
    },
  });
  // const blah: number = userWithAddr.address.city; // should cause type error
  expect(userWithAddr).toStrictEqual({
    id: 5,
    name: 'john',
    address: {
      city: 'seattle',
      zip: 98111,
    },
  });
  expect(userWithAddr.address.zip).toBe(98111);

  // ** Nested Object Test (Bad) ** //
  const userWithAddrBad = parseUserWithAddr({
    id: 5,
    name: 'john',
    address: {
      city: 'seattle',
      zip: '98111',
    },
  });
  expect(userWithAddrBad).toBe(false);

  // ** Test parse "onError" function ** //
  const parseUserWithError = parseObject(
    {
      id: isNumber,
      name: isString,
    },
    (err) => {
      expect(err[0].key).toStrictEqual('id');
      expect(err[0].value).toStrictEqual('5');
    },
  );
  parseUserWithError({
    id: '5',
    name: 'john',
  });

  // ** Test parseObj "onError" function for array argument ** //
  const parseUserArrWithError = parseObjectArray(
    {
      id: isNumber,
      name: isString,
    },
    (errors) => {
      expect(errors[0].value).toStrictEqual('3');
      expect(errors[0].keyPath?.[0]).toStrictEqual('2');
      expect(errors[0].keyPath?.[1]).toStrictEqual('id');
    },
  );
  parseUserArrWithError([
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: '3', name: '3' },
    { id: 3, name: '3' },
  ]);

  // ** Test "parseObj" when validator throws error ** //
  const isStrWithErr = (val: unknown): val is string => {
    if (isString(val)) {
      return true;
    } else {
      throw new Error('Value was not a valid string.');
    }
  };
  const parseUserHandleErr = parseObject(
    {
      id: isNumber,
      name: isStrWithErr,
    },
    (err) => {
      expect(err[0].key).toStrictEqual('name');
      expect(err[0].value).toStrictEqual(null);
      expect(err[0].caught).toStrictEqual('Value was not a valid string.');
    },
  );
  parseUserHandleErr({
    id: 5,
    name: null,
  });

  // ** Wrap parseObject ** //
  const customParse = <U extends Schema<unknown>>(schema: U) =>
    parseObject(schema, (err) => {
      throw new Error(JSON.stringify(err));
    });
  const parseUserAlt = customParse({ id: isNumber, name: isString });
  expect(parseUserAlt({ id: 5, name: 'joe' })).toStrictEqual({
    id: 5,
    name: 'joe',
  });
  expect(() => parseUserAlt('horse')).toThrowError();

  // ** Test onError for multiple properties ** //
  let errArr: ParseError[] = [];
  parseObject(
    {
      id: isNumber,
      name: isString,
    },
    (err) => (errArr = err),
  )({ id: 'joe', name: 5 });
  expect(errArr).toStrictEqual([
    {
      functionName: 'isNumber',
      info: 'Validator function returned false.',
      key: 'id',
      value: 'joe',
    },
    {
      functionName: 'isString',
      info: 'Validator function returned false.',
      key: 'name',
      value: 5,
    },
  ]);
});

/**
 * Test "testObject" function
 */
test('test "testObject()" function', () => {
  // Do basic test
  const testUser = testObject({
    id: isNumber,
    name: isString,
    address: {
      city: isString,
      zip: transform(Number, isNumber),
    },
  });
  const result = testUser({
    id: 5,
    name: 'john',
    address: {
      city: 'Seattle',
      zip: '98109',
    },
  });
  expect(result).toStrictEqual(true);

  // Test combination of "parseObject" and "testObject"
  let errArr: ParseError[] = [];
  const testCombo = parseObject(
    {
      id: isNumber,
      name: isString,
      address: testObject({
        city: isString,
        zip: transform(Number, isNumber),
        country: testOptionalObject({
          name: isString,
          code: isNumber,
        }),
      }),
    },
    (errors) => {
      errArr = errors;
    },
  );
  const user = testCombo({
    id: 5,
    name: 'john',
    address: {
      city: 'Seattle',
      zip: '98109',
    },
  });
  expect(user).toStrictEqual({
    id: 5,
    name: 'john',
    address: {
      city: 'Seattle',
      zip: 98109,
    },
  });

  testCombo({
    id: 5,
    name: 'john',
    address: {
      city: 'Seattle',
      zip: 'horse',
      country: {
        name: 'USA',
        code: '1234',
      },
    },
  });
  expect(errArr).toStrictEqual([
    {
      functionName: 'isNumber',
      info: 'Validator function returned false.',
      keyPath: ['code'],
      value: '1234',
    },
    {
      functionName: 'testFn',
      info: 'Validator function returned false.',
      keyPath: ['country'],
      value: {
        code: '1234',
        name: 'USA',
      },
    },
    {
      caught: undefined,
      functionName: 'fn',
      info: 'Validator function returned false.',
      keyPath: ['zip'],
      value: 'horse',
    },
    {
      functionName: 'testFn',
      info: 'Validator function returned false.',
      key: 'address',
      value: {
        city: 'Seattle',
        country: {
          code: '1234',
          name: 'USA',
        },
        zip: 'horse',
      },
    },
  ]);

  // Test combination of "parseObject" and "testObjectArray"
  const testCombo2 = parseObject({
    id: isNumber,
    name: isString,
    addresses: testObjectArray({
      city: isString,
      zip: isNumber,
    }),
  });
  const testCombo2GoodData = {
      id: 5,
      name: 'john',
      addresses: [
        {
          city: 'Seattle',
          zip: 98109,
        },
        {
          city: 'Seattle',
          zip: 98111,
        },
      ],
    },
    testCombo2GoodDataResult = structuredClone(testCombo2GoodData);
  const testCombo2FailData = {
    id: 5,
    name: 'john',
    addresses: [
      {
        city: 'Seattle',
        zip: 98109,
      },
      {
        city: 'Seattle',
        zip: '98111',
      },
    ],
  };
  expect(testCombo2(testCombo2GoodData)).toStrictEqual(
    testCombo2GoodDataResult,
  );
  expect(testCombo2(testCombo2FailData)).toStrictEqual(false);
});

/**
 * Test different safety options
 */
test('test different safety options', () => {
  // Default
  const defaultParseUser = parseObject({
    id: isNumber,
    name: isString,
  });
  const resp1 = defaultParseUser({
    id: 1,
    name: 'joe',
    address: 'blah',
  });
  expect(resp1).toStrictEqual({
    id: 1,
    name: 'joe',
  });

  // Loose
  const looseParseUser = looseParseObject({
    id: isNumber,
    name: isString,
  });
  const resp2 = looseParseUser({
    id: 1,
    name: 'joe',
    address: 'blah',
  });
  expect(resp2).toStrictEqual({
    id: 1,
    name: 'joe',
    address: 'blah',
  });

  // Strict
  let errArr: ParseError[] = [];
  const strictParseUser = strictParseObject(
    {
      id: isNumber,
      name: isString,
    },
    (errors) => {
      errArr = errors;
    },
  );
  const resp3 = strictParseUser({
    id: 1,
    name: 'joe',
    address: 'blah',
  });
  expect(resp3).toStrictEqual(false);
  expect(errArr).toStrictEqual([
    {
      functionName: '<strict>',
      info: 'Strict mode: unknown or invalid property',
      key: 'address',
      value: 'blah',
    },
  ]);

  // Combo
  let errArr2: ParseError[] = [];

  const comboParse = strictParseObject(
    {
      id: isNumber,
      name: isString,
      address: {
        street: isString,
        zip: isNumber,
      },
      country: testObject({
        name: isString,
        code: isNumber,
      }),
      education: looseTestObject({
        collegeName: isString,
        completedHighschool: isBoolean,
      }),
    },
    (errors) => {
      errArr2 = errors;
    },
  );

  const resp4 = comboParse({
    id: 1,
    name: 'joe',
    address: {
      city: 'Seattle', // should raise error
      zip: 1234,
      street: 'asdf',
    },
    country: {
      name: 'USA',
      code: 1234,
      ranking: 12, // should not raise error
    },
    education: {
      collegeName: 'univ of bob',
      completedHighschool: false,
      completedCollege: false, // should not raise error
    },
  });

  expect(resp4).toStrictEqual(false);
  expect(errArr2).toStrictEqual([
    {
      functionName: '<strict>',
      info: 'Strict mode: unknown or invalid property',
      keyPath: ['address', 'city'],
      value: 'Seattle',
    },
  ]);
});

/**
 * Optional properties which are undefined are getting appended to the
 * response object.
 */
test('Fix "transform" appending undefined properties to object', () => {
  interface User {
    id: number;
    name: string;
    birthdate?: Date;
  }

  const transformIsOptionalDate = transform(
    (arg) => (isUndef(arg) ? arg : new Date(arg as string)),
    (arg: unknown): arg is Date | undefined => isOptionalValidDate(arg),
  );

  const parseUser = parseObject<User>({
    id: isNumber,
    name: isString,
    birthdate: transformIsOptionalDate,
  });

  const user: User = {
    id: 1,
    name: 'joe',
  };

  const user2: User = {
    id: 2,
    name: 'john',
    birthdate: undefined,
  };

  const user3: User = {
    id: 3,
    name: 'jane',
    birthdate: '2025-05-31T18:13:34.990Z' as unknown as Date,
  };

  // Run tests
  const userResp = parseUser(user);
  expect('birthdate' in userResp).toStrictEqual(false);
  const userResp2 = parseUser(user2);
  expect('birthdate' in userResp2).toStrictEqual(true);
  const userResp3 = parseUser(user3);
  expect(userResp3).toStrictEqual({
    id: 3,
    name: 'jane',
    birthdate: new Date('2025-05-31T18:13:34.990Z'),
  });
  parseUser(
    {
      id: 2,
      name: 'john',
      birthdate: 'horse',
    },
    (errors) => {
      expect(errors[0].key).toStrictEqual('birthdate');
    },
  );
});

/**
 * 12/16/2025 add the flatten function to remove recursion for the schema
 * holding the validator functions.
 */
test('Test for update which removed recursion', () => {
  interface IUser {
    id: number;
    name: string;
    address: {
      street: string;
      city: string;
      // country?: { // <-- Cannot use undefined for nested schemas unless
      // using parse/testObject function
      country: {
        code: number;
        name: string;
      };
    };
    email?: string;
  }

  const parseUser = parseObject<IUser>({
    id: isUnsignedInteger,
    name: isString,
    address: {
      street: isString,
      city: isString,
      country: {
        code: isNumber,
        name: isString,
      },
    },
    email: isOptionalString,
  });

  // ** Test 1 ** //
  const user: IUser = {
    id: 1,
    name: 'sean',
    address: {
      street: '123 fake st',
      city: 'seattle',
      country: {
        code: 1,
        name: 'USA',
      },
    },
  };

  const result = parseUser(user);
  expect(result).toStrictEqual(user); // Should return deepClone of user

  const user2: IUser = {
    id: 1,
    name: 'sean',
    address: {
      street: '123 fake st',
      city: 1234 as unknown as string,
      country: {
        code: '123' as unknown as number,
        name: 'USA',
      },
    },
    email: 123 as unknown as string,
  };

  parseUser(user2, (errors) => {
    expect(errors).toStrictEqual([
      {
        functionName: 'isOptionalString',
        info: 'Validator function returned false.',
        key: 'email',
        value: 123,
      },
      {
        functionName: 'isString',
        info: 'Validator function returned false.',
        keyPath: ['address', 'city'],
        value: 1234,
      },
      {
        functionName: 'isNumber',
        info: 'Validator function returned false.',
        keyPath: ['address', 'country', 'code'],
        value: '123',
      },
    ]);
  });
});
