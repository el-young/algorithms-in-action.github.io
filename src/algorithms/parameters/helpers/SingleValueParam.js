/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext } from 'react';
import '../../../styles/Param.scss';
import { GlobalActions } from '../../../context/actions';
import ParamForm from './ParamForm';
import {
  singleNumberValidCheck,
  successParamMsg,
  errorParamMsg,
} from './ParamHelper';
import { GlobalContext } from '../../../context/GlobalState';

/**
 * This single value param component can be used when
 * the param input accepts a single number
 */
function SingleValueParam({
  name, buttonName, mode, DEFAULT_VAL, ALGORITHM_NAME,
  EXAMPLE, formClassName, handleSubmit, setMessage, UNCHECK_CASES
}) {
  const { algorithm } = useContext(GlobalContext);
  
  return (
    <ParamForm
      formClassName={formClassName}
      name={ALGORITHM_NAME}
      mode={mode}
      buttonName={buttonName}
      value={DEFAULT_VAL}
      disabled={algorithm.hasOwnProperty('visualisers') && algorithm.playing}
      handleSubmit={handleSubmit}
      UNCHECK_CASES={UNCHECK_CASES}
    />
  );
}

export default SingleValueParam;
