import React, { useEffect } from "react";
import { GlobalProvider } from "../../context/GlobalState";
import BottomPanel from "./bottom-panel";
import TopPanel from "./top-panel";
import RightPanel from "./right-panel";
import MidPanel from "./mid-panel";
import "../../styles/AlgorithmAnimationPage.scss";
import { ReactComponent as Circle } from "../../assets/icons/circle.svg";

// eslint-disable-next-line import/no-unresolved
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { FontSizeProvider } from "../../context/FontSize";
import { getAlgoTheme, getSystemTheme, setAlgoTheme, setSystemTheme } from "./top-panel/themeHelpers";

/*
  This is the main algorithm animation page.
*/
function AlgorithmAnimationPage() {
  // Apply cached themes
  useEffect(() => {
    setSystemTheme(getSystemTheme());
    setAlgoTheme(getAlgoTheme());
  }, []);

  return (
    <GlobalProvider>
      <FontSizeProvider>
        <div className="app-grid">

          <TopPanel className="top-row" />

          <PanelGroup direction="horizontal" className="main-row">
            {/* Mid panel group gets 60% */}
            <Panel defaultSize={60} className="mid-panel">

              <PanelGroup direction="vertical">
                {/* Animation gets 70% */}
                <Panel defaultSize={70}>
                  <MidPanel />
                </Panel>

                <PanelResizeHandle className="resize-handle horizontal">
                  <div className="handle bottom-handle">
                    <Circle />
                    <Circle />
                    <Circle />
                  </div>
                </PanelResizeHandle>

                {/* Parameter pane gets 30% */}
                <Panel defaultSize={30} className="bottom-panel">
                  <BottomPanel />
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

            {/* Right panel gets 40% */}
            <Panel defaultSize={40} className="right-panel">
              <RightPanel />
            </Panel>

          </PanelGroup>
        </div>
      </FontSizeProvider>
    </GlobalProvider>
  );
}

export default AlgorithmAnimationPage;
