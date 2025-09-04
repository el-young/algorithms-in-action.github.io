/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import ControlButton from '../../../components/common/ControlButton';
import '../../../styles/Param.scss';
import { GlobalContext } from '../../../context/GlobalState';

/**
 * ParamForm:
 * - Wraps an input, optional icons, and a submit button.
 * - Keeps its own local state for typing, but syncs with `value` prop on changes.
 */
function ParamForm({
  formClassName,
  buttonName,
  value,
  handleSubmit,
  children,
  disabled,
  onInputChange,
}) {

  const { algorithm } = useContext(GlobalContext);
  const isDisabled = disabled ? disabled : 
                    ('visualisers' in algorithm && algorithm.playing);
  
  // Local state for typing
  const [inputValue, setInputValue] = useState(value);

  // Sync parent changes down into local state
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <form className={formClassName} onSubmit={handleSubmit}>
      <div className="outerInput">
        <label className="inputText">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (onInputChange) onInputChange();
            }}
          />
        </label>
        <div className="btnGrp">
          {children}
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

ParamForm.propTypes = {
  formClassName: PropTypes.string.isRequired,
  buttonName: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  children: PropTypes.node,
  disabled: PropTypes.bool.isRequired,
  onInputChange: PropTypes.func,
};

export default ParamForm;