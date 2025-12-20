import {
  isNull,
  isNumber,
  isObject,
  isString,
  isUndef,
  isValidNumber,
} from './basic.js';
import markSafe from './markSafe.js';

// Add modifiers
type AddNull<T, N> = N extends true ? T | null : T;
type AddNullables<T, O, N> = O extends true
  ? AddNull<T, N> | undefined
  : AddNull<T, N>;
type AddMods<T, O, N, A> = A extends true
  ? AddNullables<T[], O, N>
  : AddNullables<T, O, N>;

/******************************************************************************
                              isInArray
******************************************************************************/

export const isInArray = <T extends readonly unknown[]>(arg: T) =>
  isInArrayHelper<T, false, false>(arg, false, false);
export const isOptionalInArray = <T extends readonly unknown[]>(arg: T) =>
  isInArrayHelper<T, true, false>(arg, true, false);
export const isNullableInArray = <T extends readonly unknown[]>(arg: T) =>
  isInArrayHelper<T, false, true>(arg, false, true);
export const isNullishInArray = <T extends readonly unknown[]>(arg: T) =>
  isInArrayHelper<T, true, true>(arg, true, true);

/**
 * Is an item in an array.
 */
export function isInArrayHelper<
  T extends readonly unknown[],
  O extends boolean,
  N extends boolean,
>(
  arr: T,
  optional: O,
  nullable: N,
): (arg: unknown) => arg is AddNullables<T[number], O, N> {
  const lookup = new Set(arr);
  const validator = (arg: unknown): arg is AddNullables<T[number], O, N> => {
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

type TRangeParam = number | [number] | [];
type TRangeFn = (arg: number) => boolean;

export const isInRange = isInRangeHelper<false, false, false>(
  false,
  false,
  false,
);
export const isOptionalInRange = isInRangeHelper<true, false, false>(
  true,
  false,
  false,
);
export const isNullableInRange = isInRangeHelper<false, true, false>(
  false,
  true,
  false,
);
export const isNullishInRange = isInRangeHelper<true, true, false>(
  true,
  true,
  false,
);
export const isInRangeArray = isInRangeHelper<false, false, true>(
  false,
  false,
  true,
);
export const isOptionalInRangeArray = isInRangeHelper<true, false, true>(
  true,
  false,
  true,
);
export const isNullableInRangeArray = isInRangeHelper<false, true, true>(
  false,
  true,
  true,
);
export const isNullishInRangeArray = isInRangeHelper<true, true, true>(
  true,
  true,
  true,
);

/**
 * Range will always determine if a number is >= the min and <= the max.
 */
function isInRangeHelper<
  O extends boolean,
  N extends boolean,
  A extends boolean,
  Ret = AddMods<number | string, O, N, A>,
>(
  optional: boolean,
  nullable: boolean,
  isArr: boolean,
): (min: TRangeParam, max: TRangeParam) => (arg: unknown) => arg is Ret {
  return (
    min: TRangeParam,
    max: TRangeParam,
  ): ((arg: unknown) => arg is Ret) => {
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
  };
}

/**
 * Core logic for is array function.
 */
function isInRangeCheckType(arg: unknown, rangeFn: TRangeFn): boolean {
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
  min: TRangeParam,
  max: TRangeParam,
): TRangeFn {
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

export const isKeyOf = <T extends object>(arg: T) =>
  isKeyOfHelper<T, false, false>(arg, false, false);
export const isOptionalKeyOf = <T extends object>(arg: T) =>
  isKeyOfHelper<T, true, false>(arg, true, false);
export const isNullableKeyOf = <T extends object>(arg: T) =>
  isKeyOfHelper<T, false, true>(arg, false, true);
export const isNullishKeyOf = <T extends object>(arg: T) =>
  isKeyOfHelper<T, true, true>(arg, true, true);

/**
 * See if something is a key of an object.
 */
function isKeyOfHelper<
  T extends object,
  O extends boolean,
  N extends boolean,
  Ret = AddMods<keyof T, O, N, false>,
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

export const isValueOf = <T extends object>(arg: T) =>
  isValueOfHelper<T, false, false>(arg, false, false);
export const isOptionalValueOf = <T extends object>(arg: T) =>
  isValueOfHelper<T, true, false>(arg, true, false);
export const isNullableValueOf = <T extends object>(arg: T) =>
  isValueOfHelper<T, false, true>(arg, false, true);
export const isNullishValueOf = <T extends object>(arg: T) =>
  isValueOfHelper<T, true, true>(arg, true, true);

/**
 * See if something is a value in an object.
 */
function isValueOfHelper<
  T extends object,
  O extends boolean,
  N extends boolean,
  Ret = AddMods<ValueOf<T>, O, N, false>,
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
