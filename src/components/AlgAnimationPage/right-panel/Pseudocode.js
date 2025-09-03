/* eslint-disable no-prototype-builtins */
import React, { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { GlobalContext } from '../../../context/GlobalState';
import { GlobalActions } from '../../../context/actions';
import LineNumHighLight from './LineNumHighLight';
import BottomButton from './BottomButton';
import LineExplanation from './LineExplanation';
import { getUrlParams } from '../../../context/urlState';

function Pseudocode() {
  const { algorithm, dispatch } = useContext(GlobalContext);
  const show = !!algorithm.hasOwnProperty('pseudocode');
  var explanation = "";

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

  // I guess it makes sense to go here
  const expandApplied = useRef(false);
  useEffect(() => {
    if (!algorithm?.pseudocode || expandApplied.current) return;

    let { expand } = getUrlParams();

    try {
      // expand is expected to be a JSON string from the URL
      const expandState = JSON.parse(expand);

      // Loop over modes (insertion, search, etc.)
      Object.entries(expandState).forEach(([modeName, blocks]) => {
        // Loop over blocks inside each mode
        Object.entries(blocks).forEach(([blockName, shouldExpand]) => {
          dispatch(GlobalActions.COLLAPSE, {
            codeblockname: blockName,
            expandOrCollapase: shouldExpand,
          });
        });
      });
    } catch (err) {
      console.error("Invalid expand param:", expand, err);
    }

    expandApplied.current = true; // ensure it only runs once
  }, [algorithm?.chunker]);

  return (
    show ? (
      <>
        <LineNumHighLight />
        <div className="btnPanel">
          <BottomButton onClick={onExpand} name="Expand All" />
          <BottomButton onClick={onCollapse} name="Collapse All" />
        </div>
        { explanation ? (
        <LineExplanation explanation={explanation} />
        ) : ''}
      </>
    ) : null
  );
}

export default Pseudocode;
