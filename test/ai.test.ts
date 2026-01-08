import { describe, expect, test } from 'vitest';

import * as validators from '../src';
import * as utils from '../src/utils';

type AnyFn = (...args: unknown[]) => unknown;
type ValidatorFn = (arg: unknown) => boolean;
type ModuleExports = Record<string, unknown>;

const validatorExports = validators as ModuleExports;
const utilsExports = utils as ModuleExports;

const expectFunctionExport = (
  moduleExports: ModuleExports,
  name: string,
): AnyFn => {
  const fn = moduleExports[name];
  expect(fn, `${name} should be exported`).toBeTypeOf('function');
  return fn as AnyFn;
};

const expectValidatorResults = (
  moduleExports: ModuleExports,
  name: string,
  passValues: unknown[],
  failValues: unknown[],
) => {
  const fn = expectFunctionExport(
    moduleExports,
    name,
  ) as unknown as ValidatorFn;
  passValues.forEach((value) => {
    expect(fn(value)).toBe(true);
  });
  failValues.forEach((value) => {
    expect(fn(value)).toBe(false);
  });
};

describe('basic nullish helpers', () => {
  test('isUndef', () => {
    expectValidatorResults(
      validatorExports,
      'isUndef',
      [undefined],
      [null, 0, '', false],
    );
  });

  test('isNull', () => {
    expectValidatorResults(
      validatorExports,
      'isNull',
      [null],
      [undefined, 0, '', false],
    );
  });

  test('isNullish', () => {
    expectValidatorResults(
      validatorExports,
      'isNullish',
      [null, undefined],
      [0, '', false],
    );
  });
});

type ValidatorNameMap = {
  base: string;
  optional: string;
  nullable: string;
  nullish: string;
  array: string;
  optionalArray: string;
  nullableArray: string;
  nullishArray: string;
};

type StandardValidatorSpec = {
  label: string;
  baseName: string;
  valid: unknown[];
  invalid: unknown[];
  arrayValid?: unknown[][];
  arrayInvalid?: unknown[][];
  overrides?: Partial<ValidatorNameMap>;
  baseAcceptsNull?: boolean;
  baseAcceptsUndefined?: boolean;
};

const createValidatorNames = (
  baseName: string,
  overrides: Partial<ValidatorNameMap> = {},
): ValidatorNameMap => ({
  base: overrides.base ?? `is${baseName}`,
  optional: overrides.optional ?? `isOptional${baseName}`,
  nullable: overrides.nullable ?? `isNullable${baseName}`,
  nullish: overrides.nullish ?? `isNullish${baseName}`,
  array: overrides.array ?? `is${baseName}Array`,
  optionalArray: overrides.optionalArray ?? `isOptional${baseName}Array`,
  nullableArray: overrides.nullableArray ?? `isNullable${baseName}Array`,
  nullishArray: overrides.nullishArray ?? `isNullish${baseName}Array`,
});

const validatorGroups: StandardValidatorSpec[] = [
  {
    label: 'Boolean validators',
    baseName: 'Boolean',
    valid: [true, false],
    invalid: [1, 'true', {}, []],
  },
  {
    label: 'Valid boolean validators',
    baseName: 'ValidBoolean',
    valid: [true, false, 'true', 'FALSE', 'yes', 'No', 1, 0],
    invalid: ['foo', 2, {}, []],
  },
  {
    label: 'Number validators',
    baseName: 'Number',
    valid: [0, 1.5, -3],
    invalid: ['1', NaN, true, {}, []],
  },
  {
    label: 'Positive number validators',
    baseName: 'PositiveNumber',
    valid: [0.1, 5],
    invalid: [0, -1, '1', []],
  },
  {
    label: 'Negative number validators',
    baseName: 'NegativeNumber',
    valid: [-0.1, -5],
    invalid: [0, 3, '1', []],
  },
  {
    label: 'Unsigned number validators',
    baseName: 'UnsignedNumber',
    valid: [0, 10],
    invalid: [-1, '5', []],
  },
  {
    label: 'Integer validators',
    baseName: 'Integer',
    valid: [-10, 0, 12],
    invalid: [1.2, '2', []],
  },
  {
    label: 'Positive integer validators',
    baseName: 'PositiveInteger',
    valid: [1, 5],
    invalid: [0, -1, 2.5, '2'],
  },
  {
    label: 'Negative integer validators',
    baseName: 'NegativeInteger',
    valid: [-1, -5],
    invalid: [0, 1, -2.5, '2'],
  },
  {
    label: 'Unsigned integer validators',
    baseName: 'UnsignedInteger',
    valid: [0, 5],
    invalid: [-1, 1.5, '2'],
  },
  {
    label: 'BigInt validators',
    baseName: 'BigInt',
    valid: [0n, 5n],
    invalid: [0, '5', []],
    overrides: {
      nullishArray: 'isNullishBigIntArr',
    },
  },
  {
    label: 'Valid number validators',
    baseName: 'ValidNumber',
    valid: ['5', 5, '0.2', 0, true],
    invalid: ['foo', {}, () => null],
    overrides: {
      nullishArray: 'isNishValidNumArr',
    },
    baseAcceptsNull: true,
  },
  {
    label: 'String validators',
    baseName: 'String',
    valid: ['abc', ''],
    invalid: [0, true, {}, []],
  },
  {
    label: 'Non-empty string validators',
    baseName: 'NonEmptyString',
    valid: ['abc', ' '],
    invalid: ['', 0, false],
  },
  {
    label: 'Symbol validators',
    baseName: 'Symbol',
    valid: [Symbol('a')],
    invalid: ['a', 1, {}],
  },
  {
    label: 'Date validators',
    baseName: 'Date',
    valid: [new Date('2024-01-01')],
    invalid: [new Date('invalid'), '2024-01-01', 0],
  },
  {
    label: 'Valid date validators',
    baseName: 'ValidDate',
    valid: [new Date('2024-01-01'), '2023-02-02', 1700000000],
    invalid: ['bad-date', {}, []],
  },
  {
    label: 'Object validators',
    baseName: 'Object',
    valid: [{}, [], new Date()],
    invalid: [null, 'a', 1],
  },
  {
    label: 'Plain object validators',
    baseName: 'PlainObject',
    valid: [{ foo: 'bar' }, Object.create(null)],
    invalid: [[], null, 1],
  },
  {
    label: 'Function validators',
    baseName: 'Function',
    valid: [() => null, function named() {}],
    invalid: [{}, 1, 'fn'],
  },
];

const buildArrayValues = (values: unknown[]): unknown[][] => [
  [values[0]],
  [values[0], values[values.length - 1] ?? values[0]],
];

validatorGroups.forEach((group) => {
  const names = createValidatorNames(group.baseName, group.overrides);
  const arrayValid = group.arrayValid ?? buildArrayValues(group.valid);
  const arrayInvalid = group.arrayInvalid ?? [
    [...arrayValid[0], group.invalid[0]],
    'not-an-array',
  ];
  const invalidSansNull = group.invalid.filter((value) => value !== null);
  const invalidSansUndefined = group.invalid.filter(
    (value) => value !== undefined,
  );
  const invalidSansNullish = group.invalid.filter(
    (value) => value !== null && value !== undefined,
  );
  const arrayInvalidSansNull = arrayInvalid.filter((value) => value !== null);
  const arrayInvalidSansUndefined = arrayInvalid.filter(
    (value) => value !== undefined,
  );
  const arrayInvalidSansNullish = arrayInvalid.filter(
    (value) => value !== null && value !== undefined,
  );

  describe(group.label, () => {
    test(names.base, () => {
      const baseFailValues = [
        ...group.invalid,
        ...(group.baseAcceptsNull ? [] : [null]),
        ...(group.baseAcceptsUndefined ? [] : [undefined]),
      ];
      expectValidatorResults(validatorExports, names.base, group.valid, [
        ...baseFailValues,
      ]);
    });

    test(names.optional, () => {
      const optionalFailValues = [
        ...invalidSansUndefined,
        ...(group.baseAcceptsNull ? [] : [null]),
      ];
      expectValidatorResults(
        validatorExports,
        names.optional,
        [...group.valid, undefined],
        optionalFailValues,
      );
    });

    test(names.nullable, () => {
      const nullableFailValues = [
        ...invalidSansNull,
        ...(group.baseAcceptsUndefined ? [] : [undefined]),
      ];
      expectValidatorResults(
        validatorExports,
        names.nullable,
        [...group.valid, null],
        nullableFailValues,
      );
    });

    test(names.nullish, () => {
      expectValidatorResults(
        validatorExports,
        names.nullish,
        [...group.valid, null, undefined],
        invalidSansNullish,
      );
    });

    test(names.array, () => {
      expectValidatorResults(validatorExports, names.array, arrayValid, [
        ...arrayInvalid,
        null,
        undefined,
      ]);
    });

    test(names.optionalArray, () => {
      expectValidatorResults(
        validatorExports,
        names.optionalArray,
        [...arrayValid, undefined],
        [...arrayInvalidSansUndefined, null],
      );
    });

    test(names.nullableArray, () => {
      expectValidatorResults(
        validatorExports,
        names.nullableArray,
        [...arrayValid, null],
        [...arrayInvalidSansNull, undefined],
      );
    });

    test(names.nullishArray, () => {
      expectValidatorResults(
        validatorExports,
        names.nullishArray,
        [...arrayValid, null, undefined],
        arrayInvalidSansNullish,
      );
    });
  });
});

describe('complex validators', () => {
  describe('isInArray family', () => {
    const colors = ['red', 'blue'] as const;

    test('isInArray', () => {
      const fn = expectFunctionExport(validatorExports, 'isInArray') as <
        T extends readonly unknown[],
      >(
        arr: T,
      ) => (arg: unknown) => boolean;
      const validator = fn(colors);
      expect(validator('red')).toBe(true);
      expect(validator('green')).toBe(false);
      expect(validator(undefined)).toBe(false);
      expect(validator(null)).toBe(false);
    });

    test('isOptionalInArray', () => {
      const fn = expectFunctionExport(
        validatorExports,
        'isOptionalInArray',
      ) as <T extends readonly unknown[]>(arr: T) => (arg: unknown) => boolean;
      const validator = fn(colors);
      expect(validator('blue')).toBe(true);
      expect(validator(undefined)).toBe(true);
      expect(validator(null)).toBe(false);
    });

    test('isNullableInArray', () => {
      const fn = expectFunctionExport(
        validatorExports,
        'isNullableInArray',
      ) as <T extends readonly unknown[]>(arr: T) => (arg: unknown) => boolean;
      const validator = fn(colors);
      expect(validator('blue')).toBe(true);
      expect(validator(null)).toBe(true);
      expect(validator(undefined)).toBe(false);
    });

    test('isNullishInArray', () => {
      const fn = expectFunctionExport(validatorExports, 'isNullishInArray') as <
        T extends readonly unknown[],
      >(
        arr: T,
      ) => (arg: unknown) => boolean;
      const validator = fn(colors);
      expect(validator(null)).toBe(true);
      expect(validator(undefined)).toBe(true);
      expect(validator('orange')).toBe(false);
    });
  });

  describe('isInRange family', () => {
    const min: [number] = [0]; // inclusive lower bound
    const max = 5; // exclusive upper bound

    test('isInRange', () => {
      const fn = expectFunctionExport(validatorExports, 'isInRange') as AnyFn;
      const validator = fn(min, max) as ValidatorFn;
      expect(validator(0)).toBe(true);
      expect(validator('4')).toBe(true);
      expect(validator(5)).toBe(false);
      expect(validator('abc')).toBe(false);
    });

    test('isOptionalInRange', () => {
      const fn = expectFunctionExport(
        validatorExports,
        'isOptionalInRange',
      ) as AnyFn;
      const validator = fn(min, max) as ValidatorFn;
      expect(validator(undefined)).toBe(true);
      expect(validator(null)).toBe(false);
    });

    test('isNullableInRange', () => {
      const fn = expectFunctionExport(
        validatorExports,
        'isNullableInRange',
      ) as AnyFn;
      const validator = fn(min, max) as ValidatorFn;
      expect(validator(null)).toBe(true);
      expect(validator(undefined)).toBe(false);
    });

    test('isNullishInRange', () => {
      const fn = expectFunctionExport(
        validatorExports,
        'isNullishInRange',
      ) as AnyFn;
      const validator = fn(min, max) as ValidatorFn;
      expect(validator(null)).toBe(true);
      expect(validator(undefined)).toBe(true);
      expect(validator(10)).toBe(false);
    });

    test('isInRangeArray variants', () => {
      const base = expectFunctionExport(
        validatorExports,
        'isInRangeArray',
      ) as AnyFn;
      const optional = expectFunctionExport(
        validatorExports,
        'isOptionalInRangeArray',
      ) as AnyFn;
      const nullable = expectFunctionExport(
        validatorExports,
        'isNullableInRangeArray',
      ) as AnyFn;
      const nullish = expectFunctionExport(
        validatorExports,
        'isNullishInRangeArray',
      ) as AnyFn;

      const baseValidator = base(min, max) as ValidatorFn;
      const optionalValidator = optional(min, max) as ValidatorFn;
      const nullableValidator = nullable(min, max) as ValidatorFn;
      const nullishValidator = nullish(min, max) as ValidatorFn;

      expect(baseValidator([0, 1, '4'])).toBe(true);
      expect(baseValidator([0, 5])).toBe(false);
      expect(baseValidator('not array')).toBe(false);

      expect(optionalValidator(undefined)).toBe(true);
      expect(optionalValidator([1, 2])).toBe(true);

      expect(nullableValidator(null)).toBe(true);
      expect(nullableValidator([0, 4])).toBe(true);

      expect(nullishValidator(undefined)).toBe(true);
      expect(nullishValidator(null)).toBe(true);
      expect(nullishValidator([0, 'oops'])).toBe(false);
    });
  });

  describe('isValidArray family', () => {
    const allowed = ['red', 'blue', 'green'] as const;
    const createArrayValidator = (
      name: string,
      minLength?: number,
      maxLength?: number,
    ) => {
      const fn = expectFunctionExport(validatorExports, name) as <
        T extends readonly unknown[],
      >(
        arr: T,
        min?: number,
        max?: number,
      ) => (value: unknown) => boolean;
      return fn(allowed, minLength, maxLength);
    };

    test('isValidArray enforces membership and length bounds', () => {
      const validator = createArrayValidator('isValidArray', 1, 3);
      expect(validator(['red'])).toBe(true);
      expect(validator(['green', 'blue', 'red'])).toBe(true);
      expect(validator([])).toBe(false);
      expect(validator(['red', 'yellow'])).toBe(false);
      expect(validator(['red', 'green', 'blue', 'green'])).toBe(false);
      expect(validator('not array')).toBe(false);
      expect(validator(null)).toBe(false);
      expect(validator(undefined)).toBe(false);
    });

    test('isOptionalValidArray allows undefined but not null', () => {
      const validator = createArrayValidator('isOptionalValidArray', 1, 2);
      expect(validator(['red', 'blue'])).toBe(true);
      expect(validator(undefined)).toBe(true);
      expect(validator(null)).toBe(false);
      expect(validator([])).toBe(false);
    });

    test('isNullableValidArray allows null but not undefined', () => {
      const validator = createArrayValidator('isNullableValidArray');
      expect(validator(['red'])).toBe(true);
      expect(validator(null)).toBe(true);
      expect(validator(undefined)).toBe(false);
    });

    test('isNullishValidArray allows null and undefined', () => {
      const validator = createArrayValidator('isNullishValidArray');
      expect(validator(null)).toBe(true);
      expect(validator(undefined)).toBe(true);
      expect(validator(['yellow'])).toBe(false);
    });
  });

  describe('isKeyOf family', () => {
    const obj = { a: 1, b: 2 } as const;

    const runKeyOf = (
      name: string,
      passValues: unknown[],
      failValues: unknown[],
    ) => {
      const fn = expectFunctionExport(validatorExports, name) as AnyFn;
      const validator = fn(obj) as ValidatorFn;
      passValues.forEach((value) => expect(validator(value)).toBe(true));
      failValues.forEach((value) => expect(validator(value)).toBe(false));
    };

    test('isKeyOf', () => {
      runKeyOf('isKeyOf', ['a', 'b'], ['c', 1]);
    });

    test('isOptionalKeyOf', () => {
      runKeyOf('isOptionalKeyOf', ['a', undefined], ['c', null]);
    });

    test('isNullableKeyOf', () => {
      runKeyOf('isNullableKeyOf', ['a', null], ['c', undefined]);
    });

    test('isNullishKeyOf', () => {
      runKeyOf('isNullishKeyOf', ['a', null, undefined], ['c', 1]);
    });
  });

  describe('isValueOf family', () => {
    const obj = { a: 1, b: 2 } as const;

    const runValueOf = (
      name: string,
      passValues: unknown[],
      failValues: unknown[],
    ) => {
      const fn = expectFunctionExport(validatorExports, name) as AnyFn;
      const validator = fn(obj) as ValidatorFn;
      passValues.forEach((value) => expect(validator(value)).toBe(true));
      failValues.forEach((value) => expect(validator(value)).toBe(false));
    };

    test('isValueOf', () => {
      runValueOf('isValueOf', [1, 2], ['1', 3]);
    });

    test('isOptionalValueOf', () => {
      runValueOf('isOptionalValueOf', [1, undefined], ['1', null]);
    });

    test('isNullableValueOf', () => {
      runValueOf('isNullableValueOf', [1, null], ['1', undefined]);
    });

    test('isNullishValueOf', () => {
      runValueOf('isNullishValueOf', [1, null, undefined], ['1', 3]);
    });
  });
});

describe('simple utils', () => {
  describe('nullish wrappers', () => {
    const basePredicate = (value: unknown): value is string =>
      typeof value === 'string';

    test('nonNullable', () => {
      const fn = utils.nonNullable(basePredicate);
      expect(fn('value')).toBe(true);
      expect(fn(null)).toBe(false);
      expect(fn(undefined)).toBe(false);
      expect(fn(5)).toBe(false);
    });

    test('makeOptional', () => {
      const fn = utils.makeOptional(basePredicate);
      expect(fn('value')).toBe(true);
      expect(fn(undefined)).toBe(true);
      expect(fn(null)).toBe(false);
    });

    test('makeNullable', () => {
      const fn = utils.makeNullable(basePredicate);
      expect(fn('value')).toBe(true);
      expect(fn(null)).toBe(true);
      expect(fn(undefined)).toBe(false);
    });

    test('makeNullish', () => {
      const fn = utils.makeNullish(basePredicate);
      expect(fn('value')).toBe(true);
      expect(fn(null)).toBe(true);
      expect(fn(undefined)).toBe(true);
      expect(fn(5)).toBe(false);
    });
  });

  test('transform applies conversion before validation', () => {
    const transformedValues: unknown[] = [];
    const transformFn = utils.transform(
      (value) => Number(value),
      validators.isPositiveNumber,
    );
    expect(transformFn('5', (value) => transformedValues.push(value))).toBe(
      true,
    );
    expect(transformFn('0')).toBe(false);
    expect(transformedValues).toStrictEqual([5]);
  });

  describe('parseBoolean family', () => {
    test('parseBoolean', () => {
      expect(utils.parseBoolean(true)).toBe(true);
      expect(utils.parseBoolean('yes')).toBe(true);
      expect(utils.parseBoolean('0')).toBe(false);
      expect(() => utils.parseBoolean('maybe')).toThrowError(
        'Argument must be a valid boolean.',
      );
    });

    test('parseOptionalBoolean', () => {
      expect(utils.parseOptionalBoolean(undefined)).toBeUndefined();
      expect(utils.parseOptionalBoolean('1')).toBe(true);
      expect(() => utils.parseOptionalBoolean('nope')).toThrowError(
        'Argument must be a valid boolean | undefined.',
      );
    });

    test('parseNullableBoolean', () => {
      expect(utils.parseNullableBoolean(null)).toBeNull();
      expect(utils.parseNullableBoolean('false')).toBe(false);
      expect(() => utils.parseNullableBoolean('nope')).toThrowError(
        'Argument must be a valid boolean | null.',
      );
    });

    test('parseNullishBoolean', () => {
      expect(utils.parseNullishBoolean(null)).toBeNull();
      expect(utils.parseNullishBoolean(undefined)).toBeUndefined();
      expect(utils.parseNullishBoolean('yes')).toBe(true);
      expect(() => utils.parseNullishBoolean('nope')).toThrowError(
        'Argument must be a valid boolean | null | undefined.',
      );
    });
  });

  describe('parseJson family', () => {
    const payload = JSON.stringify({ id: 1 });

    test('parseJson', () => {
      expect(utils.parseJson<{ id: number }>(payload)).toStrictEqual({
        id: 1,
      });
      expect(() => utils.parseJson(5)).toThrowError(
        'JSON parse argument must be a string.',
      );
    });

    test('parseOptionalJson', () => {
      expect(utils.parseOptionalJson(payload)).toStrictEqual({ id: 1 });
      expect(utils.parseOptionalJson(undefined)).toBeUndefined();
      expect(() => utils.parseOptionalJson(5)).toThrowError(
        'JSON parse argument must be string or undefined.',
      );
    });

    test('parseNullableJson', () => {
      expect(utils.parseNullableJson(payload)).toStrictEqual({ id: 1 });
      expect(utils.parseNullableJson(null)).toBeNull();
      expect(() => utils.parseNullableJson(5)).toThrowError(
        'JSON parse argument must be string or null.',
      );
    });

    test('parseNullishJson', () => {
      expect(utils.parseNullishJson(payload)).toStrictEqual({ id: 1 });
      expect(utils.parseNullishJson(null)).toBeNull();
      expect(utils.parseNullishJson(undefined)).toBeUndefined();
      expect(() => utils.parseNullishJson(5)).toThrowError(
        'JSON parse argument must be string, null, or undefined.',
      );
    });
  });
});

type ParseMode = 'normal' | 'loose' | 'strict';

type ParseCombo = {
  suffix: string;
  optional: boolean;
  nullable: boolean;
  array: boolean;
};

const parseCombos: ParseCombo[] = [
  { suffix: 'Object', optional: false, nullable: false, array: false },
  { suffix: 'OptionalObject', optional: true, nullable: false, array: false },
  { suffix: 'NullableObject', optional: false, nullable: true, array: false },
  { suffix: 'NullishObject', optional: true, nullable: true, array: false },
  { suffix: 'ObjectArray', optional: false, nullable: false, array: true },
  {
    suffix: 'OptionalObjectArray',
    optional: true,
    nullable: false,
    array: true,
  },
  {
    suffix: 'NullableObjectArray',
    optional: false,
    nullable: true,
    array: true,
  },
  { suffix: 'NullishObjectArray', optional: true, nullable: true, array: true },
];

const parseVariants: { prefix: string; mode: ParseMode }[] = [
  { prefix: 'parse', mode: 'normal' },
  { prefix: 'looseParse', mode: 'loose' },
  { prefix: 'strictParse', mode: 'strict' },
];

const testVariants: { prefix: string; mode: ParseMode }[] = [
  { prefix: 'test', mode: 'normal' },
  { prefix: 'looseTest', mode: 'loose' },
  { prefix: 'strictTest', mode: 'strict' },
];

const schema = {
  id: validators.isNumber,
  name: validators.isString,
};

const baseUser = { id: 1, name: 'Jet' } as const;
const baseUser2 = { id: 2, name: 'Jane' } as const;
const userWithExtra = { ...baseUser, role: 'admin' };
const userWithExtra2 = { ...baseUser2, role: 'admin' };
const invalidUser = { id: 'oops', name: 'Jet' } as const;

const buildValidPayload = (mode: ParseMode, isArray: boolean) => {
  const single = mode === 'strict' ? { ...baseUser } : { ...userWithExtra };
  const second = mode === 'strict' ? { ...baseUser2 } : { ...userWithExtra2 };
  return isArray ? [single, second] : single;
};

const buildExpectedResult = (mode: ParseMode, isArray: boolean) => {
  const single = mode === 'loose' ? { ...userWithExtra } : { ...baseUser };
  const second = mode === 'loose' ? { ...userWithExtra2 } : { ...baseUser2 };
  return isArray ? [single, second] : single;
};

const buildInvalidPayload = (isArray: boolean) => {
  if (isArray) {
    return [{ ...userWithExtra }, { ...invalidUser }];
  }
  return { ...invalidUser };
};

const buildPayloadWithExtra = (isArray: boolean) => {
  if (isArray) {
    return [{ ...userWithExtra }, { ...userWithExtra2 }];
  }
  return { ...userWithExtra };
};

const expectOptionalBehavior = (
  fn: AnyFn,
  { optional, nullable }: Pick<ParseCombo, 'optional' | 'nullable'>,
) => {
  const undefinedResult = fn(undefined);
  if (optional) {
    expect(undefinedResult).toBeUndefined();
  } else {
    expect(undefinedResult).toBe(false);
  }

  const nullResult = fn(null);
  if (nullable) {
    expect(nullResult).toBeNull();
  } else {
    expect(nullResult).toBe(false);
  }
};

const expectTesterOptionalBehavior = (
  fn: AnyFn,
  { optional, nullable }: Pick<ParseCombo, 'optional' | 'nullable'>,
) => {
  if (optional) {
    expect(fn(undefined)).toBe(true);
  } else {
    expect(fn(undefined)).toBe(false);
  }

  if (nullable) {
    expect(fn(null)).toBe(true);
  } else {
    expect(fn(null)).toBe(false);
  }
};

const expectOnErrorInvocation = (fn: AnyFn, badPayload: unknown) => {
  const errors: unknown[][] = [];
  const result = fn(badPayload, (err: unknown[]) => errors.push(err));
  expect(result).toBe(false);
  expect(errors.length).toBeGreaterThan(0);
};

describe('parseObject variants', () => {
  parseVariants.forEach(({ prefix, mode }) => {
    describe(`${prefix}* functions`, () => {
      parseCombos.forEach((combo) => {
        const fnName = `${prefix}${combo.suffix}`;
        test(fnName, () => {
          const factory = expectFunctionExport(utilsExports, fnName) as AnyFn;
          const parseFn = factory(schema) as AnyFn;

          const payload = buildValidPayload(mode, combo.array);
          const expected = buildExpectedResult(mode, combo.array);
          expect(parseFn(payload)).toStrictEqual(expected);

          const invalidPayload = buildInvalidPayload(combo.array);
          expectOnErrorInvocation(parseFn, invalidPayload);

          expectOptionalBehavior(parseFn, combo);

          if (mode === 'strict') {
            const payloadWithExtra = buildPayloadWithExtra(combo.array);
            expect(parseFn(payloadWithExtra)).toBe(false);
          }
        });
      });
    });
  });
});

describe('testObject variants', () => {
  testVariants.forEach(({ prefix, mode }) => {
    describe(`${prefix}* functions`, () => {
      parseCombos.forEach((combo) => {
        const fnName = `${prefix}${combo.suffix}`;
        test(fnName, () => {
          const factory = expectFunctionExport(utilsExports, fnName) as AnyFn;
          const testFn = factory(schema) as AnyFn;

          const payload = buildValidPayload(mode, combo.array);
          const expected = buildExpectedResult(mode, combo.array);
          let modified: unknown;
          const result = testFn(
            payload,
            undefined,
            (value: unknown) => (modified = value),
          );
          expect(result).toBe(true);
          expect(modified).toStrictEqual(expected);

          const invalidPayload = buildInvalidPayload(combo.array);
          expect(testFn(invalidPayload)).toBe(false);

          expectTesterOptionalBehavior(testFn, combo);

          if (mode === 'strict') {
            const payloadWithExtra = buildPayloadWithExtra(combo.array);
            expect(testFn(payloadWithExtra)).toBe(false);
          }
        });
      });
    });
  });
});
