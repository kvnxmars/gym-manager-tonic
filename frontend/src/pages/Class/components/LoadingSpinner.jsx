// src/components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="loading-spinner">{message}</div>
);

export default LoadingSpinner;