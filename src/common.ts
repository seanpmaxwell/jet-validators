// **** Types **** //

// Misc
export type TValidateWithTransform<T> = (arg: unknown, cb?: (arg: T) => void) => arg is T;

// Add modifiers
type AddNull<T, N> = (N extends true ? T | null : T);
export type AddNullables<T, O, N> = (O extends true ? AddNull<T, N> | undefined  : AddNull<T, N>);
export type AddMods<T, O, N, A> = A extends true ? AddNullables<T[], O, N> : AddNullables<T, O, N>;


// **** Functions **** //

/**
 * Allow param to be undefined
 */
export function orOptional<T>(cb: ((arg: unknown) => arg is T)) {
  return (arg: unknown): arg is (T | undefined) => {
    if (arg === undefined) {
      return true;
    } else {
      return cb(arg);
    }
  };
}

/**
 * Allow param to be undefined
 */
export function orNullable<T>(cb: ((arg: unknown) => arg is T)) {
  return (arg: unknown): arg is (T | null) => {
    if (arg === null) {
      return true;
    } else {
      return cb(arg);
    }
  };
}