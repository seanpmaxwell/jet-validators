import type { ParseError } from './parseObjectCore.js';

/******************************************************************************
                               Constants
******************************************************************************/

const symParseErrorArray = Symbol('parse-error-array');

/******************************************************************************
                              Functions
******************************************************************************/

/**
 * Set than an array is a parse error array.
 */
export function setIsParseErrorArray(array: ParseError[]): ParseError[] {
  Object.defineProperty(array, symParseErrorArray, {
    value: true,
    enumerable: false,
  });
  return array;
}

/**
 * Check than an array is a parse error array.
 */
export function isParseErrorArray(arg: unknown) {
  return (arg as Record<symbol, boolean>)[symParseErrorArray] === true;
}
