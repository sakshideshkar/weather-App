import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { WeatherProvider } from './context/WeatherContext';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import WeatherAtmosphere from './components/WeatherAtmosphere/WeatherAtmosphere';

import Home from './pages/Home/Home';
import Weather from './pages/Weather/Weather';
import Compare from './pages/Compare/Compare';
import Travel from './pages/Travel/Travel';
import Favorites from './pages/Favorites/Favorites';
import SearchHistory from './pages/SearchHistory/SearchHistory';
import About from './pages/About/About';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Profile from './pages/Profile/Profile';

import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WeatherProvider>
          <Router>
            <div className="app-layout">
              {/* 60fps Ambient Meteorological Canvas Particles */}
              <WeatherAtmosphere />

              <Navbar />
              <main className="app-main-content">
                <div className="container">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/weather" element={<Weather />} />
                    <Route path="/weather/:city" element={<Weather />} />
                    <Route path="/compare" element={<Compare />} />
                    <Route path="/travel" element={<Travel />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/search-history" element={<SearchHistory />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
              </main>
              <Footer />
            </div>
          </Router>
        </WeatherProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
