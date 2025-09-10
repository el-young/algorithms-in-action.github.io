import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import EuclideanMatrixParams from "./helpers/EuclidMatrixParam";
import { GlobalContext } from "../../context/GlobalState";
import { GlobalActions } from "../../context/actions";
import { euclidean, generateGraph, manhattan, parseCoords, parseEdges, recalcEdges } from "./helpers/InputBuilders";
import { coordsValidCheck, edgesValidCheck, singleNumberValidCheck, startEndValidCheck } from "./helpers/InputValidators";
import { errorParamMsg } from "./helpers/ParamMsg";
import { ERRORS, EXAMPLES } from "./helpers/ErrorExampleStrings";

/*
  This is the parameter component for the A star algorithm,
  this file is intentionally verbose, since it should be used
  as an example file for newer devs to learn the structure
  expected for parameter components.
*/

// Default values if url query parameters are missing
// for these.
const defaultProps = {
  mode: "find",
  size: "14",
  start: "1",
  end: "14",
  coords: "4-3,2-7,7-11,9-3,12-6,13-2,12-16,17-2,20-4,34-4,26-9,30-6,34-10,38-5",
  edges: "1-2-3,1-4-6,2-3-4,3-4-2,3-5-4,4-5-3,5-6-2,5-7-10,6-8-5,7-11-10,8-9-6,9-10-3,10-12-8,11-12-5,12-13-3,13-14-4",
  heuristic: "Manhattan",
  weight: "Euclidean",
};

// Feel free to add in more if your algorithm supports it.
const weightOptions = ["Euclidean", "Manhattan", "As input"];
const weightFnMap = {
  "Euclidean": recalcEdges(euclidean),
  "Manhattan": recalcEdges(manhattan),
  "As input": (coords, edges) => edges,
};

// Feel free to add in more if your algorithm supports it.
const heuristicOptions = ["Euclidean", "Manhattan"];
const heuristicFnMap = {
  "Euclidean": euclidean,
  "Manhattan": manhattan,
};

// The maximum coords for nodes in random graph generation.
const MIN_X_COORD = 1;
const MAX_X_COORD = 50;
const MIN_Y_COORD = 1;
const MAX_Y_COORD = 15;

// Min and maximum weights used in random graph generation.
const MIN_WEIGHT  = 1;
const MAX_WEIGHT  = 20;

function ASTParam({
  alg,
  mode,
  start: urlStart,
  end: urlEnd,
  coords: urlCoords,
  edges: urlEdges,
  heuristic: urlHeuristic,
  weight: urlWeight,
}) {
  // How we notify other components about changes, namely
  // the controller needs to know what parameters the user requested so
  // it can construct the appropriate animation.
  const { dispatch }          = useContext(GlobalContext);

  // States
  const [ start, setStart ]   = useState(urlStart || defaultProps.start);
  const [ end, setEnd ]       = useState(urlEnd || defaultProps.end);
  const [ coords, setCoords ] = useState(urlCoords || defaultProps.coords);
  const [ edges, setEdges ]   = useState(urlEdges || defaultProps.edges);
  const [ weight, setWeight ] = useState(
    weightOptions.includes(urlWeight) ? urlWeight : defaultProps.weight
  );
  const [ heuristic, setHeuristic ] = useState(
    heuristicOptions.includes(urlHeuristic) ? urlHeuristic : defaultProps.heuristic
  );

  // This creates the error messages, see the JSX at the bottom of
  // function, where {message} appears.
  const [ message, setMessage ] = useState(null);

  // This should be the only place dispatch is used to keep
  // things traceable. This will run once on mount automatically.
  useEffect(() => {
    const { valid, errors } = validateAll();

    if (valid) {
      dispatch(GlobalActions.LOAD_ALGORITHM, {
        // For legacy reasons the dispatcher expects
        // the name key to hold the algorithm key e.g. "astar"
        // do not confuse name here with "name" key in master list e.g. 
        // "A* (heuristic search)" which is what is shown on menus.
        name: alg,
        mode: defaultProps.mode,

        // Add everything here required for URL to rebuild
        // this component. Make sure keys are the same
        // as the property names of this component otherwise
        // this component will ignore them when loading from url.
        // Each of the values should be strings.
        url : {
          alg,
          mode,
          start,
          end,
          coords,
          edges,
          weight,
          heuristic
        },

        // Add everything your controller code needs here, make sure
        // the data types have been converted to what your controller code
        // expects and the key names here are the same names that your
        // controller destructures with otherwise your controller code
        // will ignore these keys.
        startNode       : Number(start),
        endNodes        : end.split(",").map((num) => Number(num)),
        coordsMatrix    : parseCoords(coords),
        // Pass edge weights calculated from weight choice for visualiser.
        edgeValueMatrix : parseEdges(weightFnMap[weight](coords, edges), coords.split(",").length),
        heuristicFn     : heuristicFnMap[heuristic],
        moveNode,
      });

      // Make sure you clear any errors
      setMessage(null);
    } else {
      // Show all errors to user
      setMessage(errorParamMsg(errors.join("\n")));
    }
  }, [start, end, coords, edges, weight, heuristic]);

  // This is in case the user makes multiple errors. Errors
  // can still be used in your callbacks, in order to control
  // setters, but this serves as a last check, and is helpful
  // when the user makes multiple errors, or multiple input forms
  // are interdependent for correctness, like with this component. Can also
  // be useful because its in useEffect so now url props
  // are checked implicitly.
  const validateAll = () => {
    const errors = [];

    const coordCheck = coordsValidCheck(coords);
    if (!coordCheck.valid) errors.push(coordCheck.error);
    else {
      const numNodes = coords.split(",").length;

      const edgeCheck = edgesValidCheck(edges, numNodes);
      if (!edgeCheck.valid) errors.push(edgeCheck.error);
      
      const startCheck = startEndValidCheck(start, numNodes);
      if (!startCheck.valid) errors.push(startCheck.error);

      const endCheck = startEndValidCheck(end, numNodes, true);
      if (!endCheck.valid) errors.push(endCheck.error);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  };

  // Callback for controller code, allows movement of nodes with mouse
  // to make changes to the coords and edge weights in matrix and forms.
  const moveNode = (nodeID, x, y) => {
    const coordsArray = coords.split(",").map(pair =>
      pair.split("-").map(n => Number(n))
    );

    // Update the nodes coordinates
    coordsArray[nodeID] = [x, y];

    // Rebuild the string
    const newCoords = coordsArray.map(([cx, cy]) => `${cx}-${cy}`).join(",");
    
    setCoords(newCoords);
    // Can update edges dynamically aswell if this line uncommented
    // setEdgeWeights(weightFnMap[weight](newCoords, edges));
  };

  const genRandGraph = (size) => {
    const check = singleNumberValidCheck(size);
    if (!check.valid) {
      setMessage(errorParamMsg(check.error));
      return;
    }

    // Generating graph is expensive, clamp requests.
    const newSize = parseInt(size, 10);
    if (newSize < 1 || newSize > 50) {
      setMessage(errorParamMsg(ERRORS.GEN_GRAPH_GEN_OUT_OF_RANGE(1, 50)));
      return;
    }

    // Generate new coords and edges
    const { coords, edges } = generateGraph(
      MIN_X_COORD,
      MIN_Y_COORD,
      MAX_X_COORD,
      MAX_Y_COORD,
      MIN_WEIGHT,
      MAX_WEIGHT,
      newSize
    );
    setCoords(coords);
    setEdges(edges);
    setWeight("As input");
  };

  const handleCoordSubmit = (newCoords) => {
    const coordCheck = coordsValidCheck(newCoords);
    // Do not update coords if invalid, matrix
    // component in EuclicdMatrix is observing.
    if (!coordCheck.valid) {
      setMessage(errorParamMsg(coordCheck.error), EXAMPLES.GEN_COORDS);
      return;
    }
    setCoords(newCoords);

    // Fix edges for user, too tedious.
    const numNodes = newCoords.split(",").length;
    setEdges(edges
      .split(",")
      .map(e => e.trim())
      .filter(Boolean) // drop blanks
      .map(e => e.split("-").map(Number))
      // must be exactly 3 parts: a, b, w
      .filter(parts => parts.length === 3 && parts.every(n => Number.isInteger(n)))
      // keep only if endpoints are strictly less than numNodes
      .filter(([a, b]) => a < numNodes && b < numNodes)
      .map(([a, b, w]) => `${a}-${b}-${w}`)
      .join(",")
    );
  }

  const handleEdgeSubmit = (newEdges) => {
    const edgeCheck = edgesValidCheck(newEdges, coords.split(",").length);
    // Do not update coords if invalid, matrix
    // component in EuclicdMatrix is observing.
    if (!edgeCheck.valid) {
      setMessage(errorParamMsg(edgeCheck.error, EXAMPLES.GEN_EDGES));
      return;
    }
    setEdges(newEdges);
  }

  // Cycle to next value
  const handleChangeWeightCalc = () => {
    setWeight((prev) => {
      const currentIndex = weightOptions.indexOf(prev);
      const nextIndex = (currentIndex + 1) % weightOptions.length;
      const nextWeight = weightOptions[nextIndex];
      return nextWeight;
    });
  };

  // Cycle to next value
  const handleChangeHeuristic = () => {
    setHeuristic((prev) => {
      const currentIndex = heuristicOptions.indexOf(prev);
      const nextIndex = (currentIndex + 1) % heuristicOptions.length;
      return heuristicOptions[nextIndex];
    });
  };

  // Chose to only hold state for string encoding
  // these callbacks are so matrix changes update the
  // string encoding.
  const onCoordCellSubmit = (row, col, val) => {
    const check = singleNumberValidCheck(val);
    if (val !== "" && !check.valid) {
       setMessage(
          errorParamMsg(
            `${check.error} ${ERRORS.GEN_GRAPH_MATRIX_ROW_COL(row + 1, col + 1, "coordinate")}`
        ));
      }
    else {
      const coordsArray = coords.split(",").map(pair => pair.split("-").map(Number));
      if (val === "") coordsArray.splice(row, 1); // delete coord
      else coordsArray[row][col] = Number(val);
      const newCoords = coordsArray.map(([cx, cy]) => `${cx}-${cy}`).join(",");
      setCoords(newCoords);

      // Fix edges for user, too tedious.
      const numNodes = newCoords.split(",").length;
      setEdges(edges
        .split(",")
        .map(e => e.trim())
        .filter(Boolean) // drop blanks
        .map(e => e.split("-").map(Number))
        // must be exactly 3 parts: a, b, w
        .filter(parts => parts.length === 3 && parts.every(n => Number.isInteger(n)))
        // keep only if endpoints are strictly less than numNodes
        .filter(([a, b]) => a < numNodes && b < numNodes)
        .map(([a, b, w]) => `${a}-${b}-${w}`)
        .join(",")
      );
    }
  };

  const onEdgeCellSubmit = (row, col, val) => {
    const check = singleNumberValidCheck(val);
    if (!check.valid) {
      setMessage(
        errorParamMsg(
          `${check.error} ${ERRORS.GEN_GRAPH_MATRIX_ROW_COL(row + 1, col + 1, "edge")}`
      ));
    } else if (row === col && Number(val) != 0) {
      setMessage(
        errorParamMsg(
          `${ERRORS.GEN_GRAPH_NO_LOOPS} ${ERRORS.GEN_GRAPH_MATRIX_ROW_COL(row + 1, col + 1, "edge")}`
      ));
    } else {
      let edgeList = edges.trim()
      ? edges.split(",").map(e => e.split("-").map(Number))
      : [];

      // Remove any existing entry for this edge
      edgeList = edgeList.filter(
        ([a, b]) => !((a === row + 1 && b === col + 1) || (a === col + 1 && b === row + 1))
      );

      // insert new only if val is not 0
      if (Number(val) !== 0) edgeList.push([row + 1, col + 1, Number(val)]);
      setEdges(edgeList.map(([a, b, w]) => `${a}-${b}-${w}`).join(","));
    }
  }

  return (
    <div>
      <EuclideanMatrixParams
        start={start}
        end={end}
        weightCalc={weight}
        heuristic={heuristic}
        coords={coords}
        edges={edges}
        setStart={setStart}
        setEnd={setEnd}
        setCoords={handleCoordSubmit}
        setEdges={handleEdgeSubmit}
        changeWeightCalc={handleChangeWeightCalc}
        changeHeuristic={handleChangeHeuristic}
        onCoordCellSubmit={onCoordCellSubmit}
        onEdgeCellSubmit={onEdgeCellSubmit}
        genRandGraph={genRandGraph}
      />
      {message}
    </div>
  );
}

ASTParam.propTypes = {
  alg: PropTypes.string.isRequired,
  mode: PropTypes.string,
  start: PropTypes.string,
  end: PropTypes.string,
  size: PropTypes.string,
  coords: PropTypes.string,
  edges: PropTypes.string,
  heuristic: PropTypes.string,
  weight: PropTypes.string,
};

export default ASTParam;