/* eslint-disable @typescript-eslint/no-explicit-any */
import { isFunction, isNumber, isOptionalString, isString, isUnsignedInteger } from 'src';
import { test } from 'vitest';

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

  const user2 = {
    id: 1,
    name: 'sean',
    address: {
      street: '123 fake st',
      city: 1234 as unknown as string,
      country: {
        code: '123' as unknown as number,
        name: 'USA',
      },
    },
    email: 123 as unknown as string,
  };

const sampleParam = parseUser(user2)

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
  expectedKeys: string[];
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
    expectedKeys: [],
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
    newLeaf.expectedKeys.push(key);
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

    // ** Go to the next sibling if there, if not, go to the parent ** //
    if (goingUp) {
      const nextSibling = leaf.parent?.children[leaf.index + 1];
      if (!nextSibling) {
        if (!leaf.parent) {
          break;
        } 
        leaf = leaf.parent;
        if (!checkSafetyAndSanitize(leaf, safety, runId)) {
          return false;
        }
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

    // Go up
    if (!checkSafetyAndSanitize(leaf, safety, runId)) {
      return false;
    }
    leaf.parent!.seen[leaf.key] = runId;
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
  leaf.seen = {};

  // Create a clone if needed
  if (needsClone) {
    const clean: Record<string, unknown> = {};
    for (let i = 0; i < leaf.expectedKeys.length; i++) {
      const key = leaf.expectedKeys[i];
      clean[key] = leaf.valueObject[key];
    }
    // Preserve parent references
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