import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWeather } from '../../context/WeatherContext';
import {
  FaUser,
  FaLocationDot,
  FaBell,
  FaHeart,
  FaClockRotateLeft,
  FaArrowRightFromBracket,
  FaPen,
  FaCheck,
  FaMedal,
  FaAward,
  FaLock,
  FaPlaneDeparture
} from 'react-icons/fa6';
import './Profile.css';

const AVATAR_OPTIONS = ['☀️', '⚡', '❄️', '🌙', '🌈', '🌪️', '🌤️', '🚀'];

const Profile = () => {
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const { favorites, recentSearches, searchCity } = useWeather();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [homeCity, setHomeCity] = useState(user?.homeCity || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '⚡');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // If not logged in, redirect to login
  if (!isAuthenticated || !user) {
    return (
      <div className="page-container profile-guest-container">
        <div className="guest-card glass-card">
          <FaUser size={40} className="guest-icon" />
          <h2>Sign in to view your profile</h2>
          <p>Create an account or sign in with 1-click Demo Login to save your preferences.</p>
          <div className="guest-actions">
            <Link to="/login" className="btn-primary-auth">Sign In</Link>
            <Link to="/signup" className="btn-secondary-auth">Sign Up</Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || user.name,
      homeCity: homeCity.trim() || user.homeCity,
      bio: bio.trim() || user.bio,
      avatar: selectedAvatar
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleGoHomeCity = async () => {
    if (user.homeCity) {
      await searchCity(user.homeCity);
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const badges = [
    {
      id: 'storm_chaser',
      name: 'Storm Chaser',
      desc: 'Searched 3+ diverse weather hotspots',
      icon: '⚡',
      unlocked: recentSearches.length >= 3,
      progress: `${Math.min(recentSearches.length, 3)}/3`
    },
    {
      id: 'globe_trotter',
      name: 'Globe Trotter',
      desc: 'Saved 2 or more cities to favorites',
      icon: '🌍',
      unlocked: favorites.length >= 2,
      progress: `${Math.min(favorites.length, 2)}/2`
    },
    {
      id: 'audio_pilot',
      name: 'Sonic Meteorologist',
      desc: 'Active audio weather synthesis listener',
      icon: '🎧',
      unlocked: true,
      progress: 'Unlocked'
    },
    {
      id: 'travel_planner',
      name: 'Sky Navigator',
      desc: 'Cross-climate travel itinerary explorer',
      icon: '✈️',
      unlocked: true,
      progress: 'Unlocked'
    },
    {
      id: 'solar_flare',
      name: 'Solar Flare',
      desc: 'Customized your personalized persona avatar',
      icon: '☀️',
      unlocked: !!user.avatar,
      progress: 'Unlocked'
    },
    {
      id: 'polar_nomad',
      name: 'Polar Nomad',
      desc: 'Save 5 or more cities to your favorites',
      icon: '❄️',
      unlocked: favorites.length >= 5,
      progress: `${Math.min(favorites.length, 5)}/5`
    }
  ];

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="page-container profile-page">
      <div className="profile-dashboard-grid">
        {/* Left Column: User Card & Bio */}
        <div className="profile-user-card glass-card">
          <div className="profile-avatar-row">
            <div
              className="profile-avatar-circle"
              onClick={() => setShowAvatarPicker((prev) => !prev)}
              title="Click to change weather avatar"
            >
              <span>{user.avatar || '☀️'}</span>
              <div className="avatar-edit-badge">
                <FaPen size={10} />
              </div>
            </div>

            <div className="profile-info-wrap">
              <h1 className="profile-name">{user.name}</h1>
              <span className="profile-email">{user.email}</span>
              <span className="profile-joined">Member since {user.joinedDate}</span>
            </div>
          </div>

          {/* Avatar Selector Dropdown */}
          {showAvatarPicker && (
            <div className="avatar-picker-palette glass-card">
              <span className="palette-label">Choose your SkyPulse Persona:</span>
              <div className="avatar-icons-row">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    className={`avatar-btn ${selectedAvatar === av ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedAvatar(av);
                      updateProfile({ avatar: av });
                      setShowAvatarPicker(false);
                    }}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="profile-bio-text">{user.bio}</p>

          {/* Quick Metrics Strip */}
          <div className="profile-stats-strip">
            <div className="profile-stat-box">
              <span className="stat-num">{favorites.length}</span>
              <span className="stat-desc">Favorite Cities</span>
            </div>
            <div className="profile-stat-divider" />
            <div className="profile-stat-box">
              <span className="stat-num">{recentSearches.length}</span>
              <span className="stat-desc">Searches Logged</span>
            </div>
          </div>

          {/* Home City Quick Teleport */}
          {user.homeCity && (
            <div className="home-city-banner">
              <div className="home-city-details">
                <FaLocationDot className="home-pin-icon" />
                <div>
                  <span className="home-title">Home Base City</span>
                  <strong className="home-city-name">{user.homeCity}</strong>
                </div>
              </div>
              <button
                type="button"
                className="btn-teleport-home"
                onClick={handleGoHomeCity}
              >
                View Forecast
              </button>
            </div>
          )}

          {/* Logout Action */}
          <button
            type="button"
            className="profile-logout-btn"
            onClick={handleLogout}
          >
            <FaArrowRightFromBracket size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Right Column: Preferences & Settings Form */}
        <div className="profile-settings-card glass-card">
          <div className="settings-header">
            <h2 className="settings-title">Profile Settings & Meteorological Alerts</h2>
            <button
              type="button"
              className="btn-edit-toggle"
              onClick={() => setIsEditing((prev) => !prev)}
            >
              <FaPen size={12} />
              <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
            </button>
          </div>

          {saveSuccess && (
            <div className="save-success-banner">
              <FaCheck size={14} />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {isEditing ? (
            <form className="profile-edit-form" onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-name">Display Name</label>
                <input
                  id="edit-name"
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-homeCity">Default Home City</label>
                <input
                  id="edit-homeCity"
                  type="text"
                  className="form-input"
                  value={homeCity}
                  onChange={(e) => setHomeCity(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-bio">Bio / Motto</label>
                <textarea
                  id="edit-bio"
                  className="form-textarea"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-save-profile">
                Save Changes
              </button>
            </form>
          ) : (
            <div className="settings-summary-list">
              <div className="setting-row">
                <div className="setting-info">
                  <FaLocationDot className="setting-icon" />
                  <div>
                    <span className="setting-name">Home Forecast City</span>
                    <span className="setting-desc">Automatically loads when you sign in</span>
                  </div>
                </div>
                <strong className="setting-val">{user.homeCity || 'Not set'}</strong>
              </div>

              <div className="setting-row">
                <div className="setting-info">
                  <FaBell className="setting-icon" />
                  <div>
                    <span className="setting-name">Extreme Weather Alerts</span>
                    <span className="setting-desc">Visual banner warnings for storms & heatwaves</span>
                  </div>
                </div>
                <span className="badge-active">Enabled</span>
              </div>

              <div className="setting-row">
                <div className="setting-info">
                  <FaHeart className="setting-icon" />
                  <div>
                    <span className="setting-name">Favorites Cloud Sync</span>
                    <span className="setting-desc">Saved locations associated with your profile</span>
                  </div>
                </div>
                <span className="badge-active">Active</span>
              </div>
            </div>
          )}

          {/* Quick Navigation Shortcuts */}
          <div className="profile-shortcuts-section">
            <h4 className="shortcuts-title">Quick Navigation</h4>
            <div className="shortcuts-grid">
              <Link to="/favorites" className="shortcut-btn glass-card">
                <FaHeart className="sc-icon heart-color" />
                <span>My Favorites ({favorites.length})</span>
              </Link>
              <Link to="/search-history" className="shortcut-btn glass-card">
                <FaClockRotateLeft className="sc-icon history-color" />
                <span>Search History ({recentSearches.length})</span>
              </Link>
              <Link to="/compare" className="shortcut-btn glass-card">
                <FaLocationDot className="sc-icon compare-color" />
                <span>City Weather Duel</span>
              </Link>
              <Link to="/travel" className="shortcut-btn glass-card">
                <FaPlaneDeparture className="sc-icon travel-color" />
                <span>Travel Route</span>
              </Link>
            </div>
          </div>

          {/* Meteorological Badges & Gamification */}
          <div className="profile-badges-section">
            <div className="badges-header">
              <div className="badges-title-group">
                <FaMedal className="badges-icon" />
                <div>
                  <h4 className="badges-title">Atmospheric Explorer Badges</h4>
                  <span className="badges-subtitle">Unlock accomplishments as you explore the globe</span>
                </div>
              </div>
              <span className="badges-counter-chip">
                <FaAward size={12} /> {unlockedCount} / {badges.length} Unlocked
              </span>
            </div>

            <div className="badges-grid">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={`badge-card glass-card ${b.unlocked ? 'badge-unlocked' : 'badge-locked'}`}
                >
                  <div className="badge-icon-wrap">
                    <span className="badge-emoji">{b.icon}</span>
                    {b.unlocked ? (
                      <span className="badge-status-dot unlocked" title="Unlocked">
                        <FaCheck size={9} />
                      </span>
                    ) : (
                      <span className="badge-status-dot locked" title="Locked">
                        <FaLock size={8} />
                      </span>
                    )}
                  </div>
                  <div className="badge-text-wrap">
                    <strong className="badge-name">{b.name}</strong>
                    <p className="badge-desc">{b.desc}</p>
                    <span className={`badge-pill ${b.unlocked ? 'unlocked' : 'locked'}`}>
                      {b.progress}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
