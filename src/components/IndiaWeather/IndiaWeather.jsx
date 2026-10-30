import React, { useState, useEffect, useMemo } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { getWeatherIcon } from '../../utils/weatherIcons';
import { formatTemp } from '../../utils/formatters';
import { getWeatherByCoords } from '../../services/weatherApi';
import {
  FaLocationDot,
  FaArrowUp,
  FaArrowDown,
  FaRotate,
  FaMagnifyingGlass
} from 'react-icons/fa6';
import { WiHumidity } from 'react-icons/wi';
import './IndiaWeather.css';

const INDIA_REGIONS = [
  { id: 'all', label: 'All Cities' },
  { id: 'metro', label: '⭐ Top Metros' },
  { id: 'hill', label: '🏔️ Hill Stations' },
  { id: 'north', label: 'North India' },
  { id: 'south', label: 'South India' },
  { id: 'west', label: 'West India' },
  { id: 'east', label: 'East India' }
];

const INDIA_CITIES = [
  // Metros
  { name: 'New Delhi', state: 'Delhi NCR', region: 'metro', lat: 28.6139, lon: 77.2090 },
  { name: 'Mumbai', state: 'Maharashtra', region: 'metro', lat: 19.0760, lon: 72.8777 },
  { name: 'Bengaluru', state: 'Karnataka', region: 'metro', lat: 12.9716, lon: 77.5946 },
  { name: 'Kolkata', state: 'West Bengal', region: 'metro', lat: 22.5726, lon: 88.3639 },
  { name: 'Chennai', state: 'Tamil Nadu', region: 'metro', lat: 13.0827, lon: 80.2707 },
  { name: 'Hyderabad', state: 'Telangana', region: 'metro', lat: 17.3850, lon: 78.4867 },

  // Hill Stations
  { name: 'Srinagar', state: 'Jammu & Kashmir', region: 'hill', lat: 34.0837, lon: 74.7973 },
  { name: 'Shimla', state: 'Himachal Pradesh', region: 'hill', lat: 31.1048, lon: 77.1734 },
  { name: 'Manali', state: 'Himachal Pradesh', region: 'hill', lat: 32.2396, lon: 77.1887 },
  { name: 'Ooty', state: 'Tamil Nadu', region: 'hill', lat: 11.4102, lon: 76.6950 },
  { name: 'Darjeeling', state: 'West Bengal', region: 'hill', lat: 27.0410, lon: 88.2663 },
  { name: 'Gangtok', state: 'Sikkim', region: 'hill', lat: 27.3389, lon: 88.6065 },

  // North
  { name: 'Jaipur', state: 'Rajasthan', region: 'north', lat: 26.9124, lon: 75.7873 },
  { name: 'Chandigarh', state: 'Punjab/Haryana', region: 'north', lat: 30.7333, lon: 76.7794 },
  { name: 'Lucknow', state: 'Uttar Pradesh', region: 'north', lat: 26.8467, lon: 80.9462 },
  { name: 'Amritsar', state: 'Punjab', region: 'north', lat: 31.6340, lon: 74.8723 },
  { name: 'Dehradun', state: 'Uttarakhand', region: 'north', lat: 30.3165, lon: 78.0322 },

  // South
  { name: 'Kochi', state: 'Kerala', region: 'south', lat: 9.9312, lon: 76.2673 },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', region: 'south', lat: 17.6868, lon: 83.2185 },
  { name: 'Mysuru', state: 'Karnataka', region: 'south', lat: 12.2958, lon: 76.6394 },
  { name: 'Goa', state: 'Goa', region: 'south', lat: 15.2993, lon: 74.1240 },

  // West
  { name: 'Ahmedabad', state: 'Gujarat', region: 'west', lat: 23.0225, lon: 72.5714 },
  { name: 'Pune', state: 'Maharashtra', region: 'west', lat: 18.5204, lon: 73.8567 },
  { name: 'Indore', state: 'Madhya Pradesh', region: 'west', lat: 22.7196, lon: 75.8577 },

  // East
  { name: 'Bhubaneswar', state: 'Odisha', region: 'east', lat: 20.2961, lon: 85.8245 },
  { name: 'Guwahati', state: 'Assam', region: 'east', lat: 26.1445, lon: 91.7362 },
  { name: 'Patna', state: 'Bihar', region: 'east', lat: 25.5941, lon: 85.1376 }
];

const IndiaWeather = ({ onCitySelect }) => {
  const { unit, searchCity } = useWeather();
  const [cityDataMap, setCityDataMap] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [sortBy, setSortBy] = useState('default'); // 'default', 'temp-desc', 'temp-asc', 'alpha'

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

  // Filtered and Sorted Cities
  const displayedCities = useMemo(() => {
    let list = INDIA_CITIES;

    // Region filter
    if (selectedRegion !== 'all') {
      list = list.filter((c) => c.region === selectedRegion);
    }

    // Search query filter
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase().trim();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'temp-desc') {
      list = [...list].sort((a, b) => {
        const tA = cityDataMap[a.name]?.tempC ?? -999;
        const tB = cityDataMap[b.name]?.tempC ?? -999;
        return tB - tA;
      });
    } else if (sortBy === 'temp-asc') {
      list = [...list].sort((a, b) => {
        const tA = cityDataMap[a.name]?.tempC ?? 999;
        const tB = cityDataMap[b.name]?.tempC ?? 999;
        return tA - tB;
      });
    } else if (sortBy === 'alpha') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [selectedRegion, searchFilter, sortBy, cityDataMap]);

  return (
    <div className="india-weather-section" id="india-weather-section">
      {/* Header */}
      <div className="india-header-row">
        <div className="india-title-wrap">
          <span className="india-flag-badge">🇮🇳</span>
          <div>
            <h2 className="section-heading" style={{ marginBottom: 0 }}>
              Live Weather Across India
            </h2>
            <p className="india-subtitle">
              Real-time meteorological telemetry across 25+ major Indian cities & hill stations
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

      {/* Region Filter Tabs & Quick Search */}
      <div className="india-toolbar-row">
        <div className="india-region-tabs">
          {INDIA_REGIONS.map((reg) => (
            <button
              key={reg.id}
              type="button"
              className={`region-tab-btn ${selectedRegion === reg.id ? 'active' : ''}`}
              onClick={() => setSelectedRegion(reg.id)}
            >
              {reg.label}
            </button>
          ))}
        </div>

        <div className="india-search-sort-group">
          {/* Quick city search */}
          <div className="india-search-box">
            <FaMagnifyingGlass size={12} className="india-search-icon" />
            <input
              type="text"
              placeholder="Filter cities..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="india-search-input"
            />
          </div>

          {/* Sort dropdown */}
          <select
            className="india-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort cities"
          >
            <option value="default">Default Order</option>
            <option value="temp-desc">🔥 Highest Temp</option>
            <option value="temp-asc">❄️ Lowest Temp</option>
            <option value="alpha">A-Z Name</option>
          </select>
        </div>
      </div>

      {/* Cities Grid */}
      <div className="india-cities-grid">
        {displayedCities.map((city) => {
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
