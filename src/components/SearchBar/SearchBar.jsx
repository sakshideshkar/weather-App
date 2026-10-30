import React, { useState, useEffect, useRef } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { useGeolocation } from '../../hooks/useGeolocation';
import { searchCitySuggestions } from '../../services/weatherApi';
import {
  FaMagnifyingGlass,
  FaLocationCrosshairs,
  FaXmark,
  FaLocationDot,
  FaMicrophone
} from 'react-icons/fa6';
import { FiLoader } from 'react-icons/fi';
import { initSpeechRecognition, cleanVoiceTranscript } from '../../utils/speechVoice';
import './SearchBar.css';

const POPULAR_CITIES = [
  'New Delhi',
  'Mumbai',
  'Bengaluru',
  'Kolkata',
  'Chennai',
  'Hyderabad',
  'Jaipur',
  'Srinagar',
  'London',
  'Tokyo',
  'New York',
  'Dubai'
];

const SearchBar = ({ onSearchSuccess }) => {
  const { searchCity, searchCoords, loading } = useWeather();
  const { getCurrentLocation, isLocating, geoError } = useGeolocation();

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const recognitionRef = useRef(null);

  const handleVoiceSearch = () => {
    if (isListeningVoice) {
      recognitionRef.current?.stop();
      setIsListeningVoice(false);
      return;
    }

    const rec = initSpeechRecognition();
    if (!rec) {
      setLocalError('Voice recognition is not supported in this browser. Please type to search.');
      return;
    }

    recognitionRef.current = rec;
    setIsListeningVoice(true);
    setLocalError('');

    rec.onresult = async (event) => {
      const speechTranscript = event.results[0]?.[0]?.transcript || '';
      const cleanedCity = cleanVoiceTranscript(speechTranscript);
      setIsListeningVoice(false);

      if (cleanedCity) {
        setQuery(cleanedCity);
        const result = await searchCity(cleanedCity);
        if (result && onSearchSuccess) {
          onSearchSuccess(result);
        }
      } else {
        setLocalError(`Could not identify city from "${speechTranscript}". Please try again.`);
      }
    };

    rec.onerror = () => {
      setIsListeningVoice(false);
      setLocalError('Microphone listening timed out. Click mic to try again.');
    };

    rec.onend = () => {
      setIsListeningVoice(false);
    };

    try {
      rec.start();
    } catch {
      setIsListeningVoice(false);
    }
  };

  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Global Keyboard Shortcut: '/' or 'Ctrl + K' to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k') || (e.metaKey && e.key === 'k')) && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounced autocomplete suggestions
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(async () => {
      setIsSearchingSuggestions(true);
      try {
        const results = await searchCitySuggestions(query);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearchingSuggestions(false);
      }
    }, 350);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [query]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const cleanQuery = query.trim();

    if (!cleanQuery) {
      setLocalError('Please enter a city name.');
      return;
    }

    setLocalError('');
    setShowSuggestions(false);

    const result = await searchCity(cleanQuery);
    if (result && onSearchSuccess) {
      onSearchSuccess(result);
    }
  };

  const handleSelectSuggestion = async (item) => {
    setQuery(`${item.name}${item.country ? `, ${item.country}` : ''}`);
    setShowSuggestions(false);
    setLocalError('');

    let result;
    if (item.lat && item.lon) {
      result = await searchCoords(item.lat, item.lon, item.name);
    } else {
      result = await searchCity(item.name);
    }

    if (result && onSearchSuccess) {
      onSearchSuccess(result);
    }
  };

  const handleQuickCityClick = async (cityName) => {
    setQuery(cityName);
    setLocalError('');
    setShowSuggestions(false);
    const result = await searchCity(cityName);
    if (result && onSearchSuccess) {
      onSearchSuccess(result);
    }
  };

  const handleCurrentLocation = async () => {
    setLocalError('');
    setShowSuggestions(false);
    try {
      const coords = await getCurrentLocation();
      const result = await searchCoords(coords.lat, coords.lon, coords.cityName);
      if (result) {
        setQuery(result.location.name);
        if (onSearchSuccess) onSearchSuccess(result);
      }
    } catch (err) {
      setLocalError(err.message || 'Unable to access your current location. Please check browser permissions or search manually.');
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setLocalError('');
    inputRef.current?.focus();
  };

  return (
    <div className="search-section" ref={searchContainerRef}>
      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-input-wrapper glass-card">
          <FaMagnifyingGlass className="search-input-icon" />

          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search city across the globe (or press '/' to focus)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (localError) setLocalError('');
            }}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            aria-label="City Search Input"
            id="search-city-input"
            autoComplete="off"
          />

          {/* Keyboard shortcut hint */}
          {!query && (
            <span className="search-shortcut-hint" onClick={() => inputRef.current?.focus()}>
              <kbd>/</kbd>
            </span>
          )}

          {isSearchingSuggestions && (
            <FiLoader className="search-spinner animate-spin" />
          )}

          {query && !isSearchingSuggestions && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={handleClear}
              title="Clear search"
              aria-label="Clear input"
              id="btn-search-clear"
            >
              <FaXmark size={14} />
            </button>
          )}

          {/* Voice Search Button */}
          <button
            type="button"
            className={`voice-search-btn ${isListeningVoice ? 'listening' : ''}`}
            onClick={handleVoiceSearch}
            title={isListeningVoice ? 'Listening... Speak city name' : 'Voice Search (Speak city name)'}
            aria-label="Voice Search"
            id="btn-voice-search"
          >
            <FaMicrophone size={14} className={isListeningVoice ? 'voice-mic-active' : ''} />
            <span className="voice-btn-text">
              {isListeningVoice ? 'Listening...' : 'Voice'}
            </span>
          </button>

          <button
            type="button"
            className={`location-btn ${isLocating ? 'locating' : ''}`}
            onClick={handleCurrentLocation}
            title="Use My Current Location"
            disabled={isLocating}
            aria-label="Use Current Location"
            id="btn-use-location"
          >
            {isLocating ? (
              <FiLoader className="animate-spin" size={16} />
            ) : (
              <FaLocationCrosshairs size={16} />
            )}
            <span className="location-btn-text">My Location</span>
          </button>

          <button
            type="submit"
            className="search-submit-btn"
            disabled={loading}
            title="Search City"
            aria-label="Search"
            id="btn-search-submit"
          >
            {loading ? <FiLoader className="animate-spin" size={16} /> : 'Search'}
          </button>
        </div>

        {/* Autocomplete Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-dropdown glass-card">
            {suggestions.map((item, idx) => (
              <button
                key={`${item.name}-${item.lat}-${idx}`}
                type="button"
                className="suggestion-item"
                onClick={() => handleSelectSuggestion(item)}
              >
                <FaLocationDot className="suggestion-icon" />
                <div className="suggestion-text">
                  <span className="suggestion-name">{item.name}</span>
                  {(item.state || item.country) && (
                    <span className="suggestion-sub">
                      {[item.state, item.country].filter(Boolean).join(', ')}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Geolocation or Local Input Error Message */}
      {(localError || geoError) && (
        <div className="search-feedback-error">
          <span>{localError || geoError}</span>
        </div>
      )}

      {/* Popular City Pills for 1-Click Exploration */}
      <div className="popular-cities-wrap">
        <span className="popular-label">Trending:</span>
        <div className="popular-cities-list">
          {POPULAR_CITIES.map((city) => (
            <button
              key={city}
              type="button"
              className={`popular-city-pill ${query.toLowerCase() === city.toLowerCase() ? 'active' : ''}`}
              onClick={() => handleQuickCityClick(city)}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
