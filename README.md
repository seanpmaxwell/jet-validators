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
  - [isBigInt](#is-bigint)
  - [isValidNumber](#is-valid-number)
  - [isString](#is-string)
  - [isNonEmptyString](#is-non-empty-string)
  - [isSymbol](#is-symbol)
  - [isDate](#is-date)
  - [isValidDate](#is-valid-date)
  - [isObject](#is-object)
  - [isRecord](#is-record)
  - [isFunction](#is-function)
- [Regular Expressions](#regular-expressions)
  - [Overloading with environment variables](#overloading)
  - [isColor](#is-color)
  - [isEmail](#is-email)
  - [isUrl](#is-url)
  - [isAlphaNumericString](#is-alpha-numeric-string)
  - [isAlphabeticString](#is-alphabetic-string)
- [Complex Validators](#complex-validators)
  - [isInArray](#is-in-array)
  - [isInRange](#is-in-range)
  - [isKeyOf](#is-key-of)
  - [isEnum](#is-enum)
  - [isEnumVal](#is-enum-val)
- [Utilities](#utilities)
  - [Simple Utilities](#simple-utilities)
    - [nonNullable](#non-nullable)
    - [iterateObjectEntries](#iterate-object-entries)
    - [transform](#transform)
    - [parseBoolean](#parse-boolean)
    - [parseJson](#parse-json)
  - [Validating object schemas](#validating-object-schemas)
    - [parseObject](#parse-object)
    - [testObject](#test-object)
    - [Custom Validators](#custom-validators)
    - [Wrapping Parse/Test](#wrapping-parse-test)
  - [deepCompare and customDeepCompare](#deepCompare-fns)
    - [deepCompare](#deepCompare)
    - [customDeepCompare](#customDeepCompare)
<br/>


## Introduction <a name="introduction"></a>
A simple, but long, list of validator-functions commonly used when checking values in TypeScript. This is not meant to replace advanced schema validation libraries like `zod`, `valibot`, `jet-schema` etc. This is just a list of pre-defined validator-functions to save you time and boilerplate code in TypeScript.

### Quick Glance
```typescript
import { isOptionalString, isRecord } from 'jet-validators';

if (isOptionalString(val)) {
  // val is string | undefined
}

if (isRecord(val)) {
  val['foo'] = 'bar';
}
```

### Why jet-validators
- Contains validator-functions for the vast majority of real world scenarios you will encounter.
- For basic validators, there's no initialization step, you just import the validator-function and start using it.
- Overload regular expressions using environment variables.
- Contains some useful utilities for modifying values before validation.
- Also has some utilities for simple object schema validation. 
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

### `isRecord` <a name="is-record"></a>
Checks if the argument is a non-null non-array object. Type predicate is `Record<string, unknown>`.
- isRecord
- isOptionalRecord
- isNullableRecord
- isNullishRecord
- isRecordArray
- isOptionalRecordArray
- isNullableRecordArray
- isNullishRecordArray
- TRecord (type)

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


## Regular Expressions <a name="regular-expressions"></a>
Verifies the argument matches the regular-expression. Note than an empty string will validate to `true` for each function.

### Overloading with environment variables <a name="overloading"></a>
The regular expressions for each function below can be overwritten using the environment variables. To overload a regular expression create an environment variables with the format:<br/>
- JET_VALIDATORS_REGEX_{name of the function in uppercase} (i.e. `JET_VALIDATORS_REGEX_EMAIL=^\S+@\S+\.\S+$`)

### `isColor` <a name="is-color"></a>
- isColor
- isOptionalColor
- isNullableColor
- isNullishColor
- TColor (type)

### `isEmail` <a name="is-email"></a>
- isEmail
- isOptionalEmail
- isNullableEmail
- isNullishEmail
- TEmail (type)

### `isUrl` <a name="is-url"></a>
- isUrl
- isOptionalUrl
- isNullableUrl
- isNullishUrl
- TURL (type)

### `isAlphaNumericString` <a name="is-alpha-numeric-string"></a>
- isAlphaNumericString
- isOptionalAlphaNumericString
- isNullableAlphaNumericString
- isNullishAlphaNumericString
- TAlphabeticStr (type)

### `isAlphabeticString` <a name="is-alphabetic-string"></a>
- isAlphabeticString
- isOptionalAlphabeticString
- isNullableAlphabeticString
- isNullishAlphabeticString
- TAlphaNumericStr (type)
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
- isKeyOfArray
- isOptionalKeyOfArray
- isNullableKeyOfArray
- isNullishKeyOfArray

Checks if the argument is a key of the object. Note that this will not work for symbols:
```typescript
  const someObject = {
    foo: 'bar',
    bada: 'bing',
  } as const;

  const isKeyofSomeObject = isKeyOf(someObject);
  isKeyofSomeObject('foo'); // true

  const isKeyofSomeObjectArr = isNullableKeyOfArray(someObject);
  isKeyofSomeObjectArr(['bada', 'foo']); // true
```

### `isEnum` <a name="is-enum"></a>
- isEnum
- isOptionalEnum
- isNullableEnum
- isNullishEnum
- TEnum (type)

Check if the argument is a valid enum object. Unlike other complex validators, this does not require an inialization step. Note this will not work for mixed enum types: see: `eslint@typescript-eslint/no-mixed-enums`:
```typescript
  enum StringEnum {
    Foo = 'foo',
    Bar = 'bar',
  }
  isEnum(StringEnum) // true
```

### `isEnumVal` <a name="is-enum-val"></a>
- isEnumVal
- isOptionalEnumVal
- isNullableEnumVal
- isNullishEnumVal

Check if the argument is a value of the enum. You must initialize this with a valid non-mixed enum type: see: `eslint@typescript-eslint/no-mixed-enums`:
```typescript
  enum NumberEnum {
    Foo,
    Bar,
  }
  const isNumberEnumVal = isEnumVal(NumberEnum);
  isNumberEnumVal(NumberEnum.Foo); // true
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
- parseObject
- parseOptionalObject
- parseNullableObject
- parseNullishObject
- parseObjectArray
- parseOptionalObjectArray
- parseNullableObjectArray
- parseNullishObjectArray

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
    throw Error(`Property "${property}" failed to pass validation.`)
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

- If you want to use an external nested validator-function for whatever reason, make sure you pass down the `arg` param AND the `errorCb` so that any nested errors will be added to the error tree:
```ts
import { TParseOnError } from 'jet-validators/utils';

const parseUser = parseObject({
  id: isNumber,
  name: isString,
  address: (arg: unknown, errorCb?: TParseOnError) => testAddr(arg, errCb),
}, errors => { errArr = errors; });

const testAddr = testNullishObject({
  city: isString,
  zip: isNumber,
});
```


#### `testObject` <a name="test-object"></a>
- testObject
- testOptionalObject
- testNullableObject
- testNullishObject
- testObjectArray
- testOptionalObjectArray
- testNullableObjectArray
- testNullishObjectArray

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


#### Custom Validators <a name="custom-validators"></a>
For `parseObject` and `testObject` you aren't restricted to the validator-functions in `jet-validators`. You can write your own validator-function, just make sure your argument is `unknown` and it returns a type predicate:
```typescript
  type TRelationalKey = number;

  interface IUser {
    id: TRelationalKey;
    name: string;
  }

  // The custom validator-function
  const isRelationalKey = (arg: unknown): arg is TRelationalKey => {
    return isNumber(arg) && arg >= -1;
  }

  const parseUser = parseObject({
    id: isRelationalKey,
    name: isString,
  });

  const user: IUser = parseUser({
    id: 5,
    name: 'joe',
  });
```


#### Wrapping parseObject/testObject functions <a name="wrapping-parse-test"></a>
If you want to wrap the `parseObject` or `testObject` functions cause you want to let's say, apply the same error handler to multiple object-validators, you need to import the `TSchema` type and have your generic extend it:
```typescript
import { isNumber, isString } from 'jet-validators';
import { parseObject, TSchema } from 'jet-validators/utils';

const customParse = <U extends TSchema>(schema: U) => {
  return parseObject(schema, errors => throw new YourCustomErrorObject(errors))
}

const parseUser = customParse({ id: isNumber, name: isString });
parseUser({ id: 5, name: 'joe' }); // => { id: 5, name: 'joe' }
```


### deepCompare and customDeepCompare <a name="deepCompare-fns"></a>

#### `deepCompare` <a name="deepCompare"></a>
Performs a deep comparison of two objects. I know there's a ton of object comparison options out there (i.e. `lodash.isEqual`) but this along with `customDeepCompare` is a little more versatile. If two values are both instances of `Date` then their epoch (`.getTime()`) will be used for comparison. This can be overriden with the `customDeepCompare` function.

#### `customDeepCompare` <a name="customDeepCompare"></a>
If you wish to access the values everytime a comparison fails or modify the behavior of the `deepCompare` function, you can use the `customDeepCompare` which receives a callback function and/or an options object. The value returned will be a custom `deepCompare` function with the parameters saved.

> `customDeepCompare("callback or options")` or `customDeepCompare("options", "callback")`

##### The `options` object
```typescript
disregardDateException?: boolean;
onlyCompareProps?: string | string[];
convertToDateProps?: string | string[] | { rec: boolean, props: string | string [] };
```

- `disregardDateException`: By default, date objects are compared using the epoch time value from `.getTime()` not the key value pairs on the object itself. If you wish to disregard this, set `disregardDateException: true`.
- `onlyCompareProps`: If you want to compare some properties in two objects and not the full object, you can pass a string or an array of strings and only those keys will be used in the comparison. Note that this will not affect arrays, so that if you compare an array of objects the options will be passed down to those objects. This option is not recursive so will not affect any nested objects.
- `convertToDateProps`: If you want a property or properties to be converted to a date object before comparison, you can pass a string or an array of strings and those properties with be converted to `Date` objects. By default this option IS recursive. If you wish to make it not recursive you can pass an object instead of an array or string array with `rec: false`. I find this option especially helpful if work a lot with IO objects were `Dates` often get stringified. 

```typescript
import { deepCompare, customDeepCompare } from 'jet-validators/util';

const deepCompareAlt = customDeepCompare({
  convertToDateProps: 'created',
  onlyCompareProps: ['id', 'created'],
});

const date1 = new Date('2012-6-17'),
  user1 = { id: 1, created: date1 },
  user2 = { id: 1, created: date1.getTime() },
  user3 = { id: 1, name: 'joe', created: date1 },

deepCompare(user1, user2); // => false
deepCompare(user1, user3); // => false
deepCompareAlt(user1, user2); // => true
deepCompareAlt(user1, user3); // => true
```

##### The `callback` function
```typescript
(key: string, val1: unknown, val2: unknown) => void;
```

- The callback function provides the values that failed during the comparison will fire everytime a comparison fails:
```typescript
import { customDeepCompare } from 'jet-validators/util';

const deepCompare = customDeepCompare((key, val1, val2) => console.log(key, val1, val2));

// This will return false and print out "id,1,2" and "name,joe,jane" 
deepCompare({ id: 1, name: 'joe' }, { id: 2, name: 'jane' }); // => false
```
