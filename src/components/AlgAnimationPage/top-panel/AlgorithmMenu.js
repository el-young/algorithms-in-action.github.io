import React, { useContext, useState } from "react";
import PropTypes from 'prop-types';
import "../../../styles/AlgorithmMenu.scss";
import { DeployedAlgorithmCategoryList } from '../../../algorithms/masterList';
import { GlobalContext } from "../../../context/GlobalState";
import { GlobalActions } from "../../../context/actions";

// Dynamically create URLs in algorithm menu from master list (src/algorithms/index.js).
// Only entries with noDeploy=false are included.
const algorithms = Object.fromEntries(
  DeployedAlgorithmCategoryList.map(({ category, algorithms }) => [
    category,
    Object.fromEntries(
      algorithms.map(({ name, shorthand }) => [
        name,
        shorthand
      ]),
    ),
  ]),
);

function AlgorithmMenu({ onClose }) {
  const { dispatch } = useContext(GlobalContext);
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <div className="dropdown" onMouseLeave={onClose}>
      {Object.entries(algorithms).map(([category, algs]) => (
        <div
          key={category}
          className="category"
          onMouseEnter={() => setActiveCategory(category)}
          onMouseLeave={() => setActiveCategory(null)}
        >
          {category}
          {activeCategory === category && (
            <div className="subcategory">
              {Object.entries(algs).map(([name, shorthand]) => (
                <button
                  key={shorthand}
                  type="button"
                  onClick={() => {
                    dispatch(GlobalActions.INDIRECTION_INTO_PARAM, { name: shorthand });
                    onClose();
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default AlgorithmMenu;

AlgorithmMenu.propTypes = {
  onClose: PropTypes.func.isRequired
};
