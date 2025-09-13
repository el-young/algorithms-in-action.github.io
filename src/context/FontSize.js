import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import { getFontSizePersist, setFontSizePersist } from "../components/AlgAnimationPage/top-panel/persistentStorageHelpers";

// Context for font size. Any component that needs to respect the current font size
// (adjustable via the settings dropdown) can read it from here.  
// 
// Previously, this state was passed down through props across multiple components.  
// Moving it into context improves readability, avoids prop drilling, and makes it easier
// to extend in the future if more components need access to font size.

export const FontSizeContext = createContext();

export function FontSizeProvider({ children }) {
  // Font size from persistent storage, defaults to 15px.
  const [fontSizeIncrease, setFontSize] = useState(getFontSizePersist());

  // Any time a component increases font size context
  // store in local storage.
  const increaseFont = (delta) => {
    setFontSize((prev) => {
      const newSize = prev + delta;
      setFontSizePersist(newSize);
      return newSize;
    });
  };

  return (
    <FontSizeContext.Provider value={{ fontSizeIncrease, increaseFont }}>
      {children}
    </FontSizeContext.Provider>
  );
}

FontSizeProvider.propTypes = {
  defaultFontSize: PropTypes.number,
  children: PropTypes.node.isRequired
};