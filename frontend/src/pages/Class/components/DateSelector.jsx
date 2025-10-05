// src/components/DateSelector.jsx
import React from 'react';
import { getTodayDateString } from '../Utils/helper';

const DateSelector = ({ selectedDate, onDateChange }) => {
  return (
    <div className="date-selector">
      <input
        type="date"
        value={selectedDate || getTodayDateString()}
        onChange={(e) => onDateChange(e.target.value)}
        className="date-input"
      />
    </div>
  );
};

export default DateSelector;