import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import SearchBar from '../../components/SearchBar/SearchBar';
import WeatherAlertBanner from '../../components/WeatherAlertBanner/WeatherAlertBanner';
import CurrentWeather from '../../components/CurrentWeather/CurrentWeather';
import WeatherDetails from '../../components/WeatherDetails/WeatherDetails';
import HourlyForecast from '../../components/HourlyForecast/HourlyForecast';
import DailyForecast from '../../components/DailyForecast/DailyForecast';
import AirQualityCard from '../../components/AirQualityCard/AirQualityCard';
import LifestyleAdvisory from '../../components/LifestyleAdvisory/LifestyleAdvisory';
import WeatherRadar from '../../components/WeatherRadar/WeatherRadar';
import WeatherAIAssistant from '../../components/WeatherAI/WeatherAIAssistant';
import IndiaWeather from '../../components/IndiaWeather/IndiaWeather';
import Loading from '../../components/Loading/Loading';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import './Home.css';

const Home = () => {
  const { weatherData, loading, error, searchCity } = useWeather();

  const handleRetry = () => {
    searchCity('New Delhi');
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
          {/* Active Severe Weather Emergency Alert (if applicable) */}
          <WeatherAlertBanner weather={weatherData} />

          {/* Main Weather Card */}
          <CurrentWeather weather={weatherData} />

          {/* Interactive 24-Hour Forecast (Spline Chart & Cards) */}
          <HourlyForecast hourly={weatherData.hourly} />

          {/* Grid with 7-Day Outlook & Atmospheric Details Highlights */}
          <div className="dashboard-columns-grid">
            <div className="forecast-column">
              <DailyForecast daily={weatherData.daily} />
            </div>

            <div className="details-column">
              <WeatherDetails weather={weatherData} />
            </div>
          </div>

          {/* Air Quality Index (AQI) Meter & Health Advisory */}
          <AirQualityCard weather={weatherData} />

          {/* SkyPulse AI Meteorologist Copilot */}
          <WeatherAIAssistant weather={weatherData} />

          {/* Smart Lifestyle, Clothing & Travel Advisory */}
          <LifestyleAdvisory weather={weatherData} />

          {/* Interactive Satellite Radar & Map Screen */}
          <WeatherRadar weather={weatherData} />

          {/* Major Indian Cities Live Telemetry */}
          <IndiaWeather />
        </div>
      )}
    </div>
  );
};

export default Home;
