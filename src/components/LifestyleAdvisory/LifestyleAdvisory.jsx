import React from 'react';
import {
  FaShirt,
  FaPersonRunning,
  FaCar,
  FaSun,
  FaMoon,
  FaUmbrella,
  FaGlasses,
  FaCircleCheck,
  FaTriangleExclamation
} from 'react-icons/fa6';
import './LifestyleAdvisory.css';

const getLifestyleAdvisory = (current) => {
  if (!current) return null;

  const temp = current.tempC;
  const isRain = (current.condition || '').toLowerCase().includes('rain') || (current.iconCode || '').startsWith('09') || (current.iconCode || '').startsWith('10');
  const isSnow = (current.condition || '').toLowerCase().includes('snow') || (current.iconCode || '').startsWith('13');
  const isStorm = (current.condition || '').toLowerCase().includes('storm') || (current.iconCode || '').startsWith('11');
  const isFog = (current.condition || '').toLowerCase().includes('fog') || (current.iconCode || '').startsWith('50');

  // 1. Clothing
  let clothing = {
    title: 'Comfortable Attire',
    desc: 'Light cotton shirt or casual layers.',
    icon: <FaShirt />,
    tag: 'Casual'
  };
  if (isRain) {
    clothing = {
      title: 'Waterproof Gear & Umbrella',
      desc: 'Carry a sturdy umbrella and water-resistant footwear.',
      icon: <FaUmbrella />,
      tag: 'Rain Ready'
    };
  } else if (temp < 6) {
    clothing = {
      title: 'Heavy Winter Insulation',
      desc: 'Down jacket, wool scarf, thermal innerwear & gloves.',
      icon: <FaShirt />,
      tag: 'Bundle Up'
    };
  } else if (temp < 16) {
    clothing = {
      title: 'Layered Outerwear',
      desc: 'Warm sweater, light trench coat, or fleece jacket.',
      icon: <FaShirt />,
      tag: 'Layer Up'
    };
  } else if (temp > 28) {
    clothing = {
      title: 'Lightweight & Breathable',
      desc: 'Cotton or linen fabrics, sunglasses & sun protection.',
      icon: <FaGlasses />,
      tag: 'Summer Wear'
    };
  }

  // 2. Outdoor Fitness / Running Score (1 - 10)
  let runScore = 9;
  let runDesc = 'Optimal conditions for running and cycling.';
  if (isStorm) {
    runScore = 1;
    runDesc = 'Severe weather hazard. Exercise strictly indoors.';
  } else if (isRain || isSnow) {
    runScore = 4;
    runDesc = 'Slippery paths; indoor treadmill or gym advised.';
  } else if (temp > 33) {
    runScore = 4;
    runDesc = 'High heat hazard; hydrate heavily, avoid midday sun.';
  } else if (temp < 3) {
    runScore = 5;
    runDesc = 'Chilly air; warm up thoroughly indoors first.';
  } else if (current.humidity > 80 && temp > 25) {
    runScore = 6;
    runDesc = 'Humid atmosphere; moderate your workout intensity.';
  }

  // 3. Driving & Commute Safety
  let drivingStatus = 'Optimal';
  let drivingDesc = 'Dry pavement and clear visibility ahead.';
  let drivingSafe = true;
  if (isStorm) {
    drivingStatus = 'Severe Caution';
    drivingDesc = 'Heavy downpours, low visibility, potential flash puddles.';
    drivingSafe = false;
  } else if (isSnow) {
    drivingStatus = 'Snow & Ice';
    drivingDesc = 'Slick roads; increase braking distance substantially.';
    drivingSafe = false;
  } else if (isFog) {
    drivingStatus = 'Dense Fog';
    drivingDesc = 'Reduced sightlines; use low-beam fog lights and slow down.';
    drivingSafe = false;
  } else if (isRain) {
    drivingStatus = 'Wet Roads';
    drivingDesc = 'Puddle spray and increased stopping distances.';
    drivingSafe = false;
  }

  // 4. UV & Sun Exposure
  const uv = current.uvIndex || 2;
  let uvDesc = 'Low UV exposure. Sunscreen optional for brief walks.';
  if (uv >= 8) {
    uvDesc = 'Very high UV radiation! SPF 50+ mandatory, seek shade.';
  } else if (uv >= 6) {
    uvDesc = 'High UV index. Wear a hat, sunglasses, and apply SPF 30+.';
  } else if (uv >= 3) {
    uvDesc = 'Moderate UV radiation. Sun protection recommended.';
  }

  // 5. Stargazing or Solar Energy
  const isDay = current.isDay ?? true;
  const clouds = (current.condition || '').toLowerCase().includes('cloud') || (current.condition || '').toLowerCase().includes('overcast');
  let astronomyDesc = isDay
    ? (clouds ? 'Diffused sunlight due to cloud cover.' : 'Abundant direct sunlight for solar absorption.')
    : (clouds ? 'Night sky obscured by cloud canopy.' : 'Crisp, clear skies ideal for celestial stargazing!');

  return {
    clothing,
    running: { score: runScore, desc: runDesc },
    driving: { status: drivingStatus, desc: drivingDesc, safe: drivingSafe },
    uv: { index: uv, desc: uvDesc },
    astronomy: { isDay, desc: astronomyDesc }
  };
};

const LifestyleAdvisory = ({ weather }) => {
  const current = weather?.current;
  if (!weather || !current) return null;

  const advisory = getLifestyleAdvisory(current);
  if (!advisory) return null;

  return (
    <div className="lifestyle-advisory-section glass-card" id="lifestyle-advisory-card">
      <div className="lifestyle-header">
        <h2 className="section-heading" style={{ marginBottom: 0 }}>
          Smart Lifestyle & Activity Advisory
        </h2>
        <span className="ai-advisor-badge">✨ Meteorological Intelligence</span>
      </div>

      <div className="advisory-cards-grid">
        {/* Card 1: What to Wear */}
        <div className="advisory-card">
          <div className="advisory-top-row">
            <div className="advisory-icon-wrap icon-cyan">
              {advisory.clothing.icon}
            </div>
            <span className="advisory-tag">{advisory.clothing.tag}</span>
          </div>
          <h4 className="advisory-item-title">{advisory.clothing.title}</h4>
          <p className="advisory-item-desc">{advisory.clothing.desc}</p>
        </div>

        {/* Card 2: Outdoor Workout Score */}
        <div className="advisory-card">
          <div className="advisory-top-row">
            <div className="advisory-icon-wrap icon-emerald">
              <FaPersonRunning />
            </div>
            <span className="fitness-score-pill">
              Score: <strong>{advisory.running.score}/10</strong>
            </span>
          </div>
          <h4 className="advisory-item-title">Outdoor Running & Cycling</h4>
          <p className="advisory-item-desc">{advisory.running.desc}</p>
        </div>

        {/* Card 3: Driving Safety */}
        <div className="advisory-card">
          <div className="advisory-top-row">
            <div className={`advisory-icon-wrap ${advisory.driving.safe ? 'icon-blue' : 'icon-amber'}`}>
              <FaCar />
            </div>
            <span className={`driving-status-pill ${advisory.driving.safe ? 'safe' : 'alert'}`}>
              {advisory.driving.safe ? <FaCircleCheck size={11} /> : <FaTriangleExclamation size={11} />}
              {advisory.driving.status}
            </span>
          </div>
          <h4 className="advisory-item-title">Commute & Road Safety</h4>
          <p className="advisory-item-desc">{advisory.driving.desc}</p>
        </div>

        {/* Card 4: UV or Night Sky */}
        <div className="advisory-card">
          <div className="advisory-top-row">
            <div className="advisory-icon-wrap icon-purple">
              {advisory.astronomy.isDay ? <FaSun /> : <FaMoon />}
            </div>
            <span className="advisory-tag">
              {advisory.astronomy.isDay ? 'Solar Potential' : 'Stargazing'}
            </span>
          </div>
          <h4 className="advisory-item-title">
            {advisory.astronomy.isDay ? `UV Protection (Index: ${advisory.uv.index})` : 'Night Sky Clarity'}
          </h4>
          <p className="advisory-item-desc">
            {advisory.astronomy.isDay ? advisory.uv.desc : advisory.astronomy.desc}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LifestyleAdvisory;
