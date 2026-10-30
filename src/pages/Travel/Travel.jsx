import React, { useState, useEffect, useCallback } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { useAuth } from '../../context/AuthContext';
import { getWeatherByCity } from '../../services/weatherApi';
import { formatTemp } from '../../utils/formatters';
import { getWeatherIcon } from '../../utils/weatherIcons';
import {
  FaPlaneDeparture,
  FaLocationDot,
  FaArrowRight,
  FaArrowRightArrowLeft,
  FaSuitcaseRolling,
  FaCheck,
  FaTriangleExclamation,
  FaCircleCheck,
  FaTemperatureHigh,
  FaDroplet,
  FaWind,
  FaCar,
  FaPlane,
  FaRotate,
  FaCompass
} from 'react-icons/fa6';
import './Travel.css';

const TRIP_PRESETS = [
  { from: 'New Delhi', to: 'Manali', label: 'Delhi ➔ Manali 🏔️' },
  { from: 'Mumbai', to: 'Goa', label: 'Mumbai ➔ Goa 🏖️' },
  { from: 'Bengaluru', to: 'Ooty', label: 'Bengaluru ➔ Ooty ☕' },
  { from: 'Jaipur', to: 'Udaipur', label: 'Jaipur ➔ Udaipur 🏰' },
  { from: 'London', to: 'Paris', label: 'London ➔ Paris 🥐' },
  { from: 'New York', to: 'Miami', label: 'NYC ➔ Miami 🌴' }
];

const generatePackingList = (destWeather) => {
  if (!destWeather || !destWeather.current) return [];

  const current = destWeather.current;
  const temp = current.tempC;
  const condition = (current.condition || '').toLowerCase();
  const windKmh = current.windSpeedKmh || 0;
  const uv = current.uvIndex || 0;

  const items = [
    { id: 'p_docs', category: 'Essentials', item: 'Govt ID / Passport & Flight/Train tickets', icon: '🎫' },
    { id: 'p_pbank', category: 'Electronics', item: 'Portable Fast-Charge Power Bank (10,000+ mAh)', icon: '🔋' },
    { id: 'p_flask', category: 'Gear', item: 'Insulated reusable hydration bottle', icon: '🍶' }
  ];

  // Cold weather packing
  if (temp < 8) {
    items.push(
      { id: 'c_heavy', category: 'Clothing', item: 'Heavy Down Jacket / Parka & Thermal inners', icon: '🧥' },
      { id: 'c_gloves', category: 'Clothing', item: 'Insulated Woolen Gloves & Snow Beanie', icon: '🧤' },
      { id: 'c_balm', category: 'Care', item: 'Intense cold cream & SPF lip balm', icon: '🧴' }
    );
  } else if (temp < 18) {
    items.push(
      { id: 'c_jacket', category: 'Clothing', item: 'Light fleece jacket / Cardigan / Hoodie', icon: '🧥' },
      { id: 'c_socks', category: 'Clothing', item: 'Warm cotton socks & closed walking shoes', icon: '🧦' }
    );
  }

  // Hot weather packing
  if (temp > 28) {
    items.push(
      { id: 'h_cotton', category: 'Clothing', item: 'Breathable linen / lightweight cotton wear', icon: '👕' },
      { id: 'h_sun', category: 'Care', item: 'Broad-Spectrum SPF 50+ Sunscreen', icon: '🧴' },
      { id: 'h_shades', category: 'Gear', item: 'UV400 Polarized Sunglasses & Sun Cap', icon: '🕶️' }
    );
  }

  // Rain / Wet weather packing
  if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower') || condition.includes('thunder')) {
    items.push(
      { id: 'r_umb', category: 'Gear', item: 'Wind-resistant compact Travel Umbrella', icon: '☂️' },
      { id: 'r_coat', category: 'Clothing', item: 'Waterproof Rain Poncho or Trench jacket', icon: '🌧️' },
      { id: 'r_shoes', category: 'Gear', item: 'Water-resistant shoes / Quick-dry footwear', icon: '👟' },
      { id: 'r_bag', category: 'Gear', item: 'Waterproof dry bag for phone & electronics', icon: '📱' }
    );
  }

  // Snow
  if (condition.includes('snow') || condition.includes('ice') || condition.includes('blizzard')) {
    items.push(
      { id: 's_boots', category: 'Clothing', item: 'High-traction Waterproof Snow Boots', icon: '🥾' },
      { id: 's_heat', category: 'Gear', item: 'Pocket hand warmers & Hot gel pack', icon: '🔥' }
    );
  }

  // High Wind
  if (windKmh > 30) {
    items.push(
      { id: 'w_wind', category: 'Clothing', item: 'Windcheater shell jacket', icon: '💨' }
    );
  }

  // High UV
  if (uv >= 6 && !items.some((i) => i.id === 'h_sun')) {
    items.push(
      { id: 'uv_sun', category: 'Care', item: 'High SPF Sunscreen & Aloe Vera soothing gel', icon: '☀️' }
    );
  }

  return items;
};

const getTransitSafety = (destWeather) => {
  if (!destWeather || !destWeather.current) return null;

  const current = destWeather.current;
  const condition = (current.condition || '').toLowerCase();
  const wind = current.windSpeedKmh || 0;
  const visibility = current.visibilityKm || 10;

  if (condition.includes('thunder') || condition.includes('storm') || wind > 55 || condition.includes('blizzard')) {
    return {
      status: 'severe',
      badge: 'Severe Transit Alert',
      color: '#f43f5e',
      icon: FaTriangleExclamation,
      headline: 'Severe Meteorological Hazards at Destination',
      flightTip: 'High probability of flight delays or holding patterns due to turbulent skies.',
      roadTip: 'Exercise utmost caution: low grip, slick roads, and reduced braking distances.'
    };
  }

  if (condition.includes('rain') || condition.includes('fog') || visibility < 3 || wind > 35) {
    return {
      status: 'moderate',
      badge: 'Moderate Caution',
      color: '#f59e0b',
      icon: FaTriangleExclamation,
      headline: 'Marginal Weather: Rain or Low Visibility',
      flightTip: 'Flights operating normally with minor de-icing or ATC spacing buffers.',
      roadTip: 'Turn on fog lamps, maintain safe trailing distance, watch for wet patches.'
    };
  }

  return {
    status: 'good',
    badge: 'Smooth Transit',
    color: '#10b981',
    icon: FaCircleCheck,
    headline: 'Ideal Travel Weather Conditions',
    flightTip: 'Smooth cruising altitudes and on-time runway departures projected.',
    roadTip: 'High visibility and dry highways: ideal driving conditions.'
  };
};

const Travel = () => {
  const { unit } = useWeather();
  const { user } = useAuth();

  const [originInput, setOriginInput] = useState(user?.homeCity || 'New Delhi');
  const [destInput, setDestInput] = useState('Manali');
  const [originWeather, setOriginWeather] = useState(null);
  const [destWeather, setDestWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});

  const fetchRoute = useCallback(async (origin, dest) => {
    if (!origin || !dest) return;
    setLoading(true);
    setError(null);

    try {
      const [originRes, destRes] = await Promise.all([
        getWeatherByCity(origin),
        getWeatherByCity(dest)
      ]);

      setOriginWeather(originRes);
      setDestWeather(destRes);
    } catch (err) {
      setError(err.message || 'Failed to analyze weather for one or both cities.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoute(originInput, destInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run on initial load

  const handleSwap = () => {
    const temp = originInput;
    setOriginInput(destInput);
    setDestInput(temp);
    fetchRoute(destInput, temp);
  };

  const handlePreset = (preset) => {
    setOriginInput(preset.from);
    setDestInput(preset.to);
    fetchRoute(preset.from, preset.to);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (originInput.trim() && destInput.trim()) {
      fetchRoute(originInput.trim(), destInput.trim());
    }
  };

  const toggleCheck = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const packingList = destWeather ? generatePackingList(destWeather) : [];
  const packedCount = packingList.filter((item) => checkedItems[item.id]).length;
  const packedPercent = packingList.length > 0 ? Math.round((packedCount / packingList.length) * 100) : 0;
  const transitSafety = destWeather ? getTransitSafety(destWeather) : null;

  const tempDelta =
    destWeather && originWeather
      ? Math.round(destWeather.current.tempC - originWeather.current.tempC)
      : 0;

  return (
    <div className="page-container travel-page">
      {/* Page Header */}
      <div className="page-header-wrap">
        <div className="page-title-group">
          <div className="page-icon-badge travel-icon-badge">
            <FaPlaneDeparture className="page-header-icon" />
          </div>
          <div>
            <h1 className="page-title">Next-Gen Smart Travel Route Planner</h1>
            <p className="page-subtitle">
              Plan cross-city trips with dual climate discrepancy telemetry, transit hazard ratings, and AI packing lists.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Route Chips */}
      <div className="trip-presets-strip">
        <span className="presets-label">
          <FaCompass size={13} /> Popular Getaways:
        </span>
        <div className="presets-scroll">
          {TRIP_PRESETS.map((p) => (
            <button
              key={`${p.from}-${p.to}`}
              type="button"
              className={`preset-chip ${originInput === p.from && destInput === p.to ? 'active' : ''}`}
              onClick={() => handlePreset(p)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Route Bar */}
      <form className="travel-form glass-card" onSubmit={handleSubmit}>
        <div className="travel-inputs-row">
          <div className="travel-input-group">
            <label className="travel-label" htmlFor="origin-input">
              <FaLocationDot className="label-icon origin-icon" /> Departure / Origin
            </label>
            <input
              id="origin-input"
              type="text"
              className="travel-input"
              placeholder="e.g. New Delhi, Mumbai, London"
              value={originInput}
              onChange={(e) => setOriginInput(e.target.value)}
              required
            />
          </div>

          <button
            type="button"
            className="travel-swap-btn"
            onClick={handleSwap}
            title="Swap Origin and Destination"
            aria-label="Swap Route"
          >
            <FaArrowRightArrowLeft />
          </button>

          <div className="travel-input-group">
            <label className="travel-label" htmlFor="dest-input">
              <FaSuitcaseRolling className="label-icon dest-icon" /> Arrival / Destination
            </label>
            <input
              id="dest-input"
              type="text"
              className="travel-input"
              placeholder="e.g. Manali, Goa, Paris"
              value={destInput}
              onChange={(e) => setDestInput(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="travel-submit-btn"
            disabled={loading}
          >
            {loading ? <FaRotate className="animate-spin" /> : <FaArrowRight />}
            <span>{loading ? 'Analyzing...' : 'Analyze Route'}</span>
          </button>
        </div>
      </form>

      {error && (
        <div className="travel-error-banner glass-card">
          <FaTriangleExclamation size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Route Dual Meteorological Comparison */}
      {originWeather && destWeather && !loading && (
        <>
          <div className="route-overview-grid">
            {/* Origin City Card */}
            <div className="route-city-card origin glass-card">
              <div className="route-city-badge origin-badge">Origin • Starting Point</div>
              <h2 className="route-city-name">{originWeather.location.name}</h2>
              <span className="route-country">{originWeather.location.country}</span>

              <div className="route-weather-row">
                <div className="route-icon-box">
                  {getWeatherIcon(originWeather.current.iconCode, originWeather.current.condition, 56)}
                </div>
                <div>
                  <div className="route-temp">{formatTemp(originWeather.current.tempC, unit)}</div>
                  <div className="route-cond">{originWeather.current.condition}</div>
                </div>
              </div>

              <div className="route-telemetry-pills">
                <span className="tele-pill">
                  <FaDroplet size={11} /> {originWeather.current.humidity}% Humid
                </span>
                <span className="tele-pill">
                  <FaWind size={11} /> {originWeather.current.windSpeedKmh} km/h
                </span>
              </div>
            </div>

            {/* Transition Delta Indicator */}
            <div className="route-delta-connector glass-card">
              <div className="delta-icon-wrap">
                <FaArrowRight className="delta-arrow" />
              </div>
              <div className="delta-temp-badge">
                <FaTemperatureHigh size={13} />
                <span>
                  {tempDelta > 0 ? `+${tempDelta}°C Warmer` : tempDelta < 0 ? `${tempDelta}°C Colder` : 'Same Temp'}
                </span>
              </div>
              <span className="delta-subtext">Destination Climate Shift</span>
            </div>

            {/* Destination City Card */}
            <div className="route-city-card dest glass-card">
              <div className="route-city-badge dest-badge">Destination • Target</div>
              <h2 className="route-city-name">{destWeather.location.name}</h2>
              <span className="route-country">{destWeather.location.country}</span>

              <div className="route-weather-row">
                <div className="route-icon-box">
                  {getWeatherIcon(destWeather.current.iconCode, destWeather.current.condition, 56)}
                </div>
                <div>
                  <div className="route-temp">{formatTemp(destWeather.current.tempC, unit)}</div>
                  <div className="route-cond">{destWeather.current.condition}</div>
                </div>
              </div>

              <div className="route-telemetry-pills">
                <span className="tele-pill">
                  <FaDroplet size={11} /> {destWeather.current.humidity}% Humid
                </span>
                <span className="tele-pill">
                  <FaWind size={11} /> {destWeather.current.windSpeedKmh} km/h
                </span>
              </div>
            </div>
          </div>

          {/* Transit Safety Assessment */}
          {transitSafety && (
            <div className={`transit-safety-card glass-card status-${transitSafety.status}`}>
              <div className="transit-header">
                <div className="transit-badge" style={{ backgroundColor: transitSafety.color }}>
                  <transitSafety.icon size={13} />
                  <span>{transitSafety.badge}</span>
                </div>
                <h3 className="transit-headline">{transitSafety.headline}</h3>
              </div>

              <div className="transit-modes-grid">
                <div className="transit-mode-box">
                  <div className="mode-title-row">
                    <FaPlane className="mode-icon flight" />
                    <strong>Flight & Air Route Outlook</strong>
                  </div>
                  <p className="mode-desc">{transitSafety.flightTip}</p>
                </div>

                <div className="transit-mode-box">
                  <div className="mode-title-row">
                    <FaCar className="mode-icon road" />
                    <strong>Highway & Road Driving Hazard</strong>
                  </div>
                  <p className="mode-desc">{transitSafety.roadTip}</p>
                </div>
              </div>
            </div>
          )}

          {/* Smart AI Packing Assistant */}
          <div className="packing-assistant-card glass-card">
            <div className="packing-header">
              <div className="packing-title-row">
                <div className="packing-icon-pill">
                  <FaSuitcaseRolling size={18} />
                </div>
                <div>
                  <h3 className="packing-title">
                    Smart AI Packing Assistant for {destWeather.location.name}
                  </h3>
                  <p className="packing-sub">
                    Auto-generated gear checklist tailored to {formatTemp(destWeather.current.tempC, unit)}, {destWeather.current.condition}, and local conditions.
                  </p>
                </div>
              </div>

              {/* Progress counter */}
              <div className="packing-progress-wrap">
                <span className="progress-text">
                  {packedCount} / {packingList.length} packed ({packedPercent}%)
                </span>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: `${packedPercent}%` }} />
                </div>
              </div>
            </div>

            <div className="packing-items-grid">
              {packingList.map((item) => {
                const isChecked = !!checkedItems[item.id];
                return (
                  <div
                    key={item.id}
                    className={`packing-item-card ${isChecked ? 'packed' : ''}`}
                    onClick={() => toggleCheck(item.id)}
                  >
                    <div className="item-checkbox">
                      {isChecked && <FaCheck size={11} />}
                    </div>
                    <span className="item-emoji">{item.icon}</span>
                    <div className="item-text-wrap">
                      <span className="item-name">{item.item}</span>
                      <span className="item-cat">{item.category}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 7-Day Destination Forecast Timeline */}
          {destWeather.daily && destWeather.daily.length > 0 && (
            <div className="trip-forecast-card glass-card">
              <h3 className="trip-forecast-title">
                7-Day Journey Forecast for {destWeather.location.name}
              </h3>
              <div className="trip-forecast-grid">
                {destWeather.daily.map((day, idx) => (
                  <div key={idx} className="trip-day-col glass-card">
                    <span className="trip-day-name">{idx === 0 ? 'Today' : day.dayName}</span>
                    <div className="trip-day-icon">
                      {getWeatherIcon(day.iconCode, day.condition, 38)}
                    </div>
                    <span className="trip-day-cond">{day.condition}</span>
                    <div className="trip-day-temps">
                      <span className="day-max">{formatTemp(day.tempMaxC, unit)}</span>
                      <span className="day-min">{formatTemp(day.tempMinC, unit)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Travel;