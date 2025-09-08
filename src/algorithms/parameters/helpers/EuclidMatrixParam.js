import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../../styles/EuclideanMatrix.scss';
import '../../../styles/Param.scss';
import ParamFormRefresh from './ParamFormRefresh';

// graphExamples // Parent component
// minXYCoord, maxXYCoord, // For random node generation define in parent param which will define callback for random gen
// symmetric // Parent im assuming this is for random node gen
// circular  // Parent im assuming this is for random node gen
// unweighted, // Might not be relevant if parent visualiser makes edges unweighted when we pass in 1-2


// TODO: Needs some CSS polish.
function EuclideanMatrixParams({
    size,           // Number nodes in the graph
    start,          // Node to start search from
    end,            // Node to end search at, can be left null.
    weightCalc,     // weightCalculation, Manhattan, as input, etc.
    heuristic,      // huerisitc, Manhattan, as input, etc.
    coords,         // Default coords to display in form
    edges,          // Default edges to display in form

    // Callbacks
    handleSizeSubmit,
    handleStartSubmit,
    handleEndSubmit,
    changeWeightCalc,
    changeHeuristic,
    generateRandomCoords,
    generateRandomEdges,
    handleCoordsSubmit, handleEdgesSubmit, // In case you want different behvaiour for each
    onCoordsChange,
    onEdgesChange,
}) {

    // Local mirrors for inputs (to keep typing smooth)
    const [sizeInput, setSizeInput] = useState(size || '');
    const [startInput, setStartInput] = useState(start || '');
    const [endInput, setEndInput] = useState(end || '');

    // If parent for some reason changes size, start, end
    // and not the user from typing, update the form content.
    // For example, maybe clicking another button set size in parent
    // to another value.
    useEffect(() => setSizeInput(size || ''), [size]);
    useEffect(() => setStartInput(start || ''), [start]);
    useEffect(() => setEndInput(end || ''), [end]);

    // Many items conditionally rendered, for examples AStar will support heuristics
    // BFS/DFS will not. So the heurisitc prop will be null and not rendered for
    // BFS/DFS. Assumed that all users of EuclideanMatrixParams will have forms
    // for edge and coord input.
    return ( 
    <>
        {/* forms for size/start/end buttons for heuristic and weight calculation modes */}
        {size !== undefined && (
        <form className="formLeft" onSubmit={handleSizeSubmit}>
            <div className="outerInput">
            <label className="inputText" htmlFor="sizeInput">
                Size:&nbsp;
            </label>
            <input
                id="sizeInput"
                type="text"
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
            />
            </div>
        </form>
        )}

        {start !== undefined && (
        <form className="formLeft" onSubmit={handleStartSubmit}>
            <div className="outerInput">
            <label className="inputText" htmlFor="startInput">
                Start:&nbsp;
            </label>
            <input
                id="startInput"
                type="text"
                value={startInput}
                onChange={(e) => setStartInput(e.target.value)}
            />
            </div>
        </form>
        )}

        {weightCalc !== undefined && (
            <button
                className="algorithmBtn"
                onClick={changeWeightCalc}
            >
                Weights: {weightCalc}
            </button>
        )}

        {heuristic !== undefined && (
            <button
                className="algorithmBtn"
                onClick={changeHeuristic}
            >
                Heuristic: {heuristic}
            </button>
        )}

        {end !== undefined && (
        <form className="formLeft" onSubmit={handleEndSubmit}>
            <div className="outerInput">
            <label className="inputText" htmlFor="endInput">
                End:&nbsp;
            </label>
            <input
                id="endInput"
                type="text"
                value={endInput}
                onChange={(e) => setEndInput(e.target.value)}
            />
            </div>
        </form>
        )}

        {/* Param Forms */}
        <div>
            <ParamFormRefresh
                buttonName="Set&nbsp;X-Y&nbsp;Coordinates"
                formClassName="formLeft"
                value={coords}
                handleSubmit={handleCoordsSubmit}
                refreshFunction={generateRandomCoords}
                onInputChange={onCoordsChange}
            />
        </div>
        <div>
            <ParamFormRefresh
                buttonName="Set&nbsp;Edges/Weights"
                formClassName="formLeft"
                value={edges}
                handleSubmit={handleEdgesSubmit}
                refreshFunction={generateRandomEdges}
                onInputChange={onEdgesChange}
            />
        </div>


        {/* Matrix representation */}

        {
        /* 
            Two approaches, parent can pass in callback that uses the row/cell idx to modify
            the string encoding
            OR
            Parent can maintan a matrix representation and the setter updates that
        */
        }

    </>
    )
}

EuclideanMatrixParams.propTypes = {
  size: PropTypes.string.isRequired,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  weightCalc: PropTypes.string,
  heuristic: PropTypes.string,
  coords: PropTypes.string.isRequired,
  edges: PropTypes.string.isRequired,

  // Callbacks
  handleSizeSubmit: PropTypes.func.isRequired,
  handleStartSubmit: PropTypes.func.isRequired,
  handleEndSubmit: PropTypes.func.isRequired,
  changeWeightCalc: PropTypes.func,
  changeHeuristic: PropTypes.func,
  generateRandomCoords: PropTypes.func.isRequired,
  generateRandomEdges: PropTypes.func.isRequired,
  handleCoordsSubmit: PropTypes.func.isRequired,
  handleEdgesSubmit: PropTypes.func.isRequired,
  onCoordsChange: PropTypes.func,
  onEdgesChange: PropTypes.func,
};

export default EuclideanMatrixParams;