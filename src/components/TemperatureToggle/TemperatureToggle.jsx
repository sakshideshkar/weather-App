import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import './TemperatureToggle.css';

const TemperatureToggle = () => {
  const { unit, setUnit } = useWeather();

  return (
    <div className="temp-toggle-wrapper" id="temp-toggle-wrapper">
      <button
        type="button"
        className={`temp-toggle-btn ${unit === 'C' ? 'active' : ''}`}
        onClick={() => setUnit('C')}
        title="Display in Celsius (°C)"
        aria-label="Celsius"
        id="btn-unit-celsius"
      >
        °C
      </button>
      <button
        type="button"
        className={`temp-toggle-btn ${unit === 'F' ? 'active' : ''}`}
        onClick={() => setUnit('F')}
        title="Display in Fahrenheit (°F)"
        aria-label="Fahrenheit"
        id="btn-unit-fahrenheit"
      >
        °F
      </button>
    </div>
  );
};

export default TemperatureToggle;
