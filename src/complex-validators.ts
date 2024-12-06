import { isEnum, isNull, isNumber, isObject, isUndef } from './basic';
import { AddMods, AddNullables } from './common';


// **** Is in Array **** //

export const isInArray = <T extends readonly unknown[]>(arg: T) => 
  _isInArray<T, false, false>(arg, false, false);
export const isOptionalInArray = <T extends readonly unknown[]>(arg: T) => 
  _isInArray<T, true, false>(arg, true, false);
export const isNullableInArray = <T extends readonly unknown[]>(arg: T) => 
  _isInArray<T, false, true>(arg, false, true);
export const isNullishInArray = <T extends readonly unknown[]>(arg: T) => 
  _isInArray<T, true, true>(arg, true, true);

/**
 * Is an item in an array.
 */
export function _isInArray<
  T extends readonly unknown[],
  O extends boolean,
  N extends boolean 
>(
  arr: T,
  optional: O,
  nullable: N,
): (arg: unknown) => arg is AddNullables<T[number], O, N> {
  return (arg: unknown): arg is AddNullables<T[number], O, N> => {
    if (isUndef(arg)) {
      return !!optional;
    }
    if (isNull(arg)) {
      return !!nullable;
    }
    for (const item of arr) {
      if (arg === item) {
        return true;
      }
    }
    return false;
  };
}


// **** In Range **** //

export const isInRange = _isInRange<false, false, false>(false, false, false);
export const isOptionalInRange = _isInRange<true, false, false>(true, false, false);
export const isNullableInRange = _isInRange<false, true, false>(false, true, false);
export const isNullishInRange = _isInRange<true, true, false>(true, true, false);
export const isInRangeArray = _isInRange<false, false, true>(false, false, true);
export const isOptionalInRangeArray = _isInRange<true, false, true>(true, false, true);
export const isNullableInRangeArray = _isInRange<false, true, true>(false, true, true);
export const isNullishInRangeArray = _isInRange<true, true, true>(true, true, true);

/**
 * Range will always determine if a number is >= the min and <= the max. If you want to 
 * leave off a range, just use null. 
 * 
 * Examples:
 * isRange(0, null) => "0 or any positive number"
 * isRange(100, null) => "greater than or equal to 100"
 * isRange(25, 75) => "between 25 and 75"
 */
function _isInRange<
  O extends boolean,
  N extends boolean,
  A extends boolean,
  Ret = AddMods<number, O, N, A>,
>(
  optional: boolean,
  nullable: boolean,
  isArr: boolean,
): (min: number | null, max: number | null) => ((arg: unknown) => arg is Ret) {
  return (min: number | null, max: number | null): ((arg: unknown) => arg is Ret) => {
    return (arg: unknown): arg is Ret => {
      if (arg === undefined) {
        return optional;
      }
      if (arg === null) {
        return nullable;
      }
      if (isArr) {
        return Array.isArray(arg) && !arg.some(item => !_isInRangeHelper(item, min, max));
      }
      return _isInRangeHelper(arg, min, max);
    };
  };
}

/**
 * Core logic for is array function.
 */
function _isInRangeHelper(arg: unknown, min: number | null, max: number | null): boolean {
  if (!isNumber(arg)) {
    return false;
  }
  if (min !== null && arg < min) {
    return false;
  }
  if (max !== null && arg > max) {
    return false;
  }
  return true;
}


// **** Is string a key of an object **** //

type TBasicObj = Record<string, unknown>;

export const isKeyOf = <T extends TBasicObj>(arg: T) => 
  _isKeyOf<T, false, false, false>(arg, false, false, false);
export const isOptionalKeyOf = <T extends TBasicObj>(arg: T) => 
  _isKeyOf<T, true, false, false>(arg, true, false, false);
export const isNullableKeyOf = <T extends TBasicObj>(arg: T) => 
  _isKeyOf<T, false, true, false>(arg, false, true, false);
export const isNullishKeyOf = <T extends TBasicObj>(arg: T) => 
  _isKeyOf<T, true, true, false>(arg, true, true, false);
export const isKeyOfArray = <T extends TBasicObj>(arg: T) => 
  _isKeyOf<T, false, false, true>(arg, false, false, true);
export const isOptionalKeyOfArray = <T extends TBasicObj>(arg: T) => 
  _isKeyOf<T, true, false, true>(arg, true, false, true);
export const isNullableKeyOfArray = <T extends TBasicObj>(arg: T) => 
  _isKeyOf<T, false, true, true>(arg, false, true, true);
export const isNullishKeyOfArray = <T extends TBasicObj>(arg: T) => 
  _isKeyOf<T, true, true, true>(arg, true, true, true);

/**
 * See if something is a key of an object.
 */
function _isKeyOf<
  T extends Record<string, unknown>,
  O extends boolean,
  N extends boolean,
  A extends boolean,
  Ret = AddMods<keyof T, O, N, A>,
>(
  obj: Record<string, unknown>,
  optional: boolean,
  nullable: boolean,
  isArr: boolean,
): ((arg: unknown) => arg is Ret) {
  if (!isObject(obj)) {
    throw new Error('Item to check from must be a Record<string, unknown>.');
  }
  const isInKeys = isInArray(Object.keys(obj));
  return (arg: unknown): arg is Ret => {
    if (arg === undefined) {
      return optional;
    }
    if (arg === null) {
      return nullable;
    }
    if (isArr) {
      return Array.isArray(arg) && !arg.some(item => !isInKeys(item));
    }
    return isInKeys(arg);
  };
}


// **** Is argument an Enum Value **** //

export const isEnumVal = <T>(arg: T) => _isEnumVal<T, false, false>(arg, false, false);
export const isOptionalEnumVal = <T>(arg: T) => _isEnumVal<T, true, false>(arg, true, false);
export const isNullableEnumVal = <T>(arg: T) => _isEnumVal<T, false, true>(arg, false, true);
export const isNullishEnumVal = <T>(arg: T) => _isEnumVal<T, true, true>(arg, true, true);

/**
 * Check is value satisfies enum.
 */
function _isEnumVal<T, 
  O extends boolean,
  N extends boolean
>(
  enumArg: T,
  optional: O,
  nullable: N,
): ((arg: unknown) => arg is AddNullables<T[keyof T], O, N>) {
  // Check is enum
  if (!isEnum(enumArg)) {
    throw Error('Item to check from must be an enum.');
  }
  // Get keys
  let resp = Object.keys(enumArg).reduce((arr: unknown[], key) => {
    if (!arr.includes(key)) {
      arr.push(enumArg[key]);
    }
    return arr;
  }, []);
  // Check if string or number enum
  if (isNumber(enumArg[resp[0] as string])) {
    resp = resp.map(item => enumArg[item as string]);
  }
  // Return validator function
  return (arg: unknown): arg is AddNullables<T[keyof T], O, N> => {
    if (isUndef(arg)) {
      return !!optional;
    }
    if (isNull(arg)) {
      return !!nullable;
    }
    return resp.some(val => arg === val);
  };
}
