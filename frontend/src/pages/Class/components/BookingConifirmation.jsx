// src/components/BookingConfirmation.jsx
import React from 'react';
import { formatTime, getAvailableSpots } from '../utils/helpers';

const BookingConfirmation = ({ selectedClass, selectedDate, student }) => {
  if (!selectedClass) return <p>No class selected.</p>;

  return (
    <div className="booking-confirmation">
      <div className="booking-class-card">
        <div className="class-icon large">{selectedClass.image}</div>
        <h2 className="class-name">{selectedClass.name}</h2>
        <p className="class-instructor">with {selectedClass.instructor}</p>

        <div className="booking-details">
          <div className="booking-detail">
            <span className="detail-label">📅 Date</span>
            <span className="detail-value">{new Date(selectedDate).toLocaleDateString()}</span>
          </div>
          <div className="booking-detail">
            <span className="detail-label">🕐 Time</span>
            <span className="detail-value">{formatTime(selectedClass.time)} ({selectedClass.duration}min)</span>
          </div>
          <div className="booking-detail">
            <span className="detail-label">📍 Location</span>
            <span className="detail-value">{selectedClass.location}</span>
          </div>

          <div className="booking-detail">
            <span className="detail-label">👥 Available</span>
            <span className="detail-value">
              {getAvailableSpots(selectedClass.capacity, selectedClass.booked)} spots left
            </span>
          </div>
        </div>
      </div>

      <div className="booking-user-info">
        <h3>Booking for</h3>
        <div className="user-info">
          <div className="user-avatar">👤</div>
          <div>
            <p className="user-name">{student.name}</p>
            <p className="user-id">Student ID: {student.studentNumber}</p>
          </div>
        </div>
      </div>

      <div className="booking-terms">
        <p className="terms-text">
          By confirming this booking, you agree to the class cancellation policy.
          Please arrive 10 minutes early.
        </p>
      </div>
    </div>
  );
};

export default BookingConfirmation;