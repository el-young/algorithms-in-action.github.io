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
const FIND_EXAMPLE = EXAMPLES.UF_FIND;
const UNION_EXAMPLE = EXAMPLES.UF_UNION;

const defaultProps = {
  mode: UNION,
  union: "1-2,3-4,2-4,1-5,6-8,3-6",
  value : '2',
  compress: true,
};

// Use aliasing if name space collisions are annoying
function UFParam({ alg, mode: urlMode, union: urlUnion, value: urlValue, compress, unionStep }) {
  const [ message, setMessage ] = useState(null);
  const { algorithm, dispatch } = useContext(GlobalContext);
  const [ unions, setUnions ]   = useState(urlUnion || defaultProps.union);
  const [isPathCompression, setIsPathCompression] = useState(
    compress === "true" ? true : compress === "false" ? false : defaultProps.compress
  );
  const [ value, setValue ]     = useState(urlValue || defaultProps.value);
  const [ mode, setMode ]       = useState(urlMode || defaultProps.mode);


  useEffect(() => {
    if (mode === UNION) {
      dispatch(GlobalActions.LOAD_ALGORITHM, {
        name: 'unionFind',
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
      if (!algorithm?.chunker?.visualisers) {
        // This is the first call to LOAD_ALGORITHM and the URL is 
        // specifying this mode, but this mode requires a built
        // visualiser from the other mode, build this visualiser
        // first
        dispatch(GlobalActions.LOAD_ALGORITHM, {
          name: 'unionFind',
          mode: UNION,
          target: {
            arg1: unions
              .split(',')
              .map((pair) => pair.trim().split('-').map(Number)),
            arg2: isPathCompression,
          },
        });

        // TODO: clamp union step if null just run till the end.
        // convert to int too.
        dispatch(GlobalActions.NEXT_LINE, {stopAt: unionStep});
        // Visualiser should be in global state now.
      }

      dispatch(GlobalActions.LOAD_ALGORITHM, {
        name: 'unionFind',
        mode: FIND,
        visualiser: algorithm?.chunker?.visualisers,

        url: {
          alg,
          mode: FIND,
          union: unions,
          value,
          compress: isPathCompression.toString(),
          // If user wants to load in other mode need to build
          // visualiser in insert mode first.
          unionStep: algorithm?.chunker?.currentChunk
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
      setMessage(errorParamMsg(ERRORS.UF_FIND, FIND_EXAMPLE));
    }
  };

  const handleUnion = (e) => {
    e.preventDefault();
    const textInput = e.target[0].value.replace(/\s+/g, '');
    if (validateTextInput(textInput)) {
      setUnions(textInput);
      setMode(UNION);
      // Clear error message, if it exists.
      setMessage(null);
    } else {
      setMessage(errorParamMsg(ERRORS.UF_UNION, UNION_EXAMPLE));
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


/**
 * Validate the text input within the DualValueParam component.
 * @param {String} value The text input.
 * @returns {Boolean} Whether the text input is valid.
 */
function validateTextInput(value) {
  if (!value) return false;

  // ensuring only allowable characters
  if (!/^[0-9,-\s]+$/.test(value)) return false;

  // splits the string into an array of pairs
  const pairs = value.split(',').map((pair) => pair.trim());

  // checks if each pair is valid
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('-');

    // checks only two values in pair
    if (pair.length !== 2) return false;

    // checks if each value in pair is in domain
    if (pair.some((val) => isNaN(val) || !N_ARRAY.includes(val))) return false;
  }
  return true;
}