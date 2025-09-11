import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/*
  This file defines the parameter message component.

  Parameter components should include a placeholder in their markup
  where validation or status messages can be displayed. This component
  is rendered in that space.

  See also the utility wrappers `successParamMsg` and `errorParamMsg`
  at the bottom of the file.
*/

function ParamMsg({ logWarning, logTag, logMsg }) {
  const warningCol = '#FB3640';
  const successCol = '#52AA5E';

  // Scroll logContainer into view on every render
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;

    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  });

  return (
    <div ref={ref} className="logContainer">
      <span
        className="logTag"
        data-testid="logTag"
        style={logWarning ? { color: warningCol } : { color: successCol }}
      >
        { logTag }
      </span>
      <br />
      <span className="logText">{ logMsg }</span>
    </div>
  );
}

ParamMsg.propTypes = ({
  logWarning: PropTypes.bool.isRequired,
  logTag: PropTypes.string.isRequired,
  logMsg: PropTypes.string.isRequired,
});

export default ParamMsg;

/**
 *
 * @param {string} example optional provided
 * @param {string} reason optional provided, if not provide, use default value
 */
export const errorParamMsg = (
  reason
) => (
  <ParamMsg
    logWarning
    logTag="Oops..."
    logMsg={`${reason}\n`}
  />
);