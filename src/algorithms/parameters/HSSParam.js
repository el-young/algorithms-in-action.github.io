/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
import StringParamForm from './helpers/StringParamForm';
import '../../styles/Param.scss';
import PropTypes from 'prop-types';
import { stringValidCheck } from './helpers/InputValidators';
import { errorParamMsg } from './helpers/ParamMsg';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';

const defaultProps = {
  mode: "search",
  string: "dcaccdddabddac",
  pattern: "ddac",
};

function HSSParam({ alg, string: urlString, pattern: urlPattern }) {
  const { dispatch } = useContext(GlobalContext);

  // state as strings
  const [ string, setString ]   = useState(urlString || defaultProps.string);
  const [ pattern, setPattern ] = useState(urlPattern || defaultProps.pattern);
  const [ message, setMessage ] = useState(null);

  useEffect(() => {
    const { valid, errors } = validateAll();

    if (valid) {
      dispatch(GlobalActions.LOAD_ALGORITHM, {
        name: alg,
        mode: defaultProps.mode,
        url: { alg, mode: defaultProps.mode, string, pattern },
        nodes: [string, pattern],
      });
      setMessage(null);
    } else {
      setMessage(errorParamMsg(errors.join("\n")));
    }
  }, [string, pattern]);

  const validateAll = () => {
    const errors = [];

    const { valid: stringOk, error: stringErr } = stringValidCheck(string);
    if (!stringOk) errors.push(stringErr);

    const { valid: patternOk, error: patternErr } = stringValidCheck(pattern);
    if (!patternOk) errors.push(patternErr);

    return { valid: errors.length === 0, errors };
  };

  return (
    <>
      <div className="form">
        <StringParamForm
          buttonName="Search"
          formClassName="formLeft"
          string={string}
          pattern={pattern}
          setString={setString}
          setPattern={setPattern}
        />
      </div>
      {message}
    </>
  );
}

HSSParam.propTypes = {
  alg: PropTypes.string.isRequired,
  mode: PropTypes.string,
  string: PropTypes.string,
  pattern: PropTypes.string,
};

export default HSSParam;
