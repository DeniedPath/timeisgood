'use client';
import { useState } from 'react';
import styles from '../styles/MusicPlaylist.module.css';

// MusicPlaylist component for playing audio tracks
const MusicPlaylist = () => {
  // State to manage play/pause status
  const [isPlaying, setIsPlaying] = useState(false);
  // State to keep track of the currently selected track
  const [currentTrack, setCurrentTrack] = useState(null);

  // Array of available tracks
  const tracks = [
    { id: 1, name: 'Relaxing Piano', url: '/music/piano.mp3' },
    { id: 2, name: 'Ambient Sounds', url: '/music/ambient.mp3' },
    { id: 3, name: 'Nature Sounds', url: '/music/nature.mp3' },
  ];

  // Handler for play/pause button clicks
  const handlePlayPause = (track) => {
    if (currentTrack && currentTrack.id === track.id) {
      // If the clicked track is already playing, toggle play/pause
      setIsPlaying(!isPlaying);
    } else {
      // If a new track is clicked, set it as current and start playing
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  return (
    <div className={styles.musicPlaylist}>
      <h2>Music Playlist</h2>
      <ul>
        {/* Map through tracks and render each as a list item */}
        {tracks.map((track) => (
          <li key={track.id}>
            <span>{track.name}</span>
            <button onClick={() => handlePlayPause(track)}>
              {isPlaying && currentTrack?.id === track.id ? 'Pause' : 'Play'}
            </button>
          </li>
        ))}
      </ul>
      {/* Render audio player if a track is selected */}
      {currentTrack && (
        <audio
          src={currentTrack.url}
          autoPlay={isPlaying}
          controls
          onEnded={() => setIsPlaying(false)}
        />
      )}
    </div>
  );
};

export default MusicPlaylist;
