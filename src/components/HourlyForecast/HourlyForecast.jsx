import React, { useRef, useState, useMemo } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { getWeatherIcon } from '../../utils/weatherIcons';
import { formatTemp } from '../../utils/formatters';
import {
  FaDroplet,
  FaChevronLeft,
  FaChevronRight,
  FaChartLine,
  FaTableCellsLarge,
  FaWind
} from 'react-icons/fa6';
import './HourlyForecast.css';

/**
 * Creates a smooth cubic Bezier SVG path through a set of points
 */
const getSmoothSvgPath = (points) => {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;

  let d = `M ${points[0].x},${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }

  return d;
};

const HourlyForecast = ({ hourly = [] }) => {
  const { unit } = useWeather();
  const scrollContainerRef = useRef(null);
  const [viewMode, setViewMode] = useState('chart'); // 'chart' or 'cards'
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Dimensions for SVG Curve Chart
  const svgWidth = Math.max(900, (hourly?.length || 0) * 68);
  const svgHeight = 220;
  const paddingX = 40;
  const paddingTop = 45;
  const paddingBottom = 55;

  const chartData = useMemo(() => {
    if (!hourly || hourly.length === 0) {
      return { points: [], linePath: '', areaPath: '', minTemp: 0, maxTemp: 0 };
    }
    const temps = hourly.map((h) => h.tempC);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const tempRange = Math.max(maxTemp - minTemp, 1);
    const usableHeight = svgHeight - paddingTop - paddingBottom;
    const stepX = (svgWidth - paddingX * 2) / (hourly.length - 1 || 1);

    const points = hourly.map((item, idx) => {
      const x = paddingX + idx * stepX;
      // Invert Y coordinate (higher temp = smaller Y)
      const y = paddingTop + usableHeight - ((item.tempC - minTemp) / tempRange) * usableHeight;
      return { x, y, item, idx };
    });

    const linePath = getSmoothSvgPath(points);
    const areaPath = `${linePath} L ${points[points.length - 1].x},${svgHeight - 15} L ${points[0].x},${svgHeight - 15} Z`;

    return { points, linePath, areaPath, minTemp, maxTemp };
  }, [hourly, svgWidth, svgHeight, paddingTop, paddingBottom, paddingX]);

  if (!hourly || hourly.length === 0) return null;

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const activeHover = hoveredIndex !== null && chartData.points[hoveredIndex]
    ? chartData.points[hoveredIndex]
    : chartData.points[0];

  return (
    <div className="hourly-forecast-section" id="hourly-forecast-section">
      <div className="section-header-row">
        <div className="header-title-with-pill">
          <h2 className="section-heading" style={{ marginBottom: 0 }}>
            24-Hour Forecast
          </h2>
          <span className="live-pill">Live Timeline</span>
        </div>

        <div className="hourly-controls-group">
          {/* Mode Switcher */}
          <div className="view-mode-toggle glass-card">
            <button
              type="button"
              className={`mode-btn ${viewMode === 'chart' ? 'active' : ''}`}
              onClick={() => setViewMode('chart')}
              title="Interactive Temperature Curve"
            >
              <FaChartLine size={13} />
              <span>Chart</span>
            </button>
            <button
              type="button"
              className={`mode-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              title="Hourly Cards List"
            >
              <FaTableCellsLarge size={13} />
              <span>Cards</span>
            </button>
          </div>

          {viewMode === 'cards' && (
            <div className="scroll-arrow-controls">
              <button
                type="button"
                className="scroll-btn"
                onClick={() => handleScroll('left')}
                aria-label="Scroll left"
              >
                <FaChevronLeft size={13} />
              </button>
              <button
                type="button"
                className="scroll-btn"
                onClick={() => handleScroll('right')}
                aria-label="Scroll right"
              >
                <FaChevronRight size={13} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* VIEW MODE 1: INTERACTIVE TEMPERATURE CURVE CHART */}
      {viewMode === 'chart' && (
        <div className="hourly-chart-wrapper glass-card">
          {/* Active Scrubber Tooltip Summary */}
          {activeHover && (
            <div className="chart-active-preview-banner">
              <div className="preview-time-tag">
                {activeHover.idx === 0 ? 'Now' : activeHover.item.hourStr}
              </div>
              <div className="preview-condition-tag">
                <span className="preview-icon">
                  {getWeatherIcon(activeHover.item.iconCode, activeHover.item.condition, 22)}
                </span>
                <span className="preview-desc">{activeHover.item.condition}</span>
              </div>
              <div className="preview-metric-tag temp-tag">
                {formatTemp(activeHover.item.tempC, unit)}
              </div>
              <div className="preview-metric-tag rain-tag">
                <FaDroplet size={11} /> {activeHover.item.pop}% Rain
              </div>
              <div className="preview-metric-tag wind-tag">
                <FaWind size={11} /> {activeHover.item.windKmh} km/h
              </div>
            </div>
          )}

          <div className="chart-scroll-viewport">
            <svg
              className="hourly-svg-canvas"
              width={svgWidth}
              height={svgHeight}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            >
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="lineStrokeGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>

              {/* Grid Horizontal Guidelines */}
              <line
                x1={paddingX}
                y1={paddingTop}
                x2={svgWidth - paddingX}
                y2={paddingTop}
                className="chart-grid-line"
              />
              <line
                x1={paddingX}
                y1={svgHeight - paddingBottom}
                x2={svgWidth - paddingX}
                y2={svgHeight - paddingBottom}
                className="chart-grid-line"
              />

              {/* Rain Probability Bars (at bottom) */}
              {chartData.points.map((pt) => {
                const barHeight = Math.max(3, (pt.item.pop / 100) * 35);
                const barY = svgHeight - 20 - barHeight;
                return (
                  <rect
                    key={`rain-${pt.idx}`}
                    x={pt.x - 7}
                    y={barY}
                    width={14}
                    height={barHeight}
                    rx={3}
                    className="rain-bar-rect"
                    opacity={pt.item.pop > 0 ? 0.65 : 0.15}
                  />
                );
              })}

              {/* Area Fill */}
              <path d={chartData.areaPath} fill="url(#tempGradient)" />

              {/* Animated Stroke Curve */}
              <path
                d={chartData.linePath}
                fill="none"
                stroke="url(#lineStrokeGradient)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="chart-curve-path"
              />

              {/* Temperature Data Dots & Labels */}
              {chartData.points.map((pt) => {
                const isHovered = hoveredIndex === pt.idx;
                return (
                  <g
                    key={`point-${pt.idx}`}
                    className="chart-point-group"
                    onMouseEnter={() => setHoveredIndex(pt.idx)}
                  >
                    {/* Hover vertical beam */}
                    {isHovered && (
                      <line
                        x1={pt.x}
                        y1={10}
                        x2={pt.x}
                        y2={svgHeight - 15}
                        className="chart-scrubber-line"
                      />
                    )}

                    {/* Point Circle */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 6 : 4}
                      className={`chart-data-dot ${isHovered ? 'active' : ''}`}
                    />

                    {/* Temperature Text */}
                    <text
                      x={pt.x}
                      y={pt.y - 12}
                      textAnchor="middle"
                      className="chart-temp-label"
                    >
                      {formatTemp(pt.item.tempC, unit)}
                    </text>

                    {/* Hour Time Label */}
                    <text
                      x={pt.x}
                      y={svgHeight - 4}
                      textAnchor="middle"
                      className="chart-time-label"
                    >
                      {pt.idx === 0 ? 'Now' : pt.item.hourStr}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: CARDS LIST */}
      {viewMode === 'cards' && (
        <div className="hourly-scroll-container" ref={scrollContainerRef}>
          {hourly.map((item, idx) => (
            <div
              key={`${item.time}-${idx}`}
              className={`hourly-card glass-card ${idx === 0 ? 'is-now-card' : ''}`}
            >
              <span className="hourly-time">
                {idx === 0 ? 'Now' : item.hourStr}
              </span>

              <div className="hourly-icon-wrap">
                {getWeatherIcon(item.iconCode, item.condition, 42)}
              </div>

              <span className="hourly-temp">{formatTemp(item.tempC, unit)}</span>

              <div className="hourly-pop-wrap">
                <FaDroplet size={11} className={item.pop > 0 ? 'pop-active' : 'pop-inactive'} />
                <span className="hourly-pop-value">{item.pop}%</span>
              </div>

              <div className="hourly-wind-mini">
                <FaWind size={9} />
                <span>{item.windKmh}k</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HourlyForecast;
