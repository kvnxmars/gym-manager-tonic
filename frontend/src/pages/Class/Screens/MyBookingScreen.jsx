// src/screens/MyBookingsScreen.jsx
import { useEffect } from 'react';
import { Router } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import BookingCard from '../components/BookingCard';

const MyBookingsScreen = ({
  loading,
  myBookings,
  fetchMyBookings,
  cancelBooking,
  onNavChange,
  onGoToClasses
}) => {

  useEffect(() => {
    fetchMyBookings();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const headerContent = (
    <>
      <button className="back-button" onClick={() => onNavChange('classes')}>
        ‹
      </button>
      <h1 className="page-title">My Bookings</h1>
      <div></div>
    </>
  );

  return (
    <AppLayout headerContent={headerContent} activeNav="myBookings" onNavChange={onNavChange}>
      {loading && <LoadingSpinner message="Loading bookings..." />}

      {myBookings.length === 0 && !loading && (
        <EmptyState
          icon="📅"
          title="No Bookings Yet"
          message="You haven't booked any classes. Browse available classes to get started!"
          actionButton={
            <button
              className="primary-button"
              onClick={onGoToClasses}
            >
              Browse Classes
            </button>
          }
        />
      )}

      <div className="bookings-list">
        {myBookings.map(booking => (
          <BookingCard
            key={booking._id}
            booking={booking}
            onCancel={cancelBooking}
          />
        ))}
      </div>
    </AppLayout>
  );
};

export default MyBookingsScreen;