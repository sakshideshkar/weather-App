import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useWeather } from '../../context/WeatherContext';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import TemperatureToggle from '../TemperatureToggle/TemperatureToggle';
import AmbientSoundToggle from '../AmbientSoundToggle/AmbientSoundToggle';
import { WiDayCloudy } from 'react-icons/wi';
import {
  FaHouse,
  FaHeart,
  FaClockRotateLeft,
  FaCircleInfo,
  FaCodeCompare,
  FaPlaneDeparture,
  FaUser,
  FaArrowRightToBracket,
  FaBars,
  FaXmark
} from 'react-icons/fa6';
import './Navbar.css';

const Navbar = () => {
  const { favorites } = useWeather();
  const { user, isAuthenticated } = useAuth();
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
            to="/compare"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            id="nav-link-compare"
          >
            <FaCodeCompare className="nav-icon" />
            <span>Compare</span>
          </NavLink>

          <NavLink
            to="/travel"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            id="nav-link-travel"
          >
            <FaPlaneDeparture className="nav-icon" />
            <span>Travel Route</span>
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

        {/* Controls: Audio + Units + Theme + User Auth */}
        <div className="navbar-actions desktop-actions">
          <AmbientSoundToggle />
          <TemperatureToggle />
          <ThemeToggle />

          {/* User Profile / Login Link */}
          {isAuthenticated && user ? (
            <Link to="/profile" className="nav-user-pill" title="My Weather Profile">
              <span className="nav-user-avatar">{user.avatar || '☀️'}</span>
              <span className="nav-user-name">{user.name.split(' ')[0]}</span>
            </Link>
          ) : (
            <Link to="/login" className="nav-login-btn" title="Sign In or Demo Account">
              <FaArrowRightToBracket size={13} />
              <span>Sign In</span>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="mobile-toggle-group">
          <AmbientSoundToggle />
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
          {/* User Auth Banner in Drawer */}
          <div className="mobile-user-drawer-card">
            {isAuthenticated && user ? (
              <Link to="/profile" className="drawer-user-link" onClick={closeMobileMenu}>
                <span className="drawer-avatar">{user.avatar || '☀️'}</span>
                <div>
                  <strong className="drawer-name">{user.name}</strong>
                  <span className="drawer-sub">{user.homeCity ? `Base: ${user.homeCity}` : 'View Profile'}</span>
                </div>
              </Link>
            ) : (
              <div className="drawer-guest-box">
                <Link to="/login" className="drawer-auth-btn primary" onClick={closeMobileMenu}>
                  Sign In
                </Link>
                <Link to="/signup" className="drawer-auth-btn secondary" onClick={closeMobileMenu}>
                  Register
                </Link>
              </div>
            )}
          </div>

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
              to="/compare"
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <FaCodeCompare className="mobile-nav-icon" />
              <span>City Weather Duel</span>
            </NavLink>

            <NavLink
              to="/travel"
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <FaPlaneDeparture className="mobile-nav-icon" />
              <span>Smart Travel Route</span>
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

            {isAuthenticated && (
              <NavLink
                to="/profile"
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <FaUser className="mobile-nav-icon" />
                <span>My Profile & Settings</span>
              </NavLink>
            )}

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
