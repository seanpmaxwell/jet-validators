/* eslint-disable max-len */
import { isFunction, isRecord, isString, isUndef } from '../../dist';
import { TTransVldrFn } from './util-functions';


// **** Utility Types **** //

type AddNull<T, N> = (N extends true ? T | null : T);
type AddNullables<T, O, N> = (O extends true ? AddNull<T, N> | undefined  : AddNull<T, N>);
type AddMods<T, O, N, A> = A extends true ? AddNullables<T[], O, N> : AddNullables<T, O, N>;


// **** Error Types **** //

export type TParseOnError = (errors: IParseObjectError[]) => void;
export interface IParseObjectError {
  info: string;
  prop?: string;
  value?: unknown;
  caught?: string;
  index?: number;
  children?: IParseObjectError[];
};


// **** Basic Types **** //

export type TParseVldrFn<T> = (
  arg: unknown,
  onError?: TParseOnError 
) => arg is T;

type TValidatorFn<T> = (arg: unknown) => arg is T;
type TSafety = 'strict' | 'loose' | 'default';


// **** Type-safing the schema **** //

export type TSchema<T = unknown> = (
  unknown extends T
  ? IBasicSchema
  : TSchemaHelper<T>
);

export type TSchemaHelper<T> = Required<{
  [K in keyof T]: (
    T[K] extends Record<string, unknown> 
    ? TParseVldrFn<T[K]> | TTransVldrFn<T[K]> | TSchemaHelper<T[K]>
    : TParseVldrFn<T[K]> | TTransVldrFn<T[K]>
  )
}>;

interface IBasicSchema {
  [key: string]: TTransVldrFn<unknown> | TParseVldrFn<unknown> | IBasicSchema;
}

type TInferFromSchema<U, O, N, A, Schema = TInferFromSchemaHelper<U>> = AddMods<Schema, O, N, A>;

type TInferFromSchemaHelper<U> = {
  [K in keyof U]: (
    U[K] extends TValidatorFn<infer X> 
    ? X 
    : U[K] extends IBasicSchema
    ? TInferFromSchemaHelper<U[K]>
    : never
  );
};


// **** Default parseObject **** //

export const parseObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, false, false, false>(schema, false, false, false, 'default', onError);

export const parseOptionalObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, true, false, false>(schema, true, false, false, 'default', onError);

export const parseNullableObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, false, true, false>(schema, false, true, false, 'default', onError);

export const parseNullishObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, true, true, false>(schema, true, true, false, 'default', onError);

export const parseObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, false, false, true>(schema, false, false, true, 'default', onError);

export const parseOptionalObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, true, false, true>(schema, true, false, true, 'default', onError);

export const parseNullableObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, false, true, true>(schema, false, true, true, 'default', onError);

export const parseNullishObjectArray= <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, true, true, true>(schema, true, true, true, 'default', onError);


// **** Loose parseObject **** //

export const looseParseObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, false, false, false>(schema, false, false, false, 'loose', onError);

export const looseParseOptionalObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, true, false, false>(schema, true, false, false, 'loose', onError);

export const looseParseNullableObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, false, true, false>(schema, false, true, false, 'loose', onError);

export const looseParseNullishObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, true, true, false>(schema, true, true, false, 'loose', onError);

export const looseParseObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, false, false, true>(schema, false, false, true, 'loose', onError);

export const looseParseOptionalObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, true, false, true>(schema, true, false, true, 'loose', onError);

export const looseParseNullableObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, false, true, true>(schema, false, true, true, 'loose', onError);

export const looseParseNullishObjectArray= <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, true, true, true>(schema, true, true, true, 'loose', onError);


// **** Strict parseObject **** //

export const strictParseObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, false, false, false>(schema, false, false, false, 'strict', onError);

export const strictParseOptionalObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, true, false, false>(schema, true, false, false, 'strict', onError);

export const strictParseNullableObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, false, true, false>(schema, false, true, false, 'strict', onError);

export const strictParseNullishObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, true, true, false>(schema, true, true, false, 'strict', onError);

export const strictParseObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, false, false, true>(schema, false, false, true, 'strict', onError);

export const strictParseOptionalObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, true, false, true>(schema, true, false, true, 'strict', onError);

export const strictParseNullableObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, false, true, true>(schema, false, true, true, 'strict', onError);

export const strictParseNullishObjectArray= <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, true, true, true>(schema, true, true, true, 'strict', onError);


/**
 * Validates an object schema, calls an error function is supplied one, returns 
 * "false" if the parse fails, and works recursively too. NOTE: this will 
 * purge all keys not part of the schema.
 */
function _parseObject<
  U extends IBasicSchema,
  O extends boolean = boolean,
  N extends boolean = boolean,
  A extends boolean = boolean,
>(
  schema: U,
  optional: O,
  nullable: N,
  isArr: A,
  safety: TSafety,
  onErrorLower?: TParseOnError,
) {
  // Return function
  return (
    arg: unknown,
    onError?: TParseOnError,
  ) => {
    // We want to call both error callback functions
    let errCbF;
    if (!!onErrorLower || !!onError) {
      errCbF = (errors: IParseObjectError[]) => {
        Object.defineProperty(errors, 'isParseObjectErrorArr', {
          value: true,
          writable: false,
        });
        onErrorLower?.(errors);
        onError?.(errors);
      };
    }
    // Call the parse function
    return _parseObjectHelper<A>(
      !!optional,
      !!nullable,
      isArr, 
      schema,
      arg,
      safety,
      errCbF,
    ) as TInferFromSchema<U, O, N, A>;
  };
}

/**
 * Validate the schema. 
 */
function _parseObjectHelper<A>(
  optional: boolean,
  nullable: boolean,
  isArr: A,
  schema: IBasicSchema,
  arg: unknown,
  safety: TSafety,
  onError?: TParseOnError,
): unknown {
  // Check "undefined"
  if (arg === undefined) {
    if (!optional) {
      onError?.([{ info: 'Root argument is undefined but not optional.' }]);
      return false;
    }
    return undefined;
  }
  // Check "null"
  if (arg === null) {
    if (!nullable) {
      onError?.([{ info: 'Root argument is null but not nullable.' }]);
      return false;
    }
    return null;
  }
  const errArr: IParseObjectError[] = [];
  // Do this if it is an array.
  if (isArr) {
    if (!Array.isArray(arg)) {
      onError?.([{ info: 'Root argument is not an array.' }]);
      return false;
    }
    // Iterate array
    let hasErr = false;
    for (let i = 0; i < arg.length; i++) {
      const parsedItem = _parseObjectHelper2(schema, arg[i], errArr, !!onError, 
        safety, i);
      if (parsedItem === false) {
        if (!!onError) {
          hasErr = true;
        } else {
          return false;
        }
      }
    }
    if (!!hasErr) {
      if (onError && errArr.length > 0) {
        onError(errArr);
      }
      return false;
    }
    return arg;
  }
  // If not an array
  const resp = _parseObjectHelper2(schema, arg, errArr, !!onError, safety);
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
  schemaParentObj: IBasicSchema,
  argParentObj: unknown,
  errArr: IParseObjectError[],
  hasOnErrCb: boolean,
  safety: TSafety,
  index?: number,
): unknown {
  // Make sure is object
  if (!isRecord(argParentObj)) {
    errArr.push({
      info: 'Parsed item was not an object.',
      ...(isUndef(index) ? {} : { index }),
    });
    return false;
  }
  // Iterate object properties
  let hasErr = false;
  for (const key in schemaParentObj) {
    const schemaProp = schemaParentObj[key],
      val = argParentObj[key];
    // Nested object
    if (isRecord(schemaProp)) {
      const childErrArr: IParseObjectError[] = [],
        childVal = _parseObjectHelper2(schemaProp, val, childErrArr, hasOnErrCb, safety);
      if (childVal === false) {
        if (!hasOnErrCb) {
          return false;
        } else {
          errArr.push({
            info: 'Nested validation failed.',
            prop: key,
            value: val,
            children: childErrArr,
            ...(isUndef(index) ? {} : { index }),
          });
        }
      }
    // Run validator
    } else if (isFunction(schemaProp)) { // do function that returns arg is TransVldrFn or TParseSchemaFn
      try {
        let childErrors: IParseObjectError[] = [],
          passed = false,
          info = 'Validator-function returned false.';
        if ('isTransFn' in schemaProp && schemaProp.isTransFn === true) {
          passed = schemaProp(val, tval => argParentObj[key] = tval);
        } else {
          if (hasOnErrCb) {
            passed = schemaProp(val, errors => {
              if (isParseObjectErrArr(errors)) {
                info = 'Nested validation failed.';
                childErrors = errors;
              }
            });
          } else {
            passed = schemaProp(val);
          }
        }
        // If not passed
        if (!passed) {
          if (hasOnErrCb) {
            hasErr = true;
            errArr.push({
              info,
              prop: key,
              ...(childErrors.length > 0 ? {
                children: childErrors,
              } : {
                value: val,
              }),
              ...(isUndef(index) ? {} : { index }),
            });
          } else {
            return false;
          }
        }
      // Validator function threw an error
      } catch (err) {
        if (hasOnErrCb) {
          hasErr = true;
          let caught;
          if (err instanceof Error) {
            caught = err.message;
          } else if (isString(err)) {
            caught = err;
          } else {
            caught = JSON.stringify(err);
          }
          errArr.push({
            info: 'Validator function threw an error.',
            prop: key,
            value: val,
            caught,
            ...(isUndef(index) ? {} : { index }),
          });
        } else {
          return false;
        }
      }
    }
  }
  // Unless safety = "loose", filter extra keys
  if (safety !== 'loose') {
    for (const key in argParentObj) {
      if (!(key in schemaParentObj)) {
        if (safety === 'strict') {
          if (hasOnErrCb) {
            hasErr = true;
            errArr.push({
              info: 'strict-safety failed, prop not in schema.',
              prop: key,
              ...(isUndef(index) ? {} : { index }),
            });
          } else {
            return false;
          }
        }
        Reflect.deleteProperty(argParentObj, key);
      }
    }
  }
  // Return false if there are errors.
  if (hasErr) {
    return false;
  }
  // Return
  return argParentObj;
}

/**
 * Check is a parsed object error array.
 */
function isParseObjectErrArr(arg: unknown): arg is IParseObjectError[] {
  return (
    Array.isArray(arg) &&
    arg.length > 0 &&
    'isParseObjectErrorArr' in arg &&
    arg.isParseObjectErrorArr === true
  );
}


// **** testObject (just calls "parseObject" under the hood) **** //

export const testObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, false, false, false>(schema, false, false, false, 'default', onError);

export const testOptionalObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, true, false, false>(schema, true, false, false, 'default', onError);

export const testNullableObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, false, true, false>(schema, false, true, false, 'default', onError);

export const testNullishObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, true, true, false>(schema, true, true, false, 'default', onError);

export const testObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, false, false, true>(schema, false, false, true, 'default', onError);

export const testOptionalObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, true, false, true>(schema, true, false, true, 'default', onError);

export const testNullableObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, false, true, true>(schema, false, true, true, 'default', onError);

export const testNullishObjectArray= <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, true, true, true>(schema, true, true, true, 'default', onError);


// **** Loose testObject **** //

export const looseTestObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, false, false, false>(schema, false, false, false, 'loose', onError);

export const looseTestOptionalObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, true, false, false>(schema, true, false, false, 'loose', onError);

export const looseTestNullableObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, false, true, false>(schema, false, true, false, 'loose', onError);

export const looseTestNullishObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, true, true, false>(schema, true, true, false, 'loose', onError);

export const looseTestObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, false, false, true>(schema, false, false, true, 'loose', onError);

export const looseTestOptionalObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, true, false, true>(schema, true, false, true, 'loose', onError);

export const looseTestNullableObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, false, true, true>(schema, false, true, true, 'loose', onError);

export const looseTestNullishObjectArray= <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, true, true, true>(schema, true, true, true, 'loose', onError);


// **** Strict testObject **** //

export const strictTestObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, false, false, false>(schema, false, false, false, 'strict', onError);

export const strictTestOptionalObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, true, false, false>(schema, true, false, false, 'strict', onError);

export const strictTestNullableObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, false, true, false>(schema, false, true, false, 'strict', onError);

export const strictTestNullishObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, true, true, false>(schema, true, true, false, 'strict', onError);

export const strictTestObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, false, false, true>(schema, false, false, true, 'strict', onError);

export const strictTestOptionalObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, true, false, true>(schema, true, false, true, 'strict', onError);

export const strictTestNullableObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, false, true, true>(schema, false, true, true, 'strict', onError);

export const strictTestNullishObjectArray= <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, true, true, true>(schema, true, true, true, 'strict', onError);

/**
 * Like "parseObj" but returns a type-predicate instead of the object.
 */
function _testObject<
  U extends IBasicSchema,
  O extends boolean,
  N extends boolean,
  A extends boolean,
>(
  schema: U,
  optional: O,
  nullable: N,
  isArr: A,
  safety: TSafety,
  onError?: TParseOnError,
) {
  const parseFn = _parseObject(schema, optional, nullable, isArr, safety, onError);
  return (
    arg: unknown,
    onError?: TParseOnError,
  ): arg is typeof res => {
    const res = parseFn(arg, onError);
    return (res as unknown) !== false;
  };
}
