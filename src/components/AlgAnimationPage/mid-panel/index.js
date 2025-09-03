/* eslint-disable max-len */
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { GlobalContext } from '../../../context/GlobalState';
import { createUrl, URLContext } from '../../../context/urlState';

import '../../../styles/MidPanel.scss';
import PopUpComponent from 'reactjs-popup';

import ControlButton from '../../common/ControlButton';
import ShareIcon from '@mui/icons-material/Share';
import { increaseFontSize, setFontSize } from '../top-panel/helper';

function MidPanel() {
  const { algorithm, algorithmKey, category, mode } = useContext(GlobalContext);
  const urlContext = useContext(URLContext);

  const fontID = 'algorithmTitle';

  const [share, setShare] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  // build share URL when share popup is open
  useEffect(() => {
    if (share) {
      // let baseUrl = `${window.location.origin}/?alg=${algorithmKey}&mode=${mode}`;

      // // Wasteful to track these in URL context
      // // there are already pointers to them,
      // // and they update frequently, so do here.

      // // Add step
      // if (algorithm?.chunker?.currentChunk) {
      //   baseUrl += `&step=${algorithm.chunker.currentChunk}`;
      // }

      // // Add collapse state for pseudocode
      // // (only for current algo, not the whole collapse 
      // // controller it would bloat URL.)
      // const algoCollapse = algorithm?.collapse?.[algorithm.id.name];
      // if (algoCollapse) {
      //   baseUrl += `&expand=${JSON.stringify(algoCollapse)}`;
      // }

      // Final URL includes category + URLContext data
      const url = createUrl(algorithm);
      setCurrentUrl(url); // display in box
    }
  }, [share]);

  const copyToClipboard = () => {
    if (currentUrl) {
      navigator.clipboard.writeText(currentUrl);
    }
  };

  return (
    <div className="midPanelContainer">
      <div className="midPanelHeader">
        <div>
          {/* Share button */}
          <ControlButton
            icon={<ShareIcon />}
            onClick={() => setShare((o) => !o)}
          />

          {/* Share popup */}
          <PopUpComponent open={share} closeOnDocumentClick onClose={() => setShare(false)}>
            <div className="shareArea">
              <button
                className="closeShare"
                type="button"
                onClick={() => setShare(false)}
                aria-label="Close share popup"
              >
                &times;
              </button>

              <p>{currentUrl}</p>
              <button
                type="button"
                onClick={copyToClipboard}
                className="copyButton"
              >
                Copy URL
              </button>
            </div>
          </PopUpComponent>
        </div>

        <div className="algorithmTitle" id={fontID}>
          {algorithm.name}
        </div>
      </div>

      <div className="midPanelBody">
        {console.log("rendering")}
        {algorithm.chunker &&
          algorithm.chunker.getVisualisers().map((o) => o.render())}
      </div>
    </div>
  );
}

export default MidPanel;
