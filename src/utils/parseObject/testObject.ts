import { type OnErrorCallback, SAFETY } from './parseObjectCore';
import testObjectCore from './testObjectCore';

import type {
  InferredReturnValue,
  Schema,
  TypedReturnValue,
} from './parseObject';

/******************************************************************************
                              testObject
******************************************************************************/

// **** testObject **** //

export function testObject<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is TypedReturnValue<T, false, false, false>;

export function testObject<S extends Record<string, unknown>>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is InferredReturnValue<S, false, false, false>;

export function testObject(schema: Schema<unknown>, onError?: OnErrorCallback) {
  return testObjectCore(
    false,
    false,
    false,
    schema,
    SAFETY.Normal,
    'testObject',
    onError,
  );
}

// **** testOptionalObject **** //

export function testOptionalObject<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is TypedReturnValue<T, true, false, false>;

export function testOptionalObject<S extends Record<string, unknown>>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is InferredReturnValue<S, true, false, false>;

export function testOptionalObject(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return testObjectCore(
    true,
    false,
    false,
    schema,
    SAFETY.Normal,
    'testOptionalObject',
    onError,
  );
}

// **** testNullableObject **** //

export function testNullableObject<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is TypedReturnValue<T, false, true, false>;

export function testNullableObject<S extends Record<string, unknown>>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is InferredReturnValue<S, false, true, false>;

export function testNullableObject(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return testObjectCore(
    false,
    true,
    false,
    schema,
    SAFETY.Normal,
    'testNullableObject',
    onError,
  );
}

// **** testNullishObject **** //

export function testNullishObject<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is TypedReturnValue<T, true, true, false>;

export function testNullishObject<S extends Record<string, unknown>>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is InferredReturnValue<S, true, true, false>;

export function testNullishObject(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return testObjectCore(
    true,
    true,
    false,
    schema,
    SAFETY.Normal,
    'testNullishObject',
    onError,
  );
}

// **** testObjectArray **** //

export function testObjectArray<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is TypedReturnValue<T, false, false, true>;

export function testObjectArray<S extends Record<string, unknown>>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is InferredReturnValue<S, false, false, true>;

export function testObjectArray(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return testObjectCore(false, false, true, schema, SAFETY.Normal, onError);
}

// **** testOpionalObjectArray **** //

export function testOptionalObjectArray<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is TypedReturnValue<T, true, false, true>;

export function testOptionalObjectArray<S extends Record<string, unknown>>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is InferredReturnValue<S, true, false, true>;

export function testOptionalObjectArray(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return testObjectCore(true, false, true, schema, SAFETY.Normal, onError);
}

// **** testNullableObjectArray **** //

export function testNullableObjectArray<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is TypedReturnValue<T, false, true, true>;

export function testNullableObjectArray<S extends Record<string, unknown>>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is InferredReturnValue<S, false, true, true>;

export function testNullableObjectArray(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return testObjectCore(false, true, true, schema, SAFETY.Normal, onError);
}

// **** testNullishObjectArray **** //

export function testNullishObjectArray<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is TypedReturnValue<T, true, true, true>;

export function testNullishObjectArray<S extends Record<string, unknown>>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is InferredReturnValue<S, true, true, true>;

export function testNullishObjectArray(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return testObjectCore(true, true, true, schema, SAFETY.Normal, onError);
}

/******************************************************************************
                          strictTestObject
******************************************************************************/

// **** strictTestObject **** //

export function strictTestObject<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is TypedReturnValue<T, false, false, false>;

export function strictTestObject<S extends Record<string, unknown>>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is InferredReturnValue<S, false, false, false>;

export function strictTestObject(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return testObjectCore(false, false, false, schema, SAFETY.Strict, onError);
}

// **** strictTestOptionalObject **** //

export function strictTestOptionalObject<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is TypedReturnValue<T, true, false, false>;

export function strictTestOptionalObject<S extends Record<string, unknown>>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is InferredReturnValue<S, true, false, false>;

export function strictTestOptionalObject(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return testObjectCore(true, false, false, schema, SAFETY.Strict, onError);
}

// **** strictTestNullableObject **** //

export function strictTestNullableObject<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is TypedReturnValue<T, false, true, false>;

export function strictTestNullableObject<S extends Record<string, unknown>>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is InferredReturnValue<S, false, true, false>;

export function strictTestNullableObject(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return testObjectCore(false, true, false, schema, SAFETY.Strict, onError);
}

// **** strictTestNullishObject **** //

export function strictTestNullishObject<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is TypedReturnValue<T, true, true, false>;

export function strictTestNullishObject<S extends Record<string, unknown>>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is InferredReturnValue<S, true, true, false>;

export function strictTestNullishObject(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return testObjectCore(true, true, false, schema, SAFETY.Strict, onError);
}

// **** strictTestObjectArray **** //

export function strictTestObjectArray<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is TypedReturnValue<T, false, false, true>;

export function strictTestObjectArray<S extends Record<string, unknown>>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is InferredReturnValue<S, false, false, true>;

export function strictTestObjectArray(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return testObjectCore(false, false, true, schema, SAFETY.Strict, onError);
}

// **** strictTestOpionalObjectArray **** //

export function strictTestOptionalObjectArray<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is TypedReturnValue<T, true, false, true>;

export function strictTestOptionalObjectArray<
  S extends Record<string, unknown>,
>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is InferredReturnValue<S, true, false, true>;

export function strictTestOptionalObjectArray(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return testObjectCore(true, false, true, schema, SAFETY.Strict, onError);
}

// **** strictTestNullableObjectArray **** //

export function strictTestNullableObjectArray<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is TypedReturnValue<T, false, true, true>;

export function strictTestNullableObjectArray<
  S extends Record<string, unknown>,
>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is InferredReturnValue<S, false, true, true>;

export function strictTestNullableObjectArray(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return testObjectCore(false, true, true, schema, SAFETY.Strict, onError);
}

// **** strictTestNullishObjectArray **** //

export function strictTestNullishObjectArray<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is TypedReturnValue<T, true, true, true>;

export function strictTestNullishObjectArray<S extends Record<string, unknown>>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is InferredReturnValue<S, true, true, true>;

export function strictTestNullishObjectArray(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return testObjectCore(true, true, true, schema, SAFETY.Strict, onError);
}

/******************************************************************************
                           looseTestObject
******************************************************************************/

// **** looseTestObject **** //

export function looseTestObject<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is TypedReturnValue<T, false, false, false>;

export function looseTestObject<S extends Record<string, unknown>>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is InferredReturnValue<S, false, false, false>;

export function looseTestObject(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return testObjectCore(false, false, false, schema, SAFETY.Loose, onError);
}

// **** looseTestOptionalObject **** //

export function looseTestOptionalObject<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is TypedReturnValue<T, true, false, false>;

export function looseTestOptionalObject<S extends Record<string, unknown>>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is InferredReturnValue<S, true, false, false>;

export function looseTestOptionalObject(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return testObjectCore(true, false, false, schema, SAFETY.Loose, onError);
}

// **** looseTestNullableObject **** //

export function looseTestNullableObject<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is TypedReturnValue<T, false, true, false>;

export function looseTestNullableObject<S extends Record<string, unknown>>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is InferredReturnValue<S, false, true, false>;

export function looseTestNullableObject(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return testObjectCore(false, true, false, schema, SAFETY.Loose, onError);
}

// **** looseTestNullishObject **** //

export function looseTestNullishObject<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is TypedReturnValue<T, true, true, false>;

export function looseTestNullishObject<S extends Record<string, unknown>>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is InferredReturnValue<S, true, true, false>;

export function looseTestNullishObject(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return testObjectCore(true, true, false, schema, SAFETY.Loose, onError);
}

// **** looseTestObjectArray **** //

export function looseTestObjectArray<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is TypedReturnValue<T, false, false, true>;

export function looseTestObjectArray<S extends Record<string, unknown>>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is InferredReturnValue<S, false, false, true>;

export function looseTestObjectArray(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return testObjectCore(false, false, true, schema, SAFETY.Loose, onError);
}

// **** looseTestOpionalObjectArray **** //

export function looseTestOptionalObjectArray<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is TypedReturnValue<T, true, false, true>;

export function looseTestOptionalObjectArray<S extends Record<string, unknown>>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is InferredReturnValue<S, true, false, true>;

export function looseTestOptionalObjectArray(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return testObjectCore(true, false, true, schema, SAFETY.Loose, onError);
}

// **** looseTestNullableObjectArray **** //

export function looseTestNullableObjectArray<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is TypedReturnValue<T, false, true, true>;

export function looseTestNullableObjectArray<S extends Record<string, unknown>>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is InferredReturnValue<S, false, true, true>;

export function looseTestNullableObjectArray(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return testObjectCore(false, true, true, schema, SAFETY.Loose, onError);
}

// **** looseTestNullishObjectArray **** //

export function looseTestNullishObjectArray<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is TypedReturnValue<T, true, true, true>;

export function looseTestNullishObjectArray<S extends Record<string, unknown>>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => arg is InferredReturnValue<S, true, true, true>;

export function looseTestNullishObjectArray(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return testObjectCore(true, true, true, schema, SAFETY.Loose, onError);
}
