import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { IoSunny, IoMoon } from 'react-icons/io5';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle-btn"
      onClick={toggleTheme}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle Theme"
      id="theme-toggle-btn"
    >
      <div className={`toggle-track ${isDark ? 'dark' : 'light'}`}>
        <span className="toggle-icon-sun">
          <IoSunny size={15} />
        </span>
        <span className="toggle-icon-moon">
          <IoMoon size={13} />
        </span>
        <div className="toggle-thumb" />
      </div>
    </button>
  );
};

export default ThemeToggle;
