// Storage keys
const FAVORITES_KEY = 'skypulse_favorites';
const RECENT_SEARCHES_KEY = 'skypulse_recent_searches';
const THEME_KEY = 'skypulse_theme';
const UNIT_KEY = 'skypulse_unit';
const LAST_CITY_KEY = 'skypulse_last_city';

// Default cities for initial favorites if empty
const DEFAULT_FAVORITES = [
  { name: 'New Delhi', country: 'IN', lat: 28.6139, lon: 77.2090 },
  { name: 'Mumbai', country: 'IN', lat: 19.0760, lon: 72.8777 },
  { name: 'Bengaluru', country: 'IN', lat: 12.9716, lon: 77.5946 },
  { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 }
];

// Helper to safely get from localStorage
const getJSON = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.warn(`Error reading localStorage key "${key}":`, err);
    return fallback;
  }
};

// Helper to safely set in localStorage
const setJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing to localStorage key "${key}":`, err);
  }
};

/* ================= Favorites ================= */

export const getStoredFavorites = () => {
  return getJSON(FAVORITES_KEY, DEFAULT_FAVORITES);
};

export const addStoredFavorite = (city) => {
  if (!city || !city.name) return getStoredFavorites();
  const current = getStoredFavorites();
  const exists = current.some(
    (item) => item.name.toLowerCase() === city.name.toLowerCase() && (!city.country || item.country === city.country)
  );
  if (!exists) {
    const updated = [
      {
        name: city.name,
        country: city.country || '',
        lat: city.lat,
        lon: city.lon,
        addedAt: new Date().toISOString()
      },
      ...current
    ];
    setJSON(FAVORITES_KEY, updated);
    return updated;
  }
  return current;
};

export const removeStoredFavorite = (cityName, country) => {
  const current = getStoredFavorites();
  const updated = current.filter(
    (item) => !(item.name.toLowerCase() === cityName.toLowerCase() && (!country || item.country === country))
  );
  setJSON(FAVORITES_KEY, updated);
  return updated;
};

export const isStoredFavorite = (cityName, country) => {
  if (!cityName) return false;
  const current = getStoredFavorites();
  return current.some(
    (item) => item.name.toLowerCase() === cityName.toLowerCase() && (!country || item.country === country)
  );
};

/* ================= Recent Searches ================= */

export const getStoredRecentSearches = () => {
  return getJSON(RECENT_SEARCHES_KEY, []);
};

export const addStoredRecentSearch = (searchItem) => {
  if (!searchItem || !searchItem.name) return getStoredRecentSearches();
  const current = getStoredRecentSearches();
  // Filter out any duplicate name
  const filtered = current.filter(
    (item) => item.name.toLowerCase() !== searchItem.name.toLowerCase()
  );
  // Prepend new search (limit to 12 items)
  const updated = [
    {
      name: searchItem.name,
      country: searchItem.country || '',
      tempC: searchItem.tempC,
      condition: searchItem.condition,
      iconCode: searchItem.iconCode,
      searchedAt: new Date().toISOString()
    },
    ...filtered
  ].slice(0, 12);

  setJSON(RECENT_SEARCHES_KEY, updated);
  return updated;
};

export const removeStoredRecentSearch = (cityName) => {
  const current = getStoredRecentSearches();
  const updated = current.filter(
    (item) => item.name.toLowerCase() !== cityName.toLowerCase()
  );
  setJSON(RECENT_SEARCHES_KEY, updated);
  return updated;
};

export const clearStoredRecentSearches = () => {
  setJSON(RECENT_SEARCHES_KEY, []);
  return [];
};

/* ================= Theme & Unit ================= */

export const getStoredTheme = () => {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  } catch {
    return 'dark';
  }
};

export const setStoredTheme = (theme) => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (err) {
    console.warn('Error saving theme:', err);
  }
};

export const getStoredUnit = () => {
  try {
    const saved = localStorage.getItem(UNIT_KEY);
    return saved === 'F' ? 'F' : 'C';
  } catch {
    return 'C';
  }
};

export const setStoredUnit = (unit) => {
  try {
    localStorage.setItem(UNIT_KEY, unit);
  } catch (err) {
    console.warn('Error saving unit:', err);
  }
};

export const getStoredLastCity = () => {
  try {
    return localStorage.getItem(LAST_CITY_KEY) || 'New Delhi';
  } catch {
    return 'New Delhi';
  }
};

export const setStoredLastCity = (cityName) => {
  try {
    if (cityName) localStorage.setItem(LAST_CITY_KEY, cityName);
  } catch (err) {
    console.warn('Error saving last city:', err);
  }
};
