/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
  isFunction,
  isNumber,
  isOptionalString,
  isString,
  isUnsignedInteger,
  isPlainObject,
} from 'src';

import { isSafe } from 'src/markSafe';
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
  run: TValidatorFn;
}

interface IValidatorLeaf {
  index: number;
  key: string;
  seen: Record<string, number>;
  safeValidators: IValidatorObject[];
  unSafeValidators: IValidatorObject[];
  parent: IValidatorLeaf | null;
  children: IValidatorLeaf[];
  valueObject: Record<string, unknown>;
  expectedKeys: string[];
}

type Frame = {
  leaf: IValidatorLeaf;
  childIndex: number;
  entered: boolean;
};

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

  // Return parse object function
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

  // Initialize new leaf
  const newLeaf: IValidatorLeaf = {
    index: paramIndex,
    key: paramKey,
    seen: {},
    safeValidators: [],
    unSafeValidators: [],
    parent: parentLeaf,
    children: [],
    valueObject: {},
    expectedKeys: [],
  }

  // ** Recursively setup the tree ** //
  for (const key in schema) {
    const schemaItem = schema[key];
    if (isFunction(schemaItem)) {

      // Append safe validators
      if (isSafe(schemaItem)) {
        newLeaf.safeValidators.push({
          key,
          run(valueObject: Record<string, unknown>) {
            return schemaItem(valueObject[key]);
          },
        });

      // Append unsafe validators
      } else {
        newLeaf.unSafeValidators.push({
          key,
          run(valueObject: Record<string, unknown>) {
            try {
              return schemaItem(valueObject[key]);
            } catch { return false; }
          },
        });
      }
    
      // Recurse down the tree
    } else {
      const index = newLeaf.children.length,
        childLeaf = setupValidatorTree(schemaItem, newLeaf, key, index);
      newLeaf.children.push(childLeaf);
    }
    newLeaf.expectedKeys.push(key);
  }

  // Return
  return newLeaf;
}

/**
 * 
 */
function validateParamWithTree(
  param: Record<string, unknown>,
  root: IValidatorLeaf,
  safety: TSafety,
  runId: number,
) {

  // Initialize root
  root.valueObject = param;
  const stack: Frame[] = [{
    leaf: root,
    childIndex: 0,
    entered: false,
  }];

  // ** Start stack trace ** //
  while (stack.length > 0) {
    const frame = stack[stack.length - 1];
    const leaf = frame.leaf;

    // Enter node
    if (!frame.entered) {
      frame.entered = true;
      // Run validations
      if (!runValidators(leaf, runId)) {
        return false;
      }
      // Descend
      if (frame.childIndex < leaf.children.length) {
        const child = leaf.children[frame.childIndex++];
        stack.push({
          leaf: child,
          childIndex: 0,
          entered: false,
        });
        continue;
      }
    }

    // Exit node
    if (!checkSafetyAndSanitize(leaf, safety, runId)) {
      return false;
    }
    stack.pop();
  }

  // Return
  return root.valueObject;
}

/**
 * Run safe/unsafe validators for a leaf.
 */
function runValidators(leaf: IValidatorLeaf, runId: number): boolean {
  // Resolve valueObject (except root)
  if (leaf.parent) {
    const parentObj = leaf.parent.valueObject;
    const value = parentObj[leaf.key];
    if (!isPlainObject(value)) {
      return false;
    }
    leaf.valueObject = value;
    // Mark child key as seen in parent
    leaf.parent.seen[leaf.key] = runId;
  }

  // Run safe validators
  const valueObject = leaf.valueObject;
  const safeValidators = leaf.safeValidators;
  for (let i = 0; i < safeValidators.length; i++) {
    const op = safeValidators[i];
    if (op.run(valueObject)) return false;
    leaf.seen[op.key] = runId;
  }

  // Run unsafe validators
  const unSafeValidators = leaf.unSafeValidators;
  for (let i = 0; i < unSafeValidators.length; i++) {
    const op = unSafeValidators[i];
    if (op.run(valueObject)) return false;
    leaf.seen[op.key] = runId;
  }

  return true;
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