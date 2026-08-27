import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getWeatherByCity,
  getWeatherByCoords
} from '../services/weatherApi';
import {
  getStoredFavorites,
  addStoredFavorite,
  removeStoredFavorite,
  isStoredFavorite,
  getStoredRecentSearches,
  addStoredRecentSearch,
  removeStoredRecentSearch,
  clearStoredRecentSearches,
  getStoredUnit,
  setStoredUnit,
  getStoredLastCity,
  setStoredLastCity
} from '../utils/storage';

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnitState] = useState(() => getStoredUnit());
  const [favorites, setFavorites] = useState(() => getStoredFavorites());
  const [recentSearches, setRecentSearches] = useState(() => getStoredRecentSearches());
  const [favoritesPreviews, setFavoritesPreviews] = useState({});
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  // Toggle or set unit
  const setUnit = (newUnit) => {
    if (newUnit === 'C' || newUnit === 'F') {
      setUnitState(newUnit);
      setStoredUnit(newUnit);
    }
  };

  const toggleUnit = () => {
    const next = unit === 'C' ? 'F' : 'C';
    setUnit(next);
  };

  // Search by city name
  const searchCity = useCallback(async (cityName, isAutoSaveHistory = true) => {
    if (!cityName || !cityName.trim()) {
      setError('Please enter a city name to search.');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getWeatherByCity(cityName);
      setWeatherData(data);
      setStoredLastCity(data.location.name);

      if (isAutoSaveHistory) {
        const updatedHistory = addStoredRecentSearch({
          name: data.location.name,
          country: data.location.country,
          tempC: data.current.tempC,
          condition: data.current.condition,
          iconCode: data.current.iconCode
        });
        setRecentSearches(updatedHistory);
      }

      setLoading(false);
      return data;
    } catch (err) {
      console.error('Search weather error:', err);
      setError(err.message || 'Unable to fetch weather data. Please try again.');
      setLoading(false);
      return null;
    }
  }, []);

  // Search by coordinates (Geolocation)
  const searchCoords = useCallback(async (lat, lon, knownName = null) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getWeatherByCoords(lat, lon, knownName);
      setWeatherData(data);
      setStoredLastCity(data.location.name);

      const updatedHistory = addStoredRecentSearch({
        name: data.location.name,
        country: data.location.country,
        tempC: data.current.tempC,
        condition: data.current.condition,
        iconCode: data.current.iconCode
      });
      setRecentSearches(updatedHistory);

      setLoading(false);
      return data;
    } catch (err) {
      console.error('Coords weather error:', err);
      setError(err.message || 'Unable to fetch weather for your location.');
      setLoading(false);
      return null;
    }
  }, []);

  // Favorites management
  const toggleFavorite = (cityData = null) => {
    const target = cityData || (weatherData ? {
      name: weatherData.location.name,
      country: weatherData.location.country,
      lat: weatherData.location.lat,
      lon: weatherData.location.lon
    } : null);

    if (!target || !target.name) return;

    if (isFavorite(target.name, target.country)) {
      const updated = removeStoredFavorite(target.name, target.country);
      setFavorites(updated);
    } else {
      const updated = addStoredFavorite(target);
      setFavorites(updated);
    }
  };

  const removeFavorite = (cityName, country) => {
    const updated = removeStoredFavorite(cityName, country);
    setFavorites(updated);
  };

  const isFavorite = (cityName, country) => {
    return isStoredFavorite(cityName, country);
  };

  // Recent Searches management
  const removeRecentSearch = (cityName) => {
    const updated = removeStoredRecentSearch(cityName);
    setRecentSearches(updated);
  };

  const clearAllSearches = () => {
    const updated = clearStoredRecentSearches();
    setRecentSearches(updated);
  };

  // Load preview data for favorite cards
  const refreshFavoritePreviews = useCallback(async () => {
    if (favorites.length === 0) return;
    setLoadingFavorites(true);

    const previews = { ...favoritesPreviews };
    for (const fav of favorites) {
      try {
        if (!previews[fav.name]) {
          const res = fav.lat && fav.lon
            ? await getWeatherByCoords(fav.lat, fav.lon, fav.name)
            : await getWeatherByCity(fav.name);
          previews[fav.name] = {
            tempC: res.current.tempC,
            condition: res.current.condition,
            iconCode: res.current.iconCode,
            tempMinC: res.current.tempMinC,
            tempMaxC: res.current.tempMaxC,
            humidity: res.current.humidity,
            windSpeedKmh: res.current.windSpeedKmh
          };
        }
      } catch (e) {
        console.warn(`Failed preview for favorite ${fav.name}:`, e);
      }
    }

    setFavoritesPreviews(previews);
    setLoadingFavorites(false);
  }, [favorites, favoritesPreviews]);

  // Initial load: fetch last searched city or default city
  useEffect(() => {
    const initialCity = getStoredLastCity() || 'London';
    searchCity(initialCity, false);
  }, [searchCity]);

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        loading,
        error,
        unit,
        favorites,
        recentSearches,
        favoritesPreviews,
        loadingFavorites,
        setUnit,
        toggleUnit,
        searchCity,
        searchCoords,
        toggleFavorite,
        removeFavorite,
        isFavorite,
        removeRecentSearch,
        clearAllSearches,
        refreshFavoritePreviews
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
