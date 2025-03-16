/* eslint-disable max-len */
import { isNull, isNumber, isObject, isRecord, isString, isUndef, isValidNumber } from './basic';
import { orNullable, orOptional } from './common';

// Add modifiers
type AddNull<T, N> = (N extends true ? T | null : T);
type AddNullables<T, O, N> = (O extends true ? AddNull<T, N> | undefined  : AddNull<T, N>);
type AddMods<T, O, N, A> = A extends true ? AddNullables<T[], O, N> : AddNullables<T, O, N>;


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

type TRangeParam = number | [number] | [];
type TRangeFn = (arg: number) => boolean;

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
  Ret = AddMods<number | string, O, N, A>,
>(
  optional: boolean,
  nullable: boolean,
  isArr: boolean,
): (min: TRangeParam, max: TRangeParam) => ((arg: unknown) => arg is Ret) {
  return (min: TRangeParam, max: TRangeParam): ((arg: unknown) => arg is Ret) => {
    const rangeFn = _initRangeFn(min, max);
    return (arg: unknown): arg is Ret => {
      if (arg === undefined) {
        return optional;
      }
      if (arg === null) {
        return nullable;
      }
      if (isArr) {
        return Array.isArray(arg) && !arg.some(item => !_isInRangeHelper(item, rangeFn));
      }
      return _isInRangeHelper(arg, rangeFn);
    };
  };
}

/**
 * Core logic for is array function.
 */
function _isInRangeHelper(arg: unknown, rangeFn: TRangeFn): boolean {
  if (isString(arg)) {
    if (isValidNumber(arg)) {
      arg = Number(arg);
    } else {
      return false;
    }
  }
  if (!isNumber(arg)) {
    return false;
  }
  return rangeFn(arg);
}

/**
 * Initialize inRange function.
 */
function _initRangeFn(min: TRangeParam, max: TRangeParam): TRangeFn {
  // arg >= min && arg <= max
  if (Array.isArray(min) && min.length === 1 && Array.isArray(max) && max.length === 1) {
    return ((arg: number) => arg >= min[0] && arg <= max[0]);
  // arg >= min
  } else if (Array.isArray(min) && min.length === 1 && Array.isArray(max) && max.length === 0) {
    return ((arg: number) => arg >= min[0]);
  // arg > min
  } else if (!Array.isArray(min) && Array.isArray(max) && max.length === 0) {
    return ((arg: number) => arg > min);
  // arg >= min && arg < max
  } else if (Array.isArray(min) && min.length === 1 && !Array.isArray(max)) {
    return ((arg: number) => arg >= min[0] && arg < max);
  // arg <= max
  } else if (Array.isArray(min) && min.length === 0 && Array.isArray(max) && max.length === 1) {
    return ((arg: number) => arg <= max[0]);
  // arg < max
  } else if (Array.isArray(min) && min.length === 0 && !Array.isArray(max)) {
    return ((arg: number) => arg < max);
  // arg > min && arg <= max
  } else if (!Array.isArray(min) && Array.isArray(max) && max.length === 1) {
    return ((arg: number) => arg > min && arg <= max[0]);
  // arg > min && arg < max
  } else if (!Array.isArray(min) && !Array.isArray(max)) {
    return ((arg: number) => arg > min && arg < max);
  }
  // Shouldn't reach this point.
  throw new Error('min and max must be number, [number], or []');
}  


// **** Is string a key of an object **** //

export const isKeyOf = <T extends object>(arg: T) => 
  _isKeyOf<T, false, false, false>(arg, false, false, false);
export const isOptionalKeyOf = <T extends object>(arg: T) => 
  _isKeyOf<T, true, false, false>(arg, true, false, false);
export const isNullableKeyOf = <T extends object>(arg: T) => 
  _isKeyOf<T, false, true, false>(arg, false, true, false);
export const isNullishKeyOf = <T extends object>(arg: T) => 
  _isKeyOf<T, true, true, false>(arg, true, true, false);
export const isKeyOfArray = <T extends object>(arg: T) => 
  _isKeyOf<T, false, false, true>(arg, false, false, true);
export const isOptionalKeyOfArray = <T extends object>(arg: T) => 
  _isKeyOf<T, true, false, true>(arg, true, false, true);
export const isNullableKeyOfArray = <T extends object>(arg: T) => 
  _isKeyOf<T, false, true, true>(arg, false, true, true);
export const isNullishKeyOfArray = <T extends object>(arg: T) => 
  _isKeyOf<T, true, true, true>(arg, true, true, true);

/**
 * See if something is a key of an object.
 */
function _isKeyOf<
  T extends object,
  O extends boolean,
  N extends boolean,
  A extends boolean,
  Ret = AddMods<keyof T, O, N, A>,
>(
  obj: object,
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


// **** Is value an Enum **** //

export type TEnum = Record<string, string | number>;
export const isEnum = _isEnum;
export const isOptionalEnum = orOptional(_isEnum);
export const isNullableEnum = orNullable(_isEnum);
export const isNullishEnum = orNullable(isOptionalEnum);

/**
 * Check if unknown is a valid enum object.
 * NOTE: this does not work for mixed enums see: "eslint@typescript-eslint/no-mixed-enums"
 */
function _isEnum(arg: unknown): arg is TEnum {
  // Check is non-array object
  if (!isRecord(arg)) {
    return false;
  }
  // Check if string or number enum
  const keys = Object.keys(arg),
    middle = Math.floor(keys.length / 2);
  // ** String Enum ** //
  if (!isNumber(arg[keys[middle]])) {
    const entries = Object.entries(arg);
    for (const entry of entries) {
      if (!(isString(entry[0]) && isString(entry[1]))) {
        return false;
      }
    }
    return true;
  }
  // ** Number Enum ** //
  // Enum key length will always be even
  if (keys.length % 2 !== 0) {
    return false;
  }
  // Check key/values
  for (let i = 0; i < middle; i++) {
    const thisKey = keys[i],
      thisVal = arg[thisKey],
      thatKey = keys[i + middle],
      thatVal = arg[thatKey];
    if (!(thisVal === thatKey && thisKey === String(thatVal))) {
      return false;
    }
  }
  // Return
  return true;
}


// **** Is argument an Enum Value **** //

export const isEnumVal = <T>(arg: T) => _isEnumVal<T, false, false, false>(arg, false, false, false);
export const isOptionalEnumVal = <T>(arg: T) => _isEnumVal<T, true, false, false>(arg, true, false, false);
export const isNullableEnumVal = <T>(arg: T) => _isEnumVal<T, false, true, false>(arg, false, true, false);
export const isNullishEnumVal = <T>(arg: T) => _isEnumVal<T, true, true, false>(arg, true, true, false);
export const isEnumValArray = <T>(arg: T) => _isEnumVal<T, false, false, true>(arg, false, false, true);
export const isOptionalEnumValArray = <T>(arg: T) => _isEnumVal<T, true, false, true>(arg, true, false, true);
export const isNullableEnumValArray = <T>(arg: T) => _isEnumVal<T, false, true, true>(arg, false, true, true);
export const isNullishEnumValArray = <T>(arg: T) => _isEnumVal<T, true, true, true>(arg, true, true, true);


/**
 * Check is value satisfies enum.
 */
function _isEnumVal<T, 
  O extends boolean,
  N extends boolean,
  A extends boolean,
>(
  enumArg: T,
  optional: O,
  nullable: N,
  isArray: A,
): ((arg: unknown) => arg is AddMods<T[keyof T], O, N, A>) {
  // Check is enum
  if (!isEnum(enumArg)) {
    throw Error('Item to check from must be an enum.');
  }
  // Get enum vals
  let enumVals = Object.keys(enumArg).reduce((arr: unknown[], key) => {
    if (!arr.includes(key)) {
      arr.push(enumArg[key]);
    }
    return arr;
  }, []);
  // Check if string or number enum
  if (isNumber(enumArg[enumVals[0] as string])) {
    enumVals = enumVals.map(item => enumArg[item as string]);
  }
  const test = (arg: unknown) => enumVals.some(val => arg === val);
  // Return validator function
  return (arg: unknown): arg is AddMods<T[keyof T], O, N, A> => {
    if (isUndef(arg)) {
      return !!optional;
    }
    if (isNull(arg)) {
      return !!nullable;
    }
    if (isArray) {
      if (!Array.isArray(arg)) {
        return false;
      }
      for (const item of arg) {
        if (!test(item)) {
          return false;
        }
      }
      return true;
    }
    return test(arg);
  };
}
