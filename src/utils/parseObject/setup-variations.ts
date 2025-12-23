import parseObjectCore, { SAFETY } from './parseObjectCore';

/******************************************************************************
                                 Types
******************************************************************************/

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ValidatorFn<T> = (arg: unknown, ...other: any[]) => arg is T;

// Handle variations
type ResolveMods<T, O extends boolean, N extends boolean, A extends boolean> =
  | (A extends true ? T[] : never)
  | (O extends true ? undefined : never)
  | (N extends true ? null : never);

type InferTypeFromSchema<S> = {
  [K in keyof S]: S[K] extends ValidatorFn<infer R>
    ? R
    : S[K] extends object
      ? InferTypeFromSchema<S[K]>
      : never;
};

export type TypedReturnValue<
  T,
  O extends boolean,
  N extends boolean,
  A extends boolean,
> = ResolveMods<T, O, N, A>;

export type InferredReturnValue<
  T,
  O extends boolean,
  N extends boolean,
  A extends boolean,
  U = T extends undefined ? InferTypeFromSchema<T> : T,
> = ResolveMods<U, O, N, A>;

export type Schema<T> = {
  [K in keyof T]: T[K] extends object ? Schema<T[K]> : ValidatorFn<T[K]>;
};

/******************************************************************************
                              parseObject
******************************************************************************/

// **** parseObject **** //

export function parseObject<T>(
  schema: Schema<T>,
): (arg: unknown) => TypedReturnValue<T, false, false, false>;

export function parseObject<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => InferredReturnValue<S, false, false, false>;

export function parseObject(schema: Schema<unknown>) {
  return parseObjectCore(false, false, false, schema, SAFETY.Normal);
}

// **** parseOptionalObject **** //

export function parseOptionalObject<T>(
  schema: Schema<T>,
): (arg: unknown) => TypedReturnValue<T, true, false, false>;

export function parseOptionalObject<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => InferredReturnValue<S, true, false, false>;

export function parseOptionalObject(schema: Schema<unknown>) {
  return parseObjectCore(true, false, false, schema, SAFETY.Normal);
}

// **** parseNullableObject **** //

export function parseNullableObject<T>(
  schema: Schema<T>,
): (arg: unknown) => TypedReturnValue<T, false, true, false>;

export function parseNullableObject<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => InferredReturnValue<S, false, true, false>;

export function parseNullableObject(schema: Schema<unknown>) {
  return parseObjectCore(false, true, false, schema, SAFETY.Normal);
}

// **** parseNullishObject **** //

export function parseNullishObject<T>(
  schema: Schema<T>,
): (arg: unknown) => TypedReturnValue<T, true, true, false>;

export function parseNullishObject<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => InferredReturnValue<S, true, true, false>;

export function parseNullishObject(schema: Schema<unknown>) {
  return parseObjectCore(true, true, false, schema, SAFETY.Normal);
}

// **** parseObjectArray **** //

export function parseObjectArray<T>(
  schema: Schema<T>,
): (arg: unknown) => TypedReturnValue<T, false, false, true>;

export function parseObjectArray<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => InferredReturnValue<S, false, false, true>;

export function parseObjectArray(schema: Schema<unknown>) {
  return parseObjectCore(false, false, true, schema, SAFETY.Normal);
}

// **** parseOpionalObjectArray **** //

export function parseOptionalObjectArray<T>(
  schema: Schema<T>,
): (arg: unknown) => TypedReturnValue<T, true, false, true>;

export function parseOptionalObjectArray<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => InferredReturnValue<S, true, false, true>;

export function parseOptionalObjectArray(schema: Schema<unknown>) {
  return parseObjectCore(true, false, true, schema, SAFETY.Normal);
}

// **** parseNullableObjectArray **** //

export function parseNullableObjectArray<T>(
  schema: Schema<T>,
): (arg: unknown) => TypedReturnValue<T, false, true, true>;

export function parseNullableObjectArray<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => InferredReturnValue<S, false, true, true>;

export function parseNullableObjectArray(schema: Schema<unknown>) {
  return parseObjectCore(false, true, true, schema, SAFETY.Normal);
}

// **** parseNullishObjectArray **** //

export function parseNullishObjectArray<T>(
  schema: Schema<T>,
): (arg: unknown) => TypedReturnValue<T, true, true, true>;

export function parseNullishObjectArray<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => InferredReturnValue<S, true, true, true>;

export function parseNullishObjectArray(schema: Schema<unknown>) {
  return parseObjectCore(true, true, true, schema, SAFETY.Normal);
}

/******************************************************************************
                          strictParseObject
******************************************************************************/

// **** strictParseObject **** //

export function strictParseObject<T>(
  schema: Schema<T>,
): (arg: unknown) => TypedReturnValue<T, false, false, false>;

export function strictParseObject<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => InferredReturnValue<S, false, false, false>;

export function strictParseObject(schema: Schema<unknown>) {
  return parseObjectCore(false, false, false, schema, SAFETY.Strict);
}

// **** strictParseOptionalObject **** //

export function strictParseOptionalObject<T>(
  schema: Schema<T>,
): (arg: unknown) => TypedReturnValue<T, true, false, false>;

export function strictParseOptionalObject<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => InferredReturnValue<S, true, false, false>;

export function strictParseOptionalObject(schema: Schema<unknown>) {
  return parseObjectCore(true, false, false, schema, SAFETY.Strict);
}

// **** strictParseNullableObject **** //

export function strictParseNullableObject<T>(
  schema: Schema<T>,
): (arg: unknown) => TypedReturnValue<T, false, true, false>;

export function strictParseNullableObject<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => InferredReturnValue<S, false, true, false>;

export function strictParseNullableObject(schema: Schema<unknown>) {
  return parseObjectCore(false, true, false, schema, SAFETY.Strict);
}

// **** strictParseNullishObject **** //

export function strictParseNullishObject<T>(
  schema: Schema<T>,
): (arg: unknown) => TypedReturnValue<T, true, true, false>;

export function strictParseNullishObject<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => InferredReturnValue<S, true, true, false>;

export function strictParseNullishObject(schema: Schema<unknown>) {
  return parseObjectCore(true, true, false, schema, SAFETY.Strict);
}

// **** strictParseObjectArray **** //

export function strictParseObjectArray<T>(
  schema: Schema<T>,
): (arg: unknown) => TypedReturnValue<T, false, false, true>;

export function strictParseObjectArray<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => InferredReturnValue<S, false, false, true>;

export function strictParseObjectArray(schema: Schema<unknown>) {
  return parseObjectCore(false, false, true, schema, SAFETY.Strict);
}

// **** strictParseOpionalObjectArray **** //

export function strictParseOptionalObjectArray<T>(
  schema: Schema<T>,
): (arg: unknown) => TypedReturnValue<T, true, false, true>;

export function strictParseOptionalObjectArray<
  S extends Record<string, unknown>,
>(schema: S): (arg: unknown) => InferredReturnValue<S, true, false, true>;

export function strictParseOptionalObjectArray(schema: Schema<unknown>) {
  return parseObjectCore(true, false, true, schema, SAFETY.Strict);
}

// **** strictParseNullableObjectArray **** //

export function strictParseNullableObjectArray<T>(
  schema: Schema<T>,
): (arg: unknown) => TypedReturnValue<T, false, true, true>;

export function strictParseNullableObjectArray<
  S extends Record<string, unknown>,
>(schema: S): (arg: unknown) => InferredReturnValue<S, false, true, true>;

export function strictParseNullableObjectArray(schema: Schema<unknown>) {
  return parseObjectCore(false, true, true, schema, SAFETY.Strict);
}

// **** strictParseNullishObjectArray **** //

export function strictParseNullishObjectArray<T>(
  schema: Schema<T>,
): (arg: unknown) => TypedReturnValue<T, true, true, true>;

export function strictParseNullishObjectArray<
  S extends Record<string, unknown>,
>(schema: S): (arg: unknown) => InferredReturnValue<S, true, true, true>;

export function strictParseNullishObjectArray(schema: Schema<unknown>) {
  return parseObjectCore(true, true, true, schema, SAFETY.Strict);
}

/******************************************************************************
                           looseParseObject
******************************************************************************/

// **** looseParseObject **** //

export function looseParseObject<T>(
  schema: Schema<T>,
): (arg: unknown) => TypedReturnValue<T, false, false, false>;

export function looseParseObject<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => InferredReturnValue<S, false, false, false>;

export function looseParseObject(schema: Schema<unknown>) {
  return parseObjectCore(false, false, false, schema, SAFETY.Loose);
}

// **** looseParseOptionalObject **** //

export function looseParseOptionalObject<T>(
  schema: Schema<T>,
): (arg: unknown) => TypedReturnValue<T, true, false, false>;

export function looseParseOptionalObject<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => InferredReturnValue<S, true, false, false>;

export function looseParseOptionalObject(schema: Schema<unknown>) {
  return parseObjectCore(true, false, false, schema, SAFETY.Loose);
}

// **** looseParseNullableObject **** //

export function looseParseNullableObject<T>(
  schema: Schema<T>,
): (arg: unknown) => TypedReturnValue<T, false, true, false>;

export function looseParseNullableObject<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => InferredReturnValue<S, false, true, false>;

export function looseParseNullableObject(schema: Schema<unknown>) {
  return parseObjectCore(false, true, false, schema, SAFETY.Loose);
}

// **** looseParseNullishObject **** //

export function looseParseNullishObject<T>(
  schema: Schema<T>,
): (arg: unknown) => TypedReturnValue<T, true, true, false>;

export function looseParseNullishObject<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => InferredReturnValue<S, true, true, false>;

export function looseParseNullishObject(schema: Schema<unknown>) {
  return parseObjectCore(true, true, false, schema, SAFETY.Loose);
}

// **** looseParseObjectArray **** //

export function looseParseObjectArray<T>(
  schema: Schema<T>,
): (arg: unknown) => TypedReturnValue<T, false, false, true>;

export function looseParseObjectArray<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => InferredReturnValue<S, false, false, true>;

export function looseParseObjectArray(schema: Schema<unknown>) {
  return parseObjectCore(false, false, true, schema, SAFETY.Loose);
}

// **** looseParseOpionalObjectArray **** //

export function looseParseOptionalObjectArray<T>(
  schema: Schema<T>,
): (arg: unknown) => TypedReturnValue<T, true, false, true>;

export function looseParseOptionalObjectArray<
  S extends Record<string, unknown>,
>(schema: S): (arg: unknown) => InferredReturnValue<S, true, false, true>;

export function looseParseOptionalObjectArray(schema: Schema<unknown>) {
  return parseObjectCore(true, false, true, schema, SAFETY.Loose);
}

// **** looseParseNullableObjectArray **** //

export function looseParseNullableObjectArray<T>(
  schema: Schema<T>,
): (arg: unknown) => TypedReturnValue<T, false, true, true>;

export function looseParseNullableObjectArray<
  S extends Record<string, unknown>,
>(schema: S): (arg: unknown) => InferredReturnValue<S, false, true, true>;

export function looseParseNullableObjectArray(schema: Schema<unknown>) {
  return parseObjectCore(false, true, true, schema, SAFETY.Loose);
}

// **** looseParseNullishObjectArray **** //

export function looseParseNullishObjectArray<T>(
  schema: Schema<T>,
): (arg: unknown) => TypedReturnValue<T, true, true, true>;

export function looseParseNullishObjectArray<S extends Record<string, unknown>>(
  schema: S,
): (arg: unknown) => InferredReturnValue<S, true, true, true>;

export function looseParseNullishObjectArray(schema: Schema<unknown>) {
  return parseObjectCore(true, true, true, schema, SAFETY.Loose);
}
