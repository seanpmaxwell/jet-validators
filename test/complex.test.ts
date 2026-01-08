import { expect, test } from 'vitest';

import {
  isInArray,
  isInRange,
  isKeyOf,
  isNullableKeyOf,
  isNullableValidString,
  isNullishInArray,
  isNullishInRange,
  isNullishInRangeArray,
  isNullishValidString,
  isNullishValueOf,
  isOptionalInArray,
  isOptionalInRange,
  isOptionalValidArray,
  isOptionalValidString,
  isValidArray,
  isValidString,
  isValueOf,
  type ValueOf,
} from '../src';

/******************************************************************************
                                 Tests
******************************************************************************/

/**
 * Test complex-validators.
 */
test('test complex validators', () => {
  // This will make the type '1' | '2' | '3' instead of just string
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
  expect(isOptionalNeg(0.01)).toStrictEqual(false);
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

test('Test isValidArray', () => {
  const validatorArray = ['a', 'b', 'c'] as const;

  const isValid = isValidArray(validatorArray);
  isValid(['a']); // true
  isValid([]); // true
  isValid(['a', 'a', 'b', 'c']); // true
  isValid(['a', 'b', 'c', 'd']); // false
  isValid('a'); // false, not an array

  // With optional and "min/maxLength" options
  const isValid2 = isOptionalValidArray(validatorArray, 1, 3);
  isValid2(['a']); // true
  isValid2([]); // false
  isValid2(['a', 'b', 'b', 'c']); // false
  isValid2(['b', 'b', 'b']); // true
  isValid2(undefined); // true
});

test('Test isValidString', () => {
  const lowerAlphaOnly = isValidString({
    minLength: 2,
    maxLength: 4,
    regex: /^[a-z]+$/,
  });
  expect(lowerAlphaOnly('ab')).toStrictEqual(true);
  expect(lowerAlphaOnly('abc')).toStrictEqual(true);
  expect(lowerAlphaOnly('abcd')).toStrictEqual(true);
  expect(lowerAlphaOnly('abcde')).toStrictEqual(false);
  expect(lowerAlphaOnly('a')).toStrictEqual(false);
  expect(lowerAlphaOnly('ABC')).toStrictEqual(false);
  expect(lowerAlphaOnly(123)).toStrictEqual(false);

  const emptyAllowedDespiteRegex = isValidString({
    minLength: 0,
    regex: /^[0-9]+$/,
  });
  expect(emptyAllowedDespiteRegex('')).toStrictEqual(true);
  expect(emptyAllowedDespiteRegex('1234')).toStrictEqual(true);
  expect(emptyAllowedDespiteRegex('abcd')).toStrictEqual(false);

  const exactLengthThree = isValidString({
    length: 3,
  });
  expect(exactLengthThree('abc')).toStrictEqual(true);
  expect(exactLengthThree('ab')).toStrictEqual(false);
  expect(exactLengthThree('abcd')).toStrictEqual(false);

  const optionalOnly = isOptionalValidString({
    minLength: 1,
  });
  expect(optionalOnly(undefined)).toStrictEqual(true);
  expect(optionalOnly(null)).toStrictEqual(false);
  expect(optionalOnly('a')).toStrictEqual(true);
  expect(optionalOnly('')).toStrictEqual(false);

  const nullableOnly = isNullableValidString({
    minLength: 1,
  });
  expect(nullableOnly(null)).toStrictEqual(true);
  expect(nullableOnly(undefined)).toStrictEqual(false);
  expect(nullableOnly('value')).toStrictEqual(true);

  const nullishValidator = isNullishValidString({
    minLength: 1,
  });
  expect(nullishValidator(null)).toStrictEqual(true);
  expect(nullishValidator(undefined)).toStrictEqual(true);
  expect(nullishValidator('')).toStrictEqual(false);

  const throwsValidator = isValidString({
    regex: /^foo$/,
    throws: true,
    errorMessage: (value, reason) =>
      `Invalid value "${value}" due to ${reason}`,
  });
  expect(throwsValidator('foo')).toStrictEqual(true);
  expect(() => throwsValidator('bar')).toThrowError(
    'Invalid value "bar" due to regex',
  );
  expect(() => throwsValidator(undefined)).toThrowError(
    'Invalid value "undefined" due to optional',
  );

  // **** Type validation **** //

  const typeValidator = isOptionalValidString({
    regex: /^foo$/,
  });

  const i = 'bar' as unknown;
  if (typeValidator(i)) {
    // const j: number | undefined = i; // should cause type error
  }

  const typeValidator2 = isNullishValidString({
    regex: /^foo$/,
  });

  const k = 'bar' as unknown;
  if (typeValidator2(k)) {
    const l = k;
  }

  const typeValidator3 = isNullishValidString<'foo'>({
    regex: /^foo$/,
  });

  const m = 'bar' as unknown;
  if (typeValidator3(m)) {
    const n = m;
  }
});
