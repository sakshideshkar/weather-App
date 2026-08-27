import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import SearchBar from '../../components/SearchBar/SearchBar';
import CurrentWeather from '../../components/CurrentWeather/CurrentWeather';
import WeatherDetails from '../../components/WeatherDetails/WeatherDetails';
import HourlyForecast from '../../components/HourlyForecast/HourlyForecast';
import DailyForecast from '../../components/DailyForecast/DailyForecast';
import Loading from '../../components/Loading/Loading';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import IndiaWeather from '../../components/IndiaWeather/IndiaWeather';
import './Home.css';

const Home = () => {
  const { weatherData, loading, error, searchCity } = useWeather();

  const handleRetry = () => {
    searchCity('London');
  };

  return (
    <div className="page-container home-page-container">
      {/* Hero Search Section */}
      <SearchBar />

      {/* Main Content Area */}
      {loading && !weatherData && <Loading />}

      {error && !loading && (
        <ErrorMessage message={error} onRetry={handleRetry} />
      )}

      {weatherData && (
        <div className={`weather-dashboard-layout ${loading ? 'updating-overlay' : ''}`}>
          {/* Main Weather Card */}
          <CurrentWeather weather={weatherData} />

          {/* Hourly Forecast */}
          <HourlyForecast hourly={weatherData.hourly} />

          {/* Grid with 7-Day Forecast & Weather Details */}
          <div className="dashboard-columns-grid">
            <div className="forecast-column">
              <DailyForecast daily={weatherData.daily} />
            </div>

            <div className="details-column">
              <WeatherDetails weather={weatherData} />
            </div>
          </div>

          {/* Major Indian Cities Live Weather Section */}
          <IndiaWeather />
        </div>
      )}
    </div>
  );
};

export default Home;
