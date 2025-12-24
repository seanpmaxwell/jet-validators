import {
  isTransformFunction,
  type ValidatorFnWithTransformCb,
} from '../simple-utils.js';

import { isPlainObject, type Function } from '../../basic.js';
import { isSafe } from './mark-safe.js';
import { isTestObjectCoreFn } from './testObjectCore.js';

/******************************************************************************
                                Constants
******************************************************************************/

export const SAFETY = {
  Loose: 1,
  Normal: 2,
  Strict: 3,
} as const;

export const ERRORS = {
  NotOptional: 'Root argument is undefined but not optional.',
  NotNullable: 'Root argument is null but not nullable.',
  NotObject: 'Root argument is not an object',
  NotArray: 'Root argument is not an array.',
  ValidatorFn: 'Validator function returned false.',
  StrictSafety: 'Strict mode: unknown or invalid property',
  SchemaProp: 'Schema property must be a function or nested schema',
} as const;

/******************************************************************************
                                  Types
******************************************************************************/

export type Safety = (typeof SAFETY)[keyof typeof SAFETY];
type PlainObject = Record<string, unknown>;

// **** Validation Schema **** //

interface CoreSchema {
  [key: string]: ValidatorFn<unknown> | CoreSchema;
}

export type ValidatorFn<T> =
  | ((arg: unknown) => arg is T)
  | ValidatorFnWithTransformCb<T>;

interface ValidatorItem {
  key: string;
  fn: ValidatorFn<unknown>;
  idx: number;
  name: string;
}

interface Node {
  key: string;
  safeValidators: ValidatorItem[];
  unSafeValidators: ValidatorItem[];
  parent: Node | null;
  path: string[];
  children: Node[];
  valueObject: PlainObject;
  transformedValuesObject: PlainObject;
  // Track validations
  keyIndex: Record<string, number>;
  seen: Uint32Array;
}

type Frame = {
  node: Node;
  lastChildAddedToStack: number;
  entered: boolean;
};

// **** Error Handling **** //

export type ParseError = {
  info: string;
  functionName: string; // name of the validator function
  value?: unknown;
  caught?: string; // if a ValidatorItem caught an error from an unsafe function
} & (
  | {
      key: string;
      keyPath?: never;
    }
  | {
      keyPath: string[];
      key?: never;
    }
);

interface ErrorState {
  errors: ParseError[];
  index?: number;
}

export type OnErrorCallback = (errors: ParseError[]) => void;

type ValidationResult = {
  isValid: boolean; // did validators fail?
  canDescend: boolean; // is value a PlainObject?
};

/******************************************************************************
                                  Functions
******************************************************************************/

/**
 * Do basic checks before core parsing
 */
function parseObjectCore(
  isOptional: boolean,
  isNullable: boolean,
  isArray: boolean,
  schema: CoreSchema,
  safety: Safety,
  onError?: OnErrorCallback,
) {
  // Intialize tree and final parse function
  const root = setupValidatorTree(schema, null, '');
  let finalParseFn;
  if (safety === SAFETY.Strict) {
    finalParseFn = parseStrict;
  } else if (safety === SAFETY.Normal) {
    finalParseFn = parseNormal;
  } else {
    finalParseFn = parseLoose;
  }
  let runId = 0;

  // Return user facing function
  return (param: unknown, localOnError?: OnErrorCallback) => {
    // Initialize error state
    const errorState: ErrorState | null =
      onError || localOnError ? { errors: [] } : null;
    // Check for nullables
    const resp = checkNullables(isOptional, isNullable, param, errorState);
    if (!resp) {
      if (resp === false) {
        return false;
      } else {
        return resp;
      }
    }
    // Reset the runId if it gets to 4billion
    if (++runId === 0xffffffff) {
      runId = 1;
      resetSeen(root);
    }
    // If an array
    if (isArray) {
      return parseArray(param, errorState, root, runId, finalParseFn);
    }
    // Make sure an object if not null, undefined, or array
    if (!isPlainObject(param)) {
      if (!!errorState) {
        errorState.errors.push({
          info: ERRORS.NotObject,
          functionName: '<isPlainObject>',
          value: param,
          key: '',
        });
      }
      return false;
    }
    // Run parseFunction
    const result = finalParseFn(param, root, runId, errorState);
    if (!!errorState && !result) {
      if (!!localOnError) {
        localOnError(errorState?.errors);
      } else if (onError) {
        onError(errorState?.errors);
      }
      return false;
    } else {
      return result;
    }
  };
}

/**
 * Setup fast validator tree
 */
function setupValidatorTree(
  schema: CoreSchema,
  parentNode: Node | null,
  paramKey: string,
): Node {
  // Setup keys
  const keys = Object.keys(schema),
    keyIndex: Record<string, number> = Object.create(null);
  for (let i = 0; i < keys.length; i++) {
    keyIndex[keys[i]] = i;
  }
  // Initialize new node
  const node: Node = {
    key: paramKey,
    safeValidators: [],
    unSafeValidators: [],
    parent: parentNode,
    children: [],
    path: parentNode ? [...parentNode.path, paramKey] : [],
    valueObject: {},
    transformedValuesObject: {},
    keyIndex,
    seen: new Uint32Array(keys.length),
  };
  // Iterate the schema
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const item = schema[key];
    if (typeof item === 'function') {
      const idx = keyIndex[key],
        name = item.name || '<anonymous>';
      if (isSafe(item)) {
        node.safeValidators.push({ key, fn: item, idx, name });
      } else {
        node.unSafeValidators.push({ key, fn: item, idx, name });
      }
      // Recurse down the tree
    } else {
      const childNode = setupValidatorTree(item, node, key);
      node.children.push(childNode);
    }
  }
  // Return
  return node;
}

/**
 * Check for things like optiona, array, etc.
 */
function checkNullables(
  isOptional: boolean,
  isNullable: boolean,
  param: unknown,
  errorState: ErrorState | null,
) {
  // Check undefined
  if (param === undefined) {
    if (isOptional) return undefined;
    if (!!errorState) {
      errorState.errors.push({
        info: ERRORS.NotOptional,
        functionName: '<isOptional>',
        value: undefined,
        key: '',
      });
    }
    return false;
  }
  // Check null
  if (param === null) {
    if (isNullable) return null;
    if (!!errorState) {
      errorState.errors.push({
        info: ERRORS.NotNullable,
        functionName: '<isNullable>',
        value: null,
        key: '',
      });
    }
    return false;
  }
  // Return
  return true;
}

/**
 * Run parseFn for each index if in an array.
 */
function parseArray(
  param: unknown,
  errorState: ErrorState | null,
  root: Node,
  runId: number,
  parseFn: Function,
) {
  // Make sure param is an array
  if (!Array.isArray(param)) {
    if (!!errorState) {
      errorState.errors.push({
        info: ERRORS.NotArray,
        functionName: '<isArray>',
        value: param,
        key: '',
      });
    }
    return false;
  }
  // Run the validator for each array item
  let isValid = true;
  const paramClone = [];
  for (let i = 0; i < param.length; i++) {
    let errorStateIdx = null;
    if (!!errorState) {
      errorStateIdx = { errors: [], hasErrors: false, index: i };
    }
    const result = parseFn(param[i], root, runId, errorStateIdx);
    if (errorStateIdx?.hasErrors) {
      errorState!.errors = [...errorState!.errors, ...errorStateIdx.errors];
    }
    if (result !== false) {
      paramClone[i] = result;
    } else {
      isValid = false;
    }
  }
  // Return
  return isValid ? param : false;
}

/**
 * parse in strict mode
 */
function parseStrict(
  param: PlainObject,
  root: Node,
  runId: number,
  errorState: ErrorState | null,
) {
  root.valueObject = param;
  const stack: Frame[] = [
    {
      node: root,
      lastChildAddedToStack: 0,
      entered: false,
    },
  ];
  // Iterate
  let isValidFinal = true;
  while (stack.length) {
    const frame = stack[stack.length - 1];
    const node = frame.node;
    if (!frame.entered) {
      frame.entered = true;
      const { isValid, canDescend } = runValidators(node, runId, errorState);
      if (!isValid) {
        isValidFinal = false;
      }
      if (canDescend && frame.lastChildAddedToStack < node.children.length) {
        const child = node.children[frame.lastChildAddedToStack];
        stack.push({ node: child, lastChildAddedToStack: 0, entered: false });
        frame.lastChildAddedToStack++;
        continue;
      }
    }
    if (!sanitizeStrict(node, runId, errorState)) {
      if (!!errorState) {
        continue;
      } else {
        return false;
      }
    }
    stack.pop();
  }
  // Return
  return isValidFinal ? root.valueObject : false;
}

/**
 * sanitize/clone for strict mode
 */
function sanitizeStrict(
  node: Node,
  runId: number,
  errorState: ErrorState | null,
): boolean {
  const nodeVal = node.valueObject,
    clean: PlainObject = {};
  // Clean object
  const keys = Object.keys(nodeVal),
    keysLength = keys.length;
  for (let i = 0; i < keysLength; i++) {
    const key = keys[i],
      kIdx = node.keyIndex[key];
    if (kIdx === undefined || node.seen[kIdx] !== runId) {
      if (errorState) {
        errorState.errors.push({
          info: ERRORS.StrictSafety,
          functionName: '<strict>',
          value: nodeVal[key],
          ...getKeyPath(node, errorState, key),
        });
      } else {
        return false;
      }
    }
    let v = nodeVal[key];
    if (key in node.transformedValuesObject) {
      v = node.transformedValuesObject[key];
      delete node.transformedValuesObject[key];
    }
    clean[key] = v !== null && typeof v === 'object' ? deepClone(v) : v;
  }
  node.valueObject = clean;
  // Set the parent pointer to cleaned value
  if (node.parent) {
    node.parent.valueObject[node.key] = clean;
  }
  return true;
}

/**
 * Parse for normal mode
 */
function parseNormal(
  param: PlainObject,
  root: Node,
  runId: number,
  errorState: ErrorState | null,
) {
  root.valueObject = param;
  const stack: Frame[] = [
    {
      node: root,
      lastChildAddedToStack: 0,
      entered: false,
    },
  ];
  let isValidFinal = true;
  while (stack.length) {
    const frame = stack[stack.length - 1];
    const node = frame.node;
    if (!frame.entered) {
      frame.entered = true;
      const { isValid, canDescend } = runValidators(node, runId, errorState);
      if (!isValid) {
        isValidFinal = false;
      }
      if (canDescend && frame.lastChildAddedToStack < node.children.length) {
        const child = node.children[frame.lastChildAddedToStack];
        stack.push({ node: child, lastChildAddedToStack: 0, entered: false });
        frame.lastChildAddedToStack++;
        continue;
      }
    }
    sanitizeNormal(node, runId);
    stack.pop();
  }
  // Return
  return isValidFinal ? root.valueObject : false;
}

/**
 * Sanitize in for normal mode
 */
function sanitizeNormal(node: Node, runId: number): void {
  const nodeVal = node.valueObject,
    clean: PlainObject = {},
    keys = Object.keys(nodeVal);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i],
      kIdx = node.keyIndex[key];
    if (kIdx !== undefined && node.seen[kIdx] === runId) {
      let v = nodeVal[key];
      if (key in node.transformedValuesObject) {
        v = node.transformedValuesObject[key];
        delete node.transformedValuesObject[key];
      }
      clean[key] = v !== null && typeof v === 'object' ? deepClone(v) : v;
    }
  }
  node.valueObject = clean;
  if (node.parent) node.parent.valueObject[node.key] = clean;
}

/**
 * Parse for loose mode
 */
function parseLoose(
  param: PlainObject,
  root: Node,
  runId: number,
  errorState: ErrorState | null,
) {
  root.valueObject = param;
  const stack: Frame[] = [
    {
      node: root,
      lastChildAddedToStack: 0,
      entered: false,
    },
  ];
  // Iterate
  let isValidFinal = true;
  while (stack.length) {
    const frame = stack[stack.length - 1];
    const node = frame.node;
    if (!frame.entered) {
      frame.entered = true;
      const { isValid, canDescend } = runValidators(node, runId, errorState);
      isValidFinal = isValid;
      if (canDescend && frame.lastChildAddedToStack < node.children.length) {
        const child = node.children[frame.lastChildAddedToStack];
        stack.push({ node: child, lastChildAddedToStack: 0, entered: false });
        frame.lastChildAddedToStack++;
        continue;
      }
    }
    sanitizeLoose(node);
    stack.pop();
  }
  // Return
  return isValidFinal ? root.valueObject : false;
}

/**
 * Sanitize for loose mode
 */
function sanitizeLoose(node: Node): void {
  const nodeVal = node.valueObject,
    clean: PlainObject = {},
    keys = Object.keys(nodeVal);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    let v = nodeVal[key];
    if (key in node.transformedValuesObject) {
      v = node.transformedValuesObject[key];
      delete node.transformedValuesObject[key];
    }
    clean[key] = v !== null && typeof v === 'object' ? deepClone(v) : v;
  }
  node.valueObject = clean;
  if (node.parent) {
    node.parent.valueObject[node.key] = clean;
  }
}

/**
 * For validation functions.
 */
function runValidators(
  node: Node,
  runId: number,
  errorState: ErrorState | null,
): ValidationResult {
  // Set the value object on the child
  if (node.parent) {
    const parentNodeVal = node.parent.valueObject,
      nodeVal = parentNodeVal[node.key];
    if (!isPlainObject(nodeVal)) {
      if (!!errorState) {
        errorState.errors.push({
          info: ERRORS.SchemaProp,
          functionName: '<object>',
          value: nodeVal,
          ...getKeyPath(node, errorState, node.key),
        });
      }
      return { isValid: false, canDescend: false };
    }
    node.valueObject = nodeVal;
    const parentIdx = node.parent.keyIndex[node.key];
    node.parent.seen[parentIdx] = runId;
  }
  // Run safe validators
  let isValid = true;
  const nodeVal = node.valueObject;
  for (const vldr of node.safeValidators) {
    const vldrFn: Function = vldr.fn,
      toValidate = nodeVal[vldr.key];
    let result;
    // Transform validator function
    if (isTransformFunction(vldrFn)) {
      result = vldrFn(toValidate, (newValue) => {
        node.transformedValuesObject[vldr.key] = newValue;
      });
      // Nested testObject function
    } else if (isTestObjectCoreFn(vldrFn)) {
      result = vldrFn(
        toValidate,
        !!errorState ? getBlendedOnErrorCb(errorState, node) : undefined,
        (modifiedValue) => {
          node.transformedValuesObject[vldr.key] = modifiedValue;
        },
      );
      // Standard validator function
    } else {
      result = vldrFn(toValidate);
    }
    if (!result) {
      isValid = false;
      if (errorState) {
        errorState.errors.push({
          info: ERRORS.ValidatorFn,
          functionName: vldr.name,
          value: toValidate,
          ...getKeyPath(node, errorState, vldr.key),
        });
      }
    } else {
      node.seen[vldr.idx] = runId;
    }
  }
  // Run unsafe validators
  for (const vldr of node.unSafeValidators) {
    try {
      const vldrFn: Function = vldr.fn,
        toValidate = nodeVal[vldr.key];
      let result;
      if (isTransformFunction(vldrFn)) {
        result = vldrFn(toValidate, (newValue) => {
          node.transformedValuesObject[vldr.key] = newValue;
        });
      } else {
        result = vldrFn(toValidate);
      }
      if (!result) throw null;
      node.seen[vldr.idx] = runId;
    } catch (err) {
      isValid = false;
      if (errorState) {
        errorState.errors.push({
          info: ERRORS.ValidatorFn,
          functionName: vldr.name,
          value: nodeVal[vldr.key],
          caught:
            err instanceof Error ? err.message : err ? String(err) : undefined,
          ...getKeyPath(node, errorState, vldr.key),
        });
      }
    }
    node.seen[vldr.idx] = runId;
  }
  // Return
  return { isValid, canDescend: true };
}

/******************************************************************************
                                Helpers
            Helpers kept in same file for minor performance
******************************************************************************/

/**
 * Get keyPath
 */
function getKeyPath(node: Node, errorState: ErrorState, key: string) {
  let keyPath: string[] = [];
  if (errorState.index !== undefined) {
    keyPath = [errorState.index.toString()];
  }
  if (!!node.parent) {
    keyPath = [...keyPath, ...node.path, key];
  }
  return keyPath.length > 1 ? { keyPath } : { key };
}

/**
 * Return a value or deep clone it if it's an object.
 */
function deepClone<T>(value: T): T {
  // Primitives
  if (value === null || typeof value !== 'object') {
    return value;
  }
  // Date
  if (value instanceof Date) {
    return new Date(value.getTime()) as T;
  }
  // RegExp
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as T;
  }
  // Map
  if (value instanceof Map) {
    const out = new Map();
    for (const [k, v] of value) {
      out.set(deepClone(k), deepClone(v));
    }
    return out as T;
  }
  // Set
  if (value instanceof Set) {
    const out = new Set();
    for (const v of value) {
      out.add(deepClone(v));
    }
    return out as T;
  }
  // Array
  if (Array.isArray(value)) {
    const out = new Array(value.length);
    for (let i = 0; i < value.length; i++) {
      out[i] = deepClone(value[i]);
    }
    return out as T;
  }
  // Typed arrays / ArrayBuffer views
  if (ArrayBuffer.isView(value)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new (value.constructor as any)(
      value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength),
    );
  }
  // ArrayBuffer
  if (value instanceof ArrayBuffer) {
    return value.slice(0) as T;
  }
  // Plain object OR class instance
  const proto = Object.getPrototypeOf(value),
    out = Object.create(proto),
    keys = Object.keys(value as object);
  // Go down
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    (out as PlainObject)[k] = deepClone((value as PlainObject)[k]);
  }
  return out;
}

/**
 * This walks the validator tree once and clears all seen arrays.
 * it runs once every ~4 billion validations.
 */
function resetSeen(root: Node): void {
  const stack: Node[] = [root];
  while (stack.length) {
    const node = stack.pop()!;
    node.seen.fill(0);
    for (let i = 0; i < node.children.length; i++) {
      stack.push(node.children[i]);
    }
  }
}

/**
 * If a nestTested object function as errors, we need to add those.
 */
function getBlendedOnErrorCb(errorState: ErrorState, leaf: Node) {
  return (errors: ParseError[]) => {
    for (const error of errors) {
      if (error.key) {
        (error as PlainObject).keyPath = [...leaf.path, error.key];
        delete (error as PlainObject).key;
      } else {
        error.keyPath = [...leaf.path, ...(error.keyPath ?? [])];
      }
      errorState.errors.push(error);
    }
  };
}

/******************************************************************************
                                Export
******************************************************************************/

export default parseObjectCore;
