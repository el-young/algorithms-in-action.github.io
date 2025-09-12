import React, { useContext, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "../../../styles/AlgorithmMenu.scss";
import { DeployedAlgorithmCategoryList, getCategory } from "../../../algorithms/masterList";
import { GlobalContext } from "../../../context/GlobalState";
import { GlobalActions } from "../../../context/actions";

// Only entries in master list with noDeploy=false (or undefined)
// are included.
const algorithms = Object.fromEntries(
  DeployedAlgorithmCategoryList.map(({ category, algorithms }) => [
    category,
    Object.fromEntries(
      algorithms.map(({ name, shorthand, mode, keywords }) => [
        name,
        { shorthand, mode, keywords },
      ])
    ),
  ])
);

function AlgorithmMenu({ onClose }) {
  const { dispatch, algorithm } = useContext(GlobalContext);
  const [displaySearch, setDisplaySearch] = useState(null);
  const [openCategories, setOpenCategories] = useState([]);

  // Auto-open the category for the current algorithm
  useEffect(() => {
    if (algorithm?.id?.name) {
      const currentCategory = getCategory(algorithm.id.name);
      if (currentCategory) {
        setOpenCategories([currentCategory]);
      }
    }
  }, [algorithm]);

  // Auto focus so key down handlers work without
  // needing to tab.
  const panelRef = useRef(null);
  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  // Search handler
  const searchAlgorithm = (e) => {
    const inputContent = e.target.value.trim().toLowerCase();
    let algorithmListChosen = null;

    if (inputContent.length > 0) {
      algorithmListChosen = [];
      Object.entries(algorithms).forEach(([_, algs]) => {
        Object.entries(algs).forEach(([name, { shorthand, mode, keywords = [] }]) => {
          if (
            name.toLowerCase().includes(inputContent) ||
            keywords.some((kw) => kw.toLowerCase().includes(inputContent))
          ) {
            algorithmListChosen.push({ name, shorthand, mode });
          }
        });
      });
    }
    setDisplaySearch(algorithmListChosen);
  };

  // Toggle category open/closed
  const toggleCategory = (cat) => {
    setOpenCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
    <div className="popup-overlay" onClick={onClose}>
      <div
        className="popup-panel" 
        tabIndex={-1}
        ref={panelRef}  
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="container">
          {/* Search Bar */}
          <span>
            <input
              className="searchInput"
              placeholder="Search..."
              data-testid="searchInput"
              onChange={searchAlgorithm}
            />
          </span>

          {/* Algorithm List */}
          <div className="algorithmList">
            {displaySearch === null ? (
              DeployedAlgorithmCategoryList.map((cat, index) => (
                <div key={cat.category}>
                  <button
                    id={`category-${index}`}
                    className="algoCat"
                    type="button"
                    onClick={() => toggleCategory(cat.category)}
                  >
                    <span>{cat.category}</span>
                    <span
                      className={`arrow ${
                        openCategories.includes(cat.category) ? "open" : ""
                      }`}
                    >
                      ▶
                    </span>
                  </button>
                  <div
                    className="algoItemContainer content"
                    style={{
                      maxHeight: openCategories.includes(cat.category)
                        ? `${cat.algorithms.length * 40}px`
                        : "0",
                    }}
                  >
                    {cat.algorithms.map((algo) => (
                      <button
                        key={algo.shorthand}
                        className={
                          algorithm.id.name === algo.shorthand
                            ? "algoItem active"
                            : "algoItem"
                        }
                        type="button"
                        onClick={() => {
                          dispatch(GlobalActions.INDIRECTION_INTO_PARAM, {
                            name: algo.shorthand,
                          });
                          onClose();
                        }}
                      >
                        <div className="algoItemContent">{algo.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              displaySearch.map((algo) => (
                <button
                  key={algo.shorthand}
                  type="button"
                  className={
                    algorithm.id.name === algo.shorthand
                      ? "algoItem active"
                      : "algoItem"
                  }
                  onClick={() => {
                    dispatch(GlobalActions.INDIRECTION_INTO_PARAM, {
                      name: algo.shorthand,
                    });
                    onClose();
                  }}
                >
                  <div className="algoItemContent">{algo.name}</div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

AlgorithmMenu.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default AlgorithmMenu;
