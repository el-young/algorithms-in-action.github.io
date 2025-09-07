// EuclideanMatrixParamsTest.js
import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import EuclideanMatrixParams from "./helpers/EuclidMatrixParamNew";
import { GlobalContext } from "../../context/GlobalState";
import { GlobalActions } from "../../context/actions";
import { euclidean, manhattan, parseCoords, parseEdges, recalcEdges } from "./helpers/InputBuilders";

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

const weightOptions = ["Euclidean", "Manhattan", "As input"];
const weightFnMap = {
  "Euclidean": recalcEdges(euclidean),
  "Manhattan": recalcEdges(manhattan),
  "As input": (coords, edges) => edges,
};
const heuristicOptions = ["Euclidean", "Manhattan"];
const heuristicFnMap = {
  "Euclidean": euclidean,
  "Manhattan": manhattan,
};

// TODO: These are important somewhere in the original code
// graphExamples // Parent component
// minXYCoord, maxXYCoord, // For random node generation define in parent param which will define callback for random gen
// symmetric // Parent im assuming this is for random node gen
// circular  // Parent im assuming this is for random node gen
// unweighted, // Might not be relevant if parent visualiser makes edges unweighted when we pass in 1-2

function EuclideanMatrixParamsTest({
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
  // TODO: URL prop validation here

  const { dispatch } = useContext(GlobalContext);
  const [message, setMessage] = useState(null);
  const [size, setSize] = useState(urlSize || defaultProps.size);
  const [start, setStart] = useState(urlStart || defaultProps.start);
  const [end, setEnd] = useState(urlEnd || defaultProps.end);
  const [coords, setCoords] = useState(urlCoords || defaultProps.xyCoords);
  const [edges, setEdges] = useState(urlEdges || defaultProps.edgeWeights);
  const [weight, setWeight] = useState(urlWeight || defaultProps.weight);
  const [heuristic, setHeuristic] = useState(urlHeuristic || defaultProps.heuristic);

  // Callback for controller code, allows movement of nodes with mouse
  // to make changes to the coords and edge weights.
  const moveNode = (nodeID, x, y) => {
    const coordsArray = coords.split(",").map(pair =>
      pair.split("-").map(n => Number(n))
    );

    // Update the node’s coordinates
    coordsArray[nodeID] = [x, y];

    // Rebuild the string
    const newCoords = coordsArray.map(([cx, cy]) => `${cx}-${cy}`).join(",");
    
    setCoords(newCoords);
    setEdges(weightFnMap[weight](newCoords, edges));
  };

  // TODO: Create callback which will get the targets col and row index
  // and use that to update coords, edge string.

  useEffect(() => {
    // Transform to data type controller code expects before dispatch.
    const startNode = Number(start);
    // Original code leaves possibility for multiple end nodes open, controller expects array of nums
    const endNodes = end.split(",").map((num) => Number(num));
    const coordsMatrix = parseCoords(coords);
    console.log(coordsMatrix);
    const edgeValueMatrix = parseEdges(edges, Number(size));
    dispatch(GlobalActions.LOAD_ALGORITHM, {
      name: alg,
      mode: defaultProps.mode,
      size: Number(size),
      startNode,
      endNodes,
      coordsMatrix,
      edgeValueMatrix,
      heuristicFn: heuristicFnMap[heuristic],
      moveNode,
    });
  }, [size, start, end, coords, edges, weight, heuristic]);


  const handleSizeSubmit = (e) => {
    e.preventDefault();
    // TODO: Validation logic
    setSize(e.target[0].value);
    // Random nodes and edges should be created
    // to make size make sense, or should leave to user to fix, will error on submit if inapplicable?
    console.log("Size submitted:", e.target[0].value);
  };

  const handleStartSubmit = (e) => {
    e.preventDefault();
    // TODO: Validation logic ensure start makes sense
    setStart(e.target[0].value);
    console.log("Start submitted:", e.target[0].value);
  };

  const handleEndSubmit = (e) => {
    e.preventDefault();
    // TODO: Validation logic ensure end makes sense
    setEnd(e.target[0].value);
    console.log("End submitted:", e.target[0].value);
  };

  const handleCoordsSubmit = (e) => {
    e.preventDefault();
    // TODO: Validation logic should check start
    // and end make sense, should we fix if the user makes mistake
    // or error?
    const newCoords = e.target[0].value;
    const nodeCount = newCoords.split(",").length;

    setCoords(newCoords);
    setSize(nodeCount.toString());
  };

  const handleEdgesSubmit = (e) => {
    e.preventDefault();
    // TODO: Validation logic
    setEdges(e.target[0].value);
    console.log("Edges submitted:", e.target[0].value);
  };

  // Cycle to next value
  const handleChangeWeightCalc = () => {
    setWeight((prev) => {
      const currentIndex = weightOptions.indexOf(prev);
      const nextIndex = (currentIndex + 1) % weightOptions.length;
      const nextWeight = weightOptions[nextIndex];

      // update edges here to avoid setState async quirks
      setEdges((prevEdges) => weightFnMap[nextWeight](coords, prevEdges));

      return nextWeight;
    });
    console.log("Changing weight.");
  };

  // Cycle to next value
  const handleChangeHeuristic = () => {
    setHeuristic((prev) => {
      const currentIndex = heuristicOptions.indexOf(prev);
      const nextIndex = (currentIndex + 1) % heuristicOptions.length;
      return heuristicOptions[nextIndex];
    });
    console.log("Changing heuristic.");
  };


  // TODO: These are already defined more intelligently in original code.
  // These need to update start, ends, size, aswell to keep sensible.
  const generateRandomCoords = () => {
    const dummyCoords = "1-1,2-2,3-3";
    const newSize = "3";
    const newStart = "1";
    const newEnd = "3";
    setSize(newSize);
    setStart(newStart);
    setEnd(newEnd);
    setCoords(dummyCoords);
    setEdges((prevEdges) => weightFnMap[weight](dummyCoords, prevEdges));
    return dummyCoords;
  };

  const generateRandomEdges = () => {
    const dummyEdges = "1-2,2-3";
    const newSize = "3";
    const newStart = "1";
    const newEnd = "3";
    setSize(newSize);
    setStart(newStart);
    setEnd(newEnd);
    setEdges(weightFnMap[weight](coords, dummyEdges));
    return dummyEdges;
  };

  return (
    <div style={{ padding: "20px" }}>
      <EuclideanMatrixParams
        size={size}
        start={start}
        end={end}
        weightCalc={weight}
        heuristic={heuristic}
        coords={coords}
        edges={edges}
        handleSizeSubmit={handleSizeSubmit}
        handleStartSubmit={handleStartSubmit}
        handleEndSubmit={handleEndSubmit}
        changeWeightCalc={handleChangeWeightCalc}
        changeHeuristic={handleChangeHeuristic}
        generateRandomCoords={generateRandomCoords}
        generateRandomEdges={generateRandomEdges}
        handleCoordsSubmit={handleCoordsSubmit}
        handleEdgesSubmit={handleEdgesSubmit}
      />
      {/* render success/error message */}
      {message}
    </div>
  );
}

EuclideanMatrixParamsTest.propTypes = {
  alg: PropTypes.string.isRequired,
  mode: PropTypes.string,
  start: PropTypes.string,
  end: PropTypes.string,
  size: PropTypes.string,
  xyCoords: PropTypes.string,
  edgeWeights: PropTypes.string,
  heuristic: PropTypes.oneOf(heuristicOptions),
  weight: PropTypes.oneOf(weightOptions),
};

export default EuclideanMatrixParamsTest;
