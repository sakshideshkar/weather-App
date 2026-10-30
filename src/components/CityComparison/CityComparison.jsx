import React, { useState, useEffect } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { getWeatherByCity } from '../../services/weatherApi';
import { getWeatherIcon } from '../../utils/weatherIcons';
import { formatTemp } from '../../utils/formatters';
import {
  FaCodeCompare,
  FaArrowRightArrowLeft,
  FaLocationDot
} from 'react-icons/fa6';
import { FiLoader } from 'react-icons/fi';
import './CityComparison.css';

const PRESET_PAIRS = [
  { city1: 'New Delhi', city2: 'Mumbai' },
  { city1: 'London', city2: 'Paris' },
  { city1: 'New York', city2: 'Tokyo' },
  { city1: 'Dubai', city2: 'Singapore' },
  { city1: 'Bengaluru', city2: 'Hyderabad' }
];

const CityComparison = () => {
  const { unit } = useWeather();
  const [city1Query, setCity1Query] = useState('New Delhi');
  const [city2Query, setCity2Query] = useState('Mumbai');

  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchComparison = async (c1, c2) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const [res1, res2] = await Promise.all([
        getWeatherByCity(c1),
        getWeatherByCity(c2)
      ]);
      setData1(res1);
      setData2(res2);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to compare cities. Please check spellings.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison(city1Query, city2Query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCompareSubmit = (e) => {
    e.preventDefault();
    if (!city1Query.trim() || !city2Query.trim()) {
      setErrorMsg('Please specify both cities to compare.');
      return;
    }
    fetchComparison(city1Query.trim(), city2Query.trim());
  };

  const handleSwap = () => {
    const temp = city1Query;
    setCity1Query(city2Query);
    setCity2Query(temp);
    fetchComparison(city2Query, temp);
  };

  const handleSelectPreset = (pair) => {
    setCity1Query(pair.city1);
    setCity2Query(pair.city2);
    fetchComparison(pair.city1, pair.city2);
  };

  // Difference Calculations
  const tempDiff = data1 && data2 ? data1.current.tempC - data2.current.tempC : 0;
  const humidDiff = data1 && data2 ? data1.current.humidity - data2.current.humidity : 0;

  return (
    <div className="city-comparison-section" id="city-comparison-widget">
      {/* Search Input Bar for Dual Cities */}
      <form className="comparison-form glass-card" onSubmit={handleCompareSubmit}>
        <div className="city-input-field">
          <FaLocationDot className="input-pin" />
          <input
            type="text"
            className="comp-input"
            placeholder="City 1 (e.g. New Delhi)"
            value={city1Query}
            onChange={(e) => setCity1Query(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="swap-cities-btn"
          onClick={handleSwap}
          title="Swap Cities"
          aria-label="Swap Cities"
        >
          <FaArrowRightArrowLeft size={14} />
        </button>

        <div className="city-input-field">
          <FaLocationDot className="input-pin" />
          <input
            type="text"
            className="comp-input"
            placeholder="City 2 (e.g. Mumbai)"
            value={city2Query}
            onChange={(e) => setCity2Query(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="compare-submit-btn"
          disabled={isLoading}
        >
          {isLoading ? <FiLoader className="animate-spin" size={16} /> : <FaCodeCompare size={15} />}
          <span>Compare</span>
        </button>
      </form>

      {/* Preset Pairs */}
      <div className="comparison-presets-row">
        <span className="preset-label">Quick Duels:</span>
        <div className="preset-badges-wrap">
          {PRESET_PAIRS.map((pair) => (
            <button
              key={`${pair.city1}-${pair.city2}`}
              type="button"
              className="preset-duel-pill"
              onClick={() => handleSelectPreset(pair)}
            >
              {pair.city1} vs {pair.city2}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="comparison-error-banner">
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Comparison Cards & Verdict */}
      {data1 && data2 && (
        <div className="comparison-results-container">
          {/* Verdict Banner */}
          <div className="comparison-verdict-card glass-card">
            <span className="verdict-tag">Analysis</span>
            <p className="verdict-text">
              <strong>{data1.location.name}</strong> is{' '}
              <span className={tempDiff >= 0 ? 'text-warmer' : 'text-cooler'}>
                {Math.abs(tempDiff)}°{unit} {tempDiff >= 0 ? 'warmer' : 'cooler'}
              </span>{' '}
              than <strong>{data2.location.name}</strong>, with{' '}
              <span className={humidDiff >= 0 ? 'text-higher' : 'text-lower'}>
                {Math.abs(humidDiff)}% {humidDiff >= 0 ? 'higher' : 'lower'} humidity
              </span>.
            </p>
          </div>

          {/* Dual Side-by-Side Cards */}
          <div className="comparison-cards-grid">
            {/* Card 1 */}
            <div className="comp-city-card glass-card city-card-1">
              <div className="comp-card-top">
                <div>
                  <h3 className="comp-city-title">{data1.location.name}</h3>
                  <span className="comp-country">{data1.location.country}</span>
                </div>
                <div className="comp-icon-box">
                  {getWeatherIcon(data1.current.iconCode, data1.current.condition, 48)}
                </div>
              </div>

              <div className="comp-temp-hero">
                {formatTemp(data1.current.tempC, unit)}
              </div>
              <span className="comp-condition-label">{data1.current.condition}</span>

              <div className="comp-metrics-list">
                <div className="comp-metric-row">
                  <span className="metric-label">Feels Like</span>
                  <span className="metric-value">{formatTemp(data1.current.feelsLikeC, unit)}</span>
                </div>
                <div className="comp-metric-row">
                  <span className="metric-label">Humidity</span>
                  <span className="metric-value">{data1.current.humidity}%</span>
                </div>
                <div className="comp-metric-row">
                  <span className="metric-label">Wind Velocity</span>
                  <span className="metric-value">{data1.current.windSpeedKmh} km/h</span>
                </div>
                <div className="comp-metric-row">
                  <span className="metric-label">Atmospheric Pressure</span>
                  <span className="metric-value">{data1.current.pressureHpa} hPa</span>
                </div>
              </div>
            </div>

            {/* VS Badge in Center */}
            <div className="vs-badge-floating">VS</div>

            {/* Card 2 */}
            <div className="comp-city-card glass-card city-card-2">
              <div className="comp-card-top">
                <div>
                  <h3 className="comp-city-title">{data2.location.name}</h3>
                  <span className="comp-country">{data2.location.country}</span>
                </div>
                <div className="comp-icon-box">
                  {getWeatherIcon(data2.current.iconCode, data2.current.condition, 48)}
                </div>
              </div>

              <div className="comp-temp-hero">
                {formatTemp(data2.current.tempC, unit)}
              </div>
              <span className="comp-condition-label">{data2.current.condition}</span>

              <div className="comp-metrics-list">
                <div className="comp-metric-row">
                  <span className="metric-label">Feels Like</span>
                  <span className="metric-value">{formatTemp(data2.current.feelsLikeC, unit)}</span>
                </div>
                <div className="comp-metric-row">
                  <span className="metric-label">Humidity</span>
                  <span className="metric-value">{data2.current.humidity}%</span>
                </div>
                <div className="comp-metric-row">
                  <span className="metric-label">Wind Velocity</span>
                  <span className="metric-value">{data2.current.windSpeedKmh} km/h</span>
                </div>
                <div className="comp-metric-row">
                  <span className="metric-label">Atmospheric Pressure</span>
                  <span className="metric-value">{data2.current.pressureHpa} hPa</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comparative Bars Visualizer */}
          <div className="comparison-bars-card glass-card">
            <h4 className="bars-card-title">Comparative Metrics Breakdown</h4>

            {/* Temperature Bar */}
            <div className="comp-bar-item">
              <div className="bar-labels-row">
                <span>{data1.location.name}: {formatTemp(data1.current.tempC, unit)}</span>
                <span className="bar-title">Temperature</span>
                <span>{data2.location.name}: {formatTemp(data2.current.tempC, unit)}</span>
              </div>
              <div className="dual-progress-track">
                <div
                  className="dual-fill fill-c1"
                  style={{ width: `${Math.min(100, Math.max(10, ((data1.current.tempC + 10) / 60) * 100))}%` }}
                />
                <div
                  className="dual-fill fill-c2"
                  style={{ width: `${Math.min(100, Math.max(10, ((data2.current.tempC + 10) / 60) * 100))}%` }}
                />
              </div>
            </div>

            {/* Humidity Bar */}
            <div className="comp-bar-item">
              <div className="bar-labels-row">
                <span>{data1.location.name}: {data1.current.humidity}%</span>
                <span className="bar-title">Humidity</span>
                <span>{data2.location.name}: {data2.current.humidity}%</span>
              </div>
              <div className="dual-progress-track">
                <div
                  className="dual-fill fill-c1"
                  style={{ width: `${data1.current.humidity}%` }}
                />
                <div
                  className="dual-fill fill-c2"
                  style={{ width: `${data2.current.humidity}%` }}
                />
              </div>
            </div>

            {/* Wind Bar */}
            <div className="comp-bar-item">
              <div className="bar-labels-row">
                <span>{data1.location.name}: {data1.current.windSpeedKmh} km/h</span>
                <span className="bar-title">Wind Speed</span>
                <span>{data2.location.name}: {data2.current.windSpeedKmh} km/h</span>
              </div>
              <div className="dual-progress-track">
                <div
                  className="dual-fill fill-c1"
                  style={{ width: `${Math.min(100, (data1.current.windSpeedKmh / 80) * 100)}%` }}
                />
                <div
                  className="dual-fill fill-c2"
                  style={{ width: `${Math.min(100, (data2.current.windSpeedKmh / 80) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityComparison;
