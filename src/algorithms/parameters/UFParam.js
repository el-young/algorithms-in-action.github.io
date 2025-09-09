/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';

import { withStyles } from '@mui/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { GlobalActions } from '../../context/actions';
import { GlobalContext } from '../../context/GlobalState';
import { errorParamMsg } from './helpers/ParamMsg';
import ParamFormRefresh from './helpers/ParamFormRefresh';
import '../../styles/Param.scss';
import PropTypes from 'prop-types'; // Import this for URL Param
import { ERRORS, EXAMPLES } from './helpers/ErrorExampleStrings';
import ParamForm from './helpers/ParamForm';
import { union } from 'lodash';
import { dualValueParamValidCheck } from './helpers/InputValidators';

// button styling
const BlueRadio = withStyles({
  root: {
    color: '#2289ff',
    '&$checked': {
      color: '#027aff',
    },
  },
  checked: {},
  // eslint-disable-next-line react/jsx-props-no-spreading
})((props) => <Radio {...props} />);

const UNION = 'union';
const FIND = 'find';
const N_ARRAY = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

const defaultProps = {
  mode: UNION,
  union: "1-2,3-4,2-4,1-5,6-8,3-6",
  value : '2',
  compress: true,
};

function UFParam({ alg, 
  //mode: urlMode, // TODO: mode from prop not supported, must start in default mode.
  union: urlUnion, value: urlValue, compress
}) {
  // TODO: URL validation.
  const [ message, setMessage ] = useState(null);
  const { algorithm, dispatch } = useContext(GlobalContext);
  const [ unions, setUnions ]   = useState(urlUnion || defaultProps.union);
  const [isPathCompression, setIsPathCompression] = useState(
    compress === "true" ? true : compress === "false" ? false : defaultProps.compress
  );
  const [ value, setValue ]     = useState(urlValue || defaultProps.value);
  const [ mode, setMode ]       = useState(defaultProps.mode);

  useEffect(() => {
    if (mode === UNION) {
      dispatch(GlobalActions.LOAD_ALGORITHM, {
        name: alg,
        mode: UNION,

        url: {
          alg,
          mode: UNION,
          union: unions,
          value,
          compress: isPathCompression.toString(),
        },

        target: {
          arg1: unions
            .split(',')
            .map((pair) => pair.trim().split('-').map(Number)),
          arg2: isPathCompression,
        },
      });
    } else {
      dispatch(GlobalActions.LOAD_ALGORITHM, {
        name: alg,
        mode: FIND,
        visualiser: algorithm?.chunker?.visualisers,

        url: {
          alg,
          mode: FIND,
          union: unions,
          value,
          compress: isPathCompression.toString(),
        },

        target: {
          arg1: parseInt(value, 10),
          arg2: isPathCompression,
        },
      });
    }
  }, [unions, value, isPathCompression, mode]);

  // toggling path compression (i.e., a boolean value)
  const handleChange = () => setIsPathCompression((prevState) => !prevState);

  // validating input before find submission
  const handleFind = (e) => {
    e.preventDefault();
    const inputValue = e.target[0].value;
    // eslint-disable-next-line no-restricted-globals
    if (!Number.isNaN(Number(inputValue)) || !N_ARRAY.includes(inputValue)) {
      setValue(inputValue);
      setMode(FIND);
      // Clear error message, if it exists.
      setMessage(null);
    } else {
      if (!Number.isNaN(Number(inputValue))) setMessage(errorParamMsg(ERRORS.GEN_POSITIVE_INT, EXAMPLES.UF_FIND));
      else setMessage(errorParamMsg(ERRORS.GEN_NUMBER_NOT_IN_DOMAIN, EXAMPLES.UF_FIND));
    }
  };

  const handleUnion = (e) => {
    e.preventDefault();
    const textInput = e.target[0].value.replace(/\s+/g, '');
    const check = dualValueParamValidCheck(textInput, N_ARRAY);
    if (!check.valid) {
      setMessage(errorParamMsg(check.error, EXAMPLES.UF_UNION));
    } else if (!algorithm?.visualisers) {
      setMessage(errorParamMsg(ERRORS.GEN_BUILD_VISUALISER_FIRST("union find array", UNION)));
    } else {
      setUnions(textInput);
      setMode(UNION);
      // Clear error message, if it exists.
      setMessage(null);
    }
  };

  return (
    <>
      <div className="form">
        <ParamFormRefresh
          buttonName="Union"
          formClassName="formLeft"
          value={unions}
          handleSubmit={handleUnion}
          refreshFunction={() => defaultProps.union}
        />

        <ParamForm
          buttonName="Find"
          formClassName="formRight"
          value={value}
          handleSubmit={handleFind}
        />
      </div>

      <span className="generalText">Path compression: &nbsp;&nbsp;</span>
      <FormControlLabel
        control={
          <BlueRadio
            checked={isPathCompression}
            onChange={handleChange}
            name="on"
          />
        }
        label="On"
        className="checkbox"
      />
      <FormControlLabel
        control={
          <BlueRadio
            checked={!isPathCompression}
            onChange={handleChange}
            name="off"
          />
        }
        label="Off"
        className="checkbox"
      />
      {/* render success/error message */}
      {message}
    </>
  );
}

// Define the prop types for URL Params
UFParam.propTypes = {
  alg: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  union: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  compress: PropTypes.string,
};

export default UFParam;