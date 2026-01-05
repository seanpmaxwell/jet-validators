import { markSafe } from 'src/utils/parseObject/mark-safe.js';

import type { ResolveMods } from './common.js';

/******************************************************************************
                              InInArray
******************************************************************************/

export function isInArray<T extends readonly unknown[]>(arg: T) {
  return isInArrayCore<T, false, false>(arg, false, false);
}
export function isOptionalInArray<T extends readonly unknown[]>(arg: T) {
  return isInArrayCore<T, true, false>(arg, true, false);
}
export function isNullableInArray<T extends readonly unknown[]>(arg: T) {
  return isInArrayCore<T, false, true>(arg, false, true);
}
export function isNullishInArray<T extends readonly unknown[]>(arg: T) {
  return isInArrayCore<T, true, true>(arg, true, true);
}

/**
 * Is an item in an array.
 */
function isInArrayCore<
  T extends readonly unknown[],
  O extends boolean,
  N extends boolean,
>(
  arr: T,
  optional: O,
  nullable: N,
): (arg: unknown) => arg is ResolveMods<T[number], O, N, false> {
  const lookup = new Set(arr);
  const validator = (
    arg: unknown,
  ): arg is ResolveMods<T[number], O, N, false> => {
    if (arg === undefined) {
      return !!optional;
    }
    if (arg === null) {
      return !!nullable;
    }
    return lookup.has(arg);
  };
  return markSafe(validator);
}

/******************************************************************************
                              isKeyOf
******************************************************************************/

export function isKeyOf<T extends object>(arg: T) {
  return isKeyOfHelper<T, false, false>(arg, false, false);
}
export function isOptionalKeyOf<T extends object>(arg: T) {
  return isKeyOfHelper<T, true, false>(arg, true, false);
}
export function isNullableKeyOf<T extends object>(arg: T) {
  return isKeyOfHelper<T, false, true>(arg, false, true);
}
export function isNullishKeyOf<T extends object>(arg: T) {
  return isKeyOfHelper<T, true, true>(arg, true, true);
}

/**
 * See if something is a key of an object.
 */
function isKeyOfHelper<
  T extends object,
  O extends boolean,
  N extends boolean,
  Ret = ResolveMods<keyof T, O, N, false>,
>(
  obj: object,
  optional: boolean,
  nullable: boolean,
): (arg: unknown) => arg is Ret {
  if (!(obj !== null && typeof obj === 'object')) {
    throw new Error('Item to check from must be a object.');
  }
  const isInKeys = isInArray(Object.keys(obj));
  const validator = (arg: unknown): arg is Ret => {
    if (arg === undefined) {
      return optional;
    }
    if (arg === null) {
      return nullable;
    }
    return isInKeys(arg);
  };
  return markSafe(validator);
}

/******************************************************************************
                              isValueOf
******************************************************************************/

export type ValueOf<T extends object> = T[keyof T];

export function isValueOf<T extends object>(arg: T) {
  return isValueOfHelper<T, false, false>(arg, false, false);
}
export function isOptionalValueOf<T extends object>(arg: T) {
  return isValueOfHelper<T, true, false>(arg, true, false);
}
export function isNullableValueOf<T extends object>(arg: T) {
  return isValueOfHelper<T, false, true>(arg, false, true);
}
export function isNullishValueOf<T extends object>(arg: T) {
  return isValueOfHelper<T, true, true>(arg, true, true);
}

/**
 * See if something is a value in an object.
 */
function isValueOfHelper<
  T extends object,
  O extends boolean,
  N extends boolean,
  Ret = ResolveMods<ValueOf<T>, O, N, false>,
>(
  obj: object,
  optional: boolean,
  nullable: boolean,
): (arg: unknown) => arg is Ret {
  if (!(obj !== null && typeof obj === 'object')) {
    throw new Error('Item to check from must be a Record<string, unknown>.');
  }
  const isInValues = isInArray(Object.values(obj));
  const validator = (arg: unknown): arg is Ret => {
    if (arg === undefined) {
      return optional;
    }
    if (arg === null) {
      return nullable;
    }
    return isInValues(arg);
  };
  return markSafe(validator);
}
