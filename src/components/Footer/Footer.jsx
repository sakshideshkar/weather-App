import React from 'react';
import { Link } from 'react-router-dom';
import { useWeather } from '../../context/WeatherContext';
import { WiDayCloudy } from 'react-icons/wi';
import { FaHeart, FaGithub } from 'react-icons/fa6';
import './Footer.css';

const Footer = () => {
  const { weatherData } = useWeather();
  const providerName = weatherData?.source === 'openweathermap' ? 'OpenWeatherMap API' : 'Open-Meteo & OpenStreetMap';

  return (
    <footer className="app-footer">
      <div className="container footer-container">
        <div className="footer-top-row">
          <div className="footer-brand-col">
            <div className="footer-brand-logo">
              <WiDayCloudy size={30} className="footer-brand-icon" />
              <span className="footer-brand-name">SkyPulse</span>
            </div>
            <p className="footer-desc">
              Next-generation real-time meteorological weather forecasting engine built with React.js and modern glassmorphic interface design.
            </p>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-section-title">Navigation</h4>
            <div className="footer-nav-links">
              <Link to="/">Dashboard</Link>
              <Link to="/favorites">Favorite Locations</Link>
              <Link to="/search-history">Search History</Link>
              <Link to="/about">About & API Docs</Link>
            </div>
          </div>

          <div className="footer-status-col">
            <h4 className="footer-section-title">Service Status</h4>
            <div className="api-status-badge">
              <span className="status-indicator-dot live" />
              <span>Live Engine: <strong>{providerName}</strong></span>
            </div>
            <p className="status-note">
              Global multi-layer atmospheric telemetry with minute-level precision.
            </p>
          </div>
        </div>

        <div className="footer-bottom-row">
          <p className="footer-copyright">
            © {new Date().getFullYear()} SkyPulse Weather App. Built with React.js, Vite & CSS3.
          </p>
          <div className="footer-tech-stack">
            <span>React.js</span>
            <span className="dot">•</span>
            <span>Vite</span>
            <span className="dot">•</span>
            <span>React Router</span>
            <span className="dot">•</span>
            <span>Context API</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
