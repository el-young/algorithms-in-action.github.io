/* eslint-disable max-len */
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { GlobalContext } from '../../../context/GlobalState';
import '../../../styles/MidPanel.scss';
/* eslint-disable-next-line import/no-named-as-default */
import Popup from 'reactjs-popup';
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
          <ControlButton icon={< ShareIcon />} onClick={() => setShare((o) => !o)} />
          <Popup open={share} closeOnDocumentClick onClose={() => setShare(false)}>
            <div className="shareArea">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
              <button className="closeShare" onClick={() => setShare(false)}>
                &times;
              </button>
              {/* eslint-disable-next-line max-len */}
              <p>
                {currentUrl}
              </p>
              <button onClick={copyToClipboard} style={{ cursor: 'pointer' }}>
                Copy URL
              </button>
            </div>
          </Popup>
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
