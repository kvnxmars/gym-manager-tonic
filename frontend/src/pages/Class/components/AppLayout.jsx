// src/components/AppLayout.jsx
import React from 'react';
import BottomNav from './BottomNav';

/**
 * Common layout wrapper for the application screens.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.headerContent - Content for the app header (e.g., title, buttons).
 * @param {React.ReactNode} props.children - The main content of the screen.
 * @param {string} props.activeNav - The currently active navigation view ('classes' or 'myBookings').
 * @param {function} props.onNavChange - Handler for navigation button clicks.
 * @param {boolean} [props.hideNav=false] - Whether to hide the bottom navigation.
 */
const AppLayout = ({ headerContent, children, activeNav, onNavChange, hideNav = false }) => {
  return (
    <div className="booking-app">
      <div className="status-bar">
        <span className="device-name">FIT@NWU</span>
      </div>

      <div className="app-header">
        {headerContent}
      </div>

      <div className="app-content">
        {children}
      </div>

      {!hideNav && (
        <BottomNav activeNav={activeNav} onNavChange={onNavChange} />
      )}
    </div>
  );
};

export default AppLayout;