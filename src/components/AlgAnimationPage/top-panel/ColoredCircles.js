import React from "react";
import PropTypes from "prop-types";
import "../../../styles/ColoredCircle.scss";

// Circle class that can be coloured in the four quadrants. The properties
// will apply class names to the divs for each quadrant. If you want to select
// by colour ensure the props passed in are classed to have a specific colour in
// in the imported css file above.
export function ColorQuadrantCircle({ topLeft, topRight, bottomLeft, bottomRight, noSplitters=false }) {
  return (
    <div className="color-quadrant-circle">
      <div className={`quadrant top-left ${topLeft}`} />
      <div className={`quadrant top-right ${topRight}`} />
      <div className={`quadrant bottom-left ${bottomLeft}`} />
      <div className={`quadrant bottom-right ${bottomRight}`} />

      {/* Splitters */}
      {!noSplitters && (
        <>
          <div className="splitter vertical" />
          <div className="splitter horizontal" />
        </>
      )}
    </div>
  );
}

// Wrapper component just sets all four quadrants to the same color
// and does not include splitters.
export function ColorCircle({ colorClass }) {
  return (
    <ColorQuadrantCircle
      topLeft={colorClass}
      topRight={colorClass}
      bottomLeft={colorClass}
      bottomRight={colorClass}
      noSplitters={true}
    />
  );
}

ColorCircle.propTypes = {
  colorClass: PropTypes.string.isRequired,
};

ColorQuadrantCircle.propTypes = {
  topLeft: PropTypes.string.isRequired,
  topRight: PropTypes.string.isRequired,
  bottomLeft: PropTypes.string.isRequired,
  bottomRight: PropTypes.string.isRequired,
  noSplitters: PropTypes.bool,
};