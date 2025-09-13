/* eslint-disable import/no-mutable-exports */
import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import "../../../styles/Settings.scss";
import { ReactComponent as Font } from "../../../assets/icons/font.svg";
import { FontSizeContext } from "../../../context/FontSize";
import { setAlgoTheme, setSystemTheme, SYSTEM_THEMES, ALGO_THEMES, getSystemTheme, getAlgoTheme } from "./persistentStorageHelpers";
import { ColorQuadrantCircle, ColorCircle } from "./ColoredCircles";

const mode = () => 0;
export { mode };

function Settings({ onClose }) {
  const { increaseFont } = useContext(FontSizeContext);

  // Track active selections locally
  const [colorMode, setColorMode] = useState(getAlgoTheme());
  const [systemColor, setSystemColor] = useState(getSystemTheme());

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
          <button
            type="button"
            className={colorMode === ALGO_THEMES.DEFAULT ? "colorBtn active" : "colorBtn"}
            onClick={() => {
              setAlgoTheme(ALGO_THEMES.DEFAULT);
              setColorMode(ALGO_THEMES.DEFAULT);
            }}
          >
            <ColorQuadrantCircle
              topLeft="positive1"
              topRight="negative1"
              bottomLeft="hint1"
              bottomRight="back-up1"
            />
          </button>

          <button
            type="button"
            className={colorMode === ALGO_THEMES.GREEN ? "colorBtn active" : "colorBtn"}
            onClick={() => {
              setAlgoTheme(ALGO_THEMES.GREEN);
              setColorMode(ALGO_THEMES.GREEN);
            }}
          >
            <ColorQuadrantCircle
              topLeft="positive2"
              topRight="negative2"
              bottomLeft="hint2"
              bottomRight="back-up2"
            />
          </button>

          <button
            type="button"
            className={colorMode === ALGO_THEMES.RED ? "colorBtn active" : "colorBtn"}
            onClick={() => {
              setAlgoTheme(ALGO_THEMES.RED);
              setColorMode(ALGO_THEMES.RED);
            }}
          >
            <ColorQuadrantCircle
              topLeft="cyan"
              topRight="purple"
              bottomLeft="green"
              bottomRight="yellow"
            />
          </button>

          <button
            type="button"
            className={colorMode === ALGO_THEMES.GREY ? "colorBtn active" : "colorBtn"}
            onClick={() => {
              setAlgoTheme(ALGO_THEMES.GREY);
              setColorMode(ALGO_THEMES.GREY);
            }}
          >
            <ColorQuadrantCircle
              topLeft="white"
              topRight="grey"
              bottomLeft="dark-grey"
              bottomRight="black"
            />
          </button>
        </div>
      </div>

      {/* System Theme */}
      <div className="setContainer">
        <div className="label">System</div>
        <div className="algoCol">
          <button
            type="button"
            className={systemColor === SYSTEM_THEMES.LIGHT ? "colorBtn active" : "colorBtn"}
            onClick={() => {
              setSystemTheme(SYSTEM_THEMES.LIGHT);
              setSystemColor(SYSTEM_THEMES.LIGHT);
            }}
          >
            <ColorCircle colorClass="white" />
          </button>

          <button
            type="button"
            className={systemColor === SYSTEM_THEMES.DARK ? "colorBtn active" : "colorBtn"}
            onClick={() => {
              setSystemTheme(SYSTEM_THEMES.DARK);
              setSystemColor(SYSTEM_THEMES.DARK);
            }}
          >
            <ColorCircle colorClass="black" />
          </button>
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

Settings.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default Settings;