import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeather } from '../../context/WeatherContext';
import RecentSearches from '../../components/RecentSearches/RecentSearches';
import { FaClockRotateLeft } from 'react-icons/fa6';
import './SearchHistory.css';

const SearchHistory = () => {
  const { recentSearches, searchCity } = useWeather();
  const navigate = useNavigate();

  const handleSelectCity = async (item) => {
    await searchCity(item.name);
    navigate('/');
  };

  return (
    <div className="page-container search-history-page">
      <div className="page-header-wrap">
        <div className="page-title-group">
          <div className="page-icon-badge history-icon-badge">
            <FaClockRotateLeft className="page-header-icon history-icon-color" />
          </div>
          <div>
            <h1 className="page-title">Search History</h1>
            <p className="page-subtitle">
              Review your previous location searches and quickly revisit real-time weather reports.
            </p>
          </div>
        </div>

        <span className="history-count-pill" id="history-total-count">
          {recentSearches.length} {recentSearches.length === 1 ? 'Search' : 'Searches'} Recorded
        </span>
      </div>

      <RecentSearches onSelectCity={handleSelectCity} />
    </div>
  );
};

export default SearchHistory;
