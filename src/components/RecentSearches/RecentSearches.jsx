import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeather } from '../../context/WeatherContext';
import { getWeatherIcon } from '../../utils/weatherIcons';
import { formatTemp, formatTimeFromIsoOrTimestamp } from '../../utils/formatters';
import {
  FaClockRotateLeft,
  FaTrashCan,
  FaLocationDot,
  FaArrowRight
} from 'react-icons/fa6';
import './RecentSearches.css';

const RecentSearches = ({ onSelectCity }) => {
  const {
    recentSearches,
    removeRecentSearch,
    clearAllSearches,
    searchCity,
    unit
  } = useWeather();

  const navigate = useNavigate();

  const handleSelect = async (item) => {
    if (onSelectCity) {
      onSelectCity(item);
    } else {
      await searchCity(item.name);
      navigate('/');
    }
  };

  return (
    <div className="recent-searches-section">
      <div className="recent-header-row">
        <div className="recent-title-wrap">
          <FaClockRotateLeft className="recent-header-icon" />
          <h2 className="section-heading" style={{ marginBottom: 0 }}>Recent Searches</h2>
        </div>

        {recentSearches.length > 0 && (
          <button
            type="button"
            className="clear-all-btn"
            onClick={clearAllSearches}
            title="Clear all search history"
            id="btn-clear-search-history"
          >
            <FaTrashCan size={12} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {recentSearches.length === 0 ? (
        <div className="recent-empty-state glass-card">
          <div className="empty-history-icon-wrap">
            <FaClockRotateLeft size={36} className="empty-history-icon" />
          </div>
          <h3 className="empty-title">No Search History Yet</h3>
          <p className="empty-subtitle">
            Cities you search for will automatically be saved here so you can quickly check their forecasts again anytime.
          </p>
        </div>
      ) : (
        <div className="recent-list">
          {recentSearches.map((item, idx) => (
            <div
              key={`${item.name}-${idx}`}
              className="recent-item-card glass-card"
              onClick={() => handleSelect(item)}
            >
              <div className="recent-left-col">
                <div className="recent-icon-wrap">
                  {getWeatherIcon(item.iconCode, item.condition, 32)}
                </div>
                <div className="recent-info-col">
                  <div className="recent-name-row">
                    <FaLocationDot size={12} className="recent-pin" />
                    <span className="recent-city-name">{item.name}</span>
                    {item.country && <span className="recent-country-pill">{item.country}</span>}
                  </div>
                  <div className="recent-meta-row">
                    <span className="recent-condition">{item.condition || 'Searched'}</span>
                    {item.searchedAt && (
                      <>
                        <span className="meta-dot">•</span>
                        <span className="recent-time">
                          {formatTimeFromIsoOrTimestamp(item.searchedAt)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="recent-right-col">
                {item.tempC !== undefined && (
                  <span className="recent-temp-value">
                    {formatTemp(item.tempC, unit)}
                  </span>
                )}

                <button
                  type="button"
                  className="recent-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeRecentSearch(item.name);
                  }}
                  title="Remove from history"
                  aria-label="Remove item"
                >
                  <FaTrashCan size={13} />
                </button>

                <div className="recent-arrow">
                  <FaArrowRight size={12} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentSearches;
