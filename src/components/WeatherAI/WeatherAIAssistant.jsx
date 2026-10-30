import React, { useState } from 'react';
import {
  FaRobot,
  FaPaperPlane,
  FaSuitcaseRolling,
  FaPersonRunning,
  FaPlaneDeparture,
  FaCloudShowersHeavy,
  FaStar,
  FaRotate,
  FaCopy,
  FaCheck
} from 'react-icons/fa6';
import './WeatherAIAssistant.css';

const QUICK_PROMPTS = [
  { id: 'pack', label: '🧳 What to pack?', icon: <FaSuitcaseRolling /> },
  { id: 'outdoor', label: '🏃 Best time for outdoor run?', icon: <FaPersonRunning /> },
  { id: 'weekend', label: '✈️ Weekend trip outlook?', icon: <FaPlaneDeparture /> },
  { id: 'rain', label: '🌧️ Rain risk next 48 hrs?', icon: <FaCloudShowersHeavy /> }
];

const generateAiAnalysis = (promptType, weather, customQuery = '') => {
  if (!weather || !weather.current) return 'Unable to analyze weather data.';

  const current = weather.current;
  const location = weather.location;
  const daily = weather.daily || [];
  const hourly = weather.hourly || [];
  const temp = current.tempC;
  const cond = current.condition;
  const humidity = current.humidity;
  const wind = current.windSpeedKmh;

  if (promptType === 'pack') {
    let clothes = 'breathable cotton shirts, comfortable jeans, and lightweight layers';
    let extras = 'sunglasses and SPF sunscreen';
    if (temp < 10) {
      clothes = 'heavy thermal innerwear, fleece jacket, wool scarf, and warm trousers';
      extras = 'gloves and lip balm';
    } else if (temp < 18) {
      clothes = 'sweatshirts, denim jacket, or trench coat with closed shoes';
      extras = 'light scarf';
    } else if (temp > 30) {
      clothes = 'ultra-light linen or cotton wear, shorts/loose pants, and sandals';
      extras = 'wide-brim hat, electrolyte hydration pack, and UV protective sunglasses';
    }

    const rainRisk = hourly.some((h) => h.pop > 35);
    const rainAdvice = rainRisk
      ? '⚠️ Precipitation detected in upcoming hours: Pack a compact travel umbrella and water-resistant footwear.'
      : '✅ Minimal rain probability: No heavy rain gear required.';

    return `🎒 Packing Intelligence for ${location.name}:\n\n` +
      `• Primary Attire: Recommended ${clothes}.\n` +
      `• Essential Gear: ${extras}.\n` +
      `• Atmospheric Note: Currently ${temp}°C (${cond}) with ${humidity}% humidity and ${wind} km/h wind.\n` +
      `• Rain Contingency: ${rainAdvice}`;
  }

  if (promptType === 'outdoor') {
    // Find best 3-hour window with lowest temp/UV or no rain
    const goodHours = hourly.slice(0, 14).filter((h) => h.pop < 30 && h.tempC <= 28);
    const bestHourStr = goodHours.length > 0 ? goodHours[0].hourStr : 'early morning (6:00 AM - 8:00 AM)';

    return `🏃 Outdoor Fitness & Running Assessment for ${location.name}:\n\n` +
      `• Optimal Window: Around ${bestHourStr} when solar radiation and temperatures are most favorable.\n` +
      `• Current Conditions: Temperature is ${temp}°C with feels-like at ${current.feelsLikeC}°C.\n` +
      `• Air & Wind: Wind velocity is ${wind} km/h (Beaufort: ${current.beaufort?.label || 'Gentle'}), Humidity: ${humidity}%.\n` +
      `• Coach Tip: ${temp > 30 ? 'High heat index! Avoid intense midday cardio; hydrate before stepping out.' : 'Favorable conditions for jogging, cycling, or outdoor sports.'}`;
  }

  if (promptType === 'weekend') {
    const weekendDays = daily.slice(0, 4);
    const daySummaries = weekendDays.map((d) => `${d.dayName}: ${d.tempMinC}°C to ${d.tempMaxC}°C (${d.condition}, Rain: ${d.pop}%)`).join('\n');

    return `✈️ Short-Term Travel & Sightseeing Forecast for ${location.name}:\n\n` +
      `${daySummaries}\n\n` +
      `• Travel Feasibility Rating: ${current.airQuality >= 4 ? 'Moderate (Noticeable haze)' : 'Excellent (Clear visibility for sightseeing)'}.\n` +
      `• Summary: ${daily[1] ? `Tomorrow (${daily[1].dayName}) is expected to peak at ${daily[1].tempMaxC}°C.` : 'Stable atmospheric trend.'}`;
  }

  if (promptType === 'rain') {
    const rainHours = hourly.filter((h) => h.pop > 25);
    const maxPop = Math.max(...hourly.map((h) => h.pop), 0);

    return `🌧️ Precipitation & Downpour Radar Breakdown for ${location.name}:\n\n` +
      `• Peak Rain Probability: ${maxPop}% over the next 24 hours.\n` +
      `• Rain Windows: ${rainHours.length > 0 ? rainHours.slice(0, 3).map((h) => `${h.hourStr} (${h.pop}%)`).join(', ') : 'No significant rain showers forecasted.'}\n` +
      `• Cloud Cover: Currently ${current.cloudCover ?? 25}% cloud density.\n` +
      `• Verdict: ${maxPop > 50 ? 'High probability of rain showers. Keep an umbrella handy!' : 'Dry atmospheric envelope dominating. Minimal downpour risk.'}`;
  }

  // Custom prompt query analysis
  const q = customQuery.toLowerCase();
  let answer = `Based on live meteorological telemetry for ${location.name} (${temp}°C, ${cond}): `;
  if (q.includes('umbrella') || q.includes('rain')) {
    answer += (current.condition || '').toLowerCase().includes('rain') || current.humidity > 75
      ? 'Yes, carrying an umbrella is recommended due to elevated moisture and shower chances.'
      : 'No umbrella strictly needed today; rain probability is low.';
  } else if (q.includes('cold') || q.includes('jacket') || q.includes('warm')) {
    answer += temp < 15
      ? `It is currently ${temp}°C, which feels chilly. A jacket or warm pullover is recommended.`
      : `Temperature is warm at ${temp}°C. Light cotton wear is comfortable.`;
  } else if (q.includes('flight') || q.includes('drive') || q.includes('travel')) {
    answer += current.visibilityKm < 5 || wind > 45
      ? 'Exercise caution when commuting or traveling due to wind/visibility factors.'
      : `Optimal transit conditions with ${current.visibilityKm} km visibility and ${wind} km/h wind.`;
  } else {
    answer += `Current atmospheric readings indicate ${humidity}% relative humidity, ${current.pressureHpa} hPa barometric pressure, UV Index of ${current.uvIndex}, and ${current.beaufort?.label || 'moderate breeze'}. Overall weather is ${cond.toLowerCase()}.`;
  }

  return answer;
};

const WeatherAIAssistant = ({ weather }) => {
  const location = weather?.location;
  const current = weather?.current;

  const [activePrompt, setActivePrompt] = useState('pack');
  const [customInput, setCustomInput] = useState('');
  const [response, setResponse] = useState(() => generateAiAnalysis('pack', weather));
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!weather || !location || !current) return null;

  const handleSelectPrompt = (promptId) => {
    setActivePrompt(promptId);
    setCustomInput('');
    setIsTyping(true);

    setTimeout(() => {
      setResponse(generateAiAnalysis(promptId, weather));
      setIsTyping(false);
    }, 300);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    setActivePrompt('custom');
    setIsTyping(true);

    setTimeout(() => {
      setResponse(generateAiAnalysis('custom', weather, customInput.trim()));
      setIsTyping(false);
    }, 400);
  };

  const handleCopy = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="weather-ai-widget glass-card" id="weather-ai-copilot">
      {/* Header */}
      <div className="ai-widget-header">
        <div className="ai-brand-group">
          <div className="ai-avatar-badge">
            <FaStar className="sparkle-icon" />
            <FaRobot size={22} className="ai-icon" />
          </div>
          <div>
            <div className="ai-title-row">
              <h3 className="ai-title">SkyPulse AI Meteorologist</h3>
              <span className="ai-model-tag">Live Intelligence</span>
            </div>
            <p className="ai-desc">
              Instant conversational meteorological analysis & trip planning for {location.name}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn-ai-copy"
          onClick={handleCopy}
          title="Copy Analysis"
        >
          {copied ? <FaCheck className="copied-green" /> : <FaCopy />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="ai-prompts-row">
        {QUICK_PROMPTS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`ai-prompt-pill ${activePrompt === p.id ? 'active' : ''}`}
            onClick={() => handleSelectPrompt(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* AI Response Output Box */}
      <div className="ai-output-box">
        {isTyping ? (
          <div className="ai-typing-indicator">
            <FaRotate className="animate-spin" size={14} />
            <span>Analyzing atmospheric parameters for {location.name}...</span>
          </div>
        ) : (
          <div className="ai-response-text">
            {response.split('\n').map((line, i) => (
              <p key={i} className={line.startsWith('•') || line.startsWith('🎒') || line.startsWith('✈️') || line.startsWith('🏃') || line.startsWith('🌧️') ? 'line-bullet' : 'line-para'}>
                {line}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Custom Question Input Form */}
      <form className="ai-input-form" onSubmit={handleCustomSubmit}>
        <input
          type="text"
          className="ai-chat-input"
          placeholder={`Ask SkyPulse AI anything about ${location.name} (e.g. Is it humid? Will flights be affected?)...`}
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
        />
        <button
          type="submit"
          className="btn-ai-send"
          disabled={!customInput.trim()}
          title="Ask AI"
        >
          <FaPaperPlane size={13} />
        </button>
      </form>
    </div>
  );
};

export default WeatherAIAssistant;
