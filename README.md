# jet-validators ✈️
> A list common typescript validator-functions and some useful utilities to go with them.
<br/>


## Table of Contents
- [Introduction](#introduction)
- [Basic Validators](#basic-validators)
- [Regular Expressions](#regular-expressions)
- [Complex Validators](#complex-validators)
- [Utilities](#utilities)
- [Custom Validators](#custom-validators)
<br/>


## Introduction <a name="introduction"></a>



## Basic Validators <a name="basic-validators"></a>
These can be imported and used directly and don't require any configuration.

- [Nullables](#nullables)
- [isBoolean](#isBoolean)
- [isValidBoolean](#isValidBoolean)
- [isNumber](#isNumber)
- [isBigInt](#isBigInt)
- [isValidNumber](#isValidNumber)
- [isString](#isString)
- [isNonEmptyString](#isNonEmptyString)
- [isSymbol](#isSymbol)
- [isDate](#isDate)
- [isValidDate](#isValidDate)
- [isObject](#isObject)
- [isRecord](#isRecord)
- [isFunction](#isFunction)

### Nullables <a name="nullables"></a>
- isUndef
- isNull
- isNullOrUndef

### `isBoolean` <a name="isBoolean"></a>
- isBoolean
- isOptionalBoolean
- isNullableBoolean
- isNullishBoolean
- isBooleanArray
- isOptionalBooleanArray
- isNullableBooleanArray
- isNullishBooleanArray

### `isValidBoolean` <a name="isValidBoolean"></a>
Is it a valid boolean after calling the `parseBoolean` utility function.
- isValidBoolean
- isOptionalValidBoolean
- isNullableValidBoolean
- isNullishValidBoolean
- isValidBooleanArray
- isOptionalValidBooleanArray
- isNullableValidBooleanArray
- isNullishValidBooleanArray

### `isNumber` <a name="isNumber"></a>
- isNumber
- isOptionalNumber
- isNullableNumber
- isNullishNumber
- isNumberArray
- isOptionalNumberArray
- isNullableNumberArray
- isNullishNumberArray

### `isBigInt` <a name="isBigInt"></a>
- isBigInt
- isOptionalBigInt
- isNullableBigInt
- isNullishBigInt
- isBigIntArray
- isOptionalBigIntArray
- isNullableBigIntArray
- isNullishBigIntArr

### `isValidNumber` <a name="isValidNumber"></a>
- isValidNumber
- isOptionalValidNumber
- isNullableValidNumber
- isNullishValidNumber
- isValidNumberArray
- isOptionalValidNumberArray
- isNullableValidNumberArray
- isNishValidNumArr

### `isString` <a name="isString"></a>
- isString
- isOptionalString
- isNullableString
- isNullishString
- isStringArray
- isOptionalStringArray
- isNullableStringArray
- isNullishStringArray

### `isNonEmptyString` <a name="isNonEmptyString"></a>
- isNonEmptyString
- isOptionalNonEmptyString
- isNullableNonEmptyString
- isNullishNonEmptyString
- isNonEmptyStringArray
- isOptionalNonEmptyStringArray
- isNullableNonEmptyStringArray
- isNullishNonEmptyStringArray
- TNonEmptyStr

### `isSymbol` <a name="isSymbol"></a>
- isSymbol
- isOptionalSymbol
- isNullableSymbol
- isNullishSymbol
- isSymbolArray
- isOptionalSymbolArray
- isNullableSymbolArray
- isNullishSymbolArray

### `isDate` <a name="isDate"></a>
- isDate
- isOptionalDate
- isNullableDate
- isNullishDate
- isDateArray
- isOptionalDateArray
- isNullableDateArray
- isNullishDateArray

### `isValidDate` <a name="isValidDate"></a>
Is it a valid date after wrapping with `new Date()`
- isValidDate
- isOptionalValidDate
- isNullableValidDate
- isNullishValidDate
- isValidDateArray
- isOptionalValidDateArray
- isNullableValidDateArray
- isNullishValidDateArray

### `isObject` <a name="isObject"></a>
- isObject
- isOptionalObject
- isNullableObject
- isNullishObject
- isObjectArray
- isOptionalObjectArray
- isNullableObjectArray
- isNullishObjectArray

### `isRecord` <a name="isRecord"></a>
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

### `isFunction` <a name="isFunction"></a>
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
- [Overloading using environment variables](#overloading)
- [isColor](#isColor)
- [isEmail](#isEmail)
- [isUrl](#isUrl)
- [isAlphaNumericString](#isAlphaNumericString)


### Overloading using environment variables <a name="overloading"></a>
The regular expressions for each function below can be overwritten using the environment variables. To overload an regular expression create an environment variables with the format:<br/>
- JET_VALIDATORS_REGEX_{name of the function in uppercase}` i.e. `JET_VALIDATORS_REGEX_EMAIL`

### `isColor` <a name="isColor"></a>
- isColor
- isOptionalColor
- isNullableColor
- isNullishColor
- TColor (type)

### `isEmail` <a name="isEmail"></a>
- isEmail
- isOptionalEmail
- isNullableEmail
- isNullishEmail
- TEmail (type)

### `isUrl` <a name="isUrl"></a>
- isUrl
- isOptionalUrl
- isNullableUrl
- isNullishUrl
- TURL (type)

### `isAlphaNumericString` <a name="isAlphaNumericString"></a>
- isAlphaNumericString
- isOptionalAlphaNumericString
- isNullableAlphaNumericString
- isNullishAlphaNumericString
- TAlphabeticStr (type)

### `isAlphabeticString` <a name="isAlphabeticString"></a>
- isAlphabeticString
- isOptionalAlphabeticString
- isNullableAlphabeticString
- isNullishAlphabeticString
- TAlphaNumericStr (type)
<br/><br/>


## Complex Validators <a name="complex-validators"></a>
These require an initialization step which will return a validator function.
- [isInArray](#isInArray)
- [isInRange](#isInRange)
- [isKeyOf](#isKeyOf)
- [isEnum](#isEnum)
- [isEnumVal](#isEnumVal)

### `isInArray` <a name="isInArray"></a>
Does the argument strictly equal any item in the array:
```typescript
  const isInArrTest = isInArray(['1', '2', '3']);
  isInArrTest('1'); // => true
```
- isInArray
- isOptionalInArray
- isNullableInArray
- isNullishInArray

### `isInRange` <a name="isInRange"></a>
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
- isInRange
- isOptionalInRange
- isNullableInRange
- isNullishInRange
- isInRangeArray
- isOptionalInRangeArray
- isNullableInRangeArray
- isNullishInRangeArray

### `isKeyOf` <a name="isKeyOf"></a>
Checks if the argument is a key of the object. Note that this will not work for symbols.
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
- isKeyOf
- isOptionalKeyOf
- isNullableKeyOf
- isNullishKeyOf
- isKeyOfArray
- isOptionalKeyOfArray
- isNullableKeyOfArray
- isNullishKeyOfArray

### `isEnum` <a name="isEnum"></a>
Check if the argument is a valid enum object. Unlike other complex validators this does not require an inialization step. Note this will not work for mixed enum types: see: `eslint@typescript-eslint/no-mixed-enums`.
```typescript
  enum StringEnum {
    Foo = 'foo',
    Bar = 'bar',
  }
  isEnum(StringEnum) // true
```
- isEnum
- isOptionalEnum
- isNullableEnum
- isNullishEnum
- TEnum (type)


### `isEnumVal` <a name="isEnumVal"></a>
Check if the argument is a value of the enum. You must initialize this with a valid non-mixed enum type: see: `eslint@typescript-eslint/no-mixed-enums`. 
```typescript
  enum NumberEnum {
    Foo,
    Bar,
  }
  const isNumberEnumVal = isEnumVal(NumberEnum);

```
- isEnumVal
- isOptionalEnumVal
- isNullableEnumVal
- isNullishEnumVal
<br/><br/>


## Utilities <a name="utilities"></a>
These complement the validator functions and are useful if you need to modify a value before checking it or validate an object's schema. 
- [Simple Utilities](#simple-utilities)
  - [nonNullable](#nonNullable)
  - [iterateObjectEntries](#iterateObjectEntries)
  - [transform](#transform)
  - [parseBoolean](#parseBoolean)
  - [safeJsonParse](#safeJsonParse)
- [Validating object schemas](#validating-object-schemas)
  - [parseObject](#parseObject)
  - [testObject](#testObject)
  - [traverseObject](#traverseObject)


### Simple Utilities <a name="simple-utilities"></a>

#### `nonNullable` <a name="nonNullable"></a>
Remove `null`/`undefined` from type-predicates:
```typescript
  const isString = nonNullable(isNullishString);
  isString(null); // false
  isString(undefined); // false
```

#### `iterateObjectEntries` <a name="iterateObjectEntries"></a>
Loop through and object's key/value pairs and fire a callback for each one. If any callback returns `false`, the whole function will return `false`. It will also caste the object to generic if passed one:
```typescript
  const isStrNumObj = iterateObjectEntries<Record<string, number>>((key, val) => 
    isString(key) && isNumber(val));
  isStrNumObj({ a: 1, b: 2, c: 3 }); // true
  isStrNumObj({ a: 1, b: 2, c: 'asdf' }); // false
```

#### `transform` <a name="transform"></a>
Accepts a transforming function for the first argument, a validator for the second, and returns a validator function which calls the transform function before validating. The returned validator-function provides a callback as the second argument if you need to access the transformed value. You should use transform if you need to modify a value when using `parseObject` or `testObject`.
```typescript
  const isNumArrWithParse = transform((arg: string) => JSON.parse(arg), isNumberArray);
  isNumArrWithParse('[1,2,3]', val => {
    isNumberArray(val); // true
  }));
```

#### `parseBoolean` <a name="parseBoolean"></a>
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

#### `safeJsonParse` <a name="safeJsonParse"></a>
Calls the `JSON.parse` function. If the argument is not a string an error will be thrown:
```typescript
  const numberArr = safeJsonParse<number[]>('[1,2,3]');
  isNumberArray(val); // true
```


### Validating object schemas <a name="validating-object-schemas"></a>
If you need to validate an object schema, you can pass a validator object with the key being an object property and the value being the any of the validator-functions in this library OR you can write your own validator-function (see the <a name="custom-validators">Custom Validators</a> section).<br>

These functions aren't meant to replace full-fledged schema validation libraries (like zod, ajv, etc), they're just meant as a simple object validating tool where using a separate schema validation library might be overkill. If you need some more powerful, I highly recommend `jet-validators` sister library <a href="https://github.com/seanpmaxwell/jet-schema">jet-schema</a> which allows you to do a lot more like force schema properties using predefined types. 


#### `parseObject`
This function iterates an object (and any nested object) and runs the validator-functions against each property. If every validator-function passed, the argument will be returned while purging any properties not in the schema. If it does not pass, then the function returns `undefined`. You can optionally pass a second error handler argument which will fire whenever a validator function fails. If the validator-function throws an error, it will be passed to the `caughtErr` param (see below snippet).
```typescript
  interface IUser {
    id: number;
    name: string;
    address: {
      city: string;
      zip: number;
    }
  }

  const parseUser = parseObject({
    id: transform(Number, isNumber),
    name: isString,
    address: {
      city: isString,
      zip: isNumber,
    }
  }, (property: string, value: unknown, caughtErr?: unknown) => {
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

##### `parseObjectArray`
If you use the `parseObjectArray` the error callback handler will also pass the index of the object calling the error function:
```typescript
  const parseUserArrWithError = parseObjectArray({
    id: isNumber,
    name: isString,
  }, (prop, value, index) => {
    // index "2" should call the error function. 
  });

  parseUserArrWithError([
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: '3', name: '3' },
  ]);
```

- parseObject
- parseOptionalObject
- parseNullableObject
- parseNullishObject
- parseObjectArray
- parseOptionalObjectArray
- parseNullableObjectArray
- parseNullishObjectArray


#### `testObject`
Test object is nearly identical to `parseObject` (it actually calls `parseObject` under-the-hood) but returns a type-predicate instead of the argument passed. Transformed values and purging non-schema keys will still happen: 
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

- testObject
- testOptionalObject
- testNullableObject
- testNullishObject
- testObjectArray
- testOptionalObjectArray
- testNullableObjectArray
- testNullishObjectArray


#### `traverseObject`
// pick up here

```typescript
  const convertValidToDateObjects = traverseObject((key, value, parentObj) => {
    if (isValidDate(value)) {
      parentObj[key] = new Date(value);
    } else {
      parentObj[key] = 'Invalid Date';
    }
  });

  const result = convertValidToDateObjects({
    today: '2024-12-06T23:43:37.012Z',
    lastYear: '2023-12-06T22:14:20.012Z',
    nested: {
      milli: 1733528684737,
      invalid: '2024-12-06TVB23:43:37.012Z',
    },
  });

  // 'result' variable above:
  // {
  //   today: new Date('2024-12-06T23:43:37.012Z'),
  //   lastYear: new Date('2023-12-06T22:14:20.012Z'),
  //   nested: {
  //     milli: new Date(1733528684737),
  //     invalid: 'Invalid Date',
  //   },
  // }
```

- traverseObject
- traverseOptionalObject
- traverseNullableObject
- traverseNullishObject
- traverseObjectArray
- traverseOptionalObjectArray
- traverseNullableObjectArray
- traverseNullishObjectArray
