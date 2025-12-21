import {
  parseBoolean,
  makeNullable,
  makeNullish,
  makeOptional,
} from './utils/index.js';

/******************************************************************************
                              Constants/Types
******************************************************************************/

const objectProto = Object.prototype;
export type PlainObject = Record<string, unknown>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TFunction = (...args: any[]) => any;

/******************************************************************************
                                    Setup
******************************************************************************/

// Nullables
export const isUndef = (arg: unknown): arg is undefined => arg === undefined;
export const isNull = (arg: unknown): arg is null => arg === null;
export const isNullish = makeNullable(isUndef);

// Boolean
export const isBoolean = checkType<boolean>('boolean');
export const isOptionalBoolean = makeOptional(isBoolean);
export const isNullableBoolean = makeNullable(isBoolean);
export const isNullishBoolean = makeNullish(isBoolean);
export const isBooleanArray = toArray(isBoolean);
export const isOptionalBooleanArray = makeOptional(isBooleanArray);
export const isNullableBooleanArray = makeNullable(isBooleanArray);
export const isNullishBooleanArray = makeNullish(isBooleanArray);

// Is it a boolean after doing "parseBoolean"
export const isValidBoolean = isValidBooleanHelper;
export const isOptionalValidBoolean = makeOptional(isValidBoolean);
export const isNullableValidBoolean = makeNullable(isValidBoolean);
export const isNullishValidBoolean = makeNullish(isValidBoolean);
export const isValidBooleanArray = toArray(isValidBoolean);
export const isOptionalValidBooleanArray = makeOptional(isValidBooleanArray);
export const isNullableValidBooleanArray = makeNullable(isValidBooleanArray);
export const isNullishValidBooleanArray = makeNullish(isValidBooleanArray);

// Number
export const isNumber = _isNumber;
export const isOptionalNumber = makeOptional(isNumber);
export const isNullableNumber = makeNullable(isNumber);
export const isNullishNumber = makeNullish(isNumber);
export const isNumberArray = toArray(isNumber);
export const isOptionalNumberArray = makeOptional(isNumberArray);
export const isNullableNumberArray = makeNullable(isNumberArray);
export const isNullishNumberArray = makeNullish(isNumberArray);

// Postive Number
export const isPositiveNumber = _isPositiveNumber;
export const isOptionalPositiveNumber = makeOptional(isPositiveNumber);
export const isNullablePositiveNumber = makeNullable(isPositiveNumber);
export const isNullishPositiveNumber = makeNullish(isPositiveNumber);
export const isPositiveNumberArray = toArray(isPositiveNumber);
export const isOptionalPositiveNumberArray = makeOptional(
  isPositiveNumberArray,
);
export const isNullablePositiveNumberArray = makeNullable(
  isPositiveNumberArray,
);
export const isNullishPositiveNumberArray = makeNullish(isPositiveNumberArray);

// Negative Number
export const isNegativeNumber = _isNegativeNumber;
export const isOptionalNegativeNumber = makeOptional(isNegativeNumber);
export const isNullableNegativeNumber = makeNullable(isNegativeNumber);
export const isNullishNegativeNumber = makeNullish(isNegativeNumber);
export const isNegativeNumberArray = toArray(isNegativeNumber);
export const isOptionalNegativeNumberArray = makeOptional(
  isNegativeNumberArray,
);
export const isNullableNegativeNumberArray = makeNullable(
  isNegativeNumberArray,
);
export const isNullishNegativeNumberArray = makeNullish(isNegativeNumberArray);

// Unsigned Number
export const isUnsignedNumber = _isUnsignedNumber;
export const isOptionalUnsignedNumber = makeOptional(isUnsignedNumber);
export const isNullableUnsignedNumber = makeNullable(isUnsignedNumber);
export const isNullishUnsignedNumber = makeNullish(isUnsignedNumber);
export const isUnsignedNumberArray = toArray(isUnsignedNumber);
export const isOptionalUnsignedNumberArray = makeOptional(
  isUnsignedNumberArray,
);
export const isNullableUnsignedNumberArray = makeNullable(
  isUnsignedNumberArray,
);
export const isNullishUnsignedNumberArray = makeNullish(isUnsignedNumberArray);

// Integer
export const isInteger = _isInteger;
export const isOptionalInteger = makeOptional(isInteger);
export const isNullableInteger = makeNullable(isInteger);
export const isNullishInteger = makeNullish(isInteger);
export const isIntegerArray = toArray(isInteger);
export const isOptionalIntegerArray = makeOptional(isIntegerArray);
export const isNullableIntegerArray = makeNullable(isIntegerArray);
export const isNullishIntegerArray = makeNullish(isIntegerArray);

// Postive Integer
export const isPositiveInteger = _isPositiveInteger;
export const isOptionalPositiveInteger = makeOptional(isPositiveInteger);
export const isNullablePositiveInteger = makeNullable(isPositiveInteger);
export const isNullishPositiveInteger = makeNullish(isPositiveInteger);
export const isPositiveIntegerArray = toArray(isPositiveInteger);
export const isOptionalPositiveIntegerArray = makeOptional(
  isPositiveIntegerArray,
);
export const isNullablePositiveIntegerArray = makeNullable(
  isPositiveIntegerArray,
);
export const isNullishPositiveIntegerArray = makeNullish(
  isPositiveIntegerArray,
);

// Negative Integer
export const isNegativeInteger = _isNegativeInteger;
export const isOptionalNegativeInteger = makeOptional(isNegativeInteger);
export const isNullableNegativeInteger = makeNullable(isNegativeInteger);
export const isNullishNegativeInteger = makeNullish(isNegativeInteger);
export const isNegativeIntegerArray = toArray(isNegativeInteger);
export const isOptionalNegativeIntegerArray = makeOptional(
  isNegativeIntegerArray,
);
export const isNullableNegativeIntegerArray = makeNullable(
  isNegativeIntegerArray,
);
export const isNullishNegativeIntegerArray = makeNullish(
  isNegativeIntegerArray,
);

// Unsigned Integer
export const isUnsignedInteger = _isUnsignedInteger;
export const isOptionalUnsignedInteger = makeOptional(isUnsignedInteger);
export const isNullableUnsignedInteger = makeNullable(isUnsignedInteger);
export const isNullishUnsignedInteger = makeNullish(isUnsignedInteger);
export const isUnsignedIntegerArray = toArray(isUnsignedInteger);
export const isOptionalUnsignedIntegerArray = makeOptional(
  isUnsignedIntegerArray,
);
export const isNullableUnsignedIntegerArray = makeNullable(
  isUnsignedIntegerArray,
);
export const isNullishUnsignedIntegerArray = makeNullish(
  isUnsignedIntegerArray,
);

// BigInt
export const isBigInt = checkType<bigint>('bigint');
export const isOptionalBigInt = makeOptional(isBigInt);
export const isNullableBigInt = makeNullable(isBigInt);
export const isNullishBigInt = makeNullish(isBigInt);
export const isBigIntArray = toArray(isBigInt);
export const isOptionalBigIntArray = makeOptional(isBigIntArray);
export const isNullableBigIntArray = makeNullable(isBigIntArray);
export const isNullishBigIntArr = makeNullish(isBigIntArray);

// Valid number (is it still a number after doing Number(arg))
export const isValidNumber = _isValidNumber;
export const isOptionalValidNumber = makeOptional(isValidNumber);
export const isNullableValidNumber = makeNullable(isValidNumber);
export const isNullishValidNumber = makeNullish(isValidNumber);
export const isValidNumberArray = toArray(isValidNumber);
export const isOptionalValidNumberArray = makeOptional(isValidNumberArray);
export const isNullableValidNumberArray = makeNullable(isValidNumberArray);
export const isNishValidNumArr = makeNullish(isValidNumberArray);

// String
export const isString = checkType<string>('string');
export const isOptionalString = makeOptional(isString);
export const isNullableString = makeNullable(isString);
export const isNullishString = makeNullish(isString);
export const isStringArray = toArray(isString);
export const isOptionalStringArray = makeOptional(isStringArray);
export const isNullableStringArray = makeNullable(isStringArray);
export const isNullishStringArray = makeNullish(isStringArray);

// NeStr => "Non-Empty String"
export const isNonEmptyString = isNonEmptyStringHelper;
export const isOptionalNonEmptyString = makeOptional(isNonEmptyString);
export const isNullableNonEmptyString = makeNullable(isNonEmptyString);
export const isNullishNonEmptyString = makeNullish(isNonEmptyString);
export const isNonEmptyStringArray = toArray(isNonEmptyString);
export const isOptionalNonEmptyStringArray = makeOptional(
  isNonEmptyStringArray,
);
export const isNullableNonEmptyStringArray = makeNullable(
  isNonEmptyStringArray,
);
export const isNullishNonEmptyStringArray = makeNullish(isNonEmptyStringArray);

// Symbol
export const isSymbol = checkType<symbol>('symbol');
export const isOptionalSymbol = makeOptional(isSymbol);
export const isNullableSymbol = makeNullable(isSymbol);
export const isNullishSymbol = makeNullish(isSymbol);
export const isSymbolArray = toArray(isSymbol);
export const isOptionalSymbolArray = makeOptional(isSymbolArray);
export const isNullableSymbolArray = makeNullable(isSymbolArray);
export const isNullishSymbolArray = makeNullish(isSymbolArray);

// Date
export const isDate = isDateHelper;
export const isOptionalDate = makeOptional(isDate);
export const isNullableDate = makeNullable(isDate);
export const isNullishDate = makeNullish(isDate);
export const isDateArray = toArray(isDate);
export const isOptionalDateArray = makeOptional(isDateArray);
export const isNullableDateArray = makeNullable(isDateArray);
export const isNullishDateArray = makeNullish(isDateArray);

// Is valid date
export const isValidDate = isValidDateHelper;
export const isOptionalValidDate = makeOptional(isValidDate);
export const isNullableValidDate = makeNullable(isValidDate);
export const isNullishValidDate = makeNullish(isValidDate);
export const isValidDateArray = toArray(isValidDate);
export const isOptionalValidDateArray = makeOptional(isValidDateArray);
export const isNullableValidDateArray = makeNullable(isValidDateArray);
export const isNullishValidDateArray = makeNullish(isValidDateArray);

// Object
export const isObject = isObjectHelper;
export const isOptionalObject = makeOptional(isObject);
export const isNullableObject = makeNullable(isObject);
export const isNullishObject = makeNullish(isObject);
export const isObjectArray = toArray(isObject);
export const isOptionalObjectArray = makeOptional(isObjectArray);
export const isNullableObjectArray = makeNullable(isObjectArray);
export const isNullishObjectArray = makeNullish(isObjectArray);

// Plain Object
export const isPlainObject = isPlainObjectHelper;
export const isOptionalPlainObject = makeOptional(isPlainObject);
export const isNullablePlainObject = makeNullable(isPlainObject);
export const isNullishPlainObject = makeNullish(isPlainObject);
export const isPlainObjectArray = toArray(isPlainObject);
export const isOptionalPlainObjectArray = makeOptional(isPlainObjectArray);
export const isNullablePlainObjectArray = makeNullable(isPlainObjectArray);
export const isNullishPlainObjectArray = makeNullish(isPlainObjectArray);

// Function
export const isFunction = checkType<TFunction>('function');
export const isOptionalFunction = makeOptional(isFunction);
export const isNullableFunction = makeNullable(isFunction);
export const isNullishFunction = makeNullish(isFunction);
export const isFunctionArray = toArray(isFunction);
export const isOptionalFunctionArray = makeOptional(isFunctionArray);
export const isNullableFunctionArray = makeNullable(isFunctionArray);
export const isNullishFunctionArray = makeNullish(isFunctionArray);

/******************************************************************************
                              Helpers
******************************************************************************/

/**
 * Check array counterpart for validator item.
 */
function toArray<T>(cb: (arg: unknown) => arg is T) {
  return (arg: unknown): arg is T[] => {
    return Array.isArray(arg) && arg.every(cb);
  };
}

/**
 * Check if number and not NaN (NaN is a number type).
 */
function _isNumber(arg: unknown): arg is number {
  return typeof arg === 'number' && !isNaN(arg);
}

/**
 * Check if number and positive.
 */
function _isPositiveNumber(arg: unknown): arg is number {
  return _isNumber(arg) && arg > 0;
}

/**
 * Check if number and positive.
 */
function _isNegativeNumber(arg: unknown): arg is number {
  return _isNumber(arg) && arg < 0;
}

/**
 * Check if number and positive.
 */
function _isUnsignedNumber(arg: unknown): arg is number {
  return _isPositiveNumber(arg) || arg === 0;
}

/**
 * Wrapper to check basic type.
 */
function _isInteger(arg: unknown): arg is number {
  return Number.isInteger(arg);
}

/**
 * Wrapper to check basic type.
 */
function _isPositiveInteger(arg: unknown): arg is number {
  return _isInteger(arg) && arg > 0;
}

/**
 * Wrapper to check basic type.
 */
function _isNegativeInteger(arg: unknown): arg is number {
  return _isInteger(arg) && arg < 0;
}

/**
 * Wrapper to check basic type.
 */
function _isUnsignedInteger(arg: unknown): arg is number {
  return _isPositiveInteger(arg) || arg === 0;
}

/**
 * Is it a valid number after casting to a number.
 */
function _isValidNumber(arg: unknown): arg is string | number | boolean {
  const argf = Number(arg);
  return !isNaN(argf);
}

/**
 * Wrapper to check basic type.
 */
function isObjectHelper(arg: unknown): arg is NonNullable<object> {
  return arg !== null && typeof arg === 'object';
}

/**
 * Wrapper to check basic type.
 */
function isPlainObjectHelper(arg: unknown): arg is PlainObject {
  if (!isObject(arg)) return false;
  const proto = Object.getPrototypeOf(arg);
  return proto === objectProto || proto === null;
}

/**
 * Wrapper to check basic type.
 */
function checkType<T>(type: string) {
  return (arg: unknown): arg is T => {
    return typeof arg === type;
  };
}

/**
 * Is it a boolean after doing parse boolean.
 */
function isValidBooleanHelper(arg: unknown): arg is number | string | boolean {
  try {
    arg = parseBoolean(arg);
    return isBoolean(arg);
  } catch {
    return false;
  }
}

/**
 * Is an instance of Date and that its not invalid.
 */
function isDateHelper(arg: unknown): arg is Date {
  return arg instanceof Date && !isNaN(arg.getTime());
}

/**
 * Is valid date.
 */
function isValidDateHelper(arg: unknown): arg is Date | string | number {
  if (!(isString(arg) || isNumber(arg) || arg instanceof Date)) {
    return false;
  }
  const argf = new Date(arg);
  return !isNaN(argf.getTime());
}

/**
 * Is it a string at least length 1.
 */
function isNonEmptyStringHelper<T>(
  arg: T,
): arg is T extends '' ? never : T & string {
  return isString(arg) && arg.length > 0;
}
