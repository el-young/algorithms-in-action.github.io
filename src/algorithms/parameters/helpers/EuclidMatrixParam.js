import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../../styles/EuclideanMatrix.scss';
import '../../../styles/Param.scss';
import ParamFormRefresh from './ParamFormRefresh';
import ParamForm from './ParamForm';

// graphExamples // Parent component
// minXYCoord, maxXYCoord, // For random node generation define in parent param which will define callback for random gen
// symmetric // Parent im assuming this is for random node gen
// circular  // Parent im assuming this is for random node gen
// unweighted, // Might not be relevant if parent visualiser makes edges unweighted when we pass in 1-2


// TODO: Needs some CSS polish.
function EuclideanMatrixParams({
    sizeForRandomGen,           // Number nodes in the graph
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
    handleCoordsSubmit, handleEdgesSubmit, // In case you want different behvaiour for each
    onCoordsChange,
    onEdgesChange,
    onCoordCellSubmit,
    onEdgeCellSubmit,
}) {

    // Local mirrors for inputs (to keep typing smooth)
    const [sizeInput, setSizeInput] = useState(sizeForRandomGen || '');
    const [startInput, setStartInput] = useState(start || '');
    const [endInput, setEndInput] = useState(end || '');

    // If parent for some reason changes sizeForRandomGen, start, end
    // and not the user from typing, update the form content.
    // For example, maybe clicking another button set sizeForRandomGen in parent
    // to another value.
    useEffect(() => setSizeInput(sizeForRandomGen || ''), [sizeForRandomGen]);
    useEffect(() => setStartInput(start || ''), [start]);
    useEffect(() => setEndInput(end || ''), [end]);

    // Derive coord/edge matrix from string encoding
    const coordMatrix = coords.split(",").map(pair => {
        const [x, y] = pair.split("-").map(Number);
        return [x, y];
    });

    const edgeMatrix = Array.from({ length: coordMatrix.length }, () => Array(coordMatrix.length).fill(0));
    if (edges.trim() !== "") {
    edges.split(",").forEach(edge => {
        const [i, j, w] = edge.split("-").map(Number);
        if (!Number.isNaN(i) && !Number.isNaN(j) && !Number.isNaN(w)) {
        edgeMatrix[i - 1][j - 1] = w;
        edgeMatrix[j - 1][i - 1] = w; // undirected assumption
        }
    });
    }

    // Many items conditionally rendered, for examples AStar will support heuristics
    // BFS/DFS will not. So the heurisitc prop will be null and not rendered for
    // BFS/DFS. Assumed that all users of EuclideanMatrixParams will have forms
    // for edge and coord input. Conditionally render matrices and edge form
    // since gwrap doesnt use it.
    return ( 
    <>
        {/* forms for sizeForRandomGen/start/end buttons for heuristic and weight calculation modes */}
        {sizeForRandomGen !== undefined && (
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

        {coords && (
        <div>
            <ParamForm
                buttonName="Set&nbsp;X-Y&nbsp;Coordinates"
                formClassName="formLeft"
                value={coords}
                handleSubmit={handleCoordsSubmit}
                onInputChange={onCoordsChange}
            />
        </div>
        )}

        {edges && (
        <div>
            <ParamForm
                buttonName="Set&nbsp;Edges/Weights"
                formClassName="formLeft"
                value={edges}
                handleSubmit={handleEdgesSubmit}
                onInputChange={onEdgesChange}
            />
        </div>
        )}


        {/* Matrix representation */}
        {(coords || edges) && (
        <div style={{ display: "flex", gap: "2rem"}}>
            {/* Coordinate Table */}
            {coords && (
            <>
                <h4>Coordinates (X,Y)</h4>
                <table border="1" cellPadding="5" style={{ borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                        <th>Node</th>
                        <th>X</th>
                        <th>Y</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coordMatrix.map(([x, y], i) => (
                        <tr key={i}>
                            <td>{i + 1}</td>
                            {[x, y].map((val, j) => (
                            <td key={j}>
                                <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const newVal = e.target[0].value;
                                    onCoordCellSubmit(i, j, newVal);
                                }}
                                >
                                    <input key={`${i}-${j}-${val}`} type="text" defaultValue={val} style={{ width: "3rem" }} />
                                </form>
                            </td>
                            ))}
                        </tr>
                        ))}
                    </tbody>
                </table>
            </>
            )}
            {edges && (
            <>
                <h4>Edges (0, 1)</h4>
                <table border="1" cellPadding="5" style={{ borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                        <th>Node</th>
                        {Array.from({ length: coordMatrix.length}, (_, j) => (
                            <th key={j}>{j + 1}</th>
                        ))}
                        </tr>
                    </thead>
                    <tbody>
                        {edgeMatrix.map((row, i) => (
                        <tr key={i}>
                            <td>{i + 1}</td>
                            {row.map((val, j) => (
                            <td key={j}>
                                <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const newVal = e.target[0].value;
                                    onEdgeCellSubmit(i, j, newVal);
                                }}
                                >
                                    <input key={`${i}-${j}-${val}`} type="text" defaultValue={val} style={{ width: "3rem" }} />
                                </form>
                            </td>
                            ))}
                        </tr>
                        ))}
                    </tbody>
                </table>
            </>
            )}
        </div>
        )}

    </>
    )
}

EuclideanMatrixParams.propTypes = {
  sizeForRandomGen: PropTypes.string.isRequired,
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
  handleCoordsSubmit: PropTypes.func.isRequired,
  handleEdgesSubmit: PropTypes.func.isRequired,
  onCoordsChange: PropTypes.func,
  onEdgesChange: PropTypes.func,
  onCoordCellSubmit: PropTypes.func,
  onEdgeCellSubmit: PropTypes.func,
};

export default EuclideanMatrixParams;