import React from 'react';
import styles from './TimerDisplay.module.css';

const TimerControls = ({ isRunning, handleStart, handleStop, handleReset, handleChange }) => {
  return (
    <div className={styles.controlsContainer}>
      <div className={styles.controls}>
        {/* Start button */}
        <button onClick={handleStart} disabled={isRunning}>Start</button>
        {/* Stop button */}
        <button onClick={handleStop} disabled={!isRunning}>Stop</button>
        {/* Reset button */}
        <button onClick={handleReset}>Reset</button>
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor="timeInput">Set Timer (minutes): </label>
        {/* Input field to set the timer value */}
        <input
          id="timeInput"
          type="number"
          min="1"
          max="60"
          defaultValue="25"
          onChange={handleChange}
          disabled={isRunning}
        />
      </div>
    </div>
  );
};

export default TimerControls;