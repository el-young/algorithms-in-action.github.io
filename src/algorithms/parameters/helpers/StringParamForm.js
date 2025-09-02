/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext,useEffect } from 'react';
import ControlButton from '../../../components/common/ControlButton';
import { GlobalContext } from '../../../context/GlobalState';
import '../../../styles/Param.scss';

/**
 * The ParamForm wraps a input, icon(optional) and a button.
 */
function StringParamForm(props) {
  const {
    formClassName, buttonName, string, stringOnChange,
    pattern, patternOnChange, handleSubmit, disabled, mode
  } = props;

  return (
    <form className={formClassName} onSubmit={handleSubmit}>
      <div className="outerInput">
        <label className="inputText">
          <div className="stringContainer">
            String
          </div>
          <div className="inputContainer">
            <input
              // name={name}
              type="text"
              value={string}
              onChange={stringOnChange}
            />
          </div>
        </label>
        <label className="inputText">
          <div className="stringContainer">
            Pattern
          </div>
          <div className="inputContainer">
            <input
              // name={name}
              type="text"
              value={pattern}
              onChange={patternOnChange}
            />
          </div>
        </label>
        <div className="btnGrp">
          {/** this children is left to add icons */}
          {/* {children} */}
          <ControlButton
            className={disabled ? 'blueWordBtnDisabled' : 'blueWordBtn'}
            id={mode ? `startBtnGrp-${mode}`: `startBtnGrp`}
            type="submit"
            disabled={disabled}
          >
            {buttonName}
          </ControlButton>
        </div>
      </div>
    </form>
  );
}

export default StringParamForm;
