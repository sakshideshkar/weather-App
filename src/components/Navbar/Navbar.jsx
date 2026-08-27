import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useWeather } from '../../context/WeatherContext';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import TemperatureToggle from '../TemperatureToggle/TemperatureToggle';
import { WiDayCloudy } from 'react-icons/wi';
import {
  FaHouse,
  FaHeart,
  FaClockRotateLeft,
  FaCircleInfo,
  FaBars,
  FaXmark
} from 'react-icons/fa6';
import './Navbar.css';

const Navbar = () => {
  const { favorites } = useWeather();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu} id="nav-brand-logo">
          <div className="brand-icon-wrap">
            <WiDayCloudy className="brand-icon animate-float" size={36} />
          </div>
          <div className="brand-text-wrap">
            <span className="brand-title">Sky<span className="brand-title-accent">Pulse</span></span>
            <span className="brand-tagline">Real-Time Forecast</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navbar-nav desktop-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            id="nav-link-home"
          >
            <FaHouse className="nav-icon" />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            id="nav-link-favorites"
          >
            <FaHeart className="nav-icon" />
            <span>Favorites</span>
            {favorites.length > 0 && (
              <span className="nav-badge" id="favorites-badge-count">{favorites.length}</span>
            )}
          </NavLink>

          <NavLink
            to="/search-history"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            id="nav-link-history"
          >
            <FaClockRotateLeft className="nav-icon" />
            <span>History</span>
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            id="nav-link-about"
          >
            <FaCircleInfo className="nav-icon" />
            <span>About</span>
          </NavLink>
        </nav>

        {/* Controls: Unit Toggle + Theme Toggle */}
        <div className="navbar-actions desktop-actions">
          <TemperatureToggle />
          <ThemeToggle />
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="mobile-toggle-group">
          <ThemeToggle />
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <FaXmark size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-content">
          <nav className="mobile-nav-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <FaHouse className="mobile-nav-icon" />
              <span>Home / Weather</span>
            </NavLink>

            <NavLink
              to="/favorites"
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <FaHeart className="mobile-nav-icon" />
              <span>Favorites</span>
              {favorites.length > 0 && (
                <span className="nav-badge">{favorites.length}</span>
              )}
            </NavLink>

            <NavLink
              to="/search-history"
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <FaClockRotateLeft className="mobile-nav-icon" />
              <span>Search History</span>
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <FaCircleInfo className="mobile-nav-icon" />
              <span>About SkyPulse</span>
            </NavLink>
          </nav>

          <div className="mobile-drawer-footer">
            <div className="mobile-toggle-row">
              <span>Temperature Unit</span>
              <TemperatureToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
