import React, { useState } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { getWeatherIcon } from '../../utils/weatherIcons';
import { formatTemp, formatTimeFromIsoOrTimestamp } from '../../utils/formatters';
import {
  FaDroplet,
  FaChevronDown,
  FaChevronUp,
  FaSun
} from 'react-icons/fa6';
import { WiSunrise } from 'react-icons/wi';
import './DailyForecast.css';

const DailyForecast = ({ daily = [] }) => {
  const { unit } = useWeather();
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!daily || daily.length === 0) return null;

  const toggleExpand = (idx) => {
    setExpandedIndex((prev) => (prev === idx ? null : idx));
  };

  // Find min and max across all 7 days for normalized temperature bar display
  const allMins = daily.map((d) => d.tempMinC);
  const allMaxs = daily.map((d) => d.tempMaxC);
  const globalMin = Math.min(...allMins, 0);
  const globalMax = Math.max(...allMaxs, 35);
  const globalRange = Math.max(globalMax - globalMin, 1);

  return (
    <div className="daily-forecast-section" id="daily-forecast-section">
      <div className="daily-header-row">
        <h2 className="section-heading" style={{ marginBottom: 0 }}>
          7-Day Outlook
        </h2>
        <span className="daily-hint-pill">Click day for full timeline</span>
      </div>

      <div className="daily-list-container">
        {daily.map((day, idx) => {
          const isExpanded = expandedIndex === idx;
          const leftPercent = Math.max(0, ((day.tempMinC - globalMin) / globalRange) * 100);
          const widthPercent = Math.max(15, (((day.tempMaxC - day.tempMinC) / globalRange) * 100));

          // Calculated approximations for day parts
          const morningTemp = Math.round(day.tempMinC + (day.tempMaxC - day.tempMinC) * 0.35);
          const afternoonTemp = day.tempMaxC;
          const eveningTemp = Math.round(day.tempMinC + (day.tempMaxC - day.tempMinC) * 0.65);
          const nightTemp = day.tempMinC;

          return (
            <div
              key={`${day.date}-${idx}`}
              className={`daily-row-card glass-card ${isExpanded ? 'expanded' : ''}`}
            >
              <div
                className="daily-row-main"
                onClick={() => toggleExpand(idx)}
                role="button"
                tabIndex={0}
              >
                {/* Day & Date */}
                <div className="daily-date-col">
                  <span className="daily-day-name">{day.dayName}</span>
                  <span className="daily-date-str">{day.dateStr}</span>
                </div>

                {/* Weather Condition & Icon */}
                <div className="daily-condition-col">
                  <div className="daily-icon-wrap">
                    {getWeatherIcon(day.iconCode, day.condition, 34)}
                  </div>
                  <span className="daily-condition-text">{day.condition}</span>
                </div>

                {/* Precipitation Chance */}
                <div className="daily-pop-col">
                  {day.pop > 0 ? (
                    <div className="daily-pop-badge">
                      <FaDroplet size={11} className="pop-icon" />
                      <span>{day.pop}%</span>
                    </div>
                  ) : (
                    <span className="pop-zero">-</span>
                  )}
                </div>

                {/* Min Temp, Temperature Bar, Max Temp */}
                <div className="daily-temp-range-col">
                  <span className="temp-min-text">{formatTemp(day.tempMinC, unit)}</span>

                  <div className="range-bar-track">
                    <div
                      className="range-bar-fill"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`
                      }}
                    />
                  </div>

                  <span className="temp-max-text">{formatTemp(day.tempMaxC, unit)}</span>
                </div>

                <div className="daily-arrow-col">
                  {isExpanded ? <FaChevronUp size={11} /> : <FaChevronDown size={11} />}
                </div>
              </div>

              {/* Expandable 4-Part Day Part Breakdown */}
              {isExpanded && (
                <div className="daily-breakdown-tray">
                  <div className="daypart-blocks-grid">
                    <div className="daypart-block">
                      <span className="daypart-label">Morning</span>
                      <span className="daypart-temp">{formatTemp(morningTemp, unit)}</span>
                      <span className="daypart-sub">Crisp start</span>
                    </div>

                    <div className="daypart-block">
                      <span className="daypart-label">Afternoon</span>
                      <span className="daypart-temp hot">{formatTemp(afternoonTemp, unit)}</span>
                      <span className="daypart-sub">Day peak</span>
                    </div>

                    <div className="daypart-block">
                      <span className="daypart-label">Evening</span>
                      <span className="daypart-temp">{formatTemp(eveningTemp, unit)}</span>
                      <span className="daypart-sub">Gentle breeze</span>
                    </div>

                    <div className="daypart-block">
                      <span className="daypart-label">Night</span>
                      <span className="daypart-temp cool">{formatTemp(nightTemp, unit)}</span>
                      <span className="daypart-sub">Overnight low</span>
                    </div>
                  </div>

                  <div className="daypart-meta-row">
                    <div className="meta-chip">
                      <FaDroplet className="meta-icon cyan" />
                      <span>Rain Probability: <strong>{day.pop}%</strong></span>
                    </div>
                    <div className="meta-chip">
                      <FaSun className="meta-icon amber" />
                      <span>Peak UV Index: <strong>{day.uvIndex || 3}</strong></span>
                    </div>
                    {day.sunrise && day.sunset && (
                      <div className="meta-chip">
                        <WiSunrise size={18} className="meta-icon gold" />
                        <span>Sun: {formatTimeFromIsoOrTimestamp(day.sunrise)} - {formatTimeFromIsoOrTimestamp(day.sunset)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyForecast;
