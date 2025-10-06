import { useState, useEffect } from 'react';

// API Service

const API_BASE_URL = import.meta.env.VITE_API_URL;

const apiService = {
  fetchClasses: async (date) => {
    const response = await fetch(`${API_BASE_URL}/classes?date=${date}`);
    if (!response.ok) throw new Error('Failed to fetch classes');
    return await response.json();
  },
  
  bookClass: async (classId, studentNumber, date) => {
    const response = await fetch(`${API_BASE_URL}/classes/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classId, studentNumber, date })
    });
    if 
      (!response.ok) throw new Error('Failed to book class');
    
    return await response.json();
  },
  
  cancelBooking: async (bookingId) => {
    const response = await fetch(`${API_BASE_URL}/classes/cancel/${bookingId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to cancel booking');
    return await response.json();
  },
  
  fetchMyBookings: async (studentNumber) => {
    const response = await fetch(`${API_BASE_URL}/classes/student/${studentNumber}`);
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return await response.json();
  }
};
export default apiService;


