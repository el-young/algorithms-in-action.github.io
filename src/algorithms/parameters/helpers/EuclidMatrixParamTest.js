// EuclideanMatrixParamsTest.js
import React, { useState } from "react";
import EuclideanMatrixParams from "./EuclidMatrixParamNew";

function EuclideanMatrixParamsTest() {
  const [weightCalc, setWeightCalc] = useState("Euclidean");
  const [heuristic, setHeuristic] = useState("Manhattan");

  return (
    <div style={{ padding: "20px" }}>
      <EuclideanMatrixParams
        size="5"
        start="1"
        end="4"
        weightCalc={weightCalc}
        heuristic={heuristic}
        coords="1-1,2-2,3-3,4-4,5-5"
        edges="1-2,2-3,3-4,4-5"

        handleSizeSubmit={(e) => {
          e.preventDefault();
          console.log("Size submitted:", e.target[0].value);
        }}
        handleStartSubmit={(e) => {
          e.preventDefault();
          console.log("Start submitted:", e.target[0].value);
        }}
        handleEndSubmit={(e) => {
          e.preventDefault();
          console.log("End submitted:", e.target[0].value);
        }}
        changeWeightCalc={() =>
          setWeightCalc((prev) =>
            prev === "Euclidean" ? "Manhattan" : "Euclidean"
          )
        }
        changeHeuristic={() =>
          setHeuristic((prev) =>
            prev === "Manhattan" ? "Euclidean" : "Manhattan"
          )
        }
        generateRandomCoords={() => "1-1,2-2,3-3"}
        generateRandomEdges={() => "1-2,2-3"}
        handleCoordsSubmit={(e) => {
          e.preventDefault();
          console.log("Coords submitted:", e.target[0].value);
        }}
        handleEdgesSubmit={(e) => {
          e.preventDefault();
          console.log("Edges submitted:", e.target[0].value);
        }}
      />
    </div>
  );
}

export default EuclideanMatrixParamsTest;
