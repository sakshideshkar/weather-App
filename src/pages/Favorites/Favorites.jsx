import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeather } from '../../context/WeatherContext';
import FavoriteCities from '../../components/FavoriteCities/FavoriteCities';
import { FaHeart, FaMagnifyingGlass, FaPlus } from 'react-icons/fa6';
import './Favorites.css';

const Favorites = () => {
  const { favorites, searchCity, toggleFavorite } = useWeather();
  const [newCityInput, setNewCityInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState('');
  const navigate = useNavigate();

  const handleSelectCity = async (city) => {
    await searchCity(city.name);
    navigate('/');
  };

  const handleAddCity = async (e) => {
    e.preventDefault();
    const city = newCityInput.trim();
    if (!city) return;

    setIsAdding(true);
    setAddError('');

    try {
      const data = await searchCity(city);
      if (data) {
        toggleFavorite({
          name: data.location.name,
          country: data.location.country,
          lat: data.location.lat,
          lon: data.location.lon
        });
        setNewCityInput('');
      } else {
        setAddError(`Could not find city "${city}". Please check spelling.`);
      }
    } catch {
      setAddError(`Failed to find city "${city}".`);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="page-container favorites-page">
      <div className="page-header-wrap">
        <div className="page-title-group">
          <div className="page-icon-badge">
            <FaHeart className="page-header-icon fav-icon-color" />
          </div>
          <div>
            <h1 className="page-title">Favorite Cities</h1>
            <p className="page-subtitle">
              Monitor live forecasts, temperatures, and weather conditions across your saved destinations.
            </p>
          </div>
        </div>

        <span className="favorites-count-pill" id="favorites-total-count">
          {favorites.length} Saved {favorites.length === 1 ? 'City' : 'Cities'}
        </span>
      </div>

      {/* Add New Favorite City Form */}
      <form className="add-favorite-form glass-card" onSubmit={handleAddCity}>
        <FaMagnifyingGlass className="add-fav-search-icon" />
        <input
          type="text"
          className="add-fav-input"
          placeholder="Add a new city to your favorites (e.g. Barcelona, Rome, Seattle)..."
          value={newCityInput}
          onChange={(e) => {
            setNewCityInput(e.target.value);
            if (addError) setAddError('');
          }}
          id="input-add-favorite"
        />
        <button
          type="submit"
          className="add-fav-submit-btn"
          disabled={isAdding || !newCityInput.trim()}
          id="btn-add-favorite-submit"
        >
          <FaPlus size={13} />
          <span>{isAdding ? 'Adding...' : 'Add Favorite'}</span>
        </button>
      </form>

      {addError && (
        <div className="favorite-add-error">
          <span>{addError}</span>
        </div>
      )}

      {/* Favorite Cities Grid */}
      <FavoriteCities onSelectCity={handleSelectCity} />
    </div>
  );
};

export default Favorites;
