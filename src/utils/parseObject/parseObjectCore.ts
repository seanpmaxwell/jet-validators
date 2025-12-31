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

interface ValidatorObject {
  validators: ValidatorItem[];
  keySet: Record<string, boolean>;
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
    validators: [],
    keySet: {},
  };
  // Iterate the schema
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i],
      schemaValue = (schema as AnyObject)[key];
    vo.keySet[key] = true;
    if (typeof schemaValue === 'function') {
      const name = schemaValue.name || '<anonymous>';
      if (isSafe(schemaValue)) {
        vo.validators.push({ key, fn: schemaValue, name, isSafe: true });
      } else if (isTestObjectCoreFn(schemaValue)) {
        vo.validators.push({
          key,
          fn: schemaValue,
          name: '',
          isTestObjectFn: true,
        });
      } else if (isTransformFn(schemaValue)) {
        vo.validators.push({ key, fn: schemaValue, name, isTransformFn: true });
      } else {
        vo.validators.push({ key, fn: schemaValue, name });
      }
      // Recurse down the tree
    } else if (typeof schemaValue === 'object') {
      const fn = testObjectCore(false, false, false, schemaValue, safety);
      vo.validators.push({ key, fn, name: '', isTestObjectFn: true });
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
    return isNullable ? null : false;
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
  // Default
  return validateAndSanitize(param, vo, safety);
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
        appendNestedErrors(errors, nestedErrors, i);
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
  return validateAndSanitizeWithErrors(param, vo, safety, errors);
}

/**
 * Run the validators and return a cleaned clone object.
 */
function validateAndSanitize(
  param: unknown,
  vo: ValidatorObject,
  safety: Safety,
): PlainObject | false {
  // ** Check param is object ** //
  if (!isPlainObject(param)) {
    return false;
  }
  // ** Run safe validators ** //
  const clean: PlainObject = {},
    validators = vo.validators;
  for (let i = 0; i < validators.length; i++) {
    const vldr = validators[i],
      vldrKey = vldr.key;
    let value = param[vldrKey],
      doDeepClone = true;
    // Run different validator functions
    if (vldr.isSafe) {
      if (!vldr.fn(value)) return false;
    } else if (vldr.isTestObjectFn) {
      const isValid = vldr.fn(value, undefined, (nVal) => (value = nVal));
      if (!isValid) return false;
      doDeepClone = false;
    } else {
      let isValid;
      try {
        if (vldr.isTransformFn) {
          isValid = vldr.fn(value, (tVal) => (value = tVal));
        } else {
          isValid = vldr.fn(value);
        }
        if (!isValid) throw null;
      } catch {
        return false;
      }
    }
    // Add the value to the clean object
    if (vldrKey in param) {
      clean[vldrKey] = doDeepClone ? deepClone(value) : value;
    }
  }
  // ** Sanitize ** //
  if (safety !== SAFETY.Normal) {
    for (const key of Object.keys(param)) {
      if (vo.keySet[key]) continue;
      if (safety === SAFETY.Strict) {
        return false;
      } else if (safety === SAFETY.Loose) {
        clean[key] = deepClone(param[key]);
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
  const validators = vo.validators,
    clean: PlainObject = {};
  let isValid = true;
  for (let i = 0; i < validators.length; i++) {
    const vldr = validators[i],
      vldrKey = vldr.key;
    let value = param[vldrKey],
      doDeepClone = true;
    // Safe validator
    if (vldr.isSafe) {
      if (!vldr.fn(value)) {
        isValid = false;
        errors.push({
          info: ERRORS.ValidatorFn,
          functionName: vldr.name,
          value,
          key: vldrKey,
        });
      }
      // Standard validator function
    } else if (vldr.isTestObjectFn) {
      doDeepClone = false;
      const localIsValid = vldr.fn(
        value,
        (nestedErrors: ParseError[]) => {
          appendNestedErrors(errors, nestedErrors, vldrKey);
        },
        (nVal) => (value = nVal),
      );
      if (!localIsValid) {
        isValid = false;
      }
    } else {
      try {
        let localIsValid;
        if (vldr.isTransformFn) {
          localIsValid = vldr.fn(value, (tVal, isValid) => {
            if (isValid) {
              value = tVal;
            }
          });
        } else {
          localIsValid = vldr.fn(value);
        }
        if (!localIsValid) throw null;
        // Catch any thrown errors
      } catch (err) {
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
    if (isValid && vldrKey in param) {
      clean[vldrKey] = doDeepClone ? deepClone(value) : value;
    }
  }
  // ** Sanitize ** //
  if (safety !== SAFETY.Normal) {
    for (const key of Object.keys(param)) {
      if (vo.keySet[key]) continue;
      if (safety === SAFETY.Strict) {
        isValid = false;
        errors.push({
          info: ERRORS.StrictSafety,
          functionName: '<strict>',
          value: param[key],
          key,
        });
      } else if (safety === SAFETY.Loose) {
        clean[key] = deepClone(param[key]);
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
