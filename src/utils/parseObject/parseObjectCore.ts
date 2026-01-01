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

type ValidatorFn<T> =
  | ((arg: unknown) => arg is T)
  | ValidatorFnWithTransformCb<T>
  | TestObjectFn<T>;

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
      errors: ParseError[] | null = errorCb ? [] : null;
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
        errorCb?.(errors!);
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
 * Setup fast validator tree
 */
function setupValidatorParser(
  schema: Schema<unknown>,
  safety: Safety,
): CompiledParser {
  // Initialize new node
  const keys = Object.keys(schema),
    keySet: KeySet = Object.create(null),
    argNames = [
      'deepClone',
      'appendNestedErrors',
      'ERRORS',
      'formatCaughtError',
      'keySet',
    ],
    argValues: unknown[] = [
      deepClone,
      appendNestedErrors,
      ERRORS,
      formatCaughtError,
      keySet,
    ],
    fieldBlocks: string[] = [];

  let fnIndex = 0;
  const addFnRef = (fn: unknown) => {
    const fnName = `fn${fnIndex++}`;
    argNames.push(fnName);
    argValues.push(fn);
    return fnName;
  };

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i],
      schemaValue = (schema as AnyObject)[key];
    keySet[key] = true;
    if (typeof schemaValue === 'function') {
      const name = schemaValue.name || '<anonymous>';
      if (isSafe(schemaValue)) {
        fieldBlocks.push(buildSafeBlock(key, name, addFnRef(schemaValue)));
      } else if (isTestObjectCoreFn(schemaValue)) {
        fieldBlocks.push(buildNestedTestBlock(key, addFnRef(schemaValue)));
      } else if (isTransformFn(schemaValue)) {
        fieldBlocks.push(buildTransformBlock(key, name, addFnRef(schemaValue)));
      } else {
        fieldBlocks.push(buildUnsafeBlock(key, name, addFnRef(schemaValue)));
      }
    } else if (typeof schemaValue === 'object') {
      const nestedFn = testObjectCore(false, false, false, schemaValue, safety);
      fieldBlocks.push(buildNestedTestBlock(key, addFnRef(nestedFn)));
    } else {
      throw new Error(ERRORS.SchemaProp(key));
    }
  }

  if (safety === SAFETY.Strict) {
    fieldBlocks.push(buildStrictBlock());
  } else if (safety === SAFETY.Loose) {
    fieldBlocks.push(buildLooseBlock());
  }

  const body = [
    '"use strict";',
    'return function parse(param, errors) {',
    '  const clean = {};',
    '  let isValid = true;',
    '  const hasOwn = Object.prototype.hasOwnProperty;',
    ...fieldBlocks,
    '  return isValid ? clean : false;',
    '};',
  ].join('\n');

  const factory = new Function(...argNames, body);
  return factory(...argValues) as CompiledParser;
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
      const result = parser(param[i], nestedErrors);
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
      key: '',
    });
    return false;
  }
}

/******************************************************************************
                            Parser Blocks
******************************************************************************/

function buildSafeBlock(key: string, fnName: string, refName: string): string {
  const keyLiteral = JSON.stringify(key);
  const fnLiteral = JSON.stringify(fnName);
  return [
    '  {',
    `    const value = param[${keyLiteral}];`,
    `    const hasKey = value !== undefined || hasOwn.call(param, ${keyLiteral});`,
    `    if (!${refName}(value)) {`,
    '      if (!errors) return false;',
    '      isValid = false;',
    '      errors.push({',
    '        info: ERRORS.ValidatorFn,',
    `        functionName: ${fnLiteral},`,
    '        value,',
    `        key: ${keyLiteral},`,
    '      });',
    '    } else if (hasKey) {',
    `      clean[${keyLiteral}] =`,
    "        value !== null && typeof value === 'object' ? deepClone(value) : value;",
    '    }',
    '  }',
  ].join('\n');
}

function buildNestedTestBlock(key: string, refName: string): string {
  const keyLiteral = JSON.stringify(key);
  return [
    '  {',
    `    let value = param[${keyLiteral}];`,
    `    const hasKey = value !== undefined || hasOwn.call(param, ${keyLiteral});`,
    '    const bubble = errors',
    `      ? (nestedErrors) => appendNestedErrors(errors, nestedErrors, ${keyLiteral})`,
    '      : undefined;',
    `    const localIsValid = ${refName}(value, bubble, (nVal) => (value = nVal));`,
    '    if (!localIsValid) {',
    '      if (!errors) return false;',
    '      isValid = false;',
    '    } else if (hasKey) {',
    `      clean[${keyLiteral}] =`,
    "        value !== null && typeof value === 'object' ? deepClone(value) : value;",
    '    }',
    '  }',
  ].join('\n');
}

function buildTransformBlock(
  key: string,
  fnName: string,
  refName: string,
): string {
  const keyLiteral = JSON.stringify(key);
  const fnLiteral = JSON.stringify(fnName);
  return [
    '  {',
    `    let value = param[${keyLiteral}];`,
    `    const hasKey = value !== undefined || hasOwn.call(param, ${keyLiteral});`,
    '    try {',
    `      const localIsValid = ${refName}(value, (tVal, innerIsValid) => {`,
    '        if (innerIsValid) {',
    '          value = tVal;',
    '        }',
    '      });',
    '      if (!localIsValid) throw null;',
    '      if (hasKey) {',
    `        clean[${keyLiteral}] =`,
    "          value !== null && typeof value === 'object' ? deepClone(value) : value;",
    '      }',
    '    } catch (err) {',
    '      if (!errors) return false;',
    '      isValid = false;',
    '      const extra = formatCaughtError(err);',
    '      if (extra && extra.caught) {',
    '        errors.push({',
    '          info: ERRORS.ValidatorFn,',
    `          functionName: ${fnLiteral},`,
    '          value,',
    '          caught: extra.caught,',
    `          key: ${keyLiteral},`,
    '        });',
    '      } else {',
    '        errors.push({',
    '          info: ERRORS.ValidatorFn,',
    `          functionName: ${fnLiteral},`,
    '          value,',
    `          key: ${keyLiteral},`,
    '        });',
    '      }',
    '    }',
    '  }',
  ].join('\n');
}

function buildUnsafeBlock(
  key: string,
  fnName: string,
  refName: string,
): string {
  const keyLiteral = JSON.stringify(key);
  const fnLiteral = JSON.stringify(fnName);
  return [
    '  {',
    `    const value = param[${keyLiteral}];`,
    `    const hasKey = value !== undefined || hasOwn.call(param, ${keyLiteral});`,
    '    try {',
    `      if (!${refName}(value)) throw null;`,
    '      if (hasKey) {',
    `        clean[${keyLiteral}] =`,
    "          value !== null && typeof value === 'object' ? deepClone(value) : value;",
    '      }',
    '    } catch (err) {',
    '      if (!errors) return false;',
    '      isValid = false;',
    '      const extra = formatCaughtError(err);',
    '      if (extra && extra.caught) {',
    '        errors.push({',
    '          info: ERRORS.ValidatorFn,',
    `          functionName: ${fnLiteral},`,
    '          value,',
    '          caught: extra.caught,',
    `          key: ${keyLiteral},`,
    '        });',
    '      } else {',
    '        errors.push({',
    '          info: ERRORS.ValidatorFn,',
    `          functionName: ${fnLiteral},`,
    '          value,',
    `          key: ${keyLiteral},`,
    '        });',
    '      }',
    '    }',
    '  }',
  ].join('\n');
}

function buildStrictBlock(): string {
  return [
    '  {',
    '    const paramKeys = Object.keys(param);',
    '    for (let i = 0; i < paramKeys.length; i++) {',
    '      const key = paramKeys[i];',
    '      if (keySet[key]) continue;',
    '      if (!errors) return false;',
    '      isValid = false;',
    '      errors.push({',
    '        info: ERRORS.StrictSafety,',
    "        functionName: '<strict>',",
    '        value: param[key],',
    '        key,',
    '      });',
    '    }',
    '  }',
  ].join('\n');
}

function buildLooseBlock(): string {
  return [
    '  {',
    '    const paramKeys = Object.keys(param);',
    '    for (let i = 0; i < paramKeys.length; i++) {',
    '      const key = paramKeys[i];',
    '      if (keySet[key]) continue;',
    '      const value = param[key];',
    '      clean[key] =',
    "        value !== null && typeof value === 'object' ? deepClone(value) : value;",
    '    }',
    '  }',
  ].join('\n');
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
