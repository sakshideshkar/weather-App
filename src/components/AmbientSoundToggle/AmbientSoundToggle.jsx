import React, { useState, useEffect, useCallback } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { weatherAudio } from '../../utils/audioEngine';
import { FaVolumeHigh, FaVolumeXmark } from 'react-icons/fa6';
import './AmbientSoundToggle.css';

const AmbientSoundToggle = () => {
  const { weatherData } = useWeather();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.35);

  const getWeatherType = useCallback(() => {
    if (!weatherData?.current) return 'clear-day';
    const { iconCode, condition, isDay } = weatherData.current;
    const code = (iconCode || '').toLowerCase();
    const cond = (condition || '').toLowerCase();

    if (code.startsWith('11') || cond.includes('thunder') || cond.includes('storm')) {
      return 'thunderstorm';
    }
    if (code.startsWith('09') || code.startsWith('10') || cond.includes('rain') || cond.includes('drizzle')) {
      return 'rain';
    }
    if (code.startsWith('13') || cond.includes('snow')) {
      return 'snow';
    }
    if (code.startsWith('50') || cond.includes('fog') || cond.includes('mist')) {
      return 'fog';
    }
    if (code.startsWith('03') || code.startsWith('04') || cond.includes('cloud')) {
      return isDay ? 'clouds' : 'night-clouds';
    }
    return isDay ? 'clear-day' : 'starry-night';
  }, [weatherData]);

  const handleToggle = () => {
    if (isPlaying) {
      weatherAudio.stop();
      setIsPlaying(false);
    } else {
      const type = getWeatherType();
      weatherAudio.playWeatherSound(type);
      setIsPlaying(true);
    }
  };

  // Update sound when weather changes if already playing
  useEffect(() => {
    if (isPlaying && weatherData) {
      const type = getWeatherType();
      weatherAudio.playWeatherSound(type);
    }
  }, [isPlaying, weatherData, getWeatherType]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      weatherAudio.stop();
    };
  }, []);

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    weatherAudio.setVolume(newVol);
  };

  return (
    <div className="ambient-sound-control-wrapper">
      <button
        type="button"
        className={`ambient-sound-btn ${isPlaying ? 'playing' : ''}`}
        onClick={handleToggle}
        title={isPlaying ? 'Mute Ambient Soundscape' : 'Play Live Weather Soundscape'}
        aria-label="Toggle Ambient Audio"
      >
        {isPlaying ? (
          <>
            <FaVolumeHigh className="sound-icon-active" size={14} />
            <span className="sound-bars">
              <span className="sound-bar bar1" />
              <span className="sound-bar bar2" />
              <span className="sound-bar bar3" />
            </span>
          </>
        ) : (
          <>
            <FaVolumeXmark size={14} />
            <span className="sound-label">Audio</span>
          </>
        )}
      </button>

      {isPlaying && (
        <div className="ambient-volume-slider-popup glass-card">
          <span className="volume-label">{Math.round(volume * 100)}%</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
            aria-label="Atmospheric sound volume"
          />
        </div>
      )}
    </div>
  );
};

export default AmbientSoundToggle;
