import parseObjectCore, {
  type OnErrorCallback,
  type Safety,
  SAFETY,
} from './parseObjectCore';
import type {
  InferredReturnValue,
  Schema,
  TypedReturnValue,
} from './setup-variations';

/******************************************************************************
                              testObject
******************************************************************************/

// **** testObject **** //

export function testObject<T>(
  schema: Schema<T>,
): (arg: unknown) => arg is TypedReturnValue<T, false, false, false>;

export function testObject<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => arg is InferredReturnValue<S, false, false, false>;

export function testObject(schema: Schema<unknown>) {
  return testObjectCore(false, false, false, schema, SAFETY.Normal);
}

// **** testOptionalObject **** //

export function testOptionalObject<T>(
  schema: Schema<T>,
): (arg: unknown) => arg is TypedReturnValue<T, true, false, false>;

export function testOptionalObject<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => arg is InferredReturnValue<S, true, false, false>;

export function testOptionalObject(schema: Schema<unknown>) {
  return testObjectCore(true, false, false, schema, SAFETY.Normal);
}

// **** testNullableObject **** //

export function testNullableObject<T>(
  schema: Schema<T>,
): (arg: unknown) => arg is TypedReturnValue<T, false, true, false>;

export function testNullableObject<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => arg is InferredReturnValue<S, false, true, false>;

export function testNullableObject(schema: Schema<unknown>) {
  return testObjectCore(false, true, false, schema, SAFETY.Normal);
}

// **** testNullishObject **** //

export function testNullishObject<T>(
  schema: Schema<T>,
): (arg: unknown) => arg is TypedReturnValue<T, true, true, false>;

export function testNullishObject<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => arg is InferredReturnValue<S, true, true, false>;

export function testNullishObject(schema: Schema<unknown>) {
  return testObjectCore(true, true, false, schema, SAFETY.Normal);
}

// **** testObjectArray **** //

export function testObjectArray<T>(
  schema: Schema<T>,
): (arg: unknown) => arg is TypedReturnValue<T, false, false, true>;

export function testObjectArray<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => arg is InferredReturnValue<S, false, false, true>;

export function testObjectArray(schema: Schema<unknown>) {
  return testObjectCore(false, false, true, schema, SAFETY.Normal);
}

// **** testOpionalObjectArray **** //

export function testOptionalObjectArray<T>(
  schema: Schema<T>,
): (arg: unknown) => arg is TypedReturnValue<T, true, false, true>;

export function testOptionalObjectArray<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => arg is InferredReturnValue<S, true, false, true>;

export function testOptionalObjectArray(schema: Schema<unknown>) {
  return testObjectCore(true, false, true, schema, SAFETY.Normal);
}

// **** testNullableObjectArray **** //

export function testNullableObjectArray<T>(
  schema: Schema<T>,
): (arg: unknown) => arg is TypedReturnValue<T, false, true, true>;

export function testNullableObjectArray<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => arg is InferredReturnValue<S, false, true, true>;

export function testNullableObjectArray(schema: Schema<unknown>) {
  return testObjectCore(false, true, true, schema, SAFETY.Normal);
}

// **** testNullishObjectArray **** //

export function testNullishObjectArray<T>(
  schema: Schema<T>,
): (arg: unknown) => arg is TypedReturnValue<T, true, true, true>;

export function testNullishObjectArray<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => arg is InferredReturnValue<S, true, true, true>;

export function testNullishObjectArray(schema: Schema<unknown>) {
  return testObjectCore(true, true, true, schema, SAFETY.Normal);
}

/******************************************************************************
                          strictTestObject
******************************************************************************/

// **** strictTestObject **** //

export function strictTestObject<T>(
  schema: Schema<T>,
): (arg: unknown) => arg is TypedReturnValue<T, false, false, false>;

export function strictTestObject<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => arg is InferredReturnValue<S, false, false, false>;

export function strictTestObject(schema: Schema<unknown>) {
  return testObjectCore(false, false, false, schema, SAFETY.Strict);
}

// **** strictTestOptionalObject **** //

export function strictTestOptionalObject<T>(
  schema: Schema<T>,
): (arg: unknown) => arg is TypedReturnValue<T, true, false, false>;

export function strictTestOptionalObject<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => arg is InferredReturnValue<S, true, false, false>;

export function strictTestOptionalObject(schema: Schema<unknown>) {
  return testObjectCore(true, false, false, schema, SAFETY.Strict);
}

// **** strictTestNullableObject **** //

export function strictTestNullableObject<T>(
  schema: Schema<T>,
): (arg: unknown) => arg is TypedReturnValue<T, false, true, false>;

export function strictTestNullableObject<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => arg is InferredReturnValue<S, false, true, false>;

export function strictTestNullableObject(schema: Schema<unknown>) {
  return testObjectCore(false, true, false, schema, SAFETY.Strict);
}

// **** strictTestNullishObject **** //

export function strictTestNullishObject<T>(
  schema: Schema<T>,
): (arg: unknown) => arg is TypedReturnValue<T, true, true, false>;

export function strictTestNullishObject<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => arg is InferredReturnValue<S, true, true, false>;

export function strictTestNullishObject(schema: Schema<unknown>) {
  return testObjectCore(true, true, false, schema, SAFETY.Strict);
}

// **** strictTestObjectArray **** //

export function strictTestObjectArray<T>(
  schema: Schema<T>,
): (arg: unknown) => arg is TypedReturnValue<T, false, false, true>;

export function strictTestObjectArray<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => arg is InferredReturnValue<S, false, false, true>;

export function strictTestObjectArray(schema: Schema<unknown>) {
  return testObjectCore(false, false, true, schema, SAFETY.Strict);
}

// **** strictTestOpionalObjectArray **** //

export function strictTestOptionalObjectArray<T>(
  schema: Schema<T>,
): (arg: unknown) => arg is TypedReturnValue<T, true, false, true>;

export function strictTestOptionalObjectArray<
  S extends Record<string, unknown>,
>(
  schema: S,
): (arg: unknown) => arg is InferredReturnValue<S, true, false, true>;

export function strictTestOptionalObjectArray(schema: Schema<unknown>) {
  return testObjectCore(true, false, true, schema, SAFETY.Strict);
}

// **** strictTestNullableObjectArray **** //

export function strictTestNullableObjectArray<T>(
  schema: Schema<T>,
): (arg: unknown) => arg is TypedReturnValue<T, false, true, true>;

export function strictTestNullableObjectArray<
  S extends Record<string, unknown>,
>(
  schema: S,
): (arg: unknown) => arg is InferredReturnValue<S, false, true, true>;

export function strictTestNullableObjectArray(schema: Schema<unknown>) {
  return testObjectCore(false, true, true, schema, SAFETY.Strict);
}

// **** strictTestNullishObjectArray **** //

export function strictTestNullishObjectArray<T>(
  schema: Schema<T>,
): (arg: unknown) => arg is TypedReturnValue<T, true, true, true>;

export function strictTestNullishObjectArray<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => arg is InferredReturnValue<S, true, true, true>;

export function strictTestNullishObjectArray(schema: Schema<unknown>) {
  return testObjectCore(true, true, true, schema, SAFETY.Strict);
}

/******************************************************************************
                           looseTestObject
******************************************************************************/

// **** looseTestObject **** //

export function looseTestObject<T>(
  schema: Schema<T>,
): (arg: unknown) => arg is TypedReturnValue<T, false, false, false>;

export function looseTestObject<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => arg is InferredReturnValue<S, false, false, false>;

export function looseTestObject(schema: Schema<unknown>) {
  return testObjectCore(false, false, false, schema, SAFETY.Loose);
}

// **** looseTestOptionalObject **** //

export function looseTestOptionalObject<T>(
  schema: Schema<T>,
): (arg: unknown) => arg is TypedReturnValue<T, true, false, false>;

export function looseTestOptionalObject<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => arg is InferredReturnValue<S, true, false, false>;

export function looseTestOptionalObject(schema: Schema<unknown>) {
  return testObjectCore(true, false, false, schema, SAFETY.Loose);
}

// **** looseTestNullableObject **** //

export function looseTestNullableObject<T>(
  schema: Schema<T>,
): (arg: unknown) => arg is TypedReturnValue<T, false, true, false>;

export function looseTestNullableObject<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => arg is InferredReturnValue<S, false, true, false>;

export function looseTestNullableObject(schema: Schema<unknown>) {
  return testObjectCore(false, true, false, schema, SAFETY.Loose);
}

// **** looseTestNullishObject **** //

export function looseTestNullishObject<T>(
  schema: Schema<T>,
): (arg: unknown) => arg is TypedReturnValue<T, true, true, false>;

export function looseTestNullishObject<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => arg is InferredReturnValue<S, true, true, false>;

export function looseTestNullishObject(schema: Schema<unknown>) {
  return testObjectCore(true, true, false, schema, SAFETY.Loose);
}

// **** looseTestObjectArray **** //

export function looseTestObjectArray<T>(
  schema: Schema<T>,
): (arg: unknown) => arg is TypedReturnValue<T, false, false, true>;

export function looseTestObjectArray<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => arg is InferredReturnValue<S, false, false, true>;

export function looseTestObjectArray(schema: Schema<unknown>) {
  return testObjectCore(false, false, true, schema, SAFETY.Loose);
}

// **** looseTestOpionalObjectArray **** //

export function looseTestOptionalObjectArray<T>(
  schema: Schema<T>,
): (arg: unknown) => arg is TypedReturnValue<T, true, false, true>;

export function looseTestOptionalObjectArray<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => arg is InferredReturnValue<S, true, false, true>;

export function looseTestOptionalObjectArray(schema: Schema<unknown>) {
  return testObjectCore(true, false, true, schema, SAFETY.Loose);
}

// **** looseTestNullableObjectArray **** //

export function looseTestNullableObjectArray<T>(
  schema: Schema<T>,
): (arg: unknown) => arg is TypedReturnValue<T, false, true, true>;

export function looseTestNullableObjectArray<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => arg is InferredReturnValue<S, false, true, true>;

export function looseTestNullableObjectArray(schema: Schema<unknown>) {
  return testObjectCore(false, true, true, schema, SAFETY.Loose);
}

// **** looseTestNullishObjectArray **** //

export function looseTestNullishObjectArray<T>(
  schema: Schema<T>,
): (arg: unknown) => arg is TypedReturnValue<T, true, true, true>;

export function looseTestNullishObjectArray<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => arg is InferredReturnValue<S, true, true, true>;

export function looseTestNullishObjectArray(schema: Schema<unknown>) {
  return testObjectCore(true, true, true, schema, SAFETY.Loose);
}

/******************************************************************************
                                Helpers
******************************************************************************/

/**
 * Wrap the parseObject function to return a type-predicate.
 */
function testObjectCore<T>(
  optional: boolean,
  nullable: boolean,
  isArray: boolean,
  schema: Schema<T>,
  safety: Safety,
  onError?: OnErrorCallback,
) {
  const parseFn = parseObjectCore(
    optional,
    nullable,
    isArray,
    schema,
    safety,
    onError,
  );
  return (arg: unknown, onError?: OnErrorCallback): arg is T => {
    return parseFn(arg, onError) !== false;
  };
}
