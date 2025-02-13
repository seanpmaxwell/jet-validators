import {
  isFunction,
  isNullOrUndef,
  isObject,
  isRecord,
  isString,
  isDate,
  TRecord,
} from '../../dist';

import { AddMods, TValidateWithTransform } from '../../dist/common';


// **** Simple Util **** //

/**
 * Extract null/undefined from a validator function.
 */
export function nonNullable<T>(cb: ((arg: unknown) => arg is T)) {
  return (arg: unknown): arg is NonNullable<T> => {
    if (isNullOrUndef(arg)) {
      return false;
    } else {
      return cb(arg);
    }
  };
}

/**
 * Do a validator callback function for each object entry.
 */
export function iterateObjectEntries<T = NonNullable<object>>(
  cb: (key: string, val: unknown) => boolean,
): (arg: unknown) => arg is T {
  return (arg: unknown): arg is T => {
    if (isObject(arg)) {
      for (const entry of Object.entries(arg)) {
        if (!cb(entry[0], entry[1])) {
          return false;
        }
      }
    }
    return true;
  };
}


/**
 * Transform a value before checking it.
 */
export function transform<T>(
  transFn: (arg: unknown) => T,
  vldt: ((arg: unknown) => arg is T),
): TValidateWithTransform<T> {
  return (arg: unknown, cb?: (arg: T) => void): arg is T => {
    if (arg !== undefined) {
      arg = transFn(arg);
    }
    cb?.(arg as T);
    return vldt(arg);
  };
}

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
  throw new Error(errMsg ?? 'Argument must be a valid boolean.')
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


// **** Parse Object **** //

export interface TSchema {
  [key: string]: TValidateWithTransform<unknown> | TSchema;
}

type TInferParseRes<U, O, N, A, Schema = TInferParseResHelper<U>> = (
  AddMods<Schema, O, N, A>
);

type TInferParseResHelper<U> = {
  [K in keyof U]: (
    U[K] extends TValidateWithTransform<infer X> 
    ? X 
    : U[K] extends TSchema
    ? TInferParseResHelper<U[K]>
    : never
  );
};

type TParseOnError<A> = (
  A extends true 
  ? ((property: string, value: unknown, index?: number, caughtErr?: unknown) => void) 
  : ((property: string, value: unknown, caughtErr?: unknown) => void)
);

export const parseObject = <U extends TSchema>(arg: U, onError?: TParseOnError<false>) => 
  _parseObject<U, false, false, false>(arg, false, false, false, onError);
export const parseOptionalObject = <U extends TSchema>(arg: U, onError?: TParseOnError<false>) => 
  _parseObject<U, true, false, false>(arg, true, false, false, onError);
export const parseNullableObject = <U extends TSchema>(arg: U, onError?: TParseOnError<false>) => 
  _parseObject<U, false, true, false>(arg, false, true, false, onError);
export const parseNullishObject = <U extends TSchema>(arg: U, onError?: TParseOnError<false>) => 
  _parseObject<U, true, true, false>(arg, true, true, false, onError);
export const parseObjectArray = <U extends TSchema>(arg: U, onError?: TParseOnError<true>) => 
  _parseObject<U, false, false, true>(arg, false, false, true, onError);
export const parseOptionalObjectArray = <U extends TSchema>(arg: U, onError?: TParseOnError<true>) => 
  _parseObject<U, true, false, true>(arg, true, false, true, onError);
export const parseNullableObjectArray = <U extends TSchema>(arg: U, onError?: TParseOnError<true>) => 
  _parseObject<U, false, true, true>(arg, false, true, true, onError);
export const parseNullishObjectArray = <U extends TSchema>(arg: U, onError?: TParseOnError<true>) => 
  _parseObject<U, true, true, true>(arg, true, true, true, onError);

/**
 * Validates an object schema, calls an error function is supplied one, returns 
 * "undefined" if the parse fails, and works recursively too. NOTE: this will 
 * purge all keys not part of the schema.
 */
function _parseObject<
  U extends TSchema,
  O extends boolean,
  N extends boolean,
  A extends boolean,
>(
  schema: U,
  optional: O,
  nullable: N,
  isArr: A,
  onError?: TParseOnError<A>,
): (arg: unknown) => TInferParseRes<U, O, N, A> {
  return (arg: unknown) => _parseObjectHelper<A>(!!optional, !!nullable, isArr, 
    schema, arg, onError) as TInferParseRes<U, O, N, A>;
}

/**
 * Validate the schema. 
 */
function _parseObjectHelper<A>(
  optional: boolean,
  nullable: boolean,
  isArr: A,
  schema: TSchema,
  arg: unknown,
  onError?: TParseOnError<A>,
) {
  // Check "undefined"
  if (arg === undefined) {
    if (!optional) {
      onError?.('Value was undefined but not optional', arg);
      return undefined;
    }
  }
  // Check "null"
  if (arg === null) {
    if (!nullable) {
      onError?.('Value was null but not nullable.', arg);
      return undefined;
    }
    return null;
  }
  // Check "array"
  if (isArr) {
    if (!Array.isArray(arg)) {
      onError?.('Value is not an array.', arg);
      return undefined;
    }
    // Iterate array
    for (let i = 0; i < arg.length; i++) {
      const parsedItem = _parseObjectHelper2(schema, arg[i], (prop, val, caughtErr) => {
        onError?.(prop, val, i, caughtErr);
      });
      if (parsedItem === undefined) {
        arg[i] = undefined
      }
    }
    return arg;
  // Default
  } else {
    return _parseObjectHelper2(schema, arg, onError as TParseOnError<false>);
  }
}

/**
 * Iterate an object, apply a validator function to to each property in an 
 * object using the schema.
 */
function _parseObjectHelper2(
  schemaParentObj: TSchema,
  argParentObj: unknown,
  onError?: TParseOnError<false>,
): unknown {
  if (!isRecord(argParentObj)) {
    return;
  }
  for (const key in schemaParentObj) {
    const schemaProp = schemaParentObj[key],
      val = argParentObj[key];
    // Nested object
    if (isRecord(schemaProp)) {
      const childVal = _parseObjectHelper2(schemaProp, val, onError);
      if (childVal === undefined) {
        return undefined;
      }
    // Run validator
    } else if (isFunction(schemaProp)) {
      try {
        if (!schemaProp(val, (tval: unknown) => {
          argParentObj[key] = tval;
        })) {
          return onError?.(key, val);
        }
      } catch (err) {
        if (err instanceof Error) {
          return onError?.(key, val, err.message);
        } else {
          return onError?.(key, val, err);
        }
      }
    }
  }
  // Purse keys not in schema
  for (const key in argParentObj) {
    if (!(key in schemaParentObj)) {
      Reflect.deleteProperty(argParentObj, key);
    }
  }
  // Return
  return argParentObj;
}


// **** Test Object **** //

// Test Object (like "parseObj" but returns a type predicate instead)
export const testObject = <U extends TSchema>(arg: U, onError?: TParseOnError<false>) => 
  _testObject<U, false, false, false>(arg, false, false, false, onError);
export const testOptionalObject = <U extends TSchema>(arg: U, onError?: TParseOnError<false>) => 
  _testObject<U, true, false, false>(arg, true, false, false, onError);
export const testNullableObject = <U extends TSchema>(arg: U, onError?: TParseOnError<false>) => 
  _testObject<U, false, true, false>(arg, false, true, false, onError);
export const testNullishObject = <U extends TSchema>(arg: U, onError?: TParseOnError<false>) => 
  _testObject<U, true, true, false>(arg, true, true, false, onError);
export const testObjectArray = <U extends TSchema>(arg: U, onError?: TParseOnError<true>) => 
  _testObject<U, false, false, true>(arg, false, false, true, onError);
export const testOptionalObjectArray = <U extends TSchema>(arg: U, onError?: TParseOnError<true>) => 
  _testObject<U, true, false, true>(arg, true, false, true, onError);
export const testNullableObjectArray = <U extends TSchema>(arg: U, onError?: TParseOnError<true>) => 
  _testObject<U, false, true, true>(arg, false, true, true, onError);
export const testNullishObjectArray = <U extends TSchema>(arg: U, onError?: TParseOnError<true>) => 
  _testObject<U, true, true, true>(arg, true, true, true, onError);

/**
 * Like "parseObj" but returns a type-predicate instead of the object.
 */
function _testObject<
  U extends TSchema,
  O extends boolean,
  N extends boolean,
  A extends boolean,
>(
  schema: U,
  optional: O,
  nullable: N,
  isArr: A,
  onError?: TParseOnError<A>,
) {
  const parseFn = _parseObject(schema, optional, nullable, isArr, onError);
  return (arg: unknown): arg is typeof objRes => {
    const objRes = parseFn(arg);
    if (objRes === undefined) {
      return false;
    } else {
      return true;
    }
  };
}


// **** Traverse Object **** //

type TTraverseCb = (key: string, val: unknown, parentObj: TRecord) => void;

// Test Object (like "parseObj" but returns a type predicate instead)
export const traverseObject = (cb: TTraverseCb) => 
  _traverseObject<false, false, false>(false, false, false, cb);
export const traverseOptionalObject = (cb: TTraverseCb) => 
  _traverseObject<true, false, false>(true, false, false, cb);
export const traverseNullableObject = (cb: TTraverseCb) => 
  _traverseObject<false, true, false>(false, true, false, cb);
export const traverseNullishObject = (cb: TTraverseCb) => 
  _traverseObject<true, true, false>(true, true, false, cb);
export const traverseObjectArray = (cb: TTraverseCb) => 
  _traverseObject<false, false, true>(false, false, true, cb);
export const traverseOptionalObjectArray = (cb: TTraverseCb) => 
  _traverseObject<true, false, true>(true, false, true, cb);
export const traverseNullableObjectArray = (cb: TTraverseCb) => 
  _traverseObject<false, true, true>(false, true, true, cb);
export const traverseNullishObjectArray = (cb: TTraverseCb) => 
  _traverseObject<true, true, true>(true, true, true, cb);

/**
 * Validates an object schema, calls an error function is supplied one, returns 
 * "undefined" if the parse fails, and works recursively too. NOTE: this will 
 * purge all keys not part of the schema.
 */
function _traverseObject<
  O extends boolean,
  N extends boolean,
  A extends boolean,
>(
  optional: O,
  nullable: N,
  isArray: A,
  cb: TTraverseCb,
) {
  return <T>(arg: T): T => {
    _traverseObjectHelper<A>(!!optional, !!nullable, isArray, arg, cb);
    return arg;
  }
}

/**
 * Validate the schema. 
 */
function _traverseObjectHelper<A>(
  optional: boolean,
  nullable: boolean,
  isArray: A,
  arg: unknown,
  cb: TTraverseCb,
): void {
  // Check "undefined"
  if (arg === undefined && !optional) {
    throw new Error('Value was undefined but not optional.');
  }
  // Check "null"
  if (arg === null && !nullable) {
    throw new Error('Value was null but not nullable.');
  }
  // Check "array"
  if (isArray) {
    if (!Array.isArray(arg)) {
      throw new Error('Value is not an array.');
    }
    // Iterate array
    for (const item of arg) {
      _traverseObjectHelperCore(item, cb);
    }
  // Default
  } else {
    _traverseObjectHelperCore(arg, cb);
  }
}

/**
 * Iterate an object, apply a validator function to to each property in an 
 * object using the schema.
 */
function _traverseObjectHelperCore(
  parentObj: unknown,
  cb: TTraverseCb,
): void {
  // Must be an object
  if (!isRecord(parentObj)) {
    return;
  }
  // Iterate schema
  const entries = Object.entries(parentObj);
  for (const [key, value] of entries) {
    if (isRecord(value)) {
      _traverseObjectHelperCore(value, cb);
    } else if (Array.isArray(value)) {
      for (const item of value) {
        _traverseObjectHelperCore(item, cb);
      }
    } else {
      cb(key, value, parentObj);
    }
  }
}


// **** Compare Objects **** //

type TDeepCompareCb = (val1: unknown, val2: unknown, key?: string) => void;
type TDeepCompareFn = (arg1: unknown, arg2: unknown) => boolean;

interface IDeepCompareOptions {
  disregardDateException?: boolean;
  onlyCompareFields?: string[];
  convertToDateFields?: string[];
}

export const deepCompare = customDeepCompare({});

/**
 * Do a deep-comparison of two objects and fire a callback for each unequal 
 * value.
 * 
 * Options:
 *  - "disregardDateException": For date objects we just compare the time value 
 *    not the references of the date objects themselves. You can overwrite 
 *    this using "disregardDateException".
 *  - "onlyCompareFields": If only want to compare some properties in two 
 *    objects and not the full object. Note this DOES NOT apply to nested 
 *    objects. Also if this array contains properties not present in the 
 *    objects, those properties will not be affected.
 *  - "convertToDateFields": If you want a property to be converted to a date 
 *    before comparison, pass the property name here. This DOES apply to nested
 *    objects.
 */
export function customDeepCompare(
  cbOrOptions: TDeepCompareCb | IDeepCompareOptions,
  options?: IDeepCompareOptions,
): TDeepCompareFn {
  let cbF: TDeepCompareCb | undefined,
    optionsF: IDeepCompareOptions | undefined;
  if (typeof cbOrOptions === 'function') {
    cbF = cbOrOptions;
    if (!!options) {
      optionsF = options;
    }
  } else if (typeof cbOrOptions === 'object') {
    optionsF = cbOrOptions;
  }
  return (arg1: unknown, arg2: unknown) => {
    return _customDeepCompareHelper(arg1, arg2, cbF, optionsF);
  }
}

/**
 * Run the comparison logic.
 */
function _customDeepCompareHelper(
  arg1: unknown,
  arg2: unknown,
  cb?: TDeepCompareCb,
  options?: IDeepCompareOptions,
  paramKey?: string,
): boolean {
  // ** Strict compare if not both objects ** //
  if (!isObject(arg1) ||arg1 === null || !isObject(arg2) || arg2 === null) {
    const isEqual = (arg1 === arg2);
    if (!isEqual && !!cb) {
      cb(arg1, arg2, paramKey);
    }
    return isEqual;
  }
  // ** Compare dates ** //
  if (!options?.disregardDateException && (isDate(arg1) && isDate(arg2))) {
    const isEqual = (arg1.getTime() === arg2.getTime());
    if (!isEqual && !!cb) {
      cb(arg1, arg2, paramKey);
    }
    return isEqual;
  }
  // ** Compare arrays ** //
  if (Array.isArray(arg1) || Array.isArray(arg2)) {
    if (!(Array.isArray(arg1) && Array.isArray(arg2))) {
      cb?.(arg1, arg2, paramKey);
      return false;
    }
    if (!cb && arg1.length !== arg2.length) {
      return false
    }
    let length = arg1.length,
      isEqualF = true;
    if (arg2.length > arg1.length) {
      length = arg2.length;
    }
    for (let i = 0; i < length; i++) {
      const isEqual = _customDeepCompareHelper(arg1[i], arg2[i], cb, options);
      if (!isEqual) {
        if (!cb) {
          return false;
        }
        isEqualF = false;
      }
    }
    return isEqualF
  }
  // ** Compare Object *** //
  // If only comparing some properties, filter out the unincluded keys.
  let keys1 = Object.keys(arg1),
    keys2 = Object.keys(arg2);
  if (!!options?.onlyCompareFields) {
    keys1 = keys1.filter(key => options?.onlyCompareFields?.includes(key))
    keys2 = keys2.filter(key => options?.onlyCompareFields?.includes(key))
    // This option only applies to top level
    options = { ...options }
    delete options.onlyCompareFields;
  }
  if (!cb && keys1.length !== keys2.length) {
    return false
  }
  // Compare the properties of each object
  let keys = keys1;
  if (keys2.length > keys1.length) {
    keys = keys2;
  }
  let isEqual = true;
  for (const key of keys) {
    let val1 = (arg1 as TRecord)[key],
    val2 = (arg2 as TRecord)[key];
    // Check property is present for both
    if (arg1.hasOwnProperty(key) && !arg2.hasOwnProperty(key)) {
      if (!!cb) {
        cb(val1, `key "${key}" not present`);
        isEqual = false;
        continue;
      } else {
        return false;
      }
    } else if (!arg1.hasOwnProperty(key) && arg2.hasOwnProperty(key)) {
      if (!!cb) {
        cb(`key "${key}" not present`, val2);
        isEqual = false;
        continue;
      } else {
        return false;
      }
    }
    // Check if meant to converted to date first
    if (!!options?.convertToDateFields?.includes(key)) {
        const d1 = new Date(val1 as string),
         d2 = new Date(val2 as string);
      if (d1.getTime() !== d2.getTime()) {
        if (!!cb) {
          cb(val1, val2);
          isEqual = false;
        } else {
          return false;
        }
      }
      continue;
    }
    // Recursion
    if (!_customDeepCompareHelper(val1, val2, cb, options, key)) {
      if (!cb) {
        return false;
      } 
      isEqual = false;
      continue;
    }
  }
  // Return
  return isEqual;
}
