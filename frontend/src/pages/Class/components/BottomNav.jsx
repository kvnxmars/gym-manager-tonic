// src/components/BottomNav.jsx
import React from 'react';

const BottomNav = ({ activeNav, onNavChange }) => {
  return (
    <div className="bottom-nav">
      <button
        className={`nav-item ${activeNav === 'classes' ? 'active' : ''}`}
        onClick={() => onNavChange('classes')}
      >
        📚
      </button>
      <button
        className={`nav-item ${activeNav === 'myBookings' ? 'active' : ''}`}
        onClick={() => onNavChange('myBookings')}
      >
        📅
      </button>
      <button className="nav-item" disabled>⚙️</button>
    </div>
  );
};

export default BottomNav;