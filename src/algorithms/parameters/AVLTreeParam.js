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
  singleNumberValidCheck,
} from './helpers/InputValidators';
import ParamForm from './helpers/ParamForm';
import { ERRORS, EXAMPLES } from './helpers/ErrorExampleStrings';

const INSERTION = 'insertion';
const SEARCH = 'search';

const defaultProps = (() => {
  const listArray = genUniqueRandNumList(12, 1, 100);
  const list = listArray.join(',');
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

function AVLTreeParam({ alg, list: urlList, value: urlValue }) {
  const { algorithm, dispatch } = useContext(GlobalContext);

  // Keep everything as strings
  const [ list, setList ]           = useState(urlList || defaultProps.list);
  const [ value, setValue ]         = useState(urlValue || defaultProps.value);
  const [ bstCase, setBSTCase ]     = useState(UNCHECKED);
  const [ modeState, setModeState ] = useState(defaultProps.mode);
  const [ message, setMessage ]     = useState(null);

  // Validate + dispatch whenever inputs change
  useEffect(() => {
    const { valid, errors } = validateAll();

    if (valid) {
      if (modeState === INSERTION) {
        dispatch(GlobalActions.LOAD_ALGORITHM, {
          name: alg,
          mode: INSERTION,

          url: { alg, mode: INSERTION, list, value },

          nodes: list
            .split(',')
            .map((n) => Number(n))
            .filter((n) => !isNaN(n)),
        });
      } else if (modeState === SEARCH) {
        dispatch(GlobalActions.LOAD_ALGORITHM, {
          name: alg,
          mode: SEARCH,

          url: { alg, mode: SEARCH, list, value },

          target: value,
          visualiser: algorithm?.chunker?.visualisers,
        });
      }
      setMessage(null);
    } else {
      setMessage(errorParamMsg(errors.join('\n')));
    }
  }, [modeState, list, value]);

  const validateAll = () => {
    const errors = [];

    let { valid, error } = commaSeparatedNumberListValidCheck(list);
    if (!valid) errors.push(error, EXAMPLES.GEN_LIST_PARAM);

    ({ valid, error } = singleNumberValidCheck(value));
    if (!valid) {
      errors.push(error + " " + EXAMPLES.GEN_SINGLE_INT);
    } else if (modeState === SEARCH && algorithm?.visualisers?.graph?.instance.isEmpty()) {
      errors.push(ERRORS.GEN_BUILD_VISUALISER_FIRST('tree', INSERTION));
    }

    return {
      valid: errors.length === 0, 
      errors
    };
  };

  const uncheckCases = () => setBSTCase({ ...UNCHECKED });

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

    setList(nums.join(','));
    setBSTCase({ ...UNCHECKED, [e.target.name]: true });
    setModeState(INSERTION);
  };

  const handleRefresh = () => {
    setList(genUniqueRandNumList(12, 1, 100).join(','));
    setBSTCase(UNCHECKED);
    setModeState(INSERTION);
  };

  return (
    <>
      <div className="form">
        {/* Insert input */}
        <ParamFormRefresh
          buttonName="Insert"
          formClassName="formLeft"
          value={list}
          setValue={(val) => {
            setList(val);
            setModeState(INSERTION);
          }}
          refreshFunction={handleRefresh}
          onInputChange={uncheckCases}
        />

        {/* Search input */}
        <ParamForm
          formClassName="formRight"
          buttonName="Search"
          value={value}
          setValue={(val) => {
            setValue(val);
            setModeState(SEARCH);
          }}
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
  list: PropTypes.string,
  value: PropTypes.string,
};

export default AVLTreeParam;
