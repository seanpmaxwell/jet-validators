import { markSafe } from '../utils/parseObject/mark-safe.js';

/******************************************************************************
                              Constants
******************************************************************************/

const DEFAULT_ERROR_MESSAGE = (value: unknown, reason?: string) =>
  `The value "${value}" failed to pass string validation. Reason: <${reason}>`;

/******************************************************************************
                              Types
******************************************************************************/

// **** The Input Option **** //

type NullabilityOptions =
  | {
      optional?: true;
      nullable?: true;
      nullish?: never;
    }
  | {
      nullish: true;
      optional?: never;
      nullable?: never;
    }
  | {
      optional?: false | undefined;
      nullable?: false | undefined;
      nullish?: false | undefined;
    };

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
} & NullabilityOptions &
  ThrowOptions &
  LengthOptions;

// **** Resolve the Return Type **** //

type ResolveReturnValue<O> = O extends { nullish: true }
  ? null | undefined
  : O extends { optional: true; nullable: true }
    ? null | undefined
    : O extends { optional: true }
      ? undefined
      : O extends { nullable: true }
        ? null
        : never;

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Determine if the string is valid based on the options.
 */
function isValidString<T extends string, O extends Options = Options>(
  options: O,
): (arg: unknown) => arg is T | ResolveReturnValue<O> {
  const {
    regex,
    throws = false,
    errorMessage = DEFAULT_ERROR_MESSAGE,
  } = options;

  // Set nullables
  let nullable = false,
    optional = false;
  if ('nullish' in options && !!options.nullish) {
    optional = true;
    nullable = true;
  } else {
    if ('optional' in options && !!options.optional) {
      optional = true;
    }
    if ('nullable' in options && !!options.nullable) {
      nullable = true;
    }
  }

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
  const isValidString = (arg: unknown): arg is T & ResolveReturnValue<O> => {
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

/******************************************************************************
                                Export
******************************************************************************/

export default isValidString;
