/******************************************************************************
                              Types/Constants
******************************************************************************/

const symSafeValidatorFn = Symbol('safe-validator-function');
type SafeFunction = Record<symbol, boolean>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;

/******************************************************************************
                            Functions
******************************************************************************/

/**
 * Mark internal functions as safe so we don't need to wrap them.
 */
export function markSafe<T extends AnyFunction>(fn: T): T {
  if (typeof fn === 'function') {
    (fn as unknown as SafeFunction)[symSafeValidatorFn] = true;
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
    if (typeof fn === 'function') {
      (fn as SafeFunction)[symSafeValidatorFn] = true;
    }
  }
  return obj;
}

/**
 * Check if a function has been marked as safe
 */
export function isSafe(fn: unknown): boolean {
  return (fn as SafeFunction)[symSafeValidatorFn] === true;
}
