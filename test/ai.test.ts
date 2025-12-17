// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { describe, expect, test } from 'vitest';

import * as RootExports from '../src';
import * as UtilExports from '../src/utils';

const ROOT_FUNCTION_EXPORTS = [
  'isUndef',
  'isNull',
  'isNullish',
  'isBoolean',
  'isOptionalBoolean',
  'isNullableBoolean',
  'isNullishBoolean',
  'isBooleanArray',
  'isOptionalBooleanArray',
  'isNullableBooleanArray',
  'isNullishBooleanArray',
  'isValidBoolean',
  'isOptionalValidBoolean',
  'isNullableValidBoolean',
  'isNullishValidBoolean',
  'isValidBooleanArray',
  'isOptionalValidBooleanArray',
  'isNullableValidBooleanArray',
  'isNullishValidBooleanArray',
  'isNumber',
  'isOptionalNumber',
  'isNullableNumber',
  'isNullishNumber',
  'isNumberArray',
  'isOptionalNumberArray',
  'isNullableNumberArray',
  'isNullishNumberArray',
  'isPositiveNumber',
  'isOptionalPositiveNumber',
  'isNullablePositiveNumber',
  'isNullishPositiveNumber',
  'isPositiveNumberArray',
  'isOptionalPositiveNumberArray',
  'isNullablePositiveNumberArray',
  'isNullishPositiveNumberArray',
  'isNegativeNumber',
  'isOptionalNegativeNumber',
  'isNullableNegativeNumber',
  'isNullishNegativeNumber',
  'isNegativeNumberArray',
  'isOptionalNegativeNumberArray',
  'isNullableNegativeNumberArray',
  'isNullishNegativeNumberArray',
  'isUnsignedNumber',
  'isOptionalUnsignedNumber',
  'isNullableUnsignedNumber',
  'isNullishUnsignedNumber',
  'isUnsignedNumberArray',
  'isOptionalUnsignedNumberArray',
  'isNullableUnsignedNumberArray',
  'isNullishUnsignedNumberArray',
  'isInteger',
  'isOptionalInteger',
  'isNullableInteger',
  'isNullishInteger',
  'isIntegerArray',
  'isOptionalIntegerArray',
  'isNullableIntegerArray',
  'isNullishIntegerArray',
  'isPositiveInteger',
  'isOptionalPositiveInteger',
  'isNullablePositiveInteger',
  'isNullishPositiveInteger',
  'isPositiveIntegerArray',
  'isOptionalPositiveIntegerArray',
  'isNullablePositiveIntegerArray',
  'isNullishPositiveIntegerArray',
  'isNegativeInteger',
  'isOptionalNegativeInteger',
  'isNullableNegativeInteger',
  'isNullishNegativeInteger',
  'isNegativeIntegerArray',
  'isOptionalNegativeIntegerArray',
  'isNullableNegativeIntegerArray',
  'isNullishNegativeIntegerArray',
  'isUnsignedInteger',
  'isOptionalUnsignedInteger',
  'isNullableUnsignedInteger',
  'isNullishUnsignedInteger',
  'isUnsignedIntegerArray',
  'isOptionalUnsignedIntegerArray',
  'isNullableUnsignedIntegerArray',
  'isNullishUnsignedIntegerArray',
  'isBigInt',
  'isOptionalBigInt',
  'isNullableBigInt',
  'isNullishBigInt',
  'isBigIntArray',
  'isOptionalBigIntArray',
  'isNullableBigIntArray',
  'isNullishBigIntArr',
  'isValidNumber',
  'isOptionalValidNumber',
  'isNullableValidNumber',
  'isNullishValidNumber',
  'isValidNumberArray',
  'isOptionalValidNumberArray',
  'isNullableValidNumberArray',
  'isNishValidNumArr',
  'isString',
  'isOptionalString',
  'isNullableString',
  'isNullishString',
  'isStringArray',
  'isOptionalStringArray',
  'isNullableStringArray',
  'isNullishStringArray',
  'isNonEmptyString',
  'isOptionalNonEmptyString',
  'isNullableNonEmptyString',
  'isNullishNonEmptyString',
  'isNonEmptyStringArray',
  'isOptionalNonEmptyStringArray',
  'isNullableNonEmptyStringArray',
  'isNullishNonEmptyStringArray',
  'isSymbol',
  'isOptionalSymbol',
  'isNullableSymbol',
  'isNullishSymbol',
  'isSymbolArray',
  'isOptionalSymbolArray',
  'isNullableSymbolArray',
  'isNullishSymbolArray',
  'isDate',
  'isOptionalDate',
  'isNullableDate',
  'isNullishDate',
  'isDateArray',
  'isOptionalDateArray',
  'isNullableDateArray',
  'isNullishDateArray',
  'isValidDate',
  'isOptionalValidDate',
  'isNullableValidDate',
  'isNullishValidDate',
  'isValidDateArray',
  'isOptionalValidDateArray',
  'isNullableValidDateArray',
  'isNullishValidDateArray',
  'isObject',
  'isOptionalObject',
  'isNullableObject',
  'isNullishObject',
  'isObjectArray',
  'isOptionalObjectArray',
  'isNullableObjectArray',
  'isNullishObjectArray',
  'isFunction',
  'isOptionalFunction',
  'isNullableFunction',
  'isNullishFunction',
  'isFunctionArray',
  'isOptionalFunctionArray',
  'isNullableFunctionArray',
  'isNullishFunctionArray',
  'isInArray',
  'isOptionalInArray',
  'isNullableInArray',
  'isNullishInArray',
  'isInRange',
  'isOptionalInRange',
  'isNullableInRange',
  'isNullishInRange',
  'isInRangeArray',
  'isOptionalInRangeArray',
  'isNullableInRangeArray',
  'isNullishInRangeArray',
  'isKeyOf',
  'isOptionalKeyOf',
  'isNullableKeyOf',
  'isNullishKeyOf',
  'isValueOf',
  'isOptionalValueOf',
  'isNullableValueOf',
  'isNullishValueOf',
] as const;

const UTIL_FUNCTION_EXPORTS = [
  'nonNullable',
  'makeOptional',
  'makeNullable',
  'makeNullish',
  'transform',
  'parseBoolean',
  'parseOptionalBoolean',
  'parseNullableBoolean',
  'parseNullishBoolean',
  'parseJson',
  'parseOptionalJson',
  'parseNullableJson',
  'parseNullishJson',
  'parseObject',
  'parseOptionalObject',
  'parseNullableObject',
  'parseNullishObject',
  'parseObjectArray',
  'parseOptionalObjectArray',
  'parseNullableObjectArray',
  'parseNullishObjectArray',
  'looseParseObject',
  'looseParseOptionalObject',
  'looseParseNullableObject',
  'looseParseNullishObject',
  'looseParseObjectArray',
  'looseParseOptionalObjectArray',
  'looseParseNullableObjectArray',
  'looseParseNullishObjectArray',
  'strictParseObject',
  'strictParseOptionalObject',
  'strictParseNullableObject',
  'strictParseNullishObject',
  'strictParseObjectArray',
  'strictParseOptionalObjectArray',
  'strictParseNullableObjectArray',
  'strictParseNullishObjectArray',
  'testObject',
  'testOptionalObject',
  'testNullableObject',
  'testNullishObject',
  'testObjectArray',
  'testOptionalObjectArray',
  'testNullableObjectArray',
  'testNullishObjectArray',
  'looseTestObject',
  'looseTestOptionalObject',
  'looseTestNullableObject',
  'looseTestNullishObject',
  'looseTestObjectArray',
  'looseTestOptionalObjectArray',
  'looseTestNullableObjectArray',
  'looseTestNullishObjectArray',
  'strictTestObject',
  'strictTestOptionalObject',
  'strictTestNullableObject',
  'strictTestNullishObject',
  'strictTestObjectArray',
  'strictTestOptionalObjectArray',
  'strictTestNullableObjectArray',
  'strictTestNullishObjectArray',
] as const;

type RootFnName = (typeof ROOT_FUNCTION_EXPORTS)[number];
type UtilFnName = (typeof UTIL_FUNCTION_EXPORTS)[number];

const rootFns = RootExports as Record<string, unknown>;
const utilFns = UtilExports as Record<string, unknown>;

const testedRootFns = new Set<RootFnName>();
const testedUtilFns = new Set<UtilFnName>();

function getRootFunction<T extends RootFnName>(name: T) {
  const fn = rootFns[name];
  if (typeof fn !== 'function') {
    throw new Error(
      `Expected ${name} to be exported as a function from src/index.ts.`,
    );
  }
  testedRootFns.add(name);
  return fn as (...args: never[]) => unknown;
}

function getUtilFunction<T extends UtilFnName>(name: T) {
  const fn = utilFns[name];
  if (typeof fn !== 'function') {
    throw new Error(
      `Expected ${name} to be exported as a function from src/utils/index.ts.`,
    );
  }
  testedUtilFns.add(name);
  return fn as (...args: never[]) => unknown;
}

describe('primitive nullish validators', () => {
  test('isUndef/isNull/isNullish', () => {
    const isUndef = getRootFunction('isUndef');
    const isNull = getRootFunction('isNull');
    const isNullish = getRootFunction('isNullish');

    expect(isUndef(undefined)).toBe(true);
    expect(isUndef(null)).toBe(false);

    expect(isNull(null)).toBe(true);
    expect(isNull(undefined)).toBe(false);

    expect(isNullish(null)).toBe(true);
    expect(isNullish(undefined)).toBe(true);
    expect(isNullish(0)).toBe(false);
  });
});

type ValidatorScenario = {
  base: RootFnName;
  optional: RootFnName;
  nullable: RootFnName;
  nullish: RootFnName;
  array: RootFnName;
  optionalArray: RootFnName;
  nullableArray: RootFnName;
  nullishArray: RootFnName;
  valid: unknown[];
  invalid: unknown[];
};

const symbolSample = Symbol('sym');
const dateSample = new Date('2024-01-01T00:00:00Z');
const fnSample = () => true;

const validatorScenarios: ValidatorScenario[] = [
  {
    base: 'isBoolean',
    optional: 'isOptionalBoolean',
    nullable: 'isNullableBoolean',
    nullish: 'isNullishBoolean',
    array: 'isBooleanArray',
    optionalArray: 'isOptionalBooleanArray',
    nullableArray: 'isNullableBooleanArray',
    nullishArray: 'isNullishBooleanArray',
    valid: [true, false],
    invalid: ['true', 1, null],
  },
  {
    base: 'isValidBoolean',
    optional: 'isOptionalValidBoolean',
    nullable: 'isNullableValidBoolean',
    nullish: 'isNullishValidBoolean',
    array: 'isValidBooleanArray',
    optionalArray: 'isOptionalValidBooleanArray',
    nullableArray: 'isNullableValidBooleanArray',
    nullishArray: 'isNullishValidBooleanArray',
    valid: [true, false, 'yes', 'No', '1', '0', 0, 1],
    invalid: ['test', 2],
  },
  {
    base: 'isNumber',
    optional: 'isOptionalNumber',
    nullable: 'isNullableNumber',
    nullish: 'isNullishNumber',
    array: 'isNumberArray',
    optionalArray: 'isOptionalNumberArray',
    nullableArray: 'isNullableNumberArray',
    nullishArray: 'isNullishNumberArray',
    valid: [0, 12.3],
    invalid: ['1', NaN, null],
  },
  {
    base: 'isPositiveNumber',
    optional: 'isOptionalPositiveNumber',
    nullable: 'isNullablePositiveNumber',
    nullish: 'isNullishPositiveNumber',
    array: 'isPositiveNumberArray',
    optionalArray: 'isOptionalPositiveNumberArray',
    nullableArray: 'isNullablePositiveNumberArray',
    nullishArray: 'isNullishPositiveNumberArray',
    valid: [1, 3.5],
    invalid: [-1, 0],
  },
  {
    base: 'isNegativeNumber',
    optional: 'isOptionalNegativeNumber',
    nullable: 'isNullableNegativeNumber',
    nullish: 'isNullishNegativeNumber',
    array: 'isNegativeNumberArray',
    optionalArray: 'isOptionalNegativeNumberArray',
    nullableArray: 'isNullableNegativeNumberArray',
    nullishArray: 'isNullishNegativeNumberArray',
    valid: [-1, -3.5],
    invalid: [0, 1],
  },
  {
    base: 'isUnsignedNumber',
    optional: 'isOptionalUnsignedNumber',
    nullable: 'isNullableUnsignedNumber',
    nullish: 'isNullishUnsignedNumber',
    array: 'isUnsignedNumberArray',
    optionalArray: 'isOptionalUnsignedNumberArray',
    nullableArray: 'isNullableUnsignedNumberArray',
    nullishArray: 'isNullishUnsignedNumberArray',
    valid: [0, 5],
    invalid: [-1],
  },
  {
    base: 'isInteger',
    optional: 'isOptionalInteger',
    nullable: 'isNullableInteger',
    nullish: 'isNullishInteger',
    array: 'isIntegerArray',
    optionalArray: 'isOptionalIntegerArray',
    nullableArray: 'isNullableIntegerArray',
    nullishArray: 'isNullishIntegerArray',
    valid: [0, 3],
    invalid: [1.5, '3'],
  },
  {
    base: 'isPositiveInteger',
    optional: 'isOptionalPositiveInteger',
    nullable: 'isNullablePositiveInteger',
    nullish: 'isNullishPositiveInteger',
    array: 'isPositiveIntegerArray',
    optionalArray: 'isOptionalPositiveIntegerArray',
    nullableArray: 'isNullablePositiveIntegerArray',
    nullishArray: 'isNullishPositiveIntegerArray',
    valid: [1, 4],
    invalid: [0, -1],
  },
  {
    base: 'isNegativeInteger',
    optional: 'isOptionalNegativeInteger',
    nullable: 'isNullableNegativeInteger',
    nullish: 'isNullishNegativeInteger',
    array: 'isNegativeIntegerArray',
    optionalArray: 'isOptionalNegativeIntegerArray',
    nullableArray: 'isNullableNegativeIntegerArray',
    nullishArray: 'isNullishNegativeIntegerArray',
    valid: [-1, -4],
    invalid: [0, 1],
  },
  {
    base: 'isUnsignedInteger',
    optional: 'isOptionalUnsignedInteger',
    nullable: 'isNullableUnsignedInteger',
    nullish: 'isNullishUnsignedInteger',
    array: 'isUnsignedIntegerArray',
    optionalArray: 'isOptionalUnsignedIntegerArray',
    nullableArray: 'isNullableUnsignedIntegerArray',
    nullishArray: 'isNullishUnsignedIntegerArray',
    valid: [0, 5],
    invalid: [-1, 1.5],
  },
  {
    base: 'isBigInt',
    optional: 'isOptionalBigInt',
    nullable: 'isNullableBigInt',
    nullish: 'isNullishBigInt',
    array: 'isBigIntArray',
    optionalArray: 'isOptionalBigIntArray',
    nullableArray: 'isNullableBigIntArray',
    nullishArray: 'isNullishBigIntArr',
    valid: [1n, -5n],
    invalid: [1, '1'],
  },
  {
    base: 'isValidNumber',
    optional: 'isOptionalValidNumber',
    nullable: 'isNullableValidNumber',
    nullish: 'isNullishValidNumber',
    array: 'isValidNumberArray',
    optionalArray: 'isOptionalValidNumberArray',
    nullableArray: 'isNullableValidNumberArray',
    nullishArray: 'isNishValidNumArr',
    valid: ['1', '3.4', true, 2],
    invalid: ['abc', { bad: true }],
  },
  {
    base: 'isString',
    optional: 'isOptionalString',
    nullable: 'isNullableString',
    nullish: 'isNullishString',
    array: 'isStringArray',
    optionalArray: 'isOptionalStringArray',
    nullableArray: 'isNullableStringArray',
    nullishArray: 'isNullishStringArray',
    valid: ['hello'],
    invalid: [1, null],
  },
  {
    base: 'isNonEmptyString',
    optional: 'isOptionalNonEmptyString',
    nullable: 'isNullableNonEmptyString',
    nullish: 'isNullishNonEmptyString',
    array: 'isNonEmptyStringArray',
    optionalArray: 'isOptionalNonEmptyStringArray',
    nullableArray: 'isNullableNonEmptyStringArray',
    nullishArray: 'isNullishNonEmptyStringArray',
    valid: ['abc'],
    invalid: ['', null],
  },
  {
    base: 'isSymbol',
    optional: 'isOptionalSymbol',
    nullable: 'isNullableSymbol',
    nullish: 'isNullishSymbol',
    array: 'isSymbolArray',
    optionalArray: 'isOptionalSymbolArray',
    nullableArray: 'isNullableSymbolArray',
    nullishArray: 'isNullishSymbolArray',
    valid: [symbolSample],
    invalid: ['sym', 1],
  },
  {
    base: 'isDate',
    optional: 'isOptionalDate',
    nullable: 'isNullableDate',
    nullish: 'isNullishDate',
    array: 'isDateArray',
    optionalArray: 'isOptionalDateArray',
    nullableArray: 'isNullableDateArray',
    nullishArray: 'isNullishDateArray',
    valid: [dateSample],
    invalid: ['2024-01-01', new Date('invalid')],
  },
  {
    base: 'isValidDate',
    optional: 'isOptionalValidDate',
    nullable: 'isNullableValidDate',
    nullish: 'isNullishValidDate',
    array: 'isValidDateArray',
    optionalArray: 'isOptionalValidDateArray',
    nullableArray: 'isNullableValidDateArray',
    nullishArray: 'isNullishValidDateArray',
    valid: ['2024-01-01', dateSample, 0],
    invalid: ['bad-date', symbolSample],
  },
  {
    base: 'isObject',
    optional: 'isOptionalObject',
    nullable: 'isNullableObject',
    nullish: 'isNullishObject',
    array: 'isObjectArray',
    optionalArray: 'isOptionalObjectArray',
    nullableArray: 'isNullableObjectArray',
    nullishArray: 'isNullishObjectArray',
    valid: [{ id: 1 }],
    invalid: ['not-object', 5],
  },
  {
    base: 'isFunction',
    optional: 'isOptionalFunction',
    nullable: 'isNullableFunction',
    nullish: 'isNullishFunction',
    array: 'isFunctionArray',
    optionalArray: 'isOptionalFunctionArray',
    nullableArray: 'isNullableFunctionArray',
    nullishArray: 'isNullishFunctionArray',
    valid: [fnSample],
    invalid: [{}, 'fn'],
  },
];

describe('root validator behaviors', () => {
  validatorScenarios.forEach((scenario) => {
    test(`${scenario.base} and related modifiers`, () => {
      const baseFn = getRootFunction(scenario.base);
      scenario.valid.forEach((value) => expect(baseFn(value)).toBe(true));
      scenario.invalid.forEach((value) => expect(baseFn(value)).toBe(false));
      if (scenario.base === 'isObject') {
        expect(baseFn(null)).toBe(false);
      }

      const optionalFn = getRootFunction(scenario.optional);
      expect(optionalFn(undefined)).toBe(true);
      expect(optionalFn(scenario.invalid[0])).toBe(false);

      const nullableFn = getRootFunction(scenario.nullable);
      expect(nullableFn(null)).toBe(true);
      expect(nullableFn(scenario.invalid[0])).toBe(false);

      const nullishFn = getRootFunction(scenario.nullish);
      expect(nullishFn(null)).toBe(true);
      expect(nullishFn(undefined)).toBe(true);
      expect(nullishFn(scenario.invalid[0])).toBe(false);

      const arrayFn = getRootFunction(scenario.array);
      expect(arrayFn([scenario.valid[0], scenario.valid[0]])).toBe(true);
      expect(arrayFn([scenario.valid[0], scenario.invalid[0]])).toBe(false);
      expect(arrayFn(scenario.valid[0])).toBe(false);

      const optionalArrayFn = getRootFunction(scenario.optionalArray);
      expect(optionalArrayFn(undefined)).toBe(true);
      expect(optionalArrayFn([scenario.valid[0]])).toBe(true);

      const nullableArrayFn = getRootFunction(scenario.nullableArray);
      expect(nullableArrayFn(null)).toBe(true);
      expect(nullableArrayFn([scenario.valid[0]])).toBe(true);

      const nullishArrayFn = getRootFunction(scenario.nullishArray);
      expect(nullishArrayFn(undefined)).toBe(true);
      expect(nullishArrayFn(null)).toBe(true);
      expect(nullishArrayFn([scenario.valid[0]])).toBe(true);
      expect(nullishArrayFn([scenario.valid[0], scenario.invalid[0]])).toBe(
        false,
      );
    });
  });
});

describe('complex root validators', () => {
  test('isInArray variations respect optionality rules', () => {
    const colors = ['red', 'blue'] as const;
    const base = getRootFunction('isInArray')(colors);
    expect(base('red')).toBe(true);
    expect(base('green')).toBe(false);

    const optional = getRootFunction('isOptionalInArray')(colors);
    expect(optional(undefined)).toBe(true);
    expect(optional('blue')).toBe(true);
    expect(optional('pink')).toBe(false);

    const nullable = getRootFunction('isNullableInArray')(colors);
    expect(nullable(null)).toBe(true);
    expect(nullable('red')).toBe(true);
    expect(nullable('pink')).toBe(false);

    const nullish = getRootFunction('isNullishInArray')(colors);
    expect(nullish(null)).toBe(true);
    expect(nullish(undefined)).toBe(true);
    expect(nullish('green')).toBe(false);
  });

  test('isInRange family enforces numeric boundaries', () => {
    const validArgs = [2, 3, '4', '5'];
    const invalidArgs = ['bad', 6, -1];
    const build = (name: RootFnName) => getRootFunction(name)([1], [5]);

    const base = build('isInRange');
    validArgs.forEach((arg) => expect(base(arg)).toBe(true));
    invalidArgs.forEach((arg) => expect(base(arg)).toBe(false));

    const optional = build('isOptionalInRange');
    expect(optional(undefined)).toBe(true);
    expect(optional(2)).toBe(true);

    const nullable = build('isNullableInRange');
    expect(nullable(null)).toBe(true);
    expect(nullable(3)).toBe(true);

    const nullish = build('isNullishInRange');
    expect(nullish(null)).toBe(true);
    expect(nullish(undefined)).toBe(true);
    expect(nullish(10)).toBe(false);

    const array = build('isInRangeArray');
    expect(array([2, 4])).toBe(true);
    expect(array([2, 6])).toBe(false);
    expect(array(2)).toBe(false);

    const optionalArray = build('isOptionalInRangeArray');
    expect(optionalArray(undefined)).toBe(true);
    expect(optionalArray([2])).toBe(true);

    const nullableArray = build('isNullableInRangeArray');
    expect(nullableArray(null)).toBe(true);
    expect(nullableArray([2])).toBe(true);

    const nullishArray = build('isNullishInRangeArray');
    expect(nullishArray(null)).toBe(true);
    expect(nullishArray(undefined)).toBe(true);
    expect(nullishArray([2, 8])).toBe(false);
  });

  test('isKeyOf variations enforce object keys', () => {
    const lookup = { foo: 1, bar: 2 } as const;

    const base = getRootFunction('isKeyOf')(lookup);
    expect(base('foo')).toBe(true);
    expect(base('baz')).toBe(false);

    const optional = getRootFunction('isOptionalKeyOf')(lookup);
    expect(optional(undefined)).toBe(true);
    expect(optional('bar')).toBe(true);
    expect(optional('nope')).toBe(false);

    const nullable = getRootFunction('isNullableKeyOf')(lookup);
    expect(nullable(null)).toBe(true);
    expect(nullable('foo')).toBe(true);
    expect(nullable('nope')).toBe(false);

    const nullish = getRootFunction('isNullishKeyOf')(lookup);
    expect(nullish(null)).toBe(true);
    expect(nullish(undefined)).toBe(true);
    expect(nullish('nope')).toBe(false);
  });

  test('isValueOf variations enforce object values', () => {
    const lookup = { foo: 'a', bar: 'b' } as const;

    const base = getRootFunction('isValueOf')(lookup);
    expect(base('a')).toBe(true);
    expect(base('c')).toBe(false);

    const optional = getRootFunction('isOptionalValueOf')(lookup);
    expect(optional(undefined)).toBe(true);
    expect(optional('b')).toBe(true);

    const nullable = getRootFunction('isNullableValueOf')(lookup);
    expect(nullable(null)).toBe(true);
    expect(nullable('a')).toBe(true);

    const nullish = getRootFunction('isNullishValueOf')(lookup);
    expect(nullish(undefined)).toBe(true);
    expect(nullish(null)).toBe(true);
    expect(nullish('x')).toBe(false);
  });
});

describe('utility simple helpers', () => {
  test('nonNullable removes nullish allowance', () => {
    const base = (value: unknown): value is number | null | undefined =>
      value === 1 || value === null || value === undefined;
    const wrapped = getUtilFunction('nonNullable')(base);
    expect(wrapped(1)).toBe(true);
    expect(wrapped(null)).toBe(false);
    expect(wrapped(undefined)).toBe(false);
  });

  test('makeOptional, makeNullable, makeNullish extend validators', () => {
    const isNumber = (value: unknown): value is number =>
      typeof value === 'number';
    const optional = getUtilFunction('makeOptional')(isNumber);
    const nullable = getUtilFunction('makeNullable')(isNumber);
    const nullish = getUtilFunction('makeNullish')(isNumber);

    expect(optional(undefined)).toBe(true);
    expect(optional('1')).toBe(false);

    expect(nullable(null)).toBe(true);
    expect(nullable('1')).toBe(false);

    expect(nullish(undefined)).toBe(true);
    expect(nullish(null)).toBe(true);
    expect(nullish('1')).toBe(false);
  });

  test('transform mutates the checked value before validation', () => {
    const transform = getUtilFunction(
      'transform',
    ) as typeof UtilExports.transform;
    const validator = transform(
      (arg: unknown) => Number(arg),
      (arg: unknown): arg is number => {
        return typeof arg === 'number' && arg > 0;
      },
    );
    const payload = { value: '5' };
    expect(
      validator(payload.value, (newVal) => {
        payload.value = newVal;
      }),
    ).toBe(true);
    expect(payload.value).toBe(5);
    expect(validator.isTransformFunction).toBe(true);
    expect(validator('bad')).toBe(false);
  });
});

describe('parse boolean helpers', () => {
  test('parseBoolean variations', () => {
    const parseBoolean = getUtilFunction('parseBoolean');
    const parseOptionalBoolean = getUtilFunction('parseOptionalBoolean');
    const parseNullableBoolean = getUtilFunction('parseNullableBoolean');
    const parseNullishBoolean = getUtilFunction('parseNullishBoolean');

    expect(parseBoolean(true)).toBe(true);
    expect(parseBoolean('yes')).toBe(true);
    expect(() => parseBoolean('bad')).toThrowError();

    expect(parseOptionalBoolean(undefined)).toBeUndefined();
    expect(parseOptionalBoolean('no')).toBe(false);
    expect(() => parseOptionalBoolean('bad')).toThrowError();

    expect(parseNullableBoolean(null)).toBeNull();
    expect(parseNullableBoolean(1)).toBe(true);
    expect(() => parseNullableBoolean('bad')).toThrowError();

    expect(parseNullishBoolean(null)).toBeNull();
    expect(parseNullishBoolean(undefined)).toBeUndefined();
    expect(parseNullishBoolean('1')).toBe(true);
    expect(() => parseNullishBoolean('bad')).toThrowError();
  });
});

describe('parse JSON helpers', () => {
  test('parseJson variations', () => {
    const parseJson = getUtilFunction('parseJson');
    const parseOptionalJson = getUtilFunction('parseOptionalJson');
    const parseNullableJson = getUtilFunction('parseNullableJson');
    const parseNullishJson = getUtilFunction('parseNullishJson');

    expect(parseJson('{"a":1}')).toStrictEqual({ a: 1 });
    expect(() => parseJson(1)).toThrowError();

    expect(parseOptionalJson(undefined)).toBeUndefined();
    expect(parseOptionalJson('{"b":2}')).toStrictEqual({ b: 2 });
    expect(() => parseOptionalJson(1)).toThrowError();

    expect(parseNullableJson(null)).toBeNull();
    expect(parseNullableJson('{"c":3}')).toStrictEqual({ c: 3 });
    expect(() => parseNullableJson(2)).toThrowError();

    expect(parseNullishJson(undefined)).toBeUndefined();
    expect(parseNullishJson(null)).toBeNull();
    expect(parseNullishJson('{"d":4}')).toStrictEqual({ d: 4 });
    expect(() => parseNullishJson(3)).toThrowError();
  });
});

type ParseVariant = {
  name: UtilFnName;
  allowsUndefined: boolean;
  allowsNull: boolean;
  isArray: boolean;
  safety: 'default' | 'loose' | 'strict';
  keepExtras: boolean;
  type: 'parse' | 'test';
};

const modeConfigs = [
  {
    suffix: 'Object',
    allowsUndefined: false,
    allowsNull: false,
    isArray: false,
  },
  {
    suffix: 'OptionalObject',
    allowsUndefined: true,
    allowsNull: false,
    isArray: false,
  },
  {
    suffix: 'NullableObject',
    allowsUndefined: false,
    allowsNull: true,
    isArray: false,
  },
  {
    suffix: 'NullishObject',
    allowsUndefined: true,
    allowsNull: true,
    isArray: false,
  },
  {
    suffix: 'ObjectArray',
    allowsUndefined: false,
    allowsNull: false,
    isArray: true,
  },
  {
    suffix: 'OptionalObjectArray',
    allowsUndefined: true,
    allowsNull: false,
    isArray: true,
  },
  {
    suffix: 'NullableObjectArray',
    allowsUndefined: false,
    allowsNull: true,
    isArray: true,
  },
  {
    suffix: 'NullishObjectArray',
    allowsUndefined: true,
    allowsNull: true,
    isArray: true,
  },
] as const;

const safetyConfigs = [
  { prefix: '', safety: 'default', keepExtras: false },
  { prefix: 'loose', safety: 'loose', keepExtras: true },
  { prefix: 'strict', safety: 'strict', keepExtras: false },
] as const;

const parseVariants: ParseVariant[] = [];
const testVariants: ParseVariant[] = [];

for (const { prefix, safety, keepExtras } of safetyConfigs) {
  for (const mode of modeConfigs) {
    const parseName =
      `${prefix}${prefix ? 'Parse' : 'parse'}${mode.suffix}` as UtilFnName;
    parseVariants.push({
      name: parseName,
      allowsUndefined: mode.allowsUndefined,
      allowsNull: mode.allowsNull,
      isArray: mode.isArray,
      safety,
      keepExtras,
      type: 'parse',
    });
    const testName =
      `${prefix}${prefix ? 'Test' : 'test'}${mode.suffix}` as UtilFnName;
    testVariants.push({
      name: testName,
      allowsUndefined: mode.allowsUndefined,
      allowsNull: mode.allowsNull,
      isArray: mode.isArray,
      safety,
      keepExtras,
      type: 'test',
    });
  }
}

const createValidUser = () => ({
  id: 10,
  name: 'Jet',
  nested: { active: true },
  extra: 'remove-me',
});

const createSanitizedUser = () => ({
  id: 10,
  name: 'Jet',
  nested: { active: true },
});

const createInvalidUser = () => ({
  ...createSanitizedUser(),
  id: 'nope',
});

const userSchema = {
  id: getRootFunction('isNumber'),
  name: getRootFunction('isString'),
  nested: {
    active: getRootFunction('isBoolean'),
  },
};

const expectOptionality = (
  fn: (arg: unknown) => unknown,
  allowsUndefined: boolean,
  allowsNull: boolean,
  type: 'parse' | 'test',
) => {
  const undefinedResult = fn(undefined);
  if (allowsUndefined) {
    if (type === 'parse') {
      expect(undefinedResult).toBeUndefined();
    } else {
      expect(undefinedResult).toBe(true);
    }
  } else {
    expect(undefinedResult).toBe(false);
  }

  const nullResult = fn(null);
  if (allowsNull) {
    if (type === 'parse') {
      expect(nullResult).toBeNull();
    } else {
      expect(nullResult).toBe(true);
    }
  } else {
    expect(nullResult).toBe(false);
  }
};

describe('parseObject variants', () => {
  parseVariants.forEach((variant) => {
    test(`${variant.name} handles optionality, arrays, and safety`, () => {
      const factory = getUtilFunction(
        variant.name,
      ) as typeof UtilExports.parseObject;
      const parser = factory(userSchema);

      expectOptionality(
        parser,
        variant.allowsUndefined,
        variant.allowsNull,
        'parse',
      );

      const validInput = variant.isArray
        ? [createValidUser(), createValidUser()]
        : createValidUser();
      const sanitizedInput = variant.isArray
        ? [createSanitizedUser(), createSanitizedUser()]
        : createSanitizedUser();
      const invalidInput = variant.isArray
        ? [createValidUser(), createInvalidUser()]
        : createInvalidUser();

      const result = parser(validInput);
      if (variant.safety === 'strict') {
        expect(result).toBe(false);
      } else {
        expect(result).not.toBe(false);
        if (!variant.keepExtras) {
          if (variant.isArray) {
            (result as Record<string, unknown>[]).forEach((item) => {
              expect(item).toStrictEqual(createSanitizedUser());
            });
          } else {
            expect(result).toStrictEqual(createSanitizedUser());
          }
        } else {
          if (variant.isArray) {
            (result as Record<string, unknown>[]).forEach((item) => {
              expect(item.extra).toBe('remove-me');
            });
          } else {
            expect((result as Record<string, unknown>).extra).toBe('remove-me');
          }
        }
      }

      const strictSafeInput = parser(sanitizedInput);
      expect(strictSafeInput).not.toBe(false);

      expect(parser(invalidInput)).toBe(false);
      if (variant.isArray) {
        expect(parser(createValidUser())).toBe(false);
      } else {
        expect(parser([createValidUser()])).toBe(false);
      }
    });
  });
});

describe('testObject variants', () => {
  testVariants.forEach((variant) => {
    test(`${variant.name} mirrors parse behavior`, () => {
      const factory = getUtilFunction(
        variant.name,
      ) as typeof UtilExports.testObject;
      const tester = factory(userSchema);

      expectOptionality(
        tester,
        variant.allowsUndefined,
        variant.allowsNull,
        'test',
      );

      const validInput = variant.isArray
        ? [createValidUser(), createSanitizedUser()]
        : createValidUser();
      const sanitizedInput = variant.isArray
        ? [createSanitizedUser(), createSanitizedUser()]
        : createSanitizedUser();
      const invalidInput = variant.isArray
        ? [createValidUser(), createInvalidUser()]
        : createInvalidUser();

      expect(tester(invalidInput)).toBe(false);
      if (variant.isArray) {
        expect(tester(createValidUser())).toBe(false);
      } else {
        expect(tester([createValidUser()])).toBe(false);
      }

      if (variant.safety === 'strict') {
        expect(tester(validInput)).toBe(false);
        expect(tester(sanitizedInput)).toBe(true);
      } else {
        expect(tester(validInput)).toBe(true);
        expect(tester(sanitizedInput)).toBe(true);
      }
    });
  });
});

test('all root validators were asserted', () => {
  expect(Array.from(testedRootFns).sort()).toStrictEqual(
    [...ROOT_FUNCTION_EXPORTS].sort(),
  );
});

test('all utility helpers were asserted', () => {
  expect(Array.from(testedUtilFns).sort()).toStrictEqual(
    [...UTIL_FUNCTION_EXPORTS].sort(),
  );
});
