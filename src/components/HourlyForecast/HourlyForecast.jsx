import React, { useRef } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { getWeatherIcon } from '../../utils/weatherIcons';
import { formatTemp } from '../../utils/formatters';
import { FaDroplet, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import './HourlyForecast.css';

const HourlyForecast = ({ hourly = [] }) => {
  const { unit } = useWeather();
  const scrollContainerRef = useRef(null);

  if (!hourly || hourly.length === 0) return null;

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="hourly-forecast-section" id="hourly-forecast-section">
      <div className="section-header-row">
        <h2 className="section-heading">Hourly Forecast</h2>
        <div className="scroll-arrow-controls">
          <button
            type="button"
            className="scroll-btn"
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
          >
            <FaChevronLeft size={13} />
          </button>
          <button
            type="button"
            className="scroll-btn"
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
          >
            <FaChevronRight size={13} />
          </button>
        </div>
      </div>

      <div className="hourly-scroll-container" ref={scrollContainerRef}>
        {hourly.map((item, idx) => (
          <div key={`${item.time}-${idx}`} className="hourly-card glass-card">
            <span className="hourly-time">
              {idx === 0 ? 'Now' : item.hourStr}
            </span>

            <div className="hourly-icon-wrap">
              {getWeatherIcon(item.iconCode, item.condition, 40)}
            </div>

            <span className="hourly-temp">{formatTemp(item.tempC, unit)}</span>

            <div className="hourly-pop-wrap">
              <FaDroplet size={11} className={item.pop > 0 ? 'pop-active' : 'pop-inactive'} />
              <span className="hourly-pop-value">{item.pop}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
