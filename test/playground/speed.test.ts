/* eslint-disable @typescript-eslint/no-explicit-any */
import { isFunction, isNumber, isOptionalString, isString, isUnsignedInteger } from 'src';
import { expect, test } from 'vitest';

type TValidatorFn = ((...args: any[]) => any);
type TFunc = ((...args: any[]) => any);
type TSafety = 1 | 2 | 3;

interface ISchema {
  [key: string]: TValidatorFn | ISchema;
}

interface IValidatorOp {
  key: string;
  validatorFn: TValidatorFn;
  isLeaf: false;
}

interface IValidatorLeaf {
  index: number;
  key: string;
  parentLeaf: IValidatorLeaf | null;
  paramObject?: Record<string, unknown>;
  validators: (IValidatorOp | IValidatorLeaf)[];
  isLeaf: true;
  seen: Record<string, boolean>;
}

/**
 * 
 */
function parseObjectNew(schema: ISchema, safety: TSafety = 2) {

  const rootLeaf = setupValidatorTree(schema, null, '', 0);

  return (param: unknown) => {
    if (isObject(param)) {
      rootLeaf.paramObject = param;
      return validateParamWithTree(rootLeaf, safety);
    }
  }
}

/**
 * Setup fast validator tree
 */
function setupValidatorTree(
  schema: ISchema,
  parentLeaf: IValidatorLeaf | null,
  paramKey: string,
  paramIndex: number,
): IValidatorLeaf {
  // Initialize new leaf
  const newLeaf: IValidatorLeaf = {
    index: paramIndex,
    key: paramKey,
    parentLeaf,
    validators: [],
    isLeaf: true,
    seen: {},
  }
  // Recursively setup the tree
  let index = 0;
  for (const key in schema) {
    const value = schema[key];
    if (isFunction(value)) {
      const validatorFn = ((param: unknown, cb: TFunc) => {
        try {
          return value(param, cb)
        } catch (_) {
          return false;
        }
      });
      newLeaf.validators.push({ key, validatorFn, isLeaf: false });
    } else {
      const childLeaf = setupValidatorTree(value, newLeaf, key, index);
      newLeaf.validators.push(childLeaf);
    }
    index++
  }
  // Return
  return newLeaf;
}

/**
 * 
 */
function validateParamWithTree(root: IValidatorLeaf, safety: TSafety) {
  let currentLeaf: IValidatorLeaf | null = root,
    currentIndex = 0;
  // Start the loop
  while (currentLeaf !== null) {
    const item: IValidatorOp | IValidatorLeaf = currentLeaf.validators[currentIndex],
      paramObject = currentLeaf.paramObject!,
      paramValue = paramObject[item.key];
    // Run validator function
    if (!item.isLeaf) {
      const passes = item.validatorFn(paramValue);
      if (!passes) return false; 
    // Go down the tree
    } else {
      if (!isObject(paramValue)) {
        return false;
      }
      currentLeaf = item;
      currentLeaf.paramObject = paramValue;
      currentIndex = 0;
      continue;
    }
    currentLeaf.seen[item.key] = true;
    currentIndex++
    // Go back up the tree
    if (currentIndex === currentLeaf.validators.length) {
      if (!checkSafety(currentLeaf.seen, paramObject, safety)) {
        return false;
      }
      currentIndex = currentLeaf.index;
      currentLeaf = currentLeaf.parentLeaf;
    }
  }
}

/**
 * Check keys depending on the level of safety
 */
function checkSafety(
  seen: IValidatorLeaf['seen'],
  param: Record<string, unknown>,
  safety: TSafety,
) {
  if (safety === 1) {
    return true;
  }
  for (const key in param) {
    if (!seen[key]) {
      if (safety === 3) {
        return false;
      }
      delete param[key];
    }
  }
  return true;
}

/**
 * 
 */
function isObject(arg: unknown): arg is Record<string, unknown> {
  return !!arg && typeof arg === 'object' && !Array.isArray(arg);
}


// **** Test **** //

test('speed improvement', () => {

  const parseUser = parseObjectNew({
      id: isUnsignedInteger,
      name: isString,
      address: {
        street: isString,
        city: isString,
        country: {
          code: isNumber,
          name: isString,
        },
      },
      email: isOptionalString,
    });

})