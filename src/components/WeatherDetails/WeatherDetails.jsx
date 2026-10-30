import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import {
  formatTemp,
  formatWindSpeed,
  getWindDirectionText,
  getUvCategory,
  formatTimeFromIsoOrTimestamp
} from '../../utils/formatters';
import {
  WiHumidity,
  WiStrongWind,
  WiBarometer,
  WiSunrise,
  WiThermometerExterior
} from 'react-icons/wi';
import {
  FaEye,
  FaSun,
  FaMoon,
  FaCompass,
  FaCloud
} from 'react-icons/fa6';
import './WeatherDetails.css';

const WeatherDetails = ({ weather }) => {
  const { unit } = useWeather();
  const current = weather?.current;
  const location = weather?.location;

  if (!weather || !current) return null;

  const uvInfo = getUvCategory(current.uvIndex);
  const windDirText = getWindDirectionText(current.windDirection);
  const beaufort = current.beaufort || { number: 3, label: 'Gentle Breeze', desc: 'Leaves in motion' };
  const moonPhase = current.moonPhase || { name: 'Full Moon', icon: '🌕', illumination: 100 };

  const sunriseTime = location?.sunrise
    ? formatTimeFromIsoOrTimestamp(location.sunrise, location.timezoneOffsetSec)
    : '--:--';
  const sunsetTime = location?.sunset
    ? formatTimeFromIsoOrTimestamp(location.sunset, location.timezoneOffsetSec)
    : '--:--';

  return (
    <div className="weather-details-section">
      <div className="details-header-row">
        <h2 className="section-heading" style={{ marginBottom: 0 }}>
          Atmospheric Highlights
        </h2>
        <span className="telemetry-badge">Live Sensor Metrics</span>
      </div>

      <div className="details-grid">
        {/* 1. Humidity Card */}
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
            {current.humidity > 65 ? 'Humid & moist air' : current.humidity < 30 ? 'Dry air' : 'Comfortable air'}
          </span>
        </div>

        {/* 2. Dew Point Card */}
        <div className="detail-card glass-card">
          <div className="detail-card-header">
            <span className="detail-title">Dew Point</span>
            <div className="detail-icon-wrap icon-emerald">
              <WiThermometerExterior size={26} />
            </div>
          </div>
          <div className="detail-main-value">
            <span className="value-number">
              {formatTemp(current.dewPointC ?? current.tempC - 4, unit)}
            </span>
          </div>
          <div className="dew-point-meter">
            <span className="dew-badge">
              {current.dewPointC > 20 ? 'Sticky & Oppressive' : current.dewPointC > 15 ? 'Humid' : current.dewPointC > 10 ? 'Comfortable' : 'Crisp & Dry'}
            </span>
          </div>
          <span className="detail-status-text">
            Moisture condensation threshold
          </span>
        </div>

        {/* 3. Wind & Beaufort Scale Card */}
        <div className="detail-card glass-card">
          <div className="detail-card-header">
            <span className="detail-title">Wind & Gusts</span>
            <div className="detail-icon-wrap icon-blue">
              <WiStrongWind size={28} />
            </div>
          </div>
          <div className="detail-main-value">
            <span className="value-number">{formatWindSpeed(current.windSpeedKmh, unit)}</span>
            {current.windGustsKmh && (
              <span className="value-sub-text">
                Gusts: {formatWindSpeed(current.windGustsKmh, unit)}
              </span>
            )}
          </div>
          <div className="wind-direction-row">
            <div
              className="wind-compass-needle"
              style={{ transform: `rotate(${current.windDirection}deg)` }}
            >
              <FaCompass size={18} />
            </div>
            <span className="wind-direction-label">
              <strong>{windDirText} ({current.windDirection}°)</strong> • Beaufort {beaufort.number}
            </span>
          </div>
          <span className="detail-status-text">
            {beaufort.label} ({beaufort.desc})
          </span>
        </div>

        {/* 4. Cloud Cover Card */}
        <div className="detail-card glass-card">
          <div className="detail-card-header">
            <span className="detail-title">Cloud Cover</span>
            <div className="detail-icon-wrap icon-indigo">
              <FaCloud size={16} />
            </div>
          </div>
          <div className="detail-main-value">
            <span className="value-number">{current.cloudCover ?? 25}</span>
            <span className="value-unit">%</span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill fill-indigo"
              style={{ width: `${current.cloudCover ?? 25}%` }}
            />
          </div>
          <span className="detail-status-text">
            {(current.cloudCover ?? 25) > 75 ? 'Overcast skies' : (current.cloudCover ?? 25) > 40 ? 'Partly cloudy' : 'Mostly clear sky'}
          </span>
        </div>

        {/* 5. UV Index Card */}
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
            {current.uvIndex >= 6 ? 'Sun protection required' : 'Low sun exposure hazard'}
          </span>
        </div>

        {/* 6. Pressure Card */}
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

        {/* 7. Visibility Card */}
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
            {current.visibilityKm >= 9 ? 'Clear horizontal sightline' : 'Haze or mist present'}
          </span>
        </div>

        {/* 8. Lunar & Solar Astronomy Card */}
        <div className="detail-card glass-card astronomy-card">
          <div className="detail-card-header">
            <span className="detail-title">Sun & Moon Schedule</span>
            <div className="detail-icon-wrap icon-warm">
              <FaMoon size={16} />
            </div>
          </div>

          <div className="astronomy-details-row">
            {/* Sun times */}
            <div className="astro-block">
              <div className="astro-sub-header">
                <WiSunrise size={20} className="sun-rise-icon" />
                <span>Rise / Set</span>
              </div>
              <span className="astro-time-val">{sunriseTime} / {sunsetTime}</span>
              {current.daylightDuration && (
                <span className="astro-duration-note">Daylight: {current.daylightDuration}</span>
              )}
            </div>

            <div className="astro-divider" />

            {/* Moon Phase */}
            <div className="astro-block">
              <div className="astro-sub-header">
                <span className="astro-moon-icon">{moonPhase.icon}</span>
                <span>Moon Phase</span>
              </div>
              <span className="astro-time-val">{moonPhase.name}</span>
              <span className="astro-duration-note">{moonPhase.illumination}% Illuminated</span>
            </div>
          </div>

          <span className="detail-status-text">Astronomical ephemeris</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;
