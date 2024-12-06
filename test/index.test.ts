import { expect, test } from 'vitest';

import {

} from '../src';

/**
 * Test all the basic validators
 */
test('test basic validators', () => {
  
  // Nullables
  expect(isUndef(undefined)).toStrictEqual(true);
  expect(isNull(null)).toStrictEqual(true);
  expect(isNoU(null)).toStrictEqual(true);
  expect(isNoU(undefined)).toStrictEqual(true);

  // Booleans
  expect(isBool(false)).toStrictEqual(true);
  expect(isBool('asdf')).toStrictEqual(false);
  expect(isOptBool(false)).toStrictEqual(true);
  expect(isOptBool(undefined)).toStrictEqual(true);
  expect(isNulBool(false)).toStrictEqual(true);
  expect(isNulBool(null)).toStrictEqual(true);
  expect(isNishBool(false)).toStrictEqual(true);
  expect(isNishBool(null)).toStrictEqual(true);
  expect(isNishBool(undefined)).toStrictEqual(true);

  // Is valid boolean
  expect(isValidBool(false)).toStrictEqual(true);
  expect(isValidBool(true)).toStrictEqual(true);
  expect(isValidBool('Yes')).toStrictEqual(true);
  expect(isValidBool('no')).toStrictEqual(true);
  expect(isValidBool('1')).toStrictEqual(true);
  expect(isValidBool('0')).toStrictEqual(true);
  expect(isValidBool(1)).toStrictEqual(true);
  expect(isValidBool(0)).toStrictEqual(true);
  expect(isValidBool('False')).toStrictEqual(true);
  expect(isValidBool('tRuE')).toStrictEqual(true);
  expect(isValidBool(1234)).toStrictEqual(false);
  expect(isValidBool(undefined)).toStrictEqual(false);

  // Boolean Arrays
  expect(isBoolArr([false, true, false])).toStrictEqual(true);
  expect(isBoolArr([false, true, 'asdf'])).toStrictEqual(false);
  expect(isBoolArr(true)).toStrictEqual(false);
  expect(isOptBoolArr([false, true, false])).toStrictEqual(true);
  expect(isOptBoolArr(undefined)).toStrictEqual(true);
  expect(isNulBoolArr([false, true, false])).toStrictEqual(true);
  expect(isNulBoolArr(null)).toStrictEqual(true);
  expect(isNishBoolArr([false, true, false])).toStrictEqual(true);
  expect(isNishBoolArr(null)).toStrictEqual(true);
  expect(isNishBoolArr(undefined)).toStrictEqual(true);

  // Numbers
  expect(isNum(123)).toStrictEqual(true);
  expect(isNum(false)).toStrictEqual(false);
  expect(isOptNum(123)).toStrictEqual(true);
  expect(isOptNum(undefined)).toStrictEqual(true);
  expect(isNulNum(123)).toStrictEqual(true);
  expect(isNulNum(null)).toStrictEqual(true);
  expect(isNishNum(123)).toStrictEqual(true);
  expect(isNishNum(null)).toStrictEqual(true);
  expect(isNishNum(undefined)).toStrictEqual(true);

  // Valid numbers
  expect(isValidNum('123')).toStrictEqual(true);

  // Number Arrays
  expect(isNumArr([1, 2, 3])).toStrictEqual(true);
  expect(isNumArr([false, true, '123'])).toStrictEqual(false);
  expect(isNumArr(123)).toStrictEqual(false);
  expect(isOptNumArr([1, 2 ,3])).toStrictEqual(true);
  expect(isOptNumArr(undefined)).toStrictEqual(true);
  expect(isNulNumArr([1, 2, 3])).toStrictEqual(true);
  expect(isNulNumArr(null)).toStrictEqual(true);
  expect(isNishNumArr([1, 2, 3])).toStrictEqual(true);
  expect(isNishNumArr(null)).toStrictEqual(true);
  expect(isNishNumArr(undefined)).toStrictEqual(true);

  // BigInt
  expect(isBigInt(1234567890123456789012345n)).toStrictEqual(true);
  expect(isOptBigInt(undefined)).toStrictEqual(true);

  // Strings
  expect(isStr('123')).toStrictEqual(true);
  expect(isStr(false)).toStrictEqual(false);
  expect(isOptStr('123')).toStrictEqual(true);
  expect(isOptStr(undefined)).toStrictEqual(true);
  expect(isNulStr('123')).toStrictEqual(true);
  expect(isNulStr(null)).toStrictEqual(true);
  expect(isNishStr('123')).toStrictEqual(true);
  expect(isNishStr(null)).toStrictEqual(true);
  expect(isNishStr(undefined)).toStrictEqual(true);

  // Non-Empty Strings
  expect(isNeStr('123')).toStrictEqual(true);
  expect(isNeStr('')).toStrictEqual(false);
  expect(isOptNeStr('123')).toStrictEqual(true);
  expect(isOptNeStr(undefined)).toStrictEqual(true);
  expect(isNulNeStr('123')).toStrictEqual(true);
  expect(isNulNeStr(null)).toStrictEqual(true);
  expect(isNishNeStr('123')).toStrictEqual(true);
  expect(isNishNeStr('')).toStrictEqual(false);
  expect(isNishNeStr(null)).toStrictEqual(true);
  expect(isNishNeStr(undefined)).toStrictEqual(true);

  // String Arrays
  expect(isStrArr(['1', '2', '3'])).toStrictEqual(true);
  expect(isStrArr(['false', '123', true])).toStrictEqual(false);
  expect(isStrArr('123')).toStrictEqual(false);
  expect(isOptStrArr(['1', '2', '3'])).toStrictEqual(true);
  expect(isOptStrArr(undefined)).toStrictEqual(true);
  expect(isNulStrArr(['1', '2', '3'])).toStrictEqual(true);
  expect(isNulStrArr(null)).toStrictEqual(true);
  expect(isNishStrArr(['1', '2', '3'])).toStrictEqual(true);
  expect(isNishStrArr(null)).toStrictEqual(true);
  expect(isNishStrArr(undefined)).toStrictEqual(true);

  // Symbol
  expect(isSymbol(Symbol('foo'))).toStrictEqual(true);
  expect(isSymbol(false)).toStrictEqual(false);
  expect(isOptSymbol(Symbol('foo'))).toStrictEqual(true);
  expect(isOptSymbol(undefined)).toStrictEqual(true);
  expect(isNulSymbol(Symbol('foo'))).toStrictEqual(true);
  expect(isNulSymbol(null)).toStrictEqual(true);
  expect(isNishSymbol(Symbol('foo'))).toStrictEqual(true);
  expect(isNishSymbol(null)).toStrictEqual(true);
  expect(isNishSymbol(undefined)).toStrictEqual(true);

  // Date
  const D1 = new Date();
  expect(isDate(D1)).toStrictEqual(true);
  expect(isDate(false)).toStrictEqual(false);
  expect(isOptDate(D1)).toStrictEqual(true);
  expect(isOptDate(undefined)).toStrictEqual(true);
  expect(isNulDate(D1)).toStrictEqual(true);
  expect(isNulDate(null)).toStrictEqual(true);
  expect(isNishDate(D1)).toStrictEqual(true);
  expect(isNishDate(null)).toStrictEqual(true);
  expect(isNishDate(undefined)).toStrictEqual(true);

  // Valid Dates
  expect(isValidDate(1731195800809)).toStrictEqual(true);
  expect(isValidDate('2024-11-09T23:43:58.788Z')).toStrictEqual(true);
  expect(isValidDate('2024-111-09T23:43:58.788Z')).toStrictEqual(false);
  expect(isValidDate(12341234123412342)).toStrictEqual(false);

  // Date Arrays
  const D2 = new Date(), D3 = new Date();
  expect(isDateArr([D1, D2, D3])).toStrictEqual(true);
  expect(isDateArr([D1, D2, '2024-10-30T20:08:36.838Z'])).toStrictEqual(false);
  expect(isDateArr(D1)).toStrictEqual(false);
  expect(isOptDateArr([D1, D2, D3])).toStrictEqual(true);
  expect(isOptDateArr(undefined)).toStrictEqual(true);
  expect(isNulDateArr([D1, D2, D3])).toStrictEqual(true);
  expect(isNulDateArr(null)).toStrictEqual(true);
  expect(isNishDateArr([D1, D2, D3])).toStrictEqual(true);
  expect(isNishDateArr(null)).toStrictEqual(true);
  expect(isNishDateArr(undefined)).toStrictEqual(true);

  // Obj
  const O1 = { val: 1 };
  expect(isObj(O1)).toStrictEqual(true);
  expect(isObj(false)).toStrictEqual(false);
  expect(isOptObj(O1)).toStrictEqual(true);
  expect(isOptObj(undefined)).toStrictEqual(true);
  expect(isNulObj(O1)).toStrictEqual(true);
  expect(isNulObj(null)).toStrictEqual(true);
  expect(isNishObj(O1)).toStrictEqual(true);
  expect(isNishObj(null)).toStrictEqual(true);
  expect(isNishObj(undefined)).toStrictEqual(true);

  // Obj Arrays
  const O2 = { val: 2 }, O3 = { val: 3 };
  expect(isObjArr([O1, O2, O3])).toStrictEqual(true);
  expect(isObjArr([O1, O2, '2024-10-30T20:08:36.838Z'])).toStrictEqual(false);
  expect(isObjArr(O1)).toStrictEqual(false);
  expect(isOptObjArr([O1, O2, O3])).toStrictEqual(true);
  expect(isOptObjArr(undefined)).toStrictEqual(true);
  expect(isNulObjArr([O1, O2, O3])).toStrictEqual(true);
  expect(isNulObjArr(null)).toStrictEqual(true);
  expect(isNishObjArr([O1, O2, O3])).toStrictEqual(true);
  expect(isNishObjArr(null)).toStrictEqual(true);
  expect(isNishObjArr(undefined)).toStrictEqual(true);

  // Functions
  const F1 = () => 1;
  expect(isFunc(F1)).toStrictEqual(true);
  expect(isFunc(false)).toStrictEqual(false);
  expect(isOptFunc(F1)).toStrictEqual(true);
  expect(isOptFunc(undefined)).toStrictEqual(true);
  expect(isNulFunc(F1)).toStrictEqual(true);
  expect(isNulFunc(null)).toStrictEqual(true);
  expect(isNishFunc(F1)).toStrictEqual(true);
  expect(isNishFunc(null)).toStrictEqual(true);
  expect(isNishFunc(undefined)).toStrictEqual(true);

  // Function Arrays
  const F2 = () => 2, F3 = () => 3;
  expect(isFuncArr([F1, F2, F3])).toStrictEqual(true);
  expect(isFuncArr([F1, F2, '2024-10-30T20:08:36.838Z'])).toStrictEqual(false);
  expect(isFuncArr(F1)).toStrictEqual(false);
  expect(isOptFuncArr([F1, F2, F3])).toStrictEqual(true);
  expect(isOptFuncArr(undefined)).toStrictEqual(true);
  expect(isNulFuncArr([F1, F2, F3])).toStrictEqual(true);
  expect(isNulFuncArr(null)).toStrictEqual(true);
  expect(isNishFuncArr([F1, F2, F3])).toStrictEqual(true);
  expect(isNishFuncArr(null)).toStrictEqual(true);
  expect(isNishFuncArr(undefined)).toStrictEqual(true);






});
