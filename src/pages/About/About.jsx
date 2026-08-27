import React from 'react';
import {
  WiDayCloudy,
  WiStrongWind,
  WiThermometer,
  WiDayRain,
  WiBarometer
} from 'react-icons/wi';
import {
  FaReact,
  FaBolt,
  FaRoute,
  FaPalette,
  FaKey,
  FaShieldHalved,
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
        <h2 className="section-heading">Key Features</h2>
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
            <h3 className="feature-title">Hourly & 7-Day Timelines</h3>
            <p className="feature-desc">
              Scrollable 24-hour forecast strip with precipitation probability and a comprehensive 7-day outlook with relative temperature range bars.
            </p>
          </div>

          <div className="about-feature-card glass-card">
            <div className="feature-icon-badge badge-amber">
              <WiStrongWind size={30} />
            </div>
            <h3 className="feature-title">GPS Geolocation</h3>
            <p className="feature-desc">
              One-click "My Location" lookup leveraging the browser Geolocation API with complete permission and error handling.
            </p>
          </div>

          <div className="about-feature-card glass-card">
            <div className="feature-icon-badge badge-purple">
              <FaPalette size={20} />
            </div>
            <h3 className="feature-title">Glassmorphism & Themes</h3>
            <p className="feature-desc">
              Ultra-modern frosted glass interface, dynamic weather glowing accents, full Dark & Light mode toggle, and °C/°F unit conversions.
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
