/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import ControlButton from '../../../components/common/ControlButton';
import '../../../styles/Param.scss';

function ParamForm({
  formClassName,
  name,
  buttonName,
  value,
  handleSubmit,
  children,
  disabled,
  UNCHECK_CASES,
}) {

  // local state for typing to be reflected
  const [inputValue, setInputValue] = useState(value);

  // Whenever parent changes `value` (like clicking `case` buttons),
  // sync it down into the local state so the box updates. useState
  // only reads from a prop once on mount, changing value prop will not
  // update inputValue without the next line. Before this was achieved
  // through simulating a click on the submit button.
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Have to do it in this unorthodox way because we need the input box
  // to update as user types.

  return (
    <form
      className={formClassName}
      onSubmit={handleSubmit}
    >
      <div className="outerInput">
        <label className="inputText">
          <input
            name={name}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value); 
              UNCHECK_CASES();
            }}
          />
        </label>
        <div className="btnGrp">
          {children}
          <ControlButton
            className={disabled ? 'blueWordBtnDisabled' : 'blueWordBtn'}
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

export default ParamForm;
