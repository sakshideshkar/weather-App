import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeather } from '../../context/WeatherContext';
import WeatherCard from '../WeatherCard/WeatherCard';
import { FaHeart, FaPlus } from 'react-icons/fa6';
import './FavoriteCities.css';

const DEFAULT_POPULAR_SUGGESTIONS = [
  { name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503 },
  { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 },
  { name: 'New York', country: 'US', lat: 40.7128, lon: -74.0060 },
  { name: 'Paris', country: 'FR', lat: 48.8566, lon: 2.3522 },
  { name: 'Sydney', country: 'AU', lat: -33.8688, lon: 151.2093 },
  { name: 'Dubai', country: 'AE', lat: 25.2048, lon: 55.2708 }
];

const FavoriteCities = ({ onSelectCity }) => {
  const {
    favorites,
    favoritesPreviews,
    refreshFavoritePreviews,
    removeFavorite,
    searchCity,
    toggleFavorite
  } = useWeather();

  const navigate = useNavigate();

  useEffect(() => {
    refreshFavoritePreviews();
  }, [favorites, refreshFavoritePreviews]);

  const handleSelect = async (city) => {
    if (onSelectCity) {
      onSelectCity(city);
    } else {
      await searchCity(city.name);
      navigate('/');
    }
  };

  const handleAddSuggestion = (city) => {
    toggleFavorite(city);
  };

  return (
    <div className="favorites-container">
      {favorites.length === 0 ? (
        <div className="favorites-empty-state glass-card">
          <div className="empty-icon-wrap">
            <FaHeart size={36} className="empty-heart-icon" />
          </div>
          <h3 className="empty-title">No Favorite Cities Added Yet</h3>
          <p className="empty-subtitle">
            Keep track of weather in your favorite destinations by clicking the heart icon on any city forecast, or choose from popular suggestions below:
          </p>

          <div className="suggestions-grid">
            {DEFAULT_POPULAR_SUGGESTIONS.map((city) => (
              <button
                key={city.name}
                type="button"
                className="add-suggestion-btn glass-card"
                onClick={() => handleAddSuggestion(city)}
              >
                <FaPlus size={12} className="plus-icon" />
                <span>{city.name}, {city.country}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((fav) => (
            <WeatherCard
              key={`${fav.name}-${fav.country}`}
              city={fav}
              weatherInfo={favoritesPreviews[fav.name]}
              onSelect={handleSelect}
              onRemove={removeFavorite}
              showRemove={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteCities;
