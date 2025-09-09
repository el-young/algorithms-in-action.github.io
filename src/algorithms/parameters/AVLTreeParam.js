/* eslint-disable max-len */
import React, { useState, useContext, useEffect } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';
import ParamFormRefresh from './helpers/ParamFormRefresh';
import '../../styles/Param.scss';
import {
  genUniqueRandNumList,
  balanceBSTArray,
  shuffleArray,
} from './helpers/InputBuilders';
import { errorParamMsg } from './helpers/ParamMsg';
import { 
  commaSeparatedNumberListValidCheck, 
  singleNumberValidCheck 
} from './helpers/InputValidators';
import ParamForm from './helpers/ParamForm';
import { ERRORS, EXAMPLES } from './helpers/ErrorExampleStrings';

const INSERTION = 'insertion';
const SEARCH = 'search';

const defaultProps = (() => {
  const listArray = genUniqueRandNumList(12, 1, 100);  // [1,23,45,...]
  const list = listArray.join(',');                    // "1,23,45,..."
  const value = listArray[Math.floor(Math.random() * listArray.length)].toString();
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

function AVLTreeParam({ alg, 
  //mode: urlMode, // TODO: Not supported. 
  list: urlList, value: urlValue }) {
  const { algorithm, dispatch } = useContext(GlobalContext);
  
  // TODO: URL validation
  const [list, setList] = useState(urlList || defaultProps.list);
  const [value, setValue] = useState(urlValue || defaultProps.value);
  const [bstCase, setBSTCase] = useState(UNCHECKED);
  const [modeState, setModeState] = useState(defaultProps.mode);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (modeState === INSERTION) {
      dispatch(GlobalActions.LOAD_ALGORITHM, {
        name: alg,
        mode: INSERTION,

        url: {
          alg,
          mode: INSERTION,
          list,
          value,
        },

        nodes: list
              .split(',')
              .map((n) => Number(n))
              .filter((n) => !isNaN(n)),
      });
    } else if (modeState === SEARCH) {
      dispatch(GlobalActions.LOAD_ALGORITHM, {
        name: alg,
        mode: SEARCH,

        url: {
          alg,
          mode: SEARCH,
          list,
          value,
        },

        target: value,
        visualiser: algorithm?.chunker?.visualisers,
      });
    }
  }, [modeState, list, value]);

  const uncheckCases = () => setBSTCase({...UNCHECKED});

  const handleCaseChange = (e) => {
    let nums = list.split(',').map(Number).filter((n) => !isNaN(n));

    switch (e.target.name) {
      case 'random':
        nums = shuffleArray(nums);
        break;
      case 'sorted':
        nums = nums.sort((a, b) => a - b);
        break;
      case 'balanced':
        nums = balanceBSTArray([...nums].sort((a, b) => a - b));
        break;
      default:
    }

    // Convert back to string
    setList(nums.join(','));
    setBSTCase({ ...UNCHECKED, [e.target.name]: true });
    // Switch back to insertion mode on case change
    setModeState(INSERTION);
  };

  const handleInsert = (e) => {
    e.preventDefault();
    const inputValue = e.target[0].value.replace(/\s+/g, '');
    if (!commaSeparatedNumberListValidCheck(inputValue)) {
      setMessage(errorParamMsg(null));
    } else {
      setList(inputValue);
      setModeState(INSERTION);
      setMessage(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const inputValue = e.target[0].value;

    let {valid, reason} = singleNumberValidCheck(inputValue);
    if (!valid) {
      setMessage(errorParamMsg(reason, EXAMPLES.GEN_SINGLE_INT));
      return;
    } else if (algorithm?.visualisers?.graph?.instance.isEmpty()) {
      setMessage(errorParamMsg(ERRORS.GEN_BUILD_VISUALISER_FIRST("tree", INSERTION)));
    } else {
      setValue(inputValue);
      setModeState(SEARCH);
      setMessage(null);
    }
  };

  const handleRefresh = () => {
    setList(genUniqueRandNumList(12, 1, 100).join(','));
    setBSTCase(UNCHECKED);
    setModeState(INSERTION);
    setMessage(null);
  };

  return (
    <>
      <div className="form">
        {/* Insert input */}
        <ParamFormRefresh
          buttonName="Insert"
          formClassName="formLeft"
          value={list}
          handleSubmit={handleInsert}
          refreshFunction={handleRefresh}
          onInputChange={uncheckCases}
        />

        {/* Search input */}
        <ParamForm
          formClassName="formRight"
          buttonName="Search"
          value={value}
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
  list: PropTypes.string,
  value: PropTypes.string,
};

export default AVLTreeParam;
