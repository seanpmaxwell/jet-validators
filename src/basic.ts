import { parseBoolean } from './utils/index.js';

const objectProto = Object.prototype;
export type PlainObject = Record<string, unknown>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Function = (...args: any[]) => any;

/******************************************************************************
                                    Setup
******************************************************************************/

// Nullables
export function isUndef(arg: unknown): arg is undefined {
  return arg === undefined;
}

export function isNull(arg: unknown): arg is null {
  return arg === null;
}

export function isNullish(arg: unknown): arg is null | undefined {
  return arg === null || arg === undefined;
}

// Boolean
export function isBoolean(arg: unknown): arg is boolean {
  return typeof arg === 'boolean';
}

export function isOptionalBoolean(arg: unknown): arg is boolean | undefined {
  return arg === undefined || isBoolean(arg);
}

export function isNullableBoolean(arg: unknown): arg is boolean | null {
  return arg === null || isBoolean(arg);
}

export function isNullishBoolean(
  arg: unknown,
): arg is boolean | null | undefined {
  return arg === null || arg === undefined || isBoolean(arg);
}

export function isBooleanArray(arg: unknown): arg is boolean[] {
  return Array.isArray(arg) && arg.every(isBoolean);
}

export function isOptionalBooleanArray(
  arg: unknown,
): arg is boolean[] | undefined {
  return arg === undefined || isBooleanArray(arg);
}

export function isNullableBooleanArray(arg: unknown): arg is boolean[] | null {
  return arg === null || isBooleanArray(arg);
}

export function isNullishBooleanArray(
  arg: unknown,
): arg is boolean[] | null | undefined {
  return arg === null || arg === undefined || isBooleanArray(arg);
}

// Is it a boolean after doing "parseBoolean"
export function isValidBoolean(arg: unknown): arg is number | string | boolean {
  try {
    parseBoolean(arg);
    return true;
  } catch {
    return false;
  }
}

export function isOptionalValidBoolean(
  arg: unknown,
): arg is number | string | boolean | undefined {
  return arg === undefined || isValidBoolean(arg);
}

export function isNullableValidBoolean(
  arg: unknown,
): arg is number | string | boolean | null {
  return arg === null || isValidBoolean(arg);
}

export function isNullishValidBoolean(
  arg: unknown,
): arg is number | string | boolean | null | undefined {
  return arg === null || arg === undefined || isValidBoolean(arg);
}

export function isValidBooleanArray(
  arg: unknown,
): arg is Array<number | string | boolean> {
  return Array.isArray(arg) && arg.every(isValidBoolean);
}

export function isOptionalValidBooleanArray(
  arg: unknown,
): arg is Array<number | string | boolean> | undefined {
  return arg === undefined || isValidBooleanArray(arg);
}

export function isNullableValidBooleanArray(
  arg: unknown,
): arg is Array<number | string | boolean> | null {
  return arg === null || isValidBooleanArray(arg);
}

export function isNullishValidBooleanArray(
  arg: unknown,
): arg is Array<number | string | boolean> | null | undefined {
  return arg === null || arg === undefined || isValidBooleanArray(arg);
}

// Number
export function isNumber(arg: unknown): arg is number {
  return typeof arg === 'number' && !isNaN(arg);
}

export function isOptionalNumber(arg: unknown): arg is number | undefined {
  return arg === undefined || isNumber(arg);
}

export function isNullableNumber(arg: unknown): arg is number | null {
  return arg === null || isNumber(arg);
}

export function isNullishNumber(
  arg: unknown,
): arg is number | null | undefined {
  return arg === null || arg === undefined || isNumber(arg);
}

export function isNumberArray(arg: unknown): arg is number[] {
  return Array.isArray(arg) && arg.every(isNumber);
}

export function isOptionalNumberArray(
  arg: unknown,
): arg is number[] | undefined {
  return arg === undefined || isNumberArray(arg);
}

export function isNullableNumberArray(arg: unknown): arg is number[] | null {
  return arg === null || isNumberArray(arg);
}

export function isNullishNumberArray(
  arg: unknown,
): arg is number[] | null | undefined {
  return arg === null || arg === undefined || isNumberArray(arg);
}

// Postive Number
export function isPositiveNumber(arg: unknown): arg is number {
  return isNumber(arg) && arg > 0;
}

export function isOptionalPositiveNumber(
  arg: unknown,
): arg is number | undefined {
  return arg === undefined || isPositiveNumber(arg);
}

export function isNullablePositiveNumber(arg: unknown): arg is number | null {
  return arg === null || isPositiveNumber(arg);
}

export function isNullishPositiveNumber(
  arg: unknown,
): arg is number | null | undefined {
  return arg === null || arg === undefined || isPositiveNumber(arg);
}

export function isPositiveNumberArray(arg: unknown): arg is number[] {
  return Array.isArray(arg) && arg.every(isPositiveNumber);
}

export function isOptionalPositiveNumberArray(
  arg: unknown,
): arg is number[] | undefined {
  return arg === undefined || isPositiveNumberArray(arg);
}

export function isNullablePositiveNumberArray(
  arg: unknown,
): arg is number[] | null {
  return arg === null || isPositiveNumberArray(arg);
}

export function isNullishPositiveNumberArray(
  arg: unknown,
): arg is number[] | null | undefined {
  return arg === null || arg === undefined || isPositiveNumberArray(arg);
}

// Negative Number
export function isNegativeNumber(arg: unknown): arg is number {
  return isNumber(arg) && arg < 0;
}

export function isOptionalNegativeNumber(
  arg: unknown,
): arg is number | undefined {
  return arg === undefined || isNegativeNumber(arg);
}

export function isNullableNegativeNumber(arg: unknown): arg is number | null {
  return arg === null || isNegativeNumber(arg);
}

export function isNullishNegativeNumber(
  arg: unknown,
): arg is number | null | undefined {
  return arg === null || arg === undefined || isNegativeNumber(arg);
}

export function isNegativeNumberArray(arg: unknown): arg is number[] {
  return Array.isArray(arg) && arg.every(isNegativeNumber);
}

export function isOptionalNegativeNumberArray(
  arg: unknown,
): arg is number[] | undefined {
  return arg === undefined || isNegativeNumberArray(arg);
}

export function isNullableNegativeNumberArray(
  arg: unknown,
): arg is number[] | null {
  return arg === null || isNegativeNumberArray(arg);
}

export function isNullishNegativeNumberArray(
  arg: unknown,
): arg is number[] | null | undefined {
  return arg === null || arg === undefined || isNegativeNumberArray(arg);
}

// Unsigned Number
export function isUnsignedNumber(arg: unknown): arg is number {
  return isNumber(arg) && arg >= 0;
}

export function isOptionalUnsignedNumber(
  arg: unknown,
): arg is number | undefined {
  return arg === undefined || isUnsignedNumber(arg);
}

export function isNullableUnsignedNumber(arg: unknown): arg is number | null {
  return arg === null || isUnsignedNumber(arg);
}

export function isNullishUnsignedNumber(
  arg: unknown,
): arg is number | null | undefined {
  return arg === null || arg === undefined || isUnsignedNumber(arg);
}

export function isUnsignedNumberArray(arg: unknown): arg is number[] {
  return Array.isArray(arg) && arg.every(isUnsignedNumber);
}

export function isOptionalUnsignedNumberArray(
  arg: unknown,
): arg is number[] | undefined {
  return arg === undefined || isUnsignedNumberArray(arg);
}

export function isNullableUnsignedNumberArray(
  arg: unknown,
): arg is number[] | null {
  return arg === null || isUnsignedNumberArray(arg);
}

export function isNullishUnsignedNumberArray(
  arg: unknown,
): arg is number[] | null | undefined {
  return arg === null || arg === undefined || isUnsignedNumberArray(arg);
}

// Integer
export function isInteger(arg: unknown): arg is number {
  return typeof arg === 'number' && Number.isInteger(arg);
}

export function isOptionalInteger(arg: unknown): arg is number | undefined {
  return arg === undefined || isInteger(arg);
}

export function isNullableInteger(arg: unknown): arg is number | null {
  return arg === null || isInteger(arg);
}

export function isNullishInteger(
  arg: unknown,
): arg is number | null | undefined {
  return arg === null || arg === undefined || isInteger(arg);
}

export function isIntegerArray(arg: unknown): arg is number[] {
  return Array.isArray(arg) && arg.every(isInteger);
}

export function isOptionalIntegerArray(
  arg: unknown,
): arg is number[] | undefined {
  return arg === undefined || isIntegerArray(arg);
}

export function isNullableIntegerArray(arg: unknown): arg is number[] | null {
  return arg === null || isIntegerArray(arg);
}

export function isNullishIntegerArray(
  arg: unknown,
): arg is number[] | null | undefined {
  return arg === null || arg === undefined || isIntegerArray(arg);
}

// Postive Integer
export function isPositiveInteger(arg: unknown): arg is number {
  return isInteger(arg) && (arg as number) > 0;
}

export function isOptionalPositiveInteger(
  arg: unknown,
): arg is number | undefined {
  return arg === undefined || isPositiveInteger(arg);
}

export function isNullablePositiveInteger(arg: unknown): arg is number | null {
  return arg === null || isPositiveInteger(arg);
}

export function isNullishPositiveInteger(
  arg: unknown,
): arg is number | null | undefined {
  return arg === null || arg === undefined || isPositiveInteger(arg);
}

export function isPositiveIntegerArray(arg: unknown): arg is number[] {
  return Array.isArray(arg) && arg.every(isPositiveInteger);
}

export function isOptionalPositiveIntegerArray(
  arg: unknown,
): arg is number[] | undefined {
  return arg === undefined || isPositiveIntegerArray(arg);
}

export function isNullablePositiveIntegerArray(
  arg: unknown,
): arg is number[] | null {
  return arg === null || isPositiveIntegerArray(arg);
}

export function isNullishPositiveIntegerArray(
  arg: unknown,
): arg is number[] | null | undefined {
  return arg === null || arg === undefined || isPositiveIntegerArray(arg);
}

// Negative Integer
export function isNegativeInteger(arg: unknown): arg is number {
  return isInteger(arg) && (arg as number) < 0;
}

export function isOptionalNegativeInteger(
  arg: unknown,
): arg is number | undefined {
  return arg === undefined || isNegativeInteger(arg);
}

export function isNullableNegativeInteger(arg: unknown): arg is number | null {
  return arg === null || isNegativeInteger(arg);
}

export function isNullishNegativeInteger(
  arg: unknown,
): arg is number | null | undefined {
  return arg === null || arg === undefined || isNegativeInteger(arg);
}

export function isNegativeIntegerArray(arg: unknown): arg is number[] {
  return Array.isArray(arg) && arg.every(isNegativeInteger);
}

export function isOptionalNegativeIntegerArray(
  arg: unknown,
): arg is number[] | undefined {
  return arg === undefined || isNegativeIntegerArray(arg);
}

export function isNullableNegativeIntegerArray(
  arg: unknown,
): arg is number[] | null {
  return arg === null || isNegativeIntegerArray(arg);
}

export function isNullishNegativeIntegerArray(
  arg: unknown,
): arg is number[] | null | undefined {
  return arg === null || arg === undefined || isNegativeIntegerArray(arg);
}

// Unsigned Integer
export function isUnsignedInteger(arg: unknown): arg is number {
  return isInteger(arg) && (arg as number) >= 0;
}

export function isOptionalUnsignedInteger(
  arg: unknown,
): arg is number | undefined {
  return arg === undefined || isUnsignedInteger(arg);
}

export function isNullableUnsignedInteger(arg: unknown): arg is number | null {
  return arg === null || isUnsignedInteger(arg);
}

export function isNullishUnsignedInteger(
  arg: unknown,
): arg is number | null | undefined {
  return arg === null || arg === undefined || isUnsignedInteger(arg);
}

export function isUnsignedIntegerArray(arg: unknown): arg is number[] {
  return Array.isArray(arg) && arg.every(isUnsignedInteger);
}

export function isOptionalUnsignedIntegerArray(
  arg: unknown,
): arg is number[] | undefined {
  return arg === undefined || isUnsignedIntegerArray(arg);
}

export function isNullableUnsignedIntegerArray(
  arg: unknown,
): arg is number[] | null {
  return arg === null || isUnsignedIntegerArray(arg);
}

export function isNullishUnsignedIntegerArray(
  arg: unknown,
): arg is number[] | null | undefined {
  return arg === null || arg === undefined || isUnsignedIntegerArray(arg);
}

// BigInt
export function isBigInt(arg: unknown): arg is bigint {
  return typeof arg === 'bigint';
}

export function isOptionalBigInt(arg: unknown): arg is bigint | undefined {
  return arg === undefined || isBigInt(arg);
}

export function isNullableBigInt(arg: unknown): arg is bigint | null {
  return arg === null || isBigInt(arg);
}

export function isNullishBigInt(
  arg: unknown,
): arg is bigint | null | undefined {
  return arg === null || arg === undefined || isBigInt(arg);
}

export function isBigIntArray(arg: unknown): arg is bigint[] {
  return Array.isArray(arg) && arg.every(isBigInt);
}

export function isOptionalBigIntArray(
  arg: unknown,
): arg is bigint[] | undefined {
  return arg === undefined || isBigIntArray(arg);
}

export function isNullableBigIntArray(arg: unknown): arg is bigint[] | null {
  return arg === null || isBigIntArray(arg);
}

export function isNullishBigIntArr(
  arg: unknown,
): arg is bigint[] | null | undefined {
  return arg === null || arg === undefined || isBigIntArray(arg);
}

// Valid number (is it still a number after doing Number(arg))
export function isValidNumber(arg: unknown): arg is string | number | boolean {
  const casted = Number(arg);
  return !isNaN(casted);
}

export function isOptionalValidNumber(
  arg: unknown,
): arg is string | number | boolean | undefined {
  return arg === undefined || isValidNumber(arg);
}

export function isNullableValidNumber(
  arg: unknown,
): arg is string | number | boolean | null {
  return arg === null || isValidNumber(arg);
}

export function isNullishValidNumber(
  arg: unknown,
): arg is string | number | boolean | null | undefined {
  return arg === null || arg === undefined || isValidNumber(arg);
}

export function isValidNumberArray(
  arg: unknown,
): arg is Array<string | number | boolean> {
  return Array.isArray(arg) && arg.every(isValidNumber);
}

export function isOptionalValidNumberArray(
  arg: unknown,
): arg is Array<string | number | boolean> | undefined {
  return arg === undefined || isValidNumberArray(arg);
}

export function isNullableValidNumberArray(
  arg: unknown,
): arg is Array<string | number | boolean> | null {
  return arg === null || isValidNumberArray(arg);
}

export function isNishValidNumArr(
  arg: unknown,
): arg is Array<string | number | boolean> | null | undefined {
  return arg === null || arg === undefined || isValidNumberArray(arg);
}

// String
export function isString(arg: unknown): arg is string {
  return typeof arg === 'string';
}

export function isOptionalString(arg: unknown): arg is string | undefined {
  return arg === undefined || isString(arg);
}

export function isNullableString(arg: unknown): arg is string | null {
  return arg === null || isString(arg);
}

export function isNullishString(
  arg: unknown,
): arg is string | null | undefined {
  return arg === null || arg === undefined || isString(arg);
}

export function isStringArray(arg: unknown): arg is string[] {
  return Array.isArray(arg) && arg.every(isString);
}

export function isOptionalStringArray(
  arg: unknown,
): arg is string[] | undefined {
  return arg === undefined || isStringArray(arg);
}

export function isNullableStringArray(arg: unknown): arg is string[] | null {
  return arg === null || isStringArray(arg);
}

export function isNullishStringArray(
  arg: unknown,
): arg is string[] | null | undefined {
  return arg === null || arg === undefined || isStringArray(arg);
}

// NeStr => "Non-Empty String"
export function isNonEmptyString(arg: unknown): arg is string {
  return isString(arg) && (arg as string).length > 0;
}

export function isOptionalNonEmptyString(
  arg: unknown,
): arg is string | undefined {
  return arg === undefined || isNonEmptyString(arg);
}

export function isNullableNonEmptyString(arg: unknown): arg is string | null {
  return arg === null || isNonEmptyString(arg);
}

export function isNullishNonEmptyString(
  arg: unknown,
): arg is string | null | undefined {
  return arg === null || arg === undefined || isNonEmptyString(arg);
}

export function isNonEmptyStringArray(arg: unknown): arg is string[] {
  return Array.isArray(arg) && arg.every(isNonEmptyString);
}

export function isOptionalNonEmptyStringArray(
  arg: unknown,
): arg is string[] | undefined {
  return arg === undefined || isNonEmptyStringArray(arg);
}

export function isNullableNonEmptyStringArray(
  arg: unknown,
): arg is string[] | null {
  return arg === null || isNonEmptyStringArray(arg);
}

export function isNullishNonEmptyStringArray(
  arg: unknown,
): arg is string[] | null | undefined {
  return arg === null || arg === undefined || isNonEmptyStringArray(arg);
}

// Symbol
export function isSymbol(arg: unknown): arg is symbol {
  return typeof arg === 'symbol';
}

export function isOptionalSymbol(arg: unknown): arg is symbol | undefined {
  return arg === undefined || isSymbol(arg);
}

export function isNullableSymbol(arg: unknown): arg is symbol | null {
  return arg === null || isSymbol(arg);
}

export function isNullishSymbol(
  arg: unknown,
): arg is symbol | null | undefined {
  return arg === null || arg === undefined || isSymbol(arg);
}

export function isSymbolArray(arg: unknown): arg is symbol[] {
  return Array.isArray(arg) && arg.every(isSymbol);
}

export function isOptionalSymbolArray(
  arg: unknown,
): arg is symbol[] | undefined {
  return arg === undefined || isSymbolArray(arg);
}

export function isNullableSymbolArray(arg: unknown): arg is symbol[] | null {
  return arg === null || isSymbolArray(arg);
}

export function isNullishSymbolArray(
  arg: unknown,
): arg is symbol[] | null | undefined {
  return arg === null || arg === undefined || isSymbolArray(arg);
}

// Date
export function isDate(arg: unknown): arg is Date {
  return arg instanceof Date && !isNaN(arg.getTime());
}

export function isOptionalDate(arg: unknown): arg is Date | undefined {
  return arg === undefined || isDate(arg);
}

export function isNullableDate(arg: unknown): arg is Date | null {
  return arg === null || isDate(arg);
}

export function isNullishDate(arg: unknown): arg is Date | null | undefined {
  return arg === null || arg === undefined || isDate(arg);
}

export function isDateArray(arg: unknown): arg is Date[] {
  return Array.isArray(arg) && arg.every(isDate);
}

export function isOptionalDateArray(arg: unknown): arg is Date[] | undefined {
  return arg === undefined || isDateArray(arg);
}

export function isNullableDateArray(arg: unknown): arg is Date[] | null {
  return arg === null || isDateArray(arg);
}

export function isNullishDateArray(
  arg: unknown,
): arg is Date[] | null | undefined {
  return arg === null || arg === undefined || isDateArray(arg);
}

// Is valid date
export function isValidDate(arg: unknown): arg is Date | string | number {
  if (!(isString(arg) || isNumber(arg) || arg instanceof Date)) {
    return false;
  }
  const value = new Date(arg);
  return !isNaN(value.getTime());
}

export function isOptionalValidDate(
  arg: unknown,
): arg is Date | string | number | undefined {
  return arg === undefined || isValidDate(arg);
}

export function isNullableValidDate(
  arg: unknown,
): arg is Date | string | number | null {
  return arg === null || isValidDate(arg);
}

export function isNullishValidDate(
  arg: unknown,
): arg is Date | string | number | null | undefined {
  return arg === null || arg === undefined || isValidDate(arg);
}

export function isValidDateArray(
  arg: unknown,
): arg is Array<Date | string | number> {
  return Array.isArray(arg) && arg.every(isValidDate);
}

export function isOptionalValidDateArray(
  arg: unknown,
): arg is Array<Date | string | number> | undefined {
  return arg === undefined || isValidDateArray(arg);
}

export function isNullableValidDateArray(
  arg: unknown,
): arg is Array<Date | string | number> | null {
  return arg === null || isValidDateArray(arg);
}

export function isNullishValidDateArray(
  arg: unknown,
): arg is Array<Date | string | number> | null | undefined {
  return arg === null || arg === undefined || isValidDateArray(arg);
}

// Object
export function isObject(arg: unknown): arg is NonNullable<object> {
  return arg !== null && typeof arg === 'object';
}

export function isOptionalObject(
  arg: unknown,
): arg is NonNullable<object> | undefined {
  return arg === undefined || isObject(arg);
}

export function isNullableObject(
  arg: unknown,
): arg is NonNullable<object> | null {
  return arg === null || isObject(arg);
}

export function isNullishObject(
  arg: unknown,
): arg is NonNullable<object> | null | undefined {
  return arg === null || arg === undefined || isObject(arg);
}

export function isObjectArray(arg: unknown): arg is NonNullable<object>[] {
  return Array.isArray(arg) && arg.every(isObject);
}

export function isOptionalObjectArray(
  arg: unknown,
): arg is NonNullable<object>[] | undefined {
  return arg === undefined || isObjectArray(arg);
}

export function isNullableObjectArray(
  arg: unknown,
): arg is NonNullable<object>[] | null {
  return arg === null || isObjectArray(arg);
}

export function isNullishObjectArray(
  arg: unknown,
): arg is NonNullable<object>[] | null | undefined {
  return arg === null || arg === undefined || isObjectArray(arg);
}

// Plain Object
export function isPlainObject(arg: unknown): arg is PlainObject {
  if (!isObject(arg)) {
    return false;
  }
  const proto = Object.getPrototypeOf(arg);
  return proto === objectProto || proto === null;
}

export function isOptionalPlainObject(
  arg: unknown,
): arg is PlainObject | undefined {
  return arg === undefined || isPlainObject(arg);
}

export function isNullablePlainObject(arg: unknown): arg is PlainObject | null {
  return arg === null || isPlainObject(arg);
}

export function isNullishPlainObject(
  arg: unknown,
): arg is PlainObject | null | undefined {
  return arg === null || arg === undefined || isPlainObject(arg);
}

export function isPlainObjectArray(arg: unknown): arg is PlainObject[] {
  return Array.isArray(arg) && arg.every(isPlainObject);
}

export function isOptionalPlainObjectArray(
  arg: unknown,
): arg is PlainObject[] | undefined {
  return arg === undefined || isPlainObjectArray(arg);
}

export function isNullablePlainObjectArray(
  arg: unknown,
): arg is PlainObject[] | null {
  return arg === null || isPlainObjectArray(arg);
}

export function isNullishPlainObjectArray(
  arg: unknown,
): arg is PlainObject[] | null | undefined {
  return arg === null || arg === undefined || isPlainObjectArray(arg);
}

// Function
export function isFunction(arg: unknown): arg is Function {
  return typeof arg === 'function';
}

export function isOptionalFunction(arg: unknown): arg is Function | undefined {
  return arg === undefined || isFunction(arg);
}

export function isNullableFunction(arg: unknown): arg is Function | null {
  return arg === null || isFunction(arg);
}

export function isNullishFunction(
  arg: unknown,
): arg is Function | null | undefined {
  return arg === null || arg === undefined || isFunction(arg);
}

export function isFunctionArray(arg: unknown): arg is Function[] {
  return Array.isArray(arg) && arg.every(isFunction);
}

export function isOptionalFunctionArray(
  arg: unknown,
): arg is Function[] | undefined {
  return arg === undefined || isFunctionArray(arg);
}

export function isNullableFunctionArray(
  arg: unknown,
): arg is Function[] | null {
  return arg === null || isFunctionArray(arg);
}

export function isNullishFunctionArray(
  arg: unknown,
): arg is Function[] | null | undefined {
  return arg === null || arg === undefined || isFunctionArray(arg);
}
