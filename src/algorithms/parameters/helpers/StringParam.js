/* eslint-disable react/prop-types */
/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext } from 'react';
import '../../../styles/Param.scss';
import { GlobalActions } from '../../../context/actions';
import StringParamForm from './StringParamForm';
import {
  successParamMsg,
  errorParamMsg,
  stringValidCheck,
} from './ParamHelper';
import { GlobalContext } from '../../../context/GlobalState';

/**
 * This list param component can be used when
 * the param input accepts a list
 */
function StringParam({
  name, buttonName, mode, DEFAULT_STRING, SET_STRING, DEFAULT_PATTERN, SET_PATTERN, ALGORITHM_NAME,
  EXAMPLE, formClassName, handleSubmit, setMessage,
}) {
  const { algorithm, dispatch } = useContext(GlobalContext);
  const disabled = algorithm.hasOwnProperty('visualisers') && algorithm.playing;

  /**
   * The default function that uses the list of values to
   * run an animation. It will check whether the input list
   * is valid first.
   */
  const handleDefaultSubmit = (e) => {
    e.preventDefault();
    // check whether both input fields are valid string and patterns
    const string = e.target[0].value;
    const pattern = e.target[1].value;
    if (stringValidCheck(string) && stringValidCheck(pattern)) {
      // SET_VAL(nodes);
      // run animation
      dispatch(GlobalActions.RUN_ALGORITHM, { name, mode, nodes: [string, pattern] });
      setMessage(successParamMsg(ALGORITHM_NAME));
    } else {
      setMessage(errorParamMsg(ALGORITHM_NAME, EXAMPLE));
    }
  };

  return (
    <StringParamForm
      formClassName={formClassName}
      name={ALGORITHM_NAME}
      mode={mode}
      buttonName={buttonName}
      string={DEFAULT_STRING}
      pattern={DEFAULT_PATTERN}
      disabled={disabled}
      stringInputName="String"
      patternInputName="Pattern"
      stringOnChange={(e) => {
        SET_STRING(e.target.value);
      }}
      patternOnChange={(e) => {
        SET_PATTERN(e.target.value);
      }}
      // If no customized handle function is provided, the default one will be used
      handleSubmit={
        handleSubmit && typeof handleSubmit === 'function'
          ? handleSubmit
          : handleDefaultSubmit
      }
    />
  );
}

export default StringParam;
