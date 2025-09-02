// minimal mods from BST- chould change some names XXX
// XXX radio button behaviour could still be improved
/* eslint-disable no-prototype-builtins */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext, useEffect, useRef } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { withStyles } from '@mui/styles';
import { GlobalContext } from '../../context/GlobalState';
import { URLContext, withAlgorithmParams } from '../../context/urlState';
import { GlobalActions } from '../../context/actions';
import ListParam from './helpers/ListParam';
import SingleValueParam from './helpers/SingleValueParam';
import '../../styles/Param.scss';
import {
  genUniqueRandNumList,
  successParamMsg,
  errorParamMsg,
  balanceBSTArray,
  shuffleArray,
} from './helpers/ParamHelper';

import PropTypes from 'prop-types'; // Import this for URL Param

const DEFAULT_NODES = genUniqueRandNumList(12, 1, 100);
const DEFAULT_TARGET = '2';
const INSERTION = 'insertion';
const SEARCH = 'search';
const INSERTION_EXAMPLE = 'Please follow the example provided: 0,1,2,3,4';
const SEARCH_EXAMPLE = 'Please follow the example provided: 16';
const UNCHECKED = {
  random: false,
  sorted: false,
  balanced: false,
};

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

function AVLTParam({ alg, mode, list, value }) {
  // Contexts
  const { algorithm, dispatch } = useContext(GlobalContext);
  const { setNodes, setSearchValue } = useContext(URLContext);

  // States
  const [ message, setMessage ] = useState(null);
  const [ localNodes, setlocalNodes ] = useState(list || DEFAULT_NODES);
  const [bstCase, setBSTCase] = useState(UNCHECKED);
  // TODO: Confirm `value` is the url query param pulled from to represent
  // SEARCH values in algoirithms with SEARCH modes, keep things CONSISTENT!!!
  const [ localValue, setLocalValue ] = useState(value || DEFAULT_TARGET);
  // Default mode (Can be specified in URL)
  const [ modeState, setModeState ] = useState(mode || INSERTION);

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'random':
        setlocalNodes(shuffleArray(localNodes));
        break;
      case 'sorted':
        setlocalNodes([...localNodes].sort((a, b) => a - b));
        break;
      case 'balanced':
        setlocalNodes(balanceBSTArray([...localNodes].sort((a, b) => a - b)));
        break;
      default:
    }

    setBSTCase({ ...UNCHECKED, [e.target.name]: true });
    // Switch back to insertion on case change
    setModeState(INSERTION);
  };
  
  // Click callbacks no longer directly call dispatch
  // the modify the root component state.
  const handleInsert = (e) => {
    e.preventDefault();
    const inputValue = e.target[0].value.replace(/\s+/g, '');
    // Validate logic... TODO: Plan is to have validation functions
    // defined within param file, these should return a collection of
    // {true/false, error_msg} this way you do not have to guess
    // what a function errored from outside of its scope, like the error code
    // does now.
    const numbers = inputValue.split(',').map(Number).filter(n => !isNaN(n));
    setlocalNodes(numbers);
    setModeState(INSERTION);
    setBSTCase(UNCHECKED);
  }

  const handleSearch = (e) => {
    e.preventDefault();
    const inputValue = e.target[0].value;
    // Validate logic...
    setLocalValue(inputValue);
    setModeState(SEARCH);
    setBSTCase(UNCHECKED);
  };

  const handleRefresh = (e) => {
    setlocalNodes(genUniqueRandNumList(DEFAULT_NODES.length, 1, 100));
    setMessage(null);
  }

  // Dispatch on any dependency change. Also this will run on first mount
  // any simulated click logic sprinkled throughout codebase can be removed.
  useEffect(() => {
    if (modeState === INSERTION) {
      dispatch(GlobalActions.LOAD_ALGORITHM, {
        name: alg,
        mode: modeState,
        nodes: localNodes
      })
    } else {
      // Reuse visualisers, validation logic
      // in search would ensure availability.
      dispatch(GlobalActions.LOAD_ALGORITHM, {
        name: alg,
        mode: modeState,
        visualiser: algorithm.visualisers,
        target: localValue
      })
    }
  }, [localNodes, localValue, modeState, bstCase]);

  // Hook to update the URL context container for share button
  useEffect(() => {
    setNodes(localNodes);
    setSearchValue(localValue);
  }, [localNodes, localValue]);

  return (
    <>
      <div className="form">
        {/* Insert input */}
        <ListParam
          name="AVLTree"
          buttonName="Insert"
          mode="insertion"
          formClassName="formLeft"
          DEFAULT_VAL={localNodes}
          handleSubmit={handleInsert}
          REFRESH_FUNCTION={handleRefresh}
        />

        {/* Search input */}
        <SingleValueParam
          name="AVLTree"
          buttonName="Search"
          mode="search"
          formClassName="formRight"
          DEFAULT_VAL={localValue}
          ALGORITHM_NAME={SEARCH}
          EXAMPLE={SEARCH_EXAMPLE}
          handleSubmit={handleSearch}
        />
      </div>
      <span className="generalText">Re-order input: &nbsp;&nbsp;</span>
      <FormControlLabel
        control={(
          <BlueRadio
            checked={bstCase.random}
            onChange={handleChange}
            disabled={algorithm?.playing}
            name="random"
          />
        )}
        label="Random"
        className="checkbox"
      />
      <FormControlLabel
        control={(
          <BlueRadio
            checked={bstCase.sorted}
            onChange={handleChange}
            disabled={algorithm?.playing}
            name="sorted"
          />
        )}
        label="Sorted"
        className="checkbox"
      />
      <FormControlLabel
        control={(
          <BlueRadio
            checked={bstCase.balanced}
            onChange={handleChange}
            disabled={algorithm?.playing}
            name="balanced"
          />
        )}
        label="Balanced"
        className="checkbox"
      />
      {/* render success/error message */}
      {message}
    </>
  );
}

// Define the prop types for URL Params
AVLTParam.propTypes = {
  alg: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  list: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};

export default withAlgorithmParams(AVLTParam); // Export with the wrapper for URL Params
