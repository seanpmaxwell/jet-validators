/* eslint-disable n/no-unsupported-features/node-builtins */
/* eslint-disable max-len */
import { expect, test } from 'vitest';

import {
  isUndef,
  isNull,
  isNullish,
  isBoolean,
  isOptionalBoolean,
  isNullableBoolean,
  isNullishBoolean,
  isValidBoolean,
  isBooleanArray,
  isOptionalBooleanArray,
  isNullableBooleanArray,
  isNullishBooleanArray,
  isNumber,
  isOptionalNumber,
  isNullableNumber,
  isNullishNumber,
  isValidNumber,
  isNumberArray,
  isOptionalNumberArray,
  isNullableNumberArray,
  isNullishNumberArray,
  isBigInt,
  isOptionalBigInt,
  isString,
  isOptionalString,
  isNullableString,
  isNullishString,
  isNonEmptyString,
  isOptionalNonEmptyString,
  isNullableNonEmptyString,
  isNullishNonEmptyString,
  isStringArray,
  isOptionalStringArray,
  isNullableStringArray,
  isNullishStringArray,
  isSymbol,
  isOptionalSymbol,
  isNullableSymbol,
  isNullishSymbol,
  isDate,
  isOptionalDate,
  isNullableDate,
  isNullishDate,
  isValidDate,
  isOptionalValidDate,
  isDateArray,
  isOptionalDateArray,
  isNullableDateArray,
  isNullishDateArray,
  isObject,
  isOptionalObject,
  isNullableObject,
  isNullishObject,
  isObjectArray,
  isOptionalObjectArray,
  isNullableObjectArray,
  isNullishObjectArray,
  isFunction,
  isOptionalFunction,
  isNullableFunction,
  isNullishFunction,
  isFunctionArray,
  isOptionalFunctionArray,
  isNullableFunctionArray,
  isNullishFunctionArray,
  isInArray,
  isOptionalInArray,
  isNullishInArray,
  isInRange,
  isNullishInRange,
  isOptionalInRange,
  isNullishInRangeArray,
  isKeyOf,
  isNullableKeyOf,
  isValueOf,
  type ValueOf,
  isNullishValueOf,
  isNullishPositiveNumber,
  isNullablePositiveNumber,
  isNullableNegativeInteger,
  isUnsignedIntegerArray,
  isNullableUnsignedIntegerArray,
} from '../src';

import {
  nonNullable,
  makeOptional,
  makeNullable,
  makeNullish,
  parseBoolean,
  parseNullishObjectArray,
  parseObject,
  parseObjectArray,
  parseOptionalObject,
  parseJson,
  testObject,
  transform,
  type TSchema,
  type IParseObjectError,
  testOptionalObject,
  testObjectArray,
  strictParseObject,
  looseParseObject,
  looseTestObject,
} from '../utils/src';


/******************************************************************************
                                 Tests
******************************************************************************/

/**
 * Test all the basic validators
 */
test('test basic validators', () => {
  
  // Nullables
  expect(isUndef(undefined)).toStrictEqual(true);
  expect(isNull(null)).toStrictEqual(true);
  expect(isNullish(null)).toStrictEqual(true);
  expect(isNullish(undefined)).toStrictEqual(true);

  // Booleans
  expect(isBoolean(false)).toStrictEqual(true);
  expect(isBoolean('asdf')).toStrictEqual(false);
  expect(isOptionalBoolean(false)).toStrictEqual(true);
  expect(isOptionalBoolean(undefined)).toStrictEqual(true);
  expect(isNullableBoolean(false)).toStrictEqual(true);
  expect(isNullableBoolean(null)).toStrictEqual(true);
  expect(isNullishBoolean(false)).toStrictEqual(true);
  expect(isNullishBoolean(null)).toStrictEqual(true);
  expect(isNullishBoolean(undefined)).toStrictEqual(true);

  // Is valid boolean
  expect(isValidBoolean(false)).toStrictEqual(true);
  expect(isValidBoolean(true)).toStrictEqual(true);
  expect(isValidBoolean('Yes')).toStrictEqual(true);
  expect(isValidBoolean('no')).toStrictEqual(true);
  expect(isValidBoolean('1')).toStrictEqual(true);
  expect(isValidBoolean('0')).toStrictEqual(true);
  expect(isValidBoolean(1)).toStrictEqual(true);
  expect(isValidBoolean(0)).toStrictEqual(true);
  expect(isValidBoolean('False')).toStrictEqual(true);
  expect(isValidBoolean('tRuE')).toStrictEqual(true);
  expect(isValidBoolean(1234)).toStrictEqual(false);
  expect(isValidBoolean(undefined)).toStrictEqual(false);

  // Boolean Arrays
  expect(isBooleanArray([false, true, false])).toStrictEqual(true);
  expect(isBooleanArray([false, true, 'asdf'])).toStrictEqual(false);
  expect(isBooleanArray(true)).toStrictEqual(false);
  expect(isOptionalBooleanArray([false, true, false])).toStrictEqual(true);
  expect(isOptionalBooleanArray(undefined)).toStrictEqual(true);
  expect(isNullableBooleanArray([false, true, false])).toStrictEqual(true);
  expect(isNullableBooleanArray(null)).toStrictEqual(true);
  expect(isNullishBooleanArray([false, true, false])).toStrictEqual(true);
  expect(isNullishBooleanArray(null)).toStrictEqual(true);
  expect(isNullishBooleanArray(undefined)).toStrictEqual(true);

  // Numbers
  expect(isNumber(123)).toStrictEqual(true);
  expect(isNumber(false)).toStrictEqual(false);
  expect(isOptionalNumber(123)).toStrictEqual(true);
  expect(isOptionalNumber(undefined)).toStrictEqual(true);
  expect(isNullableNumber(123)).toStrictEqual(true);
  expect(isNullableNumber(null)).toStrictEqual(true);
  expect(isNullishNumber(123)).toStrictEqual(true);
  expect(isNullishNumber(null)).toStrictEqual(true);
  expect(isNullishNumber(undefined)).toStrictEqual(true);

  // Valid numbers
  expect(isValidNumber('123')).toStrictEqual(true);

  // Number Arrays
  expect(isNumberArray([1, 2, 3])).toStrictEqual(true);
  expect(isNumberArray([false, true, '123'])).toStrictEqual(false);
  expect(isNumberArray(123)).toStrictEqual(false);
  expect(isOptionalNumberArray([1, 2 ,3])).toStrictEqual(true);
  expect(isOptionalNumber(undefined)).toStrictEqual(true);
  expect(isNullableNumberArray([1, 2, 3])).toStrictEqual(true);
  expect(isNullableNumberArray(null)).toStrictEqual(true);
  expect(isNullishNumberArray([1, 2, 3])).toStrictEqual(true);
  expect(isNullishNumberArray(null)).toStrictEqual(true);
  expect(isNullishNumberArray(undefined)).toStrictEqual(true);

  // BigInt
  expect(isBigInt(1234567890123456789012345n)).toStrictEqual(true);
  expect(isOptionalBigInt(undefined)).toStrictEqual(true);

  // Strings
  expect(isString('123')).toStrictEqual(true);
  expect(isString(false)).toStrictEqual(false);
  expect(isOptionalString('123')).toStrictEqual(true);
  expect(isOptionalString(undefined)).toStrictEqual(true);
  expect(isNullableString('123')).toStrictEqual(true);
  expect(isNullableString(null)).toStrictEqual(true);
  expect(isNullishString('123')).toStrictEqual(true);
  expect(isNullishString(null)).toStrictEqual(true);
  expect(isNullishString(undefined)).toStrictEqual(true);

  // Non-Empty Strings
  expect(isNonEmptyString('123')).toStrictEqual(true);
  expect(isNonEmptyString('')).toStrictEqual(false);
  expect(isOptionalNonEmptyString('123')).toStrictEqual(true);
  expect(isOptionalNonEmptyString(undefined)).toStrictEqual(true);
  expect(isNullableNonEmptyString('123')).toStrictEqual(true);
  expect(isNullableNonEmptyString(null)).toStrictEqual(true);
  expect(isNullishNonEmptyString('123')).toStrictEqual(true);
  expect(isNullishNonEmptyString('')).toStrictEqual(false);
  expect(isNullishNonEmptyString(null)).toStrictEqual(true);
  expect(isNullishNonEmptyString(undefined)).toStrictEqual(true);

  // String Arrays
  expect(isStringArray(['1', '2', '3'])).toStrictEqual(true);
  expect(isStringArray(['false', '123', true])).toStrictEqual(false);
  expect(isStringArray('123')).toStrictEqual(false);
  expect(isOptionalStringArray(['1', '2', '3'])).toStrictEqual(true);
  expect(isOptionalStringArray(undefined)).toStrictEqual(true);
  expect(isNullableStringArray(['1', '2', '3'])).toStrictEqual(true);
  expect(isNullableStringArray(null)).toStrictEqual(true);
  expect(isNullishStringArray(['1', '2', '3'])).toStrictEqual(true);
  expect(isNullishStringArray(null)).toStrictEqual(true);
  expect(isNullishStringArray(undefined)).toStrictEqual(true);

  // Symbol
  expect(isSymbol(Symbol('foo'))).toStrictEqual(true);
  expect(isSymbol(false)).toStrictEqual(false);
  expect(isOptionalSymbol(Symbol('foo'))).toStrictEqual(true);
  expect(isOptionalSymbol(undefined)).toStrictEqual(true);
  expect(isNullableSymbol(Symbol('foo'))).toStrictEqual(true);
  expect(isNullableSymbol(null)).toStrictEqual(true);
  expect(isNullishSymbol(Symbol('foo'))).toStrictEqual(true);
  expect(isNullishSymbol(null)).toStrictEqual(true);
  expect(isNullishSymbol(undefined)).toStrictEqual(true);

  // Date
  const D1 = new Date();
  expect(isDate(D1)).toStrictEqual(true);
  expect(isDate(new Date('2024-11-09T23:43:58.788Z'))).toStrictEqual(true);
  expect(isDate(new Date('horse'))).toStrictEqual(false);
  expect(isDate(false)).toStrictEqual(false);
  expect(isOptionalDate(D1)).toStrictEqual(true);
  expect(isOptionalDate(undefined)).toStrictEqual(true);
  expect(isNullableDate(D1)).toStrictEqual(true);
  expect(isNullableDate(null)).toStrictEqual(true);
  expect(isNullishDate(D1)).toStrictEqual(true);
  expect(isNullishDate(null)).toStrictEqual(true);
  expect(isNullishDate(undefined)).toStrictEqual(true);

  // Valid Dates
  expect(isValidDate(1731195800809)).toStrictEqual(true);
  expect(isValidDate('2024-11-09T23:43:58.788Z')).toStrictEqual(true);
  expect(isValidDate('2024-111-09T23:43:58.788Z')).toStrictEqual(false);
  expect(isValidDate(12341234123412342)).toStrictEqual(false);

  // Date Arrays
  const D2 = new Date(), D3 = new Date();
  expect(isDateArray([D1, D2, D3])).toStrictEqual(true);
  expect(isDateArray([D1, D2, '2024-10-30T20:08:36.838Z'])).toStrictEqual(false);
  expect(isDateArray(D1)).toStrictEqual(false);
  expect(isOptionalDateArray([D1, D2, D3])).toStrictEqual(true);
  expect(isOptionalDateArray(undefined)).toStrictEqual(true);
  expect(isNullableDateArray([D1, D2, D3])).toStrictEqual(true);
  expect(isNullableDateArray(null)).toStrictEqual(true);
  expect(isNullishDateArray([D1, D2, D3])).toStrictEqual(true);
  expect(isNullishDateArray(null)).toStrictEqual(true);
  expect(isNullishDateArray(undefined)).toStrictEqual(true);

  // Is Object
  const O1 = { val: 1 };
  expect(isObject(O1)).toStrictEqual(true);
  expect(isObject(false)).toStrictEqual(false);
  expect(isOptionalObject(O1)).toStrictEqual(true);
  expect(isOptionalObject(undefined)).toStrictEqual(true);
  expect(isNullableObject(O1)).toStrictEqual(true);
  expect(isNullableObject(null)).toStrictEqual(true);
  expect(isNullishObject(O1)).toStrictEqual(true);
  expect(isNullishObject(null)).toStrictEqual(true);
  expect(isNullishObject(undefined)).toStrictEqual(true);

  // Object Arrays
  const O2 = { val: 2 }, O3 = { val: 3 };
  expect(isObjectArray([O1, O2, O3])).toStrictEqual(true);
  expect(isObjectArray([O1, O2, '2024-10-30T20:08:36.838Z'])).toStrictEqual(false);
  expect(isObjectArray(O1)).toStrictEqual(false);
  expect(isOptionalObjectArray([O1, O2, O3])).toStrictEqual(true);
  expect(isOptionalObjectArray(undefined)).toStrictEqual(true);
  expect(isNullableObjectArray([O1, O2, O3])).toStrictEqual(true);
  expect(isNullableObjectArray(null)).toStrictEqual(true);
  expect(isNullishObjectArray([O1, O2, O3])).toStrictEqual(true);
  expect(isNullishObjectArray(null)).toStrictEqual(true);
  expect(isNullishObjectArray(undefined)).toStrictEqual(true);

  // Functions
  const F1 = () => 1;
  expect(isFunction(F1)).toStrictEqual(true);
  expect(isFunction(false)).toStrictEqual(false);
  expect(isOptionalFunction(F1)).toStrictEqual(true);
  expect(isOptionalFunction(undefined)).toStrictEqual(true);
  expect(isNullableFunction(F1)).toStrictEqual(true);
  expect(isNullableFunction(null)).toStrictEqual(true);
  expect(isNullishFunction(F1)).toStrictEqual(true);
  expect(isNullishFunction(null)).toStrictEqual(true);
  expect(isNullishFunction(undefined)).toStrictEqual(true);

  // Function Arrays
  const F2 = () => 2, F3 = () => 3;
  expect(isFunctionArray([F1, F2, F3])).toStrictEqual(true);
  expect(isFunctionArray([F1, F2, '2024-10-30T20:08:36.838Z'])).toStrictEqual(false);
  expect(isFunctionArray(F1)).toStrictEqual(false);
  expect(isOptionalFunctionArray([F1, F2, F3])).toStrictEqual(true);
  expect(isOptionalFunctionArray(undefined)).toStrictEqual(true);
  expect(isNullableFunctionArray([F1, F2, F3])).toStrictEqual(true);
  expect(isNullableFunctionArray(null)).toStrictEqual(true);
  expect(isNullishFunctionArray([F1, F2, F3])).toStrictEqual(true);
  expect(isNullishFunctionArray(null)).toStrictEqual(true);
  expect(isNullishFunctionArray(undefined)).toStrictEqual(true);
});

/**
 * Test complex-validators.
 */
test('test complex validators', () => {

  // This will make the type '1' | '2' | '3' instead of just string[]
  const arr = ['1', '2', '3'] as const,
    isInArrTest = isInArray(arr);
  expect(isInArrTest('1')).toStrictEqual(true);
  expect(isInArrTest(1)).toStrictEqual(false);
  expect(isOptionalInArray(arr)('1')).toStrictEqual(true);
  expect(isOptionalInArray(arr)(undefined)).toStrictEqual(true);
  expect(isNullishInArray(arr)(undefined)).toStrictEqual(true);

  // Ranges
  const isValidAge = isInRange([18], [130]);
  expect(isValidAge(123)).toStrictEqual(true);
  expect(isValidAge('5')).toStrictEqual(false);
  expect(isValidAge(150)).toStrictEqual(false);
  const isNullishPos = isNullishInRange(0, []);
  expect(isNullishPos(1_000_000)).toStrictEqual(true);
  expect(isNullishPos(-1)).toStrictEqual(false);
  expect(isNullishPos(undefined)).toStrictEqual(true);
  expect(isNullishPos(null)).toStrictEqual(true);
  const isOptionalNeg = isOptionalInRange([], 0);
  expect(isOptionalNeg(-1_000_000)).toStrictEqual(true);
  expect(isOptionalNeg(.01)).toStrictEqual(false);
  expect(isOptionalNeg(undefined)).toStrictEqual(true);
  expect(isOptionalNeg(null)).toStrictEqual(false);
  const isValidNums = isNullishInRangeArray([-1], 10);
  expect(isValidNums([-1, 2, 3])).toStrictEqual(true);
  expect(isValidNums([-1, '11', 3])).toStrictEqual(false);
  expect(isValidNums([-1, null, 3])).toStrictEqual(false);
  expect(isValidNums([-1, 'horse', 3])).toStrictEqual(false);
  expect(isValidNums(2)).toStrictEqual(false);
  expect(isValidNums(null)).toStrictEqual(true);

  // Check is key of Object
  const someObject = {
    foo: 'bar',
    bada: 'bing',
  } as const;
  const isKeyOfSomeObject = isKeyOf(someObject);
  expect(isKeyOfSomeObject('foo')).toStrictEqual(true);
  expect(isKeyOfSomeObject('bada')).toStrictEqual(true);
  expect(isKeyOfSomeObject('bing')).toStrictEqual(false);
  const isNullableKeyOfSomeObject = isNullableKeyOf(someObject);
  expect(isNullableKeyOfSomeObject(null)).toStrictEqual(true);

  // Check is value in an Object
  const someOtherObject = {
    foo: 'bar',
    bada: 'bing',
  } as const;
  const blah: ValueOf<typeof someOtherObject> = 'bing';
  const isValueOfSomeObject = isValueOf(someOtherObject);
  expect(isValueOfSomeObject('bar')).toStrictEqual(true);
  expect(isValueOfSomeObject('bing')).toStrictEqual(true);
  expect(isValueOfSomeObject('foo')).toStrictEqual(false);
  expect(isValueOfSomeObject(blah)).toStrictEqual(true);
  const isNullishValueOfSomeObject = isNullishValueOf(someOtherObject);
  expect(isNullishValueOfSomeObject(null)).toStrictEqual(true);
  expect(isNullishValueOfSomeObject(undefined)).toStrictEqual(true);
});

/**
 * Test simple utilities.
 */
test('test simple utilities', () => {

  // Non-Nullable
  expect(nonNullable(isNullableString)('asdf')).toStrictEqual(true);
  expect(nonNullable(isNullableString)(null)).toStrictEqual(false);
  expect(nonNullable(isNullableString)(undefined)).toStrictEqual(false);

  const isAlphaNumeric = (arg: unknown): arg is string => {
    return isString(arg) && /^[a-zA-Z0-9]*$/.test(arg);
  };

  const isOptionalAlphaNumeric = makeOptional(isAlphaNumeric);
  const isNullableAlphaNumeric = makeNullable(isAlphaNumeric);
  const isNullishAlphaNumeric = makeNullish(isAlphaNumeric);

  expect(isAlphaNumeric('foo1234')).toStrictEqual(true);
  expect(isAlphaNumeric('foo1-234')).toStrictEqual(false);
  expect(isOptionalAlphaNumeric('foo1-234')).toStrictEqual(false);
  expect(isOptionalAlphaNumeric(undefined)).toStrictEqual(true);
  expect(isNullableAlphaNumeric(undefined)).toStrictEqual(false);
  expect(isNullishAlphaNumeric(undefined)).toStrictEqual(true);
  expect(isNullishAlphaNumeric('72naAD')).toStrictEqual(true);

  // Check "transform" and "parseJson" functions
  const isNumArrWithParse = transform(parseJson, isNumberArray);
  expect(isNumArrWithParse('[1,2,3]', val => {
    expect(isNumberArray(val)).toStrictEqual(true);
  })).toStrictEqual(true);

  // Check parse boolean function
  expect(parseBoolean(false)).toStrictEqual(false);
  expect(parseBoolean(true)).toStrictEqual(true);
  expect(parseBoolean('fAlSe')).toStrictEqual(false);
  expect(() => parseBoolean('fAlSee')).toThrowError();
  expect(parseBoolean('tRUe')).toStrictEqual(true);
  expect(parseBoolean(1)).toStrictEqual(true);
  expect(parseBoolean(0)).toStrictEqual(false);
  expect(parseBoolean('1')).toStrictEqual(true);
  expect(parseBoolean('0')).toStrictEqual(false);
});

/**
 * Test "parseObject" function
 */
test('test "parseObject()" function', () => {

  interface IUser {
    id: number;
    name: string;
  }

  // Basic Test
  const parseUser = parseObject({
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
  const parseUserWithError = parseObject({
    id: isNumber,
    name: isString,
  }, err => {
    expect(err[0].prop).toStrictEqual('id');
    expect(err[0].value).toStrictEqual('5');
  });
  parseUserWithError({
    id: '5',
    name: 'john',
  });

  // ** Test parseObj "onError" function for array argument ** //
  const parseUserArrWithError = parseObjectArray({
    id: isNumber,
    name: isString,
  }, err => {
    expect(err[0].prop).toStrictEqual('id');
    expect(err[0].value).toStrictEqual('3');
    expect(err[0].index).toStrictEqual(2);
  });
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
  const parseUserHandleErr = parseObject({
    id: isNumber,
    name: isStrWithErr,
  }, err => {
    expect(err[0].prop).toStrictEqual('name');
    expect(err[0].value).toStrictEqual(null);
    expect(err[0].caught).toStrictEqual('Value was not a valid string.');
  });
  parseUserHandleErr({
    id: 5,
    name: null,
  });

  // ** Wrap parseObject ** //
  const customParse = <U extends TSchema>(schema: U) => 
    parseObject(schema, err => {
      throw new Error(JSON.stringify(err));
    });
  const parseUserAlt = customParse({ id: isNumber, name: isString });
  expect(parseUserAlt({ id: 5, name: 'joe' })).toStrictEqual({ id: 5, name: 'joe' });
  expect(() => parseUserAlt('horse')).toThrowError();


  // ** Test onError for multiple properties ** //
  let errArr: IParseObjectError[] = [];
  parseObject({
    id: isNumber,
    name: isString,
  }, err => {
    errArr = err;
  })({ id: 'joe', name: 5 });
  expect(errArr).toStrictEqual([
    { prop: 'id', value: 'joe', info: 'Validator-function returned false.' },
    { prop: 'name', value: 5, info: 'Validator-function returned false.' },
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
  let errArr: IParseObjectError[] = [];
  const testCombo = parseObject({
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
  }, errors => { errArr = errors; });
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
      info: 'Nested validation failed.',
      prop: 'address',
      children: [
        {
          info: 'Validator-function returned false.',
          prop: 'zip',
          value: 'horse',
        },
        {
          info: 'Nested validation failed.',
          prop: 'country',
          children: [
            {
              info: 'Validator-function returned false.',
              prop: 'code',
              value: '1234',
            },
          ],
        },
      ],
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
  expect(testCombo2(testCombo2GoodData)).toStrictEqual(testCombo2GoodDataResult);
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
  let errArr: IParseObjectError[] = [];
  const strictParseUser = strictParseObject({
    id: isNumber,
    name: isString,
  }, errors => { errArr = errors; });
  const resp3 = strictParseUser({
    id: 1,
    name: 'joe',
    address: 'blah',
  });
  expect(resp3).toStrictEqual(false);
  expect(errArr).toStrictEqual([{
    info: 'strict-safety failed, prop not in schema.',
    prop: 'address',
  }]);

  // Combo
  let errArr2: IParseObjectError[] = [];

  const comboParse = strictParseObject({
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
  }, errors => { errArr2 = errors; });

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
      info: 'Nested validation failed.',
      prop: 'address',
      children: [{
        info: 'strict-safety failed, prop not in schema.',
        prop: 'city',
      }],
    },
  ]);
});

/**
 * Optional properties which are undefined are getting appended to the 
 * response object.
 */
test('Fix "transform" appending undefined properties to object', () => {

  interface IUser {
    id: number;
    name: string;
    birthdate?: Date;
  }

  const transIsOptionalDate = transform(
    arg => isUndef(arg) ? arg : new Date(arg as string),
    (arg: unknown): arg is Date | undefined => isOptionalValidDate(arg),
  );

  const parseUser = parseObject<IUser>({
    id: isNumber,
    name: isString,
    birthdate: transIsOptionalDate,
  });

  const user: IUser = {
    id: 1,
    name: 'joe',
  };

  const user2: IUser = {
    id: 2,
    name: 'john',
    birthdate: undefined,
  };

  const user3: IUser = {
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
  parseUser({
    id: 2,
    name: 'john',
    birthdate: 'horse',
  }, (errors) => {
    expect(errors[0].prop).toStrictEqual('birthdate');
  });
});

/**
 * Test additional number types
 */
test('additional number types', () => {

  // Positive number
  expect(isNullishPositiveNumber(null)).toStrictEqual(true);
  expect(isNullishPositiveNumber(-3)).toStrictEqual(false);
  expect(isNullishPositiveNumber(543.234)).toStrictEqual(true);
  expect(isNullablePositiveNumber(undefined)).toStrictEqual(false);

  // Negative integer
  expect(isNullableNegativeInteger(-8.7)).toStrictEqual(false);
  expect(isNullableNegativeInteger(-8)).toStrictEqual(true);
  expect(isNullableNegativeInteger(null)).toStrictEqual(true);

  // Unsigned integer array
  expect(isUnsignedIntegerArray(-8.7)).toStrictEqual(false);
  expect(isUnsignedIntegerArray(-8)).toStrictEqual(false);
  expect(isUnsignedIntegerArray(null)).toStrictEqual(false);
  expect(isNullableUnsignedIntegerArray(null)).toStrictEqual(true);
  expect(isUnsignedIntegerArray([0, 1, 2])).toStrictEqual(true);
  expect(isUnsignedIntegerArray([])).toStrictEqual(true);
  expect(isNullableUnsignedIntegerArray([0, 1, undefined])).toStrictEqual(false);
});
