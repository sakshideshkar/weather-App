import React, { useRef, useState } from 'react';
import { getWeatherIcon } from '../../utils/weatherIcons';
import { formatTemp, formatFullDate } from '../../utils/formatters';
import {
  FaXmark,
  FaShareNodes,
  FaCheck,
  FaLocationDot,
  FaWind,
  FaDroplet,
  FaSun,
  FaMoon
} from 'react-icons/fa6';
import { WiDayCloudy } from 'react-icons/wi';
import './WeatherSnapCardModal.css';

const AESTHETIC_QUOTES = {
  clear: 'Chasing golden horizons and clear open skies. ✨',
  rain: 'Petrichor in the air, soft rain on the window. 🌧️',
  snow: 'A quiet world covered in glistening white snow. ❄️',
  thunderstorm: 'Raw atmospheric power and dramatic lightning. ⚡',
  clouds: 'Soft drifting clouds and contemplative quiet breezes. ☁️',
  fog: 'An ethereal misty morning veiled in dreamlike haze. 🌫️'
};

const getAestheticQuote = (cond = '') => {
  const c = cond.toLowerCase();
  if (c.includes('rain') || c.includes('drizzle')) return AESTHETIC_QUOTES.rain;
  if (c.includes('snow') || c.includes('ice')) return AESTHETIC_QUOTES.snow;
  if (c.includes('thunder') || c.includes('storm')) return AESTHETIC_QUOTES.thunderstorm;
  if (c.includes('fog') || c.includes('mist')) return AESTHETIC_QUOTES.fog;
  if (c.includes('cloud') || c.includes('overcast')) return AESTHETIC_QUOTES.clouds;
  return AESTHETIC_QUOTES.clear;
};

const WeatherSnapCardModal = ({ weather, unit = 'C', onClose }) => {
  const cardRef = useRef(null);
  const [copied, setCopied] = useState(false);

  if (!weather || !weather.current || !weather.location) return null;

  const { location, current } = weather;
  const quote = getAestheticQuote(current.condition);

  const handleShare = async () => {
    const text = `🌤️ SkyPulse Weather Snap: ${location.name} is currently ${formatTemp(current.tempC, unit)} (${current.condition}). Feels like ${formatTemp(current.feelsLikeC, unit)}. "${quote}"`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Weather in ${location.name}`,
          text,
          url: window.location.href
        });
        return;
      } catch {
        // fallback
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="snap-modal-backdrop" onClick={onClose}>
      <div className="snap-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Modal Controls */}
        <div className="snap-modal-top-bar">
          <span className="snap-modal-title">✨ Aesthetic Weather Story</span>
          <button
            type="button"
            className="snap-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <FaXmark size={16} />
          </button>
        </div>

        {/* 9:16 Vertical Instagram/WhatsApp Story Card */}
        <div className="snap-story-card glass-card" ref={cardRef}>
          {/* Card Ambient Glow Circles */}
          <div className="snap-glow top-glow" />
          <div className="snap-glow bottom-glow" />

          {/* Top Brand Bar */}
          <div className="snap-card-brand">
            <div className="snap-brand-badge">
              <WiDayCloudy size={24} className="snap-brand-icon" />
              <span>SkyPulse</span>
            </div>
            <span className="snap-live-pill">LIVE SNAP</span>
          </div>

          {/* Center Location & Visual */}
          <div className="snap-center-content">
            <div className="snap-location-tag">
              <FaLocationDot className="snap-pin" />
              <h2 className="snap-city-name">{location.name}</h2>
              {location.country && <span className="snap-country">{location.country}</span>}
            </div>

            <span className="snap-date-str">
              {formatFullDate(new Date(), location.timezoneOffsetSec)}
            </span>

            {/* Weather Icon with Floating Glow */}
            <div className="snap-icon-hero animate-float">
              {getWeatherIcon(current.iconCode, current.condition, 120)}
            </div>

            {/* Giant Temperature */}
            <div className="snap-temp-display">
              {formatTemp(current.tempC, unit)}
            </div>

            <span className="snap-condition-text">{current.condition}</span>
            <span className="snap-feels-text">
              Feels like <strong>{formatTemp(current.feelsLikeC, unit)}</strong>
            </span>
          </div>

          {/* Aesthetic Quote */}
          <div className="snap-quote-box">
            <p className="snap-quote-text">"{quote}"</p>
          </div>

          {/* Bottom Telemetry Strip */}
          <div className="snap-telemetry-grid">
            <div className="snap-tele-item">
              <FaDroplet className="snap-tele-icon" />
              <span className="snap-tele-val">{current.humidity}%</span>
              <span className="snap-tele-lbl">Humidity</span>
            </div>
            <div className="snap-tele-item">
              <FaWind className="snap-tele-icon" />
              <span className="snap-tele-val">{current.windSpeedKmh}k</span>
              <span className="snap-tele-lbl">Wind Speed</span>
            </div>
            <div className="snap-tele-item">
              <FaSun className="snap-tele-icon" />
              <span className="snap-tele-val">{current.uvIndex}</span>
              <span className="snap-tele-lbl">UV Index</span>
            </div>
            <div className="snap-tele-item">
              <FaMoon className="snap-tele-icon" />
              <span className="snap-tele-val">{current.moonPhase?.name?.split(' ')[0] || 'Moon'}</span>
              <span className="snap-tele-lbl">Phase</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="snap-modal-actions">
          <button
            type="button"
            className="snap-share-action-btn"
            onClick={handleShare}
          >
            {copied ? <FaCheck size={14} /> : <FaShareNodes size={14} />}
            <span>{copied ? 'Copied to Clipboard!' : 'Share Weather Story'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeatherSnapCardModal;

