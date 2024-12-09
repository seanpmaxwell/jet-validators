import { orNullable, orOptional } from './common';
import { parseBoolean } from '../utils';


// **** Types **** //

export type TNonEmptyStr = `${string}`;
export type TRecord = Record<string, unknown>;


// **** Functions **** //

// Nullables
export const isUndef = ((arg: unknown): arg is undefined => arg === undefined);
export const isNull = ((arg: unknown): arg is null => arg === null);
export const isNullOrUndef = orNullable(isUndef);

// Boolean
export const isBoolean = _checkType<boolean>('boolean');
export const isOptionalBoolean = orOptional(isBoolean);
export const isNullableBoolean = orNullable(isBoolean);
export const isNullishBoolean = orNullable(isOptionalBoolean);
export const isBooleanArray = _toArray(isBoolean);
export const isOptionalBooleanArray = orOptional(isBooleanArray);
export const isNullableBooleanArray = orNullable(isBooleanArray);
export const isNullishBooleanArray = orNullable(isOptionalBooleanArray);

// Is it a boolean after doing "parseBoolean"
export const isValidBoolean = _isValidBoolean;
export const isOptionalValidBoolean = orOptional(isValidBoolean);
export const isNullableValidBoolean = orNullable(isValidBoolean);
export const isNullishValidBoolean = orNullable(isOptionalValidBoolean);
export const isValidBooleanArray = _toArray(isValidBoolean);
export const isOptionalValidBooleanArray = orOptional(isValidBooleanArray);
export const isNullableValidBooleanArray = orNullable(isValidBooleanArray);
export const isNullishValidBooleanArray = orNullable(isOptionalValidBooleanArray);

// Number
export const isNumber = _isNumber;
export const isOptionalNumber = orOptional(isNumber);
export const isNullableNumber = orNullable(isNumber);
export const isNullishNumber = orNullable(isOptionalNumber);
export const isNumberArray = _toArray(isNumber);
export const isOptionalNumberArray = orOptional(isNumberArray);
export const isNullableNumberArray = orNullable(isNumberArray);
export const isNullishNumberArray = orNullable(isOptionalNumberArray);

// BigInt
export const isBigInt = _checkType<bigint>('bigint');
export const isOptionalBigInt = orOptional(isBigInt);
export const isNullableBigInt = orNullable(isBigInt);
export const isNullishBigInt = orNullable(isOptionalBigInt);
export const isBigIntArray = _toArray(isBigInt);
export const isOptionalBigIntArray = orOptional(isBigIntArray);
export const isNullableBigIntArray = orNullable(isBigIntArray);
export const isNullishBigIntArr = orNullable(isOptionalBigIntArray);

// Valid number (is it still a number after doing Number(arg))
export const isValidNumber = _isValidNumber;
export const isOptionalValidNumber = orOptional(isValidNumber);
export const isNullableValidNumber = orNullable(isValidNumber);
export const isNullishValidNumber = orNullable(isOptionalValidNumber);
export const isValidNumberArray = _toArray(isValidNumber);
export const isOptionalValidNumberArray = orOptional(isValidNumberArray);
export const isNullableValidNumberArray = orNullable(isValidNumberArray);
export const isNishValidNumArr = orNullable(isOptionalValidNumberArray);

// String
export const isString = _checkType<string>('string');
export const isOptionalString = orOptional(isString);
export const isNullableString = orNullable(isString);
export const isNullishString = orNullable(isOptionalString);
export const isStringArray = _toArray(isString);
export const isOptionalStringArray = orOptional(isStringArray);
export const isNullableStringArray = orNullable(isStringArray);
export const isNullishStringArray = orNullable(isOptionalStringArray);

// NeStr => "Non-Empty String"
export const isNonEmptyString = _isNonEmptyString;
export const isOptionalNonEmptyString = orOptional(isNonEmptyString);
export const isNullableNonEmptyString = orNullable(isNonEmptyString);
export const isNullishNonEmptyString = orNullable(isOptionalNonEmptyString);
export const isNonEmptyStringArray = _toArray(isNonEmptyString);
export const isOptionalNonEmptyStringArray = orOptional(isNonEmptyStringArray);
export const isNullableNonEmptyStringArray = orNullable(isNonEmptyStringArray);
export const isNullishNonEmptyStringArray = orNullable(isOptionalNonEmptyStringArray);

// Symbol
export const isSymbol = _checkType<symbol>('symbol');
export const isOptionalSymbol = orOptional(isSymbol);
export const isNullableSymbol = orNullable(isSymbol);
export const isNullishSymbol = orNullable(isOptionalSymbol);
export const isSymbolArray = _toArray(isSymbol);
export const isOptionalSymbolArray = orOptional(isSymbolArray);
export const isNullableSymbolArray = orNullable(isSymbolArray);
export const isNullishSymbolArray = orNullable(isOptionalSymbolArray);

// Date
export const isDate = (arg: unknown): arg is Date => arg instanceof Date;
export const isOptionalDate = orOptional(isDate);
export const isNullableDate = orNullable(isDate);
export const isNullishDate = orNullable(isOptionalDate);
export const isDateArray = _toArray(isDate);
export const isOptionalDateArray = orOptional(isDateArray);
export const isNullableDateArray = orNullable(isDateArray);
export const isNullishDateArray = orNullable(isOptionalDateArray);

// Valid date (is it a valid date after calling "new Date()", could be a string or number)
export const isValidDate = _isValidDate;
export const isOptionalValidDate = orOptional(isValidDate);
export const isNullableValidDate = orNullable(isValidDate);
export const isNullishValidDate = orNullable(isOptionalValidDate);
export const isValidDateArray = _toArray(isValidDate);
export const isOptionalValidDateArray = orOptional(isValidDateArray);
export const isNullableValidDateArray = orNullable(isValidDateArray);
export const isNullishValidDateArray = orNullable(isOptionalValidDateArray);

// Object
export const isObject = _isObject;
export const isOptionalObject = orOptional(isObject);
export const isNullableObject = orNullable(isObject);
export const isNullishObject = orNullable(isOptionalObject);
export const isObjectArray = _toArray(isObject);
export const isOptionalObjectArray = orOptional(isObjectArray);
export const isNullableObjectArray = orNullable(isObjectArray);
export const isNullishObjectArray = orNullable(isOptionalObjectArray);

// Record (Record<string, unknown>)
export const isRecord = _isRecord;
export const isOptionalRecord = orOptional(isRecord);
export const isNullableRecord = orNullable(isRecord);
export const isNullishRecord = orNullable(isOptionalRecord);
export const isRecordArray = _toArray(_isRecord);
export const isOptionalRecordArray = orOptional(isRecordArray);
export const isNullableRecordArray = orNullable(isRecordArray);
export const isNullishRecordArray = orNullable(isOptionalRecordArray);

// Function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isFunction = _checkType<(...args: any[]) => any>('function');
export const isOptionalFunction = orOptional(isFunction);
export const isNullableFunction = orNullable(isFunction);
export const isNullishFunction = orNullable(isOptionalFunction);
export const isFunctionArray = _toArray(isFunction);
export const isOptionalFunctionArray = orOptional(isFunctionArray);
export const isNullableFunctionArray = orNullable(isFunctionArray);
export const isNullishFunctionArray = orNullable(isOptionalFunctionArray);


// **** Helpers **** //

/**
 * Check array counterpart for validator item.
 */
function _toArray<T>(cb: ((arg: unknown) => arg is T)) {
  return (arg: unknown): arg is T[] => {
    return Array.isArray(arg) && !arg.some(item => !cb(item));
  };
}

/**
 * Wrapper to check basic type.
 */
function _isNumber(arg: unknown): arg is number {
  return typeof arg === 'number' && !isNaN(arg as number);
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
function _isObject(arg: unknown): arg is NonNullable<object> {
  return typeof arg === 'object' && (arg !== null);
}

/**
 * Is the object Record<string, unknown>. Note we don't need to loop through
 * the keys cause number keys are caste to strings and symbols are skipped when 
 * doing for..in loops. Must use Reflect.ownKeys to include symbols.
 */
function _isRecord(arg: unknown): arg is TRecord {
  return isObject(arg) && !Array.isArray(arg);
}

/**
 * Wrapper to check basic type.
 */
function _checkType<T>(type: string) {
  return (arg: unknown): arg is T => {
    return typeof arg === type;
  };
}

/**
 * Is it a boolean after doing parse boolean.
 */
function _isValidBoolean(arg: unknown): arg is number | string | boolean {
  arg = parseBoolean(arg);
  return isBoolean(arg);
}

/**
 * Is valid date.
 */
function _isValidDate(arg: unknown): arg is Date | string | number {
  if (!(isString(arg) || isNumber(arg) || arg instanceof Date)) {
    return false;
  }
  const argf = new Date(arg);
  return !isNaN(argf.getTime());
}

/**
 * Is it a string at least length 1.
 */
function _isNonEmptyString(arg: unknown): arg is TNonEmptyStr {
  return (isString(arg) && arg.length > 0);
}
