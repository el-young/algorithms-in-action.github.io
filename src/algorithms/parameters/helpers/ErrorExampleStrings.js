/*
    Central repo for error messages
    generated in the parameter pane.

    It should also contain example strings
    that are referenced. This is so the user
    does not have to go through the rigmarole
    of error after error to derive the expected
    input format.

    Try to make error names as semantic as possible.

    UPDATE: Some error messages have been set to templates
*/

// Mark specific examples/errors with a prefix indicating the algorithm/algorithm group.
// Prefix general ones with GEN.
export const ERRORS = {
  GEN_EMPTY_INPUT: (fieldName) => `${fieldName} cannot be empty`,
  GEN_ONLY_POSITIVE_NUMBERS_LIST: (fieldName) =>
    `${fieldName} must be a comma-separated list of positive numbers only`,
  GEN_ONLY_LOWERCASE: (fieldName) =>
    `${fieldName} may only contain lowercase letters and spaces`,
  GEN_ONLY_POSITIVE_INTEGERS: (fieldName) =>
    `${fieldName} may only contain positive integers`,
  GEN_MATRIX_NOT_SYMMETRIC: (fieldName) =>
    `${fieldName} must be symmetric`,
  GEN_MATRIX_DIAGONAL_NOT_ZERO: (fieldName) =>
    `${fieldName} must have zeros on the diagonal`,
  GEN_POSITIVE_EDGE_WEIGHTS: (fieldName) =>
    `${fieldName} must contain positive edge weights (or 0 for no edge)`,
  GEN_PAIR_TRIPLES_POS_INT: (fieldName) =>
    `${fieldName} must contain positive integers, pairs, or triples`,
  GEN_RIGHT_NUMBER_INPUTS: (fieldName) =>
    `${fieldName} must contain the right number of inputs`,
  GEN_INVALID_RANGES: (fieldName) => `${fieldName} contains invalid ranges`,
  GEN_LIST_INVALID_NUMBER: (fieldName) =>
    `${fieldName} must only contain valid integers`,
  GEN_LIST_DUPLICATES: (fieldName) =>
    `${fieldName} must not contain duplicate values`,
  GEN_TEXT_PAIR_FORMAT: (fieldName) =>
    `${fieldName} must be comma-separated pairs (a-b)`,
  GEN_NUMBER_NOT_IN_DOMAIN: (fieldName) =>
    `Number entered in ${fieldName} is not in a valid domain`,

  GEN_BUILD_VISUALISER_FIRST: (visualiserName, mode) =>
    `Build a ${visualiserName} first by running some steps of the algorithm in ${mode} mode.`,

  GEN_GRAPH_INVALID_COORDS: (fieldName) =>
    `${fieldName} must follow the correct coordinate format`,
  GEN_GRAPH_INVALID_EDGES: (fieldName) =>
    `${fieldName} must follow the correct edge format`,
  GEN_GRAPH_NODES: (fieldName) =>
    `${fieldName} Input a list of comma-separated node numbers`,
  GEN_GRAPH_DUPLICATE_EDGES: (fieldName) =>
    `${fieldName} contains duplicate edges, please remove them`,
  GEN_GRAPH_START_OUT_OF_RANGE: (fieldName, min, max) =>
    `${fieldName} start node must be an integer between ${min} and ${max}`,
  GEN_GRAPH_EDGES: (fieldName) =>
    `${fieldName} must follow format NodeA-NodeB-Weight for each in the graph; -Weight is optional and defaults to 1`,
  GEN_GRAPH_ENDS_OUT_OF_RANGE: (fieldName, min, max) =>
    `${fieldName} end node(s) must be integers between ${min} and ${max}, separated by commas`,
  GEN_GRAPH_COORDS: (fieldName) =>
    `${fieldName} must contain only numbers separated by '-' giving the X-Y coordinates, with commas ',' in between coordinates`,
  GEN_GRAPH_EDGE_OUT_OF_RANGE: (fieldName, min, max) =>
    `${fieldName} start and endpoints must be integers between ${min} and ${max}`,
  GEN_GRAPH_MATRIX_ROW_COL: (row, col, matrixName) =>
    `see (${row},${col}) of the ${matrixName} matrix`,
  GEN_GRAPH_NO_LOOPS: (fieldName) =>
    `${fieldName} must not contain self-loops (edges from a node to itself)`,
  GEN_GRAPH_GEN_OUT_OF_RANGE: (fieldName, min, max) =>
    `${fieldName} generation is only supported for nodes between ${min} and ${max}`,


};

export const EXAMPLES = {
    GEN_SYMMETRIC_MATRIX    : "Example: All (m[i][j] = m[j][i])",
    GEN_COORDS              : "Example: 1-1,3-4,4-1,6-6",
    GEN_EDGES               : "Example: 1-2,1-3,2-3,3-2-6,3-4-7",
    GEN_NUMBERS_BETWEEN_0_1 : "Example: 0,1",
    GEN_SINGLE_INT          : "Example: 5",
    GEN_LIST_PARAM          : "Example: 0,1,2,3,4",
    
    GRAPH_ENDNODES          : "Example: 1,2",

    HASHING_INSERT          : "TODO: Place holder example message",
    HASHING_TOO_LARGE       : "TODO: Add right amount of inputs whatever that is",

    UF_FIND                 : "Example: 2. The single digit should be between 1 and 10.",
    UF_UNION                : "Example: 5-7,8-5,9-8,3-9,5-2. All digits should be between 1 and 10, '-' should be used to separate the two digits, and ',' should be used to separate each union operation.",

    TTF_INSERTION           : "Duplicate-free list of non-negative integers please: 0,1,2,3,4",
};
