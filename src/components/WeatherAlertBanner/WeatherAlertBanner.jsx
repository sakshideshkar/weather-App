import React, { useState } from 'react';
import {
  FaTriangleExclamation,
  FaChevronDown,
  FaChevronUp,
  FaShieldHalved
} from 'react-icons/fa6';
import './WeatherAlertBanner.css';

const checkSevereAlerts = (weather) => {
  if (!weather || !weather.current) return null;

  const current = weather.current;
  const location = weather.location;
  const temp = current.tempC;
  const cond = (current.condition || '').toLowerCase();
  const icon = (current.iconCode || '').toLowerCase();
  const wind = current.windSpeedKmh || 0;
  const aqi = current.airQuality || 1;

  const alerts = [];

  // Thunderstorm / Lightning
  if (icon.startsWith('11') || cond.includes('thunder') || cond.includes('storm')) {
    alerts.push({
      type: 'severe',
      level: 'Thunderstorm Warning',
      color: '#ef4444',
      message: `Active thunderstorm conditions detected over ${location.name}. Expect lightning discharges and sudden wind gusts.`,
      advice: 'Remain indoors, unplug sensitive electronics, and avoid open elevated areas.'
    });
  }

  // Extreme Heatwave (> 38°C)
  if (temp >= 38) {
    alerts.push({
      type: 'warning',
      level: 'Extreme Heatwave Advisory',
      color: '#f97316',
      message: `Dangerous heat index of ${temp}°C in ${location.name}. Prolonged sun exposure poses severe heatstroke risk.`,
      advice: 'Hydrate frequently, avoid direct midday sun, and wear lightweight sun-protective clothing.'
    });
  }

  // Freezing / Frost (< 2°C)
  if (temp <= 2) {
    alerts.push({
      type: 'warning',
      level: 'Freezing Temperature & Frost Warning',
      color: '#38bdf8',
      message: `Sub-zero or near-freezing chill (${temp}°C) in ${location.name}. Risk of hypothermia and icy patches.`,
      advice: 'Wear multiple thermal layers, protect exposed skin, and exercise caution on slick roadways.'
    });
  }

  // High Winds (> 45 km/h)
  if (wind >= 45) {
    alerts.push({
      type: 'warning',
      level: 'High Wind Velocity Alert',
      color: '#f59e0b',
      message: `Gale-force wind gusts reaching ${wind} km/h recorded in ${location.name}.`,
      advice: 'Secure outdoor furniture, beware of falling tree branches, and maintain firm vehicle control.'
    });
  }

  // Heavy Downpour (> 80% pop + rain)
  if (cond.includes('heavy rain') || cond.includes('violent')) {
    alerts.push({
      type: 'severe',
      level: 'Heavy Downpour & Flash Puddle Hazard',
      color: '#ef4444',
      message: `Torrential rainfall causing reduced visibility and urban water accumulation in ${location.name}.`,
      advice: 'Avoid driving through flooded underpasses and check transit route advisories.'
    });
  }

  // Air Quality Emergency (AQI > 160)
  if (aqi >= 4 || (current.pollutants?.pm25 && current.pollutants.pm25 > 90)) {
    alerts.push({
      type: 'health',
      level: 'Poor Air Quality Advisory',
      color: '#a855f7',
      message: `Elevated particulate matter (PM2.5) concentrations in ${location.name}.`,
      advice: 'Wear N95 masks outdoors, keep windows shut, and run indoor air filtration.'
    });
  }

  return alerts.length > 0 ? alerts[0] : null;
};

const WeatherAlertBanner = ({ weather }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const alert = checkSevereAlerts(weather);

  if (!alert) return null;

  return (
    <div
      className="weather-alert-banner glass-card"
      style={{ borderColor: `${alert.color}55`, background: `linear-gradient(135deg, ${alert.color}15 0%, rgba(15, 23, 42, 0.7) 100%)` }}
      id="active-weather-alert"
    >
      <div className="alert-banner-header" onClick={() => setIsExpanded((prev) => !prev)}>
        <div className="alert-badge-group">
          <div className="alert-pulse-icon" style={{ color: alert.color, backgroundColor: `${alert.color}25` }}>
            <FaTriangleExclamation size={16} />
          </div>
          <div>
            <div className="alert-level-row">
              <span className="alert-level-pill" style={{ backgroundColor: alert.color }}>
                {alert.level}
              </span>
              <span className="alert-live-tag">Active Alert</span>
            </div>
            <p className="alert-headline">{alert.message}</p>
          </div>
        </div>

        <button
          type="button"
          className="alert-expand-btn"
          aria-label="Toggle Alert Details"
        >
          {isExpanded ? <FaChevronUp size={13} /> : <FaChevronDown size={13} />}
        </button>
      </div>

      {isExpanded && (
        <div className="alert-details-expanded">
          <div className="alert-advice-box">
            <FaShieldHalved className="advice-shield" style={{ color: alert.color }} />
            <div>
              <strong className="advice-title">Recommended Safety Precautions:</strong>
              <p className="advice-text">{alert.advice}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherAlertBanner;

