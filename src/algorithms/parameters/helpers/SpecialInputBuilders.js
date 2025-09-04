/* eslint-disable no-plusplus */
import Denque from 'denque';

/*


*/

/**
 * Generate a random integer between min and max (inclusive).
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a list of random numbers of given length.
 */
export const genRandNumList = (num, min, max) => {
  const list = [];
  for (let x = 0; x < num; x += 1) {
    list.push(getRandomInt(min, max));
  }
  return list;
};

/**
 * Generate a list of unique random numbers given size.
 * @param {*} num the length of the list to generate.
 * @param {*} min the minimum value of the random number.
 * @param {*} max the maximum value of the random number.
 * @returns the generated list.
 */
export const genUniqueRandNumList = (num, min, max) => {
  const set = new Set();
  while (set.size < num) {
    set.add(getRandomInt(min, max));
  }
  return Array.from(set);
};

/**
 * Generate a "perfect pivot" array for Quicksort.
 */
export const quicksortPerfectPivotArray = (minA, maxA) => {
  function idealOrder(min, max, v, step) {
    if (max <= min) {
      return [];
    }
    const midDivider = Math.floor(((max - min) / 2) + min);
    const left = idealOrder(min, midDivider - step, v, step);
    const right = idealOrder(midDivider + step, max, -1, step);

    if (v === 1) {
      return left.concat(right).concat([midDivider]);
    }
    return [midDivider].concat(left).concat(right);
  }
  return idealOrder(minA, maxA, 1, 2);
};

/**
 * Populate the Column array, see React-Table API
 * https://react-table.tanstack.com/docs/quick-start
 * @param {number} len size of the matrix
 * @return array of object
 */
export const makeColumnArray = (len) => {
  const arr = [];
  for (let i = 0; i < len; i += 1) {
    arr.push({
      Header: i + 1,
      accessor: `col${i}`, // accessor is the "key" in the data,
    });
  }
  return arr;
};

/**
 * Return XY columns for new params user interface
 * @return array of object
 */
export const makeColumnCoords = () => [
  { Header: 'X', accessor: 'col0' },
  { Header: 'Y', accessor: 'col1' },
];

/**
 * Populate the data cells, see React-Table API
 * https://react-table.tanstack.com/docs/quick-start
 * 
 * Attempt at better version of random graph. Makes sure a connected
 * graph is returned. Attempt to limit degree of nodes (still tends to
 * be a bit sparse for a small number of nodes and perhaps a bit dense
 * for a large number - could make some adjustments. Could be nice for
 * this to have the X-Y coordinates passed in; currently they are done
 * independently, which limits things somewhat.
 */
export const makeWeights = (len, min, max, symmetric, unweighted, circular = false) => {
  const rows = [];

  // get pseudo-random len*len edge matrix
  // Try to get average degree around 3, edges being more likely between
  // nodes with similar numbers; lower degree for circular graphs
  let diffMult = 4; // magic number for random edge generation
  let sub = 6; // magic number for random edge generation
  if (circular) {
    diffMult = 3; // larger means fewer edges between close nodes
    sub = 0; // smaller means fewer edges in total
  }
  for (let i = 0; i < len; i += 1) {
    let row = [];
    let edgeCount = 0;
    let tries = 0; // we try several times to get 0<edgeCount<5 then give up
    do {
      tries++;
      row = [];
      edgeCount = 0; // edge count for this node/row
      for (let j = 0; j < len; j += 1) {
        let val = 0;
        if (j < i && symmetric) {
          val = rows[j][i];
        } else if (i === j) {
          // XXX using symmetric flag to determine if leading
          // diagonal is 1 or 0 is a bit sus but that’s what earlier code did...
          val = (symmetric ? 0 : 1);
          // always have an edge between i and i+1 to make sure graph is
          // connected, unless its circular
        } else if (j === i + 1 && !circular) {
          val = (unweighted ? 1 : getRandomInt(min, max));
          // else determine if we want an edge between i and j
          // - if i&j differ more we reduce likelihood
        } else if (Math.random() < 0.75 ** (Math.abs(i - j) * diffMult - sub)) {
          val = (unweighted ? 1 : getRandomInt(min, max));
        }
        if (val > 0) edgeCount++;
        row.push(val);
      }
    } while (tries < 40 && ((edgeCount === 0 && !circular) || edgeCount > 4) && len > 1);
    rows.push(row);
  }

  const arr = [];
  for (let i = 0; i < len; i += 1) {
    const data = {};
    for (let j = 0; j < len; j += 1) {
      data[`col${j}`] = `${rows[i][j]}`;
    }
    arr.push(data);
  }
  return arr;
};

/**
 * Create len random-ish XY coordinates in range min to max for Euclidean graphs.
 */
export const makeXYCoords = (len, min, max, circular = false) => {
  if (circular) return makeXYCoordsCircular(len, min, max);

  const arr = [];
  let prevX = 0;
  let prevY = 0;
  let prevX1 = 0;
  let prevY1 = 0;

  for (let i = 0; i < len; i += 1) {
    const data = {};
    const sep = 0.9;
    const xmin = Math.floor(min + sep * (max - min) * i / len);
    const xmax = Math.ceil(max - sep * (max - min) * (len - 1 - i) / len);
    const x = getRandomInt(xmin, xmax);
    data[`col0`] = `${x}`;

    // Spread Y values, avoid nodes too close to the previous two
    let y = 0;
    let tries = 0;
    do {
      y = getRandomInt(min, max / 3);
      tries++;
    } while (
      tries < 20 &&
      (euclidean(x, y, prevX, prevY) < 5 || euclidean(x, y, prevX1, prevY1) < 5)
    );
    data[`col1`] = `${y}`;

    prevX1 = prevX;
    prevY1 = prevY;
    prevX = x;
    prevY = y;
    arr.push(data);
  }
  return arr;
};

/**
 * Create len circular-ish XY coordinates for graph in range min to max for Warshall’s.
 */
export const makeXYCoordsCircular = (len, min, max) => {
  const unitAngle = (2 * Math.PI) / len;
  const radius = (max - min) / 6; // height on screen is limited
  const midX = (max - min) / 2;
  const midY = 1 + (max - min) / 6; // avoid X axis

  const arr = [];
  for (let i = 0; i < len; i += 1) {
    const x = Math.round(midX + (Math.cos(Math.PI + unitAngle * i) * radius));
    const y = Math.round(midY + (Math.sin(Math.PI + unitAngle * i) * radius));
    arr.push({ col0: `${x}`, col1: `${y}` });
  }
  return arr;
};

/**
 * Euclidean distance between two points (rounded up).
 * We round up so we can have the choice of admissible and inadmissible
 * heuristics in A* more easily (and avoid floating point).
 */
export const euclidean = (x1, y1, x2, y2) =>
  Math.ceil(Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2));

/**
 * Manhattan distance between two points.
 */
export const manhattan = (x1, y1, x2, y2) =>
  Math.abs(x1 - x2) + Math.abs(y1 - y2);

/**
 * Build a balanced BST from nodes and return it in level-order.
 */
export const balanceBSTArray = (nodes) => {
  class TreeNode {
    constructor(value) {
      this.value = value;
      this.left = null;
      this.right = null;
    }
  }
  const insertNode = (array) => {
    if (array.length === 0) return null;
    const midpoint = Math.floor(array.length / 2);
    const root = new TreeNode(array[midpoint]);
    root.left = insertNode(array.slice(0, midpoint));
    root.right = insertNode(array.slice(midpoint + 1));
    return root;
  };

  const buildBalancedBST = (array) => insertNode(array);

  const levelOrderTraversal = (root) => {
    const output = [];
    const queue = new Denque();
    queue.push(root);
    while (!queue.isEmpty()) {
      const element = queue.shift();
      if (element !== null) {
        output.push(element.value);
        queue.push(element.left);
        queue.push(element.right);
      }
    }
    return output;
  };

  const BST = buildBalancedBST(nodes);
  return levelOrderTraversal(BST);
};

/**
 * Shuffle an array in place.
 */
export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Translate string input like "2-7-4" into array/count
export const translateInput = (str, mode) => {
  const arr = str.split('-');
  switch (mode) {
    case 'Count':
      if (arr.length === 1) return 1;
      if (arr.length === 2) return arr[0] === '' ? 0 : arrayRange(+arr[0], +arr[1], 1).length;
      if (arr.length === 3) return arrayRange(+arr[0], +arr[1], +arr[2]).length;
      break;
    case 'Array':
      if (arr.length === 1) return arr.map(Number);
      if (arr.length === 2) return arr[0] === '' ? [str].map(Number) : arrayRange(+arr[0], +arr[1], 1);
      if (arr.length === 3) return arrayRange(+arr[0], +arr[1], +arr[2]);
      break;
    default:
      return [];
  }
};

const arrayRange = (start, stop, step) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
