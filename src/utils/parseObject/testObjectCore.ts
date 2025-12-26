import parseObjectCore, {
  type OnErrorCallback,
  type Safety,
} from './parseObjectCore';

import type { Schema } from './parseObject';
import { markSafe } from './mark-safe';

/******************************************************************************
                             Constants/Types
******************************************************************************/

const symTestObjectFn = Symbol('testObject-function');
type SafeFunction = Record<symbol, boolean>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TFunc = (...args: any[]) => any;

type TestObjectFn = (
  arg: unknown,
  onError?: OnErrorCallback,
  modifiedValueCb?: (modifiedValue: unknown) => void,
) => arg is unknown;

/******************************************************************************
                                Helpers
******************************************************************************/

/**
 * Wrap the testObject function to return a type-predicate.
 */
function testObjectCore<T>(
  optional: boolean,
  nullable: boolean,
  isArray: boolean,
  schema: Schema<T>,
  safety: Safety,
  onError?: OnErrorCallback,
) {
  // Setup the parse function
  const parseFn = parseObjectCore(
    optional,
    nullable,
    isArray,
    schema,
    safety,
    onError,
  );
  // Wrap type predicate function around the parse function
  const userFacingFn = (
    arg: unknown,
    onError?: OnErrorCallback,
    modifiedValueCb?: (modifiedValue: unknown) => void,
  ): arg is T => {
    const result = parseFn(arg, onError);
    modifiedValueCb?.(result);
    return result !== false;
  };
  // Add symbols
  (userFacingFn as unknown as SafeFunction)[symTestObjectFn] = true;
  markSafe(userFacingFn);
  // Return the test predicate function
  return userFacingFn;
}

/**
 * Check is the function a testObjectCore function
 */
export function isTestObjectCoreFn(arg: TFunc): arg is TestObjectFn {
  return (arg as unknown as SafeFunction)[symTestObjectFn] === true;
}

/******************************************************************************
                                Export
******************************************************************************/

export default testObjectCore;
