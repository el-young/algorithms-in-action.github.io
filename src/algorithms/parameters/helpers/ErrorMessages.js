/*
  Central repository for all error messages.

  Validation functions (triggered by parameter pane button clicks)
  should return a truthy/falsy value along with one of these error
  messages when validation fails.

  Having all messages centralized makes it easier to update or
  modify them in one place.
*/

export const ERR_INVALID_NUMBER_LIST =
  'Input must be a comma-separated list of numbers (e.g., 1,2,3).';

export const ERR_INVALID_STRING_LIST =
  'Input must be a comma-separated list of alphabetic strings (e.g., a,b,c).';

export const ERR_INVALID_STRING =
  'Input must contain only letters and spaces.';

export const ERR_INVALID_SINGLE_NUMBER =
  'Input must be a single positive integer.';

export const ERR_INVALID_MATRIX =
  'Matrix must be symmetric with zeros on the diagonal.';

export const ERR_INVALID_PAIR_TRIPLE =
  'Input must be a number, or a pair/triple like 2-5 or 2-7-4.';

export const ERR_INVALID_RANGE =
  'Invalid range: ensure the start is less than the end.';

export const DEFAULT_ERROR =
  'It seems this algorithm does not accept this data.';

