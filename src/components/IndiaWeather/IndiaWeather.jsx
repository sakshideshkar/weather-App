import React, { useState, useEffect } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { getWeatherIcon } from '../../utils/weatherIcons';
import { formatTemp } from '../../utils/formatters';
import { getWeatherByCoords, getWeatherByCity } from '../../services/weatherApi';
import { FaLocationDot, FaArrowUp, FaArrowDown, FaRotate } from 'react-icons/fa6';
import { WiHumidity } from 'react-icons/wi';
import './IndiaWeather.css';

const INDIA_CITIES = [
  { name: 'New Delhi', state: 'Delhi NCR', lat: 28.6139, lon: 77.2090 },
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lon: 72.8777 },
  { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lon: 77.5946 },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lon: 88.3639 },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lon: 80.2707 },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lon: 78.4867 },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lon: 75.7873 },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lon: 72.5714 },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lon: 73.8567 },
  { name: 'Chandigarh', state: 'Punjab/Haryana', lat: 30.7333, lon: 76.7794 }
];

const IndiaWeather = ({ onCitySelect }) => {
  const { unit, searchCity } = useWeather();
  const [cityDataMap, setCityDataMap] = useState({});
  const [loadingIndia, setLoadingIndia] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchIndiaWeather = async () => {
    setIsRefreshing(true);
    const results = {};

    await Promise.all(
      INDIA_CITIES.map(async (city) => {
        try {
          const res = await getWeatherByCoords(city.lat, city.lon, city.name);
          results[city.name] = {
            tempC: res.current.tempC,
            condition: res.current.condition,
            iconCode: res.current.iconCode,
            tempMinC: res.current.tempMinC,
            tempMaxC: res.current.tempMaxC,
            humidity: res.current.humidity,
            windSpeedKmh: res.current.windSpeedKmh
          };
        } catch {
          // fallback
        }
      })
    );

    setCityDataMap(results);
    setLoadingIndia(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchIndiaWeather();
  }, []);

  const handleCardClick = async (cityName) => {
    if (onCitySelect) {
      onCitySelect(cityName);
    } else {
      await searchCity(cityName);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="india-weather-section" id="india-weather-section">
      <div className="india-header-row">
        <div className="india-title-wrap">
          <span className="india-flag-badge">🇮🇳</span>
          <div>
            <h2 className="section-heading" style={{ marginBottom: 0 }}>
              Live Weather Across India
            </h2>
            <p className="india-subtitle">
              Real-time meteorological telemetry for major Indian metropolitan cities
            </p>
          </div>
        </div>

        <button
          type="button"
          className={`india-refresh-btn ${isRefreshing ? 'refreshing' : ''}`}
          onClick={fetchIndiaWeather}
          title="Refresh Live Indian Cities Weather"
          aria-label="Refresh Indian Weather"
        >
          <FaRotate className={isRefreshing ? 'animate-spin' : ''} size={13} />
          <span>Refresh Live</span>
        </button>
      </div>

      <div className="india-cities-grid">
        {INDIA_CITIES.map((city) => {
          const info = cityDataMap[city.name];

          return (
            <div
              key={city.name}
              className="india-city-card glass-card"
              onClick={() => handleCardClick(city.name)}
              role="button"
              tabIndex={0}
            >
              <div className="india-card-top">
                <div className="india-city-info">
                  <div className="india-city-name-row">
                    <FaLocationDot className="india-pin" size={12} />
                    <span className="india-city-name">{city.name}</span>
                  </div>
                  <span className="india-state-name">{city.state}</span>
                </div>

                <div className="india-icon-wrap">
                  {info ? (
                    getWeatherIcon(info.iconCode, info.condition, 36)
                  ) : (
                    <div className="india-icon-skeleton" />
                  )}
                </div>
              </div>

              <div className="india-card-bottom">
                <div className="india-temp-wrap">
                  <span className="india-temp-val">
                    {info ? formatTemp(info.tempC, unit) : '--°'}
                  </span>
                  <span className="india-condition-text">
                    {info ? info.condition : 'Loading...'}
                  </span>
                </div>

                {info && (
                  <div className="india-card-meta">
                    <div className="india-minmax-row">
                      <span className="india-high">
                        <FaArrowUp size={9} /> {formatTemp(info.tempMaxC, unit)}
                      </span>
                      <span className="india-low">
                        <FaArrowDown size={9} /> {formatTemp(info.tempMinC, unit)}
                      </span>
                    </div>
                    <div className="india-humidity-row">
                      <WiHumidity size={18} className="india-humid-icon" />
                      <span>{info.humidity}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IndiaWeather;
