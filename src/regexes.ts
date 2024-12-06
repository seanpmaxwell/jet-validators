import { isString } from "./basic";
import { orNullable, orOptional } from "./common";


// **** Types **** //

export type TEmail = `${string}@${string}`;
export type TColor = `#${string}`;
export type TURL = `${string}`;
export type TAlphaNumber = `${string}`;


// **** Variables **** //

const DEFAULTS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  ALPHA_NUMERIC: /^[a-zA-Z0-9]*$/,
  URL: /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
} as const;


// Color
export const isColor = _matchesRegex<TColor>('COLOR');
export const isOptionalColor = orOptional(isColor);
export const isNullableColor = orNullable(isColor);
export const isNullishColor = orNullable(isOptionalColor);

// Email
export const isEmail = _matchesRegex<TEmail>('EMAIL');
export const isOptionalEmail = orOptional(isEmail);
export const isNullableEmail = orNullable(isEmail);
export const isNullishEmail = orNullable(isOptionalEmail);

// URL
export const isUrl = _matchesRegex<TURL>('URL');
export const isOptionalUrl = orOptional(isUrl);
export const isNullableUrl = orNullable(isUrl);
export const isNullishUrl = orNullable(isOptionalUrl);

// Alpha-Numeric String
export const isAlphaNumericString = _matchesRegex<string>('ALPHA_NUMERIC');
export const isOptionalAlphaNumericString = orOptional(isAlphaNumericString);
export const isNullableAlphaNumericString = orNullable(isAlphaNumericString);
export const isNullishAlphaNumericString = orNullable(isOptionalAlphaNumericString);


// **** Functions **** //

/**
 * See if a string satisfies the regex. NOTE: this lets an empty string be a 
 * valid value.
 */
function _matchesRegex<T>(name: string) {
  const envVar = process.env['JET_VALIDATORS_REGEX_' + name],
    rgx = !!envVar ? new RegExp(envVar) : DEFAULTS[name];
  return (arg: unknown): arg is T => {
    return (isString(arg) && arg.length < 254 && (arg === '' || rgx.test(arg)));
  };
}
