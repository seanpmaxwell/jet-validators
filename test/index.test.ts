import { expect, test } from 'vitest';

import {
  isUndef,
  isNull,
  isNullOrUndef,
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
} from '../src';


/**
 * Test all the basic validators
 */
test('test basic validators', () => {
  
  // Nullables
  expect(isUndef(undefined)).toStrictEqual(true);
  expect(isNull(null)).toStrictEqual(true);
  expect(isNullOrUndef(null)).toStrictEqual(true);
  expect(isNullOrUndef(undefined)).toStrictEqual(true);

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
  const R1 = { foo: 1, bar: 'bar' },
    R2 = { foo: 1, [1234]: 'bar' }, // numbers are converted to strings
    R3 = { foo: 1, [Symbol(777)]: 'bar' };
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
  const isValidAge = isInRange(18, 130);
  expect(isValidAge(123)).toStrictEqual(true);
  expect(isValidAge(5)).toStrictEqual(false);
  expect(isValidAge(150)).toStrictEqual(false);
  const isPos = isNullishInRange(0, null);
  expect(isPos(1_000_000)).toStrictEqual(true);
  expect(isPos(-1)).toStrictEqual(false);
  expect(isPos(undefined)).toStrictEqual(true);
  expect(isPos(null)).toStrictEqual(true);
  const isNeg = isOptionalInRange(null, -.000001);
  expect(isNeg(-1_000_000)).toStrictEqual(true);
  expect(isNeg(.01)).toStrictEqual(false);
  expect(isNeg(undefined)).toStrictEqual(true);
  expect(isNeg(null)).toStrictEqual(false);
  const isValidNums = isNullishInRangeArray(-1, 10);
  expect(isValidNums([-1, 2, 3])).toStrictEqual(true);
  expect(isValidNums([-1, 11, 3])).toStrictEqual(false);
  expect(isValidNums([-1, null, 3])).toStrictEqual(false);
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
  }
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
})
