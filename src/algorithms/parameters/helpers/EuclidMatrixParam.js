import React, { useState, useEffect } from 'react';
import PropTypes, { arrayOf } from 'prop-types';
import '../../../styles/EuclideanMatrix.scss';
import '../../../styles/Param.scss';
import ParamFormRefresh from './ParamFormRefresh';
import ParamForm from './ParamForm';

// symmetric // Parent im assuming this is for random node gen
// circular  // Parent im assuming this is for random node gen
// unweighted, // Might not be relevant if parent visualiser makes edges unweighted when we pass in 1-2

// TODO: Needs some CSS polish.
function EuclideanMatrixParams({
    start,                      // Node to start search from
    end,                        // Node to end search at, can be left null.
    weightCalc,                 // weightCalculation, Manhattan, as input, etc.
    heuristic,                  // huerisitc, Manhattan, as input, etc.
    coords,                     // Default coords to display in form
    edges,                      // Default edges to display in form

    // Callbacks
    setStart,
    setEnd,
    setCoords, 
    setEdges,
    changeWeightCalc,
    changeHeuristic,
    onCoordsChange, onEdgesChange, // In case you want side effects when user types into forms
    onCoordCellSubmit,
    onEdgeCellSubmit,
    genRandGraph,
}) {

    // Derive coord/edge matrix from string encoding
    const coordMatrix = coords.split(",").map(pair => {
        const [x, y] = pair.split("-").map(Number);
        return [x, y];
    });

    const edgeMatrix = Array.from({ length: coordMatrix.length }, 
        () => Array(coordMatrix.length).fill(0));

    if (edges.trim() !== "") {
        edges.split(",").forEach(edge => {
            const [i, j, w] = edge.split("-").map(Number);

            // Only include if both endpoints are valid
            if (
            Number.isInteger(i) && Number.isInteger(j) && Number.isInteger(w) &&
            i >= 1 && i <= coordMatrix.length &&
            j >= 1 && j <= coordMatrix.length
            ) {
            edgeMatrix[i - 1][j - 1] = w;
            edgeMatrix[j - 1][i - 1] = w; // undirected assumption
            }
        });
    }
    
    // Many items conditionally rendered, for examples AStar will support heuristics
    // BFS/DFS will not. So the heurisitc prop will be null and not rendered for
    // BFS/DFS.
    return ( 
    <>
        {/* forms for sizeForRandomGen/start/end buttons for heuristic and weight calculation modes */}
        {genRandGraph != null && (
            <div className="outerInput">
                <label className="inputText" htmlFor="sizeInput">
                Random Graph Size:&nbsp;
                </label>
                <input
                    id="randSizeInput"
                    type="text"
                    placeholder="e.g. 10"
                    onBlur={(e) => genRandGraph(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            e.target.blur(); // Trigger callback in onBlur
                            // otherwise enter then leave input triggers twice
                        }
                    }}
                />
            </div>
        )}

        {start != null && (
            <div className="outerInput">
                <label className="inputText" htmlFor="startInput">
                Start:&nbsp;
                </label>
                <input
                    key={start} // re-mount when prop changes
                    id="startInput"
                    type="text"
                    defaultValue={start}
                    onBlur={(e) => setStart(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            e.target.blur();
                        }
                    }}
                />
            </div>
        )}

        {weightCalc != null && (
            <button
                className="algorithmBtn"
                onClick={changeWeightCalc}
            >
                Weights: {weightCalc}
            </button>
        )}

        {heuristic != null && (
            <button
                className="algorithmBtn"
                onClick={changeHeuristic}
            >
                Heuristic: {heuristic}
            </button>
        )}

        {end != null && (
            <div className="outerInput">
                <label className="inputText" htmlFor="endInput">
                    End:&nbsp;
                </label>
                <input
                    key={end} // re-mount when prop changes
                    id="endInput"
                    type="text"
                    defaultValue={end}
                    onBlur={(e) => setEnd(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            e.target.blur();
                        }
                    }}
                />
            </div>
        )}

        {coords != null && (
        <div>
            <ParamForm
                formClassName='formLeft'
                buttonName="Set&nbsp;X-Y&nbsp;Coordinates"
                value={coords}
                setValue={setCoords}
                onInputChange={onCoordsChange}
            />
        </div>
        )}

        {edges != null && (
        <div>
            <ParamForm
                formClassName='formLeft'
                buttonName="Set&nbsp;Edges/Weights"
                value={edges}
                setValue={setEdges}
                onInputChange={onEdgesChange}
            />
        </div>
        )}

        <div style={{ display: "flex", gap: "2rem" }}>
            {/* Coordinate Table */}
            {coords != null && (
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
                            <input
                                key={`${i}-${j}-${val}`} // force remount on value change
                                type="text"
                                defaultValue={val}
                                style={{ width: "3rem" }}
                                onBlur={(e) => onCoordCellSubmit(i, j, e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        e.target.blur();
                                    }
                                }}
                            />
                            </td>
                        ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
                </>
            )}

            {/* Edge Matrix */}
            {edges != null && (
                <>
                <h4>Edges (0, 1)</h4>
                <table border="1" cellPadding="5" style={{ borderCollapse: "collapse" }}>
                    <thead>
                    <tr>
                        <th>Node</th>
                        {Array.from({ length: coordMatrix.length }, (_, j) => (
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
                            <input
                                key={`${i}-${j}-${val}`} // force remount on value change
                                type="text"
                                defaultValue={val}
                                style={{ width: "3rem" }}
                                onBlur={(e) => onEdgeCellSubmit(i, j, e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        e.target.blur();
                                    }
                                }}
                            />
                            </td>
                        ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
                </>
            )}
        </div>
    </>
    )
}

EuclideanMatrixParams.propTypes = {
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  weightCalc: PropTypes.string,
  heuristic: PropTypes.string,
  coords: PropTypes.string.isRequired,
  edges: PropTypes.string.isRequired,

  // Callbacks
  setStart: PropTypes.func.isRequired,
  setEnd: PropTypes.func.isRequired,
  changeWeightCalc: PropTypes.func,
  changeHeuristic: PropTypes.func,
  setCoords: PropTypes.func.isRequired,
  setEdges: PropTypes.func.isRequired,
  onCoordsChange: PropTypes.func,
  onEdgesChange: PropTypes.func,
  onCoordCellSubmit: PropTypes.func,
  onEdgeCellSubmit: PropTypes.func,
  genRandGraph: PropTypes.func
};

export default EuclideanMatrixParams;