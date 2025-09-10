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
    const [a, b, weight = 1] = parts;
    matrix[a - 1][b - 1] = weight;
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
// in fact if you define aesthetically pleasing as getting the minimum number of edge crossings 
// for some node and edge set its NP-Hard. 
// https://en.wikipedia.org/wiki/Crossing_number_%28graph_theory%29  
// Hill climbing seems good enough for our purposes.
// I have defined "aesthetically pleasing" as spread out nodes
// with very little edge crossings, this could definitely be
// extended, I think minimum distance between edges (visual distance not
// traversing graph distance) also plays a big role.
export function generateGraph(
  minX = 1,
  minY = 1,
  maxX = 50,
  maxY = 20,
  minWeight = 1,
  maxWeight = 100,
  size = 10,
  iterations = 1000
) {
  // TODO: Crude approach to scaling density by size for now
  // Note the implementation to avoid having too many edges
  // uses maxRandomDegreeGen as an upperbound for random generation
  // if it exceeds amount of nodes it just clamps to the amount of nodes.
  let maxRandomDegreeGen;
  if (size <= 6) maxRandomDegreeGen = 15; // Most likely fully connected
  else maxRandomDegreeGen = 5;

  const coords = genCoords(minX, maxX, minY, maxY, size, iterations);
  const edges = genEdges(coords, minWeight, maxWeight, maxRandomDegreeGen, iterations);
  return {
    coords: coords.map(([x, y]) => `${x}-${y}`).join(","),
    edges: edges.map(([a, b, w]) => `${a + 1}-${b + 1}-${w}`)
                .join(","),
  };
}

// Favours maximising euclidian distance.
function genCoords(minX, maxX, minY, maxY, size, iterations) {
  // Generate random coords
  const coords = [];

  // Go node by node, take `iterations` amount of samples
  // for each node, keep the one that yeilded the highest
  // euclidean distance with the rest of the existing nodes.
  for (let n = 0; n < size; n++) {
    let bestCandidate = null;
    let bestScore = -Infinity;

    for (let s = 0; s < iterations; s++) {
      const x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
      const y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

      const minDist = coords.length === 0
        ? Infinity
        : Math.min(...coords.map(([cx, cy]) => euclidean(x, y, cx, cy)));

      if (minDist > bestScore) {
        bestScore = minDist;
        bestCandidate = [x, y];
      }
    }

    coords.push(bestCandidate);
  }

  return coords;
}

// Builds minimum spanning tree. Then randomly adds edges minimising edge crossings.
function genEdges(coords, minWeight, maxWeight, maxRandomDegreeGen, iterations) {
  // https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
  // Check if line segment (a,b) intersects with (c,d)
  function edgesIntersect([ax, ay], [bx, by], [cx, cy], [dx, dy]) {
    const det = (bx - ax) * (dy - cy) - (dx - cx) * (by - ay);
    if (det === 0) return false;
    const lambda = ((dy - cy) * (dx - ax) + (cx - dx) * (dy - ay)) / det;
    const gamma  = ((ay - by) * (dx - ax) + (bx - ax) * (dy - ay)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  }

  function countCrossings(candidate) {
    const [i, j] = candidate;
    const [ax, ay] = coords[i];
    const [bx, by] = coords[j];
    let crossings = 0;
    for (const [a, b] of edges) {
      // Shared end points do not count.
      if (a === i || a === j || b === i || b === j) continue;
      const [cx, cy] = coords[a];
      const [dx, dy] = coords[b];
      if (edgesIntersect([ax, ay], [bx, by], [cx, cy], [dx, dy])) crossings++;
    }
    return crossings;
  }

  const size = coords.length;
  const edges = [];
  const degrees = Array(size).fill(0);

  function prims() {
    const inTree = Array(size).fill(false);
    inTree[0] = true;

    while (edges.length < size - 1) {
      let bestEdge = null;
      let bestDist = Infinity;

      for (let i = 0; i < size; i++) {
        if (!inTree[i]) continue;
        for (let j = 0; j < size; j++) {
          if (inTree[j]) continue;
          const dist = euclidean(coords[i][0], coords[i][1], coords[j][0], coords[j][1]);
          if (dist < bestDist) {
            bestDist = dist;
            bestEdge = [i, j];
          }
        }
      }

      if (!bestEdge) break;
      
      const [a, b] = bestEdge;
      const weight = Math.floor(Math.random() * (maxWeight - minWeight + 1)) + minWeight;
      edges.push([a, b, weight]);
      degrees[a]++;
      degrees[b]++;
      inTree[b] = true;
    }
  }

  // Build MST first
  prims();

  // Create target degrees, note that it is possible prims
  // made a node exceed maxRandomDegreeGen that is fine.
  const targetDegrees = Array.from({ length: size }, (_, i) => Math.floor(Math.random() * maxRandomDegreeGen) + 1);
  for (let i = 0; i < size; i++) {
    while (degrees[i] < targetDegrees[i]) {
      let bestCandidate = null;
      let bestCross = Infinity;

      // Find the best node to connect to (minimise crossings)
      for (let s = 0; s < iterations; s++) {
        const j = Math.floor(Math.random() * size);

        // Skip invalid candidates
        if (i === j || degrees[j] >= targetDegrees[j] || 
            edges.some(([a, b]) => (a === i && b === j) || (a === j && b === i))
        ) {
          continue;
        }

        const crossings = countCrossings([i, j]);
        if (crossings < bestCross) {
          bestCross = crossings;
          bestCandidate = j;
        }
      }

      // No valid candiate, can happen if all nodes
      // have exceeded target degree, or random could not
      // find a valid target. Still guarantee connectedness
      // because we built MST first.
      if (bestCandidate === null) break;

      // Add edge
      const weight = Math.floor(Math.random() * (maxWeight - minWeight + 1)) + minWeight;
      edges.push([i, bestCandidate, weight]);
      degrees[i]++;
      degrees[bestCandidate]++;
    }
  }

  return edges;
}