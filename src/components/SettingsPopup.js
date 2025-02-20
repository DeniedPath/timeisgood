'use client';
import { useState } from 'react';
import styles from '../styles/SettingsPopup.module.css';

// SettingsPopup component for adjusting app settings
const SettingsPopup = ({ onClose }) => {
  // State for background color
  const [backgroundColor, setBackgroundColor] = useState('#1e3c72');
  // State for timer speed
  const [timerSpeed, setTimerSpeed] = useState(1);
  // State for music volume
  const [musicVolume, setMusicVolume] = useState(50);

  // Handler for background color change
  const handleBackgroundChange = (e) => {
    const color = e.target.value;
    setBackgroundColor(color);
    document.body.style.backgroundColor = color; // Apply color to body
  };

  // Handler for timer speed change
  const handleTimerSpeedChange = (e) => {
    const speed = parseFloat(e.target.value);
    setTimerSpeed(speed);
    // TODO: Implement logic to adjust timer speed in the main app
  };

  // Handler for music volume change
  const handleMusicVolumeChange = (e) => {
    const volume = parseInt(e.target.value);
    setMusicVolume(volume);
    // TODO: Implement logic to adjust music volume in the main app
  };

  return (
    <div className={styles.settingsPopup}>
      <div className={styles.popupContent}>
        <h2>Settings</h2>
        {/* Close button */}
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        {/* Background color setting */}
        <div className={styles.setting}>
          <label>Background Color:</label>
          <input
            type="color"
            value={backgroundColor}
            onChange={handleBackgroundChange}
          />
        </div>
        {/* Timer speed setting */}
        <div className={styles.setting}>
          <label>Timer Speed:</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={timerSpeed}
            onChange={handleTimerSpeedChange}
          />
          <span>{timerSpeed}x</span>
        </div>
        {/* Music volume setting */}
        <div className={styles.setting}>
          <label>Music Volume:</label>
          <input
            type="range"
            min="0"
            max="100"
            value={musicVolume}
            onChange={handleMusicVolumeChange}
          />
          <span>{musicVolume}%</span>
        </div>
      </div>
    </div>
  );
};

export default SettingsPopup;
