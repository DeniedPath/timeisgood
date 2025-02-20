'use client';
import { useState, useEffect, useRef } from 'react';
import { differenceInSeconds, addSeconds } from 'date-fns';
import JSConfetti from 'js-confetti';
import localforage from 'localforage';
import { nanoid } from 'nanoid';
import Header from '../components/Header';
import MusicPlaylist from '../components/MusicPlaylist';
import SettingsPopup from '../components/SettingsPopup';
import styles from '../styles/Timer.module.css';

const Timer = () => {
  // State variables
  const [targetDate, setTargetDate] = useState(new Date('2023-12-31T23:59:59')); // Default target date
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isRunning, setIsRunning] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [timers, setTimers] = useState([]);
  const [newTimerDate, setNewTimerDate] = useState('');
  const [pomodoroMode, setPomodoroMode] = useState(false);
  const [workDuration, setWorkDuration] = useState(25 * 60); // 25 minutes
  const [breakDuration, setBreakDuration] = useState(5 * 60); // 5 minutes
  const [isWorkPhase, setIsWorkPhase] = useState(true);
  const [selectedSound, setSelectedSound] = useState('/alarm.mp3');
  const [timerHistory, setTimerHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('timer');
  const [showSettings, setShowSettings] = useState(false);
  const confettiRef = useRef(null);

  // Initialize confetti
  useEffect(() => {
    confettiRef.current = new JSConfetti();
  }, []);

  // Load saved timers and history from localStorage
  useEffect(() => {
    localforage.getItem('timers').then((savedTimers) => {
      if (savedTimers) setTimers(savedTimers);
    });
    localforage.getItem('timerHistory').then((savedHistory) => {
      if (savedHistory) setTimerHistory(savedHistory);
    });
  }, []);

  // Save timers and history to localStorage
  useEffect(() => {
    localforage.setItem('timers', timers);
  }, [timers]);
  useEffect(() => {
    localforage.setItem('timerHistory', timerHistory);
  }, [timerHistory]);

  // Calculate time left until target date
  function calculateTimeLeft() {
    const now = new Date();
    const difference = differenceInSeconds(targetDate, now);
    return difference > 0 ? difference : 0;
  }

  // Update timer every second when running
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, targetDate]);

  // Handle timer completion
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      const audio = new Audio(selectedSound);
      audio.play();
      confettiRef.current.addConfetti();
      setIsRunning(false);

      // Add to timer history
      setTimerHistory([...timerHistory, { id: nanoid(), date: new Date(), duration: calculateTimeLeft() }]);

      // Switch phases in Pomodoro mode
      if (pomodoroMode) {
        if (isWorkPhase) {
          setTargetDate(addSeconds(new Date(), breakDuration));
          setIsWorkPhase(false);
        } else {
          setTargetDate(addSeconds(new Date(), workDuration));
          setIsWorkPhase(true);
        }
        setIsRunning(true);
      }
    }
  }, [timeLeft, isRunning]);

  // Update background color based on time left
  useEffect(() => {
    const backgroundColor = `hsl(${(timeLeft / calculateTimeLeft()) * 120}, 50%, 50%)`;
    document.body.style.backgroundColor = backgroundColor;
  }, [timeLeft]);

  // Format time for display
  const formatTime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
  };

  // Event handlers
  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setTimeLeft(calculateTimeLeft());
    setIsRunning(false);
  };

  const handleAddTimer = () => {
    if (!newTimerDate) return;
    const newTargetDate = new Date(newTimerDate);
    setTimers([...timers, { id: nanoid(), date: newTargetDate }]);
    setNewTimerDate('');
  };

  const handleSetTimer = (date) => {
    setTargetDate(date);
    setTimeLeft(differenceInSeconds(date, new Date()));
    setIsRunning(true);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode', !isDarkMode);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const togglePomodoroMode = () => {
    setPomodoroMode(!pomodoroMode);
    if (!pomodoroMode) {
      setTargetDate(addSeconds(new Date(), workDuration));
      setIsWorkPhase(true);
      setIsRunning(true);
    }
  };

  const handleSoundChange = (e) => {
    setSelectedSound(e.target.value);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSettingsClick = () => {
    setShowSettings(true); // Open the settings popup
  };

  const handleCloseSettings = () => {
    setShowSettings(false); // Close the settings popup
  };

  // Render component
  return (
    <div className={`${styles.timerContainer} ${isDarkMode ? styles.darkMode : ''}`}>
      <Header onTabChange={handleTabChange} onSettingsClick={handleSettingsClick} />
      {activeTab === 'timer' && (
        <div className={styles.timerBox}>
          {/* Timer display */}
          <div className={styles.timerDisplay}>
            <h1>{formatTime(timeLeft)}</h1>
            <div className={styles.progressBar}>
              <div
                className={styles.progress}
                style={{ width: `${(timeLeft / calculateTimeLeft()) * 100}%` }}
              ></div>
            </div>
          </div>
          {/* Timer controls */}
          <div className={styles.controls}>
            <button onClick={handleStartPause}>
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button onClick={handleReset}>Reset</button>
            <button onClick={toggleDarkMode}>
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button onClick={toggleFullscreen}>Fullscreen</button>
            <button onClick={togglePomodoroMode}>
              {pomodoroMode ? 'Normal Mode' : 'Pomodoro Mode'}
            </button>
          </div>
          {/* Add new timer */}
          <div className={styles.addTimer}>
            <h4>input date and time</h4>
            <input
              type="datetime-local"
              value={newTimerDate}
              onChange={(e) => setNewTimerDate(e.target.value)}
            />
            <button onClick={handleAddTimer}>Add Timer</button>
          </div>
          {/* Saved timers list */}
          <div className={styles.timerList}>
            <h3>Saved Timers</h3>
            {timers.map((timer) => (
              <div key={timer.id} className={styles.timerItem}>
                <span>{timer.date.toLocaleString()}</span>
                <button onClick={() => handleSetTimer(timer.date)}>Set</button>
              </div>
            ))}
          </div>
          {/* Alarm sound selector */}
          <div className={styles.soundSelector}>
            <label>Alarm Sound:</label>
            <select value={selectedSound} onChange={handleSoundChange}>
              <option value="/alarm.mp3">Alarm 1</option>
              <option value="/alarm2.mp3">Alarm 2</option>
              <option value="/alarm3.mp3">Alarm 3</option>
            </select>
          </div>
          {/* Timer history */}
          <details className={styles.timerHistory}>
            <summary>Timer History</summary>
            {timerHistory.map((entry) => (
              <div key={entry.id} className={styles.historyItem}>
                <span>{entry.date.toLocaleString()}</span>
                <span>{formatTime(entry.duration)}</span>
              </div>
            ))}
          </details>
        </div>
      )}
      {activeTab === 'music' && <MusicPlaylist />}
      {showSettings && <SettingsPopup onClose={handleCloseSettings} />}
    </div>
  );
};

export default Timer;
