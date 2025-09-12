/* eslint-disable import/no-mutable-exports */
import React, { useContext, useState } from 'react';
import '../../../styles/Settings.scss';
import PropTypes from 'prop-types';
import { ReactComponent as Font } from '../../../assets/icons/font.svg';
import { FontSizeContext } from '../../../context/FontSize';
import { setAlgoTheme, setSystemTheme, allColBtn, allSystemCol } from './themeHelpers';

const DEFAULT_COL = 0;

const mode = () => DEFAULT_COL;
export { mode };

function Settings({ onClose }) {
  const { increaseFont } = useContext(FontSizeContext);

  // Track active selections locally
  const [colorMode, setColorMode] = useState('');
  const [systemColor, setSystemColor] = useState('');

  return (
    <div className="settingsContainer">
      {/* Font Size */}
      <div className="setContainer">
        <div className="label">Font Size</div>
        <div className="fontSize">
          <button
            type="button"
            className="fontBtn small"
            onClick={() => increaseFont(-1)}
          >
            <Font />
          </button>
          <button
            type="button"
            className="fontBtn big"
            onClick={() => increaseFont(1)}
          >
            <Font />
          </button>
        </div>
      </div>

      {/* Algo Theme */}
      <div className="setContainer">
        <div className="label">Data Structures</div>
        <div className="algoCol">
          {allColBtn.map(({ primary, secondary, third, fourth, id }) => (
            <button
              key={id}
              id={id}
              type="button"
              className={colorMode === id ? 'colorBtn active' : 'colorBtn'}
              onClick={() => {
                setAlgoTheme(id);
                setColorMode(id);
              }}
            >
              <table>
                <tbody>
                  <tr>
                    <th className={`top-left ${primary}`} />
                    <th className={`top-right ${secondary}`} />
                  </tr>
                  <tr>
                    <td className={`bottom-left ${third}`} />
                    <td className={`bottom-right ${fourth}`} />
                  </tr>
                </tbody>
              </table>
            </button>
          ))}
        </div>
      </div>

      {/* System Theme */}
      <div className="setContainer">
        <div className="label">System</div>
        <div className="algoCol">
          {allSystemCol.map(({ primary, secondary, id }) => (
            <button
              key={id}
              id={id}
              type="button"
              className={systemColor === id ? 'colorBtn active' : 'colorBtn'}
              onClick={() => {
                setSystemTheme(id);
                setSystemColor(id);
              }}
            >
              <span className={`left ${primary}`} />
              <span className={`right ${secondary}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="settingFooter">
        <button className="saveBtn" type="button" onClick={onClose}>
          Return
        </button>
      </div>
    </div>
  );
}

export default Settings;

Settings.propTypes = {
  onClose: PropTypes.func.isRequired,
};
