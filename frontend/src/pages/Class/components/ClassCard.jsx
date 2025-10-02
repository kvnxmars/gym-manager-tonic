// src/components/ClassCard.jsx
import React from 'react';
import { formatTime, getAvailableSpots, isClassFull } from '../utils/helpers';

const ClassCard = ({ classItem, onBookClick }) => {
  const isFull = isClassFull(classItem.capacity, classItem.booked);

  return (
    <div className="class-card">
      <div className="class-header">
        <div className="class-icon">{classItem.image}</div>
        <div className="class-main-info">
          <h3 className="class-name">{classItem.name}</h3>
          <p className="class-instructor">with {classItem.instructor}</p>
          <div className="class-tags">
            <span className="class-tag">{classItem.type}</span>
            <span className="class-tag">{classItem.level}</span>
          </div>
        </div>
        <div className="class-time-info">
          <div className="class-time">{formatTime(classItem.time)}</div>
          <div className="class-duration">{classItem.duration}min</div>
        </div>
      </div>

      <div className="class-details">
        <div className="class-location">📍 {classItem.location}</div>
        <div className="class-description">{classItem.description}</div>

        <div className="class-capacity">
          <div className="capacity-info">
            <span className="available-spots">
              {getAvailableSpots(classItem.capacity, classItem.booked)} spots left
            </span>
            <span className="total-capacity">
              {classItem.booked}/{classItem.capacity} booked
            </span>
          </div>
          <div className="capacity-bar">
            <div
              className="capacity-fill"
              style={{ width: `${((classItem.booked || 0) / (classItem.capacity || 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <button
        className={`book-button ${isFull ? 'full' : ''}`}
        onClick={() => onBookClick(classItem)}
        disabled={isFull}
      >
        {isFull ? 'Class Full' : 'Book Now'}
      </button>
    </div>
  );
};

export default ClassCard;