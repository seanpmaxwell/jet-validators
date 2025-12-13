/**
 * I created these instead of importing from "../src" so there's not circular
 * dependencies during the build process.
 */

// **** Types **** //

export type ValueOf<T extends object> = T[keyof T];

// **** Functions **** //

export function isString(arg: unknown): arg is string {
  return typeof arg === 'string';
}

export function isStringArray(arg: unknown): arg is string[] {
  return Array.isArray(arg) && arg.every(item => typeof item === 'string');
}

export function isStringRecord(arg: unknown): arg is Record<string, unknown> {
  return !!arg && typeof arg === 'object' && isStringArray(Object.keys(arg));
}

export function isNonEmptyStringRecord(
  arg: unknown,
): arg is Record<string, unknown> {
  if (!!arg && typeof arg === 'object') {
    const keys = Object.keys(arg);
    return keys.length > 0 && isStringArray(keys);
  }
  return false;
}

export function isUndef(arg: unknown): arg is undefined {
  return arg === undefined;
}

export function isFunction(
  arg: unknown,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): arg is ((...args: any[]) => any) {
  return typeof arg === 'function';
}
