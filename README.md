# jet-validators ✈️
> A list common typescript validator-functions and some useful utilities to go with them.


## Basic Validators

### Nullables
- `isUndef`
- `isNull`
- `isNullOrUndef`

### isBoolean
- `isBoolean`
- `isOptionalBoolean`
- `isNullableBoolean`
- `isNullishBoolean`
- `isBooleanArray`
- `isOptionalBooleanArray`
- `isNullableBooleanArray`
- `isNullishBooleanArray`

### isValidBoolean
Is it a valid boolean after calling the `parseBoolean` utility function.
- `isValidBoolean`
- `isOptionalValidBoolean`
- `isNullableValidBoolean`
- `isNullishValidBoolean`
- `isValidBooleanArray`
- `isOptionalValidBooleanArray`
- `isNullableValidBooleanArray`
- `isNullishValidBooleanArray`

### isNumber
- `isNumber`
- `isOptionalNumber`
- `isNullableNumber`
- `isNullishNumber`
- `isNumberArray`
- `isOptionalNumberArray`
- `isNullableNumberArray`
- `isNullishNumberArray`

### isBigInt
- `isBigInt`
- `isOptionalBigInt`
- `isNullableBigInt`
- `isNullishBigInt`
- `isBigIntArray`
- `isOptionalBigIntArray`
- `isNullableBigIntArray`
- `isNullishBigIntArr`

### isValidNumber
- `isValidNumber`
- `isOptionalValidNumber`
- `isNullableValidNumber`
- `isNullishValidNumber`
- `isValidNumberArray`
- `isOptionalValidNumberArray`
- `isNullableValidNumberArray`
- `isNishValidNumArr`

### isString
- `isString`
- `isOptionalString`
- `isNullableString`
- `isNullishString`
- `isStringArray`
- `isOptionalStringArray`
- `isNullableStringArray`
- `isNullishStringArray`

### isNonEmptyString
- `isNonEmptyString`
- `isOptionalNonEmptyString`
- `isNullableNonEmptyString`
- `isNullishNonEmptyString`
- `isNonEmptyStringArray`
- `isOptionalNonEmptyStringArray`
- `isNullableNonEmptyStringArray`
- `isNullishNonEmptyStringArray`

### isSymbol
- `isSymbol`
- `isOptionalSymbol`
- `isNullableSymbol`
- `isNullishSymbol`
- `isSymbolArray`
- `isOptionalSymbolArray`
- `isNullableSymbolArray`
- `isNullishSymbolArray`

### isDate
- `isDate`
- `isOptionalDate`
- `isNullableDate`
- `isNullishDate`
- `isDateArray`
- `isOptionalDateArray`
- `isNullableDateArray`
- `isNullishDateArray`

### isValidDate
Is it a valid date after wrapping with `new Date()`
- `isValidDate`
- `isOptionalValidDate`
- `isNullableValidDate`
- `isNullishValidDate`
- `isValidDateArray`
- `isOptionalValidDateArray`
- `isNullableValidDateArray`
- `isNullishValidDateArray`

### isObject
- `isObject`
- `isOptionalObject`
- `isNullableObject`
- `isNullishObject`
- `isObjectArray`
- `isOptionalObjectArray`
- `isNullableObjectArray`
- `isNullishObjectArray`

### isRecord
- `isRecord`
- `isOptionalRecord`
- `isNullableRecord`
- `isNullishRecord`
- `isRecordArray`
- `isOptionalRecordArray`
- `isNullableRecordArray`
- `isNullishRecordArray`

### isFunction
- `isFunction`
- `isOptionalFunction`
- `isNullableFunction`
- `isNullishFunction`
- `isFunctionArray`
- `isOptionalFunctionArray`
- `isNullableFunctionArray`
- `isNullishFunctionArray`

### Types
- `TNonEmptyStr`
- `TRecord`
<br/><br/>


## Regular Expressions
The regular expressions for each function below can be overwritten using the environment variables. To overload an regular expression` create an environment variables with the format: <br/>
- `JET_VALIDATORS_REGEX_{name of the function in uppercase}` i.e. `JET_VALIDATORS_REGEX_EMAIL`


### isColor
- `isColor`
- `isOptionalColor`
- `isNullableColor`
- `isNullishColor`

### isEmail
- `isEmail`
- `isOptionalEmail`
- `isNullableEmail`
- `isNullishEmail`

### isUrl
- `isUrl`
- `isOptionalUrl`
- `isNullableUrl`
- `isNullishUrl`

### isAlphaNumericString
- `isAlphaNumericString`
- `isOptionalAlphaNumericString`
- `isNullableAlphaNumericString`
- `isNullishAlphaNumericString`

### isAlphabeticString
- `isAlphabeticString`
- `isOptionalAlphabeticString`
- `isNullableAlphabeticString`
- `isNullishAlphabeticString`

### Types
- `TEmail`
- `TColor`
- `TURL`
- `TAlphaNumericStr`
- `TAlphabeticStr`


## Complex Validators
These require an initialization step which will return a validator function.

- isInArray
- isInRange
- isKeyOf
- isEnum
- isEnumVal

### isInArray
Does the argument strictly equal any item in the array:
```typescript
  const isInArrTest = isInArray(['1', '2', '3']);
  isInArrTest('1'); // => true
```
- `isInArray`
- `isOptionalInArray`
- `isNullableInArray`
- `isNullishInArray`

### isInRange
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
 
- `isInRange`
- `isOptionalInRange`
- `isNullableInRange`
- `isNullishInRange`
- `isInRangeArray`
- `isOptionalInRangeArray`
- `isNullableInRangeArray`
- `isNullishInRangeArray`

### isKeyOf
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

- `isKeyOf`
- `isOptionalKeyOf`
- `isNullableKeyOf`
- `isNullishKeyOf`
- `isKeyOfArray`
- `isOptionalKeyOfArray`
- `isNullableKeyOfArray`
- `isNullishKeyOfArray`

### isEnum
Check if the argument is a valid enum object. Unlike other complex validators this does not require an inialization step. Note this will not work for mixed enum types: see: `eslint@typescript-eslint/no-mixed-enums`.
```typescript
  enum StringEnum {
    Foo = 'foo',
    Bar = 'bar',
  }
  isEnum(StringEnum) // true
```

- `isEnum`
- `isOptionalEnum`
- `isNullableEnum`
- `isNullishEnum`
- `TEnum` (type)


### isEnumVal
Check if the argument is a value of the enum. You must initialize this with a valid non-mixed enum type: see: `eslint@typescript-eslint/no-mixed-enums`. 
```typescript
  enum NumberEnum {
    Foo,
    Bar,
  }
  const isNumberEnumVal = isEnumVal(NumberEnum);

```

- `isEnumVal`
- `isOptionalEnumVal`
- `isNullableEnumVal`
- `isNullishEnumVal`
