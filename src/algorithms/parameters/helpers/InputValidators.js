/*
    This file contains input validation helpers.
    They should return a collection containing
    true/false and an error message which is pulled
    from the central repository ErrorMessages.js.
*/

import { ERRORS } from './ErrorExampleStrings';

export const commaSeparatedNumberListValidCheck = (t) => {
  if (!t || t.trim() === "") {
    return { valid: false, error: ERRORS.GEN_EMPTY_INPUT };
  }

  const regex = /^[0-9]+(,[0-9]+)*$/;
  if (!regex.test(t)) {
    return { valid: false, error: ERRORS.GEN_ONLY_POSITIVE_NUMBERS_LIST };
  }

  return { valid: true, error: null };
};

export const stringListValidCheck = (t) => {
  if (!t || t.trim() === "") {
    return { valid: false, error: ERRORS.GEN_EMPTY_INPUT };
  }

  const regex = /^[a-zA-Z]+(,[a-zA-Z]+)*$/g;
  if (!regex.test(t)) {
    return { valid: false, error: ERRORS.GEN_ONLY_LOWERCASE };
  }

  return { valid: true, error: null };
};

export const stringValidCheck = (t) => {
  const regex = /^[a-z\s]+$/g;

  if (!t || t.trim() === "") {
    return { valid: false, error: ERRORS.GEN_EMPTY_INPUT };
  }

  if (!regex.test(t)) {
    return { valid: false, error: ERRORS.GEN_ONLY_LOWERCASE };
  }

  return { valid: true, error: null };
};

export const singleNumberValidCheck = (t) => {
  const regex = /^\d+$/;

  if (!t || t.trim() === "") {
    return { valid: false, error: ERRORS.GEN_EMPTY_INPUT };
  }

  if (!regex.test(t)) {
    return { valid: false, error: ERRORS.GEN_ONLY_POSITIVE_INTEGERS };
  }

  return { valid: true, error: null };
};

// eslint-disable-next-line consistent-return
export const matrixValidCheck = (m) => {
  for (let i = 0; i < m.length; i++) {
    for (let j = 0; j < i; j++) {
      if (m[i][j] !== m[j][i]) {
        return { valid: false, error: ERRORS.GEN_MATRIX_NOT_SYMMETRIC };
      }
    }
    if (m[i][i] !== 0) {
      return { valid: false, error: ERRORS.GEN_MATRIX_DIAGONAL_NOT_ZERO };
    }
  }
  return { valid: true, error: null };
};

/**
 * Check if the input string are comma-separated numbers, pairs and triples
 * @param {*} allowPosInteger if true it allows positive integers
 * @param {*} allowNegInteger if true it allows negative integers
 * @param {*} input the input string
 */
export const commaSeparatedPairTripleCheck = (allowPosInteger, allowNegInteger, input) => {
  const regex_pos_num = /^[0-9]+(-[0-9]+){0,2}$/g;
  const regex_all_num = /^[0-9]+(-[0-9]+){0,2}$|^-[0-9]+$/g;
  const regex_no_num = /^[0-9]+(-[0-9]+){1,2}$/g;
  let array = input.split(",");

  for (let item of array) {
    if (!item.match(allowPosInteger ? (allowNegInteger ? regex_all_num : regex_pos_num) : regex_no_num)) {
      return { valid: false, error: ERRORS.HASHING_INVALID_INPUT_INSERT };
    }
  }
  return { valid: true, error: null };
};

/**
 * Check if all ranges in array of inputs are valid (e.g for a-b, a must < b)
 * @param {*} values array of inputs
 */
export const checkAllRangesValid = (values) => {
  for (let item of values) {
    let rangesItems = item.split("-").map(Number);
    if ((rangesItems.length == 2 || rangesItems.length == 3) && rangesItems[0] > rangesItems[1]) {
      return { valid: false, error: ERRORS.HASHING_INVALID_RANGES };
    }
  }
  return { valid: true, error: null };
};

export const coordsValidCheck = (t) => {
  if (!t || t.trim() === "") {
    return { valid: false, error: ERRORS.GEN_EMPTY_INPUT };
  }
  const regex = /^(\d+-\d+)(,\d+-\d+)*$/;
  if (!regex.test(t)) {
    return { valid: false, error: ERRORS.GEN_GRAPH_COORDS };
  }
  return { valid: true, error: null };
};

export const edgesValidCheck = (t, size) => {
  if (!t || t.trim() === "") {
    return { valid: false, error: ERRORS.GEN_EMPTY_INPUT };
  }
  const edges = t.split(",");
  const seen = new Set();

  for (let edge of edges) {
    const parts = edge.split("-").map(Number);

    if (parts.length < 2 || parts.length > 3 || parts.some(isNaN)) {
      return { valid: false, error: ERRORS.GEN_GRAPH_INVALID_EDGES };
    }

    const [a, b, w] = parts;
    if (a < 1 || a > size || b < 1 || b > size) {
      return { valid: false, error: ERRORS.GEN_GRAPH_EDGE_OUT_OF_RANGE(1, size) };
    }

    // TODO: Circular in original code allows this?
    if (a === b) {
      return { valid: false, error: ERRORS.GEN_GRAPH_NO_LOOPS };
    }

    const key = `${Math.min(a,b)}-${Math.max(a,b)}`;
    if (seen.has(key)) {
      return { valid: false, error: ERRORS.GEN_GRAPH_DUPLICATE_EDGES };
    }
    seen.add(key);

    // TODO: Again leaving possibility of third part being excluded.
    if (w !== undefined && w <= 0) {
      return { valid: false, error: ERRORS.GEN_POSITIVE_EDGE_WEIGHTS };
    }
  }

  return { valid: true, error: null };
};

export const startEndValidCheck = (value, size, isEnd=false) => {
  if (!value || value.trim() === "") {
    return { valid: false, error: ERRORS.GEN_EMPTY_INPUT };
  }

  const nums = value.split(",").map(Number);
  if (nums.some(isNaN)) {
    return { valid: false, error: isEnd 
      ? ERRORS.GEN_GRAPH_INVALID_ENDNODES 
      : ERRORS.GEN_ONLY_POSITIVE_INTEGERS };
  }

  for (let n of nums) {
    if (n < 1 || n > size) {
      return { valid: false, error: isEnd
        ? ERRORS.GEN_GRAPH_ENDS_OUT_OF_RANGE(1, size)
        : ERRORS.GEN_GRAPH_START_OUT_OF_RANGE(1, size) };
    }
  }

  return { valid: true, error: null };
};

/**
 * Validate comma-separated pairs of numbers (e.g., "1-2,3-4").
 * Each pair must have exactly two numbers and be within N_ARRAY.
 * @param {String} value The text input.
 * @param {Array<String|Number>} N_ARRAY The valid domain of node IDs (as strings or numbers).
 * @returns {{ valid: boolean, error: string|null }}
 */
export function dualValueParamValidCheck(value, N_ARRAY) {
  if (!value || value.trim() === "") {
    return { valid: false, error: ERRORS.GEN_EMPTY_INPUT };
  }

  // Ensure only digits, commas, hyphens, and spaces
  if (!/^[0-9,\-\s]+$/.test(value)) {
    return { valid: false, error: ERRORS.GEN_TEXT_PAIR_FORMAT };
  }

  const pairs = value.split(",").map((pair) => pair.trim());

  for (let i = 0; i < pairs.length; i++) {
    const parts = pairs[i].split("-");

    // Must be exactly 2 values in each pair
    if (parts.length !== 2) {
      return { valid: false, error: ERRORS.GEN_TEXT_PAIR_FORMAT };
    }

    // Each value must be a number and in domain
    for (const val of parts) {
      if (isNaN(val)) {
        return { valid: false, error: ERRORS.GEN_LIST_INVALID_NUMBER };
      }
      if (!N_ARRAY.includes(val.toString())) {
        return { valid: false, error: ERRORS.GEN_NUMBER_NOT_IN_DOMAIN };
      }
    }
  }

  return { valid: true, error: null };
}
