import { isPlainObject } from '../../basic.js';
import { isSafe } from './mark-safe.js';

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
  NestedValidation: 'Nested validation failed.',
  ValidatorFn: 'Validator function returned false.',
  StrictSafety: 'Strict mode: unknown or invalid property',
  SchemaProp: 'Schema property must be a function or nested schema',
} as const;

/******************************************************************************
                                  Types
******************************************************************************/

type TSafety = (typeof SAFETY)[keyof typeof SAFETY];
type TValidatorFn = (value: unknown) => boolean;
type PlainObject = Record<string, unknown>;

// **** Validation Schema **** //

interface ICoreSchema {
  [key: string]: TValidatorFn | ICoreSchema;
}

interface IValidatorItem {
  key: string;
  fn: TValidatorFn;
  idx: number;
  name: string;
}

interface INode {
  key: string;
  safeValidators: IValidatorItem[];
  unSafeValidators: IValidatorItem[];
  parent: INode | null;
  path: string[];
  children: INode[];
  valueObject: PlainObject;
  // Track validations
  keyIndex: Record<string, number>;
  seen: Uint32Array;
}

type Frame = {
  node: INode;
  childIndex: number;
  entered: boolean;
};

// **** Error Handling **** //

export type OnErrorCallback = (errors: ErrorItem[]) => void;

interface IErrorState {
  errors: ErrorItem[];
  hasErrors: boolean;
}

type ErrorItem = {
  info: string;
  functionName: string; // name of the validator function
  value?: unknown;
  caught?: string; // if a ValidatorItem caught an error from an unsafe function
} & (
  | {
      key: string; // root validator failed
    }
  | {
      keyPath: string[]; // nested validator failed
    }
);

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
  schema: ICoreSchema,
  safety: TSafety,
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
    const errorState: IErrorState | null =
      onError || localOnError ? { errors: [], hasErrors: false } : null;

    // Check undefined
    if (param === undefined) {
      if (isOptional) return undefined;
      if (!!errorState) {
        errorState.hasErrors = true;
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
    if (param === isNullable) {
      if (isNullable) return null;
      if (!!errorState) {
        errorState.hasErrors = true;
        errorState.errors.push({
          info: ERRORS.NotNullable,
          functionName: '<isNullable>',
          value: null,
          key: '',
        });
      }
      return false;
    }

    // Check null
    if (!isPlainObject(param)) {
      if (!!errorState) {
        errorState.hasErrors = true;
        errorState.errors.push({
          info: ERRORS.NotObject,
          functionName: '<isPlainObject>',
          value: param,
          key: '',
        });
      }
      return false;
    }

    // ** If an array ** //
    if (isArray) {
      if (!Array.isArray(param)) {
        if (!!errorState) {
          errorState.hasErrors = true;
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
      for (let i = 0; i < param.length; i++) {
        const result = finalParseFn(param, root, runId, errorState, index);
        if (result !== false) {
          param[i] = result;
        } else {
          isValid = false;
        }
        // pick up here, pass the index down through the levels, if index
        // is not undefined add it before the parent path
        // if (errorState?.hasErrors) {
        //   errorState.errors.forEach((err: ErrorItem) => {
        //     if ('key' in err) {
        //       (err as PlainObject).keyPath = [i.toString(), err.key];
        //     } else {
        //       err.keyPath = [i.toString(), ...err.keyPath];
        //     }
        //   });
        // }
      }
      return isValid ? param : false;
    }

    // Reset the runId if it gets to 4billion
    if (++runId === 0xffffffff) {
      runId = 1;
      resetSeen(root);
    }

    // Return
    return finalParseFn(param, root, runId, errorState);
  };
}

/**
 * Setup fast validator tree
 */
function setupValidatorTree(
  schema: ICoreSchema,
  parentNode: INode | null,
  paramKey: string,
): INode {
  // Setup keys
  const keys = Object.keys(schema);
  const keyIndex: Record<string, number> = Object.create(null);
  for (let i = 0; i < keys.length; i++) {
    keyIndex[keys[i]] = i;
  }
  // Initialize new node
  const node: INode = {
    key: paramKey,
    safeValidators: [],
    unSafeValidators: [],
    parent: parentNode,
    children: [],
    path: parentNode ? [...parentNode.path, paramKey] : [],
    valueObject: {},
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
 * parse in strict mode
 */
function parseStrict(
  param: PlainObject,
  root: INode,
  runId: number,
  errorState: IErrorState | null,
  index?: number,
) {
  root.valueObject = param;
  const stack: Frame[] = [
    {
      node: root,
      childIndex: 0,
      entered: false,
    },
  ];
  // Iterate
  while (stack.length) {
    const frame = stack[stack.length - 1];
    const node = frame.node;
    if (!frame.entered) {
      frame.entered = true;
      const { canDescend } = runValidators(node, runId, errorState);
      if (canDescend && frame.childIndex < node.children.length) {
        const child = node.children[frame.childIndex++];
        stack.push({ node: child, childIndex: 0, entered: false });
        continue;
      }
    }
    if (!sanitizeStrict(node, runId, errorState)) return false;
    stack.pop();
  }
  return root.valueObject;
}

/**
 * sanitize/clone for strict mode
 */
function sanitizeStrict(
  node: INode,
  runId: number,
  errorState: IErrorState | null,
): boolean {
  const nodeVal = node.valueObject,
    clean: PlainObject = {};
  // Clean object
  const keys = Object.keys(nodeVal),
    keysLength = keys.length;
  for (let i = 0; i < keysLength; i++) {
    const k = keys[i],
      kIdx = node.keyIndex[k];
    if (kIdx === undefined || node.seen[kIdx] !== runId) {
      if (errorState) {
        errorState.hasErrors = true;
        errorState.errors.push({
          info: ERRORS.StrictSafety,
          functionName: '<strict>',
          value: nodeVal[k],
          ...(node.parent ? { keyPath: [...node.path, k] } : { key: k }),
        });
      }
      return false;
    }
    const v = nodeVal[k];
    clean[k] = v !== null && typeof v === 'object' ? deepClone(v) : v;
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
  root: INode,
  runId: number,
  errorState: IErrorState | null,
) {
  root.valueObject = param;
  const stack: Frame[] = [
    {
      node: root,
      childIndex: 0,
      entered: false,
    },
  ];
  while (stack.length) {
    const frame = stack[stack.length - 1];
    const node = frame.node;
    if (!frame.entered) {
      frame.entered = true;
      const { canDescend } = runValidators(node, runId, errorState);
      if (canDescend && frame.childIndex < node.children.length) {
        const child = node.children[frame.childIndex++];
        stack.push({ node: child, childIndex: 0, entered: false });
        continue;
      }
    }
    sanitizeNormal(node, runId);
    stack.pop();
  }
  // Return
  return errorState?.hasErrors ? false : root.valueObject;
}

/**
 * Sanitize in for normal mode
 */
function sanitizeNormal(node: INode, runId: number): void {
  const nodeVal = node.valueObject,
    clean: PlainObject = {},
    keys = Object.keys(nodeVal);
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i],
      kIdx = node.keyIndex[k];
    if (kIdx !== undefined && node.seen[kIdx] === runId) {
      const v = nodeVal[k];
      clean[k] = v !== null && typeof v === 'object' ? deepClone(v) : v;
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
  root: INode,
  runId: number,
  errorState: IErrorState | null,
) {
  root.valueObject = param;
  const stack: Frame[] = [
    {
      node: root,
      childIndex: 0,
      entered: false,
    },
  ];
  // Iterate
  while (stack.length) {
    const frame = stack[stack.length - 1];
    const node = frame.node;
    if (!frame.entered) {
      frame.entered = true;
      const { canDescend } = runValidators(node, runId, errorState);
      if (canDescend && frame.childIndex < node.children.length) {
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
 * Sanitize for loose mode
 */
function sanitizeLoose(node: INode): void {
  const nodeVal = node.valueObject,
    clean: PlainObject = {},
    keys = Object.keys(nodeVal);
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i],
      v = nodeVal[k];
    clean[k] = v !== null && typeof v === 'object' ? deepClone(v) : v;
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
  node: INode,
  runId: number,
  errorState: IErrorState | null,
  index?: number,
): ValidationResult {
  // Set the value object on the child
  if (node.parent) {
    const parentNodeVal = node.parent.valueObject,
      nodeVal = parentNodeVal[node.key];
    if (!isPlainObject(nodeVal)) {
      if (!!errorState) {
        errorState.hasErrors = true;
        let keyPath = [...node.parent.path, node.key];
        if (index !== undefined) {
          keyPath = [index.toString(), ...keyPath];
        }
        errorState.errors.push({
          info: ERRORS.SchemaProp,
          functionName: '<object>',
          value: nodeVal,
          keyPath,
        });
      }
      return { isValid: false, canDescend: false };
    }
    node.valueObject = nodeVal;
    const parentIdx = node.parent.keyIndex[node.key];
    node.parent.seen[parentIdx] = runId;
  }
  // Run safe validators
  let isValid = false;
  const nodeVal = node.valueObject;
  for (const vldr of node.safeValidators) {
    const toValidate = nodeVal[vldr.key];
    if (!vldr.fn(toValidate)) {
      isValid = false;
      if (errorState) {
        errorState.hasErrors = true;
        errorState.errors.push({
          info: ERRORS.ValidatorFn,
          functionName: vldr.name,
          value: toValidate,
          // pick up here, remember to do all places where an error is pushed
          ...(node.parent
            ? { keyPath: [...node.path, vldr.key] }
            : { key: vldr.key }),
        });
      }
    } else {
      node.seen[vldr.idx] = runId;
    }
  }
  // Run unsafe validators
  for (const vldr of node.unSafeValidators) {
    try {
      if (!vldr.fn(nodeVal[vldr.key])) throw null;
      node.seen[vldr.idx] = runId;
    } catch (err) {
      isValid = false;
      if (errorState) {
        errorState.hasErrors = true;
        errorState.errors.push({
          info: ERRORS.ValidatorFn,
          functionName: vldr.name,
          value: nodeVal[vldr.key],
          caught: err ? String(err) : undefined,
          ...(node.parent
            ? { keyPath: [...node.path, vldr.key] }
            : { key: vldr.key }),
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
    return new (value.constructor as any)(
      value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength),
    );
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

/**
 * This walks the validator tree once and clears all seen arrays.
 * it runs once every ~4 billion validations.
 */
function resetSeen(root: INode): void {
  const stack: INode[] = [root];
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
