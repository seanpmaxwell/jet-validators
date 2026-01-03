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

import {
  isParseErrorArray,
  setIsParseErrorArray,
} from './mark-parseError-array.js';

/******************************************************************************
                                Constants
******************************************************************************/

const ROOT_TYPE_INVALID = '<root-type-invalid>';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObject = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = (...args: any[]) => any;

export type Safety = (typeof SAFETY)[keyof typeof SAFETY];
type PlainObject = Record<string, unknown>;
type KeySet = Record<string, boolean>;

type CompiledParser = (
  param: PlainObject,
  errors: ParseError[] | null,
) => PlainObject | false;

// **** Validation Schema **** //

export type Schema<T = unknown> = {
  [K in keyof T]: T[K] extends PlainObject
    ? Schema<T[K]> | ValidatorFn<T[K]>
    : ValidatorFn<T[K]>;
};

type SafeValidator<T> = (arg: unknown) => arg is T;
type UnsafeValidator<T> = (arg: unknown, errCb?: OnErrorCallback) => arg is T;
type ValidatorArrayFn = (
  param: PlainObject,
  errors: ParseError[] | null,
  clean: PlainObject,
) => boolean | -1;

type ValidatorFn<T> =
  | SafeValidator<T>
  | UnsafeValidator<T>
  | ValidatorFnWithTransformCb<T>
  | TestObjectFn<T>;

// **** Error Handling **** //

export type ParseError = {
  info: string;
  functionName: string; // name of the validator function
  value: unknown;
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
                                  Setup
******************************************************************************/

const parserCache = new WeakMap<object, Map<Safety, CompiledParser>>();

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
  const parser = getCompiledParser(schema as AnyObject, safety);
  return (param: unknown, localOnError?: OnErrorCallback) => {
    const errorCb = onError ?? localOnError,
      errors: ParseError[] | null = errorCb ? setIsParseErrorArray([]) : null;
    const result = parseObjectCoreHelper(
      isOptional,
      isNullable,
      isArray,
      parser,
      errors,
      param,
    );
    if (result === false) {
      if (!!errors && errors.length > 0) {
        errorCb?.(errors);
      }
      return false;
    } else {
      return result;
    }
  };
}

/**
 * Cache the compiled schema parser in case it gets reused.
 */
function getCompiledParser(schema: AnyObject, safety: Safety): CompiledParser {
  let safetyMap = parserCache.get(schema);
  if (!safetyMap) {
    safetyMap = new Map();
    parserCache.set(schema, safetyMap);
  }
  let parser = safetyMap.get(safety);
  if (!parser) {
    parser = setupValidatorParser(schema, safety);
    safetyMap.set(safety, parser);
  }
  return parser;
}

/**
 * This is so we don't have to work with raw strings during development
 */
function setupValidatorParser(schema: Schema<unknown>, safety: Safety) {
  // Interate schema
  const validatorArray: ValidatorArrayFn[] = [],
    keys = Object.keys(schema),
    keySet: KeySet = Object.create(null);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i],
      schemaValue = (schema as AnyObject)[key];
    keySet[key] = true;
    if (typeof schemaValue === 'function') {
      const name = schemaValue.name || '<anonymous>';
      if (isSafe(schemaValue)) {
        const vldr = setupSafeVldr(key, name, schemaValue);
        validatorArray.push(vldr);
      } else if (isTestObjectCoreFn(schemaValue)) {
        const vldr = setupNestedTestObjectVldr(key, schemaValue);
        validatorArray.push(vldr);
      } else if (isTransformFn(schemaValue)) {
        const vldr = setupTransformVldr(key, name, schemaValue);
        validatorArray.push(vldr);
      } else {
        const vldr = setupUnsafeVldr(key, name, schemaValue);
        validatorArray.push(vldr);
      }
    } else if (typeof schemaValue === 'object') {
      const nestedFn = testObjectCore(false, false, false, schemaValue, safety),
        vldr = setupNestedTestObjectVldr(key, nestedFn);
      validatorArray.push(vldr);
    } else {
      throw new Error(ERRORS.SchemaProp(key));
    }
  }
  // Return validator function
  return (
    param: PlainObject,
    errors: ParseError[] | null,
  ): PlainObject | false => {
    // Clean and sanitize
    const clean: PlainObject = {};
    let isValid = true;
    for (let i = 0; i < validatorArray.length; i++) {
      const vldrFn = validatorArray[i],
        result = vldrFn(param, errors, clean);
      if (result === -1) {
        return false;
      } else if (result === false) {
        isValid = false;
      }
    }
    // Strict
    if (safety === SAFETY.Strict) {
      const paramKeys = Object.keys(param);
      for (let i = 0; i < paramKeys.length; i++) {
        const key = paramKeys[i];
        if (keySet[key]) continue;
        if (!errors) return false;
        isValid = false;
        errors.push({
          info: ERRORS.StrictSafety,
          functionName: '<strict>',
          value: param[key],
          key,
        });
      }
      // Loose
    } else if (isValid && safety === SAFETY.Loose) {
      const paramKeys = Object.keys(param);
      for (let i = 0; i < paramKeys.length; i++) {
        const key = paramKeys[i];
        if (keySet[key]) continue;
        const value = param[key];
        clean[key] =
          value !== null && typeof value === 'object'
            ? deepClone(value)
            : value;
      }
    }
    return isValid ? clean : false;
  };
}

/**
 * Do basic checks before core parsing with errors.
 */
function parseObjectCoreHelper(
  isOptional: boolean,
  isNullable: boolean,
  isArray: boolean,
  parser: CompiledParser,
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
        key: ROOT_TYPE_INVALID,
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
        key: ROOT_TYPE_INVALID,
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
        key: ROOT_TYPE_INVALID,
      });
      return false;
    }
    // Run the parseFn with an individual error state
    const paramClone = new Array(param.length);
    let isValid = true;
    for (let i = 0; i < param.length; i++) {
      const nestedErrors: ParseError[] | null = errors ? [] : null,
        result = parser(param[i], nestedErrors);
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
    return parser(param, errors);
  } else {
    errors?.push({
      info: ERRORS.NotObject,
      functionName: '<isPlainObject>',
      value: param,
      key: ROOT_TYPE_INVALID,
    });
    return false;
  }
}

/******************************************************************************
                            Parser Blocks
******************************************************************************/

/**
 * Return a safe validator function.
 */
function setupSafeVldr(
  key: string,
  fnName: string,
  vldrFn: SafeValidator<unknown>,
) {
  const hasOwn = Object.prototype.hasOwnProperty;
  // Setup validator function
  return (
    param: PlainObject,
    errors: ParseError[] | null,
    clean: PlainObject,
  ) => {
    const value = param[key],
      hasKey = value !== undefined || hasOwn.call(param, key);
    let isValid = true;
    if (!vldrFn(value)) {
      if (!errors) return -1;
      isValid = false;
      errors.push({
        info: ERRORS.ValidatorFn,
        functionName: fnName,
        value,
        key,
      });
    } else if (hasKey) {
      clean[key] =
        value !== null && typeof value === 'object' ? deepClone(value) : value;
    }
    return isValid;
  };
}

/**
 * Return a nested test object function.
 */
function setupNestedTestObjectVldr(key: string, vldrFn: TestObjectFn<unknown>) {
  const hasOwn = Object.prototype.hasOwnProperty;
  // Setup validator function
  return (
    param: PlainObject,
    errors: ParseError[] | null,
    clean: PlainObject,
  ) => {
    let value = param[key],
      isValid = true;
    const hasKey = value !== undefined || hasOwn.call(param, key),
      bubble = errors
        ? (nestedErrors: ParseError[]) =>
            appendNestedErrors(errors, nestedErrors, key)
        : undefined;
    const localIsValid = vldrFn(value, bubble, (nVal) => (value = nVal));
    if (!localIsValid) {
      if (!errors) return -1;
      isValid = false;
    } else if (hasKey) {
      clean[key] =
        value !== null && typeof value === 'object' ? deepClone(value) : value;
    }
    return isValid;
  };
}

/**
 * Return a validtor function with transform.
 */
function setupTransformVldr(
  key: string,
  fnName: string,
  vldrFn: ValidatorFnWithTransformCb<unknown>,
) {
  const hasOwn = Object.prototype.hasOwnProperty;
  // Setup validator function
  return (
    param: PlainObject,
    errors: ParseError[] | null,
    clean: PlainObject,
  ) => {
    let value = param[key],
      isValid = true;
    const hasKey = value !== undefined || hasOwn.call(param, key);
    try {
      const localIsValid = vldrFn(value, (tVal, innerIsValid) => {
        if (innerIsValid) {
          value = tVal;
        }
      });
      if (!localIsValid) throw null;
      if (hasKey) {
        clean[key] =
          value !== null && typeof value === 'object'
            ? deepClone(value)
            : value;
      }
    } catch (err) {
      if (!errors) return -1;
      isValid = false;
      const extra = formatCaughtError(err);
      if (extra && extra.caught) {
        errors.push({
          info: ERRORS.ValidatorFn,
          functionName: fnName,
          value,
          caught: extra.caught,
          key: key,
        });
      } else {
        errors.push({
          info: ERRORS.ValidatorFn,
          functionName: fnName,
          value,
          key: key,
        });
      }
    }
    return isValid;
  };
}

/**
 * Return a safe validator function.
 */
function setupUnsafeVldr(
  key: string,
  fnName: string,
  vldrFn: UnsafeValidator<unknown>,
) {
  const hasOwn = Object.prototype.hasOwnProperty;
  // Setup validator function
  return (
    param: PlainObject,
    errors: ParseError[] | null,
    clean: PlainObject,
  ) => {
    const value = param[key],
      hasKey = value !== undefined || hasOwn.call(param, key),
      acceptsErrorCb = vldrFn.length > 1;
    let cbErrorsAppended = false,
      isValid = true;
    const cb =
      acceptsErrorCb && errors
        ? (cbErrors: ParseError[]) => {
            if (
              Array.isArray(cbErrors) &&
              isParseErrorArray(cbErrors) &&
              cbErrors.length > 0
            ) {
              cbErrorsAppended = true;
              appendNestedErrors(errors, cbErrors, key);
            }
          }
        : undefined;
    try {
      if (!vldrFn(value, cb)) throw null;
      if (hasKey) {
        clean[key] =
          value !== null && typeof value === 'object'
            ? deepClone(value)
            : value;
      }
    } catch (err) {
      if (!errors) return -1;
      isValid = false;
      if (!cbErrorsAppended) {
        const extra = formatCaughtError(err);
        if (extra && extra.caught) {
          errors.push({
            info: ERRORS.ValidatorFn,
            functionName: fnName,
            value,
            caught: extra.caught,
            key: key,
          });
        } else {
          errors.push({
            info: ERRORS.ValidatorFn,
            functionName: fnName,
            value,
            key: key,
          });
        }
      }
    }
    return isValid;
  };
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
    if (error.key === ROOT_TYPE_INVALID) {
      error.key = String(prepend);
    } else if (!!error.key) {
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
