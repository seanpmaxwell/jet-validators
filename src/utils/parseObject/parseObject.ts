import parseObjectCore, {
  type OnErrorCallback,
  SAFETY,
  type Schema,
} from './parseObjectCore.js';

/******************************************************************************
                                 Types
******************************************************************************/

type CollpaseType<T> = T extends unknown ? T : never;
type ValidatorFn<T> = (arg: unknown) => arg is T;
type ResolveArray<T, A extends boolean> = A extends true ? T[] : T;

type ResolveNullables<T, O extends boolean, N extends boolean> =
  | (O extends true ? undefined : never)
  | (N extends true ? null : never)
  | T;

// **** Inferring the type from the schema **** //

type CollapseType<T> = {
  [K in keyof T]: T[K];
} & {};

type InferTypeFromSchema<S> = {
  [K in keyof S]: S[K] extends ValidatorFn<infer R>
    ? R
    : S[K] extends object
      ? CollapseType<InferTypeFromSchema<S[K]>>
      : never;
};

export type InferredReturnValue<
  S,
  O extends boolean,
  N extends boolean,
  A extends boolean,
> = ResolveNullables<
  ResolveArray<CollapseType<InferTypeFromSchema<S>>, A>,
  O,
  N
>;

// **** When a generic type is explicitly added **** //

export type TypedReturnValue<
  T,
  O extends boolean,
  N extends boolean,
  A extends boolean,
> = ResolveNullables<ResolveArray<T, A>, O, N>;

/******************************************************************************
                              parseObject
******************************************************************************/

// **** parseObject **** //

export function parseObject<S extends object>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => InferredReturnValue<S, false, false, false>;

export function parseObject<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => TypedReturnValue<T, false, false, false>;

export function parseObject(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return parseObjectCore(false, false, false, schema, SAFETY.Normal, onError);
}

// **** parseOptionalObject **** //

export function parseOptionalObject<S extends object>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => CollpaseType<InferredReturnValue<S, true, false, false>>;

export function parseOptionalObject<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => TypedReturnValue<T, true, false, false>;

export function parseOptionalObject(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return parseObjectCore(true, false, false, schema, SAFETY.Normal, onError);
}

// **** parseNullableObject **** //

export function parseNullableObject<S extends object>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => CollpaseType<InferredReturnValue<S, false, true, false>>;

export function parseNullableObject<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => TypedReturnValue<T, false, true, false>;

export function parseNullableObject(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return parseObjectCore(false, true, false, schema, SAFETY.Normal, onError);
}

// **** parseNullishObject **** //

export function parseNullishObject<S extends object>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => CollpaseType<InferredReturnValue<S, true, true, false>>;

export function parseNullishObject<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => TypedReturnValue<T, true, true, false>;

export function parseNullishObject(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return parseObjectCore(true, true, false, schema, SAFETY.Normal, onError);
}

// **** parseObjectArray **** //

export function parseObjectArray<S extends object>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => InferredReturnValue<S, false, false, true>;

export function parseObjectArray<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => TypedReturnValue<T, false, false, true>;

export function parseObjectArray(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return parseObjectCore(false, false, true, schema, SAFETY.Normal, onError);
}

// **** parseOpionalObjectArray **** //

export function parseOptionalObjectArray<S extends object>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => CollpaseType<InferredReturnValue<S, true, false, true>>;

export function parseOptionalObjectArray<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => TypedReturnValue<T, true, false, true>;

export function parseOptionalObjectArray(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return parseObjectCore(true, false, true, schema, SAFETY.Normal, onError);
}

// **** parseNullableObjectArray **** //

export function parseNullableObjectArray<S extends object>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => CollpaseType<InferredReturnValue<S, false, true, true>>;

export function parseNullableObjectArray<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => TypedReturnValue<T, false, true, true>;

export function parseNullableObjectArray(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return parseObjectCore(false, true, true, schema, SAFETY.Normal, onError);
}

// **** parseNullishObjectArray **** //

export function parseNullishObjectArray<S extends object>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => CollpaseType<InferredReturnValue<S, true, true, true>>;

export function parseNullishObjectArray<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => TypedReturnValue<T, true, true, true>;

export function parseNullishObjectArray(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return parseObjectCore(true, true, true, schema, SAFETY.Normal, onError);
}

/******************************************************************************
                          strictParseObject
******************************************************************************/

// **** strictParseObject **** //

export function strictParseObject<S extends object>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => InferredReturnValue<S, false, false, false>;

export function strictParseObject<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => TypedReturnValue<T, false, false, false>;

export function strictParseObject(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return parseObjectCore(false, false, false, schema, SAFETY.Strict, onError);
}

// **** strictParseOptionalObject **** //

export function strictParseOptionalObject<S extends object>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => CollpaseType<InferredReturnValue<S, true, false, false>>;

export function strictParseOptionalObject<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => TypedReturnValue<T, true, false, false>;

export function strictParseOptionalObject(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return parseObjectCore(true, false, false, schema, SAFETY.Strict, onError);
}

// **** strictParseNullableObject **** //

export function strictParseNullableObject<S extends object>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => CollpaseType<InferredReturnValue<S, false, true, false>>;

export function strictParseNullableObject<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => TypedReturnValue<T, false, true, false>;

export function strictParseNullableObject(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return parseObjectCore(false, true, false, schema, SAFETY.Strict, onError);
}

// **** strictParseNullishObject **** //

export function strictParseNullishObject<S extends object>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => CollpaseType<InferredReturnValue<S, true, true, false>>;

export function strictParseNullishObject<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => TypedReturnValue<T, true, true, false>;

export function strictParseNullishObject(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return parseObjectCore(true, true, false, schema, SAFETY.Strict, onError);
}

// **** strictParseObjectArray **** //

export function strictParseObjectArray<S extends object>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => InferredReturnValue<S, false, false, true>;

export function strictParseObjectArray<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => TypedReturnValue<T, false, false, true>;

export function strictParseObjectArray(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return parseObjectCore(false, false, true, schema, SAFETY.Strict, onError);
}

// **** strictParseOpionalObjectArray **** //

export function strictParseOptionalObjectArray<S extends object>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => CollpaseType<InferredReturnValue<S, true, false, true>>;

export function strictParseOptionalObjectArray<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => TypedReturnValue<T, true, false, true>;

export function strictParseOptionalObjectArray(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return parseObjectCore(true, false, true, schema, SAFETY.Strict, onError);
}

// **** strictParseNullableObjectArray **** //

export function strictParseNullableObjectArray<S extends object>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => CollpaseType<InferredReturnValue<S, false, true, true>>;

export function strictParseNullableObjectArray<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => TypedReturnValue<T, false, true, true>;

export function strictParseNullableObjectArray(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return parseObjectCore(false, true, true, schema, SAFETY.Strict, onError);
}

// **** strictParseNullishObjectArray **** //

export function strictParseNullishObjectArray<S extends object>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => CollpaseType<InferredReturnValue<S, true, true, true>>;

export function strictParseNullishObjectArray<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => TypedReturnValue<T, true, true, true>;

export function strictParseNullishObjectArray(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return parseObjectCore(true, true, true, schema, SAFETY.Strict, onError);
}

/******************************************************************************
                           looseParseObject
******************************************************************************/

// **** looseParseObject **** //

export function looseParseObject<S extends object>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => InferredReturnValue<S, false, false, false>;

export function looseParseObject<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => TypedReturnValue<T, false, false, false>;

export function looseParseObject(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return parseObjectCore(false, false, false, schema, SAFETY.Loose, onError);
}

// **** looseParseOptionalObject **** //

export function looseParseOptionalObject<S extends object>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => CollpaseType<InferredReturnValue<S, true, false, false>>;

export function looseParseOptionalObject<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => TypedReturnValue<T, true, false, false>;

export function looseParseOptionalObject(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return parseObjectCore(true, false, false, schema, SAFETY.Loose, onError);
}

// **** looseParseNullableObject **** //

export function looseParseNullableObject<S extends object>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => CollpaseType<InferredReturnValue<S, false, true, false>>;

export function looseParseNullableObject<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => TypedReturnValue<T, false, true, false>;

export function looseParseNullableObject(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return parseObjectCore(false, true, false, schema, SAFETY.Loose, onError);
}

// **** looseParseNullishObject **** //

export function looseParseNullishObject<S extends object>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => CollpaseType<InferredReturnValue<S, true, true, false>>;

export function looseParseNullishObject<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => TypedReturnValue<T, true, true, false>;

export function looseParseNullishObject(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return parseObjectCore(true, true, false, schema, SAFETY.Loose, onError);
}

// **** looseParseObjectArray **** //

export function looseParseObjectArray<S extends object>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => InferredReturnValue<S, false, false, true>;

export function looseParseObjectArray<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => TypedReturnValue<T, false, false, true>;

export function looseParseObjectArray(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return parseObjectCore(false, false, true, schema, SAFETY.Loose, onError);
}

// **** looseParseOpionalObjectArray **** //

export function looseParseOptionalObjectArray<S extends object>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => CollpaseType<InferredReturnValue<S, true, false, true>>;

export function looseParseOptionalObjectArray<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => TypedReturnValue<T, true, false, true>;

export function looseParseOptionalObjectArray(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return parseObjectCore(true, false, true, schema, SAFETY.Loose, onError);
}

// **** looseParseNullableObjectArray **** //

export function looseParseNullableObjectArray<S extends object>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => CollpaseType<InferredReturnValue<S, false, true, true>>;

export function looseParseNullableObjectArray<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => TypedReturnValue<T, false, true, true>;

export function looseParseNullableObjectArray(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return parseObjectCore(false, true, true, schema, SAFETY.Loose, onError);
}

// **** looseParseNullishObjectArray **** //

export function looseParseNullishObjectArray<S extends object>(
  schema: S,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => CollpaseType<InferredReturnValue<S, true, true, true>>;

export function looseParseNullishObjectArray<T>(
  schema: Schema<T>,
  onError?: OnErrorCallback,
): (
  arg: unknown,
  onError?: OnErrorCallback,
) => TypedReturnValue<T, true, true, true>;

export function looseParseNullishObjectArray(
  schema: Schema<unknown>,
  onError?: OnErrorCallback,
) {
  return parseObjectCore(true, true, true, schema, SAFETY.Loose, onError);
}
