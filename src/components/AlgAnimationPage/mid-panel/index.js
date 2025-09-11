/* eslint-disable max-len */
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { GlobalContext } from '../../../context/GlobalState';
import '../../../styles/MidPanel.scss';
import PopUpComponent from 'reactjs-popup';
import ControlButton from '../../common/ControlButton';
import ShareIcon from '@mui/icons-material/Share';
import { createUrl } from './urlCreator';
import { FontSizeContext } from '../../../context/FontSize';

function MidPanel() {
  const { algorithm } = useContext(GlobalContext);
  const { fontSizeIncrease } = useContext(FontSizeContext);

  const fontID = 'algorithmTitle';

  const [share, setShare] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  // build share URL when share popup is open
  useEffect(() => {
    if (share) {
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

        <div className="algorithmTitle" style={{ fontSize: `${fontSizeIncrease}px` }}>
          {algorithm.name}
        </div>
      </div>

      <div className="midPanelBody">
        {algorithm.chunker &&
          algorithm.chunker.getVisualisers().map((o) => o.render())}
      </div>
    </div>
  );
}

export default MidPanel;
