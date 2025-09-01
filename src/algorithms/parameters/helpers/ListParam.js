/* eslint-disable react/prop-types */
/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext } from 'react';
import ControlButton from '../../../components/common/ControlButton';
import '../../../styles/Param.scss';
import { ReactComponent as RefreshIcon } from '../../../assets/icons/refresh.svg';
import { GlobalActions } from '../../../context/actions';
import ParamForm from './ParamForm';
import {
  commaSeparatedNumberListValidCheck,
  genRandNumList,
  errorParamMsg,
} from './ParamHelper';

import useParam from '../../../context/useParam';
import { GlobalContext } from '../../../context/GlobalState';

/**
 * This list param component can be used when
 * the param input accepts a list
 */
function ListParam({
  buttonName, mode, DEFAULT_VAL, formClassName, handleSubmit, REFRESH_FUNCTION
}) {
  const { algorithm } = useContext(GlobalContext);
  const disabled = algorithm.hasOwnProperty('visualisers') && algorithm.playing;

  return (
    <ParamForm
      formClassName={formClassName}
      mode={mode}
      buttonName={buttonName}
      value={DEFAULT_VAL}
      disabled={disabled}
      handleSubmit={handleSubmit}
    >
      <ControlButton
        icon={<RefreshIcon />}
        className={disabled ? 'greyRoundBtnDisabled' : 'greyRoundBtn'}
        disabled={disabled}
        onClick={REFRESH_FUNCTION}
      />
    </ParamForm>
  );
}

export default ListParam;
