/* eslint-disable no-shadow */
/* eslint-disable react/no-array-index-key */
/* eslint-disable max-len */
import React, {
  useContext, useState, useEffect, useRef,
} from 'react';
import { GlobalContext } from '../../../context/GlobalState';
import { GlobalActions } from '../../../context/actions';
import '../../../styles/LeftPanel.scss';
import { AlgorithmCategoryList, AlgorithmList } from '../../../algorithms/masterList';

const LIST_COLLAPSE = true;

function LeftPanel() {
  const { dispatch, algorithm } = useContext(GlobalContext);
  const [displaySearch, setDisplaySearch] = useState(null);

  // Search Function
  const searchAlgorithm = (e) => {
    const inputContent = e.target.value.trim().toLowerCase();
    let algorithmListChosen = null;
    if (inputContent.length > 0) {
      algorithmListChosen = AlgorithmList.filter((i) =>
        i.name.toLowerCase().includes(inputContent)
      );
    }
    setDisplaySearch(algorithmListChosen);
  };

  // Collapse behaviour
  const onCollapse = (event) => {
    const content = event.target.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = `${content.scrollHeight}px`;
    }
  };

  const initCollapseStat = () => {
    AlgorithmCategoryList.forEach((_, index) => {
      const obj = document.getElementById(`category-${index}`);
      if (LIST_COLLAPSE && obj) {
        obj.click();
      }
    });
  };

  const mounted = useRef();
  useEffect(() => {
    if (!mounted.current) {
      initCollapseStat();
      mounted.current = true;
    }
  }, []);

  // Auto-click start button on mount (legacy hack for some algos)
  const mouseEvs = ['mousedown', 'click', 'mouseup'];
  const startButtonClick = () => {
    const startButton = document.getElementById('startBtnGrp');
    if (startButton) {
      mouseEvs.forEach((ev) =>
        startButton.dispatchEvent(
          new MouseEvent(ev, { view: window, bubbles: true, cancelable: true, buttons: 1 })
        )
      );
    }
  };
  useEffect(() => {
    startButtonClick();
  }, []);

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

      <div className="algorithmList">
        {displaySearch === null
          ? AlgorithmCategoryList.map((cat, index) => (
              <div key={cat.id}>
                <button
                  id={`category-${index}`}
                  className="algoCat"
                  type="button"
                  onClick={onCollapse}
                >
                  {cat.category}
                </button>
                <div className="algoItemContainer content">
                  {cat.algorithms.map((algo, i) => (
                    <button
                      key={i}
                      className={
                        algorithm.name === algo.name ? 'algoItem active' : 'algoItem'
                      }
                      type="button"
                      onClick={
                        algorithm.name === algo.name
                          ? () => document.getElementById('startBtnGrp')
                          : () =>
                              dispatch(GlobalActions.LOAD_ALGORITHM, {
                                name: algo.shorthand,
                                mode: algo.mode,
                              })
                      }
                    >
                      <div className="algoItemContent">{algo.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))
          : displaySearch.map((algo) => (
              <button
                key={algo.id}
                type="button"
                className={
                  algorithm.name === algo.name ? 'algoItem active' : 'algoItem'
                }
                onClick={() =>
                  dispatch(GlobalActions.LOAD_ALGORITHM, {
                    name: algo.shorthand,
                    mode: algo.mode,
                  })
                }
              >
                <div className="algoItemContent">{algo.name}</div>
              </button>
            ))}
      </div>
    </div>
  );
}

export default LeftPanel;
