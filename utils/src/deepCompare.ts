/* eslint-disable max-len */
import { isObject, isString, isDate, TRecord } from '../../dist';


// **** Compare Objects **** //

type TDeepCompareCb = (key: string, val1: unknown, val2: unknown) => void;
type TDeepCompareFn = (arg1: unknown, arg2: unknown) => boolean;

interface IDeepCompareOptions {
  disregardDateException?: boolean;
  onlyCompareProps?: string | string[];
  convertToDateProps?: string | string[] | { rec: boolean, props: string | string [] };
}

interface IProcessedDeepCompareOptions {
  disregardDateException: boolean;
  onlyCompareProps?: string | string[];
  convertToDateProps?: { rec: boolean, props: string [] };
}

// Default function has no options
export const deepCompare = customDeepCompare({});

/**
 * Do a deep-comparison of two objects and fire a callback for each unequal 
 * value.
 */
export function customDeepCompare(optionsOrCb: IDeepCompareOptions, cb?: TDeepCompareCb): TDeepCompareFn;
export function customDeepCompare(optionsOrCb: TDeepCompareCb): TDeepCompareFn;
export function customDeepCompare(optionsOrCb: IDeepCompareOptions | TDeepCompareCb, cb?: TDeepCompareCb): TDeepCompareFn {
  // Process the options
  let optionsF: IProcessedDeepCompareOptions,
    cbF = cb;
  if (typeof optionsOrCb === 'object') {
    optionsF = _processOptions(optionsOrCb);
  } else if (typeof optionsOrCb === 'function') {
    cbF = optionsOrCb;
    optionsF = { disregardDateException: false };

  }
  // Return compare function
  return (arg1: unknown, arg2: unknown) => {
    const opts = { ...optionsF };
    return _customDeepCompareHelper(arg1, arg2, opts, cbF, '');
  };
}

/**
 * Setup the options object.
 */
function _processOptions(opts: IDeepCompareOptions): IProcessedDeepCompareOptions {
  // Init retVal
  const retVal: IProcessedDeepCompareOptions = {
    disregardDateException: !!opts.disregardDateException,
  };
  // Process "onlyCompareProps"
  if (!!opts.onlyCompareProps) {
    const ocp = opts.onlyCompareProps;
    if (isString(ocp)) {
      retVal.onlyCompareProps = [ocp];
    } else if (Array.isArray(ocp)) {
      retVal.onlyCompareProps = [ ...ocp ];
    }
  }
  // Process "convertToDateProps"
  if (!!opts.convertToDateProps) {
    const cdp = opts.convertToDateProps;
    if (isString(cdp)) {
      retVal.convertToDateProps = { rec: true, props: [cdp] };
    } else if (Array.isArray(cdp)) {
      retVal.convertToDateProps = { rec: true, props: [ ...cdp ] };
    } else if (isObject(cdp)) {
      retVal.convertToDateProps = {
        rec: cdp.rec,
        props: Array.isArray(cdp.props) ? [ ...cdp.props ] : [cdp.props],
      };
    }
  }
  // Return
  return retVal;
}

/**
 * Run the comparison logic.
 */
function _customDeepCompareHelper(
  arg1: unknown,
  arg2: unknown,
  options: IProcessedDeepCompareOptions,
  cb: TDeepCompareCb | undefined,
  paramKey: string,
): boolean {
  // ** Strict compare if not both objects ** //
  if (!isObject(arg1) ||arg1 === null || !isObject(arg2) || arg2 === null) {
    const isEqual = (arg1 === arg2);
    if (!isEqual && !!cb) {
      cb(paramKey, arg1, arg2);
    }
    return isEqual;
  }
  // ** Compare dates ** //
  if (!options.disregardDateException && (isDate(arg1) && isDate(arg2))) {
    const isEqual = (arg1.getTime() === arg2.getTime());
    if (!isEqual && !!cb) {
      cb(paramKey, arg1, arg2);
    }
    return isEqual;
  }
  // ** Compare arrays ** //
  if (Array.isArray(arg1) || Array.isArray(arg2)) {
    if (!(Array.isArray(arg1) && Array.isArray(arg2))) {
      cb?.(paramKey, arg1, arg2);
      return false;
    }
    if (!cb && arg1.length !== arg2.length) {
      return false;
    }
    let length = arg1.length,
      isEqualF = true;
    if (arg2.length > arg1.length) {
      length = arg2.length;
    }
    for (let i = 0; i < length; i++) {
      const isEqual = _customDeepCompareHelper(arg1[i], arg2[i], options, cb, 
        `Index: ${i}`);
      if (!isEqual) {
        if (!cb) {
          return false;
        }
        isEqualF = false;
      }
    }
    return isEqualF;
  }
  // ** Compare Object *** //
  // If only comparing some properties, filter out the unincluded keys.
  let keys1 = Object.keys(arg1),
    keys2 = Object.keys(arg2);
  if (!!options?.onlyCompareProps) {
    const props = options.onlyCompareProps;
    keys1 = keys1.filter(key => props.includes(key));
    keys2 = keys2.filter(key => props.includes(key));
  }
  if (!cb && keys1.length !== keys2.length) {
    return false;
  }
  // Setup convertToDateProps
  let convertToDateProps: string[] | undefined;
  if (!!options.convertToDateProps) {
    convertToDateProps = [ ...options.convertToDateProps.props ];
    if (!options.convertToDateProps.rec) {
      delete options.convertToDateProps;
    }
  }
  // Compare the properties of each object
  let keys = keys1;
  if (keys2.length > keys1.length) {
    keys = keys2;
  }
  let isEqual = true;
  for (const key of keys) {
    const val1 = (arg1 as TRecord)[key],
      val2 = (arg2 as TRecord)[key];
    // Check property is present for both
    if (
      Object.prototype.hasOwnProperty.call(arg1, key) &&
      !Object.prototype.hasOwnProperty.call(arg2, key)
    ) {
      if (!!cb) {
        cb(key, val1, 'not present');
        isEqual = false;
        continue;
      } else {
        return false;
      }
    } else if (
      !Object.prototype.hasOwnProperty.call(arg1, key) &&
      Object.prototype.hasOwnProperty.call(arg2, key)
    ) {
      if (!!cb) {
        cb(key, 'not present', val2);
        isEqual = false;
        continue;
      } else {
        return false;
      }
    }
    // Check if meant to converted to date first
    if (!!convertToDateProps?.includes(key)) {
      const d1 = new Date(val1 as string),
        d2 = new Date(val2 as string);
      if (d1.getTime() !== d2.getTime()) {
        if (!!cb) {
          cb(key, val1, val2);
          isEqual = false;
        } else {
          return false;
        }
      }
      continue;
    }
    // This option only applies to top level
    const optionsF = { ...options };
    if (options.onlyCompareProps) {
      delete optionsF.onlyCompareProps;
    }
    // Recursion
    if (!_customDeepCompareHelper(val1, val2, optionsF, cb, key)) {
      if (!cb) {
        return false;
      } 
      isEqual = false;
      continue;
    }
  }
  // Return
  return isEqual;
}
