import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { getWeatherIcon } from '../../utils/weatherIcons';
import { formatTemp } from '../../utils/formatters';
import { FaDroplet } from 'react-icons/fa6';
import './DailyForecast.css';

const DailyForecast = ({ daily = [] }) => {
  const { unit } = useWeather();

  if (!daily || daily.length === 0) return null;

  // Find min and max across all 7 days for normalized temperature bar display
  const allMins = daily.map((d) => d.tempMinC);
  const allMaxs = daily.map((d) => d.tempMaxC);
  const globalMin = Math.min(...allMins, 0);
  const globalMax = Math.max(...allMaxs, 35);
  const globalRange = Math.max(globalMax - globalMin, 1);

  return (
    <div className="daily-forecast-section" id="daily-forecast-section">
      <h2 className="section-heading">7-Day Forecast</h2>

      <div className="daily-list-container">
        {daily.map((day, idx) => {
          // Calculate relative left and width percentage for the bar
          const leftPercent = Math.max(0, ((day.tempMinC - globalMin) / globalRange) * 100);
          const widthPercent = Math.max(15, (((day.tempMaxC - day.tempMinC) / globalRange) * 100));

          return (
            <div key={`${day.date}-${idx}`} className="daily-row-card glass-card">
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyForecast;
