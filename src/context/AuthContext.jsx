import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const STORAGE_KEY_USER = 'skypulse_auth_user';
const STORAGE_KEY_USERS_DB = 'skypulse_registered_accounts';

const DEFAULT_DEMO_USER = {
  id: 'usr_demo_101',
  name: 'Alex Sharma',
  email: 'alex@skypulse.com',
  avatar: '⚡',
  homeCity: 'New Delhi',
  bio: 'Meteorology enthusiast & sky watcher. Tracking global climate dynamics.',
  joinedDate: 'October 2026',
  notificationsEnabled: true,
  alertThresholdTemp: 38
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Save active user to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch {
      // storage error
    }
  }, [user]);

  // Login handler
  const login = async (email, password) => {
    // Quick demo login bypass
    if (email === 'demo@skypulse.com' || (email === 'alex@skypulse.com' && (!password || password === 'demo123'))) {
      setUser(DEFAULT_DEMO_USER);
      return { success: true, user: DEFAULT_DEMO_USER };
    }

    try {
      const usersDb = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS_DB) || '[]');
      const found = usersDb.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (found) {
        const { password: _p, ...safeUser } = found;
        setUser(safeUser);
        return { success: true, user: safeUser };
      }
      return { success: false, error: 'Invalid email or password. You can also try 1-Click Demo Login.' };
    } catch {
      return { success: false, error: 'Authentication error occurred.' };
    }
  };

  // Sign up handler
  const signup = async ({ name, email, password, homeCity = 'New Delhi' }) => {
    if (!name || !email || !password) {
      return { success: false, error: 'All fields are required.' };
    }

    try {
      const usersDb = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS_DB) || '[]');
      const exists = usersDb.some((u) => u.email.toLowerCase() === email.toLowerCase());

      if (exists) {
        return { success: false, error: 'An account with this email already exists. Please log in.' };
      }

      const avatarChoices = ['☀️', '⚡', '❄️', '🌙', '🌈', '🌪️', '🌤️'];
      const randomAvatar = avatarChoices[Math.floor(Math.random() * avatarChoices.length)];

      const newUser = {
        id: `usr_${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        avatar: randomAvatar,
        homeCity: homeCity.trim() || 'New Delhi',
        bio: 'Passionate weather observer.',
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        notificationsEnabled: true,
        alertThresholdTemp: 35
      };

      usersDb.push({ ...newUser, password });
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(usersDb));

      setUser(newUser);
      return { success: true, user: newUser };
    } catch {
      return { success: false, error: 'Failed to create account.' };
    }
  };

  // 1-Click Demo login
  const loginDemo = () => {
    setUser(DEFAULT_DEMO_USER);
    return DEFAULT_DEMO_USER;
  };

  // Logout handler
  const logout = () => {
    setUser(null);
  };

  // Update profile
  const updateProfile = (updates) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        signup,
        loginDemo,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

