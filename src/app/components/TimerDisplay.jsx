// Indicate that this is a client-side component
"use client";

// necessary React hooks and CSS module
import React, { useState, useEffect, useRef } from 'react';
import styles from './TimerDisplay.module.css';

// Define the TimerDisplay component
const TimerDisplay = () => {
  // State to keep track of the timer value in seconds (default is 25 minutes)
  const [time, setTime] = useState(25 * 60);
  // State to keep track of whether the timer is running
  const [isRunning, setIsRunning] = useState(false);
  // State to keep track of any errors
  const [error, setError] = useState(null);
  // Reference to store the timer interval ID
  const timerRef = useRef(null);
  // State to keep track of whether dark mode is enabled
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Effect to set the dark mode state based on the user's preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  // Effect to handle the timer logic when the timer is running
  useEffect(() => {
    if (isRunning) {
      // Set an interval to decrement the timer value every second
      timerRef.current = setInterval(() => {
        setTime(prevTime => {
          // If the timer reaches 0, stop the timer
          if (prevTime <= 0) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            return 0;
          }
          // Decrement the timer value by 1 second
          return prevTime - 1;
        });
      }, 1000);
    } else {
      // Clear the interval if the timer is not running
      clearInterval(timerRef.current);
    }

    // Cleanup function to clear the interval when the component unmounts or the timer stops
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  // Function to start the timer
  const handleStart = () => {
    setIsRunning(true);
  };

  // Function to stop the timer
  const handleStop = () => {
    setIsRunning(false);
  };

  // Function to reset the timer to the default value (25 minutes)
  const handleReset = () => {
    setIsRunning(false);
    setTime(25 * 60);
  };

  // Function to handle changes to the timer input field
  const handleChange = (event) => {
    setTime(event.target.value * 60);
  };

  // If there is an error, display the error message
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  // Render the timer display and controls
  return (
    <div className={`${styles.timerDisplay} ${isDarkMode ? 'dark-mode' : 'light-mode'}`} role="timer" aria-live="polite">
      <h1>Timer</h1>
      {/* Display the timer value in MM:SS format */}
      <p className={styles.time}>{new Date(time * 1000).toISOString().substr(14, 5)}</p>
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

// Export the TimerDisplay component as the default export
export default TimerDisplay;