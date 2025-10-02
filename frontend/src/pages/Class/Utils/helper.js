// src/utils/helpers.js

export const formatTime = (time) => {
  const [hour, minute] = time.split(':');
  const hourNum = parseInt(hour);
  const ampm = hourNum >= 12 ? 'PM' : 'AM';
  const hour12 = hourNum % 12 || 12;
  return `${hour12}:${minute} ${ampm}`;
};

export const getAvailableSpots = (capacity, booked) => Math.max(0, (capacity || 0) - (booked || 0));

export const isClassFull = (capacity, booked) => (booked || 0) >= (capacity || 0);

export const getTodayDateString = () => new Date().toISOString().split('T')[0];