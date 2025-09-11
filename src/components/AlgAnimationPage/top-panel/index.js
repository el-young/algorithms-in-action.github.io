// TopPanel.js
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../../../styles/TopPanel.scss';
import logo from '../../../assets/logo.svg';
import AlgorithmMenu from './AlgorithmMenu';
import Settings from './Settings';

function TopPanel() {
  const history = useHistory();

  const handleLogoClick = () => history.push('/mainmenu');
  const handleAboutClick = () => history.push('/about');

  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="top-panel">
      <div className="top-left">
        <button type="button" className="nav-btn" onClick={() => setMenuOpen((o) => !o)}>
          Menu
        </button>
        {menuOpen && <AlgorithmMenu onClose={() => setMenuOpen(false)} />}
      </div>

      <div className="top-center">
        <button className="headerTitle" type="button" onClick={handleLogoClick}>
          <img src={logo} alt="logo" />
          <h1>Algorithms in Action</h1>
        </button>
      </div>

      <div className="top-right">
        <button type="button" onClick={handleAboutClick}>About</button>
        <button type="button" className="nav-btn" onClick={() => setSettingsOpen((o) => !o)}>
          Settings
        </button>
        {settingsOpen && <Settings onClose={() => setSettingsOpen(false)} />}
      </div>
    </div>
  );
}

export default TopPanel;
