/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
import StringParamForm from './helpers/StringParamForm';
import '../../styles/Param.scss';
import PropTypes from 'prop-types'; // Import this for URL Param
import { stringValidCheck } from './helpers/InputValidators';
import { errorParamMsg } from './helpers/ParamMsg';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';

const defaultProps = {
    mode: "search",
    string: 'dcaccdddabddac',
    pattern: 'ddac'
};

function HSSParam({ alg, string: urlString, pattern: urlPattern }) {
  const { dispatch } = useContext(GlobalContext);
  const [message, setMessage] = useState(null);
  const [string, setString] = useState(urlString || defaultProps.string);
  const [pattern, setPattern] = useState(urlPattern || defaultProps.pattern);

  const handleSubmit = (e) => {
    e.preventDefault();
    const stringVal = e.target[0].value;
    const patternVal = e.target[1].value;

    const { valid: stringOk, error: stringErr } = stringValidCheck(stringVal);
    const { valid: patternOk, error: patternErr } = stringValidCheck(patternVal);

    if (stringOk && patternOk) {
      setString(stringVal);
      setPattern(patternVal);
      setMessage(null);
    } else {
      if (!stringOk) {
        setMessage(errorParamMsg(stringErr));
      } else {
        setMessage(errorParamMsg(patternErr));
      }
    }
  };

  useEffect(() => {
    dispatch(GlobalActions.LOAD_ALGORITHM, {
      name: alg,
      mode: defaultProps.mode,

      url: {
        alg,
        mode: defaultProps.mode,
        string,
        pattern,
      },

      nodes: [string, pattern],
    });
  }, [string, pattern]);
  
  return (
    <>
      <div className="form">
        <StringParamForm
          buttonName="Search"
          formClassName="formLeft"
          handleSubmit={handleSubmit}
          string={string}
          pattern={pattern}
        />
      </div>
      {/* render success/error message */}
      {message}
    </>
  );
}

// Define the prop types for URL Params
HSSParam.propTypes = {
  alg: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  string: PropTypes.string.isRequired,
  pattern: PropTypes.string.isRequired
};

export default HSSParam;