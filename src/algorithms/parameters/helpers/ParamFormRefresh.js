/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ControlButton from '../../../components/common/ControlButton';
import '../../../styles/Param.scss';
import { ReactComponent as RefreshIcon } from '../../../assets/icons/refresh.svg';
import ParamForm from './ParamForm';
import { GlobalContext } from '../../../context/GlobalState';

/**
 * Stateless component.
 * - Only renders UI.
 * - Parent must pass in callbacks (handleSubmit, refreshFunction, etc.).
 * - ParamForm with refresh button added.
 */
function ParamFormRefresh({
  buttonName,
  value,
  formClassName,
  setValue,
  refreshFunction,
  onInputChange,
}) {
  const { algorithm } = useContext(GlobalContext);
  const disabled = algorithm.hasOwnProperty('visualisers') && algorithm.playing;

  return (
    <ParamForm
      formClassName={formClassName}
      buttonName={buttonName}
      value={value}
      disabled={disabled}
      setValue={setValue}
      onInputChange={onInputChange}
    >
      <ControlButton
        icon={<RefreshIcon />}
        className={disabled ? 'greyRoundBtnDisabled' : 'greyRoundBtn'}
        disabled={disabled}
        onClick={refreshFunction}
      />
    </ParamForm>
  );
}

ParamFormRefresh.propTypes = {
  buttonName: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  formClassName: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  refreshFunction: PropTypes.func.isRequired,
  onInputChange: PropTypes.func,
};

export default ParamFormRefresh;