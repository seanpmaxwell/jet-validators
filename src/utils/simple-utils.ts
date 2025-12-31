import { isFunction, isString, type AnyFunction } from '../basic.js';

/******************************************************************************
                             Constants
******************************************************************************/

const kTransformFunction = Symbol('transform-function');

const BOOLEAN_MAP: Record<string, boolean> = {
  true: true,
  false: false,
  yes: true,
  no: false,
  '1': true,
  '0': false,
} as const;

/******************************************************************************
                              Types
******************************************************************************/

export type ValidatorFnWithTransformCb<T> = (
  arg: unknown,
  cb?: (transformedValue: T, isValid?: boolean) => void,
) => arg is T;

/******************************************************************************
                               Functions
******************************************************************************/

// **** Nullables **** //

export function nonNullable<T>(cb: (arg: unknown) => arg is T) {
  return (arg: unknown): arg is NonNullable<T> => {
    if (arg === null || arg === undefined) {
      return false;
    } else {
      return cb(arg);
    }
  };
}

export function makeOptional<T>(cb: (arg: unknown) => arg is T) {
  return (arg: unknown): arg is T | undefined => {
    if (arg === undefined) {
      return true;
    } else {
      return cb(arg);
    }
  };
}

export function makeNullable<T>(cb: (arg: unknown) => arg is T) {
  return (arg: unknown): arg is T | null => {
    if (arg === null) {
      return true;
    } else {
      return cb(arg);
    }
  };
}

export function makeNullish<T>(cb: (arg: unknown) => arg is T) {
  return (arg: unknown): arg is T | null | undefined => {
    if (arg === null || arg === undefined) {
      return true;
    } else {
      return cb(arg);
    }
  };
}

/**
 * This returns a function which transforms a value before validating it.
 * The returned function calls a callback which provides the returned value
 * and
 */
export function transform<T, U = T>(
  transformFn: (arg: unknown) => T,
  validate: (arg: unknown) => arg is U,
): ValidatorFnWithTransformCb<T> {
  // Initialize the function
  const fn = (
    arg: unknown,
    cb?: (transformedValue: T, isValid?: boolean) => void,
  ): arg is T => {
    if (arg !== undefined) {
      arg = transformFn(arg);
    }
    const isValid = validate(arg);
    cb?.(arg as T, isValid);
    return isValid;
  };
  // Set properties
  (fn as unknown as Record<symbol, unknown>)[kTransformFunction] = true;
  Object.defineProperty(fn, 'name', {
    value: `transform-${validate.name}`,
  });
  // Return
  return fn;
}

/**
 * Check if a function is a transform function by looking at the symbol.
 */
export function isTransformFn(
  arg: AnyFunction,
): arg is ValidatorFnWithTransformCb<unknown> {
  return (
    isFunction(arg) &&
    (arg as unknown as Record<symbol, unknown>)[kTransformFunction] === true
  );
}

// **** ParseBoolean **** //

export function parseBoolean(arg: unknown, errMsg?: string): boolean {
  if (typeof arg === 'boolean') return arg;
  if (typeof arg === 'number') {
    if (arg === 1) return true;
    if (arg === 0) return false;
  }
  if (typeof arg === 'string') {
    const normalized = arg.toLowerCase();
    if (normalized in BOOLEAN_MAP) return BOOLEAN_MAP[normalized];
  }
  throw new Error(errMsg ?? 'Argument must be a valid boolean.');
}

export function parseOptionalBoolean(arg: unknown): boolean | undefined {
  if (arg === undefined) {
    return arg;
  } else {
    return parseBoolean(arg, 'Argument must be a valid boolean | undefined.');
  }
}

export function parseNullableBoolean(arg: unknown): boolean | null {
  if (arg === null) {
    return arg;
  } else {
    return parseBoolean(arg, 'Argument must be a valid boolean | null.');
  }
}

export function parseNullishBoolean(arg: unknown): boolean | null | undefined {
  if (arg === null || arg === undefined) {
    return arg;
  } else {
    return parseBoolean(
      arg,
      'Argument must be a valid boolean | null | undefined.',
    );
  }
}

// **** ParseJson **** //

export function parseJson<T>(arg: unknown): T {
  if (isString(arg)) {
    return JSON.parse(arg) as T;
  } else {
    throw Error('JSON parse argument must be a string.');
  }
}

export function parseOptionalJson<T>(arg: unknown): T | undefined {
  if (arg === undefined) {
    return arg;
  } else if (isString(arg)) {
    return JSON.parse(arg) as T;
  } else {
    throw Error('JSON parse argument must be string or undefined.');
  }
}

export function parseNullableJson<T>(arg: unknown): T | null {
  if (arg === null) {
    return arg;
  } else if (isString(arg)) {
    return JSON.parse(arg) as T;
  } else {
    throw Error('JSON parse argument must be string or null.');
  }
}

export function parseNullishJson<T>(arg: unknown): T | null | undefined {
  if (arg === null || arg === undefined) {
    return arg;
  } else if (isString(arg)) {
    return JSON.parse(arg) as T;
  } else {
    throw Error('JSON parse argument must be string, null, or undefined.');
  }
}
