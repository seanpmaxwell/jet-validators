/* eslint-disable max-len */
import { isFunction, isRecord, isString, isUndef } from '../../dist';
import { ITransVldrFn } from './util-functions';


// **** Variables **** //

enum Safety {
  Loose,
  Default,
  Strict,
}

const ERRORS = {
  NotObject: 'Parsed item was not an object.',
  NotOptional: 'Root argument is undefined but not optional.',
  NotNullable: 'Root argument is null but not nullable.',
  NotArray: 'Root argument is not an array.',
  NestedValidation: 'Nested validation failed.',
  ValidatorFn: 'Validator-function returned false.',
  ErrorThrown: 'Validator function threw an error.',
  StrictSafety: 'strict-safety failed, prop not in schema.',
  SchemaProp: 'Schema property must be a function or nested schema',
} as const;


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

export interface IParseVldrFn<T> {
  (arg: unknown, onError?: TParseOnError): arg is T;
  isTransFn?: true;
}
  
type TValidatorFn<T> = (arg: unknown) => arg is T;


// **** Type-safing the schema **** //

export type TSchema<T = unknown> = (
  unknown extends T
  ? IBasicSchema
  : TSchemaHelper<T>
);

export type TSchemaHelper<T> = Required<{
  [K in keyof T]: (
    T[K] extends Record<string, unknown> 
    ? IParseVldrFn<T[K]> | ITransVldrFn<T[K]> | TSchemaHelper<T[K]>
    : IParseVldrFn<T[K]> | ITransVldrFn<T[K]>
  )
}>;

interface IBasicSchema {
  [key: string]: ITransVldrFn<unknown> | IParseVldrFn<unknown> | IBasicSchema;
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
) => _parseObject<U, false, false, false>(schema, false, false, false, Safety.Default, onError);

export const parseOptionalObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, true, false, false>(schema, true, false, false, Safety.Default, onError);

export const parseNullableObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, false, true, false>(schema, false, true, false, Safety.Default, onError);

export const parseNullishObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, true, true, false>(schema, true, true, false, Safety.Default, onError);

export const parseObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, false, false, true>(schema, false, false, true, Safety.Default, onError);

export const parseOptionalObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, true, false, true>(schema, true, false, true, Safety.Default, onError);

export const parseNullableObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, false, true, true>(schema, false, true, true, Safety.Default, onError);

export const parseNullishObjectArray= <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, true, true, true>(schema, true, true, true, Safety.Default, onError);


// **** Loose parseObject **** //

export const looseParseObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, false, false, false>(schema, false, false, false, Safety.Loose, onError);

export const looseParseOptionalObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, true, false, false>(schema, true, false, false, Safety.Loose, onError);

export const looseParseNullableObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, false, true, false>(schema, false, true, false, Safety.Loose, onError);

export const looseParseNullishObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, true, true, false>(schema, true, true, false, Safety.Loose, onError);

export const looseParseObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, false, false, true>(schema, false, false, true, Safety.Loose, onError);

export const looseParseOptionalObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, true, false, true>(schema, true, false, true, Safety.Loose, onError);

export const looseParseNullableObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, false, true, true>(schema, false, true, true, Safety.Loose, onError);

export const looseParseNullishObjectArray= <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, true, true, true>(schema, true, true, true, Safety.Loose, onError);


// **** Strict parseObject **** //

export const strictParseObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, false, false, false>(schema, false, false, false, Safety.Strict, onError);

export const strictParseOptionalObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, true, false, false>(schema, true, false, false, Safety.Strict, onError);

export const strictParseNullableObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, false, true, false>(schema, false, true, false, Safety.Strict, onError);

export const strictParseNullishObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, true, true, false>(schema, true, true, false, Safety.Strict, onError);

export const strictParseObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, false, false, true>(schema, false, false, true, Safety.Strict, onError);

export const strictParseOptionalObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, true, false, true>(schema, true, false, true, Safety.Strict, onError);

export const strictParseNullableObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, false, true, true>(schema, false, true, true, Safety.Strict, onError);

export const strictParseNullishObjectArray= <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _parseObject<U, true, true, true>(schema, true, true, true, Safety.Strict, onError);

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
  safety: Safety,
  onErrorLower?: TParseOnError,
) {
  // Return function
  return (
    arg: unknown,
    onError?: TParseOnError,
  ) => {
    // If error callback provided
    if (!!onErrorLower || !!onError) {
      return _parseObjectHelperWithErrCb<A>(
        !!optional,
        !!nullable,
        isArr, 
        schema,
        arg,
        safety,
        (errors: IParseObjectError[]) => {
          Object.defineProperty(errors, 'isParseObjectErrorArr', {
            value: true,
            writable: false,
          });
          onErrorLower?.(errors);
          onError?.(errors);
        },
      ) as TInferFromSchema<U, O, N, A>;
    }
    // Not error callback provided
    return _parseObjectHelperWoErrCb<A>(
      !!optional,
      !!nullable,
      isArr, 
      schema,
      arg,
      safety,
    ) as TInferFromSchema<U, O, N, A>;
  };
}

/**
 * Validate the schema. 
 */
function _parseObjectHelperWithErrCb<A>(
  optional: boolean,
  nullable: boolean,
  isArr: A,
  schema: IBasicSchema,
  arg: unknown,
  safety: Safety,
  onError: TParseOnError,
): unknown {
  // Check "undefined"
  if (arg === undefined) {
    if (!optional) {
      onError([{ info: ERRORS.NotOptional }]);
      return false;
    }
    return undefined;
  }
  // Check "null"
  if (arg === null) {
    if (!nullable) {
      onError([{ info: ERRORS.NotNullable }]);
      return false;
    }
    return null;
  }
  // Init error array
  const errArr: IParseObjectError[] = [];
  // Do this if it is an array.
  if (isArr) {
    if (!Array.isArray(arg)) {
      onError([{ info: ERRORS.NotArray }]);
      return false;
    }
    // Iterate array
    for (let i = 0; i < arg.length; i++) {
      _parseObjectHelperWithErrCb2(schema, arg[i], errArr, safety, i);
    }
    if (errArr.length > 0) {
      onError(errArr);
      return false;
    }
    // Return if no errors
    return arg;
  }
  // If not an array
  _parseObjectHelperWithErrCb2(schema, arg, errArr, safety);
  if (errArr.length > 0) {
    onError(errArr);
    return false;
  }
  return arg;
}

/**
 * Iterate an object, apply a validator function to to each property in an 
 * object using the schema.
 */
function _parseObjectHelperWithErrCb2(
  schemaParentObj: IBasicSchema,
  argParentObj: unknown,
  errArr: IParseObjectError[],
  safety: Safety,
  index?: number,
): unknown {
  // Make sure is object
  if (!isRecord(argParentObj)) {
    errArr.push({
      info: ERRORS.NotObject,
      ...(isUndef(index) ? {} : { index }),
    });
    return false;
  }
  // Iterate object properties
  for (const key in schemaParentObj) {
    const schemaProp = schemaParentObj[key],
      val = argParentObj[key];
    // Run validator
    if (isFunction(schemaProp)) {
      try {
        let childErrors: IParseObjectError[] | undefined,
          passed = false,
          info: string = ERRORS.ValidatorFn;
        if (schemaProp.isTransFn === true) {
          passed = schemaProp(val, tval => argParentObj[key] = tval);
        } else {
          passed = schemaProp(val, errors => {
            if (isParseObjectErrArr(errors)) {
              info = ERRORS.NestedValidation;
              childErrors = errors;
            }
          });
        }
        // If not passed
        if (!passed) {
          errArr.push({
            info,
            prop: key,
            ...((!!childErrors && childErrors.length > 0) ? {
              children: childErrors,
            } : {
              value: val,
            }),
            ...(isUndef(index) ? {} : { index }),
          });
        }
      // Validator function threw an error
      } catch (err) {
        let caught;
        if (err instanceof Error) {
          caught = err.message;
        } else if (isString(err)) {
          caught = err;
        } else {
          caught = JSON.stringify(err);
        }
        errArr.push({
          info: ERRORS.ErrorThrown,
          prop: key,
          value: val,
          caught,
          ...(isUndef(index) ? {} : { index }),
        });
      }
    // Nested schema
    } else if (isRecord(schemaProp) && Object.keys(schemaProp).length > 0) {
      const childErrArr: IParseObjectError[] = [],
        childVal = _parseObjectHelperWithErrCb2(schemaProp, val, childErrArr, 
          safety);
      if (childVal === false) {
        errArr.push({
          info: ERRORS.NestedValidation,
          prop: key,
          children: childErrArr,
          ...(isUndef(index) ? {} : { index }),
        });
      }
    // Throw error if not function
    } else {
      throw new Error(ERRORS.SchemaProp);
    }
  }
  // Unless safety = "loose", filter extra keys
  if (safety !== Safety.Loose) {
    for (const key in argParentObj) {
      if (!(key in schemaParentObj)) {
        if (safety === Safety.Strict) {
          errArr.push({
            info: ERRORS.StrictSafety,
            prop: key,
            ...(isUndef(index) ? {} : { index }),
          });
        }
        Reflect.deleteProperty(argParentObj, key);
      }
    }
  }
  // Return false if there are errors.
  if (errArr.length > 0) {
    return false;
  }
  // Return
  return argParentObj;
}

/**
 * Validate the schema with no error callback passed.
 */
function _parseObjectHelperWoErrCb<A>(
  optional: boolean,
  nullable: boolean,
  isArr: A,
  schema: IBasicSchema,
  arg: unknown,
  safety: Safety,
): unknown {
  // Check "undefined"
  if (arg === undefined) {
    return !optional ? false : undefined;
  }
  // Check "null"
  if (arg === null) {
    return !nullable ? false : null;
  }
  // Do this if it is an array.
  if (isArr) {
    if (!Array.isArray(arg)) {
      return false;
    }
    // Iterate array
    for (const item of arg) {
      const parsedItem = _parseObjectHelperWoErrCb2(schema, item, safety);
      if (parsedItem === false) {
        return false;
      }
    }
    return arg;
  }
  // If not an array
  const resp = _parseObjectHelperWoErrCb2(schema, arg, safety);
  if (resp === false) {
    return false;
  }
  return arg;
}

/**
 * Iterate an object, apply a validator function to to each property in an 
 * object using the schema.
 */
function _parseObjectHelperWoErrCb2(
  schemaParentObj: IBasicSchema,
  argParentObj: unknown,
  safety: Safety,
): unknown {
  // Make sure is object
  if (!isRecord(argParentObj)) {
    return false;
  }
  // Iterate object properties
  for (const key in schemaParentObj) {
    const schemaProp = schemaParentObj[key],
      val = argParentObj[key];
    // Validator function
    if (isFunction(schemaProp)) {
      try {
        let passed = false;
        if (schemaProp.isTransFn === true) {
          passed = schemaProp(val, tval => {
            // Don't append "undefined" if the key is absent
            if (tval === undefined && !(key in argParentObj)) {
              return;
            }
            argParentObj[key] = tval;
          });
        } else {
          passed = schemaProp(val);
        }
        if (!passed) {
          return false;
        }
      } catch {
        return false;
      }
    // Nested schema
    } else if (isRecord(schemaProp) && Object.keys(schemaProp).length > 0) {
      const childVal = _parseObjectHelperWoErrCb2(schemaProp, val, safety);
      if (childVal === false) {
        return false;
      }
    // Throw error if not function or nested schema
    } else {
      throw new Error(ERRORS.SchemaProp);
    }
  }
  // Unless safety = "loose", filter extra keys
  if (safety !== Safety.Loose) {
    for (const key in argParentObj) {
      if (!(key in schemaParentObj)) {
        if (safety === Safety.Strict) {
          return false;
        }
        Reflect.deleteProperty(argParentObj, key);
      }
    }
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
) => _testObject<U, false, false, false>(schema, false, false, false, Safety.Default, onError);

export const testOptionalObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, true, false, false>(schema, true, false, false, Safety.Default, onError);

export const testNullableObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, false, true, false>(schema, false, true, false, Safety.Default, onError);

export const testNullishObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, true, true, false>(schema, true, true, false, Safety.Default, onError);

export const testObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, false, false, true>(schema, false, false, true, Safety.Default, onError);

export const testOptionalObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, true, false, true>(schema, true, false, true, Safety.Default, onError);

export const testNullableObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, false, true, true>(schema, false, true, true, Safety.Default, onError);

export const testNullishObjectArray= <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, true, true, true>(schema, true, true, true, Safety.Default, onError);


// **** Loose testObject **** //

export const looseTestObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, false, false, false>(schema, false, false, false, Safety.Loose, onError);

export const looseTestOptionalObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, true, false, false>(schema, true, false, false, Safety.Loose, onError);

export const looseTestNullableObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, false, true, false>(schema, false, true, false, Safety.Loose, onError);

export const looseTestNullishObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, true, true, false>(schema, true, true, false, Safety.Loose, onError);

export const looseTestObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, false, false, true>(schema, false, false, true, Safety.Loose, onError);

export const looseTestOptionalObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, true, false, true>(schema, true, false, true, Safety.Loose, onError);

export const looseTestNullableObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, false, true, true>(schema, false, true, true, Safety.Loose, onError);

export const looseTestNullishObjectArray= <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, true, true, true>(schema, true, true, true, Safety.Loose, onError);


// **** Strict testObject **** //

export const strictTestObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, false, false, false>(schema, false, false, false, Safety.Strict, onError);

export const strictTestOptionalObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, true, false, false>(schema, true, false, false, Safety.Strict, onError);

export const strictTestNullableObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, false, true, false>(schema, false, true, false, Safety.Strict, onError);

export const strictTestNullishObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, true, true, false>(schema, true, true, false, Safety.Strict, onError);

export const strictTestObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, false, false, true>(schema, false, false, true, Safety.Strict, onError);

export const strictTestOptionalObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, true, false, true>(schema, true, false, true, Safety.Strict, onError);

export const strictTestNullableObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, false, true, true>(schema, false, true, true, Safety.Strict, onError);

export const strictTestNullishObjectArray= <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) => _testObject<U, true, true, true>(schema, true, true, true, Safety.Strict, onError);

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
  safety: Safety,
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
