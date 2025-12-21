/******************************************************************************
                              testObject
******************************************************************************/

/**
 * Call parseObject and return true if not false.
 */
export const testObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) =>
  testObjectHelper<U, false, false, false>(
    schema,
    false,
    false,
    false,
    SAFETY.Default,
    onError,
  );

export const testOptionalObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) =>
  testObjectHelper<U, true, false, false>(
    schema,
    true,
    false,
    false,
    SAFETY.Default,
    onError,
  );

export const testNullableObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) =>
  testObjectHelper<U, false, true, false>(
    schema,
    false,
    true,
    false,
    SAFETY.Default,
    onError,
  );

export const testNullishObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) =>
  testObjectHelper<U, true, true, false>(
    schema,
    true,
    true,
    false,
    SAFETY.Default,
    onError,
  );

export const testObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) =>
  testObjectHelper<U, false, false, true>(
    schema,
    false,
    false,
    true,
    SAFETY.Default,
    onError,
  );

export const testOptionalObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) =>
  testObjectHelper<U, true, false, true>(
    schema,
    true,
    false,
    true,
    SAFETY.Default,
    onError,
  );

export const testNullableObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) =>
  testObjectHelper<U, false, true, true>(
    schema,
    false,
    true,
    true,
    SAFETY.Default,
    onError,
  );

export const testNullishObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) =>
  testObjectHelper<U, true, true, true>(
    schema,
    true,
    true,
    true,
    SAFETY.Default,
    onError,
  );

// **** Loose testObject **** //

export const looseTestObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) =>
  testObjectHelper<U, false, false, false>(
    schema,
    false,
    false,
    false,
    SAFETY.Loose,
    onError,
  );

export const looseTestOptionalObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) =>
  testObjectHelper<U, true, false, false>(
    schema,
    true,
    false,
    false,
    SAFETY.Loose,
    onError,
  );

export const looseTestNullableObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) =>
  testObjectHelper<U, false, true, false>(
    schema,
    false,
    true,
    false,
    SAFETY.Loose,
    onError,
  );

export const looseTestNullishObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) =>
  testObjectHelper<U, true, true, false>(
    schema,
    true,
    true,
    false,
    SAFETY.Loose,
    onError,
  );

export const looseTestObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) =>
  testObjectHelper<U, false, false, true>(
    schema,
    false,
    false,
    true,
    SAFETY.Loose,
    onError,
  );

export const looseTestOptionalObjectArray = <
  T,
  U extends TSchema<T> = TSchema<T>,
>(
  schema: U,
  onError?: TParseOnError,
) =>
  testObjectHelper<U, true, false, true>(
    schema,
    true,
    false,
    true,
    SAFETY.Loose,
    onError,
  );

export const looseTestNullableObjectArray = <
  T,
  U extends TSchema<T> = TSchema<T>,
>(
  schema: U,
  onError?: TParseOnError,
) =>
  testObjectHelper<U, false, true, true>(
    schema,
    false,
    true,
    true,
    SAFETY.Loose,
    onError,
  );

export const looseTestNullishObjectArray = <
  T,
  U extends TSchema<T> = TSchema<T>,
>(
  schema: U,
  onError?: TParseOnError,
) =>
  testObjectHelper<U, true, true, true>(
    schema,
    true,
    true,
    true,
    SAFETY.Loose,
    onError,
  );

// **** Strict testObject **** //

export const strictTestObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) =>
  testObjectHelper<U, false, false, false>(
    schema,
    false,
    false,
    false,
    SAFETY.Strict,
    onError,
  );

export const strictTestOptionalObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) =>
  testObjectHelper<U, true, false, false>(
    schema,
    true,
    false,
    false,
    SAFETY.Strict,
    onError,
  );

export const strictTestNullableObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) =>
  testObjectHelper<U, false, true, false>(
    schema,
    false,
    true,
    false,
    SAFETY.Strict,
    onError,
  );

export const strictTestNullishObject = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) =>
  testObjectHelper<U, true, true, false>(
    schema,
    true,
    true,
    false,
    SAFETY.Strict,
    onError,
  );

export const strictTestObjectArray = <T, U extends TSchema<T> = TSchema<T>>(
  schema: U,
  onError?: TParseOnError,
) =>
  testObjectHelper<U, false, false, true>(
    schema,
    false,
    false,
    true,
    SAFETY.Strict,
    onError,
  );

export const strictTestOptionalObjectArray = <
  T,
  U extends TSchema<T> = TSchema<T>,
>(
  schema: U,
  onError?: TParseOnError,
) =>
  testObjectHelper<U, true, false, true>(
    schema,
    true,
    false,
    true,
    SAFETY.Strict,
    onError,
  );

export const strictTestNullableObjectArray = <
  T,
  U extends TSchema<T> = TSchema<T>,
>(
  schema: U,
  onError?: TParseOnError,
) =>
  testObjectHelper<U, false, true, true>(
    schema,
    false,
    true,
    true,
    SAFETY.Strict,
    onError,
  );

export const strictTestNullishObjectArray = <
  T,
  U extends TSchema<T> = TSchema<T>,
>(
  schema: U,
  onError?: TParseOnError,
) =>
  testObjectHelper<U, true, true, true>(
    schema,
    true,
    true,
    true,
    SAFETY.Strict,
    onError,
  );

/**
 * Like "parseObj" but returns a type-predicate instead of the object.
 */
function testObjectHelper<
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
  const parseFn = parseObjectHelper(
    schema,
    optional,
    nullable,
    isArr,
    safety,
    onError,
  );
  return (arg: unknown, onError?: TParseOnError): arg is typeof res => {
    const res = parseFn(arg, onError);
    return (res as unknown) !== false;
  };
}
