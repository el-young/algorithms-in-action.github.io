/* eslint-disable no-prototype-builtins */
import React, { useContext } from 'react';
import { GlobalContext } from '../../../context/GlobalState';
import { GlobalActions } from '../../../context/actions';
import LineNumHighLight from './LineNumHighLight';
import LineExplanation from './LineExplanation';
import '../../../styles/RightPanel.scss';

function Pseudocode() {
  const { algorithm, dispatch } = useContext(GlobalContext);
  const show = algorithm.hasOwnProperty('pseudocode');
  let explanation = "";

  const onExpand = () => {
    Object.keys(algorithm.pseudocode).forEach((key) => {
      dispatch(GlobalActions.COLLAPSE, { codeblockname: key, expandOrCollapase: true });
    });
  };

  const onCollapse = () => {
    Object.keys(algorithm.pseudocode).forEach((key) => {
      if (key !== 'Main') {
        dispatch(GlobalActions.COLLAPSE, { codeblockname: key, expandOrCollapase: false });
      }
    });
  };

  return show ? (
    <>
      <LineNumHighLight />
      <div className="btnPanel">
        <button className="bottomBtn" type="button" onClick={onExpand}>
          Expand All
        </button>
        <button className="bottomBtn" type="button" onClick={onCollapse}>
          Collapse All
        </button>
      </div>
      {explanation ? <LineExplanation explanation={explanation} /> : null}
    </>
  ) : null;
}

export default Pseudocode;
