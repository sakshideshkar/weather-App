import React, { useState, useEffect } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { getWeatherIcon, getWeatherBackgroundClass } from '../../utils/weatherIcons';
import {
  formatTemp,
  formatTimeFromIsoOrTimestamp,
  formatFullDate
} from '../../utils/formatters';
import {
  FaHeart,
  FaRegHeart,
  FaLocationDot,
  FaArrowUp,
  FaArrowDown,
  FaClock
} from 'react-icons/fa6';
import './CurrentWeather.css';

const CurrentWeather = ({ weather }) => {
  const { unit, toggleFavorite, isFavorite } = useWeather();
  const [localClockTime, setLocalClockTime] = useState('');

  const location = weather?.location;
  const current = weather?.current;
  const isFav = location ? isFavorite(location.name, location.country) : false;

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

  return (
    <div className={`current-weather-card glass-card ${bgClass}`} id="current-weather-hero">
      {/* Decorative Accent Glow */}
      <div className="current-weather-glow" />

      {/* Card Header: Location, Date/Time & Favorite Button */}
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

        <button
          type="button"
          className={`favorite-toggle-btn ${isFav ? 'is-favorited' : ''}`}
          onClick={() => toggleFavorite(location)}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          aria-label={isFav ? 'Remove favorite' : 'Add favorite'}
          id="btn-toggle-favorite"
        >
          {isFav ? (
            <FaHeart className="fav-icon fav-active" />
          ) : (
            <FaRegHeart className="fav-icon" />
          )}
          <span className="fav-btn-label">{isFav ? 'Favorited' : 'Save'}</span>
        </button>
      </div>

      {/* Main Temperature & Weather Icon Display */}
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
            {getWeatherIcon(current.iconCode, current.condition, 110)}
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
    </div>
  );
};

export default CurrentWeather;
