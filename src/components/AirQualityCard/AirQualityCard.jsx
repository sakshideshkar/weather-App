import React from 'react';
import { WiDust } from 'react-icons/wi';
import {
  FaShieldVirus,
  FaPersonWalking,
  FaDoorOpen,
  FaWind
} from 'react-icons/fa6';
import './AirQualityCard.css';

/**
 * Returns complete AQI metadata based on US AQI scale (0-500) or standard scale (1-5)
 */
const getAqiDetails = (rawAqi = 1) => {
  // If 1-5 scale (OpenWeather), map to standard US AQI equivalent
  let usAqi = typeof rawAqi === 'number' ? rawAqi : 42;
  if (usAqi <= 5) {
    const scaleMap = { 1: 32, 2: 68, 3: 118, 4: 165, 5: 240 };
    usAqi = scaleMap[usAqi] || 35;
  }

  if (usAqi <= 50) {
    return {
      aqi: usAqi,
      label: 'Good',
      color: '#10b981',
      glow: 'rgba(16, 185, 129, 0.3)',
      desc: 'Air quality is considered satisfactory, and air pollution poses little or no risk.',
      recommendation: {
        outdoor: { text: 'Ideal for outdoor exercise and activities.', safe: true },
        ventilation: { text: 'Open windows for fresh air flow.', safe: true },
        mask: { text: 'No protective mask required.', safe: true },
        purifier: { text: 'Air purifiers optional.', safe: true }
      }
    };
  }
  if (usAqi <= 100) {
    return {
      aqi: usAqi,
      label: 'Moderate',
      color: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.3)',
      desc: 'Air quality is acceptable; however, sensitive groups may experience minor effects.',
      recommendation: {
        outdoor: { text: 'Safe for most; sensitive individuals take breaks.', safe: true },
        ventilation: { text: 'Good time for periodic natural ventilation.', safe: true },
        mask: { text: 'Masks generally not required.', safe: true },
        purifier: { text: 'Recommended for sensitive individuals indoors.', safe: false }
      }
    };
  }
  if (usAqi <= 150) {
    return {
      aqi: usAqi,
      label: 'Unhealthy for Sensitive',
      color: '#f97316',
      glow: 'rgba(249, 115, 22, 0.3)',
      desc: 'Members of sensitive groups may experience health effects. General public less affected.',
      recommendation: {
        outdoor: { text: 'Reduce prolonged or heavy outdoor exertion.', safe: false },
        ventilation: { text: 'Limit window opening during peak traffic hours.', safe: false },
        mask: { text: 'N95 masks advised for sensitive individuals.', safe: false },
        purifier: { text: 'Run indoor air purifiers on active cycle.', safe: false }
      }
    };
  }
  if (usAqi <= 200) {
    return {
      aqi: usAqi,
      label: 'Unhealthy',
      color: '#ef4444',
      glow: 'rgba(239, 68, 68, 0.35)',
      desc: 'Everyone may begin to experience health effects; sensitive groups may suffer serious effects.',
      recommendation: {
        outdoor: { text: 'Avoid outdoor exercise; move activities indoors.', safe: false },
        ventilation: { text: 'Keep windows and doors securely closed.', safe: false },
        mask: { text: 'Wear protective N95 mask outdoors.', safe: false },
        purifier: { text: 'Turn on HEPA air purifiers at high setting.', safe: false }
      }
    };
  }
  if (usAqi <= 300) {
    return {
      aqi: usAqi,
      label: 'Very Unhealthy',
      color: '#a855f7',
      glow: 'rgba(168, 85, 247, 0.4)',
      desc: 'Health alert: The risk of health effects is increased for all individuals.',
      recommendation: {
        outdoor: { text: 'Strictly avoid outdoor physical exertion.', safe: false },
        ventilation: { text: 'Keep all outdoor vents and windows sealed.', safe: false },
        mask: { text: 'Mandatory N95/FFP2 respirator outdoors.', safe: false },
        purifier: { text: 'Run air purifiers continuously indoors.', safe: false }
      }
    };
  }
  return {
    aqi: usAqi,
    label: 'Hazardous',
    color: '#881337',
    glow: 'rgba(136, 19, 55, 0.45)',
    desc: 'Health warnings of emergency conditions. The entire population is likely affected.',
    recommendation: {
      outdoor: { text: 'Stay indoors and avoid all outdoor exposure.', safe: false },
      ventilation: { text: 'Seal doors and windows completely.', safe: false },
      mask: { text: 'High filtration respirator required outdoors.', safe: false },
      purifier: { text: 'Continuous high-grade filtration needed.', safe: false }
    }
  };
};

const AirQualityCard = ({ weather }) => {
  const current = weather?.current;
  if (!weather || !current) return null;

  const aqiInfo = getAqiDetails(current.airQuality);
  const pollutants = current.pollutants || {
    pm25: Math.round(aqiInfo.aqi * 0.38),
    pm10: Math.round(aqiInfo.aqi * 0.72),
    o3: 45,
    no2: 24,
    so2: 9,
    co: 410
  };

  // Semi-circle gauge rotation (0 to 180 degrees)
  const rotationDeg = Math.min(180, Math.max(0, (aqiInfo.aqi / 300) * 180));

  return (
    <div className="aqi-card glass-card" id="air-quality-highlights-card">
      <div className="aqi-card-header">
        <div className="aqi-title-wrap">
          <div className="aqi-icon-badge" style={{ backgroundColor: `${aqiInfo.color}20`, color: aqiInfo.color }}>
            <WiDust size={28} />
          </div>
          <div>
            <h3 className="aqi-title">Air Quality Index</h3>
            <span className="aqi-scale-tag">US AQI Standard</span>
          </div>
        </div>

        <div className="aqi-status-pill" style={{ backgroundColor: `${aqiInfo.color}22`, color: aqiInfo.color, borderColor: `${aqiInfo.color}45` }}>
          <span className="aqi-dot" style={{ backgroundColor: aqiInfo.color }} />
          {aqiInfo.label}
        </div>
      </div>

      {/* Main Meter Row */}
      <div className="aqi-meter-row">
        {/* Semi-Circle SVG Radial Gauge */}
        <div className="aqi-gauge-container">
          <svg className="aqi-gauge-svg" viewBox="0 0 200 115">
            <defs>
              <linearGradient id="aqiArcGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="25%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="75%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>

            {/* Background Track Arc */}
            <path
              d="M 25,100 A 75,75 0 0,1 175,100"
              fill="none"
              stroke="var(--border-color)"
              strokeWidth="14"
              strokeLinecap="round"
            />

            {/* Colored Active Progress Arc */}
            <path
              d="M 25,100 A 75,75 0 0,1 175,100"
              fill="none"
              stroke="url(#aqiArcGradient)"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="235"
              strokeDashoffset={235 - (235 * (rotationDeg / 180))}
              className="aqi-active-arc"
            />
          </svg>

          {/* Value Display in Center */}
          <div className="aqi-gauge-center">
            <span className="aqi-hero-number" style={{ color: aqiInfo.color }}>
              {aqiInfo.aqi}
            </span>
            <span className="aqi-hero-label">AQI</span>
          </div>
        </div>

        {/* Text Summary */}
        <div className="aqi-summary-col">
          <p className="aqi-description-text">{aqiInfo.desc}</p>

          <div className="aqi-recommendations-grid">
            <div className={`aqi-rec-item ${aqiInfo.recommendation.outdoor.safe ? 'safe' : 'caution'}`}>
              <FaPersonWalking className="rec-icon" />
              <span>{aqiInfo.recommendation.outdoor.text}</span>
            </div>

            <div className={`aqi-rec-item ${aqiInfo.recommendation.ventilation.safe ? 'safe' : 'caution'}`}>
              <FaDoorOpen className="rec-icon" />
              <span>{aqiInfo.recommendation.ventilation.text}</span>
            </div>

            <div className={`aqi-rec-item ${aqiInfo.recommendation.mask.safe ? 'safe' : 'caution'}`}>
              <FaShieldVirus className="rec-icon" />
              <span>{aqiInfo.recommendation.mask.text}</span>
            </div>

            <div className={`aqi-rec-item ${aqiInfo.recommendation.purifier.safe ? 'safe' : 'caution'}`}>
              <FaWind className="rec-icon" />
              <span>{aqiInfo.recommendation.purifier.text}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Pollutants Chips Grid */}
      <div className="pollutants-section">
        <span className="pollutants-title">Key Atmospheric Pollutants</span>
        <div className="pollutants-grid">
          <div className="pollutant-card">
            <span className="pollutant-name">PM2.5</span>
            <span className="pollutant-val">{pollutants.pm25} <small>µg/m³</small></span>
            <span className="pollutant-badge">Fine Dust</span>
          </div>
          <div className="pollutant-card">
            <span className="pollutant-name">PM10</span>
            <span className="pollutant-val">{pollutants.pm10} <small>µg/m³</small></span>
            <span className="pollutant-badge">Coarse Dust</span>
          </div>
          <div className="pollutant-card">
            <span className="pollutant-name">O₃ (Ozone)</span>
            <span className="pollutant-val">{pollutants.o3} <small>µg/m³</small></span>
            <span className="pollutant-badge">Ground Level</span>
          </div>
          <div className="pollutant-card">
            <span className="pollutant-name">NO₂</span>
            <span className="pollutant-val">{pollutants.no2} <small>µg/m³</small></span>
            <span className="pollutant-badge">Emissions</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirQualityCard;
