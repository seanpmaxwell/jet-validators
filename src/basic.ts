import { parseBoolean } from './utils/index.js';
import type { ResolvePlainObject } from './utils/ResolvePlainObject.js';

/******************************************************************************
                                   Types
******************************************************************************/

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = (...args: any[]) => any;

/******************************************************************************
                                Functions
******************************************************************************/

// ------------------------------- Nullables ------------------------------- //

export function isUndef(arg: unknown): arg is undefined {
  return arg === undefined;
}

export function isNull(arg: unknown): arg is null {
  return arg === null;
}

export function isNullish(arg: unknown): arg is null | undefined {
  return arg === null || arg === undefined;
}

// -------------------------------- Boolean -------------------------------- //

export function isBoolean(arg: unknown): arg is boolean {
  return typeof arg === 'boolean';
}

export function isOptionalBoolean(arg: unknown): arg is boolean | undefined {
  return arg === undefined || typeof arg === 'boolean';
}

export function isNullableBoolean(arg: unknown): arg is boolean | null {
  return arg === null || typeof arg === 'boolean';
}

export function isNullishBoolean(
  arg: unknown,
): arg is boolean | null | undefined {
  return arg === null || arg === undefined || typeof arg === 'boolean';
}

export function isBooleanArray(arg: unknown): arg is boolean[] {
  if (!Array.isArray(arg)) {
    return false;
  }
  const length = arg.length;
  for (let i = 0; i < length; i += 1) {
    if (typeof arg[i] !== 'boolean') {
      return false;
    }
  }
  return true;
}

export function isOptionalBooleanArray(
  arg: unknown,
): arg is boolean[] | undefined {
  if (arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  const length = arg.length;
  for (let i = 0; i < length; i += 1) {
    if (typeof arg[i] !== 'boolean') {
      return false;
    }
  }
  return true;
}

export function isNullableBooleanArray(arg: unknown): arg is boolean[] | null {
  if (arg === null) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  const length = arg.length;
  for (let i = 0; i < length; i += 1) {
    if (typeof arg[i] !== 'boolean') {
      return false;
    }
  }
  return true;
}

export function isNullishBooleanArray(
  arg: unknown,
): arg is boolean[] | null | undefined {
  if (arg === null || arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  const length = arg.length;
  for (let i = 0; i < length; i += 1) {
    if (typeof arg[i] !== 'boolean') {
      return false;
    }
  }
  return true;
}

// -------------- Is it a boolean after doing "parseBoolean" --------------- //

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
  if (arg === undefined) {
    return true;
  }
  try {
    parseBoolean(arg);
    return true;
  } catch {
    return false;
  }
}

export function isNullableValidBoolean(
  arg: unknown,
): arg is number | string | boolean | null {
  if (arg === null) {
    return true;
  }
  try {
    parseBoolean(arg);
    return true;
  } catch {
    return false;
  }
}

export function isNullishValidBoolean(
  arg: unknown,
): arg is number | string | boolean | null | undefined {
  if (arg === null || arg === undefined) {
    return true;
  }
  try {
    parseBoolean(arg);
    return true;
  } catch {
    return false;
  }
}

export function isValidBooleanArray(
  arg: unknown,
): arg is Array<number | string | boolean> {
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    try {
      parseBoolean(value);
    } catch {
      return false;
    }
  }
  return true;
}

export function isOptionalValidBooleanArray(
  arg: unknown,
): arg is Array<number | string | boolean> | undefined {
  if (arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    try {
      parseBoolean(value);
    } catch {
      return false;
    }
  }
  return true;
}

export function isNullableValidBooleanArray(
  arg: unknown,
): arg is Array<number | string | boolean> | null {
  if (arg === null) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    try {
      parseBoolean(value);
    } catch {
      return false;
    }
  }
  return true;
}

export function isNullishValidBooleanArray(
  arg: unknown,
): arg is Array<number | string | boolean> | null | undefined {
  if (arg === null || arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    try {
      parseBoolean(value);
    } catch {
      return false;
    }
  }
  return true;
}

// -------------------------------- Number --------------------------------- //

export function isNumber(arg: unknown): arg is number {
  return typeof arg === 'number' && !isNaN(arg);
}

export function isOptionalNumber(arg: unknown): arg is number | undefined {
  return arg === undefined || (typeof arg === 'number' && !isNaN(arg));
}

export function isNullableNumber(arg: unknown): arg is number | null {
  return arg === null || (typeof arg === 'number' && !isNaN(arg));
}

export function isNullishNumber(
  arg: unknown,
): arg is number | null | undefined {
  return (
    arg === null ||
    arg === undefined ||
    (typeof arg === 'number' && !isNaN(arg))
  );
}

export function isNumberArray(arg: unknown): arg is number[] {
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'number' || isNaN(value)) {
      return false;
    }
  }
  return true;
}

export function isOptionalNumberArray(
  arg: unknown,
): arg is number[] | undefined {
  if (arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'number' || isNaN(value)) {
      return false;
    }
  }
  return true;
}

export function isNullableNumberArray(arg: unknown): arg is number[] | null {
  if (arg === null) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'number' || isNaN(value)) {
      return false;
    }
  }
  return true;
}

export function isNullishNumberArray(
  arg: unknown,
): arg is number[] | null | undefined {
  if (arg === null || arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'number' || isNaN(value)) {
      return false;
    }
  }
  return true;
}

// ---------------------------- Postive Number ----------------------------- //

export function isPositiveNumber(arg: unknown): arg is number {
  return typeof arg === 'number' && !isNaN(arg) && arg > 0;
}

export function isOptionalPositiveNumber(
  arg: unknown,
): arg is number | undefined {
  return (
    arg === undefined || (typeof arg === 'number' && !isNaN(arg) && arg > 0)
  );
}

export function isNullablePositiveNumber(arg: unknown): arg is number | null {
  return arg === null || (typeof arg === 'number' && !isNaN(arg) && arg > 0);
}

export function isNullishPositiveNumber(
  arg: unknown,
): arg is number | null | undefined {
  return (
    arg === null ||
    arg === undefined ||
    (typeof arg === 'number' && !isNaN(arg) && arg > 0)
  );
}

export function isPositiveNumberArray(arg: unknown): arg is number[] {
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'number' || isNaN(value) || value <= 0) {
      return false;
    }
  }
  return true;
}

export function isOptionalPositiveNumberArray(
  arg: unknown,
): arg is number[] | undefined {
  if (arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'number' || isNaN(value) || value <= 0) {
      return false;
    }
  }
  return true;
}

export function isNullablePositiveNumberArray(
  arg: unknown,
): arg is number[] | null {
  if (arg === null) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'number' || isNaN(value) || value <= 0) {
      return false;
    }
  }
  return true;
}

export function isNullishPositiveNumberArray(
  arg: unknown,
): arg is number[] | null | undefined {
  if (arg === null || arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'number' || isNaN(value) || value <= 0) {
      return false;
    }
  }
  return true;
}

// ---------------------------- Negative Number ---------------------------- //

export function isNegativeNumber(arg: unknown): arg is number {
  return typeof arg === 'number' && !isNaN(arg) && arg < 0;
}

export function isOptionalNegativeNumber(
  arg: unknown,
): arg is number | undefined {
  return (
    arg === undefined || (typeof arg === 'number' && !isNaN(arg) && arg < 0)
  );
}

export function isNullableNegativeNumber(arg: unknown): arg is number | null {
  return arg === null || (typeof arg === 'number' && !isNaN(arg) && arg < 0);
}

export function isNullishNegativeNumber(
  arg: unknown,
): arg is number | null | undefined {
  return (
    arg === null ||
    arg === undefined ||
    (typeof arg === 'number' && !isNaN(arg) && arg < 0)
  );
}

export function isNegativeNumberArray(arg: unknown): arg is number[] {
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'number' || isNaN(value) || value >= 0) {
      return false;
    }
  }
  return true;
}

export function isOptionalNegativeNumberArray(
  arg: unknown,
): arg is number[] | undefined {
  if (arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'number' || isNaN(value) || value >= 0) {
      return false;
    }
  }
  return true;
}

export function isNullableNegativeNumberArray(
  arg: unknown,
): arg is number[] | null {
  if (arg === null) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'number' || isNaN(value) || value >= 0) {
      return false;
    }
  }
  return true;
}

export function isNullishNegativeNumberArray(
  arg: unknown,
): arg is number[] | null | undefined {
  if (arg === null || arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'number' || isNaN(value) || value >= 0) {
      return false;
    }
  }
  return true;
}

// ---------------------------- Unsigned Number ---------------------------- //

export function isUnsignedNumber(arg: unknown): arg is number {
  return typeof arg === 'number' && !isNaN(arg) && arg >= 0;
}

export function isOptionalUnsignedNumber(
  arg: unknown,
): arg is number | undefined {
  return (
    arg === undefined || (typeof arg === 'number' && !isNaN(arg) && arg >= 0)
  );
}

export function isNullableUnsignedNumber(arg: unknown): arg is number | null {
  return arg === null || (typeof arg === 'number' && !isNaN(arg) && arg >= 0);
}

export function isNullishUnsignedNumber(
  arg: unknown,
): arg is number | null | undefined {
  return (
    arg === null ||
    arg === undefined ||
    (typeof arg === 'number' && !isNaN(arg) && arg >= 0)
  );
}

export function isUnsignedNumberArray(arg: unknown): arg is number[] {
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'number' || isNaN(value) || value < 0) {
      return false;
    }
  }
  return true;
}

export function isOptionalUnsignedNumberArray(
  arg: unknown,
): arg is number[] | undefined {
  if (arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'number' || isNaN(value) || value < 0) {
      return false;
    }
  }
  return true;
}

export function isNullableUnsignedNumberArray(
  arg: unknown,
): arg is number[] | null {
  if (arg === null) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'number' || isNaN(value) || value < 0) {
      return false;
    }
  }
  return true;
}

export function isNullishUnsignedNumberArray(
  arg: unknown,
): arg is number[] | null | undefined {
  if (arg === null || arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'number' || isNaN(value) || value < 0) {
      return false;
    }
  }
  return true;
}

// -------------------------------- Integer -------------------------------- //

export function isInteger(arg: unknown): arg is number {
  return Number.isInteger(arg);
}

export function isOptionalInteger(arg: unknown): arg is number | undefined {
  return arg === undefined || Number.isInteger(arg);
}

export function isNullableInteger(arg: unknown): arg is number | null {
  return arg === null || Number.isInteger(arg);
}

export function isNullishInteger(
  arg: unknown,
): arg is number | null | undefined {
  return arg === null || arg === undefined || Number.isInteger(arg);
}

export function isIntegerArray(arg: unknown): arg is number[] {
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (!Number.isInteger(value)) {
      return false;
    }
  }
  return true;
}

export function isOptionalIntegerArray(
  arg: unknown,
): arg is number[] | undefined {
  if (arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (!Number.isInteger(value)) {
      return false;
    }
  }
  return true;
}

export function isNullableIntegerArray(arg: unknown): arg is number[] | null {
  if (arg === null) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (!Number.isInteger(value)) {
      return false;
    }
  }
  return true;
}

export function isNullishIntegerArray(
  arg: unknown,
): arg is number[] | null | undefined {
  if (arg === null || arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (!Number.isInteger(value)) {
      return false;
    }
  }
  return true;
}

// ---------------------------- Postive Integer ---------------------------- //

export function isPositiveInteger(arg: unknown): arg is number {
  return Number.isInteger(arg) && (arg as number) > 0;
}

export function isOptionalPositiveInteger(
  arg: unknown,
): arg is number | undefined {
  return arg === undefined || (Number.isInteger(arg) && (arg as number) > 0);
}

export function isNullablePositiveInteger(arg: unknown): arg is number | null {
  return arg === null || (Number.isInteger(arg) && (arg as number) > 0);
}

export function isNullishPositiveInteger(
  arg: unknown,
): arg is number | null | undefined {
  return (
    arg === null ||
    arg === undefined ||
    (Number.isInteger(arg) && (arg as number) > 0)
  );
}

export function isPositiveIntegerArray(arg: unknown): arg is number[] {
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (!Number.isInteger(value) || (value as number) <= 0) {
      return false;
    }
  }
  return true;
}

export function isOptionalPositiveIntegerArray(
  arg: unknown,
): arg is number[] | undefined {
  if (arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (!Number.isInteger(value) || (value as number) <= 0) {
      return false;
    }
  }
  return true;
}

export function isNullablePositiveIntegerArray(
  arg: unknown,
): arg is number[] | null {
  if (arg === null) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (!Number.isInteger(value) || (value as number) <= 0) {
      return false;
    }
  }
  return true;
}

export function isNullishPositiveIntegerArray(
  arg: unknown,
): arg is number[] | null | undefined {
  if (arg === null || arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (!Number.isInteger(value) || (value as number) <= 0) {
      return false;
    }
  }
  return true;
}

// --------------------------- Negative Integer ---------------------------- //

export function isNegativeInteger(arg: unknown): arg is number {
  return Number.isInteger(arg) && (arg as number) < 0;
}

export function isOptionalNegativeInteger(
  arg: unknown,
): arg is number | undefined {
  return arg === undefined || (Number.isInteger(arg) && (arg as number) < 0);
}

export function isNullableNegativeInteger(arg: unknown): arg is number | null {
  return arg === null || (Number.isInteger(arg) && (arg as number) < 0);
}

export function isNullishNegativeInteger(
  arg: unknown,
): arg is number | null | undefined {
  return (
    arg === null ||
    arg === undefined ||
    (Number.isInteger(arg) && (arg as number) < 0)
  );
}

export function isNegativeIntegerArray(arg: unknown): arg is number[] {
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (!Number.isInteger(value) || (value as number) >= 0) {
      return false;
    }
  }
  return true;
}

export function isOptionalNegativeIntegerArray(
  arg: unknown,
): arg is number[] | undefined {
  if (arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (!Number.isInteger(value) || (value as number) >= 0) {
      return false;
    }
  }
  return true;
}

export function isNullableNegativeIntegerArray(
  arg: unknown,
): arg is number[] | null {
  if (arg === null) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (!Number.isInteger(value) || (value as number) >= 0) {
      return false;
    }
  }
  return true;
}

export function isNullishNegativeIntegerArray(
  arg: unknown,
): arg is number[] | null | undefined {
  if (arg === null || arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (!Number.isInteger(value) || (value as number) >= 0) {
      return false;
    }
  }
  return true;
}

// --------------------------- Unsigned Integer ---------------------------- //

export function isUnsignedInteger(arg: unknown): arg is number {
  return Number.isInteger(arg) && (arg as number) >= 0;
}

export function isOptionalUnsignedInteger(
  arg: unknown,
): arg is number | undefined {
  return arg === undefined || (Number.isInteger(arg) && (arg as number) >= 0);
}

export function isNullableUnsignedInteger(arg: unknown): arg is number | null {
  return arg === null || (Number.isInteger(arg) && (arg as number) >= 0);
}

export function isNullishUnsignedInteger(
  arg: unknown,
): arg is number | null | undefined {
  return (
    arg === null ||
    arg === undefined ||
    (Number.isInteger(arg) && (arg as number) >= 0)
  );
}

export function isUnsignedIntegerArray(arg: unknown): arg is number[] {
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (!Number.isInteger(value) || (value as number) < 0) {
      return false;
    }
  }
  return true;
}

export function isOptionalUnsignedIntegerArray(
  arg: unknown,
): arg is number[] | undefined {
  if (arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (!Number.isInteger(value) || (value as number) < 0) {
      return false;
    }
  }
  return true;
}

export function isNullableUnsignedIntegerArray(
  arg: unknown,
): arg is number[] | null {
  if (arg === null) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (!Number.isInteger(value) || (value as number) < 0) {
      return false;
    }
  }
  return true;
}

export function isNullishUnsignedIntegerArray(
  arg: unknown,
): arg is number[] | null | undefined {
  if (arg === null || arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (!Number.isInteger(value) || (value as number) < 0) {
      return false;
    }
  }
  return true;
}

// -------------------------------- BigInt --------------------------------- //

export function isBigInt(arg: unknown): arg is bigint {
  return typeof arg === 'bigint';
}

export function isOptionalBigInt(arg: unknown): arg is bigint | undefined {
  return arg === undefined || typeof arg === 'bigint';
}

export function isNullableBigInt(arg: unknown): arg is bigint | null {
  return arg === null || typeof arg === 'bigint';
}

export function isNullishBigInt(
  arg: unknown,
): arg is bigint | null | undefined {
  return arg === null || arg === undefined || typeof arg === 'bigint';
}

export function isBigIntArray(arg: unknown): arg is bigint[] {
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'bigint') {
      return false;
    }
  }
  return true;
}

export function isOptionalBigIntArray(
  arg: unknown,
): arg is bigint[] | undefined {
  if (arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'bigint') {
      return false;
    }
  }
  return true;
}

export function isNullableBigIntArray(arg: unknown): arg is bigint[] | null {
  if (arg === null) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'bigint') {
      return false;
    }
  }
  return true;
}

export function isNullishBigIntArr(
  arg: unknown,
): arg is bigint[] | null | undefined {
  if (arg === null || arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'bigint') {
      return false;
    }
  }
  return true;
}

// ------ Valid number (is it still a number after doing Number(arg)) ------ //

export function isValidNumber(arg: unknown): arg is string | number | boolean {
  const casted = Number(arg);
  return !isNaN(casted);
}

export function isOptionalValidNumber(
  arg: unknown,
): arg is string | number | boolean | undefined {
  if (arg === undefined) {
    return true;
  }
  const casted = Number(arg);
  return !isNaN(casted);
}

export function isNullableValidNumber(
  arg: unknown,
): arg is string | number | boolean | null {
  if (arg === null) {
    return true;
  }
  const casted = Number(arg);
  return !isNaN(casted);
}

export function isNullishValidNumber(
  arg: unknown,
): arg is string | number | boolean | null | undefined {
  if (arg === null || arg === undefined) {
    return true;
  }
  const casted = Number(arg);
  return !isNaN(casted);
}

export function isValidNumberArray(
  arg: unknown,
): arg is Array<string | number | boolean> {
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    const casted = Number(value);
    if (isNaN(casted)) {
      return false;
    }
  }
  return true;
}

export function isOptionalValidNumberArray(
  arg: unknown,
): arg is Array<string | number | boolean> | undefined {
  if (arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    const casted = Number(value);
    if (isNaN(casted)) {
      return false;
    }
  }
  return true;
}

export function isNullableValidNumberArray(
  arg: unknown,
): arg is Array<string | number | boolean> | null {
  if (arg === null) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    const casted = Number(value);
    if (isNaN(casted)) {
      return false;
    }
  }
  return true;
}

export function isNishValidNumArr(
  arg: unknown,
): arg is Array<string | number | boolean> | null | undefined {
  if (arg === null || arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    const casted = Number(value);
    if (isNaN(casted)) {
      return false;
    }
  }
  return true;
}

// -------------------------------- String --------------------------------- //

export function isString(arg: unknown): arg is string {
  return typeof arg === 'string';
}

export function isOptionalString(arg: unknown): arg is string | undefined {
  return arg === undefined || typeof arg === 'string';
}

export function isNullableString(arg: unknown): arg is string | null {
  return arg === null || typeof arg === 'string';
}

export function isNullishString(
  arg: unknown,
): arg is string | null | undefined {
  return arg === null || arg === undefined || typeof arg === 'string';
}

export function isStringArray(arg: unknown): arg is string[] {
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'string') {
      return false;
    }
  }
  return true;
}

export function isOptionalStringArray(
  arg: unknown,
): arg is string[] | undefined {
  if (arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'string') {
      return false;
    }
  }
  return true;
}

export function isNullableStringArray(arg: unknown): arg is string[] | null {
  if (arg === null) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'string') {
      return false;
    }
  }
  return true;
}

export function isNullishStringArray(
  arg: unknown,
): arg is string[] | null | undefined {
  if (arg === null || arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'string') {
      return false;
    }
  }
  return true;
}

// ---------------------- NeStr => "Non-Empty String" ---------------------- //

export function isNonEmptyString(arg: unknown): arg is string {
  return typeof arg === 'string' && (arg as string).length > 0;
}

export function isOptionalNonEmptyString(
  arg: unknown,
): arg is string | undefined {
  return arg === undefined || (typeof arg === 'string' && arg.length > 0);
}

export function isNullableNonEmptyString(arg: unknown): arg is string | null {
  return arg === null || (typeof arg === 'string' && arg.length > 0);
}

export function isNullishNonEmptyString(
  arg: unknown,
): arg is string | null | undefined {
  return (
    arg === null ||
    arg === undefined ||
    (typeof arg === 'string' && arg.length > 0)
  );
}

export function isNonEmptyStringArray(arg: unknown): arg is string[] {
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'string' || value.length === 0) {
      return false;
    }
  }
  return true;
}

export function isOptionalNonEmptyStringArray(
  arg: unknown,
): arg is string[] | undefined {
  if (arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'string' || value.length === 0) {
      return false;
    }
  }
  return true;
}

export function isNullableNonEmptyStringArray(
  arg: unknown,
): arg is string[] | null {
  if (arg === null) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'string' || value.length === 0) {
      return false;
    }
  }
  return true;
}

export function isNullishNonEmptyStringArray(
  arg: unknown,
): arg is string[] | null | undefined {
  if (arg === null || arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'string' || value.length === 0) {
      return false;
    }
  }
  return true;
}

// -------------------------------- Symbol --------------------------------- //

export function isSymbol(arg: unknown): arg is symbol {
  return typeof arg === 'symbol';
}

export function isOptionalSymbol(arg: unknown): arg is symbol | undefined {
  return arg === undefined || typeof arg === 'symbol';
}

export function isNullableSymbol(arg: unknown): arg is symbol | null {
  return arg === null || typeof arg === 'symbol';
}

export function isNullishSymbol(
  arg: unknown,
): arg is symbol | null | undefined {
  return arg === null || arg === undefined || typeof arg === 'symbol';
}

export function isSymbolArray(arg: unknown): arg is symbol[] {
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'symbol') {
      return false;
    }
  }
  return true;
}

export function isOptionalSymbolArray(
  arg: unknown,
): arg is symbol[] | undefined {
  if (arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'symbol') {
      return false;
    }
  }
  return true;
}

export function isNullableSymbolArray(arg: unknown): arg is symbol[] | null {
  if (arg === null) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'symbol') {
      return false;
    }
  }
  return true;
}

export function isNullishSymbolArray(
  arg: unknown,
): arg is symbol[] | null | undefined {
  if (arg === null || arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'symbol') {
      return false;
    }
  }
  return true;
}

// --------------------------------- Date ---------------------------------- //

export function isDate(arg: unknown): arg is Date {
  return arg instanceof Date && !isNaN(arg.getTime());
}

export function isOptionalDate(arg: unknown): arg is Date | undefined {
  return arg === undefined || (arg instanceof Date && !isNaN(arg.getTime()));
}

export function isNullableDate(arg: unknown): arg is Date | null {
  return arg === null || (arg instanceof Date && !isNaN(arg.getTime()));
}

export function isNullishDate(arg: unknown): arg is Date | null | undefined {
  return (
    arg === null ||
    arg === undefined ||
    (arg instanceof Date && !isNaN(arg.getTime()))
  );
}

export function isDateArray(arg: unknown): arg is Date[] {
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      return false;
    }
  }
  return true;
}

export function isOptionalDateArray(arg: unknown): arg is Date[] | undefined {
  if (arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      return false;
    }
  }
  return true;
}

export function isNullableDateArray(arg: unknown): arg is Date[] | null {
  if (arg === null) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      return false;
    }
  }
  return true;
}

export function isNullishDateArray(
  arg: unknown,
): arg is Date[] | null | undefined {
  if (arg === null || arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      return false;
    }
  }
  return true;
}

// ----------------------------- Is valid date ----------------------------- //

export function isValidDate(arg: unknown): arg is Date | string | number {
  const isStringType = typeof arg === 'string';
  const isNumberType = typeof arg === 'number' && !isNaN(arg);
  const isDateType = arg instanceof Date;
  if (!isStringType && !isNumberType && !isDateType) {
    return false;
  }
  const value = new Date(arg);
  return !isNaN(value.getTime());
}

export function isOptionalValidDate(
  arg: unknown,
): arg is Date | string | number | undefined {
  if (arg === undefined) {
    return true;
  }
  const isStringType = typeof arg === 'string';
  const isNumberType = typeof arg === 'number' && !isNaN(arg);
  const isDateType = arg instanceof Date;
  if (!isStringType && !isNumberType && !isDateType) {
    return false;
  }
  const value = new Date(arg);
  return !isNaN(value.getTime());
}

export function isNullableValidDate(
  arg: unknown,
): arg is Date | string | number | null {
  if (arg === null) {
    return true;
  }
  const isStringType = typeof arg === 'string';
  const isNumberType = typeof arg === 'number' && !isNaN(arg);
  const isDateType = arg instanceof Date;
  if (!isStringType && !isNumberType && !isDateType) {
    return false;
  }
  const value = new Date(arg);
  return !isNaN(value.getTime());
}

export function isNullishValidDate(
  arg: unknown,
): arg is Date | string | number | null | undefined {
  if (arg === null || arg === undefined) {
    return true;
  }
  const isStringType = typeof arg === 'string';
  const isNumberType = typeof arg === 'number' && !isNaN(arg);
  const isDateType = arg instanceof Date;
  if (!isStringType && !isNumberType && !isDateType) {
    return false;
  }
  const value = new Date(arg);
  return !isNaN(value.getTime());
}

export function isValidDateArray(
  arg: unknown,
): arg is Array<Date | string | number> {
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    const isStringType = typeof value === 'string';
    const isNumberType = typeof value === 'number' && !isNaN(value);
    const isDateType = value instanceof Date;
    if (!isStringType && !isNumberType && !isDateType) {
      return false;
    }
    const parsed = new Date(value as Date | string | number);
    if (isNaN(parsed.getTime())) {
      return false;
    }
  }
  return true;
}

export function isOptionalValidDateArray(
  arg: unknown,
): arg is Array<Date | string | number> | undefined {
  if (arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    const isStringType = typeof value === 'string';
    const isNumberType = typeof value === 'number' && !isNaN(value);
    const isDateType = value instanceof Date;
    if (!isStringType && !isNumberType && !isDateType) {
      return false;
    }
    const parsed = new Date(value as Date | string | number);
    if (isNaN(parsed.getTime())) {
      return false;
    }
  }
  return true;
}

export function isNullableValidDateArray(
  arg: unknown,
): arg is Array<Date | string | number> | null {
  if (arg === null) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    const isStringType = typeof value === 'string';
    const isNumberType = typeof value === 'number' && !isNaN(value);
    const isDateType = value instanceof Date;
    if (!isStringType && !isNumberType && !isDateType) {
      return false;
    }
    const parsed = new Date(value as Date | string | number);
    if (isNaN(parsed.getTime())) {
      return false;
    }
  }
  return true;
}

export function isNullishValidDateArray(
  arg: unknown,
): arg is Array<Date | string | number> | null | undefined {
  if (arg === null || arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    const isStringType = typeof value === 'string';
    const isNumberType = typeof value === 'number' && !isNaN(value);
    const isDateType = value instanceof Date;
    if (!isStringType && !isNumberType && !isDateType) {
      return false;
    }
    const parsed = new Date(value as Date | string | number);
    if (isNaN(parsed.getTime())) {
      return false;
    }
  }
  return true;
}

// -------------------------------- Object --------------------------------- //

export function isObject(arg: unknown): arg is NonNullable<object> {
  return arg !== null && typeof arg === 'object';
}

export function isOptionalObject(
  arg: unknown,
): arg is NonNullable<object> | undefined {
  return arg === undefined || (arg !== null && typeof arg === 'object');
}

export function isNullableObject(
  arg: unknown,
): arg is NonNullable<object> | null {
  return arg === null || (arg !== null && typeof arg === 'object');
}

export function isNullishObject(
  arg: unknown,
): arg is NonNullable<object> | null | undefined {
  return (
    arg === null ||
    arg === undefined ||
    (arg !== null && typeof arg === 'object')
  );
}

export function isObjectArray(arg: unknown): arg is NonNullable<object>[] {
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (value === null || typeof value !== 'object') {
      return false;
    }
  }
  return true;
}

export function isOptionalObjectArray(
  arg: unknown,
): arg is NonNullable<object>[] | undefined {
  if (arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (value === null || typeof value !== 'object') {
      return false;
    }
  }
  return true;
}

export function isNullableObjectArray(
  arg: unknown,
): arg is NonNullable<object>[] | null {
  if (arg === null) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (value === null || typeof value !== 'object') {
      return false;
    }
  }
  return true;
}

export function isNullishObjectArray(
  arg: unknown,
): arg is NonNullable<object>[] | null | undefined {
  if (arg === null || arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (value === null || typeof value !== 'object') {
      return false;
    }
  }
  return true;
}

// ----------------------------- Plain Object ------------------------------ //

const objectProto = Object.prototype;
const CANNOT_CAST_TO_PLAIN_OBJECT_ERROR = (value: string) =>
  'Only objects which are a prototype of Object may be cast to the ' +
  'PlainObject type. Type was ' +
  value;

export type PlainObject = Record<string, unknown>;

export function isPlainObject(arg: unknown): arg is PlainObject {
  if (arg === null || typeof arg !== 'object') {
    return false;
  }
  const proto = Object.getPrototypeOf(arg);
  return proto === objectProto || proto === null;
}

export function isOptionalPlainObject(
  arg: unknown,
): arg is PlainObject | undefined {
  if (arg === undefined) {
    return true;
  }
  if (arg === null || typeof arg !== 'object') {
    return false;
  }
  const proto = Object.getPrototypeOf(arg);
  return proto === objectProto || proto === null;
}

export function isNullablePlainObject(arg: unknown): arg is PlainObject | null {
  if (arg === null) {
    return true;
  }
  if (arg === null || typeof arg !== 'object') {
    return false;
  }
  const proto = Object.getPrototypeOf(arg);
  return proto === objectProto || proto === null;
}

export function isNullishPlainObject(
  arg: unknown,
): arg is PlainObject | null | undefined {
  if (arg === null || arg === undefined) {
    return true;
  }
  if (arg === null || typeof arg !== 'object') {
    return false;
  }
  const proto = Object.getPrototypeOf(arg);
  return proto === objectProto || proto === null;
}

export function isPlainObjectArray(arg: unknown): arg is PlainObject[] {
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (value === null || typeof value !== 'object') {
      return false;
    }
    const proto = Object.getPrototypeOf(value);
    if (!(proto === objectProto || proto === null)) {
      return false;
    }
  }
  return true;
}

export function isOptionalPlainObjectArray(
  arg: unknown,
): arg is PlainObject[] | undefined {
  if (arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (value === null || typeof value !== 'object') {
      return false;
    }
    const proto = Object.getPrototypeOf(value);
    if (!(proto === objectProto || proto === null)) {
      return false;
    }
  }
  return true;
}

export function isNullablePlainObjectArray(
  arg: unknown,
): arg is PlainObject[] | null {
  if (arg === null) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (value === null || typeof value !== 'object') {
      return false;
    }
    const proto = Object.getPrototypeOf(value);
    if (!(proto === objectProto || proto === null)) {
      return false;
    }
  }
  return true;
}

export function isNullishPlainObjectArray(
  arg: unknown,
): arg is PlainObject[] | null | undefined {
  if (arg === null || arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (value === null || typeof value !== 'object') {
      return false;
    }
    const proto = Object.getPrototypeOf(value);
    if (!(proto === objectProto || proto === null)) {
      return false;
    }
  }
  return true;
}

/**
 * Helper to set the type to a PlainObject.
 */
export function toPlainObject<T extends object>(
  obj: ResolvePlainObject<T> extends true ? T : never,
): PlainObject {
  if (isPlainObject(obj)) {
    return { ...obj } as PlainObject;
  } else {
    const type = Object.prototype.toString.call(obj).slice(8, -1),
      err = CANNOT_CAST_TO_PLAIN_OBJECT_ERROR(type);
    throw new Error(err);
  }
}

// ------------------------------- Function -------------------------------- //

export function isFunction(arg: unknown): arg is AnyFunction {
  return typeof arg === 'function';
}

export function isOptionalFunction(
  arg: unknown,
): arg is AnyFunction | undefined {
  return arg === undefined || typeof arg === 'function';
}

export function isNullableFunction(arg: unknown): arg is AnyFunction | null {
  return arg === null || typeof arg === 'function';
}

export function isNullishFunction(
  arg: unknown,
): arg is AnyFunction | null | undefined {
  return arg === null || arg === undefined || typeof arg === 'function';
}

export function isFunctionArray(arg: unknown): arg is AnyFunction[] {
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'function') {
      return false;
    }
  }
  return true;
}

export function isOptionalFunctionArray(
  arg: unknown,
): arg is AnyFunction[] | undefined {
  if (arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'function') {
      return false;
    }
  }
  return true;
}

export function isNullableFunctionArray(
  arg: unknown,
): arg is AnyFunction[] | null {
  if (arg === null) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'function') {
      return false;
    }
  }
  return true;
}

export function isNullishFunctionArray(
  arg: unknown,
): arg is AnyFunction[] | null | undefined {
  if (arg === null || arg === undefined) {
    return true;
  }
  if (!Array.isArray(arg)) {
    return false;
  }
  for (let i = 0; i < arg.length; i += 1) {
    const value = arg[i];
    if (typeof value !== 'function') {
      return false;
    }
  }
  return true;
}

// ------------------------------- hasKey ---------------------------------- //

type Validator = (value: unknown) => value is unknown;

/**
 * Runtime + type-safe key existence + validation check
 */
export function hasKey<
  K extends string,
  V extends Validator | undefined = undefined,
>(
  arg: unknown,
  key: K,
  validatorFn?: V,
): arg is Record<K, V extends (v: unknown) => v is infer R ? R : unknown> {
  if (typeof arg !== 'object' || arg === null || !(key in arg)) {
    return false;
  }
  if (!!validatorFn) {
    return validatorFn((arg as PlainObject)[key]);
  }
  return true;
}
