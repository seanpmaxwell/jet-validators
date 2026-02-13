import { markSafe } from '../utils/parseObject/mark-safe.js';

import type { ResolveMods } from './common.js';

/******************************************************************************
                                 Types
******************************************************************************/

type CollpaseType<T> = T extends unknown ? T : never;

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
): (arg: unknown) => arg is CollpaseType<ResolveMods<T[number], O, N, false>> {
  const lookup = new Set(arr);
  const validator = (
    arg: unknown,
  ): arg is CollpaseType<ResolveMods<T[number], O, N, false>> => {
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
