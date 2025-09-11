/*
    This file contains input validation helpers.
    They should return a collection containing
    true/false and an error message which is pulled
    from the central repository ErrorMessages.js.
*/

import { ERRORS } from './ErrorExampleStrings';

export const commaSeparatedNumberListValidCheck = (t, fieldName) => {
  if (!t || t.trim() === "") {
    return { valid: false, error: ERRORS.GEN_EMPTY_INPUT(fieldName) };
  }

  const regex = /^[0-9]+(,[0-9]+)*$/;
  if (!regex.test(t)) {
    return { valid: false, error: ERRORS.GEN_ONLY_POSITIVE_NUMBERS_LIST(fieldName) };
  }

  return { valid: true, error: null };
};

export const stringListValidCheck = (t, fieldName) => {
  if (!t || t.trim() === "") {
    return { valid: false, error: ERRORS.GEN_EMPTY_INPUT(fieldName) };
  }

  const regex = /^[a-zA-Z]+(,[a-zA-Z]+)*$/g;
  if (!regex.test(t)) {
    return { valid: false, error: ERRORS.GEN_ONLY_LOWERCASE(fieldName) };
  }

  return { valid: true, error: null };
};

export const stringValidCheck = (t, fieldName) => {
  const regex = /^[a-z\s]+$/g;

  if (!t || t.trim() === "") {
    return { valid: false, error: ERRORS.GEN_EMPTY_INPUT(fieldName) };
  }

  if (!regex.test(t)) {
    return { valid: false, error: ERRORS.GEN_ONLY_LOWERCASE(fieldName) };
  }

  return { valid: true, error: null };
};

export const singleNumberValidCheck = (t, fieldName) => {
  const regex = /^\d+$/;

  if (!t || t.trim() === "") {
    return { valid: false, error: ERRORS.GEN_EMPTY_INPUT(fieldName) };
  }

  if (!regex.test(t)) {
    return { valid: false, error: ERRORS.GEN_ONLY_POSITIVE_INTEGERS(fieldName) };
  }

  return { valid: true, error: null };
};

// eslint-disable-next-line consistent-return
export const matrixValidCheck = (m, fieldName, symmetric, selfLoop) => {
  for (let i = 0; i < m.length; i++) {
    for (let j = 0; j < i; j++) {
      if (symmetric && m[i][j] !== m[j][i]) {
        return { valid: false, error: ERRORS.GEN_MATRIX_NOT_SYMMETRIC(fieldName) };
      }
    }
    if (!selfLoop && m[i][i] !== 0) {
      return { valid: false, error: ERRORS.GEN_MATRIX_DIAGONAL_NOT_ZERO(fieldName) };
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
export const commaSeparatedPairTripleCheck = (allowPosInteger, allowNegInteger, input, fieldName) => {
  const regex_pos_num = /^[0-9]+(-[0-9]+){0,2}$/g;
  const regex_all_num = /^[0-9]+(-[0-9]+){0,2}$|^-[0-9]+$/g;
  const regex_no_num = /^[0-9]+(-[0-9]+){1,2}$/g;
  let array = input.split(",");

  for (let item of array) {
    if (!item.match(allowPosInteger ? (allowNegInteger ? regex_all_num : regex_pos_num) : regex_no_num)) {
      return { valid: false, error: ERRORS.GEN_PAIR_TRIPLES_POS_INT(fieldName) };
    }
  }
  return { valid: true, error: null };
};

/**
 * Check if all ranges in array of inputs are valid (e.g for a-b, a must < b)
 * @param {*} values array of inputs
 */
export const checkAllRangesValid = (values, fieldName) => {
  for (let item of values) {
    let rangesItems = item.split("-").map(Number);
    if ((rangesItems.length == 2 || rangesItems.length == 3) && rangesItems[0] > rangesItems[1]) {
      return { valid: false, error: ERRORS.GEN_INVALID_RANGES(fieldName) };
    }
  }
  return { valid: true, error: null };
};

export const coordsValidCheck = (t, fieldName) => {
  if (!t || t.trim() === "") {
    return { valid: false, error: ERRORS.GEN_EMPTY_INPUT(fieldName) };
  }
  const regex = /^(\d+-\d+)(,\d+-\d+)*$/;
  if (!regex.test(t)) {
    return { valid: false, error: ERRORS.GEN_GRAPH_COORDS(fieldName) };
  }
  return { valid: true, error: null };
};

export const edgesValidCheck = (t, fieldName, size, symmetric, selfLoop) => {
  if (!t || t.trim() === "") {
    return { valid: false, error: ERRORS.GEN_EMPTY_INPUT(fieldName) };
  }
  const edges = t.split(",");
  const seen = new Set();

  for (let edge of edges) {
    const parts = edge.split("-").map(Number);

    if (parts.length < 2 || parts.length > 3 || parts.some(isNaN)) {
      return { valid: false, error: ERRORS.GEN_GRAPH_INVALID_EDGES(fieldName) };
    }

    const [a, b, w] = parts;
    if (a < 1 || a > size || b < 1 || b > size) {
      return { valid: false, error: ERRORS.GEN_GRAPH_EDGE_OUT_OF_RANGE(fieldName, 1, size) };
    }

    if (!selfLoop && a === b) {
      return { valid: false, error: ERRORS.GEN_GRAPH_NO_LOOPS(fieldName) };
    }

    const key = `${Math.min(a,b)}-${Math.max(a,b)}`;
    if (seen.has(key)) {
      return { valid: false, error: ERRORS.GEN_GRAPH_DUPLICATE_EDGES(fieldName) };
    }
    seen.add(key);

    if (w !== undefined && w <= 0) {
      return { valid: false, error: ERRORS.GEN_POSITIVE_EDGE_WEIGHTS(fieldName) };
    }
  }

  if (symmetric) {
    // Map edges to weights (default 1 if not specified)
    const edgeMap = new Map();
    for (let e of edges) {
      const parts = e.split("-").map(Number);
      const [a, b, w] = parts;
      const weight = w !== undefined ? w : 1;
      edgeMap.set(`${a}-${b}`, weight);
    }

    for (let [key, weight] of edgeMap) {
      const [a, b] = key.split("-").map(Number);
      const reverseKey = `${b}-${a}`;

      // Only check if reverse exists (don’t require it)
      if (edgeMap.has(reverseKey)) {
        const reverseWeight = edgeMap.get(reverseKey);
        if (reverseWeight !== weight) {
          return { valid: false, error: ERRORS.GEN_MATRIX_NOT_SYMMETRIC(fieldName) };
        }
      }
    }
  }

  return { valid: true, error: null };
};

export const startEndValidCheck = (value, fieldName, size, isEnd=false) => {
  if (!value || value.trim() === "") {
    return { valid: false, error: ERRORS.GEN_EMPTY_INPUT(fieldName) };
  }

  const nums = value.split(",").map(Number);
  if (nums.some(isNaN)) {
    return { valid: false, error: isEnd 
      ? ERRORS.GEN_GRAPH_ENDS_OUT_OF_RANGE(fieldName, 1, size)
      : ERRORS.GEN_ONLY_POSITIVE_INTEGERS(fieldName) };
  }

  for (let n of nums) {
    if (n < 1 || n > size) {
      return { valid: false, error: isEnd
        ? ERRORS.GEN_GRAPH_ENDS_OUT_OF_RANGE(fieldName, 1, size)
        : ERRORS.GEN_GRAPH_START_OUT_OF_RANGE(fieldName, 1, size) };
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
export function dualValueParamValidCheck(value, fieldName, N_ARRAY) {
  if (!value || value.trim() === "") {
    return { valid: false, error: ERRORS.GEN_EMPTY_INPUT(fieldName) };
  }

  // Ensure only digits, commas, hyphens, and spaces
  if (!/^[0-9,\-\s]+$/.test(value)) {
    return { valid: false, error: ERRORS.GEN_TEXT_PAIR_FORMAT(fieldName) };
  }

  const pairs = value.split(",").map((pair) => pair.trim());

  for (let i = 0; i < pairs.length; i++) {
    const parts = pairs[i].split("-");

    // Must be exactly 2 values in each pair
    if (parts.length !== 2) {
      return { valid: false, error: ERRORS.GEN_TEXT_PAIR_FORMAT(fieldName) };
    }

    // Each value must be a number and in domain
    for (const val of parts) {
      if (isNaN(val)) {
        return { valid: false, error: ERRORS.GEN_LIST_INVALID_NUMBER(fieldName) };
      }
      if (!N_ARRAY.includes(val.toString())) {
        return { valid: false, error: ERRORS.GEN_NUMBER_NOT_IN_DOMAIN(fieldName) };
      }
    }
  }

  return { valid: true, error: null };
}
