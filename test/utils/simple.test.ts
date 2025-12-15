import { expect, test } from 'vitest';

import {
  isNumberArray,
  isString,
  isNullableString,
} from '../../src';

import {
  nonNullable,
  makeOptional,
  makeNullable,
  makeNullish,
  parseBoolean,
  parseJson,
  transform,
} from '../../src/utils';

/******************************************************************************
                                 Tests
******************************************************************************/

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
