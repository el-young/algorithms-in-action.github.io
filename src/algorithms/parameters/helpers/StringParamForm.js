/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import ControlButton from '../../../components/common/ControlButton';
import '../../../styles/Param.scss';
import { GlobalContext } from '../../../context/GlobalState';

/**
 * StringParamForm:
 * - Wraps two inputs (`string` and `pattern`) and a submit button.
 * - Keeps its own local state for typing, but syncs with parent props.
 * - Calls parent callbacks (`stringOnChange`, `patternOnChange`) on edits.
 */
function StringParamForm({
  formClassName,
  buttonName,
  string,
  pattern,
  handleSubmit,
  disabled,
  stringOnChange,
  patternOnChange,
}) {
  const { algorithm } = useContext(GlobalContext);
  const isDisabled = disabled ? disabled : 
                    (algorithm.hasOwnProperty('visualisers') && algorithm.playing);

  // Local state for typing
  const [stringValue, setStringValue] = useState(string);
  const [patternValue, setPatternValue] = useState(pattern);

  useEffect(() => {
    setStringValue(string);
  }, [string]);

  useEffect(() => {
    setPatternValue(pattern);
  }, [pattern]);

  return (
    <form className={formClassName} onSubmit={handleSubmit}>
      <div className="outerInput">
        <label className="inputText">
          <div className="stringContainer">String</div>
          <div className="inputContainer">
            <input
              type="text"
              value={stringValue}
              onChange={(e) => {
                setStringValue(e.target.value);
                if (stringOnChange) stringOnChange(e);
              }}
            />
          </div>
        </label>
        <label className="inputText">
          <div className="stringContainer">Pattern</div>
          <div className="inputContainer">
            <input
              type="text"
              value={patternValue}
              onChange={(e) => {
                setPatternValue(e.target.value);
                if (patternOnChange) patternOnChange(e);
              }}
            />
          </div>
        </label>
        <div className="btnGrp">
          <ControlButton
            className={isDisabled ? 'blueWordBtnDisabled' : 'blueWordBtn'}
            type="submit"
            disabled={isDisabled}
          >
            {buttonName}
          </ControlButton>
        </div>
      </div>
    </form>
  );
}

StringParamForm.propTypes = {
  formClassName: PropTypes.string.isRequired,
  buttonName: PropTypes.string.isRequired,
  string: PropTypes.string.isRequired,
  pattern: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  stringOnChange: PropTypes.func.isRequired,
  patternOnChange: PropTypes.func.isRequired,
};

export default StringParamForm;