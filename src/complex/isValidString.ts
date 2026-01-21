import { markSafe } from '../utils/parseObject/mark-safe.js';

import type { ResolveMods } from './common.js';

/******************************************************************************
                              Constants
******************************************************************************/

const DEFAULT_ERROR_MESSAGE = (value: unknown, reason?: string) =>
  `The value "${value}" failed to pass string validation. Reason: <${reason}>`;

/******************************************************************************
                              Types
******************************************************************************/

type CollpaseType<T> = T extends unknown ? T : never;

type ThrowOptions =
  | {
      throws: true;
      errorMessage?: (value?: unknown, reason?: string) => string;
    }
  | {
      throws?: false | undefined;
      errorMessage?: never;
    };

type LengthOptions =
  | {
      length: number;
      minLength?: never;
      maxLength?: never;
    }
  | {
      length?: never;
      minLength?: number;
      maxLength?: number;
    };

type Options = {
  regex?: RegExp;
} & ThrowOptions &
  LengthOptions;

/******************************************************************************
                               Export Variants
******************************************************************************/

export function isValidString<T extends string = string>(options: Options) {
  return isValidStringCore<T, false, false>(options, false, false);
}

export function isOptionalValidString<T extends string = string>(
  options: Options,
) {
  return isValidStringCore<T, true, false>(options, true, false);
}

export function isNullableValidString<T extends string = string>(
  options: Options,
) {
  return isValidStringCore<T, false, true>(options, false, true);
}

export function isNullishValidString<T extends string = string>(
  options: Options,
) {
  return isValidStringCore<T, true, true>(options, true, true);
}

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Determine if the string is valid based on the options.
 */
function isValidStringCore<
  T extends string,
  O extends boolean,
  N extends boolean,
>(
  options: Options,
  optional: boolean,
  nullable: boolean,
): (arg: unknown) => arg is CollpaseType<ResolveMods<T, O, N, false>> {
  const {
    regex,
    throws = false,
    errorMessage = DEFAULT_ERROR_MESSAGE,
  } = options;

  // Set handle failed function
  let handleFailed;
  if (throws) {
    handleFailed = (value: unknown, reason?: string) => {
      throw new Error(errorMessage(value, reason));
    };
  } else {
    handleFailed = () => false;
  }

  // Set the min/max lengths
  let minLength = 0,
    maxLength: undefined | number,
    explicitEmptyStringAllowed = false;
  if ('length' in options && options.length !== undefined) {
    minLength = options.length;
    maxLength = options.length;
  } else {
    if (
      'minLength' in options &&
      options.minLength !== undefined &&
      options.minLength >= 0
    ) {
      minLength = options.minLength;
      explicitEmptyStringAllowed = minLength === 0;
    }
    if (
      'maxLength' in options &&
      options.maxLength !== undefined &&
      options.maxLength >= 0
    ) {
      maxLength = options.maxLength;
    }
  }

  // Validator function
  const isValidString = (arg: unknown): arg is ResolveMods<T, O, N, false> => {
    if (arg === undefined) {
      return optional ? true : handleFailed(arg, 'optional');
    }
    if (arg === null) {
      return nullable ? true : handleFailed(arg, 'nullable');
    }
    if (typeof arg !== 'string') {
      return handleFailed(arg, 'not-string');
    }
    if (arg === '' && explicitEmptyStringAllowed) {
      return true;
    }
    if (arg.length < minLength) {
      return handleFailed(arg, 'min-length');
    }
    if (maxLength !== undefined && arg.length > maxLength) {
      return handleFailed(arg, 'max-length');
    }
    if (regex !== undefined) {
      if (!regex.test(arg)) return handleFailed(arg, 'regex');
    }
    return true;
  };
  markSafe(isValidString);
  return isValidString;
}
