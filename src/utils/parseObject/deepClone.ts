/******************************************************************************
                                  Types
******************************************************************************/

type PlainObject = Record<string, unknown>;

/******************************************************************************
                        DeepClone stuff from ChatGPT
******************************************************************************/

function deepClone<T>(value: T): T {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  if (Array.isArray(value)) {
    return cloneArray(value) as T;
  }
  const proto = Object.getPrototypeOf(value);
  if (proto === Object.prototype || proto === null) {
    return clonePlainObject(value as PlainObject) as T;
  }
  return cloneExotic(value);
}

function cloneArray(source: unknown[]): unknown[] {
  const out = new Array(source.length);
  for (let i = 0; i < source.length; i++) {
    out[i] = deepClone(source[i]);
  }
  return out;
}

function clonePlainObject(source: PlainObject): PlainObject {
  const out: PlainObject = {};
  const keys = Object.keys(source);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    out[key] = deepClone(source[key]);
  }
  return out;
}

function cloneExotic<T>(value: T): T {
  if (value instanceof Date) return new Date(value.getTime()) as T;
  if (value instanceof RegExp)
    return new RegExp(value.source, value.flags) as T;
  if (value instanceof Map) {
    const out = new Map();
    for (const [k, v] of value) out.set(deepClone(k), deepClone(v));
    return out as T;
  }
  if (value instanceof Set) {
    const out = new Set();
    for (const v of value) out.add(deepClone(v));
    return out as T;
  }
  if (ArrayBuffer.isView(value)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new (value.constructor as any)(
      value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength),
    );
  }
  if (value instanceof ArrayBuffer) {
    return value.slice(0) as T;
  }
  const out = Object.create(Object.getPrototypeOf(value));
  for (const key of Object.keys(value as object)) {
    out[key] = deepClone((value as PlainObject)[key]);
  }
  return out;
}

/******************************************************************************
                        DeepClone stuff from ChatGPT
******************************************************************************/

export default deepClone;
