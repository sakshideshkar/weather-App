import React, { useEffect, useRef, useState } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { FaSliders, FaEye, FaEyeSlash } from 'react-icons/fa6';
import './WeatherAtmosphere.css';

/**
 * WeatherAtmosphere:
 * Ultra-smooth 60fps Canvas particle engine for real-time meteorological ambience.
 * Supports: Rain, Thunderstorm, Snow, Clear Day, Starry Night, Clouds, Fog.
 * Includes interactive manual override to test/preview every weather effect!
 */
const WeatherAtmosphere = () => {
  const { weatherData } = useWeather();
  const canvasRef = useRef(null);

  const [isEnabled, setIsEnabled] = useState(true);
  const [overrideEffect, setOverrideEffect] = useState(null); // null = automatic based on weather
  const [showControls, setShowControls] = useState(false);

  // Determine current active effect
  const activeEffect = overrideEffect || (() => {
    if (!weatherData?.current) return 'clear-day';
    const { iconCode, condition, isDay } = weatherData.current;
    const code = (iconCode || '').toLowerCase();
    const cond = (condition || '').toLowerCase();

    if (code.startsWith('11') || cond.includes('thunder') || cond.includes('storm')) {
      return 'thunderstorm';
    }
    if (code.startsWith('09') || code.startsWith('10') || cond.includes('rain') || cond.includes('drizzle')) {
      return 'rain';
    }
    if (code.startsWith('13') || cond.includes('snow') || cond.includes('blizzard')) {
      return 'snow';
    }
    if (code.startsWith('50') || cond.includes('fog') || cond.includes('mist') || cond.includes('haze')) {
      return 'fog';
    }
    if (code.startsWith('03') || code.startsWith('04') || cond.includes('cloud') || cond.includes('overcast')) {
      return isDay ? 'clouds' : 'night-clouds';
    }
    return isDay ? 'clear-day' : 'starry-night';
  })();

  useEffect(() => {
    if (!isEnabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle pools
    const rainDrops = [];
    const splashes = [];
    const snowFlakes = [];
    const stars = [];
    const shootingStars = [];
    const dustMotes = [];
    const clouds = [];

    // Initialize Rain
    const rainCount = activeEffect === 'thunderstorm' ? 160 : 110;
    for (let i = 0; i < rainCount; i++) {
      rainDrops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 20 + 15,
        speed: Math.random() * 12 + 18,
        opacity: Math.random() * 0.4 + 0.3,
        thickness: Math.random() * 1.2 + 0.8
      });
    }

    // Initialize Snow
    for (let i = 0; i < 90; i++) {
      snowFlakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 1.2,
        speed: Math.random() * 1.5 + 0.8,
        wind: Math.random() * 1 - 0.5,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.03 + 0.01,
        opacity: Math.random() * 0.6 + 0.3
      });
    }

    // Initialize Stars
    for (let i = 0; i < 140; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.85,
        radius: Math.random() * 1.4 + 0.4,
        alpha: Math.random(),
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulseDir: Math.random() > 0.5 ? 1 : -1
      });
    }

    // Initialize Sun Dust Motes
    for (let i = 0; i < 45; i++) {
      dustMotes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 0.8,
        alpha: Math.random() * 0.5 + 0.1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.4 - 0.1
      });
    }

    // Initialize Clouds
    for (let i = 0; i < 7; i++) {
      clouds.push({
        x: Math.random() * (width + 400) - 200,
        y: Math.random() * (height * 0.5),
        radius: Math.random() * 120 + 80,
        speed: Math.random() * 0.3 + 0.15,
        opacity: Math.random() * 0.08 + 0.04
      });
    }

    // Lightning Flash State
    let lightningOpacity = 0;
    let nextLightningTime = Date.now() + Math.random() * 4000 + 2000;

    // Shooting Star Timer
    let nextMeteorTime = Date.now() + Math.random() * 5000 + 3000;

    let sunAngle = 0;

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. CLEAR DAY (Sun Rays & Warm Shimmering Motes)
      if (activeEffect === 'clear-day') {
        sunAngle += 0.0015;
        const sunX = width * 0.85;
        const sunY = 70;

        // Radial golden sun glow
        const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 320);
        sunGlow.addColorStop(0, 'rgba(251, 191, 36, 0.28)');
        sunGlow.addColorStop(0.4, 'rgba(245, 158, 11, 0.12)');
        sunGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 320, 0, Math.PI * 2);
        ctx.fill();

        // Rotating Sunbeams
        ctx.save();
        ctx.translate(sunX, sunY);
        ctx.rotate(sunAngle);
        for (let i = 0; i < 12; i++) {
          ctx.rotate((Math.PI * 2) / 12);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-40, 450);
          ctx.lineTo(40, 450);
          ctx.closePath();
          ctx.fillStyle = i % 2 === 0 ? 'rgba(251, 191, 36, 0.035)' : 'rgba(253, 230, 138, 0.02)';
          ctx.fill();
        }
        ctx.restore();

        // Drifting Warm Dust Motes
        dustMotes.forEach((mote) => {
          mote.x += mote.speedX;
          mote.y += mote.speedY;
          if (mote.y < -10) mote.y = height + 10;
          if (mote.x < -10) mote.x = width + 10;
          if (mote.x > width + 10) mote.x = -10;

          ctx.beginPath();
          ctx.arc(mote.x, mote.y, mote.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(254, 240, 138, ${mote.alpha})`;
          ctx.fill();
        });
      }

      // 2. STARRY NIGHT (Twinkling Stars & Shooting Meteors)
      if (activeEffect === 'starry-night' || activeEffect === 'night-clouds') {
        // Moon Ambient Glow
        const moonX = width * 0.85;
        const moonY = 80;
        const moonGlow = ctx.createRadialGradient(moonX, moonY, 15, moonX, moonY, 260);
        moonGlow.addColorStop(0, 'rgba(186, 230, 253, 0.22)');
        moonGlow.addColorStop(0.5, 'rgba(125, 211, 252, 0.08)');
        moonGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = moonGlow;
        ctx.beginPath();
        ctx.arc(moonX, moonY, 260, 0, Math.PI * 2);
        ctx.fill();

        // Twinkling Stars
        stars.forEach((star) => {
          star.alpha += star.pulseSpeed * star.pulseDir;
          if (star.alpha >= 1) {
            star.alpha = 1;
            star.pulseDir = -1;
          } else if (star.alpha <= 0.15) {
            star.alpha = 0.15;
            star.pulseDir = 1;
          }

          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(240, 249, 255, ${star.alpha * 0.85})`;
          ctx.fill();
        });

        // Shooting Star Generation
        if (Date.now() > nextMeteorTime) {
          shootingStars.push({
            x: Math.random() * width * 0.7,
            y: Math.random() * height * 0.35,
            length: Math.random() * 80 + 70,
            speed: Math.random() * 10 + 14,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
            opacity: 1
          });
          nextMeteorTime = Date.now() + Math.random() * 6000 + 4000;
        }

        // Draw Shooting Stars
        for (let i = shootingStars.length - 1; i >= 0; i--) {
          const s = shootingStars[i];
          s.x += Math.cos(s.angle) * s.speed;
          s.y += Math.sin(s.angle) * s.speed;
          s.opacity -= 0.025;

          if (s.opacity <= 0) {
            shootingStars.splice(i, 1);
            continue;
          }

          const tailX = s.x - Math.cos(s.angle) * s.length;
          const tailY = s.y - Math.sin(s.angle) * s.length;

          const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
          grad.addColorStop(0, `rgba(255, 255, 255, ${s.opacity})`);
          grad.addColorStop(1, 'rgba(56, 189, 248, 0)');

          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(tailX, tailY);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      // 3. CLOUDS / OVERCAST
      if (activeEffect === 'clouds' || activeEffect === 'night-clouds' || activeEffect === 'fog') {
        clouds.forEach((cloud) => {
          cloud.x += cloud.speed;
          if (cloud.x - cloud.radius > width) {
            cloud.x = -cloud.radius;
            cloud.y = Math.random() * (height * 0.45);
          }

          const grad = ctx.createRadialGradient(cloud.x, cloud.y, cloud.radius * 0.2, cloud.x, cloud.y, cloud.radius);
          grad.addColorStop(0, `rgba(148, 163, 184, ${cloud.opacity * 1.5})`);
          grad.addColorStop(0.7, `rgba(100, 116, 139, ${cloud.opacity * 0.6})`);
          grad.addColorStop(1, 'rgba(100, 116, 139, 0)');

          ctx.beginPath();
          ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        });
      }

      // 4. RAIN & THUNDERSTORM
      if (activeEffect === 'rain' || activeEffect === 'thunderstorm') {
        // Lightning Flash Effect for Thunderstorm
        if (activeEffect === 'thunderstorm') {
          if (Date.now() > nextLightningTime) {
            lightningOpacity = 0.85;
            nextLightningTime = Date.now() + Math.random() * 6000 + 3000;
          }

          if (lightningOpacity > 0) {
            ctx.fillStyle = `rgba(238, 242, 255, ${lightningOpacity * 0.22})`;
            ctx.fillRect(0, 0, width, height);
            lightningOpacity -= 0.045;
          }
        }

        // Rain Droplets
        ctx.strokeStyle = 'rgba(147, 197, 253, 0.45)';
        rainDrops.forEach((drop) => {
          ctx.lineWidth = drop.thickness;
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x - 2, drop.y + drop.length);
          ctx.stroke();

          drop.y += drop.speed;
          drop.x -= 1.2; // wind slant

          if (drop.y > height) {
            // Ripple splash at bottom
            if (splashes.length < 35 && Math.random() > 0.6) {
              splashes.push({
                x: drop.x,
                y: height - Math.random() * 20,
                radius: 1,
                maxRadius: Math.random() * 8 + 4,
                alpha: 0.5
              });
            }
            drop.y = -drop.length;
            drop.x = Math.random() * width + 50;
          }
        });

        // Floor Splashes
        for (let i = splashes.length - 1; i >= 0; i--) {
          const sp = splashes[i];
          sp.radius += 0.8;
          sp.alpha -= 0.035;

          if (sp.alpha <= 0 || sp.radius >= sp.maxRadius) {
            splashes.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.ellipse(sp.x, sp.y, sp.radius * 2, sp.radius * 0.6, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(186, 230, 253, ${sp.alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // 5. SNOW
      if (activeEffect === 'snow') {
        snowFlakes.forEach((flake) => {
          flake.wobble += flake.wobbleSpeed;
          flake.y += flake.speed;
          flake.x += Math.sin(flake.wobble) * 0.8 + flake.wind;

          if (flake.y > height) {
            flake.y = -flake.radius * 2;
            flake.x = Math.random() * width;
          }
          if (flake.x > width) flake.x = 0;
          if (flake.x < 0) flake.x = width;

          ctx.beginPath();
          ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(240, 249, 255, ${flake.opacity})`;
          ctx.fill();
        });
      }

      // 6. FOG & MIST
      if (activeEffect === 'fog') {
        const time = Date.now() * 0.0003;
        for (let i = 0; i < 4; i++) {
          const y = (height * 0.3) + i * 140;
          const shift = Math.sin(time + i) * 60;
          const grad = ctx.createLinearGradient(0, y, width, y);
          grad.addColorStop(0, 'rgba(161, 161, 170, 0)');
          grad.addColorStop(0.5, 'rgba(212, 212, 216, 0.07)');
          grad.addColorStop(1, 'rgba(161, 161, 170, 0)');

          ctx.fillStyle = grad;
          ctx.fillRect(0, y - 50 + shift, width, 100);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isEnabled, activeEffect]);

  const effectsList = [
    { id: 'clear-day', label: '☀️ Sunny' },
    { id: 'starry-night', label: '✨ Starry Night' },
    { id: 'rain', label: '🌧️ Rain' },
    { id: 'thunderstorm', label: '⚡ Thunderstorm' },
    { id: 'snow', label: '❄️ Snow' },
    { id: 'clouds', label: '☁️ Overcast' },
    { id: 'fog', label: '🌫️ Fog & Mist' }
  ];

  return (
    <>
      {/* Background 60fps Canvas */}
      {isEnabled && (
        <canvas
          ref={canvasRef}
          className="weather-atmosphere-canvas"
          aria-hidden="true"
        />
      )}

      {/* Floating Atmosphere Experience Controller */}
      <div className="atmosphere-controller-wrapper">
        <button
          type="button"
          className={`atmosphere-toggle-trigger ${showControls ? 'active' : ''}`}
          onClick={() => setShowControls((prev) => !prev)}
          title="Atmospheric Particle Visuals & Simulator"
          aria-label="Atmosphere Controls"
        >
          <FaSliders size={14} />
          <span className="atmosphere-btn-text">Atmosphere</span>
          <span className="atmosphere-status-dot" />
        </button>

        {showControls && (
          <div className="atmosphere-dropdown-menu glass-card">
            <div className="atmosphere-dropdown-header">
              <span className="dropdown-title">Atmospheric Effects</span>
              <button
                type="button"
                className="btn-toggle-enable"
                onClick={() => setIsEnabled((prev) => !prev)}
                title={isEnabled ? 'Disable animation canvas' : 'Enable animation canvas'}
              >
                {isEnabled ? <FaEye size={14} /> : <FaEyeSlash size={14} />}
                <span>{isEnabled ? 'Live' : 'Paused'}</span>
              </button>
            </div>

            <p className="atmosphere-hint">
              {overrideEffect
                ? `Simulating: ${effectsList.find((e) => e.id === overrideEffect)?.label}`
                : `Synced with live weather: ${activeEffect}`}
            </p>

            <div className="atmosphere-presets-grid">
              <button
                type="button"
                className={`preset-chip ${overrideEffect === null ? 'selected' : ''}`}
                onClick={() => setOverrideEffect(null)}
              >
                🎯 Auto (Live)
              </button>
              {effectsList.map((eff) => (
                <button
                  key={eff.id}
                  type="button"
                  className={`preset-chip ${overrideEffect === eff.id ? 'selected' : ''}`}
                  onClick={() => {
                    setIsEnabled(true);
                    setOverrideEffect(eff.id);
                  }}
                >
                  {eff.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WeatherAtmosphere;

