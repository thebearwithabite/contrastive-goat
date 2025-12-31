import React from 'react';
import { audioManager } from '../lib/audio';

/**
 * Audio control component with mute/volume controls
 */
export default function AudioPlayer() {
  const [isMuted, setIsMuted] = React.useState(false);
  const [volume, setVolume] = React.useState(1);
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Initialize audio on first user interaction
  const handleInit = React.useCallback(async () => {
    if (!isInitialized) {
      await audioManager.init();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  React.useEffect(() => {
    // Add click listener to initialize audio
    const initOnClick = () => {
      handleInit();
      document.removeEventListener('click', initOnClick);
    };
    document.addEventListener('click', initOnClick);

    return () => {
      document.removeEventListener('click', initOnClick);
    };
  }, [handleInit]);

  const handleToggleMute = () => {
    const newMuted = audioManager.toggleMute();
    setIsMuted(newMuted);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioManager.setVolume(newVolume);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '4rem',
        right: '1rem',
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
        padding: '0.5rem 0.75rem',
        background: 'rgba(15, 26, 33, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid #18303d',
        borderRadius: '12px',
        zIndex: 1000,
        fontSize: '0.9rem'
      }}
    >
      {!isInitialized && (
        <button
          onClick={handleInit}
          className="btn"
          style={{
            padding: '0.25rem 0.5rem',
            fontSize: '0.85rem'
          }}
          title="Enable audio"
        >
          🔇 Enable Audio
        </button>
      )}
      {isInitialized && (
        <>
          <button
            onClick={handleToggleMute}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9cd3ff',
              cursor: 'pointer',
              fontSize: '1.2rem',
              padding: '0.25rem'
            }}
            title={isMuted ? 'Unmute' : 'Mute'}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            style={{
              width: '80px',
              accentColor: '#9cd3ff'
            }}
            title="Volume"
            aria-label="Volume"
          />
        </>
      )}
    </div>
  );
}
