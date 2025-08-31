import React from "react";
import { GlobalProvider } from "../../context/GlobalState";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import LeftPanel from "./left-panel";
import BottomPanel from "./bottom-panel";
import TopPanel from "./top-panel";
import RightPanel from "./right-panel";
import MidPanel from "./mid-panel";
import "../../styles/AlgorithmAnimationPage.scss";
import { URLProvider } from "../../context/urlState";

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
  need to grab the setters from this context in your controller code
  so when a user clicks the share button whatever is in the container
  correctly corresponds to what is being displayed/in parameter forms, etc.

  As a result, any component on this page can access shared data 
  by calling useContext(GlobalContext) or useContext(URLContext).

  See ./src/context/GlobalState and ./src/context/urlState for more details
  on what they actually hold.
*/

function AlgorithmAnimationPage() {
  return (
    <GlobalProvider>
      <URLProvider>
        <div className="app-grid">

          <div className="top-row">
            <TopPanel />
          </div>

          <div className="main-row">
            <PanelGroup direction="horizontal">
              <Panel defaultSize={20} minSize={10}>
                <div className="left-panel">
                  <LeftPanel />
                </div>
              </Panel>
              <PanelResizeHandle className="resize-handle" />

              <Panel defaultSize={60} minSize={20}>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={70}>
                    <div className="mid-panel">
                      <MidPanel />
                    </div>
                  </Panel>
                  <PanelResizeHandle className="resize-handle horizontal" />
                  <Panel defaultSize={30}>
                    <div className="bottom-panel">
                      <BottomPanel />
                    </div>
                  </Panel>
                </PanelGroup>
              </Panel>
              <PanelResizeHandle className="resize-handle" />

              <Panel defaultSize={20} minSize={10}>
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
