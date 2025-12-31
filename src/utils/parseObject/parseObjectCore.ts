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

type ValidatorItem = {
  key: string;
  name: string;
} & (
  | {
      fn: ValidatorFn<unknown>;
      isSafe: true;
      isTransformFn?: false;
      isTestObjectFn?: false;
    }
  | {
      fn: ValidatorFn<unknown>;
      isSafe?: false;
      isTestObjectFn?: false;
      isTransformFn?: false;
    }
  | {
      fn: ValidatorFnWithTransformCb<unknown>;
      isTransformFn: true;
      isSafe?: false;
      isTestObjectFn?: false;
    }
  | {
      fn: TestObjectFn<unknown>;
      isTestObjectFn: true;
      isSafe?: false;
      isTransformFn?: false;
    }
);

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
): { array: ValidatorItem[]; keySet: KeySet } {
  // Initialize new node
  const keys = Object.keys(schema),
    validatorArray: ValidatorItem[] = [],
    keySet: KeySet = Object.create(null);
  // Iterate the schema
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i],
      schemaValue = (schema as AnyObject)[key];
    keySet[key] = true;
    if (typeof schemaValue === 'function') {
      const name = schemaValue.name || '<anonymous>';
      if (isSafe(schemaValue)) {
        validatorArray.push({ key, fn: schemaValue, name, isSafe: true });
      } else if (isTestObjectCoreFn(schemaValue)) {
        validatorArray.push({
          key,
          fn: schemaValue,
          name: '',
          isTestObjectFn: true,
        });
      } else if (isTransformFn(schemaValue)) {
        validatorArray.push({
          key,
          fn: schemaValue,
          name,
          isTransformFn: true,
        });
      } else {
        validatorArray.push({ key, fn: schemaValue, name });
      }
      // Recurse down the tree
    } else if (typeof schemaValue === 'object') {
      const fn = testObjectCore(false, false, false, schemaValue, safety);
      validatorArray.push({ key, fn, name: '', isTestObjectFn: true });
      // Throw error
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
  validatorArray: ValidatorItem[],
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
  validatorArray: ValidatorItem[],
  keySet: KeySet,
  safety: Safety,
  errors: ParseError[] | null,
): PlainObject | false {
  // ** Run validators ** //
  const clean: PlainObject = {};
  let isValid = true;
  for (let i = 0; i < validatorArray.length; i++) {
    const vldr = validatorArray[i],
      vldrKey = vldr.key;
    let value = param[vldrKey],
      doDeepClone = !!value && typeof value === 'object';
    // Safe validator
    if (vldr.isSafe) {
      if (!vldr.fn(value)) {
        if (!errors) return false;
        isValid = false;
        errors.push({
          info: ERRORS.ValidatorFn,
          functionName: vldr.name,
          value,
          key: vldrKey,
        });
      }
      // Nested TestObject function
    } else if (vldr.isTestObjectFn) {
      doDeepClone = false;
      const bubbleUpErrors = !!errors
        ? (nestedErrors: ParseError[]) =>
            appendNestedErrors(errors, nestedErrors, vldrKey)
        : undefined;
      const localIsValid = vldr.fn(
        value,
        bubbleUpErrors,
        (nVal) => (value = nVal),
      );
      if (!localIsValid) {
        if (!errors) return false;
        isValid = false;
      }
      // Unsafe validators
    } else {
      try {
        let localIsValid;
        if (vldr.isTransformFn) {
          localIsValid = vldr.fn(value, (tVal, isValid) => {
            if (isValid) {
              value = tVal;
            }
            // Don't need to clone again if fresh object
            if (value !== tVal) {
              doDeepClone = false;
            }
          });
        } else {
          localIsValid = vldr.fn(value);
        }
        if (!localIsValid) throw null;
        // Catch any thrown errors
      } catch (err) {
        if (!errors) return false;
        isValid = false;
        errors.push({
          info: ERRORS.ValidatorFn,
          functionName: vldr.name,
          value,
          ...formatCaughtError(err),
          key: vldrKey,
        });
      }
    }
    // Add the value to the clean object
    if (isValid && (value !== undefined || vldrKey in param)) {
      clean[vldrKey] = doDeepClone ? deepClone(value) : value;
    }
  }
  // ** Sanitize ** //
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
        clean[key] =
          !!value && typeof value === 'object' ? deepClone(value) : value;
      }
    }
  }
  // Return clone
  return isValid ? clean : false;
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
