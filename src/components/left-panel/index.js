/* eslint-disable no-shadow */
/* eslint-disable react/no-array-index-key */
/* eslint-disable max-len */
import React, {
    useContext, useState, useEffect, useRef,
  } from 'react';
  import PropTypes from 'prop-types';
  import { GlobalContext } from '../../context/GlobalState';
  import { GlobalActions } from '../../context/actions';
  import '../../styles/LeftPanel.scss';
  import { DeployedAlgorithmCategoryList, DeployedAlgorithmList } from '../../algorithms/masterList';
  import { setFontSize } from '../top/helper';
  import openInstructions from '../mid-panel/helper';
  
  // Do not load site with categories expanded
  const LIST_COLLAPSE = false;
  
  function LeftPanel({ fontSize, fontSizeIncrement }) {
    const { dispatch, algorithm } = useContext(GlobalContext);
    const [displaySearch, setDisplaySearch] = useState(null);
  
    // Search Function Component
    const searchAlgorithm = (e) => {
      const inputContent = e.target.value.trim().toLowerCase();
      let algorithmListChosen = null;
      if (inputContent.length > 0) {
        algorithmListChosen = DeployedAlgorithmList.filter(({name, keywords}) => {
          console.log(keywords)
          console.log(`name: ${name}`)
          return name.toLowerCase().includes(inputContent) ||
          (keywords ?? []).some(k => k.toLowerCase().includes(inputContent))
        })
      }
      setDisplaySearch(algorithmListChosen);
    };
  
    // if the search input field is empty, Display the main list.
    // if the search input field has the value, Display the search list.
  
    const onCollapse = (event) => {
      const content = event.target.nextElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = `${content.scrollHeight}px`;
      }
    };
  
    const initCollapseStat = () => {
      DeployedAlgorithmCategoryList.forEach((stat, index) => {
        const obj = document.getElementById(`category-${index}`);
        if (LIST_COLLAPSE) {
          obj.click();
        }
      });
    };
  
    const mounted = useRef();
    useEffect(() => {
      if (!mounted.current) {
      // do componentDidMount logic
        initCollapseStat();
        mounted.current = true;
      } else {
      // do componentDidUpdate logic
  
      }
    });
  
    const itemFontID = 'itemList';
    const catFontID = 'catList';
    useEffect(() => {
      setFontSize(catFontID, fontSize);
      setFontSize(itemFontID, fontSize);
      // increaseFontSize(catFontID, fontSizeIncrement);
      // increaseFontSize(itemFontID, fontSizeIncrement);
    }, [fontSize, fontSizeIncrement]);
  
    const mouseEvs = ['mousedown', 'click', 'mouseup'];
    let startButtonClick = null;
    useEffect(() => {
      // eslint-disable-next-line no-use-before-define
      startButtonClick();
    }, [startButtonClick]);
    startButtonClick = () => {
      const startButton = document.getElementById('startBtnGrp');
      if (startButton !== null) {
        mouseEvs.forEach(
          (mouseEventType) => startButton.dispatchEvent(
            new MouseEvent(mouseEventType,
              {
                view: window, bubbles: true, cancelable: true, buttons: 1,
              }),
          ),
        );
      }
    };
  
    return (
      <div className="container">
        <span>
          <input
            className="searchInput"
            placeholder="Search..."
            data-testid="searchInput"
            onChange={searchAlgorithm}
          />
        </span>
  
        <div
          className="algorithmList"
          id={catFontID}
        >
          {
            (displaySearch === null)
              ? DeployedAlgorithmCategoryList.map((cat, index) => (
                <div key={cat.id}>
                  <button
                    key={cat.id}
                    id={`category-${index}`}
                    className="algoCat"
                    type="button"
                    onClick={(event) => { onCollapse(event); }}
                  >
                    {cat.category}
                  </button>
                  <div
                    className="algoItemContainer content"
                    id={itemFontID}
                    // key={cat.id}
                  >
                    {
                      cat.algorithms.map((algo, index) => (
                        <button
                          key={algo.shorthand}
                          className={algorithm.name === algo.name ? 'algoItem active' : 'algoItem'}
                          type="button"
                          id={`algo-${algo.name}`}
                          onClick= {() => {
                              openInstructions();
                              dispatch(GlobalActions.LOAD_ALGORITHM, { name: algo.shorthand, mode: algo.mode });
                            }}
                        >
                          <div key={algo.shorthand} className="algoItemContent">{algo.name}</div>
                        </button>
                      ))
                    }
                  </div>
                </div>
              ))
              : displaySearch.map((algo) => (
                <button
                  key={algo.id}
                  type="button"
                  className={algorithm.name === algo.name ? 'algoItem active' : 'algoItem'}
                  onClick={() => {
                    dispatch(GlobalActions.LOAD_ALGORITHM, { name: algo.shorthand, mode: algo.mode });
                  }}
                >
                  <div className="algoItemContent">{algo.name}</div>
                </button>
              ))
          }
        </div>
      </div>
    );
  }
  
  export default LeftPanel;
  LeftPanel.propTypes = {
    fontSize: PropTypes.number.isRequired,
    fontSizeIncrement: PropTypes.number.isRequired,
  };