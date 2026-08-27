import { useWeather as useWeatherContext } from '../context/WeatherContext';

/**
 * Custom hook to consume Weather Context
 */
export const useWeather = () => {
  return useWeatherContext();
};

export default useWeather;
