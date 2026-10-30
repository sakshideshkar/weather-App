import React, { useState, useEffect, useRef } from 'react';
import {
  FaPlay,
  FaPause,
  FaExpand,
  FaCompress,
  FaCloudRain,
  FaWind,
  FaTemperatureHalf,
  FaLocationDot
} from 'react-icons/fa6';
import './WeatherRadar.css';

const RADAR_LAYERS = [
  { id: 'precipitation', label: 'Rain Radar', icon: <FaCloudRain /> },
  { id: 'wind', label: 'Wind Streams', icon: <FaWind /> },
  { id: 'temperature', label: 'Heatmap', icon: <FaTemperatureHalf /> }
];

const TIME_STEPS = ['-90m', '-60m', '-45m', '-30m', '-15m', 'LIVE'];

const WeatherRadar = ({ weather }) => {
  const location = weather?.location;

  const [activeLayer, setActiveLayer] = useState('precipitation');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(TIME_STEPS.length - 1);
  const [isExpanded, setIsExpanded] = useState(false);
  const canvasRef = useRef(null);

  // Playback timer
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => (prev + 1) % TIME_STEPS.length);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Animated radar sweep & particles canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight || 320);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight || 320;
    };
    window.addEventListener('resize', handleResize);

    let sweepAngle = 0;
    const particles = [];
    const count = activeLayer === 'wind' ? 120 : 60;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: Math.random() * 2 + 1,
        length: Math.random() * 15 + 10,
        radius: Math.random() * 40 + 20,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Map Grid Rings
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;
      [60, 120, 180, 240].forEach((r) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, height);
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // 2. Dynamic Layer Rendering
      if (activeLayer === 'precipitation') {
        // Simulated precipitation radar cells with step progression
        const stepOffset = currentStepIndex * 15;
        particles.forEach((p, idx) => {
          const px = (p.x + stepOffset) % width;
          const grad = ctx.createRadialGradient(px, p.y, 2, px, p.y, p.radius);
          if (idx % 4 === 0) {
            grad.addColorStop(0, 'rgba(239, 68, 68, 0.55)'); // heavy rain/storm
            grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.35)');
            grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
          } else {
            grad.addColorStop(0, 'rgba(56, 189, 248, 0.5)'); // light/moderate rain
            grad.addColorStop(0.6, 'rgba(16, 185, 129, 0.25)');
            grad.addColorStop(1, 'rgba(16, 185, 129, 0)');
          }
          ctx.beginPath();
          ctx.arc(px, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        });

        // Rotating radar sweep line
        sweepAngle += 0.035;
        const sweepX = centerX + Math.cos(sweepAngle) * 260;
        const sweepY = centerY + Math.sin(sweepAngle) * 260;

        const sweepGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 260);
        sweepGrad.addColorStop(0, 'rgba(56, 189, 248, 0.3)');
        sweepGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(sweepX, sweepY);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (activeLayer === 'wind') {
        // Flowing wind streamlines
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = 1.5;
        particles.forEach((p) => {
          p.x += p.speed;
          p.y += Math.sin(p.x * 0.02) * 0.5;
          if (p.x > width) p.x = 0;

          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.length, p.y);
          ctx.stroke();
        });
      } else if (activeLayer === 'temperature') {
        // Temperature heatmap gradients
        const heatGrad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 220);
        heatGrad.addColorStop(0, 'rgba(249, 115, 22, 0.45)');
        heatGrad.addColorStop(0.5, 'rgba(251, 191, 36, 0.2)');
        heatGrad.addColorStop(1, 'rgba(56, 189, 248, 0.15)');
        ctx.fillStyle = heatGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // 3. Center Target Pin (City Location)
      ctx.beginPath();
      ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeLayer, currentStepIndex]);

  if (!location) return null;

  return (
    <div className={`weather-radar-card glass-card ${isExpanded ? 'expanded-radar' : ''}`} id="live-weather-radar">
      {/* Radar Header */}
      <div className="radar-header">
        <div className="radar-title-wrap">
          <div className="radar-live-badge">
            <span className="live-dot" />
            <span>RADAR</span>
          </div>
          <div>
            <h3 className="radar-title">Interactive Satellite & Radar</h3>
            <span className="radar-coords">
              Centered on {location.name} ({location.lat.toFixed(2)}°, {location.lon.toFixed(2)}°)
            </span>
          </div>
        </div>

        {/* Controls: Layers & Expand */}
        <div className="radar-top-actions">
          <div className="layer-picker-group">
            {RADAR_LAYERS.map((layer) => (
              <button
                key={layer.id}
                type="button"
                className={`layer-btn ${activeLayer === layer.id ? 'active' : ''}`}
                onClick={() => setActiveLayer(layer.id)}
              >
                {layer.icon}
                <span>{layer.label}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="radar-expand-btn"
            onClick={() => setIsExpanded((prev) => !prev)}
            title={isExpanded ? 'Collapse radar view' : 'Expand radar view'}
          >
            {isExpanded ? <FaCompress size={13} /> : <FaExpand size={13} />}
          </button>
        </div>
      </div>

      {/* Main Radar Screen */}
      <div className="radar-screen-container">
        <canvas ref={canvasRef} className="radar-canvas" />

        {/* Center City Pin Overlay */}
        <div className="radar-center-target">
          <div className="target-pulse-ring" />
          <div className="target-pin-tag">
            <FaLocationDot size={11} />
            <span>{location.name}</span>
          </div>
        </div>

        {/* Radar Scale Legend */}
        <div className="radar-legend-bar">
          <span className="legend-label">Intensity:</span>
          <div className="legend-gradient-bar" />
          <div className="legend-stops">
            <span>Light</span>
            <span>Moderate</span>
            <span>Heavy</span>
          </div>
        </div>
      </div>

      {/* Time Playback Scrubber Bar */}
      <div className="radar-scrubber-bar">
        <button
          type="button"
          className={`radar-play-btn ${isPlaying ? 'playing' : ''}`}
          onClick={() => setIsPlaying((prev) => !prev)}
          title={isPlaying ? 'Pause Timeline' : 'Play Timeline'}
        >
          {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
        </button>

        <div className="scrubber-steps-track">
          {TIME_STEPS.map((step, idx) => (
            <button
              key={step}
              type="button"
              className={`step-btn ${currentStepIndex === idx ? 'active' : ''}`}
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex(idx);
              }}
            >
              {step}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherRadar;
