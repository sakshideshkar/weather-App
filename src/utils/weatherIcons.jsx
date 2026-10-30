import React from 'react';
import {
  WiDaySunny,
  WiNightClear,
  WiDayCloudy,
  WiNightAltCloudy,
  WiCloud,
  WiCloudy,
  WiDayRain,
  WiNightAltRain,
  WiRain,
  WiDayThunderstorm,
  WiNightAltThunderstorm,
  WiThunderstorm,
  WiDaySnow,
  WiNightAltSnow,
  WiSnow,
  WiDayFog,
  WiNightFog,
  WiFog,
  WiDayShowers,
  WiNightAltShowers
} from 'react-icons/wi';

/**
 * Maps OpenWeatherMap icon codes or condition names to vivid styled React Icons
 */
export const getWeatherIcon = (iconCode = '01d', condition = '', size = 48, className = '') => {
  const code = (iconCode || '').toLowerCase();
  const isDay = !code.endsWith('n');

  // Specific OpenWeatherMap icon mapping
  switch (code) {
    case '01d':
      return <WiDaySunny size={size} className={`weather-icon-sun ${className}`} style={{ color: '#fbbf24' }} />;
    case '01n':
      return <WiNightClear size={size} className={`weather-icon-moon ${className}`} style={{ color: '#cbd5e1' }} />;

    case '02d':
      return <WiDayCloudy size={size} className={`weather-icon-cloud-sun ${className}`} style={{ color: '#f59e0b' }} />;
    case '02n':
      return <WiNightAltCloudy size={size} className={`weather-icon-cloud-moon ${className}`} style={{ color: '#94a3b8' }} />;

    case '03d':
    case '03n':
      return <WiCloud size={size} className={`weather-icon-cloud ${className}`} style={{ color: '#94a3b8' }} />;

    case '04d':
    case '04n':
      return <WiCloudy size={size} className={`weather-icon-cloudy ${className}`} style={{ color: '#64748b' }} />;

    case '09d':
      return <WiDayShowers size={size} className={`weather-icon-rain ${className}`} style={{ color: '#38bdf8' }} />;
    case '09n':
      return <WiNightAltShowers size={size} className={`weather-icon-rain ${className}`} style={{ color: '#38bdf8' }} />;

    case '10d':
      return <WiDayRain size={size} className={`weather-icon-rain ${className}`} style={{ color: '#0ea5e9' }} />;
    case '10n':
      return <WiNightAltRain size={size} className={`weather-icon-rain ${className}`} style={{ color: '#0284c7' }} />;

    case '11d':
      return <WiDayThunderstorm size={size} className={`weather-icon-storm ${className}`} style={{ color: '#a855f7' }} />;
    case '11n':
      return <WiNightAltThunderstorm size={size} className={`weather-icon-storm ${className}`} style={{ color: '#a855f7' }} />;

    case '13d':
      return <WiDaySnow size={size} className={`weather-icon-snow ${className}`} style={{ color: '#e0f2fe' }} />;
    case '13n':
      return <WiNightAltSnow size={size} className={`weather-icon-snow ${className}`} style={{ color: '#bae6fd' }} />;

    case '50d':
      return <WiDayFog size={size} className={`weather-icon-fog ${className}`} style={{ color: '#a1a1aa' }} />;
    case '50n':
      return <WiNightFog size={size} className={`weather-icon-fog ${className}`} style={{ color: '#71717a' }} />;

    default:
      break;
  }

  // Fallback by condition text
  const cond = (condition || '').toLowerCase();
  if (cond.includes('clear') || cond.includes('sun')) {
    return isDay ? (
      <WiDaySunny size={size} className={`weather-icon-sun ${className}`} style={{ color: '#fbbf24' }} />
    ) : (
      <WiNightClear size={size} className={`weather-icon-moon ${className}`} style={{ color: '#cbd5e1' }} />
    );
  }
  if (cond.includes('thunder') || cond.includes('lightning') || cond.includes('storm')) {
    return <WiThunderstorm size={size} className={`weather-icon-storm ${className}`} style={{ color: '#a855f7' }} />;
  }
  if (cond.includes('snow') || cond.includes('blizzard') || cond.includes('flurr')) {
    return <WiSnow size={size} className={`weather-icon-snow ${className}`} style={{ color: '#e0f2fe' }} />;
  }
  if (cond.includes('rain') || cond.includes('drizzle') || cond.includes('shower')) {
    return <WiRain size={size} className={`weather-icon-rain ${className}`} style={{ color: '#38bdf8' }} />;
  }
  if (cond.includes('fog') || cond.includes('mist') || cond.includes('haze') || cond.includes('dust')) {
    return <WiFog size={size} className={`weather-icon-fog ${className}`} style={{ color: '#a1a1aa' }} />;
  }
  if (cond.includes('cloud') || cond.includes('overcast')) {
    return <WiCloudy size={size} className={`weather-icon-cloudy ${className}`} style={{ color: '#94a3b8' }} />;
  }

  return isDay ? (
    <WiDaySunny size={size} className={`weather-icon-sun ${className}`} style={{ color: '#fbbf24' }} />
  ) : (
    <WiNightClear size={size} className={`weather-icon-moon ${className}`} style={{ color: '#cbd5e1' }} />
  );
};

/**
 * Returns a dynamic background style or class based on weather condition
 */
export const getWeatherBackgroundClass = (iconCode = '01d', condition = '') => {
  const code = (iconCode || '').toLowerCase();
  const cond = (condition || '').toLowerCase();
  const isNight = code.endsWith('n');

  if (isNight) return 'weather-bg-night';
  if (code.startsWith('11') || cond.includes('thunder') || cond.includes('storm')) return 'weather-bg-thunderstorm';
  if (code.startsWith('09') || code.startsWith('10') || cond.includes('rain') || cond.includes('shower')) return 'weather-bg-rain';
  if (code.startsWith('13') || cond.includes('snow')) return 'weather-bg-snow';
  if (code.startsWith('50') || cond.includes('fog') || cond.includes('mist')) return 'weather-bg-fog';
  if (code.startsWith('03') || code.startsWith('04') || cond.includes('cloud')) return 'weather-bg-clouds';
  return 'weather-bg-clear';
};
