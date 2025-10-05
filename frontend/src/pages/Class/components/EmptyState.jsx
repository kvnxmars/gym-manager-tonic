// src/components/EmptyState.jsx
import React from 'react';

const EmptyState = ({ icon, title, message, actionButton }) => (
  <div className="empty-state">
    <div className="empty-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{message}</p>
    {actionButton}
  </div>
);

export default EmptyState;