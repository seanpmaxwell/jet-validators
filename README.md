# jet-validators ✈️
> A list common typescript validator-functions and some useful utilities to go with them.
<br/>


## Table of Contents
- [Introduction](#introduction)
- [Basic Validators](#basic-validators)
- [Regular Expressions](#regular-expressions)
<br/>


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

### `isColor` 
- isColor
- isOptionalColor
- isNullableColor
- isNullishColor
- TColor (type)

### `isEmail`
- isEmail
- isOptionalEmail
- isNullableEmail
- isNullishEmail
- TEmail (type)

### `isUrl`
- isUrl
- isOptionalUrl
- isNullableUrl
- isNullishUrl
- TURL (type)

### `isAlphaNumericString`
- isAlphaNumericString
- isOptionalAlphaNumericString
- isNullableAlphaNumericString
- isNullishAlphaNumericString
- TAlphabeticStr (type)

### `isAlphabeticString`
- isAlphabeticString
- isOptionalAlphabeticString
- isNullableAlphabeticString
- isNullishAlphabeticString
- TAlphaNumericStr (type)
<br/><br/>


## Complex Validators
These require an initialization step which will return a validator function.
- isInArray
- isInRange
- isKeyOf
- isEnum
- isEnumVal

### `isInArray`
Does the argument strictly equal any item in the array:
```typescript
  const isInArrTest = isInArray(['1', '2', '3']);
  isInArrTest('1'); // => true
```
- isInArray
- isOptionalInArray
- isNullableInArray
- isNullishInArray

### `isInRange`
Will check if the argument (can be a `number-string` or a `number`) is in the provided range. The function will check if the argument is *greater-than* the first param and *less-than* the second param. If you wish to include the min or max value in the range (i.e. *greater-than-or-equal-to*) wrap it in square brackets. If you wish to leave off a min or max pass an empty array `[]`:
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
```
- isInRange
- isOptionalInRange
- isNullableInRange
- isNullishInRange
- isInRangeArray
- isOptionalInRangeArray
- isNullableInRangeArray
- isNullishInRangeArray

### `isKeyOf`
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

### `isEnum`
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


### `isEnumVal`
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


## Utilities
These complement the validator functions and are useful if you need to modify a value before checking it or validate an object's schema. 
- Simple Utilities
  - nonNullable
  - iterateObjEntries
  - transform
  - parseBoolean
  - safeJsonParse
- parseObject
- testObject
- traverseObject