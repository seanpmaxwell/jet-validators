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
type AnyFunction = (...args: any[]) => any;

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

interface ValidatorItem {
  key: string;
  fn: ValidatorFn<unknown>;
  name: string;
}

interface ValidatorObject {
  safeValidators: ValidatorItem[];
  unSafeValidators: ValidatorItem[];
  valueObject: PlainObject;
  keySet: Set<string>;
  transformedValuesObject: PlainObject | null;
}

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
  const validatorObject = setupValidatorTree(schema, safety);
  return (param: unknown, localOnError?: OnErrorCallback) => {
    const errorCb = onError ?? localOnError;
    // Run the parse function
    if (!errorCb) {
      return parseObjectCoreHelper(
        isOptional,
        isNullable,
        isArray,
        validatorObject,
        safety,
        param,
      );
      // Run the parse function with an error array
    } else {
      const errors: ParseError[] = [];
      const result = parseObjectCoreHelperWithErrors(
        isOptional,
        isNullable,
        isArray,
        validatorObject,
        safety,
        errors,
        param,
      );
      if (result === false) {
        errorCb(errors);
        return false;
      } else {
        return result;
      }
    }
  };
}

/**
 * Setup fast validator tree
 */
function setupValidatorTree(
  schema: Schema<unknown>,
  safety: Safety,
): ValidatorObject {
  // Initialize new node
  const keys = Object.keys(schema);
  const vo: ValidatorObject = {
    safeValidators: [],
    unSafeValidators: [],
    valueObject: {},
    keySet: new Set(keys),
    transformedValuesObject: null,
  };
  // Iterate the schema
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i],
      item = (schema as Record<string, ValidatorFn<unknown>>)[key];
    if (typeof item === 'function') {
      const name = item.name || '<anonymous>';
      if (isSafe(item)) {
        vo.safeValidators.push({ key, fn: item, name });
      } else {
        vo.unSafeValidators.push({ key, fn: item, name });
      }
      // Recurse down the tree
    } else if (isPlainObject(schema)) {
      const nestedSchema = schema[key] as Schema<unknown>,
        fn = testObjectCore(false, false, false, nestedSchema, safety);
      vo.safeValidators.push({ key, fn, name: '' });
      // Throw error
    } else {
      throw new Error(ERRORS.SchemaProp(key));
    }
  }
  // Return
  return vo;
}

/**
 * Do basic checks before core parsing
 */
function parseObjectCoreHelper(
  isOptional: boolean,
  isNullable: boolean,
  isArray: boolean,
  vo: ValidatorObject,
  safety: Safety,
  param: unknown,
) {
  // Check nullables
  if (param === undefined) {
    return isOptional ? undefined : false;
  }
  if (param === null) {
    return isNullable ? undefined : false;
  }
  // Check array
  if (isArray) {
    if (!Array.isArray(param)) {
      return false;
    }
    // Run the parseFn without an individual error state
    const paramClone = new Array(param.length);
    for (let i = 0; i < param.length; i++) {
      const result = validateAndSanitize(param[i], vo, safety);
      if (result !== false) {
        paramClone[i] = result;
      } else {
        return false;
      }
    }
    return paramClone;
  }
}

/**
 * Do basic checks before core parsing with errors.
 */
function parseObjectCoreHelperWithErrors(
  isOptional: boolean,
  isNullable: boolean,
  isArray: boolean,
  vo: ValidatorObject,
  safety: Safety,
  errors: ParseError[],
  param: unknown,
) {
  // Check undefined
  if (param === undefined) {
    if (isOptional) {
      return undefined;
    } else {
      errors.push({
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
      errors.push({
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
      errors.push({
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
      const nestedErrors: ParseError[] = [],
        result = validateAndSanitizeWithErrors(
          param[i],
          vo,
          safety,
          nestedErrors,
        );
      if (nestedErrors.length > 0) {
        prependErrorKeyPaths(nestedErrors, i);
        errors.push(...nestedErrors);
      }
      if (result !== false && isValid) {
        paramClone[i] = result;
      } else {
        isValid = false;
      }
    }
    return isValid ? paramClone : false;
  }
}

/**
 * Run the validators and return a cleaned clone object.
 */
function validateAndSanitize(
  param: unknown,
  vo: ValidatorObject,
  safety: Safety,
): PlainObject | false {
  // Check param is object
  if (!isPlainObject(param)) {
    return false;
  }
  // Run safe validators
  const safeValidators = vo.safeValidators,
    clean: PlainObject = {};
  for (let i = 0; i < safeValidators.length; i++) {
    const vldr = safeValidators[i],
      vldrFn: AnyFunction = vldr.fn,
      vldrKey = vldr.key,
      toValidate = param[vldrKey];
    // Transform validator function
    if (isTransformFn(vldrFn)) {
      const result = vldrFn(toValidate, (newValue) => {
        clean[vldrKey] = newValue;
      });
      if (!result) return false;
      // Nested testObject function
    } else if (isTestObjectCoreFn(vldrFn)) {
      const result = vldrFn(toValidate, undefined, (modifiedValue) => {
        clean[vldrKey] = modifiedValue;
      });
      if (!result) return false;
      // Standard validator function
    } else {
      if (!vldrFn(toValidate)) return false;
      clean[vldrKey] = deepClone(toValidate);
    }
  }
  // Run unsafe validators
  const unSafeValidators = vo.unSafeValidators;
  for (let i = 0; i < unSafeValidators.length; i++) {
    const vldr = unSafeValidators[i];
    try {
      const vldrFn: AnyFunction = vldr.fn,
        vldrKey = vldr.key,
        toValidate = param[vldrKey];
      let result;
      if (isTransformFn(vldrFn)) {
        result = vldrFn(toValidate, (newValue) => {
          clean[vldrKey] = newValue;
        });
      } else {
        result = vldrFn(toValidate);
        clean[vldrKey] = deepClone(toValidate);
      }
      if (!result) throw null;
    } catch {
      return false;
    }
  }
  // Sanitize
  for (const key in param) {
    if (!vo.keySet.has(key)) {
      if (safety === SAFETY.Strict) {
        return false;
      } else if (safety === SAFETY.Normal) {
        delete clean[key];
      }
    }
  }
  // Return clone
  return clean;
}

/**
 * Run the validators and return a cleaned clone object.
 */
function validateAndSanitizeWithErrors(
  param: unknown,
  vo: ValidatorObject,
  safety: Safety,
  errors: ParseError[],
): PlainObject | false {
  // ** Check param is object ** //
  if (!isPlainObject(param)) {
    errors.push({
      info: ERRORS.NotObject,
      functionName: '<isPlainObject>',
      value: param,
      key: '',
    });
    return false;
  }
  // ** Run safe validators ** //
  const safeValidators = vo.safeValidators,
    clean: PlainObject = {};
  for (let i = 0; i < safeValidators.length; i++) {
    const vldr = safeValidators[i],
      vldrFn: AnyFunction = vldr.fn,
      vldrKey = vldr.key,
      toValidate = param[vldrKey];
    // Transform validator function
    if (isTransformFn(vldrFn)) {
      const result = vldrFn(toValidate, (newValue) => {
        clean[vldrKey] = newValue;
      });
      if (!result) {
        errors.push({
          info: ERRORS.ValidatorFn,
          functionName: vldr.name,
          value: toValidate,
          key: vldrKey,
        });
        return false;
      }
      // Nested testObject function
    } else if (isTestObjectCoreFn(vldrFn)) {
      const result = vldrFn(
        toValidate,
        (nestedErrors: ParseError[]) => {
          prependErrorKeyPaths(nestedErrors, vldrKey);
          errors.push(...nestedErrors);
        },
        (modifiedValue) => (clean[vldrKey] = modifiedValue),
      );
      if (!result) return false;
      // Standard validator function
    } else {
      if (!vldrFn(toValidate)) {
        errors.push({
          info: ERRORS.ValidatorFn,
          functionName: vldr.name,
          value: toValidate,
          key: vldrKey,
        });
        return false;
      }
      clean[vldrKey] = deepClone(toValidate);
    }
  }
  // ** Run unsafe validators ** //
  const unSafeValidators = vo.unSafeValidators;
  for (let i = 0; i < unSafeValidators.length; i++) {
    const vldr = unSafeValidators[i],
      vldrFn: AnyFunction = vldr.fn,
      vldrKey = vldr.key,
      toValidate = param[vldr.key];
    // Run test
    try {
      let result;
      if (isTransformFn(vldrFn)) {
        result = vldrFn(toValidate, (newValue) => {
          clean[vldrKey] = newValue;
        });
      } else {
        result = vldrFn(toValidate);
      }
      if (!result) throw null;
      // Catch any thrown errors
    } catch (err) {
      let errMsg = null;
      if (err instanceof Error) {
        errMsg = err.message;
      } else if (err !== null) {
        errMsg = String(err);
      }
      errors.push({
        info: ERRORS.ValidatorFn,
        functionName: vldr.name,
        value: toValidate,
        ...(errMsg !== null ? { caught: errMsg } : {}),
        key: vldrKey,
      });
    }
  }
  // ** Sanitize ** //
  for (const key in param) {
    if (!vo.keySet.has(key)) {
      if (safety === SAFETY.Strict) {
        errors.push({
          info: ERRORS.StrictSafety,
          functionName: '<strict>',
          value: param[key],
          key,
        });
        return false;
      } else if (safety === SAFETY.Normal) {
        delete clean[key];
      }
    }
  }
  // Return clone
  return clean;
}

/******************************************************************************
                                Helpers
            Helpers kept in same file for minor performance
******************************************************************************/

/**
 * Prepend an array of error keyPaths
 */
function prependErrorKeyPaths(errors: ParseError[], prepend: string | number) {
  for (const error of errors) {
    if (error.key) {
      (error as PlainObject).keyPath = [String(prepend), error.key];
      delete (error as PlainObject).key;
    } else {
      error.keyPath = [String(prepend), ...(error.keyPath ?? [])];
    }
    errors.push(error);
  }
  return errors;
}

/**
 * Return a value or deep clone it if it's an object.
 */
function deepClone<T>(value: T): T {
  // Primitives
  if (value === null || typeof value !== 'object') {
    return value;
  }
  // Date
  if (value instanceof Date) {
    return new Date(value.getTime()) as T;
  }
  // RegExp
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as T;
  }
  // Map
  if (value instanceof Map) {
    const out = new Map();
    for (const [k, v] of value) {
      out.set(deepClone(k), deepClone(v));
    }
    return out as T;
  }
  // Set
  if (value instanceof Set) {
    const out = new Set();
    for (const v of value) {
      out.add(deepClone(v));
    }
    return out as T;
  }
  // Array
  if (Array.isArray(value)) {
    const out = new Array(value.length);
    for (let i = 0; i < value.length; i++) {
      out[i] = deepClone(value[i]);
    }
    return out as T;
  }
  // Typed arrays / ArrayBuffer views
  if (ArrayBuffer.isView(value)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new (value.constructor as any)(
      value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength),
    );
  }
  // ArrayBuffer
  if (value instanceof ArrayBuffer) {
    return value.slice(0) as T;
  }
  // Plain object OR class instance
  const proto = Object.getPrototypeOf(value),
    out = Object.create(proto),
    keys = Object.keys(value as object);
  // Go down
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    (out as PlainObject)[k] = deepClone((value as PlainObject)[k]);
  }
  return out;
}

/******************************************************************************
                                Export
******************************************************************************/

export default parseObjectCore;
