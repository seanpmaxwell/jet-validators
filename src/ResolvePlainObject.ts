type BuiltInObject =
  | Function
  | Date
  | Error
  | RegExp
  | Promise<any>
  | Array<any>
  | ReadonlyArray<any>
  | Map<any, any>
  | Set<any>
  | WeakMap<any, any>
  | WeakSet<any>
  | ArrayBuffer
  | SharedArrayBuffer
  | DataView
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

export type ResolvePlainObject<T> = T extends object
  ? T extends BuiltInObject
    ? false
    : true
  : false;
