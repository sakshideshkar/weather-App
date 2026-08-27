import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { WeatherProvider } from './context/WeatherContext';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

import Home from './pages/Home/Home';
import Weather from './pages/Weather/Weather';
import Favorites from './pages/Favorites/Favorites';
import SearchHistory from './pages/SearchHistory/SearchHistory';
import About from './pages/About/About';

import './App.css';

function App() {
  return (
    <ThemeProvider>
      <WeatherProvider>
        <Router>
          <div className="app-layout">
            <Navbar />
            <main className="app-main-content">
              <div className="container">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/weather" element={<Weather />} />
                  <Route path="/weather/:city" element={<Weather />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/search-history" element={<SearchHistory />} />
                  <Route path="/about" element={<About />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </main>
            <Footer />
          </div>
        </Router>
      </WeatherProvider>
    </ThemeProvider>
  );
}

export default App;
