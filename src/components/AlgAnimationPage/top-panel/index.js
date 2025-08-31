/* eslint-disable max-len */
import React, { useState } from 'react';
import Header from './Header';
import Settings from './Settings';
import {
  setTheme,
  setAlgoTheme,
  getSystemColorMode,
  getWithExpiry,
  ALGO_THEME_KEY,
  ALGO_THEME_1,
  SYSTEM_THEME_KEY,
} from './helper';

function TopPanel() {
  const [isSettingVisible, setSettingVisible] = useState(false);

  const onSetting = () => setSettingVisible((prev) => !prev);

  const initAlgoColor = () => {
    const algoTheme = getWithExpiry(ALGO_THEME_KEY);
    if (algoTheme === null) {
      setAlgoTheme(ALGO_THEME_1);
      return ALGO_THEME_1;
    }
    return algoTheme;
  };

  const [colorMode, setColorMode] = useState(initAlgoColor());
  const handleColorModeChange = (id) => {
    setColorMode(id);
    setAlgoTheme(id);
  };

  const initSystemColor = () => {
    const theme = getWithExpiry(SYSTEM_THEME_KEY);
    if (theme === null) {
      const sys = getSystemColorMode();
      setTheme(sys);
      return sys;
    }
    return theme;
  };

  const [systemColor, setSystemColor] = useState(initSystemColor());
  const handleSystemColorChange = (id) => {
    setSystemColor(id);
    setTheme(id);
  };

  return (
    <div className="top-panel">
      {isSettingVisible && (
        <Settings
          onSetting={onSetting}
          colorMode={colorMode}
          handleColorModeChange={handleColorModeChange}
          systemColor={systemColor}
          handleSystemColorChange={handleSystemColorChange}
        />
      )}
      <Header onSetting={onSetting} />
    </div>
  );
}

export default TopPanel;
