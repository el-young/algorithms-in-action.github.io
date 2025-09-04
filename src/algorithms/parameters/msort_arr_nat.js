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
  genRandNumList,
  quicksortPerfectPivotArray,
} from './helpers/SpecialInputBuilders';
import { errorParamMsg } from './helpers/ParamMsg';
import { commaSeparatedNumberListValidCheck } from './helpers/ValidateInput';

const INSERTION = 'insertion';
const SORT = 'sort';

const defaultProps = (() => {
  const list = genRandNumList(12, 1, 99);
  return {
    mode: INSERTION,
    list,
  };
})();

const UNCHECKED = {
  random: false,
  sortedAsc: false,
  sortedDesc: false,
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

function MergesortParam({ alg, mode, list }) {
  const { algorithm, dispatch } = useContext(GlobalContext);

  let initialMessage = null;

  list = !list
    ? defaultProps.list
    : commaSeparatedNumberListValidCheck(list)
      ? list.split(',').map(Number)
      : (initialMessage = errorParamMsg(null, 'URL: `list` format was not appropriate!'), defaultProps.list);

  // Own the state centrally
  const [array, setArray] = useState(list);
  const [qsCase, setQSCase] = useState({ ...UNCHECKED, random: true });
  const [message, setMessage] = useState(initialMessage);

  // Sync into global state on mount + whenever things change
  useEffect(() => {
    dispatch(GlobalActions.LOAD_ALGORITHM, {
      name: alg,
      mode: mode,
      nodes: array,
    });
  }, [array]);

  const uncheckCases = () => setQSCase({ ...UNCHECKED });

  const handleCaseChange = (e) => {
    let newArr = [...array];
    switch (e.target.name) {
      case 'sortedAsc':
        newArr = [...newArr].sort((a, b) => a - b);
        break;
      case 'sortedDesc':
        newArr = [...newArr].sort((a, b) => b - a);
        break;
      case 'random':
        newArr = genRandNumList(12, 1, 99);
        break;
      case 'bestCase':
        newArr = quicksortPerfectPivotArray(
          Math.floor(Math.random() * 10),
          25 + Math.floor(Math.random() * 25),
        );
        break;
      default:
    }
    setArray(newArr);
    setQSCase({ ...UNCHECKED, [e.target.name]: true });
  };

  const handleInsert = (e) => {
    e.preventDefault();
    const inputValue = e.target[0].value.replace(/\s+/g, '');
    if (!commaSeparatedNumberListValidCheck(inputValue)) {
      setMessage(errorParamMsg(null, 'Invalid params'));
    } else {
      const newNodes = inputValue
        .split(',')
        .map(Number)
        .filter((n) => !Number.isNaN(n));
      setArray(newNodes);
      setMessage(null);
    }
  };

  const handleRefresh = () => {
    setArray(genRandNumList(defaultProps.list.length, 1, 99));
    setQSCase(UNCHECKED);
    setMessage(null);
  };

  return (
    <>
      <div className="form">
        {/* Insert input */}
        <ListParam
          buttonName="Reset"
          formClassName="formLeft"
          defaultVal={array.join(',')}
          handleSubmit={handleInsert}
          refreshFunction={handleRefresh}
          onInputChange={uncheckCases}
        />
      </div>

      <span className="generalText">Choose input format: &nbsp;&nbsp;</span>

      <FormControlLabel
        control={(
          <BlueRadio
            checked={qsCase.random}
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
            checked={qsCase.sortedAsc}
            onChange={handleCaseChange}
            disabled={algorithm?.playing}
            name="sortedAsc"
          />
        )}
        label="Sorted (ascending)"
        className="checkbox"
      />
      <FormControlLabel
        control={(
          <BlueRadio
            checked={qsCase.sortedDesc}
            onChange={handleCaseChange}
            disabled={algorithm?.playing}
            name="sortedDesc"
          />
        )}
        label="Sorted (descending)"
        className="checkbox"
      />

      {message}
    </>
  );
}

MergesortParam.propTypes = {
  alg: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  list: PropTypes.string,
};

export default MergesortParam;
