/* eslint-disable max-len */
import React, { useState, useContext, useEffect } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';
import ListParam from './helpers/ListParam';
import '../../styles/Param.scss';
import {
  genUniqueRandNumList,
  balanceBSTArray,
  shuffleArray,
} from './helpers/SpecialInputBuilders';
import { errorParamMsg } from './helpers/ParamMsg';
import { 
  commaSeparatedNumberListValidCheck, 
  singleNumberValidCheck 
} from './helpers/ValidateInput';
import ParamForm from './helpers/ParamForm';

const INSERTION = 'insertion';
const SEARCH = 'search';

const defaultProps = (() => {
  const list = genUniqueRandNumList(12, 1, 100);
  const value = list[Math.floor(Math.random() * list.length)].toString();
  return {
    mode: INSERTION,
    list,
    value,
  };
})();

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
  

  // Redoing validation logic here, simulated click prevented this by filling
  // form and clicking.
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
      : (initialMessage = errorParamMsg(null, "URL: `value` format was not appropriate!"), defaultProps.value);

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
    // to construct URL on share button. Convenient
    // since global state is also used for stuff like step
    // and expansions of psuedocode so now share button
    // just pulls from global state, do not need to maintain
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

    let err;
    if ((err = singleNumberValidCheck(inputValue))) {
      setMessage(errorParamMsg(null, err));
      return;
    } else if ((err = algorithm?.visualisers?.graph?.instance.isEmpty())) {
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
          defaultVal={nodes.join(',')}
          handleSubmit={handleInsert}
          refreshFunction={handleRefresh}
          onInputChange={uncheckCases}
        />

        {/* Search input */}
        <ParamForm
          formClassName="formRight"
          buttonName="Search"
          value={searchTarget}
          handleSubmit={handleSearch}
          onInputChange={uncheckCases}
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
