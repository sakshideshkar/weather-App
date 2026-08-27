/**
 * Temperature conversions and formatting
 */
export const celsiusToFahrenheit = (c) => {
  if (c === null || c === undefined || isNaN(c)) return 0;
  return Math.round((c * 9) / 5 + 32);
};

export const fahrenheitToCelsius = (f) => {
  if (f === null || f === undefined || isNaN(f)) return 0;
  return Math.round(((f - 32) * 5) / 9);
};

export const formatTemp = (celsius, unit = 'C') => {
  if (celsius === null || celsius === undefined || isNaN(celsius)) return '--°';
  const val = unit === 'F' ? celsiusToFahrenheit(celsius) : Math.round(celsius);
  return `${val}°${unit}`;
};

export const formatTempValue = (celsius, unit = 'C') => {
  if (celsius === null || celsius === undefined || isNaN(celsius)) return '--';
  return unit === 'F' ? celsiusToFahrenheit(celsius) : Math.round(celsius);
};

/**
 * Wind speed conversions and formatting
 */
export const formatWindSpeed = (kmh, unit = 'C') => {
  if (kmh === null || kmh === undefined || isNaN(kmh)) return '--';
  if (unit === 'F') {
    // Convert km/h to mph (1 km/h = 0.621371 mph)
    const mph = Math.round(kmh * 0.621371);
    return `${mph} mph`;
  }
  return `${Math.round(kmh)} km/h`;
};

/**
 * Wind compass direction
 */
export const getWindDirectionText = (degrees) => {
  if (degrees === undefined || degrees === null || isNaN(degrees)) return 'N/A';
  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW'
  ];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
};

/**
 * UV index details
 */
export const getUvCategory = (uvIndex) => {
  if (uvIndex === undefined || uvIndex === null || isNaN(uvIndex)) {
    return { label: 'Low', color: '#10b981', level: 'low', percent: 10 };
  }
  const uv = Number(uvIndex);
  if (uv < 3) return { label: 'Low', color: '#10b981', level: 'low', percent: Math.min(100, Math.round((uv / 12) * 100)) };
  if (uv < 6) return { label: 'Moderate', color: '#f59e0b', level: 'moderate', percent: Math.min(100, Math.round((uv / 12) * 100)) };
  if (uv < 8) return { label: 'High', color: '#f97316', level: 'high', percent: Math.min(100, Math.round((uv / 12) * 100)) };
  if (uv < 11) return { label: 'Very High', color: '#ef4444', level: 'very-high', percent: Math.min(100, Math.round((uv / 12) * 100)) };
  return { label: 'Extreme', color: '#a855f7', level: 'extreme', percent: 100 };
};

/**
 * Air Quality Index (AQI 1-5 from OpenWeather or standard)
 */
export const getAirQualityCategory = (aqi) => {
  switch (Number(aqi)) {
    case 1:
      return { label: 'Good', color: '#10b981', desc: 'Air quality is satisfactory.' };
    case 2:
      return { label: 'Fair', color: '#84cc16', desc: 'Air quality is acceptable.' };
    case 3:
      return { label: 'Moderate', color: '#f59e0b', desc: 'Sensitive groups may experience symptoms.' };
    case 4:
      return { label: 'Poor', color: '#f97316', desc: 'Unhealthy for sensitive individuals.' };
    case 5:
      return { label: 'Very Poor', color: '#ef4444', desc: 'Health warnings of emergency conditions.' };
    default:
      return { label: 'Good', color: '#10b981', desc: 'Clean air conditions.' };
  }
};

/**
 * Date and Time formatters
 */
export const formatTimeFromIsoOrTimestamp = (value, timezoneOffsetSec = 0) => {
  try {
    let date;
    if (typeof value === 'number') {
      date = new Date(value * 1000);
    } else if (typeof value === 'string') {
      date = new Date(value);
    } else {
      date = new Date();
    }

    // Apply timezone offset if supplied (in seconds)
    if (timezoneOffsetSec) {
      const utcMs = date.getTime() + date.getTimezoneOffset() * 60000;
      date = new Date(utcMs + timezoneOffsetSec * 1000);
    }

    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch {
    return '--:--';
  }
};

export const formatFullDate = (date = new Date(), timezoneOffsetSec = 0) => {
  try {
    let target = new Date(date);
    if (timezoneOffsetSec) {
      const utcMs = target.getTime() + target.getTimezoneOffset() * 60000;
      target = new Date(utcMs + timezoneOffsetSec * 1000);
    }
    return target.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return '';
  }
};

export const formatDayName = (dateStr) => {
  try {
    const d = new Date(dateStr);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Today';
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  } catch {
    return dateStr;
  }
};

export const formatShortDate = (dateStr) => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
};
