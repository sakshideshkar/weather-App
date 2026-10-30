/**
 * Weather API Service
 * Supports OpenWeatherMap with automatic zero-config Open-Meteo fallback
 */

import {
  calculateDewPoint,
  getMoonPhase,
  getBeaufortScale,
  calculateDaylightDuration
} from '../utils/formatters';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY?.trim();
const OWM_BASE = 'https://api.openweathermap.org';
const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1';
const OPEN_METEO_GEO = 'https://geocoding-api.open-meteo.com/v1';

/**
 * WMO Weather Code to OpenWeather-style icon & description
 */
const WMO_CODE_MAP = {
  0: { condition: 'Clear sky', icon: '01d', iconNight: '01n' },
  1: { condition: 'Mainly clear', icon: '02d', iconNight: '02n' },
  2: { condition: 'Partly cloudy', icon: '02d', iconNight: '02n' },
  3: { condition: 'Overcast', icon: '04d', iconNight: '04n' },
  45: { condition: 'Foggy', icon: '50d', iconNight: '50n' },
  48: { condition: 'Depositing rime fog', icon: '50d', iconNight: '50n' },
  51: { condition: 'Light drizzle', icon: '09d', iconNight: '09n' },
  53: { condition: 'Moderate drizzle', icon: '09d', iconNight: '09n' },
  55: { condition: 'Dense drizzle', icon: '09d', iconNight: '09n' },
  56: { condition: 'Freezing drizzle', icon: '09d', iconNight: '09n' },
  57: { condition: 'Dense freezing drizzle', icon: '09d', iconNight: '09n' },
  61: { condition: 'Slight rain', icon: '10d', iconNight: '10n' },
  63: { condition: 'Moderate rain', icon: '10d', iconNight: '10n' },
  65: { condition: 'Heavy rain', icon: '10d', iconNight: '10n' },
  66: { condition: 'Freezing rain', icon: '13d', iconNight: '13n' },
  67: { condition: 'Heavy freezing rain', icon: '13d', iconNight: '13n' },
  71: { condition: 'Slight snow fall', icon: '13d', iconNight: '13n' },
  73: { condition: 'Moderate snow fall', icon: '13d', iconNight: '13n' },
  75: { condition: 'Heavy snow fall', icon: '13d', iconNight: '13n' },
  77: { condition: 'Snow grains', icon: '13d', iconNight: '13n' },
  80: { condition: 'Slight rain showers', icon: '09d', iconNight: '09n' },
  81: { condition: 'Moderate rain showers', icon: '09d', iconNight: '09n' },
  82: { condition: 'Violent rain showers', icon: '09d', iconNight: '09n' },
  85: { condition: 'Slight snow showers', icon: '13d', iconNight: '13n' },
  86: { condition: 'Heavy snow showers', icon: '13d', iconNight: '13n' },
  95: { condition: 'Thunderstorm', icon: '11d', iconNight: '11n' },
  96: { condition: 'Thunderstorm with slight hail', icon: '11d', iconNight: '11n' },
  99: { condition: 'Thunderstorm with heavy hail', icon: '11d', iconNight: '11n' }
};

const getWmoMeta = (code, isDay = 1) => {
  const meta = WMO_CODE_MAP[code] || { condition: 'Partly cloudy', icon: '02d', iconNight: '02n' };
  return {
    condition: meta.condition,
    iconCode: isDay ? meta.icon : meta.iconNight
  };
};

/* ==========================================================================
   Open-Meteo Implementation (Primary fallback & zero-key provider)
   ========================================================================== */

const fetchOpenMeteoGeocoding = async (query) => {
  const res = await fetch(`${OPEN_METEO_GEO}/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
  if (!res.ok) throw new Error('Geocoding search failed');
  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    throw new Error(`City "${query}" not found. Please verify the spelling.`);
  }
  return data.results[0]; // best match
};

const fetchOpenMeteoReverseGeocoding = async (lat, lon) => {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`, {
      headers: { 'User-Agent': 'SkyPulseWeatherApp/1.0' }
    });
    if (res.ok) {
      const data = await res.json();
      const name = data.address?.city || data.address?.town || data.address?.village || data.address?.county || 'Your Location';
      const country = data.address?.country_code ? data.address.country_code.toUpperCase() : (data.address?.country || '');
      return { name, country, state: data.address?.state || '' };
    }
  } catch {
    // fallback
  }
  return { name: 'Current Location', country: '', state: '' };
};

const fetchOpenMeteoAirQuality = async (lat, lon) => {
  try {
    const res = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`);
    if (res.ok) {
      const data = await res.json();
      const curr = data.current || {};
      return {
        aqi: Math.round(curr.us_aqi || 42),
        pollutants: {
          pm25: Math.round(curr.pm2_5 || 15),
          pm10: Math.round(curr.pm10 || 28),
          o3: Math.round(curr.ozone || 45),
          no2: Math.round(curr.nitrogen_dioxide || 20),
          so2: Math.round(curr.sulphur_dioxide || 6),
          co: Math.round(curr.carbon_monoxide || 360)
        }
      };
    }
  } catch {
    // fallback
  }
  return {
    aqi: 45,
    pollutants: {
      pm25: 18,
      pm10: 32,
      o3: 42,
      no2: 20,
      so2: 7,
      co: 380
    }
  };
};

const fetchOpenMeteoWeather = async (lat, lon, locationInfo = {}) => {
  const url = `${OPEN_METEO_BASE}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,cloud_cover&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max&timezone=auto`;

  const [res, aqiInfo] = await Promise.all([
    fetch(url),
    fetchOpenMeteoAirQuality(lat, lon)
  ]);

  if (!res.ok) throw new Error('Failed to fetch weather data from service.');
  const data = await res.json();

  const current = data.current || {};
  const daily = data.daily || {};
  const hourly = data.hourly || {};

  const currentMeta = getWmoMeta(current.weather_code, current.is_day);

  // Parse Hourly Forecast (Next 24 hours)
  const now = new Date();
  const currentHourIso = now.toISOString().slice(0, 13);
  let startIndex = 0;
  if (hourly.time && hourly.time.length > 0) {
    const found = hourly.time.findIndex((t) => t.startsWith(currentHourIso));
    startIndex = found >= 0 ? found : 0;
  }

  const hourlyForecast = (hourly.time || [])
    .slice(startIndex, startIndex + 24)
    .map((timeStr, idx) => {
      const actualIdx = startIndex + idx;
      const hourDate = new Date(timeStr);
      const isDayHour = hourDate.getHours() >= 6 && hourDate.getHours() < 20 ? 1 : 0;
      const meta = getWmoMeta(hourly.weather_code[actualIdx], isDayHour);
      return {
        time: timeStr,
        hourStr: hourDate.toLocaleTimeString([], { hour: 'numeric', hour12: true }),
        tempC: Math.round(hourly.temperature_2m[actualIdx] ?? 0),
        condition: meta.condition,
        iconCode: meta.iconCode,
        pop: Math.round(hourly.precipitation_probability ? hourly.precipitation_probability[actualIdx] ?? 0 : 0),
        humidity: hourly.relative_humidity_2m ? hourly.relative_humidity_2m[actualIdx] : 0,
        windKmh: Math.round(hourly.wind_speed_10m ? hourly.wind_speed_10m[actualIdx] : 0)
      };
    });

  // Parse 7-day Daily Forecast
  const dailyForecast = (daily.time || []).slice(0, 7).map((dayStr, idx) => {
    const meta = getWmoMeta(daily.weather_code[idx], 1);
    const dayDate = new Date(dayStr);
    return {
      date: dayStr,
      dayName: idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : dayDate.toLocaleDateString('en-US', { weekday: 'short' }),
      dateStr: dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      tempMinC: Math.round(daily.temperature_2m_min[idx] ?? 0),
      tempMaxC: Math.round(daily.temperature_2m_max[idx] ?? 0),
      condition: meta.condition,
      iconCode: meta.iconCode,
      pop: Math.round(daily.precipitation_probability_max ? daily.precipitation_probability_max[idx] ?? 0 : 0),
      uvIndex: Math.round(daily.uv_index_max ? daily.uv_index_max[idx] ?? 0 : 0),
      sunrise: daily.sunrise ? daily.sunrise[idx] : '',
      sunset: daily.sunset ? daily.sunset[idx] : ''
    };
  });

  return {
    source: 'open-meteo',
    location: {
      name: locationInfo.name || 'Unknown',
      country: locationInfo.country || '',
      state: locationInfo.state || '',
      lat: Number(lat),
      lon: Number(lon),
      timezone: data.timezone || 'auto',
      timezoneOffsetSec: data.utc_offset_seconds || 0,
      sunrise: daily.sunrise?.[0] || '',
      sunset: daily.sunset?.[0] || ''
    },
    current: {
      tempC: Math.round(current.temperature_2m ?? 0),
      feelsLikeC: Math.round(current.apparent_temperature ?? current.temperature_2m ?? 0),
      tempMinC: dailyForecast[0] ? dailyForecast[0].tempMinC : Math.round(current.temperature_2m ?? 0),
      tempMaxC: dailyForecast[0] ? dailyForecast[0].tempMaxC : Math.round(current.temperature_2m ?? 0),
      condition: currentMeta.condition,
      description: currentMeta.condition,
      iconCode: currentMeta.iconCode,
      humidity: current.relative_humidity_2m ?? 50,
      dewPointC: calculateDewPoint(current.temperature_2m ?? 0, current.relative_humidity_2m ?? 50),
      windSpeedKmh: Math.round(current.wind_speed_10m ?? 0),
      windGustsKmh: Math.round(current.wind_gusts_10m ?? ((current.wind_speed_10m || 10) * 1.35)),
      windDirection: current.wind_direction_10m ?? 0,
      beaufort: getBeaufortScale(current.wind_speed_10m ?? 0),
      cloudCover: Math.round(current.cloud_cover ?? 30),
      pressureHpa: Math.round(current.surface_pressure ?? 1013),
      visibilityKm: 10,
      uvIndex: dailyForecast[0] ? dailyForecast[0].uvIndex : 3,
      airQuality: aqiInfo?.aqi || 42,
      pollutants: aqiInfo?.pollutants || {
        pm25: 18,
        pm10: 32,
        o3: 42,
        no2: 20,
        so2: 7,
        co: 380
      },
      moonPhase: getMoonPhase(new Date()),
      daylightDuration: calculateDaylightDuration(daily.sunrise?.[0], daily.sunset?.[0]),
      isDay: Boolean(current.is_day)
    },
    hourly: hourlyForecast,
    daily: dailyForecast
  };
};

/* ==========================================================================
   OpenWeatherMap Implementation
   ========================================================================== */

const fetchOpenWeatherMapData = async (lat, lon, locationInfo = {}) => {
  if (!API_KEY) throw new Error('No OpenWeatherMap API key configured');

  // Fetch current weather, 5-day forecast, and air pollution in parallel
  const [currRes, forecastRes, aqiRes] = await Promise.all([
    fetch(`${OWM_BASE}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
    fetch(`${OWM_BASE}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
    fetch(`${OWM_BASE}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`).catch(() => null)
  ]);

  if (!currRes.ok) {
    if (currRes.status === 401) {
      throw new Error('Invalid OpenWeatherMap API key. Falling back to Open-Meteo...');
    }
    throw new Error('Failed to fetch OpenWeatherMap current weather');
  }

  const currData = await currRes.json();
  const forecastData = forecastRes.ok ? await forecastRes.json() : null;
  const aqiData = aqiRes && aqiRes.ok ? await aqiRes.json() : null;

  // Process Hourly Forecast from 3-hour list
  const hourly = (forecastData?.list || []).slice(0, 8).map((item) => {
    const itemDate = new Date(item.dt * 1000);
    return {
      time: item.dt_txt || itemDate.toISOString(),
      hourStr: itemDate.toLocaleTimeString([], { hour: 'numeric', hour12: true }),
      tempC: Math.round(item.main.temp),
      condition: item.weather[0]?.main || 'Clear',
      iconCode: item.weather[0]?.icon || '01d',
      pop: Math.round((item.pop || 0) * 100),
      humidity: item.main.humidity,
      windKmh: Math.round((item.wind.speed || 0) * 3.6)
    };
  });

  // Process 5-day Daily Forecast by grouping days
  const dailyMap = {};
  (forecastData?.list || []).forEach((item) => {
    const dateStr = item.dt_txt ? item.dt_txt.split(' ')[0] : new Date(item.dt * 1000).toISOString().split('T')[0];
    if (!dailyMap[dateStr]) {
      dailyMap[dateStr] = {
        date: dateStr,
        tempMins: [],
        tempMaxs: [],
        weatherCounts: {},
        icons: [],
        pops: []
      };
    }
    dailyMap[dateStr].tempMins.push(item.main.temp_min);
    dailyMap[dateStr].tempMaxs.push(item.main.temp_max);
    dailyMap[dateStr].pops.push(item.pop || 0);

    const icon = item.weather[0]?.icon || '01d';
    const main = item.weather[0]?.main || 'Clear';
    dailyMap[dateStr].weatherCounts[main] = (dailyMap[dateStr].weatherCounts[main] || 0) + 1;
    dailyMap[dateStr].icons.push(icon);
  });

  const daily = Object.values(dailyMap).slice(0, 6).map((d, idx) => {
    const dayDate = new Date(d.date);
    const dominantCondition = Object.keys(d.weatherCounts).reduce((a, b) => (d.weatherCounts[a] > d.weatherCounts[b] ? a : b), 'Clear');
    const midIcon = d.icons[Math.floor(d.icons.length / 2)] || '01d';
    const maxPop = Math.max(...d.pops, 0);

    return {
      date: d.date,
      dayName: idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : dayDate.toLocaleDateString('en-US', { weekday: 'short' }),
      dateStr: dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      tempMinC: Math.round(Math.min(...d.tempMins)),
      tempMaxC: Math.round(Math.max(...d.tempMaxs)),
      condition: dominantCondition,
      iconCode: midIcon.replace('n', 'd'), // display day icon for daily view
      pop: Math.round(maxPop * 100),
      uvIndex: 4,
      sunrise: currData.sys?.sunrise ? new Date(currData.sys.sunrise * 1000).toISOString() : '',
      sunset: currData.sys?.sunset ? new Date(currData.sys.sunset * 1000).toISOString() : ''
    };
  });

  const aqiVal = aqiData?.list?.[0]?.main?.aqi || 1;
  const rawComponents = aqiData?.list?.[0]?.components || {};
  const pollutants = {
    pm25: Math.round(rawComponents.pm2_5 || 18),
    pm10: Math.round(rawComponents.pm10 || 32),
    o3: Math.round(rawComponents.o3 || 42),
    no2: Math.round(rawComponents.no2 || 20),
    so2: Math.round(rawComponents.so2 || 7),
    co: Math.round(rawComponents.co || 380)
  };

  return {
    source: 'openweathermap',
    location: {
      name: locationInfo.name || currData.name || 'Unknown',
      country: locationInfo.country || currData.sys?.country || '',
      state: locationInfo.state || '',
      lat: Number(lat),
      lon: Number(lon),
      timezone: 'UTC',
      timezoneOffsetSec: currData.timezone || 0,
      sunrise: currData.sys?.sunrise ? new Date(currData.sys.sunrise * 1000).toISOString() : '',
      sunset: currData.sys?.sunset ? new Date(currData.sys.sunset * 1000).toISOString() : ''
    },
    current: {
      tempC: Math.round(currData.main.temp),
      feelsLikeC: Math.round(currData.main.feels_like),
      tempMinC: Math.round(currData.main.temp_min),
      tempMaxC: Math.round(currData.main.temp_max),
      condition: currData.weather[0]?.main || 'Clear',
      description: currData.weather[0]?.description || 'Clear sky',
      iconCode: currData.weather[0]?.icon || '01d',
      humidity: currData.main.humidity,
      dewPointC: calculateDewPoint(currData.main.temp, currData.main.humidity),
      windSpeedKmh: Math.round((currData.wind?.speed || 0) * 3.6),
      windGustsKmh: Math.round((currData.wind?.gust || (currData.wind?.speed || 0) * 1.35) * 3.6),
      windDirection: currData.wind?.deg || 0,
      beaufort: getBeaufortScale((currData.wind?.speed || 0) * 3.6),
      cloudCover: currData.clouds?.all ?? 20,
      pressureHpa: currData.main.pressure,
      visibilityKm: Math.round((currData.visibility || 10000) / 1000),
      uvIndex: 4,
      airQuality: aqiVal,
      pollutants,
      moonPhase: getMoonPhase(new Date()),
      daylightDuration: calculateDaylightDuration(
        currData.sys?.sunrise ? new Date(currData.sys.sunrise * 1000).toISOString() : '',
        currData.sys?.sunset ? new Date(currData.sys.sunset * 1000).toISOString() : ''
      ),
      isDay: currData.weather[0]?.icon?.endsWith('d') ?? true
    },
    hourly,
    daily
  };
};

/* ==========================================================================
   Public API Functions
   ========================================================================== */

/**
 * Fetch complete weather details by city name
 */
export const getWeatherByCity = async (cityName) => {
  if (!cityName || !cityName.trim()) {
    throw new Error('Please enter a valid city name.');
  }

  const query = cityName.trim();

  // Try OpenWeatherMap Geocoding if API key is present
  if (API_KEY) {
    try {
      const geoRes = await fetch(`${OWM_BASE}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${API_KEY}`);
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData && geoData.length > 0) {
          const loc = geoData[0];
          return await fetchOpenWeatherMapData(loc.lat, loc.lon, {
            name: loc.name,
            country: loc.country,
            state: loc.state
          });
        }
      }
    } catch (err) {
      console.warn('OpenWeatherMap geocoding failed, falling back to Open-Meteo:', err.message);
    }
  }

  // Primary or Fallback Open-Meteo flow
  const geoResult = await fetchOpenMeteoGeocoding(query);
  return await fetchOpenMeteoWeather(geoResult.latitude, geoResult.longitude, {
    name: geoResult.name,
    country: geoResult.country_code ? geoResult.country_code.toUpperCase() : (geoResult.country || ''),
    state: geoResult.admin1 || ''
  });
};

/**
 * Fetch complete weather details by coordinates
 */
export const getWeatherByCoords = async (lat, lon, knownName = null) => {
  if (lat === undefined || lon === undefined) {
    throw new Error('Coordinates are required.');
  }

  let locationInfo = { name: knownName || 'Current Location', country: '', state: '' };

  if (!knownName) {
    locationInfo = await fetchOpenMeteoReverseGeocoding(lat, lon);
  }

  if (API_KEY) {
    try {
      return await fetchOpenWeatherMapData(lat, lon, locationInfo);
    } catch (err) {
      console.warn('OpenWeatherMap fetch failed for coords, falling back to Open-Meteo:', err.message);
    }
  }

  return await fetchOpenMeteoWeather(lat, lon, locationInfo);
};

/**
 * Search city suggestions for autocomplete
 */
export const searchCitySuggestions = async (query) => {
  if (!query || query.trim().length < 2) return [];

  const q = query.trim();

  if (API_KEY) {
    try {
      const res = await fetch(`${OWM_BASE}/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=5&appid=${API_KEY}`);
      if (res.ok) {
        const data = await res.json();
        return data.map((item) => ({
          name: item.name,
          country: item.country,
          state: item.state || '',
          lat: item.lat,
          lon: item.lon
        }));
      }
    } catch {
      // fallback
    }
  }

  try {
    const res = await fetch(`${OPEN_METEO_GEO}/search?name=${encodeURIComponent(q)}&count=5&language=en&format=json`);
    if (res.ok) {
      const data = await res.json();
      return (data.results || []).map((item) => ({
        name: item.name,
        country: item.country_code ? item.country_code.toUpperCase() : (item.country || ''),
        state: item.admin1 || '',
        lat: item.latitude,
        lon: item.longitude
      }));
    }
  } catch {
    return [];
  }

  return [];
};
