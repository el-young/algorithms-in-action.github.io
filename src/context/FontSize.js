import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

// Context for font size. Any component that needs to respect the current font size
// (adjustable via the settings dropdown) can read it from here.  
// 
// Previously, this state was passed down through props across multiple components.  
// Moving it into context improves readability, avoids prop drilling, and makes it easier
// to extend in the future if more components need access to font size.

const DEFAULT_FONT_SIZE = 15;
export const FontSizeContext = createContext();

export function FontSizeProvider({ children }) {
  const [fontSizeIncrease, setFontSizeIncrease] = useState(DEFAULT_FONT_SIZE);

  const increaseFont = (val) => setFontSizeIncrease((prev) => prev + val);

  return (
    <FontSizeContext.Provider value={{ fontSizeIncrease, increaseFont }}>
      {children}
    </FontSizeContext.Provider>
  );
}

FontSizeProvider.propTypes = {
  children: PropTypes.node.isRequired
};