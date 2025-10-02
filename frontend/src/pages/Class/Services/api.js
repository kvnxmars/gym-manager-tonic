import React, { useState, useEffect } from 'react';

// API Service
/*
const API_BASE_URL = "http://localhost:5000/api";

const apiService = {
  fetchClasses: async (date) => {
    const response = await fetch(`${API_BASE_URL}/classes?date=${date}`);
    if (!response.ok) throw new Error('Failed to fetch classes');
    return await response.json();
  },
  
  bookClass: async (classId, studentId, date) => {
    const response = await fetch(`${API_BASE_URL}/classes/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classId, studentId, date })
    });
    if (!response.ok) throw new Error('Failed to book class');
    return await response.json();
  },
  
  cancelBooking: async (bookingId) => {
    const response = await fetch(`${API_BASE_URL}/classes/cancel/${bookingId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to cancel booking');
    return await response.json();
  },
  
  fetchMyBookings: async (studentId) => {
    const response = await fetch(`${API_BASE_URL}/classes/student/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return await response.json();
  }
};
export default apiService;
*/

// src/services/api.js

const API_BASE_URL = "http://localhost:5000/api";

/**
 * Fetches available classes for a specific date.
 * @param {string} date - The date in YYYY-MM-DD format.
 * @returns {Promise<Array>} - Array of class objects.
 */
export const fetchClasses = async (date) => {
  const response = await fetch(`${API_BASE_URL}/classes?date=${date}`);
  if (!response.ok) throw new Error('Failed to fetch classes');
  const data = await response.json();
  return data.classes || [];
};

/**
 * Books a class for the student.
 * @param {string} classId - The ID of the class to book.
 * @param {string} studentId - The ID of the student.
 * @param {string} date - The date of the booking.
 * @returns {Promise<Object>} - Booking confirmation details.
 */
export const bookClass = async (classId, studentId, date) => {
  const response = await fetch(`${API_BASE_URL}/classes/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      classId: classId,
      studentId: studentId,
      date: date
    })
  });

  if (!response.ok) throw new Error('Failed to book class');
  return response.json();
};

/**
 * Cancels a specific booking.
 * @param {string} bookingId - The ID of the booking to cancel.
 * @returns {Promise<void>}
 */
export const cancelBooking = async (bookingId) => {
  const response = await fetch(`${API_BASE_URL}/classes/cancel/${bookingId}`, {
    method: 'DELETE'
  });

  if (!response.ok) throw new Error('Failed to cancel booking');
  // Assuming successful cancellation returns no body or just a simple status
};

/**
 * Fetches all bookings for a specific student.
 * @param {string} studentId - The ID of the student.
 * @returns {Promise<Array>} - Array of booking objects.
 */
export const fetchMyBookings = async (studentId) => {
  const response = await fetch(`${API_BASE_URL}/classes/student/${studentId}`);
  if (!response.ok) throw new Error('Failed to fetch bookings');
  const data = await response.json();
  return data.bookings || [];
};