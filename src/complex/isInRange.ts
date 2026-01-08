import { markSafe } from '../utils/parseObject/mark-safe.js';

import type { ResolveMods } from './common.js';

/******************************************************************************
                              Types/Variants
******************************************************************************/

type CollpaseType<T> = T extends unknown ? T : never;

type RangeParam = number | [number] | [];
type isInRangeFn = (arg: number) => boolean;
type RangeBound = {
  value: number;
  inclusive: boolean;
};

export function isInRange(min: RangeParam, max: RangeParam) {
  return isInRangeHelper<false, false, false>(false, false, false, min, max);
}
export function isOptionalInRange(min: RangeParam, max: RangeParam) {
  return isInRangeHelper<true, false, false>(true, false, false, min, max);
}
export function isNullableInRange(min: RangeParam, max: RangeParam) {
  return isInRangeHelper<false, true, false>(false, true, false, min, max);
}
export function isNullishInRange(min: RangeParam, max: RangeParam) {
  return isInRangeHelper<true, true, false>(true, true, false, min, max);
}
export function isInRangeArray(min: RangeParam, max: RangeParam) {
  return isInRangeHelper<false, false, true>(false, false, true, min, max);
}
export function isOptionalInRangeArray(min: RangeParam, max: RangeParam) {
  return isInRangeHelper<true, false, true>(true, false, true, min, max);
}
export function isNullableInRangeArray(min: RangeParam, max: RangeParam) {
  return isInRangeHelper<false, true, true>(false, true, true, min, max);
}
export function isNullishInRangeArray(min: RangeParam, max: RangeParam) {
  return isInRangeHelper<true, true, true>(true, true, true, min, max);
}

/******************************************************************************
                                 Core Logic
******************************************************************************/

/**
 * Range will always determine if a number is >= the min and <= the max.
 */
function isInRangeHelper<
  O extends boolean,
  N extends boolean,
  A extends boolean,
  Ret = CollpaseType<ResolveMods<number | string, O, N, A>>,
>(
  optional: boolean,
  nullable: boolean,
  isArr: boolean,
  min: RangeParam,
  max: RangeParam,
): (arg: unknown) => arg is Ret {
  const rangeFn = setupIsInRangeInternalFn(min, max);
  const validator = (arg: unknown): arg is Ret => {
    if (arg === undefined) {
      return optional;
    }
    if (arg === null) {
      return nullable;
    }
    if (isArr) {
      if (!Array.isArray(arg)) {
        return false;
      }
      for (let i = 0; i < arg.length; i += 1) {
        if (!isInRangeCheckType(arg[i], rangeFn)) {
          return false;
        }
      }
      return true;
    }
    return isInRangeCheckType(arg, rangeFn);
  };
  return markSafe(validator);
}

/**
 * Core logic for is array function.
 */
function isInRangeCheckType(arg: unknown, rangeFn: isInRangeFn): boolean {
  if (typeof arg === 'number') {
    return rangeFn(arg);
  }
  if (typeof arg === 'string') {
    const casted = Number(arg);
    if (Number.isNaN(casted)) {
      return false;
    }
    return rangeFn(casted);
  }
  return false;
}

/**
 * Initialize inRange function.
 */
function setupIsInRangeInternalFn(
  min: RangeParam,
  max: RangeParam,
): isInRangeFn {
  const minBound = parseRangeBound(min);
  const maxBound = parseRangeBound(max);
  return (arg: number) => {
    if (minBound) {
      if (minBound.inclusive) {
        if (arg < minBound.value) {
          return false;
        }
      } else if (arg <= minBound.value) {
        return false;
      }
    }
    if (maxBound) {
      if (maxBound.inclusive) {
        if (arg > maxBound.value) {
          return false;
        }
      } else if (arg >= maxBound.value) {
        return false;
      }
    }
    return true;
  };
}

function parseRangeBound(param: RangeParam): RangeBound | null {
  if (Array.isArray(param)) {
    if (param.length === 0) {
      return null;
    }
    if (param.length === 1) {
      return {
        value: param[0],
        inclusive: true,
      };
    }
  } else {
    return {
      value: param,
      inclusive: false,
    };
  }
  throw new Error('min and max must be number, [number], or []');
}
