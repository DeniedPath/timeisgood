"use client"
import React, { useState, useEffect, useRef } from 'react';
import { differenceInSeconds, addSeconds } from 'date-fns';
import JSConfetti from 'js-confetti';
import localforage from 'localforage';
import { nanoid } from 'nanoid';
import Header from '../components/Header';
import MusicPlaylist from '../components/MusicPlaylist';
import SettingsPopup from '../components/SettingsPopup';
import 'tailwindcss/tailwind.css';

const Timer = () => {
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

  function calculateTimeLeft() {
    const now = new Date();
    const difference = differenceInSeconds(targetDate, now);
    return difference > 0 ? difference : 0;
  }

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, targetDate]);

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

  useEffect(() => {
    const backgroundColor = `hsl(${(timeLeft / calculateTimeLeft()) * 120}, 50%, 50%)`;
    document.body.style.backgroundColor = backgroundColor;
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
  };

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

  return (
    <div className={`flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-900 to-blue-700 text-white font-sans transition-colors duration-500 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-700 text-white' : ''}`}>
      <Header onTabChange={handleTabChange} onSettingsClick={handleSettingsClick} />
      {activeTab === 'timer' && (
        <div className="flex flex-col items-center justify-center p-5 bg-black bg-opacity-50 rounded-lg shadow-lg">
          <div className="text-4xl mb-5">
            <h1>{formatTime(timeLeft)}</h1>
            <div className="w-full max-w-lg h-2 bg-white bg-opacity-30 rounded overflow-hidden">
              <div
                className="h-full bg-red-400 transition-width duration-1000"
                style={{ width: `${(timeLeft / calculateTimeLeft()) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center">
            <button className="m-2 p-2 text-white bg-red-400 border-none rounded cursor-pointer transition-colors duration-300" onClick={handleStartPause}>
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button className="m-2 p-2 text-white bg-red-400 border-none rounded cursor-pointer transition-colors duration-300" onClick={handleReset}>Reset</button>
            <button className="m-2 p-2 text-white bg-red-400 border-none rounded cursor-pointer transition-colors duration-300" onClick={toggleDarkMode}>
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button className="m-2 p-2 text-white bg-red-400 border-none rounded cursor-pointer transition-colors duration-300" onClick={toggleFullscreen}>Fullscreen</button>
            <button className="m-2 p-2 text-white bg-red-400 border-none rounded cursor-pointer transition-colors duration-300" onClick={togglePomodoroMode}>
              {pomodoroMode ? 'Normal Mode' : 'Pomodoro Mode'}
            </button>
          </div>
          <div className="mt-5">
            <input
              type="datetime-local"
              value={newTimerDate}
              onChange={(e) => setNewTimerDate(e.target.value)}
            />
            <button className="m-2 p-2 text-white bg-red-400 border-none rounded cursor-pointer transition-colors duration-300" onClick={handleAddTimer}>Add Timer</button>
          </div>
          <div className="mt-5">
            <h3>Saved Timers</h3>
            {timers.map((timer) => (
              <div key={timer.id} className="flex justify-between items-center my-2 p-2 bg-white bg-opacity-10 rounded w-72">
                <span>{timer.date.toLocaleString()}</span>
                <button className="m-2 p-2 text-white bg-red-400 border-none rounded cursor-pointer transition-colors duration-300" onClick={() => handleSetTimer(timer.date)}>Set</button>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <label>Alarm Sound:</label>
            <select value={selectedSound} onChange={handleSoundChange}>
              <option value="/alarm.mp3">Alarm 1</option>
              <option value="/alarm2.mp3">Alarm 2</option>
              <option value="/alarm3.mp3">Alarm 3</option>
            </select>
          </div>
          <details className="mt-5">
            <summary>Timer History</summary>
            {timerHistory.map((entry) => (
              <div key={entry.id} className="flex justify-between items-center my-2 p-2 bg-white bg-opacity-10 rounded w-72">
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
