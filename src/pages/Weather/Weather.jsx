import React, { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useWeather } from '../../context/WeatherContext';
import SearchBar from '../../components/SearchBar/SearchBar';
import CurrentWeather from '../../components/CurrentWeather/CurrentWeather';
import WeatherDetails from '../../components/WeatherDetails/WeatherDetails';
import HourlyForecast from '../../components/HourlyForecast/HourlyForecast';
import DailyForecast from '../../components/DailyForecast/DailyForecast';
import Loading from '../../components/Loading/Loading';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import IndiaWeather from '../../components/IndiaWeather/IndiaWeather';
import '../Home/Home.css';
import './Weather.css';

const Weather = () => {
  const { city: cityParam } = useParams();
  const [searchParams] = useSearchParams();
  const queryCity = searchParams.get('city') || cityParam;

  const { weatherData, loading, error, searchCity } = useWeather();

  useEffect(() => {
    if (queryCity && (!weatherData || weatherData.location.name.toLowerCase() !== queryCity.toLowerCase())) {
      searchCity(queryCity);
    }
  }, [queryCity, searchCity, weatherData]);

  const handleRetry = () => {
    if (queryCity) {
      searchCity(queryCity);
    } else {
      searchCity('New Delhi');
    }
  };

  return (
    <div className="page-container home-page-container">
      <SearchBar />

      {loading && !weatherData && <Loading />}

      {error && !loading && (
        <ErrorMessage message={error} onRetry={handleRetry} />
      )}

      {weatherData && (
        <div className={`weather-dashboard-layout ${loading ? 'updating-overlay' : ''}`}>
          <CurrentWeather weather={weatherData} />
          <HourlyForecast hourly={weatherData.hourly} />

          <div className="dashboard-columns-grid">
            <div className="forecast-column">
              <DailyForecast daily={weatherData.daily} />
            </div>

            <div className="details-column">
              <WeatherDetails weather={weatherData} />
            </div>
          </div>

          <IndiaWeather />
        </div>
      )}
    </div>
  );
};

export default Weather;
