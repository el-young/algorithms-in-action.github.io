/* eslint-disable no-param-reassign */
import * as Errors from './ErrorMessages';

/* 
  ValidateInput.js

  Input validation utilities. 

  Contract:
  - Return `null` -> input is valid
  - Return an ErrorMessages constant -> input is invalid

  Consumers must check explicitly for `null`, e.g.:

      const error = singleNumberValidCheck(input);
      if (error) showError(error);
  
  When using regex for validation, keep the match pattern as strict as possible 
  so that error messages remain precise and relevant. 
  If none of the existing constants in ErrorMessages.js fit your use case, 
  define a new one there.
*/


export const commaSeparatedNumberListValidCheck = (t) => {
  const regex = /^[0-9]+(,[0-9]+)*$/g;
  return t.match(regex) ? null : Errors.ERR_INVALID_NUMBER_LIST;
};

export const stringListValidCheck = (t) => {
  const regex = /^[a-zA-Z]+(,[a-zA-Z]+)*$/g;
  return t.match(regex) ? null : Errors.ERR_INVALID_STRING_LIST;
};

export const stringValidCheck = (t) => {
  const regex = /^[a-z\s]+$/g;
  return t.match(regex) ? null : Errors.ERR_INVALID_STRING;
};

export const singleNumberValidCheck = (t) => {
  const regex = /^\d+$/g;
  return t.match(regex) ? null : Errors.ERR_INVALID_SINGLE_NUMBER;
};

// Matrix must be symmetric with 0 diagonals
export const matrixValidCheck = (m) => {
  for (let i = 0; i < m.length; i++) {
    for (let j = 0; j < i; j++) {
      if (m[i][j] !== m[j][i]) return Errors.ERR_INVALID_MATRIX;
    }
    if (m[i][i] !== 0) return Errors.ERR_INVALID_MATRIX;
  }
  return null;
};

// Pair/triple validator
export const commaSeparatedPairTripleCheck = (allowPos, allowNeg, input) => {
  const regexPos = /^[0-9]+(-[0-9]+){0,2}$/g;
  const regexAll = /^[0-9]+(-[0-9]+){0,2}$|^-[0-9]+$/g;
  const regexNoPos = /^[0-9]+(-[0-9]+){1,2}$/g;

  const regex = allowPos
    ? (allowNeg ? regexAll : regexPos)
    : regexNoPos;

  for (const item of input.split(',')) {
    if (!item.match(regex)) return Errors.ERR_INVALID_PAIR_TRIPLE;
  }
  return null;
};

// Range validity check
export const checkAllRangesValid = (values) => {
  for (const item of values) {
    const [a, b] = item.split('-').map(Number);
    if ((item.split('-').length >= 2) && a > b) {
      return Errors.ERR_INVALID_RANGE;
    }
  }
  return null;
};