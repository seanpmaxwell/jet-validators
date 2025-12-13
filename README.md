# jet-validators 🧑✈️
> A list common TypeScript validator-functions and some useful utilities to go with them.
<br/>


## Table of Contents
- [Introduction](#introduction)
- [Installation](#installation)
- [Basic Validators](#basic-validators)
  - [Nullables](#nullables)
  - [isBoolean](#is-noolean)
  - [isValidBoolean](#is-valid-boolean)
  - [isNumber](#is-number)
  - [isInteger](#is-integer)
  - [isBigInt](#is-bigint)
  - [isValidNumber](#is-valid-number)
  - [isString](#is-string)
  - [isNonEmptyString](#is-non-empty-string)
  - [isSymbol](#is-symbol)
  - [isDate](#is-date)
  - [isValidDate](#is-valid-date)
  - [isObject](#is-object)
  - [isFunction](#is-function)
- [Complex Validators](#complex-validators)
  - [isInArray](#is-in-array)
  - [isInRange](#is-in-range)
  - [isKeyOf](#is-key-of)
  - [isValueOf](#is-value-of)
- [Utilities](#utilities)
  - [Simple Utilities](#simple-utilities)
    - [nonNullable](#non-nullable)
    - [makeNullables](#make-nullables)
    - [transform](#transform)
    - [parseBoolean](#parse-boolean)
    - [parseJson](#parse-json)
  - [Validating object schemas](#validating-object-schemas)
    - [parseObject](#parse-object)
    - [testObject](#test-object)
    - [Combining parseObject and testObject](#combining-test-parse)
    - [Custom Validators](#custom-validators)
    - [Wrapping Parse/Test](#wrapping-parse-test)
    - [Safety settings for parseObject](#parseObject-safety)
<br/>


## Introduction <a name="introduction"></a>
A simple, but long, list of validator-functions commonly used when checking values in TypeScript. This is not meant to replace advanced schema validation libraries like `zod`, `valibot`, `jet-schema` etc. This is just a list of pre-defined validator-functions to save you time and boilerplate code in TypeScript.

### Quick Glance
```typescript
import { isOptionalString, isRecord } from 'jet-validators';

if (isOptionalString(value)) { // value is string | undefined
  ...do stuff...
}
```

### Why jet-validators
- Contains validator-functions for the vast majority of real world scenarios you will encounter.
- For basic validators, there's no initialization step, you just import the validator-function and start using it.
- Contains some useful utilities for modifying values before validation.
- Also has some utilities for object schema validation. 
- Zero dependency!
<br/>

## Installation <a name="installation"></a>
```bash
npm i -s jet-validators
```
<br/>

## Basic Validators <a name="basic-validators"></a>
These can be imported and used directly and don't require any configuration.

### Nullables <a name="nullables"></a>
- isUndef
- isNull
- isNullish (is `null` or `undefined`)

### `isBoolean` <a name="is-boolean"></a>
- isBoolean
- isOptionalBoolean
- isNullableBoolean
- isNullishBoolean
- isBooleanArray
- isOptionalBooleanArray
- isNullableBooleanArray
- isNullishBooleanArray

### `isValidBoolean` <a name="is-valid-boolean"></a>
Is it a valid boolean after calling the `parseBoolean` utility function.
- isValidBoolean
- isOptionalValidBoolean
- isNullableValidBoolean
- isNullishValidBoolean
- isValidBooleanArray
- isOptionalValidBooleanArray
- isNullableValidBooleanArray
- isNullishValidBooleanArray

### `isNumber` <a name="is-number"></a>
- isNumber
- isOptionalNumber
- isNullableNumber
- isNullishNumber
- isNumberArray
- isOptionalNumberArray
- isNullableNumberArray
- isNullishNumberArray

Positive Number
- isPositiveNumber
- isOptionalPositiveNumber
- isNullablePositiveNumber
- isNullishPositiveNumber
- isPositiveNumberArray
- isOptionalPositiveNumberArray
- isNullablePositiveNumberArray
- isNullishPositiveNumberArray

Negative Number
- isNegativeNumber
- isOptionalNegativeNumber
- isNullableNegativeNumber
- isNullishNegativeNumber
- isNegativeNumberArray
- isOptionalNegativeNumberArray
- isNullableNegativeNumberArray
- isNullishNegativeNumberArray

Unsigned Number
- isUnsignedNumber
- isOptionalUnsignedNumber
- isNullableUnsignedNumber
- isNullishUnsignedNumber
- isUnsignedNumberArray
- isOptionalUnsignedNumberArray
- isNullableUnsignedNumberArray
- isNullishUnsignedNumberArray

### `isInteger` <a name="is-integer"></a>
- isInteger
- isOptionalInteger
- isNullableInteger
- isNullishInteger
- isIntegerArray
- isOptionalIntegerArray
- isNullableIntegerArray
- isNullishIntegerArray

Positive Integer
- isPositiveInteger
- isOptionalPositiveInteger
- isNullablePositiveInteger
- isNullishPositiveInteger
- isPositiveIntegerArray
- isOptionalPositiveIntegerArray
- isNullablePositiveIntegerArray
- isNullishPositiveIntegerArray

Negative Integer
- isNegativeInteger
- isOptionalNegativeInteger
- isNullableNegativeInteger
- isNullishNegativeInteger
- isNegativeIntegerArray
- isOptionalNegativeIntegerArray
- isNullableNegativeIntegerArray
- isNullishNegativeIntegerArray

Unsigned Integer
- isUnsignedInteger
- isOptionalUnsignedInteger
- isNullableUnsignedInteger
- isNullishUnsignedInteger
- isUnsignedIntegerArray
- isOptionalUnsignedIntegerArray
- isNullableUnsignedIntegerArray
- isNullishUnsignedIntegerArray

### `isBigInt` <a name="is-bigint"></a>
- isBigInt
- isOptionalBigInt
- isNullableBigInt
- isNullishBigInt
- isBigIntArray
- isOptionalBigIntArray
- isNullableBigIntArray
- isNullishBigIntArr

### `isValidNumber` <a name="is-valid-number"></a>
- isValidNumber
- isOptionalValidNumber
- isNullableValidNumber
- isNullishValidNumber
- isValidNumberArray
- isOptionalValidNumberArray
- isNullableValidNumberArray
- isNishValidNumArr

### `isString` <a name="is-string"></a>
- isString
- isOptionalString
- isNullableString
- isNullishString
- isStringArray
- isOptionalStringArray
- isNullableStringArray
- isNullishStringArray

### `isNonEmptyString` <a name="is-non-empty-string"></a>
- isNonEmptyString
- isOptionalNonEmptyString
- isNullableNonEmptyString
- isNullishNonEmptyString
- isNonEmptyStringArray
- isOptionalNonEmptyStringArray
- isNullableNonEmptyStringArray
- isNullishNonEmptyStringArray
- TNonEmptyStr

### `isSymbol` <a name="is-symbol"></a>
- isSymbol
- isOptionalSymbol
- isNullableSymbol
- isNullishSymbol
- isSymbolArray
- isOptionalSymbolArray
- isNullableSymbolArray
- isNullishSymbolArray

### `isDate` <a name="is-date"></a>
Is argument an instance of `Date` with a valid time value: `"!isNaN(arg.getTime())" => true`
- isDate
- isOptionalDate
- isNullableDate
- isNullishDate
- isDateArray
- isOptionalDateArray
- isNullableDateArray
- isNullishDateArray

### `isValidDate` <a name="is-valid-date"></a>
Is argument a valid date after wrapping with `new Date()` (could be `Date`, `string`, `number`)
- isValidDate
- isOptionalValidDate
- isNullableValidDate
- isNullishValidDate
- isValidDateArray
- isOptionalValidDateArray
- isNullableValidDateArray
- isNullishValidDateArray

### `isObject` <a name="is-object"></a>
- isObject
- isOptionalObject
- isNullableObject
- isNullishObject
- isObjectArray
- isOptionalObjectArray
- isNullableObjectArray
- isNullishObjectArray

### `isFunction` <a name="is-function"></a>
- isFunction
- isOptionalFunction
- isNullableFunction
- isNullishFunction
- isFunctionArray
- isOptionalFunctionArray
- isNullableFunctionArray
- isNullishFunctionArray
<br/><br/>


## Complex Validators <a name="complex-validators"></a>
These require an initialization step which will return a validator function.

### `isInArray` <a name="is-in-array"></a>
- isInArray
- isOptionalInArray
- isNullableInArray
- isNullishInArray

Does the argument strictly equal any item in the array:
```typescript
  const isInArrTest = isInArray(['1', '2', '3']);
  isInArrTest('1'); // => true
```

### `isInRange` <a name="is-in-range"></a>
- isInRange
- isOptionalInRange
- isNullableInRange
- isNullishInRange
- isInRangeArray
- isOptionalInRangeArray
- isNullableInRangeArray
- isNullishInRangeArray

Will check if the argument (can be a `number-string` or a `number`) is in the provided range. The function will check if the argument is *greater-than* the first param and *less-than* the second param. If you wish to include the min or max value in the range (i.e. *greater-than-or-equal-to*) wrap it in square brackets. If you wish to leave off a min or max pass an empty array `[]`. If you want to check if the number is not between two numbers, use the bigger number for the first param and the lesser number for the second:
```typescript
  // Between 0 and 100
  const isBetween0And100 = isInRange(0, 100);
  isBetween0And100(50); // false
  isBetween0And100('100'); // false
  isBetween0And100(0); // true

  // Is negative
  const isNegative = isInRange([], 0);
  isNegative(0); // false
  isNegative(-.0001); // true

  const isOptPositive = isOptionalInRange(0, []);
  isOptPositive(undefined); // true
  isOptPositive(1_000_000_000); // true

  // 0 to 100
  const isFrom0to100 = isInRange([0], [100]);
  isFrom0to100('50'); // true
  isFrom0to100(100); // true
  isFrom0to100(0); // true

  // less than 50 or greater than 100
  const lessThan50OrGreaterThan100 = isInRange(100, 50);
  lessThan50OrGreaterThan100(75); // false
  lessThan50OrGreaterThan100(101); // true
```

### `isKeyOf` <a name="is-key-of"></a>
- isKeyOf
- isOptionalKeyOf
- isNullableKeyOf
- isNullishKeyOf

Checks if the argument is a key of the object. Note that this will not work for symbols:
```typescript
  const someObject = {
    foo: 'bar',
    bada: 'bing',
  } as const;

  const isKeyOfSomeObject = isKeyOf(someObject);
  isKeyOfSomeObject('foo'); // true
```

### `isValueOf` <a name="is-value-of"></a>
- isValueOf
- isOptionalValueOf
- isNullableValueOf
- isNullishValueOf
- ValueOf: utility type, returns tuple of an object's keys

Checks if the argument is a value in the object.
```typescript
  const someObject = {
    foo: 'bar',
    bada: 'bing',
  } as const;

  const isValueOfSomeObject = isValueOf(someObject);
  isValueOfSomeObject('bar'); // true
  type keys = ValueOf<typeof someObject>; // 'bar' | 'bing'
```
<br/><br/>


## Utilities <a name="utilities"></a>
These complement the validator-functions and are useful if you need to modify a value before checking it or validate an object's schema. Utilities need to be imported using `/utils` at the end of the library name:
```typescript
import { parseObject } from 'jet-validators/utils';
```


### Simple Utilities <a name="simple-utilities"></a>

#### `nonNullable` <a name="non-nullable"></a>
Remove `null`/`undefined` from type-predicates and runtime validation:
```typescript
  const isString = nonNullable(isNullishString);
  isString(null); // false
  isString(undefined); // false
```

#### `Make Nullables` <a name="make-nullables"></a>
If you have a custom validator function and want to add `null` or `undefined` to the type predicated, you can use one of the make nullables modifiers:
- makeOptional
- makeNullable
- makeNullish
```ts
  import { makeNullish, isString } from 'jet-validators';

  type TEmail = `${string}@${string}`;

  // The custom validator-function
  const isEmail = (arg: unknown): arg is TEmail => {
    return isString(arg) && SomeEmailRegex.test(arg);
  };

  const isNullishEmail = makeNullish(isEmail);
  isNullishEmail('foo'); // arg => TEmail | null | undefined
```

#### `transform` <a name="transform"></a>
Accepts a transformation function for the first argument, a validator for the second, and returns a validator-function which calls the transform function before validating. The returned validator-function provides a callback as the second argument, if you need to access the transformed value. You should use `transform` if you need to modify a value when using `parseObject` or `testObject`:
```typescript
  const isNumArrWithParse = transform((arg: string) => JSON.parse(arg), isNumberArray);
  isNumArrWithParse('[1,2,3]', val => {
    isNumberArray(val); // true
  })); // true
```

#### `parseBoolean` <a name="parse-boolean"></a>
- parseBoolean
- parseOptionalBoolean
- parseNullableBoolean
- parseNullishBoolean

Converts the following values to a boolean. Note will also covert the string equivalents:
- `"true" or true`: `true` (case insensitive i.e. `"TrUe" => true`)
- `"false" or false`: `false` (case insensitive i.e. `"FaLsE" => false`)
- `"1" or 1`: `true`
- `"0" or 0`: `false`
```typescript
  parseBoolean('tRuE'); // true
  parseBoolean(1) // true
  parseBoolean('0') // false
```

#### `parseJson` <a name="parse-json"></a>
- parseJson
- parseOptionalJson
- parseNullableJson
- parseNullishJson

Calls the `JSON.parse` function, if the argument is not a string an error will be thrown:
```typescript
  const numberArr = parseJson<number[]>('[1,2,3]');
  isNumberArray(val); // true
```

### Validating object schemas <a name="validating-object-schemas"></a>
If you need to validate an object schema, you can pass a validator object with the key being a property of the object and the value being any of the validator-functions in this library OR you can write your own validator-function (see the <a href="#custom-validators">Custom Validators</a> section).<br>

> These functions aren't meant to replace full-fledged schema validation libraries (like zod, ajv, etc), they're just meant as simple object validating tools where using a separate schema validation library might be overkill.


#### `parseObject` <a name="parse-object"></a>
- `default` Extra properties will be purged but not raise errors.
- parseObject
- parseOptionalObject
- parseNullableObject
- parseNullishObject
- parseObjectArray
- parseOptionalObjectArray
- parseNullableObjectArray
- parseNullishObjectArray
- `loose` Extra properties will not be purged or raise errors.
- looseParseObject
- looseParseOptionalObject
- looseParseNullableObject
- looseParseNullishObject
- looseParseObjectArray
- looseParseOptionalObjectArray
- looseParseNullableObjectArray
- looseParseNullishObjectArray
- `strict` Extra properties will be purged and raise errors.
- strictParseObject
- strictParseOptionalObject
- strictParseNullableObject
- strictParseNullishObject
- strictParseObjectArray
- strictParseOptionalObjectArray
- strictParseNullableObjectArray
- strictParseNullishObjectArray

This function iterates an object (and any nested objects) and runs the validator-functions against each property. If every validator-function passed, the argument will be returned while purging any properties not in the schema. If it does not pass, then the function returns `false`. You can optionally pass an  error-handler function as the second argument which will fire whenever a validator-function fails.<br/>

The format for the `onError` callback function is as follows. If the validator-function throws an error, it will be passed to the `caughtErr` param (see below snippet):
> (errorArray: IParseObjectError[]) => void;

```ts
// The IParseObjectError
{
  info: string;
  prop?: string;
  value?: unknown;
  caught?: string;
  index?: number;
  children?: IParseObjectError[];
}
```

Example of using `parseObject` with a custom error callback:
```typescript
  import { parseObject, IParseObjectError } from 'jet-validators/utils';

  interface IUser {
    id: number;
    name: string;
    address: {
      city: string;
      zip: number;
    }
  }

  const parseUser = parseObject<'pass "IUser" here if you want to enforce schema props'>({
    id: transform(Number, isNumber),
    name: isString,
    address: {
      city: isString,
      zip: isNumber,
    }
  }, (errorArray: IParseObjectError[]) => {
    console.error(JSON.stringify(errorArray, null, 2));
  });

  const user: IUser = parseUser({
    id: '5',
    name: 'john',
    email: '--',
    address: {
      city: 'seattle',
      zip: 99999,
    }
  });

  // 'user' variable above:
  // {
  //   id: 5,
  //   name: 'john',
  //   address: {
  //    city: 'seattle',
  //    zip: 99999,
  //   }
  // }
```

- If you use the `parseObjectArray` the error callback handler will also pass the index of the object calling the error function:
```typescript
  const parseUserArrWithError = parseObjectArray({
    id: isNumber,
    name: isString,
  }, errors => {
    console.log(errors) // =>
    // [
    //   {
    //     info: 'Validator-function returned false.',
    //     prop: 'id',
    //     value: '3',
    //     index: 2
    //   }
    // ]
  });

  parseUserArrWithError([
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: '3', name: '3' },
  ]);
```


#### `testObject` <a name="test-object"></a>
- `default` Extra properties will be purged but not raise errors.
- testObject
- testOptionalObject
- testNullableObject
- testNullishObject
- testObjectArray
- testOptionalObjectArray
- testNullableObjectArray
- testNullishObjectArray
- `loose` Extra properties will not be purged or raise errors.
- looseTestObject
- looseTestOptionalObject
- looseTestNullableObject
- looseTestNullishObject
- looseTestObjectArray
- looseTestOptionalObjectArray
- looseTestNullableObjectArray
- looseTestNullishObjectArray,
- `strict` Extra properties will be purged and raise errors.
- strictTestObject
- strictTestOptionalObject
- strictTestNullableObject
- strictTestNullishObject
- strictTestObjectArray
- strictTestOptionalObjectArray
- strictTestNullableObjectArray
- strictTestNullishObjectArray

`testObject` is nearly identical to `parseObject` (it actually calls `parseObject` under-the-hood) but returns a type-predicate instead of the argument passed. Transformed values and purging non-schema keys will still happen as well:
```typescript
  const user: IUser = {
    id: '5',
    name: 'john',
    email: '--',
    address: {
      city: 'seattle',
      zip: 99999,
    }
  }
  
  const testUser = testObject(user);
  if (testUser(user)) { // user is IUser
    // 'user' variable above:
    // {
    //   id: 5,
    //   name: 'john',
    //   address: {
    //    city: 'seattle',
    //    zip: '99999',
    //   }
    // }
  }
```

#### Combining `parseObject` and `testObject` <a name="combining-test-parse"></a>
If you have nested objects on another parent object that you want to test or parse, you can add nested `testObject` functions to the parent one. Note that `parseObject` requires validator-functions in the schema (they must return a type-predicate), so you can only use `testObject` for nested schemas.

> <b>IMPORTANT:</b> Due to the limitations with Typescript, if you do not add a generic to a nested schema, all required properties must still be there for typesafety; however, typesafety will not protect the nested schema from extra properties (see below):  

```ts
import { parseObject, testObject } from 'jet-validators/utils';

interface IUser {
  id: number;
  name: string;
  address: {
    city: string;
    zip: number;
  }
}

const parseUser = parseObject<IUser>({
  id: isNumber,
  name: isString,
  address: {
    city: isString,
    zip: isNumber,
    // foo: isString, // Causes type error
  },
});

const parseUser1 = parseObject<IUser>({
  id: isNumber,
  name: isString,
  address: testObject({
    city: isString,
    zip: isNumber,
    foo: isString, // DOES NOT cause type error because of typescript limitations
  }),
});

const parseUser3 = parseObject<IUser>({
  id: isNumber,
  name: isString,
  address: testObject<IUser['address']>({
    city: isString,
    zip: isNumber,
    // foo: isString, // Causes type error
  }),
});
```

- If you want to use an external nested validator-function for whatever reason, make sure you pass down the `arg` param AND the `options`/`errorCb` params so that any nested parse functions can receive the options/errors from the parent.<br/>

In this example we needed to parse an address object. So we don't have to initialize the address schema twice we just wrap the `parseAddr` function and convert it to a test function (make it return a type-predicate): 
```ts
import { parseObject, testNullishObject, TParseOnError, IParseOptions } from 'jet-validators/utils';

interface IAddress {
  city: string;
  zip: number;
}

const parseAddr = parseNullishObject({
  city: isString,
  zip: isNumber,
});

function newAddress(arg: unknown): IAddress {
  return parseAddr(arg);
}

const parseUser = parseObject({
  id: isNumber,
  name: isString,
  address: (
    arg: unknown,
    optionsOrErrCb?: IParseOptions | TParseOnError,
    errorCb?: TParseOnError,
  ): arg is IAddress => !!parseAddr(arg, optionsOrErrCb, errorCb),
});
```


#### Custom Validators <a name="custom-validators"></a>
For `parseObject` and `testObject` you aren't restricted to the validator-functions in `jet-validators`. You can write your own validator-function, just make sure your argument is `unknown` and it returns a type predicate.
```typescript
  import { makeNullish, isString } from 'jet-validators';

  type TEmail = `${string}@${string}`;

  interface IUser {
    id: number;
    email: TEmail;
  }

  // The custom validator-function
  const isEmail = (arg: unknown): arg is TEmail => {
    return isString(arg) && SomeEmailRegex.test(arg);
  };

  const parseUser = parseObject({
    id: isNumber,
    name: isEmail,
  });

  const user: IUser = parseUser({
    id: 5,
    name: 'joe',
  });
```


#### Wrapping parseObject/testObject functions <a name="wrapping-parse-test"></a>
If you want to wrap the `parseObject` or `testObject` functions cause for whatever reason, you need to import the `TSchema` type and have your generic extend it:
```typescript
import { isNumber, isString } from 'jet-validators';
import { parseObject, TSchema } from 'jet-validators/utils';

interface IUser {
  id: number;
  name: string;
}

// Wrap without generic
const customParse = (schema: TSchema) => {
  return parseObject(schema, errors => throw new YourCustomErrorObject(errors))
}

// Wrap with generic
const customParse2 = <T>(schema: TSchema<T>) => {
  return parseObject<T>(schema, errors => throw new YourCustomErrorObject(errors))
}

const parseUser = customParse({
  id: isNumber,
  name: isString,
});

const user: IUser = parseUser('...whatever...');

const parseUser2 = customParse2<IUser>({
  id: isNumber,
  name: isString,
  // address: isString, // Will cause type error
});
```


#### Safety settings for parseObject <a name="parseObject-safety"></a>
For `parseObject/testObject` you can control what happens if extra properties are found in the argument object. This is done by important functions suffixed with `loose` or `strict`. The default `parseObject/testObject` functions are configured with the `default` safety setting:

- `loose`: Extra properties will not be purged or raise errors.
- `default`: Extra properties will be purged but not raise errors.
- `strict`: Extra properties will be purged and raise errors.


Example of the `options` argument. If you need to pass an error callback too pass it as the third argument. Note that the highest level passed `options` object will overwrite any nested one:
```ts
import { isNumber, isString } from 'jet-validators';
import { strictParseObject } from 'jet-validators/utils';

const testUser = strictParseObject({
  id: isString,
  name: isNumber,
}, errors => console.log(errors));

testUser({ id: 1, name: 'a', city: 'seattle' }); // This will raise errors
```

If you're using nested parse/test functions make sure you use the right function on the nested object if you want it to match the parent's safety level:
```ts
import { isNumber, isString } from 'jet-validators';
import { parseObject, strictParseObject } from 'jet-validators/utils';

const testUser = strictParseObject({
  id: isString,
  name: isNumber,
  address: { // Will still do 'strict' parsing
    city: isString,
    zip: isNumber,
  },
  country: parseObject({ // Will do 'default' parsing
    name: isString,
    code: isNumber
  }),
});

```
