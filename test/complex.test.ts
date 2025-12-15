import { expect, test } from 'vitest';

import {

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
} from '../src';

/******************************************************************************
                                 Tests
******************************************************************************/

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
