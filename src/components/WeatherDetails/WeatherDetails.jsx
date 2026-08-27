import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import {
  formatWindSpeed,
  getWindDirectionText,
  getUvCategory,
  getAirQualityCategory,
  formatTimeFromIsoOrTimestamp
} from '../../utils/formatters';
import {
  WiHumidity,
  WiStrongWind,
  WiBarometer,
  WiSunrise,
  WiSunset,
  WiDust
} from 'react-icons/wi';
import {
  FaEye,
  FaSun,
  FaCompass,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa6';
import './WeatherDetails.css';

const WeatherDetails = ({ weather }) => {
  const { unit } = useWeather();
  const current = weather?.current;
  const location = weather?.location;

  if (!weather || !current) return null;

  const uvInfo = getUvCategory(current.uvIndex);
  const aqiInfo = getAirQualityCategory(current.airQuality);
  const windDirText = getWindDirectionText(current.windDirection);

  const sunriseTime = location?.sunrise
    ? formatTimeFromIsoOrTimestamp(location.sunrise, location.timezoneOffsetSec)
    : '--:--';
  const sunsetTime = location?.sunset
    ? formatTimeFromIsoOrTimestamp(location.sunset, location.timezoneOffsetSec)
    : '--:--';

  return (
    <div className="weather-details-section">
      <h2 className="section-heading">Weather Highlights</h2>

      <div className="details-grid">
        {/* Humidity Card */}
        <div className="detail-card glass-card">
          <div className="detail-card-header">
            <span className="detail-title">Humidity</span>
            <div className="detail-icon-wrap icon-cyan">
              <WiHumidity size={28} />
            </div>
          </div>
          <div className="detail-main-value">
            <span className="value-number">{current.humidity}</span>
            <span className="value-unit">%</span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill fill-cyan"
              style={{ width: `${current.humidity}%` }}
            />
          </div>
          <span className="detail-status-text">
            {current.humidity > 65 ? 'Humid & moist air' : current.humidity < 30 ? 'Dry air' : 'Comfortable'}
          </span>
        </div>

        {/* Wind Card */}
        <div className="detail-card glass-card">
          <div className="detail-card-header">
            <span className="detail-title">Wind Status</span>
            <div className="detail-icon-wrap icon-blue">
              <WiStrongWind size={28} />
            </div>
          </div>
          <div className="detail-main-value">
            <span className="value-number">{formatWindSpeed(current.windSpeedKmh, unit)}</span>
          </div>
          <div className="wind-direction-row">
            <div
              className="wind-compass-needle"
              style={{ transform: `rotate(${current.windDirection}deg)` }}
            >
              <FaCompass size={18} />
            </div>
            <span className="wind-direction-label">
              Direction: <strong>{windDirText} ({current.windDirection}°)</strong>
            </span>
          </div>
          <span className="detail-status-text">
            {current.windSpeedKmh > 40 ? 'High winds caution' : 'Light to gentle breeze'}
          </span>
        </div>

        {/* UV Index Card */}
        <div className="detail-card glass-card">
          <div className="detail-card-header">
            <span className="detail-title">UV Index</span>
            <div className="detail-icon-wrap icon-amber">
              <FaSun size={18} />
            </div>
          </div>
          <div className="detail-main-value">
            <span className="value-number">{current.uvIndex}</span>
            <span className="value-badge" style={{ backgroundColor: `${uvInfo.color}25`, color: uvInfo.color, border: `1px solid ${uvInfo.color}40` }}>
              {uvInfo.label}
            </span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${uvInfo.percent}%`, backgroundColor: uvInfo.color }}
            />
          </div>
          <span className="detail-status-text">
            {current.uvIndex >= 6 ? 'Sun protection required' : 'Low sun exposure risk'}
          </span>
        </div>

        {/* Pressure Card */}
        <div className="detail-card glass-card">
          <div className="detail-card-header">
            <span className="detail-title">Pressure</span>
            <div className="detail-icon-wrap icon-indigo">
              <WiBarometer size={28} />
            </div>
          </div>
          <div className="detail-main-value">
            <span className="value-number">{current.pressureHpa}</span>
            <span className="value-unit">hPa</span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill fill-indigo"
              style={{ width: `${Math.min(100, Math.max(0, ((current.pressureHpa - 950) / 100) * 100))}%` }}
            />
          </div>
          <span className="detail-status-text">
            {current.pressureHpa >= 1013 ? 'Normal atmospheric pressure' : 'Low pressure system'}
          </span>
        </div>

        {/* Visibility Card */}
        <div className="detail-card glass-card">
          <div className="detail-card-header">
            <span className="detail-title">Visibility</span>
            <div className="detail-icon-wrap icon-emerald">
              <FaEye size={18} />
            </div>
          </div>
          <div className="detail-main-value">
            <span className="value-number">{current.visibilityKm}</span>
            <span className="value-unit">km</span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill fill-emerald"
              style={{ width: `${Math.min(100, (current.visibilityKm / 10) * 100)}%` }}
            />
          </div>
          <span className="detail-status-text">
            {current.visibilityKm >= 9 ? 'Clear visibility' : 'Haze or mist in area'}
          </span>
        </div>

        {/* Sunrise & Sunset Card */}
        <div className="detail-card glass-card sun-cycle-card">
          <div className="detail-card-header">
            <span className="detail-title">Sun Schedule</span>
            <div className="detail-icon-wrap icon-warm">
              <WiSunrise size={28} />
            </div>
          </div>
          <div className="sun-times-row">
            <div className="sun-time-block">
              <div className="sun-time-header">
                <WiSunrise size={24} className="sun-rise-icon" />
                <span>Sunrise</span>
              </div>
              <span className="sun-time-val">{sunriseTime}</span>
            </div>
            <div className="sun-time-divider" />
            <div className="sun-time-block">
              <div className="sun-time-header">
                <WiSunset size={24} className="sun-set-icon" />
                <span>Sunset</span>
              </div>
              <span className="sun-time-val">{sunsetTime}</span>
            </div>
          </div>
          <span className="detail-status-text">Local daylight schedule</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;
