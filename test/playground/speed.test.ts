/* eslint-disable @typescript-eslint/no-explicit-any */
import { isFunction, isNumber, isOptionalString, isString, isUnsignedInteger } from 'src';
import { test } from 'vitest';

const SAFETY = {
  Loose: 1,
  Normal: 2,
  Strict: 3,
}

// **** Types **** //

type TValidatorFn = ((...args: any[]) => any);
type TSafety = typeof SAFETY[keyof typeof SAFETY];

interface ISchema {
  [key: string]: TValidatorFn | ISchema;
}

interface IValidatorObject {
  key: string;
  validatorFn: TValidatorFn;
}

interface IValidatorLeaf {
  index: number;
  key: string;
  seen: Record<string, number>;
  validatorObjects: IValidatorObject[];
  parent: IValidatorLeaf | null;
  children: IValidatorLeaf[];
  valueObject: Record<string, unknown>;
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
  let runId = 0;
  return (param: unknown): (Record<string, unknown> | null | undefined) | false => {
    if (param === undefined) {
      return (isOptional || isNullish) ? param : false;
    }
    if (param === null) {
      return (isNullable || isNullish) ? param : false;
    }
    if (isObject(param)) {
      return validateParamWithTree(param, rootLeaf, safety, ++runId);
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
  parentLeaf: IValidatorLeaf | null,
  paramKey: string,
  paramIndex: number,
): IValidatorLeaf {

  // ** Initialize new leaf ** //
  const newLeaf: IValidatorLeaf = {
    index: paramIndex,
    key: paramKey,
    seen: {},
    validatorObjects: [],
    parent: parentLeaf,
    children: [],
    valueObject: {},
  }

  // ** Recursively setup the tree ** //
  for (const key in schema) {
    const value = schema[key];
    if (isFunction(value)) {
      newLeaf.validatorObjects.push({
        key,
        validatorFn: wrapValidator(value),
      });
    } else {
      const index = newLeaf.children.length,
        childLeaf = setupValidatorTree(value, newLeaf, key, index);
      newLeaf.children.push(childLeaf);
    }
  }

  // ** Return ** //
  return newLeaf;
}

/**
 * Prevent error throwing.
 */
function wrapValidator(fn: (param: unknown) => boolean) {
  return function(param: unknown) {
    try { return fn(param) }
    catch { return false }
  }
}
/**
 * Iteratively validate an object.
 */
function validateParamWithTree(
  param: Record<string, unknown>,
  root: IValidatorLeaf,
  safety: TSafety,
  runId: number,
): (false | Record<string, unknown>) {

  // Initialize
  root.valueObject = param;
  let leaf: IValidatorLeaf = root;
  let goingUp = false;

  // Start the loop
  while (true) {

    // ** Iterate up ** //
    if (goingUp) {
      const parent = leaf.parent;
      if (!parent) {
        break;
      }
      // If leaf was the last child, keep going up the tree
      const nextSibling = parent.children[leaf.index + 1];
      if (!nextSibling) {
        leaf = parent;
        continue;
      }
      leaf = nextSibling;
      goingUp = false;
    }

    // ** Run validator functions ** //
    if (!!leaf.parent) {
      const valueObject = leaf.parent.valueObject[leaf.key];
      if (!isObject(valueObject)) {
        return false;
      }
      leaf.valueObject = valueObject;
    }
    for (let v = 0; v < leaf.validatorObjects.length; v++) {
      const { key, validatorFn } = leaf.validatorObjects[v];
      if (!validatorFn(leaf.valueObject[key])) {
        return false;
      }
      leaf.seen[key] = runId;
    }

    // ** Go down the three ** //
    if (leaf.children.length > 0) {
      leaf = leaf.children[0];
      continue;
    }

    // ** Go up the tree ** //
    if (!checkSafetyAndSanitize(leaf, safety, runId)) {
      return false;
    }
    goingUp = true;
  }

  // Return
  return leaf.valueObject;
}

/**
 * Check keys depending on the level of safety
 */
function checkSafetyAndSanitize(
  leaf: IValidatorLeaf,
  safety: TSafety,
  runId: number,
) {

  // Loose doesn't need sanitizing
  if (safety === SAFETY.Loose) {
    return true
  };

  // Check safety
  let needsClone = false;
  for (const key in leaf.valueObject) {
    if (leaf.seen[key] !== runId) {
      if (safety === SAFETY.Strict) {
        return false;
      } else {
        needsClone = true;
        break;
      }
    }
  }

  // Create a clone if needed
  if (needsClone) {
    const clean: Record<string, unknown> = {};
    for (const key in leaf.seen) {
      clean[key] = leaf.valueObject[key];
    }
    leaf.valueObject = clean;
    if (!!leaf.parent) {
      leaf.parent.valueObject[leaf.key] = leaf.valueObject;
    }
  }

  // Return
  return true;
}

/**
 * Check if non array object.
 */
function isObject(arg: unknown): arg is Record<string, unknown> {
  return arg !== null && typeof arg === 'object' && !Array.isArray(arg);
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