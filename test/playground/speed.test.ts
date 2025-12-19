/* eslint-disable @typescript-eslint/no-explicit-any */
import { isFunction, isNumber, isOptionalString, isString, isUnsignedInteger } from 'src';
import { expect, test } from 'vitest';

const SAFETY = {
  Loose: 1,
  Normal: 2,
  Strict: 3,
}

// **** Types **** //

type TValidatorFn = ((...args: any[]) => any);
type TFunc = ((...args: any[]) => any);
type TSafety = typeof SAFETY[keyof typeof SAFETY];

interface ISchema {
  [key: string]: TValidatorFn | ISchema;
}

interface ValidatorLeaf {
  index: number;
  key: string;
  parentLeaf: ParentValidatorLeaf | null;
  validatorFn: TValidatorFn;
}

interface ParentValidatorLeaf extends Omit<ValidatorLeaf, 'validatorFn'> {
  valueObject?: Record<string, unknown>;
  children: (ValidatorLeaf | ParentValidatorLeaf)[];
  seen: Record<string, boolean>;
}


// **** Validators **** //

/**
 * Start
 */
function parseObjectNew(
  schema: ISchema,
  isOptional: boolean = false,
  isNullable: boolean = false,
  isNullish: boolean = false,
  safety: TSafety = SAFETY.Normal,
) {
  const rootLeaf = setupValidatorTree(schema, null, '', 0);
  return (param: unknown): (Record<string, unknown> | null | undefined) | false => {
    if (param === undefined) {
      return (isOptional || isNullish) ? param : false;
    }
    if (param === null) {
      return (isNullable || isNullish) ? param : false;
    }
    if (isObject(param)) {
      return validateParamWithTree(param, rootLeaf, safety);
    } else {
      return false;
    }
  }
}

/**
 * Setup fast validator tree
 */
function setupValidatorTree(
  schema: ISchema,
  parentLeaf: ParentValidatorLeaf | null,
  paramKey: string,
  paramIndex: number,
): ParentValidatorLeaf {
  // Initialize new leaf
  const newLeaf: ParentValidatorLeaf = {
    index: paramIndex,
    key: paramKey,
    parentLeaf,
    children: [],
    seen: {},
  }
  // Recursively setup the tree
  let index = 0;
  for (const key in schema) {
    const value = schema[key];
    if (isFunction(value)) {
      newLeaf.children.push({
        key,
        validatorFn: wrapValidator(value),
        index,
        parentLeaf: newLeaf,
      });
    } else {
      const childLeaf = setupValidatorTree(value, newLeaf, key, index);
      newLeaf.children.push(childLeaf);
    }
    index++
  }
  // Return
  return newLeaf;
}

/**
 * Prevent error throwing.
 */
function wrapValidator(fn: TFunc) {
  return function(param: unknown, cb: TFunc) {
    try { return fn(param, cb) }
    catch { return false }
  }
}

/**
 * Iteratively validate an object.
 */
function validateParamWithTree(
  param: Record<string, unknown>,
  root: ParentValidatorLeaf,
  safety: TSafety,
): (false | Record<string, unknown>) {
  let parentLeaf: ParentValidatorLeaf = root,
    returnValueObject = param;
  parentLeaf.valueObject = param;
  parentLeaf.seen = {};
  // Start the loop
  for (let i = 0; i < parentLeaf.children.length; i++) {
    const child = parentLeaf.children[i]
    const valueItem = parentLeaf.valueObject![child.key];
    // Run validator function
    if (isNonParentLeaf(child)) {
      const passes = child.validatorFn(valueItem);
      parentLeaf.seen[child.key] = true; 
      if (!passes) return false; 
    // Go down the tree
    } else {
      if (!isObject(valueItem)) {
        return false;
      }
      parentLeaf.valueObject = valueItem;
      child.seen = {};
      parentLeaf = child;
      continue;
    }
    // When reaching the last index, go back up the tree
    if ((i + 1) === parentLeaf.children.length) {
      if (!sanitize(parentLeaf, safety)) {
        return false;
      }
      i = parentLeaf.index + 1;
      if (!!parentLeaf.parentLeaf) { // end of the root leaf reached
        parentLeaf = parentLeaf.parentLeaf;
      } else {
        returnValueObject = parentLeaf.valueObject!;
        break;
      }
    }
  }
  // Return
  return returnValueObject;
}

/**
 * Check keys depending on the level of safety
 */
function sanitize(leaf: ParentValidatorLeaf, safety: TSafety) {
  // Loose doesn't need sanitizing
  if (safety === SAFETY.Loose) {
    return true
  };
  // Sanitize/clone the value object, throw error for strict mode if there
  // are extra fields
  for (const key in leaf.valueObject) {
    if (!leaf.seen[key]) {
      if (safety === SAFETY.Strict) {
        return false;
      } else {
        delete leaf.valueObject[key]
      }
    }
  }
  // Preserve references in return values and make sure the parent of the 
  // parent marks this leaf as seen.
  if (!!leaf.parentLeaf) {
    leaf.parentLeaf.valueObject![leaf.key] = leaf.valueObject;
    leaf.parentLeaf.seen[leaf.key] = true;
  }
  // Return
  return true;
}

/**
 * 
 */
function isObject(arg: unknown): arg is Record<string, unknown> {
  return Object.prototype.toString.call(arg) === '[object Object]';
}

/**
 * 
 */
function isNonParentLeaf(
  arg: ValidatorLeaf | ParentValidatorLeaf,
): arg is ValidatorLeaf {
  return Object.hasOwn(arg, 'validatorFn');
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