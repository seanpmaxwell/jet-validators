import { isFunction } from './basic.js';

/******************************************************************************
                          Constants/Types
******************************************************************************/

const kSafeValidator = Symbol('safe-validator');
type TSafeFunction = Record<symbol, unknown>;
type TFunc = (arg: unknown) => boolean | undefined | null | object;

/******************************************************************************
                             Functions
******************************************************************************/

/**
 * Mark internal functions as safe so we don't need to wrap them.
 */
function markSafe<T extends TFunc>(fn: T): T {
  if (isFunction(fn)) {
    (fn as TSafeFunction)[kSafeValidator] = true;
  }
  return fn;
}

/**
 * Iterative an object of functions.
 */
export function markSafeIterative<T extends Record<string, unknown>>(
  obj: T,
): T {
  for (const key in obj) {
    const fn = obj[key];
    if (isFunction(fn)) {
      (fn as TSafeFunction)[kSafeValidator] = true;
    }
  }
  return obj;
}

/**
 * Check if a function has been marked as safe
 */
export function isSafe(fn: unknown): boolean {
  return (fn as TSafeFunction)[kSafeValidator] === true;
}

/******************************************************************************
                              Export
******************************************************************************/

export default markSafe;
