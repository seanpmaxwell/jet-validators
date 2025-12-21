import { isPlainObject } from '../../basic.js';
import { isSafe } from './mark-safe.js';

/******************************************************************************
                                Constants
******************************************************************************/

const SAFETY = {
  Loose: 1,
  Normal: 2,
  Strict: 3,
} as const;

/******************************************************************************
                                  Types
******************************************************************************/

type TValidatorFn = (value: unknown) => boolean;
type TSafety = (typeof SAFETY)[keyof typeof SAFETY];
type PlainObject = Record<string, unknown>;

interface ISchema {
  [key: string]: TValidatorFn | ISchema;
}

interface IValidatorItem {
  key: string;
  fn: TValidatorFn;
}

interface INode {
  key: string;
  safeValidators: IValidatorItem[];
  unSafeValidators: IValidatorItem[];
  parent: INode | null;
  children: INode[];
  valueObject: PlainObject;
  seen: Record<string, number>;
}

type Frame = {
  node: INode;
  childIndex: number;
  entered: boolean;
};

/******************************************************************************
                                  Functions
******************************************************************************/

/**
 * Start
 */
function parseObjectCore(
  schema: ISchema,
  isOptional = false,
  isNullable = false,
  isNullish = false,
  safety: TSafety = SAFETY.Normal,
) {
  const root = setupValidatorTree(schema, null, '');
  let runId = 0;
  // Parse strict
  if (safety === SAFETY.Strict) {
    return function parseStrictInline(
      param: unknown,
    ): PlainObject | null | undefined | false {
      if (param === undefined)
        return isOptional || isNullish ? undefined : false;
      if (param === null) return isNullable || isNullish ? null : false;
      if (!isPlainObject(param)) return false;

      return parseStrict(param, root, ++runId);
    };
  }
  // Parse normal
  if (safety === SAFETY.Normal) {
    return function parseNormalInline(
      param: unknown,
    ): PlainObject | null | undefined | false {
      if (param === undefined)
        return isOptional || isNullish ? undefined : false;
      if (param === null) return isNullable || isNullish ? null : false;
      if (!isPlainObject(param)) return false;

      return parseNormal(param, root, ++runId);
    };
  }
  // Loose
  return function parseLooseInline(
    param: unknown,
  ): PlainObject | null | undefined | false {
    if (param === undefined) return isOptional || isNullish ? undefined : false;
    if (param === null) return isNullable || isNullish ? null : false;
    if (!isPlainObject(param)) return false;

    return parseLoose(param, root, ++runId);
  };
}

/**
 * Setup fast validator tree
 */
function setupValidatorTree(
  schema: ISchema,
  parentNode: INode | null,
  paramKey: string,
): INode {
  // Initialize new node
  const node: INode = {
    key: paramKey,
    safeValidators: [],
    unSafeValidators: [],
    parent: parentNode,
    children: [],
    valueObject: {},
    seen: Object.create(null),
  };
  // Iterate the schema
  const keys = Object.keys(schema);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const item = schema[key];
    if (typeof item === 'function') {
      if (isSafe(item)) {
        node.safeValidators.push({ key, fn: item });
      } else {
        node.unSafeValidators.push({ key, fn: item });
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
 *
 */
function parseStrict(param: PlainObject, root: INode, runId: number) {
  root.valueObject = param;
  const stack: Frame[] = [{ node: root, childIndex: 0, entered: false }];
  while (stack.length) {
    const frame = stack[stack.length - 1];
    const node = frame.node;
    if (!frame.entered) {
      frame.entered = true;
      if (!runValidators(node, runId)) return false;
      if (frame.childIndex < node.children.length) {
        const child = node.children[frame.childIndex++];
        stack.push({ node: child, childIndex: 0, entered: false });
        continue;
      }
    }
    if (!sanitizeStrict(node, runId)) return false;
    stack.pop();
  }
  return root.valueObject;
}

/**
 *
 */
function sanitizeStrict(node: INode, runId: number): boolean {
  const nodeVal = node.valueObject;
  // Fail fast
  const keys = Object.keys(nodeVal),
    keysLength = keys.length;
  for (let i = 0; i < keysLength; i++) {
    if (node.seen[keys[i]] !== runId) {
      return false;
    }
  }
  // Clone only if valid
  const clean: PlainObject = {};
  for (let i = 0; i < keysLength; i++) {
    const k = keys[i];
    clean[k] = deepClone(nodeVal[k]);
  }
  node.valueObject = clean;
  if (node.parent) node.parent.valueObject[node.key] = clean;
  return true;
}

/**
 *
 */
function parseNormal(param: PlainObject, root: INode, runId: number) {
  root.valueObject = param;
  const stack: Frame[] = [{ node: root, childIndex: 0, entered: false }];
  while (stack.length) {
    const frame = stack[stack.length - 1];
    const node = frame.node;
    if (!frame.entered) {
      frame.entered = true;
      if (!runValidators(node, runId)) return false;
      if (frame.childIndex < node.children.length) {
        const child = node.children[frame.childIndex++];
        stack.push({ node: child, childIndex: 0, entered: false });
        continue;
      }
    }
    sanitizeNormal(node, runId);
    stack.pop();
  }
  return root.valueObject;
}

/**
 *
 */
function sanitizeNormal(node: INode, runId: number): void {
  const nodeVal = node.valueObject,
    clearn: PlainObject = {},
    keys = Object.keys(nodeVal);
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (node.seen[k] === runId) {
      clearn[k] = deepClone(nodeVal[k]);
    }
  }
  node.valueObject = clearn;
  if (node.parent) node.parent.valueObject[node.key] = clearn;
}

/**
 *
 */
function parseLoose(param: PlainObject, root: INode, runId: number) {
  root.valueObject = param;
  const stack: Frame[] = [{ node: root, childIndex: 0, entered: false }];
  while (stack.length) {
    const frame = stack[stack.length - 1];
    const node = frame.node;
    if (!frame.entered) {
      frame.entered = true;
      if (!runValidators(node, runId)) return false;
      if (frame.childIndex < node.children.length) {
        const child = node.children[frame.childIndex++];
        stack.push({ node: child, childIndex: 0, entered: false });
        continue;
      }
    }
    sanitizeLoose(node);
    stack.pop();
  }
  return root.valueObject;
}

/**
 *
 */
function sanitizeLoose(node: INode): void {
  const nodeVal = node.valueObject,
    clean: PlainObject = {},
    keys = Object.keys(nodeVal);
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    clean[k] = deepClone(nodeVal[k]);
  }
  node.valueObject = clean;
  if (node.parent) {
    node.parent.valueObject[node.key] = clean;
  }
}

/**
 * For validation functions.
 */
function runValidators(node: INode, runId: number): boolean {
  // Set the value object on the child
  if (node.parent) {
    const parentNodeVal = node.parent.valueObject,
      nodeVal = parentNodeVal[node.key];
    if (!isPlainObject(nodeVal)) return false;
    node.valueObject = nodeVal;
    node.parent.seen[node.key] = runId;
  }
  // Run safe validators
  const nodeVal = node.valueObject,
    safeValidators = node.safeValidators;
  for (let i = 0; i < safeValidators.length; i++) {
    const vldr = safeValidators[i];
    if (!vldr.fn(nodeVal[vldr.key])) return false;
    node.seen[vldr.key] = runId;
  }
  // Run unsafe validators
  const unSafeValidators = node.unSafeValidators;
  for (let i = 0; i < unSafeValidators.length; i++) {
    const vldr = unSafeValidators[i];
    let ok = false;
    try {
      ok = vldr.fn(nodeVal[vldr.key]);
    } catch {
      ok = false;
    }
    if (!ok) return false;
    node.seen[vldr.key] = runId;
  }
  // Return
  return true;
}

/******************************************************************************
                                Helpers
            elpers kept in same file for minor performance
******************************************************************************/

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
    return new (value.constructor as any)(value as PlainObject) as T;
  }
  // ArrayBuffer
  if (value instanceof ArrayBuffer) {
    return value.slice(0) as T;
  }
  // Plain object OR class instance
  const proto = Object.getPrototypeOf(value);
  const out = Object.create(proto);
  const keys = Object.keys(value as object);
  // Go down
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    (out as PlainObject)[k] = deepClone((value as PlainObject)[k]);
  }
  return out;
}

/******************************************************************************
                                Export
******************************************************************************/

export default parseObjectCore;
