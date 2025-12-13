/* eslint-disable max-len */
import { type IParseValidatorFn, type TParseOnError } from './parseObject.js';
import { isString } from './helpers.js';


// **** Types **** //

export interface ITransformValidatorFn<T> {
  (arg: unknown, cb?: (arg: T) => void): arg is T;
  isTransformFunction?: true; 
}
  

// **** Simple Util **** //

/**
 * Extract null/undefined from a validator function. Have to provide an errorCb in case
 * we are wrapping a nested schema function.
 */
export function nonNullable<T>(cb: IParseValidatorFn<T>) {
  return (arg: unknown, onError?: TParseOnError): arg is NonNullable<T> => {
    if (arg === null || arg === undefined) {
      return false;
    } else {
      return cb(arg, onError);
    }
  };
}

/**
 * Allow param to be undefined
 */
export function makeOptional<T>(cb: ((arg: unknown) => arg is T)) {
  return (arg: unknown): arg is (T | undefined) => {
    if (arg === undefined) {
      return true;
    } else {
      return cb(arg);
    }
  };
}

/**
 * Allow param to be undefined
 */
export function makeNullable<T>(cb: ((arg: unknown) => arg is T)) {
  return (arg: unknown): arg is (T | null) => {
    if (arg === null) {
      return true;
    } else {
      return cb(arg);
    }
  };
}

/**
 * Allow param to be undefined
 */
export function makeNullish<T>(cb: ((arg: unknown) => arg is T)) {
  return (arg: unknown): arg is (T | null | undefined) => {
    if (arg === null || arg === undefined) {
      return true;
    } else {
      return cb(arg);
    }
  };
}

/**
 * Transform a value before checking it.
 */
export function transform<T>(
  transformFn: (arg: unknown) => T,
  validate: ((arg: unknown) => arg is T),
): ITransformValidatorFn<T> {
  const retFn = (arg: unknown, cb?: (arg: T) => void): arg is T => {
    if (arg !== undefined) {
      arg = transformFn(arg);
    }
    cb?.(arg as T);
    return validate(arg);
  };
  Object.defineProperty(retFn, 'isTransformFunction', {
    value: true,
    writable: false,
  });
  return retFn;
}

// **** ParseBoolean **** //

/**
 * Convert all string/number boolean types to a boolean. If not a valid boolean
 * return "undefined".
 */
export function parseBoolean(arg: unknown, errMsg?: string): boolean {
  if (typeof arg === 'string') {
    arg = arg.toLowerCase();
    if (arg === 'true') {
      return true;
    } else if (arg === 'false') {
      return false;
    } else if (arg === 'yes') {
      return true;
    } else if (arg === 'no') {
      return false;
    } else if (arg === '1') {
      return true;
    } else if (arg === '0') {
      return false;
    }
  } else if (typeof arg === 'number') {
    if (arg === 1) {
      return true;
    } else if (arg === 0) {
      return false;
    }
  } else if (typeof arg === 'boolean') {
    return arg;
  }
  // Default
  throw new Error(errMsg ?? 'Argument must be a valid boolean.');
}

/***
 * Parse optional boolean.
 */
export function parseOptionalBoolean(arg: unknown): boolean | undefined {
  if (arg === undefined) {
    return arg;
  } else {
    return parseBoolean(arg, 'Argument must be a valid boolean | undefined.');
  }
}

/***
 * Parse nullable boolean.
 */
export function parseNullableBoolean(arg: unknown): boolean | null {
  if (arg === null) {
    return arg;
  } else {
    return parseBoolean(arg, 'Argument must be a valid boolean | null.');
  }
}

/***
 * Parse nullish boolean.
 */
export function parseNullishBoolean(arg: unknown): boolean | null | undefined {
  if (arg === null || arg === undefined) {
    return arg;
  } else {
    return parseBoolean(arg, 'Argument must be a valid boolean | null | undefined.');
  }
}

// **** ParseJson **** //

/**
 * Parse a JSON string.
 */
export function parseJson<T>(arg: unknown): T {
  if (isString(arg)) {
    return JSON.parse(arg) as T;
  } else {
    throw Error('JSON parse argument must be a string.');
  }
}

/**
 * Parse a JSON string.
 */
export function parseOptionalJson<T>(arg: unknown): T | undefined {
  if (arg === undefined) {
    return arg;
  } else if (isString(arg)) {
    return JSON.parse(arg) as T;
  } else {
    throw Error('JSON parse argument must be string or undefined.');
  }
}

/**
 * Parse a JSON string.
 */
export function parseNullableJson<T>(arg: unknown): T | null {
  if (arg === null) {
    return arg;
  } else if (isString(arg)) {
    return JSON.parse(arg) as T;
  } else {
    throw Error('JSON parse argument must be string or null.');
  }
}

/**
 * Parse a JSON string.
 */
export function parseNullishJson<T>(arg: unknown): T | null | undefined {
  if (arg === null || arg === undefined) {
    return arg;
  } else if (isString(arg)) {
    return JSON.parse(arg) as T;
  } else {
    throw Error('JSON parse argument must be string, null, or undefined.');
  }
}
