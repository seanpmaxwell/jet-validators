import parseObjectCore, {
  SAFETY,
  type OnErrorCallback,
} from './parseObjectCore/index.js';

import type { TransformValidatorFn } from './simple-utils.js';

/******************************************************************************
                                  Types
******************************************************************************/

// **** Utility Types **** //

type AddNull<T, N> = N extends true ? T | null : T;
type AddNullables<T, O, N> = O extends true
  ? AddNull<T, N> | undefined
  : AddNull<T, N>;
type AddMods<T, O, N, A> = A extends true
  ? AddNullables<T[], O, N>
  : AddNullables<T, O, N>;

// **** Error Types **** //

// **** Basic Types **** //

interface IParseValidatorFn<T> {
  (arg: unknown, onError?: OnErrorCallback): arg is T;
  isTransformFunction?: true;
}

type TValidatorFn<T> = (arg: unknown) => arg is T;

// **** Type-safing the schema **** //

export type TSchema<T = unknown> = unknown extends T
  ? IBasicSchema
  : TSchemaHelper<T>;

export type TSchemaHelper<T> = Required<{
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? IParseValidatorFn<T[K]> | TransformValidatorFn<T[K]> | TSchemaHelper<T[K]>
    : IParseValidatorFn<T[K]> | TransformValidatorFn<T[K]>;
}>;

interface IBasicSchema {
  [key: string]:
    | TransformValidatorFn<unknown>
    | IParseValidatorFn<unknown>
    | IBasicSchema;
}

type TInferFromSchema<U, O, N, A, Schema = TInferFromSchemaHelper<U>> = AddMods<
  Schema,
  O,
  N,
  A
>;

type TInferFromSchemaHelper<U> = {
  [K in keyof U]: U[K] extends TValidatorFn<infer X>
    ? X
    : U[K] extends IBasicSchema
      ? TInferFromSchemaHelper<U[K]>
      : never;
};

/******************************************************************************
                              parseObject
******************************************************************************/

export const parseObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: OnErrorCallback,

  // pick up here, TSchema<T> probably needs to inherit from the ICoreSchema
  // object
) => parseObjectCore(schema, false, false, false, SAFETY.Normal, onError);

// parseObjectHelper<U, false, false, false>(
//   schema,
//   false,
//   false,
//   false,
//   SAFETY.Default,
//   onError,
// );

export const parseOptionalObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: OnErroCallback,
) =>
  parseObjectHelper<U, true, false, false>(
    schema,
    true,
    false,
    false,
    SAFETY.Default,
    onError,
  );

export const parseNullableObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: OnErroCallback,
) =>
  parseObjectHelper<U, false, true, false>(
    schema,
    false,
    true,
    false,
    SAFETY.Default,
    onError,
  );

export const parseNullishObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: OnErroCallback,
) =>
  parseObjectHelper<U, true, true, false>(
    schema,
    true,
    true,
    false,
    SAFETY.Default,
    onError,
  );

export const parseObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: OnErroCallback,
) =>
  parseObjectHelper<U, false, false, true>(
    schema,
    false,
    false,
    true,
    SAFETY.Default,
    onError,
  );

export const parseOptionalObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: OnErroCallback,
) =>
  parseObjectHelper<U, true, false, true>(
    schema,
    true,
    false,
    true,
    SAFETY.Default,
    onError,
  );

export const parseNullableObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: OnErroCallback,
) =>
  parseObjectHelper<U, false, true, true>(
    schema,
    false,
    true,
    true,
    SAFETY.Default,
    onError,
  );

export const parseNullishObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: OnErroCallback,
) =>
  parseObjectHelper<U, true, true, true>(
    schema,
    true,
    true,
    true,
    SAFETY.Default,
    onError,
  );

// **** Loose parseObject **** //

export const looseParseObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: OnErroCallback,
) =>
  parseObjectHelper<U, false, false, false>(
    schema,
    false,
    false,
    false,
    SAFETY.Loose,
    onError,
  );

export const looseParseOptionalObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: OnErroCallback,
) =>
  parseObjectHelper<U, true, false, false>(
    schema,
    true,
    false,
    false,
    SAFETY.Loose,
    onError,
  );

export const looseParseNullableObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: OnErroCallback,
) =>
  parseObjectHelper<U, false, true, false>(
    schema,
    false,
    true,
    false,
    SAFETY.Loose,
    onError,
  );

export const looseParseNullishObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: OnErroCallback,
) =>
  parseObjectHelper<U, true, true, false>(
    schema,
    true,
    true,
    false,
    SAFETY.Loose,
    onError,
  );

export const looseParseObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: OnErroCallback,
) =>
  parseObjectHelper<U, false, false, true>(
    schema,
    false,
    false,
    true,
    SAFETY.Loose,
    onError,
  );

export const looseParseOptionalObjectArray = <
  T,
  U extends TSchema<T> = TSchema<T>,
>(
  schema: U,
  onError?: OnErroCallback,
) =>
  parseObjectHelper<U, true, false, true>(
    schema,
    true,
    false,
    true,
    SAFETY.Loose,
    onError,
  );

export const looseParseNullableObjectArray = <
  T,
  U extends TSchema<T> = TSchema<T>,
>(
  schema: U,
  onError?: OnErroCallback,
) =>
  parseObjectHelper<U, false, true, true>(
    schema,
    false,
    true,
    true,
    SAFETY.Loose,
    onError,
  );

export const looseParseNullishObjectArray = <
  T,
  U extends TSchema<T> = TSchema<T>,
>(
  schema: U,
  onError?: OnErroCallback,
) =>
  parseObjectHelper<U, true, true, true>(
    schema,
    true,
    true,
    true,
    SAFETY.Loose,
    onError,
  );

// **** Strict parseObject **** //

export const strictParseObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: OnErroCallback,
) =>
  parseObjectHelper<U, false, false, false>(
    schema,
    false,
    false,
    false,
    SAFETY.Strict,
    onError,
  );

export const strictParseOptionalObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: OnErroCallback,
) =>
  parseObjectHelper<U, true, false, false>(
    schema,
    true,
    false,
    false,
    SAFETY.Strict,
    onError,
  );

export const strictParseNullableObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: OnErroCallback,
) =>
  parseObjectHelper<U, false, true, false>(
    schema,
    false,
    true,
    false,
    SAFETY.Strict,
    onError,
  );

export const strictParseNullishObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: OnErroCallback,
) =>
  parseObjectHelper<U, true, true, false>(
    schema,
    true,
    true,
    false,
    SAFETY.Strict,
    onError,
  );

export const strictParseObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: OnErroCallback,
) =>
  parseObjectHelper<U, false, false, true>(
    schema,
    false,
    false,
    true,
    SAFETY.Strict,
    onError,
  );

export const strictParseOptionalObjectArray = <
  T,
  U extends TSchema<T> = TSchema<T>,
>(
  schema: U,
  onError?: OnErroCallback,
) =>
  parseObjectHelper<U, true, false, true>(
    schema,
    true,
    false,
    true,
    SAFETY.Strict,
    onError,
  );

export const strictParseNullableObjectArray = <
  T,
  U extends TSchema<T> = TSchema<T>,
>(
  schema: U,
  onError?: OnErroCallback,
) =>
  parseObjectHelper<U, false, true, true>(
    schema,
    false,
    true,
    true,
    SAFETY.Strict,
    onError,
  );

export const strictParseNullishObjectArray = <
  T,
  U extends TSchema<T> = TSchema<T>,
>(
  schema: U,
  onError?: OnErroCallback,
) =>
  parseObjectHelper<U, true, true, true>(
    schema,
    true,
    true,
    true,
    SAFETY.Strict,
    onError,
  );
