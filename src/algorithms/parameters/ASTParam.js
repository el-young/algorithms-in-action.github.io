import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import EuclideanMatrixParams from "./helpers/EuclidMatrixParam";
import { GlobalContext } from "../../context/GlobalState";
import { GlobalActions } from "../../context/actions";
import { euclidean, generateGraph, manhattan, parseCoords, parseEdges, recalcEdges } from "./helpers/InputBuilders";
import { coordsValidCheck, edgesValidCheck, singleNumberValidCheck, startEndValidCheck } from "./helpers/InputValidators";
import { errorParamMsg } from "./helpers/ParamMsg";
import { ERRORS } from "./helpers/ErrorExampleStrings";

// Default values if url props not provided
const defaultProps = {
  mode: "find",
  size: "14",
  start: "1",
  end: "13",
  xyCoords: "4-3,2-7,7-11,9-3,12-6,13-2,12-16,17-2,20-4,34-4,26-9,30-6,34-10,38-5",
  edgeWeights: "1-2-3,1-4-6,2-3-4,3-4-2,3-5-4,4-5-3,5-6-2,5-7-10,6-8-5,7-11-10,8-9-6,9-10-3,10-12-8,11-12-5,12-13-3,13-14-4",
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

// TODO: These are important for some reason in the original code
// symmetric // Not sure what this is for
// circular  // Not sure what this is for
// unweighted, // Not sure what this is for controller code controls whether edges are weighted or not

function ASTParam({
  alg,
  mode,
  start: urlStart,
  end: urlEnd,
  size: urlSize,
  xyCoords: urlCoords,
  edgeWeights: urlEdges,
  heuristic: urlHeuristic,
  weight: urlWeight,
}) {
  const { dispatch }                    = useContext(GlobalContext);
  const [ size, setSize ]               = useState(urlSize || defaultProps.size);
  const [ start, setStart ]             = useState(urlStart || defaultProps.start);
  const [ end, setEnd ]                 = useState(urlEnd || defaultProps.end);
  const [ xyCoords, setXyCoords ]       = useState(urlCoords || defaultProps.xyCoords);
  const [ edgeWeights, setEdgeWeights ] = useState(urlEdges || defaultProps.edgeWeights);

  const [weight, setWeight] = useState(
    weightOptions.includes(urlWeight) ? urlWeight : defaultProps.weight
  );
  const [heuristic, setHeuristic] = useState(
    heuristicOptions.includes(urlHeuristic) ? urlHeuristic : defaultProps.heuristic
  );
  const [ message, setMessage ] = useState(null);

  useEffect(() => {
    const { valid, errors } = validateAll();

    if (valid) {
      dispatch(GlobalActions.LOAD_ALGORITHM, {
        name: alg,
        mode: defaultProps.mode,

        // Add everything here required for URL to rebuild
        // this component. Make sure keys are the same
        // as the property names of this component and they
        // should be strings.
        url : {
          alg,
          mode,
          size,
          start,
          end,
          xyCoords,
          edgeWeights,
          weight,
          heuristic
        },

        // Add everything your controller code needs here, make sure
        // the data types have been converted to what your controller code
        // expects and the key names here are the same names that your
        // controller destructures with.
        startNode       : Number(start),
        endNodes        : end.split(",").map((num) => Number(num)),
        coordsMatrix    : parseCoords(xyCoords),
        // Reflect weight selection on edges in the visualiser.
        edgeValueMatrix : parseEdges(weightFnMap[weight](xyCoords, edgeWeights), Number(size)),
        heuristicFn     : heuristicFnMap[heuristic],
        moveNode,
      });
      setMessage(null);
    } else {
      setMessage(errorParamMsg(errors.join("\n")));
    }
  }, [size, start, end, xyCoords, edgeWeights, weight, heuristic]);

  // This should verify all state, the graph params are not like other
  // params many of the input UI are interelated in terms of validation,
  // better just to have one validateAll that checks everything is as expected
  // before dispatch. Also has the benefit of allowing the user
  // to see multiple errors, if they ignore one and change something else that
  // generates another error (CLIENT: maybe this should be the approach for other parameters
  // that can have multiple sources of error?)
  const validateAll = () => {
    const errors = [];

    const sizeCheck = singleNumberValidCheck(size);
    if (!sizeCheck.valid) errors.push(sizeCheck.error);

    // coords
    const coordCheck = coordsValidCheck(xyCoords);
    if (!coordCheck.valid) errors.push(coordCheck.error);

    // Size state does not have to correspond that is just for
    // size of random generation.
    const sizeFromCoords = xyCoords.split(",").length;

    // edges
    const edgeCheck = edgesValidCheck(edgeWeights, sizeFromCoords);
    if (!edgeCheck.valid) errors.push(edgeCheck.error);

    // start
    const startCheck = startEndValidCheck(start, sizeFromCoords);
    if (!startCheck.valid) errors.push(startCheck.error);

    // end
    const endCheck = startEndValidCheck(end, sizeFromCoords, true);
    if (!endCheck.valid) errors.push(endCheck.error);

    return {
      valid: errors.length === 0,
      errors
    };
  };

  // Callback for controller code, allows movement of nodes with mouse
  // to make changes to the coords and edge weights in matrix and forms.
  const moveNode = (nodeID, x, y) => {
    const coordsArray = xyCoords.split(",").map(pair =>
      pair.split("-").map(n => Number(n))
    );

    // Update the node’s coordinates
    coordsArray[nodeID] = [x, y];

    // Rebuild the string
    const newCoords = coordsArray.map(([cx, cy]) => `${cx}-${cy}`).join(",");
    
    setXyCoords(newCoords);

    // Can reflect changes in edges using current weight 
    // when moving node with mouse if you uncomment this
    // setEdgeWeights(weightFnMap[weight](newCoords, edgeWeights));
  };

  const handleSizeSubmit = (e) => {
    e.preventDefault();
    const newSize = e.target[0].value;
    const check = singleNumberValidCheck(newSize);
    if (!check.valid) {
      setMessage(errorParamMsg(check.error));
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
      parseInt(newSize, 10)
    );

    setSize(newSize);
    setXyCoords(coords);
    setEdgeWeights(edges);
    setWeight("As input");
    setMessage(null);
  };

  const handleStartSubmit = (e) => {
    e.preventDefault();
    setStart(e.target[0].value);
  };

  const handleEndSubmit = (e) => {
    e.preventDefault();
    setEnd(e.target[0].value);
  };

  const handleCoordsSubmit = (e) => {
    e.preventDefault();
    setXyCoords(e.target[0].value);
  };

  const handleEdgesSubmit = (e) => {
    e.preventDefault();
    setEdgeWeights(e.target[0].value);
  };

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

  const onCoordCellSubmit = (row, col, val) => {
    const check = singleNumberValidCheck(val);
    if (!check.valid) setMessage(errorParamMsg(check.error + ` See row:${row+1},col:${col} of coordinate matrix.`));
    else {
      const coordsArray = xyCoords.split(",").map(pair => pair.split("-").map(Number));
      coordsArray[row][col] = Number(val);
      const newCoords = coordsArray.map(([cx, cy]) => `${cx}-${cy}`).join(",");
      setXyCoords(newCoords);
    }
  };

  const onEdgeCellSubmit = (row, col, val) => {
    const check = singleNumberValidCheck(val);
    if (!check.valid) 
      setMessage(errorParamMsg(check.error + ` See row:${row+1},col:${col+1} of edge matrix.`));
    else if (row === col && Number(val) != 0)
      setMessage(errorParamMsg(ERRORS.GEN_MATRIX_NOT_SYMMETRIC) + ` See row:${row+1},col:${col+1} of edge matrix.`);
    else {
      let edgeList = edgeWeights.trim()
      ? edgeWeights.split(",").map(e => e.split("-").map(Number))
      : [];

      // Remove any existing entry for this edge, TODO: symmetry options support.
      edgeList = edgeList.filter(
        ([a, b]) => !((a === row + 1 && b === col + 1) || (a === col + 1 && b === row + 1))
      );

      // insert new only if val is not 0
      if (Number(val) !== 0) edgeList.push([row + 1, col + 1, Number(val)]);
      setEdgeWeights(edgeList.map(([a, b, w]) => `${a}-${b}-${w}`).join(","));
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <EuclideanMatrixParams
        sizeForRandomGen={size}
        start={start}
        end={end}
        weightCalc={weight}
        heuristic={heuristic}
        coords={xyCoords}
        edges={edgeWeights}
        handleSizeSubmit={handleSizeSubmit}
        handleStartSubmit={handleStartSubmit}
        handleEndSubmit={handleEndSubmit}
        changeWeightCalc={handleChangeWeightCalc}
        changeHeuristic={handleChangeHeuristic}
        handleCoordsSubmit={handleCoordsSubmit}
        handleEdgesSubmit={handleEdgesSubmit}
        onCoordCellSubmit={onCoordCellSubmit}
        onEdgeCellSubmit={onEdgeCellSubmit}
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
  xyCoords: PropTypes.string,
  edgeWeights: PropTypes.string,
  heuristic: PropTypes.string,
  weight: PropTypes.string,
};

export default ASTParam;