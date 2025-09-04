/*
 Use node AddNewAlgorithm.js to have the entry, files and export lines
 created for you.
  
 Map from algorithm ID -> metadata used across the app.

 Explaining an entry by example:
 
  isort: {
    name: 'Insertion Sort',
    category: 'Sort',
    noDeploy: true,
    keywords: ['N^2'],
    explanationKey: 'isort',
    paramKey: 'isort',
    instructionsKey: 'isort',
    extraInfoKey: 'isort',
    pseudocode: { sort: 'isort' },
    controller: { sort: 'isort' },
  },

  - Name on the menus will appear as "Insertion Sort".
  - It is under category "Sort" on the menus.
  - noDeploy = true, algorithm will not appear on menus but accessible through
    http://localhost:<port>/?alg=<key> (alg=isort)
    (optional; defaults to false if not specified)
  - keywords: used by the main menu search (case-insensitive).
    (optional; defaults to [])

  - explanationKey: MUST equal a named export from
    src/algorithms/explanations/index.js.
  - paramKey: MUST equal a named export from
    src/algorithms/parameters/index.js.
  - instructionsKey: MUST equal a named export in
    src/algorithms/instructions/index.js.
  - extraInfoKey: MUST equal a named export in
    src/algorithms/extra-info/index.js

  - pseudocode: object mapping MODE -> named export from
    src/algorithms/pseudocode/index.js.
      Single-mode example: { sort: 'isort' }
      Multi-mode example:  {
        insertion: 'binaryTreeInsertion',
        search: 'binaryTreeSearch',
      },

  - controller: object mapping MODE -> named export from
    src/algorithms/controllers/index.js, same rules as pseudocode.
*/

// Very Important: The key for each algorithm MUST be unique!
// Also: the key for the algorithm MUST be the same as the "name"
// of the top level Param block returned by the parameter function.
// Eg, parameters/msort_arr_td.js has
//
// function MergesortParam() {
// ...
// return (
//     // <>
//       <div className="form">
//         <ListParam
//           name="msort_arr_td"  <---- ****SAME AS KEY****
// ...

// DO NOT DELETE/MODIFY THIS COMMENT
//_MASTER_LIST_START_
const algorithmMetadata = {
  AVLTree: {
    name: 'AVL Tree',
    category: 'Insert/Search',
    explanationKey: 'AVLExp',
    paramKey: 'AVLTreeParam',
    instructionsKey: 'AVLInstruction',
    extraInfoKey: 'AVLInfo',
    pseudocode: {
      insertion: 'AVLTreeInsertion',
      search: 'AVLTreeSearch',
    },
    controller: {
      insertion: 'AVLTreeInsertion',
      search: 'AVLTreeSearch',
    },
    keywords: ["Hello", "World"],
  },

  'msort_arr_nat': {
    name: 'Merge Sort (natural)',
    noDeploy: false,
    category: 'Sort',
    explanation: 'msort_arr_nat',
    param: 'msort_arr_nat',
    instructions: 'msort_arr_nat',
    extraInfo: 'msort_arr_nat',
    pseudocode: {
      sort: 'msort_arr_nat',
    },
    controller: {
      sort: 'msort_arr_nat',
    },
    keywords: ["Hello", "World"],
  },
};
//_MASTER_LIST_END_

export const getDefaultMode = (key) => Object.keys(algorithmMetadata[key].pseudocode)[0];

export const getCategory = (key) => algorithmMetadata[key].category;

const generateAlgorithmCategoryList = (deployOnly=false) => {
  const src = deployOnly
  ? Object.fromEntries(Object.entries(algorithmMetadata).filter(a => !a[1].noDeploy))
  : algorithmMetadata;

  const alCatList = [];
  let categoryNum = 0;

  // Get all the categories
  // eslint-disable-next-line no-unused-vars
  for (const [key, value] of Object.entries(src)) {
    if (!alCatList.some((al) => al.category === value.category)) {
      alCatList.push({
        category: value.category,
        id: categoryNum,
        algorithms: [],
      });
      categoryNum += 1;
    }
  }

  // For every category, get all the algorithms
  for (const [key, value] of Object.entries(src)) {
    const algo = alCatList.find((al) => al.category === value.category);
    algo.algorithms.push({
      name: value.name,
      shorthand: key,
      mode: getDefaultMode(key),
      keywords: value.keywords,
    });
  }

  return alCatList;
};

// This function generates a list of algorithms classed by categories
const generateAlgorithmList = (deployOnly = false) => {
  const src = deployOnly
    ? Object.fromEntries(Object.entries(algorithmMetadata).filter((a) => !a[1].noDeploy))
    : algorithmMetadata;

  const alList = [];
  let alNum = 0;

  // For every category, get all the algorithms
  for (const [key, value] of Object.entries(src)) {
    alList.push({
      name: value.name,
      shorthand: key,
      id: alNum,
      keywords: value.keywords,
      mode: getDefaultMode(key),
    });
    alNum += 1;
  }

  return alList;
};

export default algorithmMetadata;
export const DeployedAlgorithmCategoryList = generateAlgorithmCategoryList(true);
export const AlgorithmCategoryList = generateAlgorithmCategoryList();
export const DeployedAlgorithmList = generateAlgorithmList(true);
export const AlgorithmList = generateAlgorithmList();
export const AlgorithmNum = generateAlgorithmList().length;

