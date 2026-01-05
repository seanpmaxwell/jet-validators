import { markSafe } from '../utils/parseObject/mark-safe.js';

import type { ResolveMods } from './common.js';

/******************************************************************************
                             Export Variants
******************************************************************************/

export function isValidArray<T extends readonly unknown[]>(
  arg: T,
  minLength?: number,
  maxLength?: number,
) {
  return isValidArrayHelper<T, false, false>(
    arg,
    false,
    false,
    minLength,
    maxLength,
  );
}

export function isOptionalValidArray<T extends readonly unknown[]>(
  arg: T,
  minLength?: number,
  maxLength?: number,
) {
  return isValidArrayHelper<T, true, false>(
    arg,
    true,
    false,
    minLength,
    maxLength,
  );
}

export function isNullableValidArray<T extends readonly unknown[]>(
  arg: T,
  minLength?: number,
  maxLength?: number,
) {
  return isValidArrayHelper<T, false, true>(
    arg,
    false,
    true,
    minLength,
    maxLength,
  );
}

export function isNullishValidArray<T extends readonly unknown[]>(
  arg: T,
  minLength?: number,
  maxLength?: number,
) {
  return isValidArrayHelper<T, true, true>(
    arg,
    true,
    true,
    minLength,
    maxLength,
  );
}

/******************************************************************************
                               Core Logic
******************************************************************************/

/**
 * Is every item in the array, contained in the validator array.
 */
function isValidArrayHelper<
  T extends readonly unknown[],
  O extends boolean,
  N extends boolean,
>(
  arr: T,
  optional: O,
  nullable: N,
  minLength = 0,
  maxLength?: number,
): (arg: unknown) => arg is ResolveMods<T[number][], O, N, false> {
  const lookup = new Set(arr);
  const validator = (
    arg: unknown,
  ): arg is ResolveMods<T[number][], O, N, false> => {
    if (arg === undefined) {
      return !!optional;
    }
    if (arg === null) {
      return !!nullable;
    }
    if (!Array.isArray(arg)) {
      return false;
    }
    if (arg.length < minLength) {
      return false;
    }
    if (maxLength !== undefined && arg.length > maxLength) {
      return false;
    }
    for (let i = 0; i < arg.length; i++) {
      if (!lookup.has(arg[i])) {
        return false;
      }
    }
    return true;
  };
  return markSafe(validator);
}
