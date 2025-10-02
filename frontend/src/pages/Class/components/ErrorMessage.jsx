// src/components/ErrorMessage.jsx
import React from 'react';

const ErrorMessage = ({ message, onRetry }) => (
  <div className="error-message">
    <p>{message}</p>
    <button onClick={onRetry} className="retry-button">
      Retry
    </button>
  </div>
);

export default ErrorMessage;