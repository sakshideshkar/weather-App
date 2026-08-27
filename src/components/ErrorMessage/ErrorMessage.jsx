import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { FaCircleExclamation, FaRotateRight, FaMagnifyingGlass } from 'react-icons/fa6';
import './ErrorMessage.css';

const ErrorMessage = ({ message, onRetry }) => {
  const { searchCity } = useWeather();

  const handleQuickSearch = (cityName) => {
    searchCity(cityName);
  };

  return (
    <div className="error-message-card glass-card" id="weather-error-banner">
      <div className="error-icon-wrap">
        <FaCircleExclamation size={36} className="error-exclamation-icon" />
      </div>

      <h3 className="error-title">Weather Data Unavailable</h3>
      <p className="error-description">
        {message || 'Unable to find weather information for the requested location. Please verify the city spelling or check your connection.'}
      </p>

      <div className="error-actions-row">
        {onRetry && (
          <button
            type="button"
            className="error-retry-btn"
            onClick={onRetry}
            id="btn-error-retry"
          >
            <FaRotateRight size={13} />
            <span>Try Again</span>
          </button>
        )}

        <div className="error-suggestions-wrap">
          <span className="error-suggest-label">Or explore:</span>
          <div className="error-suggest-pills">
            {['New Delhi', 'Mumbai', 'Bengaluru', 'Kolkata', 'London', 'Tokyo'].map((city) => (
              <button
                key={city}
                type="button"
                className="error-city-pill"
                onClick={() => handleQuickSearch(city)}
              >
                <FaMagnifyingGlass size={10} />
                <span>{city}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
