# jet-validators ✈️

[![npm](https://img.shields.io/npm/v/jet-validators?label=npm&color=0ea5e9)](https://www.npmjs.com/package/jet-validators)
[![downloads](https://img.shields.io/npm/dm/jet-validators?label=downloads&color=38bdf8)](https://www.npmjs.com/package/jet-validators)
[![types](https://img.shields.io/npm/types/jet-validators?label=types&color=22c55e)](https://www.npmjs.com/package/jet-validators)
[![bundle size](https://img.shields.io/bundlephobia/minzip/jet-validators?label=bundle&color=0f172a)](https://bundlephobia.com/package/jet-validators)
[![license](https://img.shields.io/npm/l/jet-validators?label=license&color=334155)](LICENSE)

> A comprehensive collection of TypeScript validator functions and utilities for common compile and runtime checks.

## Table of Contents

* [Introduction](#introduction)
* [Installation](#installation)
* [Basic Validators](#basic-validators)
* [Complex Validators](#complex-validators)
* [Utilities](#utilities)
* [Object Schema Validation](#object-schema-validation)
* [Safety Modes](#safety-modes)

<br/>

## Introduction <a name="introduction"></a>

`jet-validators` is a large collection of small, composable validator functions commonly used when validating values in TypeScript.

It is **not** intended to replace full-featured schema libraries like `zod`, `valibot`, or `ajv`. Instead, it focuses on:

* Zero dependencies
* Minimal boilerplate
* Excellent type narrowing
* Drop-in validators you can import and use immediately

### Quick Glance

```ts
import { isOptionalString } from 'jet-validators';

if (isOptionalString(value)) {
  // value is string | undefined
}
```

### Why jet-validators?

* Covers the vast majority of real-world validation needs
* No initialization or schema definitions required for basic checks
* Includes helpers for transforming values before validation
* Lightweight object schema validation utilities
* **Zero dependencies**

<br/>

## Installation <a name="installation"></a>

```bash
npm install jet-validators
```

<br/>

## Basic Validators <a name="basic-validators"></a>

Basic validators can be imported directly and used without configuration.

All validators follow consistent naming patterns:

* `isX`
* `isOptionalX`
* `isNullableX`
* `isNullishX`
* `isXArray` (and variants)

### Nullables

* `isUndef`
* `isNull`
* `isNullish` (`null | undefined`)

---

### `isBoolean`

* `isBoolean`
* `isOptionalBoolean`
* `isNullableBoolean`
* `isNullishBoolean`
* `isBooleanArray` (+ variants)

---

### `isValidBoolean`

Valid after running through [parseBoolean](#parse-boolean)

* `isValidBoolean`
* `isOptionalValidBoolean`
* `isNullableValidBoolean`
* `isNullishValidBoolean`
* `isValidBooleanArray` (+ variants)

---

### `isNumber`

* `isNumber` (+ optional / nullable / array variants)

Sub-categories:

* **Positive**
* **Negative**
* **Unsigned**

Each includes the full optional / nullable / array variants.

---

### `isInteger`

Same structure as `isNumber`, including:

* Positive
* Negative
* Unsigned

---

### `isBigInt`

* `isBigInt`
* `isOptionalBigInt`
* `isNullableBigInt`
* `isNullishBigInt`
* `isBigIntArray` (+ variants)

---

### `isValidNumber`

Valid after numeric coercion.

* `isValidNumber`
* `isOptionalValidNumber`
* `isNullableValidNumber`
* `isNullishValidNumber`
* `isValidNumberArray` (+ variants)

---

### `isString`

* `isString` (+ optional / nullable / array variants)

---

### `isNonEmptyString`

Ensures `.length > 0`.

* `isNonEmptyString` (+ variants)

---

### `isSymbol`

* `isSymbol` (+ variants)

---

### `isDate`

Checks for a `Date` instance with a valid timestamp.

```ts
!isNaN(date.getTime())
```

* `isDate` (+ variants)

---

### `isValidDate`

Accepts `Date`, `string`, or `number` and validates via `new Date(...)`.

* `isValidDate` (+ variants)

---

### `isObject`

* `isObject` (+ variants)

---

### `isFunction`

* `isFunction` (+ variants)

<br/>

## Complex Validators <a name="complex-validators"></a>

These require an initialization step and return a validator function.

---

### `isInArray`

```ts
const isAllowed = isInArray(['a', 'b', 'c']);
isAllowed('a'); // true
```

Supports optional / nullable variants.

---

### `isInRange`

Checks whether a number (or numeric string) falls within a range.

Rules:

* `(min, max)` → exclusive
* `[min], [max]` → inclusive
* `[]` → no bound
* Reverse bounds → “outside range”

```ts
const between0and100 = isInRange([0], [100]);
between0and100(50);   // true
between0and100('100'); // true
```

```ts
const negative = isInRange([], 0);
negative(-1); // true
```

```ts
const outside = isInRange(100, 50);
outside(101); // true
outside(75);  // false
```

---

### `isKeyOf`

Checks whether a value is a key of an object.

```ts
const obj = { foo: 'bar', baz: 'qux' } as const;
const isKey = isKeyOf(obj);

isKey('foo'); // true
```

> Note: Does not support symbol keys.

---

### `isValueOf`

Checks whether a value exists in an object.

```ts
const obj = { foo: 'bar', baz: 'qux' } as const;
const isValue = isValueOf(obj);

isValue('bar'); // true
```

Includes the `ValueOf<T>` utility type.

<br/>

## Utilities <a name="utilities"></a>

Utilities are imported from:

```ts
import { parseObject } from 'jet-validators/utils';
```

---

### `nonNullable`

Removes `null` and `undefined` from a validator.

```ts
const isStrictString = nonNullable(isNullishString);
```

---

### `makeOptional / makeNullable / makeNullish`

Wrap custom validators to extend their accepted types.

```ts
const isEmail = (arg: unknown): arg is TEmail =>
  isString(arg) && EMAIL_REGEX.test(arg);

const isNullishEmail = makeNullish(isEmail);
```

---

### `transform`

Transforms a value before validation.

```ts
const isParsedArray = transform(JSON.parse, isNumberArray);
```

Supports callbacks for accessing transformed values.

---

### `parseBoolean` <a name="parse-boolean"></a>

Converts common boolean representations:

* `"true"`, `"false"` (case-insensitive)
* `"1"`, `"0"`
* `1`, `0`

```ts
parseBoolean('TrUe'); // true
parseBoolean(0);      // false
```

---

### `parseJson`

Safely wraps `JSON.parse`.

```ts
const nums = parseJson<number[]>('[1,2,3]');
```

Throws if input is not a string.

<br/>

## Object Schema Validation <a name="object-schema-validation"></a>

Lightweight schema validation for objects using validator functions.

> These utilities are intentionally simpler than libraries like Zod or AJV.

---

### `parseObject`

* Transforms values
* Removes unknown keys (by default)
* Returns parsed output or `false`
* Optional error callback

```ts
const parseUser = parseObject<IUser>({
  id: transform(Number, isNumber),
  name: isString,
});
```

Supports:

* optional / nullable
* arrays
* nested schemas
* loose / strict modes

---

### `testObject`

Same behavior as `parseObject`, but returns a **type predicate**.

```ts
if (testUser(user)) {
  // user is IUser
}
```

---

### Combining parse + test

Nested schemas may use `testObject` inside `parseObject`, with caveats around TypeScript inference. Supplying generics restores full type safety.

---

### Custom Validators

Any function of the form:

```ts
(arg: unknown) => arg is T
```

can be used in schemas.

---

### Wrapping parse/test

When wrapping these utilities, ensure your generics extend `TSchema<T>` to preserve type safety.

---

## Safety Modes <a name="safety-modes"></a>

Control how extra object properties are handled:

* **loose** – keep extra keys
* **default** – remove extra keys (no error)
* **strict** – remove extra keys and emit errors

```ts
const strictUser = strictParseObject({...});
```

Nested schemas inherit the parent mode unless overridden.

---

## Summary

`jet-validators` is ideal when you want:

* Fast runtime validation
* Strong type narrowing
* No heavy schema machinery
* Simple, composable utilities

Perfect for APIs, config parsing, and runtime safety without dependency bloat.

---
