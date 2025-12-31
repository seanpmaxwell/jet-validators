import {
  isTransformFn,
  type ValidatorFnWithTransformCb,
} from '../simple-utils.js';

import { isPlainObject } from '../../basic.js';
import { isSafe } from './mark-safe.js';

import testObjectCore, {
  isTestObjectCoreFn,
  type TestObjectFn,
} from './testObjectCore.js';

/******************************************************************************
                                Constants
******************************************************************************/

export const SAFETY = {
  Loose: 1,
  Normal: 2,
  Strict: 3,
} as const;

export const ERRORS = {
  NotOptional: 'Root argument is undefined but not optional.',
  NotNullable: 'Root argument is null but not nullable.',
  NotObject: 'Root argument is not an object',
  NotArray: 'Root argument is not an array.',
  ValidatorFn: 'Validator function returned false.',
  StrictSafety: 'Strict mode found an unknown or invalid property.',
  SchemaProp(key: string) {
    return `Schema property "${key}" must be a function or nested schema.`;
  },
} as const;

/******************************************************************************
                                  Types
******************************************************************************/

export type Safety = (typeof SAFETY)[keyof typeof SAFETY];
type PlainObject = Record<string, unknown>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObject = Record<string, any>;
type KeySet = Record<string, boolean>;

// **** Validation Schema **** //

export type Schema<T> = {
  [K in keyof T]: T[K] extends PlainObject
    ? Schema<T[K]> | ValidatorFn<T[K]>
    : ValidatorFn<T[K]>;
};

export type ValidatorFn<T> =
  | ((arg: unknown) => arg is T)
  | ValidatorFnWithTransformCb<T>
  | TestObjectFn<T>;

type ValidatorClosure = (
  param: PlainObject,
  clone: PlainObject,
  errors: ParseError[] | null,
) => boolean;

// type ValidatorItem = {
//   key: string;
//   name: string;
// } & (
//   | {
//       fn: ValidatorFn<unknown>;
//       isSafe: true;
//       isTransformFn?: false;
//       isTestObjectFn?: false;
//     }
//   | {
//       fn: ValidatorFn<unknown>;
//       isSafe?: false;
//       isTestObjectFn?: false;
//       isTransformFn?: false;
//     }
//   | {
//       fn: ValidatorFnWithTransformCb<unknown>;
//       isTransformFn: true;
//       isSafe?: false;
//       isTestObjectFn?: false;
//     }
//   | {
//       fn: TestObjectFn<unknown>;
//       isTestObjectFn: true;
//       isSafe?: false;
//       isTransformFn?: false;
//     }
// );

// **** Error Handling **** //

export type ParseError = {
  info: string;
  functionName: string; // name of the validator function
  value?: unknown;
  caught?: string; // if a ValidatorItem caught an error from an unsafe function
} & (
  | {
      key: string;
      keyPath?: never;
    }
  | {
      keyPath: string[];
      key?: never;
    }
);

export type OnErrorCallback = (errors: ParseError[]) => void;

/******************************************************************************
                                  Functions
******************************************************************************/

/**
 * Do basic checks before core parsing
 */
function parseObjectCore(
  isOptional: boolean,
  isNullable: boolean,
  isArray: boolean,
  schema: Schema<unknown>,
  safety: Safety,
  onError?: OnErrorCallback,
) {
  const { array, keySet } = setupValidatorArray(schema, safety);
  return (param: unknown, localOnError?: OnErrorCallback) => {
    const errorCb = onError ?? localOnError,
      errors: ParseError[] | null = errorCb ? [] : null;
    const result = parseObjectCoreHelper(
      isOptional,
      isNullable,
      isArray,
      array,
      keySet,
      safety,
      errors,
      param,
    );
    if (result === false) {
      if (!!errors && errors.length > 0) {
        errorCb?.(errors!);
      }
      return false;
    } else {
      return result;
    }
  };
}

/**
 * Setup fast validator tree
 */
function setupValidatorArray(
  schema: Schema<unknown>,
  safety: Safety,
): { array: ValidatorClosure[]; keySet: KeySet } {
  // Initialize new node
  const keys = Object.keys(schema),
    validatorArray: ValidatorClosure[] = [],
    keySet: KeySet = Object.create(null);

  // Iterate the schema
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i],
      fnOrObject = (schema as AnyObject)[key],
      name = fnOrObject.name || '<anonymous>';
    keySet[key] = true;

    // ** Setup isSafe ** //
    if (isSafe(fnOrObject)) {
      validatorArray.push((param, clone, errors) => {
        const value = param[key],
          isValid = fnOrObject(value);
        if (!isValid) {
          if (!errors) return false;
          errors.push({
            info: ERRORS.ValidatorFn,
            functionName: name,
            value,
            key,
          });
        } else {
          if (value !== undefined || key in param) {
            clone[key] =
              !!value && typeof value === 'object' ? deepClone(value) : value;
          }
        }
        return isValid;
      });

      // ** Setup nested-validators **** //
    } else if (
      isTestObjectCoreFn(fnOrObject) ||
      typeof fnOrObject === 'object'
    ) {
      let vldr: TestObjectFn<unknown> = fnOrObject;
      if (typeof fnOrObject === 'object') {
        vldr = testObjectCore(false, false, false, fnOrObject, safety);
      }
      validatorArray.push((param, clone, errors) => {
        let value = param[key];
        const bubbleUpErrors = !!errors
          ? (nestedErrors: ParseError[]) =>
              appendNestedErrors(errors, nestedErrors, key)
          : undefined;
        const isValid = vldr(value, bubbleUpErrors, (nVal) => (value = nVal));
        if (isValid && (value !== undefined || key in param)) {
          clone[key] =
            !!value && typeof value === 'object' ? deepClone(value) : value;
        }
        return isValid;
      });

      // ** Setup transform functions ** //
    } else if (isTransformFn(fnOrObject)) {
      validatorArray.push((param, clone, errors) => {
        let value = param[key],
          isValid: boolean = false;
        try {
          isValid = fnOrObject(value, (tVal, isValidInner) => {
            if (isValidInner) {
              value = tVal;
            }
            if (isValidInner && (value !== undefined || key in param)) {
              clone[key] =
                // Don't need to clone again if fresh object
                !!value && typeof value === 'object' && value === tVal
                  ? deepClone(value)
                  : value;
            }
          });
          if (!isValid) throw null;
        } catch (err) {
          if (!errors) return false;
          errors.push({
            info: ERRORS.ValidatorFn,
            functionName: name,
            value,
            ...formatCaughtError(err),
            key,
          });
        }
        return isValid;
      });

      // ** Setup unsafe functions ** //
    } else if (typeof fnOrObject === 'function') {
      validatorArray.push((param, clone, errors) => {
        const value = param[key];
        let isValid: boolean;
        try {
          if (!fnOrObject(value)) throw null;
          isValid = true;
          if (value !== undefined || key in param) {
            clone[key] = deepClone(value);
          }
        } catch (err) {
          if (!errors) return false;
          isValid = false;
          errors.push({
            info: ERRORS.ValidatorFn,
            functionName: name,
            value,
            ...formatCaughtError(err),
            key,
          });
        }
        return isValid;
      });
    } else {
      throw new Error(ERRORS.SchemaProp(key));
    }
  }
  // Return
  return { array: validatorArray, keySet };
}

/**
 * Do basic checks before core parsing with errors.
 */
function parseObjectCoreHelper(
  isOptional: boolean,
  isNullable: boolean,
  isArray: boolean,
  validatorArray: ValidatorClosure[],
  keySet: KeySet,
  safety: Safety,
  errors: ParseError[] | null,
  param: unknown,
) {
  // Check undefined
  if (param === undefined) {
    if (isOptional) {
      return undefined;
    } else {
      errors?.push({
        info: ERRORS.NotOptional,
        functionName: '<optional>',
        value: undefined,
        key: '',
      });
      return false;
    }
  }
  // Check null
  if (param === null) {
    if (isNullable) {
      return null;
    } else {
      errors?.push({
        info: ERRORS.NotNullable,
        functionName: '<nullable>',
        value: null,
        key: '',
      });
      return false;
    }
  }
  // Make sure param is an array
  if (isArray) {
    if (!Array.isArray(param)) {
      errors?.push({
        info: ERRORS.NotArray,
        functionName: '<isArray>',
        value: param,
        key: '',
      });
      return false;
    }
    // Run the parseFn with an individual error state
    const paramClone = new Array(param.length);
    let isValid = true;
    for (let i = 0; i < param.length; i++) {
      const nestedErrors: ParseError[] | null = errors ? [] : null;
      const result = validateAndSanitize(
        param[i],
        validatorArray,
        keySet,
        safety,
        nestedErrors,
      );
      if (result === false && !errors) return false;
      if (!!nestedErrors && nestedErrors?.length > 0) {
        appendNestedErrors(errors!, nestedErrors, i);
      }
      if (result !== false && isValid) {
        paramClone[i] = result;
      } else {
        isValid = false;
      }
    }
    return isValid ? paramClone : false;
  }
  // Default
  if (isPlainObject(param)) {
    return validateAndSanitize(param, validatorArray, keySet, safety, errors);
  } else {
    errors?.push({
      info: ERRORS.NotObject,
      functionName: '<isPlainObject>',
      value: param,
      key: '',
    });
    return false;
  }
}

/**
 * Run the validators and return a cleaned clone object.
 */
function validateAndSanitize(
  param: PlainObject,
  validatorArray: ValidatorClosure[],
  keySet: KeySet,
  safety: Safety,
  errors: ParseError[] | null,
): PlainObject | false {
  // Run validators
  const clone: PlainObject = {};
  let isValid = true;
  for (let i = 0; i < validatorArray.length; i++) {
    const vldr = validatorArray[i];
    if (!vldr(param, clone, errors)) {
      if (!errors) {
        return false;
      }
      isValid = false;
    }
  }
  // Sanitize
  if (safety !== SAFETY.Normal) {
    const paramKeys = Object.keys(param);
    for (let i = 0; i < paramKeys.length; i++) {
      const key = paramKeys[i];
      if (keySet[key]) continue;
      if (safety === SAFETY.Strict) {
        if (!errors) return false;
        isValid = false;
        errors.push({
          info: ERRORS.StrictSafety,
          functionName: '<strict>',
          value: param[key],
          key,
        });
      } else {
        const value = param[key];
        clone[key] =
          !!value && typeof value === 'object' ? deepClone(value) : value;
      }
    }
  }
  // Return clone
  return isValid ? clone : false;
}

/******************************************************************************
                                Helpers
            Helpers kept in same file for minor performance
******************************************************************************/

/**
 * Format the caught error so it can be added to the error object.
 */
function formatCaughtError(error: unknown) {
  let errMsg = null;
  if (error instanceof Error) {
    errMsg = error.message;
  } else if (error !== null) {
    errMsg = String(error);
  }
  return errMsg !== null ? { caught: errMsg } : {};
}

/**
 * Add nested errors to the array
 */
function appendNestedErrors(
  errors: ParseError[],
  nestedErrors: ParseError[],
  prepend: string | number,
): void {
  for (const error of nestedErrors) {
    if (error.key) {
      (error as PlainObject).keyPath = [String(prepend), error.key];
      delete (error as PlainObject).key;
    } else {
      error.keyPath = [String(prepend), ...(error.keyPath ?? [])];
    }
    errors.push(error);
  }
}

/******************************************************************************
                        DeepClone stuff from ChatGPT
******************************************************************************/

function deepClone<T>(value: T): T {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  if (Array.isArray(value)) {
    return cloneArray(value) as T;
  }
  const proto = Object.getPrototypeOf(value);
  if (proto === Object.prototype || proto === null) {
    return clonePlainObject(value as PlainObject) as T;
  }
  return cloneExotic(value);
}

function cloneArray(source: unknown[]): unknown[] {
  const out = new Array(source.length);
  for (let i = 0; i < source.length; i++) {
    out[i] = deepClone(source[i]);
  }
  return out;
}

function clonePlainObject(source: PlainObject): PlainObject {
  const out: PlainObject = {};
  const keys = Object.keys(source);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    out[key] = deepClone(source[key]);
  }
  return out;
}

function cloneExotic<T>(value: T): T {
  if (value instanceof Date) return new Date(value.getTime()) as T;
  if (value instanceof RegExp)
    return new RegExp(value.source, value.flags) as T;
  if (value instanceof Map) {
    const out = new Map();
    for (const [k, v] of value) out.set(deepClone(k), deepClone(v));
    return out as T;
  }
  if (value instanceof Set) {
    const out = new Set();
    for (const v of value) out.add(deepClone(v));
    return out as T;
  }
  if (ArrayBuffer.isView(value)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new (value.constructor as any)(
      value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength),
    );
  }
  if (value instanceof ArrayBuffer) {
    return value.slice(0) as T;
  }
  const out = Object.create(Object.getPrototypeOf(value));
  for (const key of Object.keys(value as object)) {
    out[key] = deepClone((value as PlainObject)[key]);
  }
  return out;
}

/******************************************************************************
                                Export
******************************************************************************/

export default parseObjectCore;
