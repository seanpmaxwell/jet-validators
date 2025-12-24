import {
  isNull,
  isNumber,
  isObject,
  isString,
  isUndef,
  isValidNumber,
} from './basic.js';
import { markSafe } from './utils/parseObject/mark-safe.js';

/******************************************************************************
                                 Types
******************************************************************************/

type ResolveMods<T, O extends boolean, N extends boolean, A extends boolean> =
  | T
  | (A extends true ? T[] : T)
  | (O extends true ? undefined : T)
  | (N extends true ? null : never);

/******************************************************************************
                              isInArray
******************************************************************************/

export function isInArray<T extends readonly unknown[]>(arg: T) {
  return isInArrayHelper<T, false, false>(arg, false, false);
}
export function isOptionalInArray<T extends readonly unknown[]>(arg: T) {
  return isInArrayHelper<T, true, false>(arg, true, false);
}
export function isNullableInArray<T extends readonly unknown[]>(arg: T) {
  return isInArrayHelper<T, false, true>(arg, false, true);
}
export function isNullishInArray<T extends readonly unknown[]>(arg: T) {
  return isInArrayHelper<T, true, true>(arg, true, true);
}

/**
 * Is an item in an array.
 */
function isInArrayHelper<
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
    if (isUndef(arg)) {
      return !!optional;
    }
    if (isNull(arg)) {
      return !!nullable;
    }
    return lookup.has(arg);
  };
  return markSafe(validator);
}

/******************************************************************************
                              isInRange
******************************************************************************/

type RangeParam = number | [number] | [];
type isInRangeFn = (arg: number) => boolean;

export function isInRange(min: RangeParam, max: RangeParam) {
  return isInRangeHelper<false, false, false>(false, false, false, min, max);
}
export function isOptionalInRange(min: RangeParam, max: RangeParam) {
  return isInRangeHelper<true, false, false>(true, false, false, min, max);
}
export function isNullableInRange(min: RangeParam, max: RangeParam) {
  return isInRangeHelper<false, true, false>(false, true, false, min, max);
}
export function isNullishInRange(min: RangeParam, max: RangeParam) {
  return isInRangeHelper<true, true, false>(true, true, false, min, max);
}
export function isInRangeArray(min: RangeParam, max: RangeParam) {
  return isInRangeHelper<false, false, true>(false, false, true, min, max);
}
export function isOptionalInRangeArray(min: RangeParam, max: RangeParam) {
  return isInRangeHelper<true, false, true>(true, false, true, min, max);
}
export function isNullableInRangeArray(min: RangeParam, max: RangeParam) {
  return isInRangeHelper<false, true, true>(false, true, true, min, max);
}
export function isNullishInRangeArray(min: RangeParam, max: RangeParam) {
  return isInRangeHelper<true, true, true>(true, true, true, min, max);
}

/**
 * Range will always determine if a number is >= the min and <= the max.
 */
function isInRangeHelper<
  O extends boolean,
  N extends boolean,
  A extends boolean,
  Ret = ResolveMods<number | string, O, N, A>,
>(
  optional: boolean,
  nullable: boolean,
  isArr: boolean,
  min: RangeParam,
  max: RangeParam,
): (arg: unknown) => arg is Ret {
  const rangeFn = setupIsInRangeInternalFn(min, max);
  const validator = (arg: unknown): arg is Ret => {
    if (arg === undefined) {
      return optional;
    }
    if (arg === null) {
      return nullable;
    }
    if (isArr) {
      return (
        Array.isArray(arg) &&
        arg.every((item) => isInRangeCheckType(item, rangeFn))
      );
    }
    return isInRangeCheckType(arg, rangeFn);
  };
  return markSafe(validator);
}

/**
 * Core logic for is array function.
 */
function isInRangeCheckType(arg: unknown, rangeFn: isInRangeFn): boolean {
  if (isString(arg)) {
    if (isValidNumber(arg)) {
      arg = Number(arg);
    } else {
      return false;
    }
  }
  if (!isNumber(arg)) {
    return false;
  }
  return rangeFn(arg);
}

/**
 * Initialize inRange function.
 */
function setupIsInRangeInternalFn(
  min: RangeParam,
  max: RangeParam,
): isInRangeFn {
  // arg >= min && arg <= max
  if (
    Array.isArray(min) &&
    min.length === 1 &&
    Array.isArray(max) &&
    max.length === 1
  ) {
    return (arg: number) => arg >= min[0] && arg <= max[0];
    // arg >= min
  } else if (
    Array.isArray(min) &&
    min.length === 1 &&
    Array.isArray(max) &&
    max.length === 0
  ) {
    return (arg: number) => arg >= min[0];
    // arg > min
  } else if (!Array.isArray(min) && Array.isArray(max) && max.length === 0) {
    return (arg: number) => arg > min;
    // arg >= min && arg < max
  } else if (Array.isArray(min) && min.length === 1 && !Array.isArray(max)) {
    return (arg: number) => arg >= min[0] && arg < max;
    // arg <= max
  } else if (
    Array.isArray(min) &&
    min.length === 0 &&
    Array.isArray(max) &&
    max.length === 1
  ) {
    return (arg: number) => arg <= max[0];
    // arg < max
  } else if (Array.isArray(min) && min.length === 0 && !Array.isArray(max)) {
    return (arg: number) => arg < max;
    // arg > min && arg <= max
  } else if (!Array.isArray(min) && Array.isArray(max) && max.length === 1) {
    return (arg: number) => arg > min && arg <= max[0];
    // arg > min && arg < max
  } else if (!Array.isArray(min) && !Array.isArray(max)) {
    return (arg: number) => arg > min && arg < max;
  }
  // Shouldn't reach this point.
  throw new Error('min and max must be number, [number], or []');
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
  if (!isObject(obj)) {
    throw new Error('Item to check from must be a Record<string, unknown>.');
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
  if (!isObject(obj)) {
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
