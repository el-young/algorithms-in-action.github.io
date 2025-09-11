import React, { useEffect, useRef, useState } from "react";
import { GlobalProvider } from "../../context/GlobalState";
import BottomPanel from "./bottom-panel";
import TopPanel from "./top-panel";
import RightPanel from "./right-panel";
import MidPanel from "./mid-panel";
import "../../styles/AlgorithmAnimationPage.scss";
import { ReactComponent as Circle } from "../../assets/icons/circle.svg";

// eslint-disable-next-line import/no-unresolved
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
// Not sure how eslint works and why it does not detect this import
// the resizeable panels are clearly in the web app.

// import {
//   setTheme,
//   setAlgoTheme,
//   getSystemColorMode,
//   getWithExpiry,
//   ALGO_THEME_KEY,
//   ALGO_THEME_1,
//   SYSTEM_THEME_KEY,
// } from "./top-panel/helper";
import { FontSizeProvider } from "../../context/FontSize";
import { getSystemTheme, setSystemTheme } from "./top-panel/themeHelpers";

/*
  This is the main algorithm animation page.
*/
function AlgorithmAnimationPage() {

  setSystemTheme(getSystemTheme());


  // const [isSettingVisible, setSettingVisible] = useState(false);

  // const onSetting = () => {
  //   setSettingVisible(!isSettingVisible);
  // };

  // const [fontSizeIncrease, setFontSizeIncrease] = useState(0);
  // const onFontIncrease = (val) => {
  //   setFontSizeIncrease(fontSizeIncrease + val);
  // };

  // const initAlgoColor = () => {
  //   const algoTheme = getWithExpiry(ALGO_THEME_KEY);
  //   if (algoTheme === null) {
  //     setAlgoTheme(ALGO_THEME_1);
  //     return ALGO_THEME_1;
  //   }
  //   return algoTheme;
  // };

  // const [colorMode, setColorMode] = useState(initAlgoColor());
  // const handleColorModeChange = (id) => {
  //   setColorMode(id);
  //   setAlgoTheme(id);
  // };

  // const initSystemColor = () => {
  //   const theme = getWithExpiry(SYSTEM_THEME_KEY);
  //   if (theme === null) {
  //     setTheme(getSystemColorMode());
  //     return getSystemColorMode();
  //   }
  //   return theme;
  // };

  // const [systemColor, setSystemColor] = useState(initSystemColor());
  // const handleSystemColorChange = (id) => {
  //   setSystemColor(id);
  //   setTheme(id);
  // };

  // useEffect(() => {
  //   const theme = getWithExpiry(SYSTEM_THEME_KEY);
  //   setTheme(theme);
  //   setAlgoTheme(getWithExpiry(ALGO_THEME_KEY));
  //   document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
  // }, []);

  return (
    <GlobalProvider>
      <FontSizeProvider>
        <div className="app-grid">

          <div className="top-row">
            <TopPanel
              // colorMode={colorMode}
              // handleColorModeChange={handleColorModeChange}
              // systemColor={systemColor}
              // handleSystemColorChange={handleSystemColorChange}
            />
          </div>

          <div className="main-row">

            <PanelGroup direction="horizontal">

              {/* Mid panel group should take up most */}
              <Panel defaultSize={60} minSize={20}>
                <PanelGroup direction="vertical">
                  {/* Animation gets 70% */}
                  <Panel defaultSize={70}>
                    <div className="mid-panel">
                      <MidPanel />
                    </div>
                  </Panel>

                  <PanelResizeHandle className="resize-handle horizontal">
                    <div className="handle bottom-handle">
                      <Circle />
                      <Circle />
                      <Circle />
                    </div>
                  </PanelResizeHandle>

                  {/* Parameter pane gets 30% */}
                  <Panel defaultSize={30}>
                    <div className="bottom-panel">
                      <BottomPanel />
                    </div>
                  </Panel>

                </PanelGroup>
              </Panel>

              <PanelResizeHandle className="resize-handle">
                <div className="handle right-handle">
                  <Circle />
                  <Circle />
                  <Circle />
                </div>
              </PanelResizeHandle>

              {/* Pesudocode/info etc. gets 40% */}
              <Panel defaultSize={40} minSize={10}>
                <div className="right-panel">
                  <RightPanel />
                </div>
              </Panel>
            </PanelGroup>
          </div>
        </div>
      </FontSizeProvider>
    </GlobalProvider>
  );
}

export default AlgorithmAnimationPage;
