import React, { useState, useEffect } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { getWeatherIcon, getWeatherBackgroundClass } from '../../utils/weatherIcons';
import {
  formatTemp,
  formatTimeFromIsoOrTimestamp,
  formatFullDate
} from '../../utils/formatters';
import { speakWeatherBriefing, stopSpeechBriefing } from '../../utils/speechVoice';
import WeatherSnapCardModal from '../WeatherSnapCard/WeatherSnapCardModal';
import {
  FaHeart,
  FaRegHeart,
  FaLocationDot,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaShareNodes,
  FaCheck,
  FaHeadphones,
  FaVolumeXmark,
  FaCamera
} from 'react-icons/fa6';
import { WiSunrise, WiSunset } from 'react-icons/wi';
import './CurrentWeather.css';

/**
 * Animated heart explosion confetti on favorite
 */
const triggerHeartBurst = (x, y) => {
  const container = document.createElement('div');
  container.className = 'heart-burst-container';
  container.style.left = `${x}px`;
  container.style.top = `${y}px`;
  document.body.appendChild(container);

  const colors = ['#f43f5e', '#fb7185', '#fda4af', '#f472b6', '#38bdf8', '#fbbf24'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('span');
    p.className = 'burst-particle';
    p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    const angle = (Math.PI * 2 * i) / 18;
    const distance = Math.random() * 50 + 35;
    p.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
    p.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);
    container.appendChild(p);
  }

  setTimeout(() => {
    container.remove();
  }, 900);
};

const CurrentWeather = ({ weather }) => {
  const { unit, toggleFavorite, isFavorite } = useWeather();
  const [localClockTime, setLocalClockTime] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSpeakingBriefing, setIsSpeakingBriefing] = useState(false);
  const [showSnapModal, setShowSnapModal] = useState(false);

  const location = weather?.location;
  const current = weather?.current;
  const isFav = location ? isFavorite(location.name, location.country) : false;

  // Cleanup speech synthesis on component unmount
  useEffect(() => {
    return () => {
      stopSpeechBriefing();
    };
  }, []);

  // Live updating clock for target city based on its timezone offset
  useEffect(() => {
    if (!location) return;

    const updateClock = () => {
      setLocalClockTime(formatTimeFromIsoOrTimestamp(new Date(), location.timezoneOffsetSec));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [location]);

  if (!weather || !current || !location) return null;

  const bgClass = getWeatherBackgroundClass(current.iconCode, current.condition);

  const handleFavoriteClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    if (!isFav) {
      triggerHeartBurst(x, y);
    }
    toggleFavorite(location);
  };

  const handleToggleBriefing = () => {
    if (isSpeakingBriefing) {
      stopSpeechBriefing();
      setIsSpeakingBriefing(false);
    } else {
      setIsSpeakingBriefing(true);
      const started = speakWeatherBriefing(weather, unit, () => {
        setIsSpeakingBriefing(false);
      });
      if (!started) {
        setIsSpeakingBriefing(false);
      }
    }
  };

  const handleShareWeather = async () => {
    const shareText = `Weather in ${location.name}${location.country ? `, ${location.country}` : ''}: ${formatTemp(current.tempC, unit)} (${current.condition}). Feels like ${formatTemp(current.feelsLikeC, unit)}.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Weather in ${location.name}`,
          text: shareText,
          url: window.location.href
        });
        return;
      } catch {
        // fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Calculate Daylight Progress (Sunrise to Sunset)
  let daylightPercent = 50;
  if (location.sunrise && location.sunset) {
    const now = new Date().getTime();
    const rise = new Date(location.sunrise).getTime();
    const set = new Date(location.sunset).getTime();
    if (now >= rise && now <= set && set > rise) {
      daylightPercent = Math.min(100, Math.max(0, ((now - rise) / (set - rise)) * 100));
    } else if (now > set) {
      daylightPercent = 100;
    } else {
      daylightPercent = 0;
    }
  }

  return (
    <div className={`current-weather-card glass-card ${bgClass}`} id="current-weather-hero">
      {/* Decorative Accent Glow */}
      <div className="current-weather-glow" />

      {/* Card Header: Location, Date/Time & Controls */}
      <div className="current-weather-top">
        <div className="location-info">
          <div className="city-title-row">
            <FaLocationDot className="city-pin-icon" />
            <h1 className="city-name" id="current-city-name">
              {location.name}
              {location.country && <span className="city-country">, {location.country}</span>}
            </h1>
          </div>

          <div className="date-time-row">
            <span className="current-date">{formatFullDate(new Date(), location.timezoneOffsetSec)}</span>
            <span className="date-time-divider">•</span>
            <span className="current-time">
              <FaClock className="clock-icon" />
              {localClockTime || '--:--'}
            </span>
          </div>
        </div>

        <div className="current-hero-actions">
          {/* Spoken AI Audio Briefing */}
          <button
            type="button"
            className={`briefing-audio-btn ${isSpeakingBriefing ? 'is-speaking' : ''}`}
            onClick={handleToggleBriefing}
            title={isSpeakingBriefing ? 'Stop voice briefing' : 'Play AI spoken weather briefing'}
            aria-label="AI Voice Briefing"
          >
            {isSpeakingBriefing ? (
              <FaVolumeXmark className="briefing-icon pulse-speaker" />
            ) : (
              <FaHeadphones className="briefing-icon" />
            )}
            <span className="briefing-btn-text">{isSpeakingBriefing ? 'Playing...' : 'Audio Brief'}</span>
          </button>

          {/* Aesthetic Story Snap Modal */}
          <button
            type="button"
            className="snap-modal-btn"
            onClick={() => setShowSnapModal(true)}
            title="Generate aesthetic Instagram & WhatsApp 9:16 Weather Snap"
            aria-label="Create Snap Card"
          >
            <FaCamera className="snap-icon" />
            <span className="snap-btn-text">Snap Story</span>
          </button>

          {/* Share Button */}
          <button
            type="button"
            className="share-weather-btn"
            onClick={handleShareWeather}
            title="Share or Copy Weather Report"
            aria-label="Share Weather"
          >
            {copiedLink ? <FaCheck className="copied-icon" /> : <FaShareNodes />}
            <span>{copiedLink ? 'Copied!' : 'Share'}</span>
          </button>

          {/* Favorite Button */}
          <button
            type="button"
            className={`favorite-toggle-btn ${isFav ? 'is-favorited' : ''}`}
            onClick={handleFavoriteClick}
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={isFav ? 'Remove favorite' : 'Add favorite'}
            id="btn-toggle-favorite"
          >
            {isFav ? (
              <FaHeart className="fav-icon fav-active" />
            ) : (
              <FaRegHeart className="fav-icon" />
            )}
            <span className="fav-btn-label">{isFav ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Temperature & Weather Visual Display */}
      <div className="current-weather-main">
        <div className="temp-display-wrap">
          <div className="temp-hero-value" id="current-temp-value">
            {formatTemp(current.tempC, unit)}
          </div>
          <div className="temp-meta-chips">
            <span className="feels-like-chip" id="current-feels-like">
              Feels like <strong>{formatTemp(current.feelsLikeC, unit)}</strong>
            </span>
            <div className="high-low-chip" id="current-high-low">
              <span className="temp-high">
                <FaArrowUp size={11} /> {formatTemp(current.tempMaxC, unit)}
              </span>
              <span className="temp-low">
                <FaArrowDown size={11} /> {formatTemp(current.tempMinC, unit)}
              </span>
            </div>
          </div>
        </div>

        <div className="weather-hero-visual">
          <div className="hero-icon-container animate-float" id="current-weather-icon">
            {getWeatherIcon(current.iconCode, current.condition, 115)}
          </div>
          <div className="condition-badge-wrap">
            <span className="condition-title" id="current-condition-name">
              {current.condition}
            </span>
            {current.description && current.description.toLowerCase() !== current.condition.toLowerCase() && (
              <span className="condition-desc">{current.description}</span>
            )}
          </div>
        </div>
      </div>

      {/* Daylight Arc Sun Position Track */}
      {location.sunrise && location.sunset && (
        <div className="daylight-progress-strip">
          <div className="daylight-times-row">
            <div className="daylight-label">
              <WiSunrise size={18} />
              <span>Sunrise: {formatTimeFromIsoOrTimestamp(location.sunrise, location.timezoneOffsetSec)}</span>
            </div>
            <div className="daylight-label">
              <WiSunset size={18} />
              <span>Sunset: {formatTimeFromIsoOrTimestamp(location.sunset, location.timezoneOffsetSec)}</span>
            </div>
          </div>
          <div className="daylight-track">
            <div className="daylight-fill" style={{ width: `${daylightPercent}%` }} />
            <div className="daylight-sun-marker" style={{ left: `${daylightPercent}%` }} />
          </div>
        </div>
      )}

      {/* 9:16 Social Weather Snap Card Modal */}
      {showSnapModal && (
        <WeatherSnapCardModal
          weather={weather}
          unit={unit}
          onClose={() => setShowSnapModal(false)}
        />
      )}
    </div>
  );
};

export default CurrentWeather;
