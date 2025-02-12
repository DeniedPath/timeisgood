"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './TimerDisplay.module.css';

const TimerDisplay = () => {
  const [time, setTime] = useState(25 * 60); // Default to 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 0) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(25 * 60); // Reset to 25 minutes
  };

  const handleChange = (event) => {
    setTime(event.target.value * 60);
  };

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.timerDisplay} role="timer" aria-live="polite">
      <h1>Timer</h1>
      <p className={styles.time}>{new Date(time * 1000).toISOString().substr(14, 5)}</p>
      <div className={styles.controls}>
        <button onClick={handleStart} disabled={isRunning}>Start</button>
        <button onClick={handleStop} disabled={!isRunning}>Stop</button>
        <button onClick={handleReset}>Reset</button>
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor="timeInput">Set Timer (minutes): </label>
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

export default TimerDisplay;