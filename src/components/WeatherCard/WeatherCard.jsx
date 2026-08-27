import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { getWeatherIcon } from '../../utils/weatherIcons';
import { formatTemp } from '../../utils/formatters';
import { FaTrashCan, FaLocationDot, FaArrowUp, FaArrowDown } from 'react-icons/fa6';
import './WeatherCard.css';

const WeatherCard = ({
  city,
  weatherInfo,
  onSelect,
  onRemove,
  showRemove = true
}) => {
  const { unit } = useWeather();

  const tempC = weatherInfo?.tempC;
  const condition = weatherInfo?.condition || 'Clear';
  const iconCode = weatherInfo?.iconCode || '01d';
  const tempMinC = weatherInfo?.tempMinC;
  const tempMaxC = weatherInfo?.tempMaxC;

  return (
    <div className="weather-summary-card glass-card">
      <div className="summary-card-body" onClick={() => onSelect && onSelect(city)}>
        <div className="summary-location-row">
          <div className="summary-name-wrap">
            <FaLocationDot className="summary-pin-icon" />
            <h3 className="summary-city-name">{city.name}</h3>
            {city.country && <span className="summary-country-badge">{city.country}</span>}
          </div>

          <div className="summary-icon-wrap">
            {getWeatherIcon(iconCode, condition, 44)}
          </div>
        </div>

        <div className="summary-temp-row">
          <div className="summary-temp-val">
            {tempC !== undefined && tempC !== null ? formatTemp(tempC, unit) : '--°'}
          </div>

          <div className="summary-condition-wrap">
            <span className="summary-condition-name">{condition}</span>
            {tempMinC !== undefined && tempMaxC !== undefined && (
              <div className="summary-minmax">
                <span><FaArrowUp size={10} color="#f97316" /> {formatTemp(tempMaxC, unit)}</span>
                <span><FaArrowDown size={10} color="#38bdf8" /> {formatTemp(tempMinC, unit)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {showRemove && onRemove && (
        <div className="summary-card-footer">
          <button
            type="button"
            className="summary-remove-btn"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(city.name, city.country);
            }}
            title="Remove"
            aria-label="Remove"
          >
            <FaTrashCan size={13} />
            <span>Remove</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
