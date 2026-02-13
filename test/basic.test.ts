import { expect, test } from 'vitest';

import {
  hasKey,
  isBigInt,
  isBoolean,
  isBooleanArray,
  isDate,
  isDateArray,
  isFunction,
  isFunctionArray,
  isNonEmptyString,
  isNull,
  isNullableBoolean,
  isNullableBooleanArray,
  isNullableDate,
  isNullableDateArray,
  isNullableFunction,
  isNullableFunctionArray,
  isNullableNegativeInteger,
  isNullableNonEmptyString,
  isNullableNumber,
  isNullableNumberArray,
  isNullableObject,
  isNullableObjectArray,
  isNullablePositiveNumber,
  isNullableString,
  isNullableStringArray,
  isNullableSymbol,
  isNullableUnsignedIntegerArray,
  isNullish,
  isNullishBoolean,
  isNullishBooleanArray,
  isNullishDate,
  isNullishDateArray,
  isNullishFunction,
  isNullishFunctionArray,
  isNullishNonEmptyString,
  isNullishNumber,
  isNullishNumberArray,
  isNullishObject,
  isNullishObjectArray,
  isNullishPositiveNumber,
  isNullishString,
  isNullishStringArray,
  isNullishSymbol,
  isNumber,
  isNumberArray,
  isObject,
  isObjectArray,
  isOptionalBigInt,
  isOptionalBoolean,
  isOptionalBooleanArray,
  isOptionalDate,
  isOptionalDateArray,
  isOptionalFunction,
  isOptionalFunctionArray,
  isOptionalNonEmptyString,
  isOptionalNumber,
  isOptionalNumberArray,
  isOptionalObject,
  isOptionalObjectArray,
  isOptionalString,
  isOptionalStringArray,
  isOptionalSymbol,
  isString,
  isStringArray,
  isSymbol,
  isUndef,
  isUnsignedIntegerArray,
  isValidBoolean,
  isValidDate,
  isValidNumber,
} from '../src';

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
  expect(isOptionalNumberArray([1, 2, 3])).toStrictEqual(true);
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
  const D2 = new Date(),
    D3 = new Date();
  expect(isDateArray([D1, D2, D3])).toStrictEqual(true);
  expect(isDateArray([D1, D2, '2024-10-30T20:08:36.838Z'])).toStrictEqual(
    false,
  );
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
  const O2 = { val: 2 },
    O3 = { val: 3 };
  expect(isObjectArray([O1, O2, O3])).toStrictEqual(true);
  expect(isObjectArray([O1, O2, '2024-10-30T20:08:36.838Z'])).toStrictEqual(
    false,
  );
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
  const F2 = () => 2,
    F3 = () => 3;
  expect(isFunctionArray([F1, F2, F3])).toStrictEqual(true);
  expect(isFunctionArray([F1, F2, '2024-10-30T20:08:36.838Z'])).toStrictEqual(
    false,
  );
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
  expect(isNullableUnsignedIntegerArray([0, 1, undefined])).toStrictEqual(
    false,
  );
});

test('hasKey', () => {
  interface IUser {
    id: number;
    name?: string;
  }
  const someObject: IUser = { id: 1, name: undefined };

  // Basic test
  const t1 = hasKey(someObject, 'address');
  if (t1) {
    // const i = someObject.address; // type test, should be unknown
  }
  expect(t1).toStrictEqual(false);

  const t2 = hasKey(someObject, 'id', isNumber);
  if (t2) {
    // const i = someObject.id; // type test, should be number
  }
  expect(t2).toStrictEqual(true);

  const t3 = hasKey(someObject, 'name', isOptionalString);
  if (t3) {
    // const i = someObject.name; // type test, should be string | undefined
  }
  expect(t3).toStrictEqual(true);
});
