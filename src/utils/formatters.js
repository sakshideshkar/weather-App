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

/**
 * Calculates exact astronomical Moon Phase & Illumination %
 */
export const getMoonPhase = (date = new Date()) => {
  try {
    const refDate = new Date('2024-01-11T11:57:00Z').getTime();
    const currentMs = new Date(date).getTime();
    const synodicMonth = 29.53058867 * 24 * 60 * 60 * 1000;
    const phase = ((currentMs - refDate) % synodicMonth) / synodicMonth;
    const normalizedPhase = phase < 0 ? phase + 1 : phase;
    const illumination = Math.round((0.5 * (1 - Math.cos(normalizedPhase * 2 * Math.PI))) * 100);

    let name = 'New Moon';
    let icon = '🌑';
    if (normalizedPhase < 0.03 || normalizedPhase >= 0.97) {
      name = 'New Moon';
      icon = '🌑';
    } else if (normalizedPhase < 0.22) {
      name = 'Waxing Crescent';
      icon = '🌒';
    } else if (normalizedPhase < 0.28) {
      name = 'First Quarter';
      icon = '🌓';
    } else if (normalizedPhase < 0.47) {
      name = 'Waxing Gibbous';
      icon = '🌔';
    } else if (normalizedPhase < 0.53) {
      name = 'Full Moon';
      icon = '🌕';
    } else if (normalizedPhase < 0.72) {
      name = 'Waning Gibbous';
      icon = '🌖';
    } else if (normalizedPhase < 0.78) {
      name = 'Last Quarter';
      icon = '🌗';
    } else {
      name = 'Waning Crescent';
      icon = '🌘';
    }

    return {
      phase: normalizedPhase,
      name,
      icon,
      illumination
    };
  } catch {
    return { phase: 0.5, name: 'Full Moon', icon: '🌕', illumination: 100 };
  }
};

/**
 * Calculates Beaufort Wind Scale level & real world description
 */
export const getBeaufortScale = (kmh) => {
  const speed = Number(kmh) || 0;
  if (speed < 1) return { number: 0, label: 'Calm', desc: 'Smoke rises vertically; calm waters.' };
  if (speed <= 5) return { number: 1, label: 'Light Air', desc: 'Smoke drift indicates wind direction.' };
  if (speed <= 11) return { number: 2, label: 'Light Breeze', desc: 'Wind felt on face; leaves rustle.' };
  if (speed <= 19) return { number: 3, label: 'Gentle Breeze', desc: 'Leaves and small twigs in constant motion.' };
  if (speed <= 28) return { number: 4, label: 'Moderate Breeze', desc: 'Dust raised; small branches move.' };
  if (speed <= 38) return { number: 5, label: 'Fresh Breeze', desc: 'Small trees in leaf begin to sway.' };
  if (speed <= 49) return { number: 6, label: 'Strong Breeze', desc: 'Large branches in motion; wires whistle.' };
  if (speed <= 61) return { number: 7, label: 'Moderate Gale', desc: 'Whole trees in motion; walking resisted.' };
  if (speed <= 74) return { number: 8, label: 'Fresh Gale', desc: 'Twigs break off trees; impeded progress.' };
  return { number: 9, label: 'Strong Gale / Storm', desc: 'Structural hazard; branches snap.' };
};

/**
 * Accurate Dew Point calculation via Magnus-Tetens formula
 */
export const calculateDewPoint = (tempC, humidity) => {
  if (tempC === undefined || humidity === undefined) return 0;
  const t = Number(tempC);
  const rh = Math.max(1, Math.min(100, Number(humidity)));
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * t) / (b + t)) + Math.log(rh / 100);
  const dewPoint = (b * alpha) / (a - alpha);
  return Math.round(dewPoint);
};

/**
 * Calculates total daylight hours & minutes between sunrise and sunset
 */
export const calculateDaylightDuration = (sunriseIso, sunsetIso) => {
  try {
    if (!sunriseIso || !sunsetIso) return '-- hrs';
    const rise = new Date(sunriseIso).getTime();
    const set = new Date(sunsetIso).getTime();
    if (set <= rise) return '-- hrs';
    const diffMs = set - rise;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
  } catch {
    return '-- hrs';
  }
};
