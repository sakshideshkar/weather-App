import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWeather } from '../../context/WeatherContext';
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaBolt,
  FaArrowRight,
  FaShieldHalved
} from 'react-icons/fa6';
import { WiDayCloudy } from 'react-icons/wi';
import './Auth.css';

const Login = () => {
  const { login, loginDemo, isAuthenticated } = useAuth();
  const { searchCity } = useWeather();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect
  if (isAuthenticated) {
    navigate('/profile');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      if (res.user?.homeCity) {
        searchCity(res.user.homeCity);
      }
      navigate('/profile');
    } else {
      setErrorMsg(res.error);
    }
  };

  const handleDemoLogin = () => {
    const demoUser = loginDemo();
    if (demoUser?.homeCity) {
      searchCity(demoUser.homeCity);
    }
    navigate('/profile');
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card glass-card">
        {/* Glow Element */}
        <div className="auth-glow" />

        {/* Brand Header */}
        <div className="auth-header">
          <div className="auth-logo-badge">
            <WiDayCloudy size={44} className="auth-logo-icon animate-float" />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Sign in to access your personalized weather dashboard, saved alerts, and favorite cities.
          </p>
        </div>

        {errorMsg && (
          <div className="auth-error-banner">
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1-Click Demo Login Hero Button */}
        <button
          type="button"
          className="demo-login-btn"
          onClick={handleDemoLogin}
          title="Instant 1-Click Login as Alex Sharma"
        >
          <FaBolt className="demo-icon" />
          <div className="demo-btn-text">
            <strong>1-Click Demo Login</strong>
            <span>Instant access with preloaded favorites & profile</span>
          </div>
        </button>

        <div className="auth-divider">
          <span>or sign in with email</span>
        </div>

        {/* Login Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <label className="auth-label" htmlFor="login-email">Email Address</label>
            <div className="auth-input-box">
              <FaEnvelope className="auth-field-icon" />
              <input
                id="login-email"
                type="email"
                placeholder="name@example.com"
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

          <div className="auth-input-group">
            <div className="auth-label-row">
              <label className="auth-label" htmlFor="login-password">Password</label>
              <button
                type="button"
                className="forgot-link"
                onClick={() => alert('For demo, you can use 1-Click Demo Login or any custom registered account!')}
              >
                Forgot?
              </button>
            </div>
            <div className="auth-input-box">
              <FaLock className="auth-field-icon" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                className="auth-input"
                autoComplete="current-password"
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
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isLoading}
          >
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
            <FaArrowRight size={13} />
          </button>
        </form>

        {/* Card Footer */}
        <div className="auth-card-footer">
          <span>Don't have an account yet?</span>
          <Link to="/signup" className="auth-footer-link">
            Create Account
          </Link>
        </div>

        <div className="auth-security-badge">
          <FaShieldHalved size={12} />
          <span>Local Encrypted Browser Session Storage</span>
        </div>
      </div>
    </div>
  );
};

export default Login;

