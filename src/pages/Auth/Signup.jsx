import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWeather } from '../../context/WeatherContext';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaLocationDot,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaShieldHalved
} from 'react-icons/fa6';
import { WiDayCloudy } from 'react-icons/wi';
import './Auth.css';

const Signup = () => {
  const { signup, isAuthenticated } = useAuth();
  const { searchCity } = useWeather();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [homeCity, setHomeCity] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    navigate('/profile');
  }

  // Password Strength Calculator
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'transparent' };
    if (pass.length < 5) return { score: 1, label: 'Weak', color: '#ef4444' };
    if (pass.length < 8) return { score: 2, label: 'Medium', color: '#f59e0b' };
    return { score: 3, label: 'Strong', color: '#10b981' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (password.length < 4) {
      setErrorMsg('Password should be at least 4 characters long.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    const res = await signup({
      name,
      email,
      password,
      homeCity: homeCity || 'New Delhi'
    });

    setIsLoading(false);

    if (res.success) {
      if (homeCity) {
        searchCity(homeCity);
      }
      navigate('/profile');
    } else {
      setErrorMsg(res.error);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card glass-card">
        <div className="auth-glow" />

        <div className="auth-header">
          <div className="auth-logo-badge">
            <WiDayCloudy size={44} className="auth-logo-icon animate-float" />
          </div>
          <h1 className="auth-title">Create Free Account</h1>
          <p className="auth-subtitle">
            Join SkyPulse for personalized meteorological telemetry, real-time alerts, and custom saved cities.
          </p>
        </div>

        {errorMsg && (
          <div className="auth-error-banner">
            <span>{errorMsg}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="auth-input-group">
            <label className="auth-label" htmlFor="signup-name">Full Name</label>
            <div className="auth-input-box">
              <FaUser className="auth-field-icon" />
              <input
                id="signup-name"
                type="text"
                placeholder="e.g. Priya Sharma"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                className="auth-input"
                autoComplete="name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="auth-input-group">
            <label className="auth-label" htmlFor="signup-email">Email Address</label>
            <div className="auth-input-box">
              <FaEnvelope className="auth-field-icon" />
              <input
                id="signup-email"
                type="email"
                placeholder="priya@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                className="auth-input"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-input-group">
            <label className="auth-label" htmlFor="signup-password">Password</label>
            <div className="auth-input-box">
              <FaLock className="auth-field-icon" />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                className="auth-input"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>

            {/* Strength Bar */}
            {password && (
              <div className="password-strength-wrap">
                <div className="strength-bars">
                  <div
                    className="strength-bar"
                    style={{ backgroundColor: strength.score >= 1 ? strength.color : 'var(--border-color)' }}
                  />
                  <div
                    className="strength-bar"
                    style={{ backgroundColor: strength.score >= 2 ? strength.color : 'var(--border-color)' }}
                  />
                  <div
                    className="strength-bar"
                    style={{ backgroundColor: strength.score >= 3 ? strength.color : 'var(--border-color)' }}
                  />
                </div>
                <span className="strength-label" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          {/* Preferred Home City */}
          <div className="auth-input-group">
            <label className="auth-label" htmlFor="signup-city">
              Default Home City <small>(Optional)</small>
            </label>
            <div className="auth-input-box">
              <FaLocationDot className="auth-field-icon" />
              <input
                id="signup-city"
                type="text"
                placeholder="e.g. New Delhi, Mumbai, Bengaluru, London..."
                value={homeCity}
                onChange={(e) => setHomeCity(e.target.value)}
                className="auth-input"
              />
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isLoading}
          >
            <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
            <FaArrowRight size={13} />
          </button>
        </form>

        <div className="auth-card-footer">
          <span>Already registered?</span>
          <Link to="/login" className="auth-footer-link">
            Sign In Here
          </Link>
        </div>

        <div className="auth-security-badge">
          <FaShieldHalved size={12} />
          <span>Safe & Private • Zero Trackers • Offline Synced</span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
