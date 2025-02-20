'use client';
import { useState } from 'react';
import styles from '../styles/Header.module.css';

// Header component for navigation and settings
const Header = ({ onTabChange, onSettingsClick }) => {
  // State to keep track of the active tab
  const [activeTab, setActiveTab] = useState('timer');

  // Handler for tab clicks
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onTabChange(tab); // Notify parent component of tab change
  };

  return (
    <header className={styles.header}>
      <nav>
        {/* Timer tab button */}
        <button
          className={`${styles.tab} ${activeTab === 'timer' ? styles.active : ''}`}
          onClick={() => handleTabClick('timer')}
        >
          Timer
        </button>
        {/* Music tab button */}
        <button
          className={`${styles.tab} ${activeTab === 'music' ? styles.active : ''}`}
          onClick={() => handleTabClick('music')}
        >
          Music
        </button>
      </nav>
      {/* Settings button */}
      <button className={styles.settingsButton} onClick={onSettingsClick}>
        ⚙️ Settings
      </button>
    </header>
  );
};

export default Header;

