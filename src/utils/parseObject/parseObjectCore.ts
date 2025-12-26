import {
  isTransformFn,
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

const PARSE_TABLE = [
  null, // index 0 unused
  [parseLooseNoErrors, parseLoose],
  [parseNormalNoErrors, parseNormal],
  [parseStrictNoErrors, parseStrict],
] as const;

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
  const root = setupValidatorTree(schema, null, ''),
    selectParseFn = setupSelectParseFn(safety);
  let runId = 0;

  // Return user facing function
  return (param: unknown, localOnError?: OnErrorCallback) => {
    // Initialize error state
    const collectErrors = !!(onError || localOnError),
      errorState: ErrorState | null = collectErrors ? { errors: [] } : null;
    // Call the onError callbacks if there are errors
    const fireOnErrorCb = () => {
      if (!!errorState && errorState.errors.length > 0) {
        if (!!localOnError) {
          localOnError(errorState.errors);
        } else if (onError) {
          onError(errorState.errors);
        }
      }
    };
    // Check for nullables
    const resp = checkNullables(isOptional, isNullable, param, errorState);
    if (!resp) {
      if (resp === false) {
        fireOnErrorCb();
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
    const parseFn = selectParseFn(!!collectErrors);
    // If an array
    if (isArray) {
      const result = parseArray(param, errorState, root, runId, parseFn);
      if (result === false) {
        fireOnErrorCb();
      }
      return result;
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
      fireOnErrorCb();
      return false;
    }
    // Run parseFunction
    const result = parseFn(param, root, runId, errorState);
    if (result === false) {
      fireOnErrorCb();
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
        functionName: '<optional>',
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
        functionName: '<nullable>',
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
  // Run the parseFn with an individual error state
  if (!!errorState) {
    const paramClone = [];
    let isValid = true;
    for (let i = 0; i < param.length; i++) {
      const arrayItemErrorState = { errors: [], index: i },
        result = parseFn(param[i], root, runId, arrayItemErrorState);
      if (arrayItemErrorState.errors.length > 0) {
        errorState.errors = [
          ...errorState.errors,
          ...arrayItemErrorState.errors,
        ];
      }
      if (result !== false && isValid) {
        paramClone[i] = result;
      } else {
        isValid = false;
      }
    }
    return isValid ? paramClone : false;
  }
  // Run the parseFn without an individual error state
  const paramClone = [];
  for (let i = 0; i < param.length; i++) {
    const result = parseFn(param[i], root, runId);
    if (result !== false) {
      paramClone[i] = result;
    } else {
      return false;
    }
  }
  return paramClone;
}

/**
 * parse in strict mode
 */
function parseStrict(
  param: PlainObject,
  root: Node,
  runId: number,
  errorState: ErrorState,
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
  while (stack.length) {
    const frame = stack[stack.length - 1];
    const node = frame.node;
    if (!frame.entered) {
      frame.entered = true;
      const canDescend = runValidators(node, runId, errorState);
      if (canDescend && frame.lastChildAddedToStack < node.children.length) {
        const child = node.children[frame.lastChildAddedToStack];
        stack.push({ node: child, lastChildAddedToStack: 0, entered: false });
        frame.lastChildAddedToStack++;
        continue;
      }
    }
    sanitizeStrict(node, runId, errorState);
    stack.pop();
  }
  // Return
  const finalValue = root.valueObject;
  root.valueObject = {};
  return errorState.errors.length === 0 ? finalValue : false;
}

/**
 * sanitize/clone for strict mode
 */
function sanitizeStrict(
  node: Node,
  runId: number,
  errorState: ErrorState,
): void {
  // Setup a clean object and check for extras
  const nodeVal = node.valueObject,
    clean: PlainObject = {},
    keys = Object.keys(nodeVal),
    keysLength = keys.length;
  for (let i = 0; i < keysLength; i++) {
    const key = keys[i],
      kIdx = node.keyIndex[key];
    if (kIdx === undefined || node.seen[kIdx] !== runId) {
      errorState.errors.push({
        info: ERRORS.StrictSafety,
        functionName: '<strict>',
        value: nodeVal[key],
        ...getKeyPath(node, errorState, key),
      });
    }
    // Don't need to clone if there are errors
    if (errorState.errors.length === 0) {
      let v = nodeVal[key];
      if (key in node.transformedValuesObject) {
        v = node.transformedValuesObject[key];
      }
      clean[key] = v !== null && typeof v === 'object' ? deepClone(v) : v;
    }
  }
  node.transformedValuesObject = {};
  // If no errors, replace current value with cloned value
  if (errorState.errors.length === 0) {
    node.valueObject = clean;
    if (node.parent) {
      node.parent.valueObject[node.key] = clean;
    }
  }
}

/**
 * parse in strict mode
 */
function parseStrictNoErrors(param: PlainObject, root: Node, runId: number) {
  root.valueObject = param;
  const stack: Frame[] = [
    {
      node: root,
      lastChildAddedToStack: 0,
      entered: false,
    },
  ];
  // Iterate
  while (stack.length) {
    const frame = stack[stack.length - 1];
    const node = frame.node;
    if (!frame.entered) {
      frame.entered = true;
      if (!runValidatorsNoErrors(node, runId)) return false;
      if (frame.lastChildAddedToStack < node.children.length) {
        const child = node.children[frame.lastChildAddedToStack];
        stack.push({ node: child, lastChildAddedToStack: 0, entered: false });
        frame.lastChildAddedToStack++;
        continue;
      }
    }
    if (!sanitizeStrictNoErrors(node, runId)) return false;
    stack.pop();
  }
  // Return
  return root.valueObject;
}

/**
 * sanitize/clone for strict mode
 */
function sanitizeStrictNoErrors(node: Node, runId: number): boolean {
  const nodeVal = node.valueObject,
    clean: PlainObject = {};
  // Clean object
  const keys = Object.keys(nodeVal),
    keysLength = keys.length;
  for (let i = 0; i < keysLength; i++) {
    const key = keys[i],
      kIdx = node.keyIndex[key];
    if (kIdx === undefined || node.seen[kIdx] !== runId) {
      return false;
    }
    let v = nodeVal[key];
    if (key in node.transformedValuesObject) {
      v = node.transformedValuesObject[key];
    }
    clean[key] = v !== null && typeof v === 'object' ? deepClone(v) : v;
  }
  node.valueObject = clean;
  node.transformedValuesObject = {};
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
  errorState: ErrorState,
) {
  root.valueObject = param;
  const stack: Frame[] = [
    {
      node: root,
      lastChildAddedToStack: 0,
      entered: false,
    },
  ];
  while (stack.length) {
    const frame = stack[stack.length - 1],
      node = frame.node;
    if (!frame.entered) {
      frame.entered = true;
      const canDescend = runValidators(node, runId, errorState);
      if (canDescend && frame.lastChildAddedToStack < node.children.length) {
        const child = node.children[frame.lastChildAddedToStack];
        stack.push({ node: child, lastChildAddedToStack: 0, entered: false });
        frame.lastChildAddedToStack++;
        continue;
      }
    }
    if (errorState.errors.length === 0) {
      sanitizeNormal(node, runId);
    }
    stack.pop();
  }
  // Return
  const finalValue = root.valueObject;
  root.valueObject = {};
  return errorState.errors.length === 0 ? finalValue : false;
}

/**
 * Parse for normal mode
 */
function parseNormalNoErrors(param: PlainObject, root: Node, runId: number) {
  root.valueObject = param;
  const stack: Frame[] = [
    {
      node: root,
      lastChildAddedToStack: 0,
      entered: false,
    },
  ];
  while (stack.length) {
    const frame = stack[stack.length - 1],
      node = frame.node;
    if (!frame.entered) {
      frame.entered = true;
      if (!runValidatorsNoErrors(node, runId)) return false;
      if (frame.lastChildAddedToStack < node.children.length) {
        const child = node.children[frame.lastChildAddedToStack];
        stack.push({ node: child, lastChildAddedToStack: 0, entered: false });
        frame.lastChildAddedToStack++;
        continue;
      }
    }
    sanitizeNormal(node, runId);
    stack.pop();
  }
  return root.valueObject;
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
      }
      clean[key] = v !== null && typeof v === 'object' ? deepClone(v) : v;
    }
  }
  node.valueObject = clean;
  if (node.parent) node.parent.valueObject[node.key] = clean;
}

/**
 * Parse for loose mode with errors.
 */
function parseLoose(
  param: PlainObject,
  root: Node,
  runId: number,
  errorState: ErrorState,
) {
  root.valueObject = param;
  const stack: Frame[] = [
    {
      node: root,
      lastChildAddedToStack: 0,
      entered: false,
    },
  ];
  while (stack.length) {
    const frame = stack[stack.length - 1];
    const node = frame.node;
    if (!frame.entered) {
      frame.entered = true;
      const canDescend = runValidators(node, runId, errorState);
      if (canDescend && frame.lastChildAddedToStack < node.children.length) {
        const child = node.children[frame.lastChildAddedToStack];
        stack.push({ node: child, lastChildAddedToStack: 0, entered: false });
        frame.lastChildAddedToStack++;
        continue;
      }
    }
    if (errorState.errors.length === 0) {
      sanitizeLoose(node);
    }
    stack.pop();
  }
  // Return
  const finalValue = root.valueObject;
  root.valueObject = {};
  return errorState.errors.length === 0 ? finalValue : false;
}

/**
 * Parse for loose mode
 */
function parseLooseNoErrors(param: PlainObject, root: Node, runId: number) {
  root.valueObject = param;
  const stack: Frame[] = [
    {
      node: root,
      lastChildAddedToStack: 0,
      entered: false,
    },
  ];
  while (stack.length) {
    const frame = stack[stack.length - 1];
    const node = frame.node;
    if (!frame.entered) {
      frame.entered = true;
      if (!runValidatorsNoErrors(node, runId)) return false;
      if (frame.lastChildAddedToStack < node.children.length) {
        const child = node.children[frame.lastChildAddedToStack];
        stack.push({ node: child, lastChildAddedToStack: 0, entered: false });
        frame.lastChildAddedToStack++;
        continue;
      }
    }
    sanitizeLoose(node);
    stack.pop();
  }
  return root.valueObject;
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
    }
    clean[key] = v !== null && typeof v === 'object' ? deepClone(v) : v;
  }
  node.valueObject = clean;
  node.transformedValuesObject = {};
  if (node.parent) {
    node.parent.valueObject[node.key] = clean;
  }
}

/******************************************************************************
                                Helpers
            Helpers kept in same file for minor performance
******************************************************************************/

/**
 * Fastest way to select the parse function.
 */
function setupSelectParseFn(safety: Safety): Function {
  const innerArray = PARSE_TABLE[safety];
  return (collectErrors: boolean) => {
    return innerArray[collectErrors ? 1 : 0];
  };
}

/**
 * For validation functions.
 */
function runValidators(
  node: Node,
  runId: number,
  errorState: ErrorState,
): boolean {
  // Set the value object on the child
  if (node.parent) {
    const parentNodeVal = node.parent.valueObject,
      nodeVal = parentNodeVal[node.key];
    if (!isPlainObject(nodeVal)) {
      errorState.errors.push({
        info: ERRORS.SchemaProp,
        functionName: '<object>',
        value: nodeVal,
        ...getKeyPath(node, errorState, node.key),
      });
      return false;
    }
    node.valueObject = nodeVal;
    const parentIdx = node.parent.keyIndex[node.key];
    node.parent.seen[parentIdx] = runId;
  }
  // Run safe validators
  const nodeVal = node.valueObject;
  for (const vldr of node.safeValidators) {
    const vldrFn: Function = vldr.fn,
      toValidate = nodeVal[vldr.key];
    let result;
    // Transform validator function
    if (isTransformFn(vldrFn)) {
      result = vldrFn(toValidate, (newValue) => {
        node.transformedValuesObject[vldr.key] = newValue;
      });
      // Nested testObject function
    } else if (isTestObjectCoreFn(vldrFn)) {
      result = vldrFn(
        toValidate,
        (nestedErrors: ParseError[]) => {
          console.log('aaa', node.path, nestedErrors)
          for (const error of nestedErrors) {
            if (error.key) {
              (error as PlainObject).keyPath = [...node.path, error.key];
              delete (error as PlainObject).key;
            } else {
              error.keyPath = [...node.path, ...(error.keyPath ?? [])];
            }
            errorState.errors.push(error);
          }
          console.log('bbb', nestedErrors)
        },
        (modifiedValue) => {
          node.transformedValuesObject[vldr.key] = modifiedValue;
        },
      );
      // Standard validator function
    } else {
      result = vldrFn(toValidate);
    }
    if (!result) {
      errorState.errors.push({
        info: ERRORS.ValidatorFn,
        functionName: vldr.name,
        value: toValidate,
        ...getKeyPath(node, errorState, vldr.key),
      });
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
      if (isTransformFn(vldrFn)) {
        result = vldrFn(toValidate, (newValue) => {
          node.transformedValuesObject[vldr.key] = newValue;
        });
      } else {
        result = vldrFn(toValidate);
      }
      if (!result) throw null;
      node.seen[vldr.idx] = runId;
    } catch (err) {
      errorState.errors.push({
        info: ERRORS.ValidatorFn,
        functionName: vldr.name,
        value: nodeVal[vldr.key],
        caught:
          err instanceof Error ? err.message : err ? String(err) : undefined,
        ...getKeyPath(node, errorState, vldr.key),
      });
    }
    node.seen[vldr.idx] = runId;
  }
  // Return
  return true;
}

/**
 * For validation functions.
 */
function runValidatorsNoErrors(node: Node, runId: number): boolean {
  // Set the value object on the child
  if (node.parent) {
    const parentNodeVal = node.parent.valueObject,
      nodeVal = parentNodeVal[node.key];
    if (!isPlainObject(nodeVal)) {
      return false;
    }
    node.valueObject = nodeVal;
    const parentIdx = node.parent.keyIndex[node.key];
    node.parent.seen[parentIdx] = runId;
  }
  // Run safe validators
  const nodeVal = node.valueObject;
  for (const vldr of node.safeValidators) {
    const vldrFn: Function = vldr.fn,
      toValidate = nodeVal[vldr.key];
    // Transform validator function
    if (isTransformFn(vldrFn)) {
      const result = vldrFn(toValidate, (newValue) => {
        node.transformedValuesObject[vldr.key] = newValue;
      });
      if (!result) return false;
      // Nested testObject function
    } else if (isTestObjectCoreFn(vldrFn)) {
      const result = vldrFn(toValidate, undefined, (modifiedValue) => {
        node.transformedValuesObject[vldr.key] = modifiedValue;
      });
      if (!result) return false;
      // Standard validator function
    } else {
      if (!vldrFn(toValidate)) return false;
    }
    node.seen[vldr.idx] = runId;
  }
  // Run unsafe validators
  for (const vldr of node.unSafeValidators) {
    try {
      const vldrFn: Function = vldr.fn,
        toValidate = nodeVal[vldr.key];
      let result;
      if (isTransformFn(vldrFn)) {
        result = vldrFn(toValidate, (newValue) => {
          node.transformedValuesObject[vldr.key] = newValue;
        });
      } else {
        result = vldrFn(toValidate);
      }
      if (!result) throw null;
      node.seen[vldr.idx] = runId;
    } catch {
      return false;
    }
    node.seen[vldr.idx] = runId;
  }
  // Return
  return true;
}

/**
 * Get keyPath
 */
function getKeyPath(node: Node, errorState: ErrorState, key: string) {
  let keyPath: string[] = [];
  if (errorState.index !== undefined) {
    keyPath = [errorState.index.toString()];
  }
  if (!!node.parent || keyPath.length > 0) {
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

/******************************************************************************
                                Export
******************************************************************************/

export default parseObjectCore;
