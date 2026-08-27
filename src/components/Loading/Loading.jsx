import React from 'react';
import './Loading.css';

const Loading = () => {
  return (
    <div className="skeleton-weather-wrapper" id="skeleton-loading-state">
      {/* Current Weather Skeleton */}
      <div className="skeleton-card skeleton-hero glass-card">
        <div className="skeleton-row-between">
          <div className="skeleton-col">
            <div className="skeleton-block skeleton-title" />
            <div className="skeleton-block skeleton-subtitle" />
          </div>
          <div className="skeleton-block skeleton-pill" />
        </div>

        <div className="skeleton-main-row">
          <div className="skeleton-block skeleton-temp" />
          <div className="skeleton-block skeleton-icon" />
        </div>
      </div>

      {/* Highlights Skeleton Grid */}
      <div className="skeleton-highlights-grid">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div key={idx} className="skeleton-card skeleton-highlight-card glass-card">
            <div className="skeleton-row-between">
              <div className="skeleton-block skeleton-text-sm" />
              <div className="skeleton-block skeleton-circle-sm" />
            </div>
            <div className="skeleton-block skeleton-val-lg" />
            <div className="skeleton-block skeleton-bar" />
          </div>
        ))}
      </div>

      {/* Hourly Strip Skeleton */}
      <div className="skeleton-card skeleton-hourly glass-card">
        <div className="skeleton-block skeleton-text-md" style={{ marginBottom: '1rem' }} />
        <div className="skeleton-hourly-row">
          {[1, 2, 3, 4, 5, 6, 7].map((idx) => (
            <div key={idx} className="skeleton-block skeleton-hourly-pill" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
