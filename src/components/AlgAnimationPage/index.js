import React, { useEffect, useRef, useState } from "react";
import { GlobalProvider } from "../../context/GlobalState";
import LeftPanel from "./left-panel";
import BottomPanel from "./bottom-panel";
import TopPanel from "./top-panel";
import RightPanel from "./right-panel";
import MidPanel from "./mid-panel";
import "../../styles/AlgorithmAnimationPage.scss";
import { URLProvider } from "../../context/urlState";
import { ReactComponent as Circle } from "../../assets/icons/circle.svg";

// eslint-disable-next-line import/no-unresolved
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
// Not sure how eslint works and why it does not detect this import
// the resizeable panels are clearly in the web app.

import {
  setTheme,
  setAlgoTheme,
  getSystemColorMode,
  getWithExpiry,
  ALGO_THEME_KEY,
  ALGO_THEME_1,
  SYSTEM_THEME_KEY,
} from "./top-panel/helper";

/*
  This is the main algorithm animation page.

  A couple of things to note: this page is wrapped with two Providers:

    - GlobalProvider  
    - URLProvider  

  GlobalStateProvider manages the overall algorithm state 
  (e.g., which algorithm is selected, what mode it’s in, etc.).  

  URLStateProvider holds the current state of the animation and provides
  setters and getters from its context.  
  This separation allows features like the “Share” button to work:  
  the URL is generated from this state so that anyone opening it 
  immediately sees the animation in the same state. You will likely
  need to grab the setters from this context and use them in your code
  so when a user clicks the share button whatever is in the container
  correctly corresponds to what is being displayed/in parameter forms, etc.

  As a result, any component on this page can access shared data 
  by calling useContext(GlobalContext) or useContext(URLContext).

  See ./src/context/GlobalState and ./src/context/urlState for more details
  on what they actually hold.
*/

function AlgorithmAnimationPage() {

  // Theme persistance code I believe, in a session though non of this needed
  // click of themes triggers change in attribute data-theme which triggers 
  // css rerender.

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
  //     const sys = getSystemColorMode();
  //     setTheme(sys);
  //     return sys;
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
  //   document.documentElement.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
  // }, []);

  const leftRef = useRef(null);
  return (
    <GlobalProvider>
      <URLProvider>
        <div className="app-grid">

          <div className="top-row">
            <TopPanel
              // colorMode={colorMode}
              // handleColorModeChange={handleColorModeChange}
              // systemColor={systemColor}
              // handleSystemColorChange={handleSystemColorChange}
            />
          </div>

          {/* TODO: Experiment smooth menu animation on hover */}
          <div className="main-row">
            <PanelGroup direction="horizontal">
              {/* 
                Default size is what it will first load as 
                Sizes in this library are represented as percentages
                of the panel group.
              */}
              <Panel ref={leftRef} collapsible collapsedSize={0} defaultSize={10} minSize={0}>
                <div 
                  className="left-panel"
                  onMouseLeave={() => leftRef.current?.collapse()}
                >
                  <LeftPanel />
                </div>
              </Panel>

              <PanelResizeHandle 
                className="resize-handle"
                onMouseEnter={() => {
                  leftRef.current?.resize(10)
                }}
              >
                <div className="handle left-handle">
                  <Circle />
                  <Circle />
                  <Circle />
                </div>
              </PanelResizeHandle>

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

              <Panel defaultSize={30} minSize={10}>
                <div className="right-panel">
                  <RightPanel />
                </div>
              </Panel>
            </PanelGroup>
          </div>
        </div>
      </URLProvider>
    </GlobalProvider>
  );
}

export default AlgorithmAnimationPage;
