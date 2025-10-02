// src/components/BookingCard.jsx
import React from 'react';
import { formatTime } from '../utils/helpers';

const BookingCard = ({ booking, onCancel }) => {
  return (
    <div className="booking-card">
      <div className="booking-header">
        <div className="class-icon">{booking.image}</div>
        <div className="booking-main-info">
          <h3 className="class-name">{booking.name}</h3>
          <p className="class-instructor">with {booking.instructor}</p>
          <p className="booking-date">
            {new Date(booking.bookingDate).toLocaleDateString()} at {formatTime(booking.time)}
          </p>
        </div>
        <div className="booking-status">
          <span className={`status-badge ${booking.status}`}>{booking.status}</span>
        </div>
      </div>

      <div className="booking-details">
        <div className="booking-location">📍 {booking.location}</div>
        <div className="booking-duration">🕐 {booking.duration} minutes</div>
      </div>

      <button
        className="cancel-button"
        onClick={() => onCancel(booking.bookingId)}
        // The disabled state should be managed by the parent component (MyBookingsScreen)
      >
        Cancel Booking
      </button>
    </div>
  );
};

export default BookingCard;