export const formatTime = (time) => {
    // CRITICAL FIX: Check if 'time' is a valid string before attempting to use it
    if (!time || typeof time !== 'string') {
        return 'TBD'; // Return a placeholder if time data is missing or invalid
    }
    
    const [hour, minute] = time.split(':');

    // Add another safety check just in case split doesn't work as expected
    if (!hour || !minute) {
        return 'Invalid Time';
    }

    const hourNum = parseInt(hour, 10);
    
    if (isNaN(hourNum)) { // Final safety for parsing
        return 'TBD';
    }

    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
};

export const getAvailableSpots = (capacity, booked) => Math.max(0, (capacity || 0) - (booked || 0));

export const isClassFull = (capacity, booked) => (booked || 0) >= (capacity || 0);

export const getTodayDateString = () => new Date().toISOString().split('T')[0];
