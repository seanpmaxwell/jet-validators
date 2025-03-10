/* eslint-disable max-len */

import {
  isFunction,
  isNullish,
  isObject,
  isRecord,
  isString,
  isDate,
  TRecord,
  isUndef,
} from '../../dist';


// **** Types **** //

// Misc
type TTransVldrFn<T> = (
  arg: unknown,
  cb?: (arg: T) => void,
) => arg is T;

type TParseVldrFn<T> = (
  arg: unknown,
  cb?: (errors: IParseObjectError[]) => void,
) => arg is T;

// Add modifiers
type AddNull<T, N> = (N extends true ? T | null : T);
type AddNullables<T, O, N> = (O extends true ? AddNull<T, N> | undefined  : AddNull<T, N>);
type AddMods<T, O, N, A> = A extends true ? AddNullables<T[], O, N> : AddNullables<T, O, N>;


// **** Simple Util **** //

/**
 * Extract null/undefined from a validator function.
 */
export function nonNullable<T>(cb: ((arg: unknown) => arg is T)) {
  return (arg: unknown): arg is NonNullable<T> => {
    if (isNullish(arg)) {
      return false;
    } else {
      return cb(arg);
    }
  };
}

/**
 * Transform a value before checking it.
 */
export function transform<T>(
  transFn: (arg: unknown) => T,
  vldt: ((arg: unknown) => arg is T),
): TTransVldrFn<T> {
  const retFn = (arg: unknown, cb?: (arg: T) => void): arg is T => {
    if (arg !== undefined) {
      arg = transFn(arg);
    }
    cb?.(arg as T);
    return vldt(arg);
  };
  Object.defineProperty(retFn, 'isTransFn', { value: true, writable: false });
  return retFn;
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


// **** ParseObject **** //

type TValidatorFn<T> = TTransVldrFn<T> | TParseVldrFn<T>;

export interface TSchema {
  [key: string]: TValidatorFn<unknown> | TSchema;
}

type TEnforceSchema<T> = (
  unknown extends T
  ? TSchema
  : TEnforceSchemaHelper<T>
);

type TEnforceSchemaHelper<T> = Required<{
  [K in keyof T]: (
    T[K] extends Record<string, unknown> 
    ? TValidatorFn<T[K]> | TEnforceSchemaHelper<T[K]>
    : TValidatorFn<T[K]>
  )
}>;

type TInferParseRes<U, O, N, A, Schema = TInferParseResHelper<U>> = AddMods<Schema, O, N, A>;

type TInferParseResHelper<U> = {
  [K in keyof U]: (
    U[K] extends TValidatorFn<infer X> 
    ? X 
    : U[K] extends TSchema
    ? TInferParseResHelper<U[K]>
    : never
  );
};

export interface IParseObjectError {
  moreInfo: string;
  prop?: string;
  value?: unknown;
  caught?: string;
  index?: number;
  children?: IParseObjectError[];
};

type TParseOnError = (errors: IParseObjectError[]) => void;


export const parseObject = <T, U extends TEnforceSchema<T> = TEnforceSchema<T>>(
  arg: U,
  onError?: TParseOnError,
) => _parseObject<U, false, false, false>(arg, false, false, false, onError);

export const parseOptionalObject = <T, U extends TEnforceSchema<T> = TEnforceSchema<T>>(
  arg: U,
  onError?: TParseOnError,
) => _parseObject<U, true, false, false>(arg, true, false, false, onError);

export const parseNullableObject = <T, U extends TEnforceSchema<T> = TEnforceSchema<T>>(
  arg: U,
  onError?: TParseOnError,
) => _parseObject<U, false, true, false>(arg, false, true, false, onError);

export const parseNullishObject = <T, U extends TEnforceSchema<T> = TEnforceSchema<T>>(
  arg: U,
  onError?: TParseOnError,
) => _parseObject<U, true, true, false>(arg, true, true, false, onError);

export const parseObjectArray = <T, U extends TEnforceSchema<T> = TEnforceSchema<T>>(
  arg: U,
  onError?: TParseOnError,
) => _parseObject<U, false, false, true>(arg, false, false, true, onError);

export const parseOptionalObjectArray = <T, U extends TEnforceSchema<T> = TEnforceSchema<T>>(
  arg: U,
  onError?: TParseOnError,
) => _parseObject<U, true, false, true>(arg, true, false, true, onError);

export const parseNullableObjectArray = <T, U extends TEnforceSchema<T> = TEnforceSchema<T>>(
  arg: U,
  onError?: TParseOnError,
) => _parseObject<U, false, true, true>(arg, false, true, true, onError);

export const parseNullishObjectArray = <T, U extends TEnforceSchema<T> = TEnforceSchema<T>>(
  arg: U,
  onError?: TParseOnError,
) => _parseObject<U, true, true, true>(arg, true, true, true, onError);

/**
 * Validates an object schema, calls an error function is supplied one, returns 
 * "false" if the parse fails, and works recursively too. NOTE: this will 
 * purge all keys not part of the schema.
 */
function _parseObject<
  U extends TSchema,
  O extends boolean = boolean,
  N extends boolean = boolean,
  A extends boolean = boolean,
>(
  schema: U,
  optional: O,
  nullable: N,
  isArr: A,
  onError?: TParseOnError,
) {
  return (arg: unknown, errCb?: TParseOnError) => _parseObjectHelper<A>(
    !!optional,
    !!nullable,
    isArr, 
    schema,
    arg,
    ((!!onError || !!errCb) ? errors => {
      onError?.(errors);
      errCb?.(errors);
    } : undefined),
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
  onError?: TParseOnError,
) {
  // Check "undefined"
  if (arg === undefined) {
    if (!optional) {
      onError?.([{ moreInfo: 'Root argument is undefined but not optional.' }]);
      return false;
    }
    return undefined;
  }
  // Check "null"
  if (arg === null) {
    if (!nullable) {
      onError?.([{ moreInfo: 'Root argument is null but not nullable.' }]);
      return false;
    }
    return null;
  }
  const errArr: IParseObjectError[] = [];
  // Do this if it is an array.
  if (isArr) {
    if (!Array.isArray(arg)) {
      onError?.([{ moreInfo: 'Root argument is not an array.' }]);
      return false;
    }
    // Iterate array
    let hasErr = false;
    for (let i = 0; i < arg.length; i++) {
      const parsedItem = _parseObjectHelper2(schema, arg[i], errArr, !!onError, i);
      if (parsedItem === false) {
        if (!!onError) {
          return false;
        } else {
          hasErr = true;
        }
      }
    }
    if (!!hasErr) {
      if (onError && errArr.length > 0) {
        onError(errArr);
      }
      return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return arg;
  }
  // If not an array
  const resp = _parseObjectHelper2(schema, arg, errArr, !!onError);
  if (resp === false) {
    if (onError && errArr.length > 0) {
      onError(errArr);
    }
    return false;
  }
  return arg;
}

/**
 * Iterate an object, apply a validator function to to each property in an 
 * object using the schema.
 */
function _parseObjectHelper2(
  schemaParentObj: TSchema,
  argParentObj: unknown,
  errArr: IParseObjectError[],
  hasOnErrCb: boolean,
  index?: number,
): unknown {
  // Make sure is object
  if (!isRecord(argParentObj)) {
    errArr.push({
      moreInfo: 'Parsed item was not an object.',
      ...(isUndef(index) ? {} : { index }),
    });
    return;
  }
  // Iterate object properties
  let hasErr = false;
  for (const key in schemaParentObj) {
    const schemaProp = schemaParentObj[key],
      val = argParentObj[key];
    // Nested object
    if (isRecord(schemaProp)) {
      const childErrArr: IParseObjectError[] = [],
        childVal = _parseObjectHelper2(schemaProp, val, childErrArr, hasOnErrCb);
      if (childVal === false) {
        if (!hasOnErrCb) {
          return false;
        } else {
          errArr.push({
            moreInfo: 'Nested validation failed.',
            prop: key,
            value: val,
            children: childErrArr,
          });
        }
      }
    // Run validator
    } else if (isFunction(schemaProp)) {
      try {
        let childErrors: IParseObjectError[] = [],
          passed = false,
          moreInfo = 'Validator-function returned false.';
        if ('isTestFn' in schemaProp && schemaProp.isTestFn === true) {
          moreInfo = 'Nested validation failed.';
          if (hasOnErrCb) {
            passed = schemaProp(val, errors => childErrors = errors as IParseObjectError[]);
          } else {
            passed = schemaProp(val);
          }
        } else if ('isTransFn' in schemaProp && schemaProp.isTransFn === true) {
          passed = schemaProp(val, tval => argParentObj[key] = tval);
        } else {
          passed = schemaProp(val);
        }
        if (!passed) {
          if (hasOnErrCb) {
            hasErr = true;
            errArr.push({
              moreInfo,
              prop: key,
              ...(childErrors.length > 0 ? {
                children: childErrors,
              } : {
                value: val,
              }),
            });
          } else {
            return false;
          }
        }
      } catch (err) {
        if (hasOnErrCb) {
          hasErr = true;
          if (err instanceof Error) {
            errArr.push({
              moreInfo: 'Validator function threw an error.',
              prop: key,
              value: val,
              caught: err.message,
              ...(isUndef(index) ? {} : { index }),
            });
          } else if (isString(err)) {
            errArr.push({
              moreInfo: 'Validator function threw an error.',
              prop: key,
              value: val,
              caught: err,
              ...(isUndef(index) ? {} : { index }),
            });
          } else {
            errArr.push({
              moreInfo: 'Validator function threw an error.',
              prop: key,
              value: val,
              caught: JSON.stringify(err),
              ...(isUndef(index) ? {} : { index }),
            });
          }
        } else {
          return false;
        }
      }
    }
  }
  // Check error
  if (hasErr) {
    return false;
  }
  // Purge keys not in schema
  for (const key in argParentObj) {
    if (!(key in schemaParentObj)) {
      Reflect.deleteProperty(argParentObj, key);
    }
  }
  // Return
  return argParentObj;
}


// **** Test Object **** //

export const testObject = <T, U extends TEnforceSchema<T> = TEnforceSchema<T>>(
  arg: U,
  onError?: TParseOnError,
) => _testObject<U, false, false, false>(arg, false, false, false, onError);

export const testOptionalObject = <T, U extends TEnforceSchema<T> = TEnforceSchema<T>>(
  arg: U,
  onError?: TParseOnError,
) => _testObject<U, true, false, false>(arg, true, false, false, onError);

export const testNullableObject = <T, U extends TEnforceSchema<T> = TEnforceSchema<T>>(
  arg: U,
  onError?: TParseOnError,
) => _testObject<U, false, true, false>(arg, false, true, false, onError);

export const testNullishObject = <T, U extends TEnforceSchema<T> = TEnforceSchema<T>>(
  arg: U,
  onError?: TParseOnError,
) => _testObject<U, true, true, false>(arg, true, true, false, onError);

export const testObjectArray = <T, U extends TEnforceSchema<T> = TEnforceSchema<T>>(
  arg: U,
  onError?: TParseOnError,
) => _testObject<U, false, false, true>(arg, false, false, true, onError);

export const testOptionalObjectArray = <T, U extends TEnforceSchema<T> = TEnforceSchema<T>>(
  arg: U,
  onError?: TParseOnError,
) => _testObject<U, true, false, true>(arg, true, false, true, onError);

export const testNullableObjectArray = <T, U extends TEnforceSchema<T> = TEnforceSchema<T>>(
  arg: U,
  onError?: TParseOnError,
) => _testObject<U, false, true, true>(arg, false, true, true, onError);

export const testNullishObjectArray = <T, U extends TEnforceSchema<T> = TEnforceSchema<T>>(
  arg: U,
  onError?: TParseOnError,
) => _testObject<U, true, true, true>(arg, true, true, true, onError);

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
  onError?: TParseOnError,
) {
  const parseFn = _parseObject(schema, optional, nullable, isArr, onError),
    testFn = (arg: unknown, cb?: TParseOnError): arg is typeof res => {
      const res = parseFn(arg, cb);
      return (res as unknown) !== false;
    };
  Object.defineProperty(testFn, 'isTestFn', { value: true, writable: false });
  return testFn;
}


// **** Compare Objects **** //

type TDeepCompareCb = (key: string, val1: unknown, val2: unknown) => void;
type TDeepCompareFn = (arg1: unknown, arg2: unknown) => boolean;

interface IDeepCompareOptions {
  disregardDateException?: boolean;
  onlyCompareProps?: string | string[];
  convertToDateProps?: string | string[] | { rec: boolean, props: string | string [] };
}

interface IProcessedDeepCompareOptions {
  disregardDateException: boolean;
  onlyCompareProps?: string | string[];
  convertToDateProps?: { rec: boolean, props: string [] };
}

// Default function has no options
export const deepCompare = customDeepCompare({});

/**
 * Do a deep-comparison of two objects and fire a callback for each unequal 
 * value.
 */
export function customDeepCompare(optionsOrCb: IDeepCompareOptions, cb?: TDeepCompareCb): TDeepCompareFn;
export function customDeepCompare(optionsOrCb: TDeepCompareCb): TDeepCompareFn;
export function customDeepCompare(optionsOrCb: IDeepCompareOptions | TDeepCompareCb, cb?: TDeepCompareCb): TDeepCompareFn {
  // Process the options
  let optionsF: IProcessedDeepCompareOptions,
    cbF = cb;
  if (typeof optionsOrCb === 'object') {
    optionsF = _processOptions(optionsOrCb);
  } else if (typeof optionsOrCb === 'function') {
    cbF = optionsOrCb;
    optionsF = { disregardDateException: false };

  }
  // Return compare function
  return (arg1: unknown, arg2: unknown) => {
    const opts = { ...optionsF };
    return _customDeepCompareHelper(arg1, arg2, opts, cbF, '');
  };
}

/**
 * Setup the options object.
 */
function _processOptions(opts: IDeepCompareOptions): IProcessedDeepCompareOptions {
  // Init retVal
  const retVal: IProcessedDeepCompareOptions = {
    disregardDateException: !!opts.disregardDateException,
  };
  // Process "onlyCompareProps"
  if (!!opts.onlyCompareProps) {
    const ocp = opts.onlyCompareProps;
    if (isString(ocp)) {
      retVal.onlyCompareProps = [ocp];
    } else if (Array.isArray(ocp)) {
      retVal.onlyCompareProps = [ ...ocp ];
    }
  }
  // Process "convertToDateProps"
  if (!!opts.convertToDateProps) {
    const cdp = opts.convertToDateProps;
    if (isString(cdp)) {
      retVal.convertToDateProps = { rec: true, props: [cdp] };
    } else if (Array.isArray(cdp)) {
      retVal.convertToDateProps = { rec: true, props: [ ...cdp ] };
    } else if (isObject(cdp)) {
      retVal.convertToDateProps = {
        rec: cdp.rec,
        props: Array.isArray(cdp.props) ? [ ...cdp.props ] : [cdp.props],
      };
    }
  }
  // Return
  return retVal;
}

/**
 * Run the comparison logic.
 */
function _customDeepCompareHelper(
  arg1: unknown,
  arg2: unknown,
  options: IProcessedDeepCompareOptions,
  cb: TDeepCompareCb | undefined,
  paramKey: string,
): boolean {
  // ** Strict compare if not both objects ** //
  if (!isObject(arg1) ||arg1 === null || !isObject(arg2) || arg2 === null) {
    const isEqual = (arg1 === arg2);
    if (!isEqual && !!cb) {
      cb(paramKey, arg1, arg2);
    }
    return isEqual;
  }
  // ** Compare dates ** //
  if (!options.disregardDateException && (isDate(arg1) && isDate(arg2))) {
    const isEqual = (arg1.getTime() === arg2.getTime());
    if (!isEqual && !!cb) {
      cb(paramKey, arg1, arg2);
    }
    return isEqual;
  }
  // ** Compare arrays ** //
  if (Array.isArray(arg1) || Array.isArray(arg2)) {
    if (!(Array.isArray(arg1) && Array.isArray(arg2))) {
      cb?.(paramKey, arg1, arg2);
      return false;
    }
    if (!cb && arg1.length !== arg2.length) {
      return false;
    }
    let length = arg1.length,
      isEqualF = true;
    if (arg2.length > arg1.length) {
      length = arg2.length;
    }
    for (let i = 0; i < length; i++) {
      const isEqual = _customDeepCompareHelper(arg1[i], arg2[i], options, cb, 
        `Index: ${i}`);
      if (!isEqual) {
        if (!cb) {
          return false;
        }
        isEqualF = false;
      }
    }
    return isEqualF;
  }
  // ** Compare Object *** //
  // If only comparing some properties, filter out the unincluded keys.
  let keys1 = Object.keys(arg1),
    keys2 = Object.keys(arg2);
  if (!!options?.onlyCompareProps) {
    const props = options.onlyCompareProps;
    keys1 = keys1.filter(key => props.includes(key));
    keys2 = keys2.filter(key => props.includes(key));
  }
  if (!cb && keys1.length !== keys2.length) {
    return false;
  }
  // Setup convertToDateProps
  let convertToDateProps: string[] | undefined;
  if (!!options.convertToDateProps) {
    convertToDateProps = [ ...options.convertToDateProps.props ];
    if (!options.convertToDateProps.rec) {
      delete options.convertToDateProps;
    }
  }
  // Compare the properties of each object
  let keys = keys1;
  if (keys2.length > keys1.length) {
    keys = keys2;
  }
  let isEqual = true;
  for (const key of keys) {
    const val1 = (arg1 as TRecord)[key],
      val2 = (arg2 as TRecord)[key];
    // Check property is present for both
    if (
      Object.prototype.hasOwnProperty.call(arg1, key) &&
      !Object.prototype.hasOwnProperty.call(arg2, key)
    ) {
      if (!!cb) {
        cb(key, val1, 'not present');
        isEqual = false;
        continue;
      } else {
        return false;
      }
    } else if (
      !Object.prototype.hasOwnProperty.call(arg1, key) &&
      Object.prototype.hasOwnProperty.call(arg2, key)
    ) {
      if (!!cb) {
        cb(key, 'not present', val2);
        isEqual = false;
        continue;
      } else {
        return false;
      }
    }
    // Check if meant to converted to date first
    if (!!convertToDateProps?.includes(key)) {
      const d1 = new Date(val1 as string),
        d2 = new Date(val2 as string);
      if (d1.getTime() !== d2.getTime()) {
        if (!!cb) {
          cb(key, val1, val2);
          isEqual = false;
        } else {
          return false;
        }
      }
      continue;
    }
    // This option only applies to top level
    const optionsF = { ...options };
    if (options.onlyCompareProps) {
      delete optionsF.onlyCompareProps;
    }
    // Recursion
    if (!_customDeepCompareHelper(val1, val2, optionsF, cb, key)) {
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
