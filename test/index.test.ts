/* eslint-disable n/no-unsupported-features/node-builtins */
/* eslint-disable max-len */
import { expect, test, vi } from 'vitest';
import dotenv from 'dotenv';
import path from 'path';

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
  isColor,
  isOptionalColor,
  isNullableColor,
  isNullishColor,
  isEmail,
  isOptionalEmail,
  isNullableEmail,
  isNullishEmail,
  isAlphaNumericString,
  isOptionalAlphaNumericString,
  isNullableAlphaNumericString,
  isNullishAlphaNumericString,
  isAlphabeticString,
  isUrl,
  isEnum,
  isOptionalEnum,
  isNullableEnum,
  isNullishEnum,
  isRecord,
  isOptionalRecord,
  isNullableRecord,
  isNullishRecord,
  isInArray,
  isOptionalInArray,
  isNullishInArray,
  isInRange,
  isNullishInRange,
  isOptionalInRange,
  isNullishInRangeArray,
  isKeyOf,
  isNullableKeyOfArray,
  isEnumVal,
  isOptionalEnumVal,
  isNullableEnumVal,
  isNullishEnumVal,
  TRecord,
} from '../src';

import {
  nonNullable,
  parseBoolean,
  parseNullishObjectArray,
  parseObject,
  parseObjectArray,
  parseOptionalObject,
  parseJson,
  testObject,
  transform,
  TSchema,
  customDeepCompare,
  deepCompare,
  IParseObjectError,
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

  // Test Record (TRecord => Record<string, unknown>)
  // NOTE: number keys are caste to strings and symbols are skipped when 
  // doing for..in loops.
  const R1: TRecord = { foo: 1, bar: 'bar' },
    R2: TRecord = { foo: 1, [1234]: 'bar' }, // numbers are converted to strings
    R3: TRecord = { foo: 1, [Symbol(777)]: 'bar' };
  // const blah: TRecord = {};
  // if (isRecord(blah)) {
  //   blah[1234];
  // }
  expect(isRecord(R1)).toStrictEqual(true);
  expect(isRecord(R2)).toStrictEqual(true);
  expect(isRecord(R3)).toStrictEqual(true);
  expect(R2['1234']).toStrictEqual('bar');
  expect(R2[1234]).toStrictEqual('bar');
  expect(isOptionalRecord(O1)).toStrictEqual(true);
  expect(isOptionalRecord(undefined)).toStrictEqual(true);
  expect(isNullableRecord(O1)).toStrictEqual(true);
  expect(isNullableRecord(null)).toStrictEqual(true);
  expect(isNullishRecord(O1)).toStrictEqual(true);
  expect(isNullishRecord(null)).toStrictEqual(true);
  expect(isNullishRecord(undefined)).toStrictEqual(true);
});


/**
 * Test regular expression validators.
 */
test('test regexes', () => {

  // Color
  expect(isColor('#ffffff')).toStrictEqual(true);
  expect(isColor('asdf')).toStrictEqual(false);
  expect(isOptionalColor('#ffffff')).toStrictEqual(true);
  expect(isOptionalColor(undefined)).toStrictEqual(true);
  expect(isNullableColor('#ffffff')).toStrictEqual(true);
  expect(isNullableColor(null)).toStrictEqual(true);
  expect(isOptionalColor('#ffffff')).toStrictEqual(true);
  expect(isNullishColor(undefined)).toStrictEqual(true);
  expect(isNullishColor(null)).toStrictEqual(true);
  expect(isNullishColor(undefined)).toStrictEqual(true);

  // Email
  expect(isEmail('a@a.com')).toStrictEqual(true);
  expect(isEmail('asdf')).toStrictEqual(false);
  expect(isOptionalEmail('a@a.com')).toStrictEqual(true);
  expect(isOptionalEmail(undefined)).toStrictEqual(true);
  expect(isNullableEmail('a@a.com')).toStrictEqual(true);
  expect(isNullableEmail(null)).toStrictEqual(true);
  expect(isOptionalEmail('a@a.com')).toStrictEqual(true);
  expect(isNullishEmail(undefined)).toStrictEqual(true);
  expect(isNullishEmail(null)).toStrictEqual(true);
  expect(isNullishEmail(undefined)).toStrictEqual(true);

  // Is Alpha-Numeric String
  expect(isAlphaNumericString('asdf1234')).toStrictEqual(true);
  expect(isAlphaNumericString('#ffffff')).toStrictEqual(false);
  expect(isOptionalAlphaNumericString('asdf1234')).toStrictEqual(true);
  expect(isOptionalAlphaNumericString(undefined)).toStrictEqual(true);
  expect(isNullableAlphaNumericString('asdf1234')).toStrictEqual(true);
  expect(isNullableAlphaNumericString(null)).toStrictEqual(true);
  expect(isOptionalAlphaNumericString('asdf1234')).toStrictEqual(true);
  expect(isNullishAlphaNumericString(undefined)).toStrictEqual(true);
  expect(isNullishAlphaNumericString(null)).toStrictEqual(true);
  expect(isNullishAlphaNumericString(undefined)).toStrictEqual(true);

  // Alphabetic string
  expect(isAlphabeticString('faAdfASzcioPD')).toStrictEqual(true);
  expect(isAlphabeticString('faAdfAS8cioPD')).toStrictEqual(false);

  // URL
  expect(isUrl('http://www.google.com')).toStrictEqual(true);
  expect(isUrl('www.google.com')).toStrictEqual(true);
  expect(isUrl('google.com')).toStrictEqual(true);
  expect(isUrl('google.net')).toStrictEqual(true);
  expect(isUrl('google')).toStrictEqual(false);

  // Email
  expect(isEmail('a@a.com')).toStrictEqual(true);
  expect(isEmail('asdf')).toStrictEqual(false);
  expect(isOptionalEmail('a@a.com')).toStrictEqual(true);
  expect(isOptionalEmail(undefined)).toStrictEqual(true);
  expect(isNullableEmail('a@a.com')).toStrictEqual(true);
  expect(isNullableEmail(null)).toStrictEqual(true);
  expect(isOptionalEmail('a@a.com')).toStrictEqual(true);
  expect(isNullishEmail(undefined)).toStrictEqual(true);
  expect(isNullishEmail(null)).toStrictEqual(true);
  expect(isNullishEmail(undefined)).toStrictEqual(true);
});


/**
 * Test overloading regexes from environment variables.
 */
test('test overloading regexes from environment variables', async () => {
  vi.resetModules();

  // Load environment file
  const result = dotenv.config({
    path: path.join(__dirname, '.env.vitest'),
  });
  if (result.error) {
    // eslint-disable-next-line no-console
    console.error(result);
  }
  const src = await import('../src/regexes.js');

  // Email
  // eslint-disable-next-line n/no-process-env
  expect(process.env.JET_VALIDATORS_REGEX_COLOR).toStrictEqual('^([A-Fa-f0-9]{6})$');
  expect(src.isColor('ffffff')).toStrictEqual(true);
  expect(src.isColor('#ffffff')).toStrictEqual(false);
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
  const isKeyofSomeObject = isKeyOf(someObject);
  expect(isKeyofSomeObject('foo')).toStrictEqual(true);
  expect(isKeyofSomeObject('bada')).toStrictEqual(true);
  expect(isKeyofSomeObject('bing')).toStrictEqual(false);
  const isKeyofSomeObjectArr = isNullableKeyOfArray(someObject);
  expect(isKeyofSomeObjectArr(['bada', 'foo'])).toStrictEqual(true);
  expect(isKeyofSomeObjectArr(null)).toStrictEqual(true);
  expect(isKeyofSomeObjectArr(['bar', 'foo', 'bing'])).toStrictEqual(false);

  // Enums (NOTE: We cannot used mixed Enum types)
  // See: "eslint@typescript-eslint/no-mixed-enums"
  enum StringEnum {
    Foo = 'foo',
    Bar = 'bar',
  }
  enum NumberEnum {
    Foo,
    Bar,
  }
  const NotAnEnum = {
    Foo: 1,
    Bar: 2,
  };
  expect(isEnum(StringEnum)).toStrictEqual(true);
  expect(isEnum(NotAnEnum)).toStrictEqual(false);
  expect(isOptionalEnum(NumberEnum)).toStrictEqual(true);
  expect(isOptionalEnum(undefined)).toStrictEqual(true);
  expect(isNullableEnum(StringEnum)).toStrictEqual(true);
  expect(isNullableEnum(null)).toStrictEqual(true);
  expect(isNullishEnum(StringEnum)).toStrictEqual(true);
  expect(isNullishEnum(null)).toStrictEqual(true);
  expect(isNullishEnum(undefined)).toStrictEqual(true);

  // Is enums value
  const testIsStringEnumVal = isEnumVal(StringEnum),
    testIsNumberEnumVal = isEnumVal(NumberEnum);
  expect(testIsStringEnumVal('foo')).toStrictEqual(true);
  expect(testIsNumberEnumVal(1)).toStrictEqual(true);
  expect(testIsNumberEnumVal(3)).toStrictEqual(false);
  expect(isOptionalEnumVal(NumberEnum)(undefined)).toStrictEqual(true);
  expect(isNullableEnumVal(NumberEnum)(null)).toStrictEqual(true);
  expect(isNullishEnumVal(NumberEnum)(null)).toStrictEqual(true);
  expect(isNullishEnumVal(NumberEnum)(1)).toStrictEqual(true);
});


/**
 * Test simple utilities.
 */
test('test simple utilities', () => {

  // Non-Nullable
  expect(nonNullable(isNullableString)('asdf')).toStrictEqual(true);
  expect(nonNullable(isNullableString)(null)).toStrictEqual(false);
  expect(nonNullable(isNullableString)(undefined)).toStrictEqual(false);

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
 * Test "deepCompare" function
 */
test('test "deepCompare()" function basic', () => {

  const throwErrCb = (key: string, val1: unknown, val2: unknown) => {
    throw new Error(`Unequal vals | Key: "${key}" Value1: ${String(val1)} Value2: ${String(val2)}`);
  };

  // Init deep comparison functions
  const deepCompare2 = customDeepCompare(throwErrCb),
    deepCompare3 = customDeepCompare({
      convertToDateProps: 'created',
      onlyCompareProps: ['id', 'name', 'created'],
    }),
    deepCompare4 = customDeepCompare({
      disregardDateException: true,
    }, throwErrCb);

  const date1 = new Date('2012-6-17'),
    date2 = new Date(date1),
    date3 = date1.getTime();
  (date2 as unknown as TRecord).cow = 'green';

  // Init dummy data
  const User1 = { id: 1, name: 'john' },
    User2 = { id: 1, name: 'john' },
    User3 = { id: 1, name: 'jane' },
    User4 = { id: 1, name: 'john', created: date1 },
    User5 = { id: 1, name: 'john', created: date3 },
    User5a = { id: 1, name: 'john', created: date2};

  const User6 = {
      id: 1,
      name: 'john',
      address: {
        street: 'foo',
        zip: 1234,
        unit: ['apt', 202],
        created: date1,
      },
    },
    User7 = {
      id: 1,
      name: 'john',
      address: {
        street: 'foo',
        zip: 1234,
        unit: ['apt', 202],
        created: date2,
      },
    },
    User8 = {
      id: 1,
      name: 'john',
      address: {
        street: 'foo',
        zip: 1234,
        created: date1,
        city: 'seattle',
      },
    };

  const arr1 = [ 'horse', 'cow', 2, User1, User8],
    arr2 = [ 'horse', 'cow', 2, User1, User8 ],
    arr3 = ['horse', User8, 2, User1, 'cow' ];

  // Tests
  expect(deepCompare(User1, User2)).toBeTruthy();
  expect(() => deepCompare2(User1, User3)).toThrowError();
  expect(deepCompare(User1, User3)).toBeFalsy();
  expect(deepCompare(User1, User4)).toBeFalsy();
  expect(() => deepCompare2(User1, User4)).toThrowError();
  expect(deepCompare(User4, User5)).toBeFalsy();
  expect(deepCompare3(User4, User5)).toBeTruthy();
  expect(deepCompare(User6, User7)).toBeTruthy();
  expect(deepCompare(User6, User8)).toBeFalsy();
  expect(() => deepCompare2(User6, User8)).toThrowError();
  expect(deepCompare3(User6, User8)).toBeTruthy();
  expect(deepCompare(arr1, arr2)).toBeTruthy();
  expect(deepCompare(arr1, arr3)).toBeFalsy();
  expect(deepCompare(User4, User5a)).toBeTruthy();
  expect(() => deepCompare4(User4, User5a)).toThrowError();
});


/**
 * Test "deepCompare" function overriding "rec" option.
 */
test('test "deepCompare()" function override "rec" option', () => {

  const deepCompare1 = customDeepCompare({
      convertToDateProps: { rec: false, props: 'created' },
      onlyCompareProps: ['id', 'name', 'address'],
    }),
    deepCompare2 = customDeepCompare({
      onlyCompareProps: 'id',
    // eslint-disable-next-line no-console
    }, (...params) => console.log(...params));

  const date1 = new Date('2012-6-17'),
    date2 = new Date(date1),
    date3 = date1.getTime();

  const User1 = {
      id: 1,
      name: 'john',
      address: {
        street: 'foo',
        zip: 1234,
        unit: ['apt', 202],
        created: date1,
      },
      foo: 'bar',
    },
    User2 = {
      id: 1,
      name: 'john',
      address: {
        street: 'foo',
        zip: 1234,
        unit: ['apt', 202],
        created: date2,
      },
    },
    User3 = {
      id: 1,
      name: 'john',
      address: {
        street: 'foo',
        zip: 1234,
        unit: ['apt', 202],
        created: date3,
      },
    };

  const Post1 = { id: 1, text: 'asdf' },
    Post2 = { id: 2, text: 'ffff' },
    Post3 = { id: 2, text: 'gggg' };

  const arr = [ User1, User2, User3 ],
    arr2 = structuredClone(arr),
    arr3 = [ Post1, Post2 ],
    arr4 = [ Post1, Post3 ];

  expect(deepCompare1(User1, User2)).toBeTruthy();
  expect(deepCompare1(User1, User3)).toBeFalsy();
  expect(deepCompare1(arr, arr2)).toBeTruthy();
  expect(deepCompare2(arr3, arr4)).toBeTruthy();
});


/**
 * Test different safety options
 */
test.only('test different safety options', () => {

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
