import React from 'react';
import {
  WiDayCloudy,
  WiStrongWind,
  WiThermometer,
  WiDayRain
} from 'react-icons/wi';
import {
  FaReact,
  FaBolt,
  FaRoute,
  FaPalette,
  FaKey,
  FaCode
} from 'react-icons/fa6';
import './About.css';

const About = () => {
  return (
    <div className="page-container about-page">
      {/* Hero Header */}
      <div className="about-hero glass-card">
        <div className="about-brand-wrap">
          <div className="about-icon-box animate-float">
            <WiDayCloudy size={54} className="about-icon" />
          </div>
          <div>
            <h1 className="about-title">About SkyPulse</h1>
            <p className="about-tagline">
              Modern, responsive, real-time meteorological weather intelligence application.
            </p>
          </div>
        </div>

        <p className="about-intro">
          SkyPulse delivers high-precision meteorological forecasts, interactive atmospheric analytics, and seamless city management built with a modern glassmorphic aesthetic.
        </p>
      </div>

      {/* Feature Highlights Grid */}
      <section className="about-section">
        <h2 className="section-heading">Key Features & Premium Innovations</h2>
        <div className="about-features-grid">
          <div className="about-feature-card glass-card">
            <div className="feature-icon-badge badge-blue">
              <WiThermometer size={30} />
            </div>
            <h3 className="feature-title">Real-Time Forecasts</h3>
            <p className="feature-desc">
              Accurate current temperature, feels-like metric, min/max ranges, humidity, wind velocity, atmospheric pressure, and visibility.
            </p>
          </div>

          <div className="about-feature-card glass-card">
            <div className="feature-icon-badge badge-cyan">
              <WiDayRain size={30} />
            </div>
            <h3 className="feature-title">Interactive Spline Curve Chart</h3>
            <p className="feature-desc">
              Smooth SVG Bézier temperature curve with scrubber tooltips, precipitation probability bars, and 7-day outlook timeline.
            </p>
          </div>

          <div className="about-feature-card glass-card">
            <div className="feature-icon-badge badge-amber">
              <WiStrongWind size={30} />
            </div>
            <h3 className="feature-title">60fps Ambient Atmosphere</h3>
            <p className="feature-desc">
              Hardware-accelerated dynamic particle canvas rendering realistic rain, snow, sunbeams, lightning storm flashes, and starry skies.
            </p>
          </div>

          <div className="about-feature-card glass-card">
            <div className="feature-icon-badge badge-purple">
              <FaPalette size={20} />
            </div>
            <h3 className="feature-title">Web Audio Soundscapes</h3>
            <p className="feature-desc">
              Synthesized natural weather audio engine (rain, wind gusts, night crickets, warm breezes) operating 100% offline via Web Audio API.
            </p>
          </div>

          <div className="about-feature-card glass-card">
            <div className="feature-icon-badge badge-blue">
              <WiThermometer size={30} />
            </div>
            <h3 className="feature-title">Air Quality & Health Advisory</h3>
            <p className="feature-desc">
              US AQI gauge meter, pollutant breakdown (PM2.5, PM10, O3, NO2), and actionable outdoor safety & mask recommendations.
            </p>
          </div>

          <div className="about-feature-card glass-card">
            <div className="feature-icon-badge badge-cyan">
              <WiDayRain size={30} />
            </div>
            <h3 className="feature-title">City Weather Duel</h3>
            <p className="feature-desc">
              Side-by-side comparison engine pitting any two global or national cities against each other with animated metric diffs.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="about-section">
        <h2 className="section-heading">Technology Stack</h2>
        <div className="tech-stack-cards">
          <div className="tech-badge-card glass-card">
            <FaReact className="tech-icon react-icon-color" size={26} />
            <div>
              <h4 className="tech-name">React.js</h4>
              <span className="tech-role">Component Architecture & Hooks</span>
            </div>
          </div>

          <div className="tech-badge-card glass-card">
            <FaBolt className="tech-icon vite-icon-color" size={24} />
            <div>
              <h4 className="tech-name">Vite</h4>
              <span className="tech-role">Next-Gen Frontend Tooling</span>
            </div>
          </div>

          <div className="tech-badge-card glass-card">
            <FaRoute className="tech-icon router-icon-color" size={24} />
            <div>
              <h4 className="tech-name">React Router</h4>
              <span className="tech-role">Client-Side Routing</span>
            </div>
          </div>

          <div className="tech-badge-card glass-card">
            <FaCode className="tech-icon css-icon-color" size={24} />
            <div>
              <h4 className="tech-name">CSS3 & Variables</h4>
              <span className="tech-role">Custom Design System</span>
            </div>
          </div>
        </div>
      </section>

      {/* API Configuration Guide */}
      <section className="about-section">
        <h2 className="section-heading">Weather API & Environment Setup</h2>
        <div className="api-guide-card glass-card">
          <div className="guide-header">
            <FaKey className="guide-key-icon" />
            <h3 className="guide-title">How to use OpenWeatherMap API Key</h3>
          </div>

          <p className="guide-text">
            SkyPulse includes an intelligent zero-config fallback to Open-Meteo, allowing it to work instantly out of the box. To connect your personal <strong>OpenWeatherMap</strong> API key:
          </p>

          <ol className="guide-steps">
            <li>
              Sign up for a free account at{' '}
              <a href="https://openweathermap.org/api" target="_blank" rel="noreferrer" className="inline-link">
                OpenWeatherMap
              </a>{' '}
              and generate an API Key.
            </li>
            <li>
              Open the <code>.env</code> file in your project root.
            </li>
            <li>
              Add your API key:
              <pre className="code-snippet">VITE_WEATHER_API_KEY=your_openweathermap_api_key_here</pre>
            </li>
            <li>
              Restart the Vite dev server with <code>npm run dev</code>.
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
};

export default About;
