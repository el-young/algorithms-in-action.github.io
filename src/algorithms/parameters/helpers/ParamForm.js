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
  setValue,
  children,
  disabled,
  onInputChange,
}) {
  const { algorithm } = useContext(GlobalContext);
  const isDisabled = disabled ? disabled : 
                    ('visualisers' in algorithm && algorithm.playing);
  
  return (
    <form 
      className={formClassName} 
      onSubmit={(e) => {
        e.preventDefault();
        setValue(e.target[0].value);
      }}
    >
      <div className="outerInput">
        <label className="inputText">
          <input
            key={value}
            type="text"
            defaultValue={value}
            onChange={() => {
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
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  onInputChange: PropTypes.func,
};

export default ParamForm;