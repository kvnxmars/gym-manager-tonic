// src/screens/BookingScreen.jsx
import React from 'react';
import AppLayout from '../components/AppLayout';
import BookingConfirmation from '../components/BookingConifirmation';

const BookingScreen = ({ selectedClass, selectedDate, student, loading, onConfirmBooking, onCancel }) => {
  const headerContent = (
    <>
      <button className="back-button" onClick={onCancel}>
        ‹
      </button>
      <h1 className="page-title">Confirm Booking</h1>
      <div></div> {/* Placeholder for alignment */}
    </>
  );

  return (
    <AppLayout headerContent={headerContent} hideNav={true}>
      <BookingConfirmation
        selectedClass={selectedClass}
        selectedDate={selectedDate}
        student={student}
      />

      <div className="booking-actions">
        <button
          className="cancel-booking-button"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          className="confirm-booking-button"
          onClick={onConfirmBooking}
          disabled={loading || !selectedClass}
        >
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </div>
    </AppLayout>
  );
};

export default BookingScreen;