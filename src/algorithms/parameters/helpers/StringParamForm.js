/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import ControlButton from '../../../components/common/ControlButton';
import '../../../styles/Param.scss';
import { GlobalContext } from '../../../context/GlobalState';

/**
 * StringParamForm:
 * - Wraps two inputs (`string` and `pattern`) and a submit button.
 * - Calls parent callbacks (`stringOnChange`, `patternOnChange`) on edits.
 */
function StringParamForm({
  formClassName,
  buttonName,
  string,
  pattern,
  setString,
  setPattern,
  disabled,
  stringOnChange,
  patternOnChange,
}) {
  const { algorithm } = useContext(GlobalContext);
  const isDisabled = disabled ? disabled : 
                    ('visualisers' in algorithm && algorithm.playing);

  return (
    <form className={formClassName} onSubmit={(e) => {
        e.preventDefault();
        setString(e.target[0].value);
        setPattern(e.target[1].value);
    }}>
      <div className="outerInput">
        <label className="inputText">
          <div className="stringContainer">String</div>
          <div className="inputContainer">
            <input
              key={string}
              type="text"
              defaultValue={string}
              onChange={(e) => {
                e.preventDefault();
                if (stringOnChange) stringOnChange(e);
              }}
            />
          </div>
        </label>
        <label className="inputText">
          <div className="stringContainer">Pattern</div>
          <div className="inputContainer">
            <input
              key={pattern}
              type="text"
              defaultValue={pattern}
              onChange={(e) => {
                e.preventDefault();
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
  setString: PropTypes.func.isRequired,
  setPattern: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  stringOnChange: PropTypes.func,
  patternOnChange: PropTypes.func,
};

export default StringParamForm;