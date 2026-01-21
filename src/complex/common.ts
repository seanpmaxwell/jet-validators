/******************************************************************************
                                 Types
******************************************************************************/

export type ResolveMods<
  T,
  O extends boolean,
  N extends boolean,
  A extends boolean,
> =
  | T
  | (A extends true ? T[] : T)
  | (O extends true ? undefined : T)
  | (N extends true ? null : never);
