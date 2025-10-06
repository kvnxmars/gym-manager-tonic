 // src/ClassBookingsApp.jsx
import React, { useState, useEffect, useCallback } from 'react';
import '../../styles/ClassBooking.css';


// ClassBooking.jsx
//import apiService from './Services/api.js';

// Then, destructure the functions you need, either here:
//const { fetchClasses, bookClass, cancelBooking, fetchMyBookings } = apiService;
// src/ClassBookingsApp.jsx

import apiService from './Services/api.js';

// Rename the imported functions to distinguish them from your local handlers
const {
  fetchClasses: apiFetchClasses,
  bookClass: apiBookClass,
  cancelBooking: apiCancelBooking,
  fetchMyBookings: apiFetchMyBookings
} = apiService;


// Import Screens
import ClassesScreen from './Screens/ClassesScreen';
import BookingScreen from './Screens/BookingScreen';
import MyBookingsScreen from './Screens/MyBookingScreen';

// Import Utils
import { getTodayDateString } from './Utils/helper.js';
const API_URL = import.meta.env.VITE_API_URL;

const ClassBookingsApp = () => {
  const [view, setView] = useState('classes'); // 'classes', 'booking', 'myBookings'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Data State
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [student, setStudent] = useState()
  const [studentNumber, setStudentNumber] = useState(null);

  // User state
   useEffect(() => {
    //fetch student data from local storage
    const storedStudent = localStorage?.getItem?.("student");
    
    if (storedStudent) {
      try {
        const studentData = JSON.parse(storedStudent);
        console.log("loaded student data:", studentData);
        setStudent({
          id: studentData._id,
          firstName: studentData?.firstName,
          lastName: studentData?.lastName,
          studentNumber: studentData?.studentNumber
         
        });


      }
       catch (e)
          {
            console.error("Failed to parse student data", e);
            setStudentNumber("00000000");
          }
        }else {
          setStudentNumber("00000000");
        }
      }

    , []);
  
   

  // --- API / Data Handlers ---

  const fetchClasses = useCallback(async (date) => {
    setLoading(true);
    setError(null);
    try {

      // Ensure the date is a string in YYYY-MM-DD format
    const formattedDate = date.toISOString
      ? date.toISOString().split('T')[0]
      : date;

     const data = await apiFetchClasses(formattedDate);
     setClasses(data.classes || []);

    

      
    } catch (err) {
      setError(err.message);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyBookings = useCallback(async () => {

   setLoading(true);
    try {
      const response = await fetch(`${API_URL}/classes/student/${studentNumber}`, {
        
      });
      const data = await response.json();
      console.log("API response:", data);
      
      return data.bookings || [];

       console.log("Updated bookings:", )
    } catch (err) {
      console.error('Fetch error:', err);
      setMyBookings([]);
    } finally {
      setLoading(false);
    }
  });

  const bookClass = async () => {

    try {

    console.log("bookClass() was called!");
    if (!selectedClass) return;
    setLoading(true);
    setError(null);

    //const classId = selectedClass.id;
     const classId = selectedClass._id || selectedClass.id;
    const studentNumber = JSON.parse(localStorage.getItem("student")).studentNumber;

    console.log("Booking for:", studentNumber, "class", classId, selectedClass)
   
    
      console.log("Atempting to book", selectedClass, selectedDate, studentNumber);
      const data = await apiBookClass(classId, studentNumber, selectedDate);

      // --- State Update Logic (Optimistic/Local) ---
      const bookedClass = classes.find(c => c.id === classId);
      if (bookedClass) {
        setMyBookings(prev => [...prev, {
          ...bookedClass,
          bookingId: data.bookingId || Date.now().toString(),
          bookingDate: selectedDate,
          status: 'confirmed'
        }]);

        // Update class capacity for the classes list
        setClasses(prev => prev.map(c =>
          c.id === classId ? { ...c, booked: (c.booked || 0) + 1 } : c
        ));
      }
      alert("Booking successful!");
      // Successful booking navigates to My Bookings
      setView('myBookings');
      
    } catch (err) {
      console.error("Booking failed:", err);
      setError(err.message);
    } finally {
    
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    setLoading(true);
    setError(null);
    try {
      await apiCancelBooking(bookingId);

      // --- State Update Logic (Optimistic/Local) ---
      const cancelledBooking = myBookings.find(b => b.bookingId === bookingId);
      if (cancelledBooking) {
        const classId = cancelledBooking.id;
        // Decrease booked count in classes list
        setClasses(prev => prev.map(c =>
          c.id === classId ? { ...c, booked: Math.max(0, (c.booked || 0) - 1) } : c
        ));
      }
      // Remove from myBookings list
      setMyBookings(prev => prev.filter(b => b.bookingId !== bookingId));

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Initial Data Load ---
  useEffect(() => {
    // Initial fetch of today's classes
    fetchClasses(selectedDate);
  }, [selectedDate, fetchClasses]);
   
   const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    // The useEffect above handles the fetchClasses call
  };

  // --- Event Handlers for Navigation/Actions ---

  const handleNavChange = (newView) => {
    if (newView === 'myBookings') {
      fetchMyBookings();
    }
    setView(newView);
  };

  const handleClassSelect = (classItem) => {
    setSelectedClass(classItem);
    setView('booking');
  };

  // --- Screen Rendering ---

  const renderScreen = () => {
    switch (view) {
      case 'classes':
        return (
          <ClassesScreen
            loading={loading}
            error={error}
            classes={classes}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            fetchClasses={fetchClasses}
            onClassSelect={handleClassSelect}
            onNavChange={handleNavChange}
          />
        );
      case 'booking':
        return (
          <BookingScreen
            selectedClass={selectedClass}
            selectedDate={selectedDate}
            student={student}
            loading={loading}
            onConfirmBooking={bookClass}
            onCancel={() => setView('classes')}
          />
        );
      case 'myBookings':
        return (
          <MyBookingsScreen
            loading={loading}
            myBookings={myBookings}
            fetchMyBookings={fetchMyBookings}
            cancelBooking={cancelBooking}
            onNavChange={handleNavChange}
            onGoToClasses={() => setView('classes')}
          />
        );
      default:
        return <ClassesScreen />;
    }
  };
  
   
  
  return renderScreen(); 
};

export default ClassBookingsApp;