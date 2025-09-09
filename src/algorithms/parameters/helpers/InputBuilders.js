import Denque from 'denque';

/*
    File contains functions that build an input 
    for the parameter pane, for example some functions
    create sorted arrays for when the sorted button
    on sort algorithm parameter panes are clicked.
*/

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

// Euclidean distance between two points (rounded up)
// We round up so we can have the choice of admissible and inadmissible
// heuristics in A* more easily (and avoid floating point)
export const euclidean = (x1, y1, x2, y2) => {
  return Math.ceil(Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2)));
}

// Manhattan distance between two points
export const manhattan = (x1, y1, x2, y2) => {
  return Math.abs(x1-x2) + Math.abs(y1-y2);
}

export const balanceBSTArray = (nodes) => {
  class TreeNode {
    constructor(value) {
      this.value = value;
      this.left = null;
      this.right = null;
    }
  }
  const insertNode = (array) => {
    if (array.length === 0) {
      return null;
    }
    const midpoint = Math.floor(array.length / 2);
    const root = new TreeNode(array[midpoint]);
    root.left = insertNode(array.slice(0, midpoint));
    root.right = insertNode(array.slice(midpoint + 1));
    return root;
  };

  const buildBalancedBST = (array) => {
    const root = insertNode(array);
    return root;
  };

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
  const balancedBST = levelOrderTraversal(BST);
  return balancedBST;
};

export const shuffleArray = (array) => {
  // eslint-disable-next-line no-plusplus
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

/**
 * return an array of number according to the range specified
 * @param {*} str the string of range, e.g."2-7-4", "2-5"
 * @param {*} mode "Array" or "Count", return array of inputs or count of inputs, respectively (delete "Count" returns -1 and "Array return array of that negative number") 
 * @returns the array of number in that range
 */
export const translateInput = (str, mode) => {
  let arr = str.split("-");
  switch (mode) {
    case "Count": 
      if (arr.length == 1) return 1;
      else if (arr.length == 2) {
        if (arr[0] === "") return 0;
        else return arrayRange(Number(arr[0]), Number(arr[1]), 1).length;
      }
      else if (arr.length == 3) return arrayRange(Number(arr[0]), Number(arr[1]), Number(arr[2])).length;
      break;
    case "Array": 
      if (arr.length == 1) return arr.map(Number);
      else if (arr.length == 2) {
        if (arr[0] === "") return [str].map(Number);
        else return arrayRange(Number(arr[0]), Number(arr[1]), 1);
      }
      else if (arr.length == 3) return arrayRange(Number(arr[0]), Number(arr[1]), Number(arr[2]));
      break;
  }
}

/**
 * return an array of number according to the range specified
 * @param {*} start start point(inclusive)
 * @param {*} stop end point(inclusive)
 * @param {*} step the step
 * @returns an array of number
 */
const arrayRange = (start, stop, step) => 
  Array.from(
  { length: (stop - start) / step + 1 },
  (value, index) => start + index * step
  );

// TODO: These func assume input is already valid do checks anyway.
export const parseCoords = (coordString) => coordString
    .split(",")
    .map((pair) => pair.split("-").map(Number)); // [[x1,y1], [x2,y2], ...]}
  
export const parseEdges = (edgeString, size) => {
  // Initialize empty matrix with 0s
  const matrix = Array.from({ length: size }, () => Array(size).fill(0));
  edgeString.split(",").forEach(edge => {
    const parts = edge.split("-").map(Number);
    const [a, b, weight = 1] = parts; // default weight = 1 TODO: going to have to look at visualiser code not sure how it chooses to not display edges
    // assuming for now that weight = 1 does it, but then weights of 1 are allowed for AStar? Maybe the controller code just feeds a prop
    // to visualiser saying do not draw edge weights.
    matrix[a - 1][b - 1] = weight; // make zero indexed
  });

  return matrix;
};

// Recalculates Edge string using function distanceFn
// distanceFn should accept 4 Numbers.
// Curry by distanceFn.
export const recalcEdges = (distanceFn) => (coordString, edgeString) => {
  const coords = parseCoords(coordString);

  return edgeString.split(",").map(edge => {
    const [aStr, bStr] = edge.split("-");
    const a = Number(aStr);
    const b = Number(bStr);

    // arrays are 0-indexed but nodes are 1-indexed
    const [x1, y1] = coords[a - 1];
    const [x2, y2] = coords[b - 1];

    const dist = distanceFn(x1, y1, x2, y2);
    return `${a}-${b}-${dist}`;
  }).join(",");
};

// Generating an "aesthetically pleasing" graph is a non-trivial challenge
// in fact its NP-Hard. https://en.wikipedia.org/wiki/Crossing_number_%28graph_theory%29  
// It falls under the broader problem space of network spatialization.
// https://en.wikipedia.org/wiki/Force-directed_graph_drawing
import Graph from "graphology";
import forceLayout from 'graphology-layout-force';

// TODO: Still not great, do some more research.
export function generateGraph(
  minX = 1,
  minY = 1,
  maxX = 50,
  maxY = 20,
  minWeight=1,
  maxWeight=20,
  size = 10,
  maxIterations = 1000 // More iterations the better but keep light
) {
  const graph = new Graph();

  for (let i = 0; i < size; i++) {
    graph.addNode(i, {
      x: Math.random() * maxX,
      y: Math.random() * maxY,
    });
  }

  // Ensures connectivity
  for (let i = 0; i < size - 1; i++) {
    const weight = Math.floor(Math.random() * (maxWeight - minWeight + 1)) + minWeight;
    graph.addUndirectedEdge(i, i + 1, { weight });
  }

  // Add some random edges too
  for (let i = 0; i < size; i++) {
    const j = Math.floor(Math.random() * size);
    if (i !== j && !graph.hasEdge(i, j)) {
      // graph too dense otherwise.
      if (Math.random() < 0.5) {
        const weight = Math.floor(Math.random() * (maxWeight - minWeight + 1)) + minWeight;
        graph.addUndirectedEdge(i, j, { weight });
      }
    }
  }

  forceLayout.assign(graph, { 
    maxIterations,
    gravity: 0.01,
    attraction: 0.0001,
    repulsion: 0.5
  });

  let minLayoutX = Infinity,
      maxLayoutX = -Infinity,
      minLayoutY = Infinity,
      maxLayoutY = -Infinity;

  // Get min/max x and min/max y produced by the model
  graph.forEachNode((node, attr) => {
    if (attr.x < minLayoutX) minLayoutX = attr.x;
    if (attr.x > maxLayoutX) maxLayoutX = attr.x;
    if (attr.y < minLayoutY) minLayoutY = attr.y;
    if (attr.y > maxLayoutY) maxLayoutY = attr.y;
  });

  // Need to scale down on all node coords to our space.
  const scaleX = (maxX - minX) / (maxLayoutX - minLayoutX || 1);
  const scaleY = (maxY - minY) / (maxLayoutY - minLayoutY || 1);
  const coords = [];
  graph.forEachNode((node, attr) => {
    const scaledX = minX + (attr.x - minLayoutX) * scaleX;
    const scaledY = minY + (attr.y - minLayoutY) * scaleY;
    coords.push(`${Math.round(scaledX)}-${Math.round(scaledY)}`);
  });

  const edges = [];
  graph.forEachEdge((edge, attr, source, target) => {
    edges.push(`${Number(source) + 1}-${Number(target) + 1}-${attr.weight}`);
  });

  console.log(coords.join(","));
  console.log(edges.join(","));
  return {
    coords: coords.join(","),
    edges: edges.join(",")
  };
}