import React from 'react';
import CityComparison from '../../components/CityComparison/CityComparison';
import { FaCodeCompare } from 'react-icons/fa6';
import './Compare.css';

const Compare = () => {
  return (
    <div className="page-container compare-page">
      <div className="page-header-wrap">
        <div className="page-title-group">
          <div className="page-icon-badge compare-icon-badge">
            <FaCodeCompare className="page-header-icon" />
          </div>
          <div>
            <h1 className="page-title">City Weather Duel & Compare</h1>
            <p className="page-subtitle">
              Put any two global or national cities head-to-head with live meteorological comparisons.
            </p>
          </div>
        </div>
      </div>

      <CityComparison />
    </div>
  );
};

export default Compare;

