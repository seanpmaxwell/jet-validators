# jet-validators ✈️
> A list common typescript validator-functions and some useful utilities to go with them.


## Basic Validators

### Nullables
- `isUndef`
- `isNull`
- `isNullOrUndef`

### Boolean
- `isBoolean`
- `isOptionalBoolean`
- `isNullableBoolean`
- `isNullishBoolean`
- `isBooleanArray`
- `isOptionalBooleanArray`
- `isNullableBooleanArray`
- `isNullishBooleanArray`

### Valid Boolean
Is it a valid boolean after calling the `parseBoolean` utility function.
- `isValidBoolean`
- `isOptionalValidBoolean`
- `isNullableValidBoolean`
- `isNullishValidBoolean`
- `isValidBooleanArray`
- `isOptionalValidBooleanArray`
- `isNullableValidBooleanArray`
- `isNullishValidBooleanArray`

### Number
- `isNumber`
- `isOptionalNumber`
- `isNullableNumber`
- `isNullishNumber`
- `isNumberArray`
- `isOptionalNumberArray`
- `isNullableNumberArray`
- `isNullishNumberArray`

### BigInt
- `isBigInt`
- `isOptionalBigInt`
- `isNullableBigInt`
- `isNullishBigInt`
- `isBigIntArray`
- `isOptionalBigIntArray`
- `isNullableBigIntArray`
- `isNullishBigIntArr`

### Valid number
- `isValidNumber`
- `isOptionalValidNumber`
- `isNullableValidNumber`
- `isNullishValidNumber`
- `isValidNumberArray`
- `isOptionalValidNumberArray`
- `isNullableValidNumberArray`
- `isNishValidNumArr`

### String
- `isString`
- `isOptionalString`
- `isNullableString`
- `isNullishString`
- `isStringArray`
- `isOptionalStringArray`
- `isNullableStringArray`
- `isNullishStringArray`

### Non-Empty String
- `isNonEmptyString`
- `isOptionalNonEmptyString`
- `isNullableNonEmptyString`
- `isNullishNonEmptyString`
- `isNonEmptyStringArray`
- `isOptionalNonEmptyStringArray`
- `isNullableNonEmptyStringArray`
- `isNullishNonEmptyStringArray`

### Symbol
- `isSymbol`
- `isOptionalSymbol`
- `isNullableSymbol`
- `isNullishSymbol`
- `isSymbolArray`
- `isOptionalSymbolArray`
- `isNullableSymbolArray`
- `isNullishSymbolArray`

### Date
- `isDate`
- `isOptionalDate`
- `isNullableDate`
- `isNullishDate`
- `isDateArray`
- `isOptionalDateArray`
- `isNullableDateArray`
- `isNullishDateArray`

### Valid Date
Is it a valid date after wrapping with `new Date()`
- `isValidDate`
- `isOptionalValidDate`
- `isNullableValidDate`
- `isNullishValidDate`
- `isValidDateArray`
- `isOptionalValidDateArray`
- `isNullableValidDateArray`
- `isNullishValidDateArray`

### Object
- `isObject`
- `isOptionalObject`
- `isNullableObject`
- `isNullishObject`
- `isObjectArray`
- `isOptionalObjectArray`
- `isNullableObjectArray`
- `isNullishObjectArray`

### Record
- `isRecord`
- `isOptionalRecord`
- `isNullableRecord`
- `isNullishRecord`
- `isRecordArray`
- `isOptionalRecordArray`
- `isNullableRecordArray`
- `isNullishRecordArray`

### Function
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


### Color
- `isColor`
- `isOptionalColor`
- `isNullableColor`
- `isNullishColor`

### Email
- `isEmail`
- `isOptionalEmail`
- `isNullableEmail`
- `isNullishEmail`

### URL
- `isUrl`
- `isOptionalUrl`
- `isNullableUrl`
- `isNullishUrl`

### Alpha-Numeric String
- `isAlphaNumericString`
- `isOptionalAlphaNumericString`
- `isNullableAlphaNumericString`
- `isNullishAlphaNumericString`

### Alphabetic String
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
These require and initialization step which will return a validator function.

### Is in array
Does the argument `===` any item in the array:
```typescript
  const isInArrTest = isInArray(['1', '2', '3']);
  isInArrTest('1'); // => true
```
- `isInArray`
- `isOptionalInArray`
- `isNullableInArray`
- `isNullishInArray`

### Is in range
Will check if the argument (can be a `string` or a `number`) is in the provided range. The function will always check if the argument is *greater-than* the first param and *less-than* the second param. If you wish to include the min or max value in the range (i.e. *greater-than-or-equal-to*) wrap it in sqaure brackets. If you wish to leave off a min or max pass an empty array `[]`:
```typescript

  // Between 0 and 100
  const isBetween0And100 = isInRange(0, 100);
  isBetween0And100(50); // false
  isBetween0And100(100); // false
  isBetween0And100(0); // true

  // Positives and negatives
  const isNegative = isInRange([], 0);
  const isPositive = isInRange(0, []);

  // 0 to 100
  const isFrom0to100 = isInRange([0], [100]);
  isFrom0to100(50); // true
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

### Is Key Of
- `isKeyOf`
- `isOptionalKeyOf`
- `isNullableKeyOf`
- `isNullishKeyOf`
- `isKeyOfArray`
- `isOptionalKeyOfArray`
- `isNullableKeyOfArray`
- `isNullishKeyOfArray`

### Enum
- `isEnum`
- `isOptionalEnum`
- `isNullableEnum`
- `isNullishEnum`
- `TEnum` (type not a function)

### Is Enum Value
- `isEnumVal`
- `isOptionalEnumVal`
- `isNullableEnumVal`
- `isNullishEnumVal`