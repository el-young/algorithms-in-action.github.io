/* eslint-disable max-len */
import React, { useState, useContext, useEffect } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';

import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';

import ListParam from './helpers/ListParam';
import SingleValueParam from './helpers/SingleValueParam';
import '../../styles/Param.scss';

import {
  genUniqueRandNumList,
  balanceBSTArray,
  shuffleArray,
  commaSeparatedNumberListValidCheck,
  singleNumberValidCheck,
  errorParamMsg,
} from './helpers/ParamHelper';

const INSERTION = 'insertion';
const SEARCH = 'search';

const defaultProps = {
  alg: 'AVLTree',
  mode: INSERTION,
  list: genUniqueRandNumList(12, 1, 100),
  value: '2',
};

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
})((props) => <Radio {...props} />);

function AVLTreeParam({ alg, mode, list, value }) {
  const { algorithm, dispatch } = useContext(GlobalContext);

  // Validate fed in params, these are from the URL, and it was
  // decided to leave it to the parameter components to validate.
  // TODO: query params could be validated before, if parameter
  // components do not have special requirments. i.e. for all ListParam
  // users the `list` requirements are the same. Maybe just do some baseline
  // preprocessing then parameter components can opt to have further constraints
  // but then lost error messages in bottom pane.
  let initialMessage = null;

  list = !list
    ? defaultProps.list
    : commaSeparatedNumberListValidCheck(list)
      ? list.split(',').map(Number)
      : (initialMessage = errorParamMsg(null, "URL: `list` format was not appropriate!"), defaultProps.list);

  
  console.log(value);
  value = !value
    ? defaultProps.value
    : singleNumberValidCheck(value)
      ? value
      : (initialMessage = errorParamMsg(null, "URL: `value` format was not appropriate!"), defaultProps.target);

  mode && mode !== INSERTION &&
    (initialMessage = errorParamMsg(null, "URL: `mode` can only start as insertion!"));


  // Own the state centrally
  const [nodes, setNodes] = useState(list);
  const [searchTarget, setSearchTarget] = useState(value);
  const [bstCase, setBSTCase] = useState(UNCHECKED);
  // Must start in insertion mode.
  const [modeState, setModeState] = useState(defaultProps.mode);
  const [message, setMessage] = useState(initialMessage);

  // If any of these change we should notify the other panels
  // through dispatch. This will also occur on first mount as well.
  useEffect(() => {
    // Add both nodes and target
    // global states id container can be used
    // to construct URL on share button. Convinient
    // since global state is also used for stuff like step
    // and expansions of psuedocode so now share button
    // just pull from global state, do not need to maintain
    // two containers.
    if (modeState === INSERTION) {
      dispatch(GlobalActions.LOAD_ALGORITHM, {
        name: alg,
        mode: INSERTION,
        nodes,
        target: searchTarget,
      });
    } else if (modeState === SEARCH) {
      dispatch(GlobalActions.LOAD_ALGORITHM, {
        name: alg,
        mode: SEARCH,
        nodes,
        target: searchTarget,
        visualiser: algorithm?.chunker?.visualisers,
      });
    }
  }, [modeState, nodes, searchTarget]);

  // Let child components uncheck the buttons
  // (typing in param form)
  const uncheckCases = () => setBSTCase({...UNCHECKED});

  const handleCaseChange = (e) => {
    let newNodes = [...nodes];
    switch (e.target.name) {
      case 'random':
        newNodes = shuffleArray(newNodes);
        break;
      case 'sorted':
        newNodes = [...newNodes].sort((a, b) => a - b);
        break;
      case 'balanced':
        newNodes = balanceBSTArray([...newNodes].sort((a, b) => a - b));
        break;
      default:
    }
    setNodes(newNodes);
    setBSTCase({ ...UNCHECKED, [e.target.name]: true });
    setModeState(INSERTION);
  };

  const handleInsert = (e) => {
    e.preventDefault();
    const inputValue = e.target[0].value.replace(/\s+/g, '');
    if (!commaSeparatedNumberListValidCheck(inputValue)) {
      setMessage(errorParamMsg(null, "Invalid params"));
    } else {
      const newNodes = inputValue.split(',')
                                 .map(Number)
                                 .filter((n) => !isNaN(n));
      setNodes(newNodes);
      setModeState(INSERTION);
      setMessage(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const inputValue = e.target[0].value;
    if (!singleNumberValidCheck(inputValue)) {
      setMessage(errorParamMsg(null, "Enter a number."));
      return;
    } else if (algorithm?.visualisers?.graph?.instance.isEmpty()) {
      setMessage(errorParamMsg(null, "Build a tree first!"));
    } else {
      setSearchTarget(inputValue);
      setModeState(SEARCH);
      setMessage(null);
    }
  };

  const handleRefresh = () => {
    setNodes(genUniqueRandNumList(defaultProps.list.length, 1, 100));
    setBSTCase(UNCHECKED);
    setModeState(INSERTION);
    setMessage(null);
  };

  return (
    <>
      <div className="form">
        {/* Insert input */}
        <ListParam
          buttonName="Insert"
          formClassName="formLeft"
          DEFAULT_VAL={nodes.join(',')}
          handleSubmit={handleInsert}
          REFRESH_FUNCTION={handleRefresh}
          UNCHECK_CASES={uncheckCases}
        />

        {/* Search input */}
        <SingleValueParam
          name={alg}
          buttonName="Search"
          mode={SEARCH}
          formClassName="formRight"
          DEFAULT_VAL={searchTarget}
          ALGORITHM_NAME={SEARCH}
          handleSubmit={handleSearch}
          UNCHECK_CASES={uncheckCases}
        />
      </div>

      <span className="generalText">Re-order input: &nbsp;&nbsp;</span>

      {/* Case Buttons */}
      <FormControlLabel
        control={(
          <BlueRadio
            checked={bstCase.random}
            onChange={handleCaseChange}
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
            onChange={handleCaseChange}
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
            onChange={handleCaseChange}
            disabled={algorithm?.playing}
            name="balanced"
          />
        )}
        label="Balanced"
        className="checkbox"
      />

      {message}
    </>
  );
}

AVLTreeParam.propTypes = {
  alg: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  list: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  value: PropTypes.string,
};

export default AVLTreeParam;
