import { isNullOrUndef, isObject, isString } from '../basic';
import { AddMods, TValidateWithTransform } from '../common';


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
export function iterateObjEntries<T = NonNullable<object>>(
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
export function parseBoolean(arg: unknown): boolean | undefined {
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
  return undefined;
}

/**
 * Safe JSON parse
 */
export function safeJsonParse<T>(arg: unknown): T {
  if (isString(arg)) {
    return JSON.parse(arg) as T;
  } else {
    throw Error('JSON parse argument must be a string');
  }
}


// **** Parse Object **** //

interface TSchema {
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
  ? ((property?: string, value?: unknown, index?: number, caughtErr?: unknown) => void) 
  : ((property?: string, value?: unknown, caughtErr?: unknown) => void)
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
) {
  return (arg: unknown) => _parseObjectHelper<A>(
    !!optional,
    !!nullable,
    isArr,
    schema,
    arg,
    onError,
  ) as TInferParseRes<U, O, N, A>;
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
      onError?.('object value was undefined but not optional', arg);
      return undefined;
    }
  }
  // Check "null"
  if (arg === null) {
    if (!nullable) {
      onError?.('object value was null but not nullable', arg);
      return undefined;
    }
    return null;
  }
  // Check "array"
  if (isArr) {
    if (!Array.isArray(arg)) {
      onError?.('object not an array', arg);
      return null;
    }
    // Iterate array
    const resp: unknown[] = [];
    for (let i = 0; i < arg.length; i++) {
      const item: unknown = arg[i];
      const parsedItem = _parseObjHelperCore(schema, item, (prop, val, caughtErr) => {
        onError?.(prop, val, i, caughtErr);
      });
      if (parsedItem === undefined) {
        return undefined;
      } else {
        resp.push(parsedItem);
      }
    }
    return resp;
  // Default
  } else {
    return _parseObjHelperCore(schema, arg, onError as TParseOnError<false>);
  }
}

/**
 * Iterate an object, apply a validator function to to each property in an 
 * object using the schema.
 */
function _parseObjHelperCore(
  schema: TSchema,
  arg: unknown,
  onError?: TParseOnError<false>,
): unknown {
  if (!isObject(arg)) {
    return;
  }
  const retVal = (arg as Record<string, unknown>);
  for (const key in schema) {
    const schemaProp = schema[key],
      val = retVal[key];
    // Nested object
    if (typeof schemaProp === 'object') {
      const childVal = _parseObjHelperCore(schemaProp, val, onError);
      if (childVal === undefined) {
        return undefined;
      }
    // Run validator
    } else if (typeof schemaProp === 'function') {
      try {
        if (!schemaProp(val, (tval: unknown) => {
          retVal[key] = tval;
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
  for (const key in retVal) {
    if (!(key in schema)) {
      Reflect.deleteProperty(arg, key);
    }
  }
  // Return
  return retVal;
}


// **** Test Object **** //

// Test Object (like "parseObj" but returns a type predicate instead)
export const testObject = <U extends TSchema>(arg: U, onError?: TParseOnError<false>) => 
  _testObj<U, false, false, false>(arg, false, false, false, onError);
export const testOptionalObject = <U extends TSchema>(arg: U, onError?: TParseOnError<false>) => 
  _testObj<U, true, false, false>(arg, true, false, false, onError);
export const testNullableObject = <U extends TSchema>(arg: U, onError?: TParseOnError<false>) => 
  _testObj<U, false, true, false>(arg, false, true, false, onError);
export const testNullishObject = <U extends TSchema>(arg: U, onError?: TParseOnError<false>) => 
  _testObj<U, true, true, false>(arg, true, true, false, onError);
export const testObjectArray = <U extends TSchema>(arg: U, onError?: TParseOnError<true>) => 
  _testObj<U, false, false, true>(arg, false, false, true, onError);
export const testOptionalObjectArray = <U extends TSchema>(arg: U, onError?: TParseOnError<true>) => 
  _testObj<U, true, false, true>(arg, true, false, true, onError);
export const testNullableObjectArray = <U extends TSchema>(arg: U, onError?: TParseOnError<true>) => 
  _testObj<U, false, true, true>(arg, false, true, true, onError);
export const testNullishObjectArray = <U extends TSchema>(arg: U, onError?: TParseOnError<true>) => 
  _testObj<U, true, true, true>(arg, true, true, true, onError);

/**
 * Like "parseObj" but returns a type-predicate instead of the object.
 */
function _testObj<
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
