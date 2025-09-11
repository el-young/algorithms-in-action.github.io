import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GlobalContext } from '../../../context/GlobalState';
import { GlobalActions } from '../../../context/actions';
import ControlButton from '../../common/ControlButton';
import { ReactComponent as Cancel } from '../../../assets/icons/cancel.svg';
import { FontSizeContext } from '../../../context/FontSize';

function LineExplanation({ explanation }) {
  const { dispatch } = useContext(GlobalContext);
  const { fontSizeIncrease } = useContext(FontSizeContext);
  
  return (
    <div className="lineExplanation" style={{ fontSize: `${fontSizeIncrease}px` }}>
      <div className="lEHeader">
        <div className="lEtitle">Explanation</div>
        <ControlButton
          icon={<Cancel />}
          className="greyRoundBtn"
          id="cancelLineExplainBtn"
          onClick={() => {
            dispatch(GlobalActions.LineExplan, '');
          }}
        />
      </div>
      <div className="lEDesc">
        {explanation}
      </div>
    </div>
  );
}

export default LineExplanation;

LineExplanation.propTypes = {
  explanation: PropTypes.string.isRequired,
};
