import React, { useState, useEffect } from 'react';
import '../../styles/ClassBooking.css';

const ClassBookingsApp = () => {
  const [view, setView] = useState('classes'); // classes, booking, myBookings
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State management
  // campuses removed - fetch all classes
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // User state
  const [user] = useState({
    id: 'student123',
    name: 'John Doe',
    studentNumber: '12345'
  });

  /*// Mock data
  const mockCampuses = [
    {
      id: 'main',
      name: 'Main Campus',
      location: 'Downtown',
      facilities: ['Gym', 'Pool', 'Courts', 'Studios'],
      image: '🏢',
      totalClasses: 45
    },
    {
      id: 'north',
      name: 'North Campus', 
      location: 'Northside',
      facilities: ['Gym', 'Studios', 'Track'],
      image: '🏫',
      totalClasses: 28
    },
    {
      id: 'south',
      name: 'South Campus',
      location: 'Southside', 
      facilities: ['Pool', 'Courts', 'Gym'],
      image: '🏛️',
      totalClasses: 32
    },
    {
      id: 'east',
      name: 'East Campus',
      location: 'East District',
      facilities: ['Studios', 'Gym', 'Outdoor Courts'],
      image: '🏬',
      totalClasses: 23
    }
  ];*/

  /*const mockClasses = {
    'main': [
      {
        id: 'yoga-morning',
        name: 'Morning Yoga',
        instructor: 'Sarah Johnson',
        time: '07:00',
        duration: 60,
        capacity: 20,
        booked: 15,
        location: 'Studio A',
        type: 'Fitness',
        level: 'Beginner',
        description: 'Start your day with energizing yoga flow',
        price: 'Free',
        image: '🧘‍♀️'
      },
      {
        id: 'hiit-lunch',
        name: 'HIIT Training',
        instructor: 'Mike Chen',
        time: '12:30',
        duration: 45,
        capacity: 15,
        booked: 12,
        location: 'Gym Floor',
        type: 'Fitness',
        level: 'Advanced',
        description: 'High-intensity interval training',
        price: 'Free',
        image: '💪'
      },
      {
        id: 'swim-evening',
        name: 'Swimming Lessons',
        instructor: 'Lisa Park',
        time: '18:00',
        duration: 90,
        capacity: 10,
        booked: 7,
        location: 'Pool',
        type: 'Aquatics',
        level: 'Intermediate',
        description: 'Improve your swimming technique',
        price: 'Free',
        image: '🏊‍♂️'
      },
      {
        id: 'pilates-evening',
        name: 'Pilates',
        instructor: 'Emma Wilson',
        time: '19:30',
        duration: 60,
        capacity: 18,
        booked: 10,
        location: 'Studio B',
        type: 'Fitness',
        level: 'All Levels',
        description: 'Core strengthening and flexibility',
        price: 'Free',
        image: '🤸‍♀️'
      }
    ],
    'north': [
      {
        id: 'boxing-morning',
        name: 'Boxing Basics',
        instructor: 'Tony Martinez',
        time: '08:00',
        duration: 75,
        capacity: 12,
        booked: 8,
        location: 'Boxing Gym',
        type: 'Combat',
        level: 'Beginner',
        description: 'Learn fundamental boxing techniques',
        price: 'Free',
        image: '🥊'
      },
      {
        id: 'dance-afternoon',
        name: 'Dance Fitness',
        instructor: 'Maria Rodriguez',
        time: '15:00',
        duration: 60,
        capacity: 25,
        booked: 18,
        location: 'Dance Studio',
        type: 'Dance',
        level: 'All Levels',
        description: 'Fun cardio dance workout',
        image: '💃'
      }
    ],
    'south': [
      {
        id: 'tennis-morning',
        name: 'Tennis Clinic',
        instructor: 'David Kim',
        time: '09:00',
        duration: 120,
        capacity: 8,
        booked: 6,
        location: 'Tennis Courts',
        type: 'Sports',
        level: 'Intermediate',
        description: 'Improve your tennis game',
        image: '🎾'
      },
      {
        id: 'aqua-aerobics',
        name: 'Aqua Aerobics',
        instructor: 'Jennifer Lee',
        time: '10:30',
        duration: 45,
        capacity: 15,
        booked: 12,
        location: 'Pool',
        type: 'Aquatics',
        level: 'All Levels',
        description: 'Low-impact water exercise',
        image: '🏊‍♀️'
      }
    ],
    'east': [
      {
        id: 'basketball-evening',
        name: 'Basketball Skills',
        instructor: 'Coach Johnson',
        campus: 'Potchefstroom',
        time: '17:00',
        duration: 90,
        capacity: 16,
        booked: 11,
        location: 'Outdoor Courts',
        type: 'Sports',
        level: 'All Levels',
        description: 'Fundamental basketball skills',
        image: '🏀'
      }
    ]
  };*/

  // API Configuration
  const API_BASE_URL = "http://localhost:5000/api";

  // API Functions
  // simplified: fetch all classes (no campus parameter)
  const fetchClasses = async (date) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/classes`);
      if (!response.ok) throw new Error('Failed to fetch classes');
      const data = await response.json();
      setClasses(data.classes || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // removed duplicate fetchClasses earlier

  const bookClass = async (classId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/classes/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId,
          // backend expects a studentId (Mongo _id). Frontend should provide it from auth state.
          // This component exposes `user.id` as the current user's id.
          studentId: user.id,
          date: selectedDate
        })
      });
      
      if (!response.ok) throw new Error('Failed to book class');
      
      const data = await response.json();
      
      // Update local state
      const bookedClass = classes.find(c => c.id === classId);
      if (bookedClass) {
        setMyBookings(prev => [...prev, {
          ...bookedClass,
          bookingId: data.bookingId,
          bookingDate: selectedDate,
          status: 'confirmed'
        }]);
        
        // Update class capacity
        setClasses(prev => prev.map(c => 
          c.id === classId ? { ...c, booked: c.booked + 1 } : c
        ));
      }
      
      setView('myBookings');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    setLoading(true);
    try {
      // Backend route is POST /api/classes/cancel and expects bookingId (and optionally studentId) in the body
      const response = await fetch(`${API_BASE_URL}/classes/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, studentId: user.id })
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.message || 'Failed to cancel booking');
      }

      setMyBookings(prev => prev.filter(b => b.bookingId !== bookingId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBookings = async () => {
    setLoading(true);
    try {
      // Backend expects the student's Mongo _id in the URL param
      const response = await fetch(`${API_BASE_URL}/classes/student/${user.id}`);
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      setMyBookings(data.bookings || []);
    } catch (err) {
      setError(err.message);
      setMyBookings([]); // Fallback to empty
    } finally {
      setLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    // initial load - fetch classes
    fetchClasses();
  }, []);

  // Helper functions
  const formatTime = (time) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
  };

  const getAvailableSpots = (capacity, booked) => capacity - booked;

  const isClassFull = (capacity, booked) => booked >= capacity;

  // Classes Screen (default)

  // Classes Screen
  const ClassesScreen = () => (
    <div className="booking-app">
      <div className="status-bar">
        <span className="device-name">FIT@NWU</span>
      </div>
      
      <div className="app-header">
        <button className="back-button" onClick={() => setView('classes')} style={{visibility: 'hidden'}}>
          ‹
        </button>
        <h1 className="page-title">Classes</h1>
        <button className="profile-button">👤</button>
      </div>
      
      <div className="date-selector">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              fetchClasses(e.target.value);
            }}
            className="date-input"
          />
      </div>
      
      <div className="app-content">
        {loading && <div className="loading-spinner">Loading classes...</div>}
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => fetchClasses(selectedDate)} className="retry-button">
              Retry
            </button>
          </div>
        )}
        
        {classes.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No Classes Available</h3>
            <p>There are no classes scheduled for this date</p>
          </div>
        )}
        
        <div className="classes-list">
          {classes.map(classItem => (
            <div key={classItem.id} className="class-card">
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
                      style={{ width: `${(classItem.booked / classItem.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <button
                className={`book-button ${isClassFull(classItem.capacity, classItem.booked) ? 'full' : ''}`}
                onClick={() => {
                  setSelectedClass(classItem);
                  setView('booking');
                }}
                disabled={isClassFull(classItem.capacity, classItem.booked)}
              >
                {isClassFull(classItem.capacity, classItem.booked) ? 'Class Full' : 'Book Now'}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bottom-nav">
        <button className="nav-item" style={{visibility: 'hidden'}}>🏢</button>
        <button 
          className="nav-item active"
          onClick={() => {
            fetchMyBookings();
            setView('myBookings');
          }}
        >
          📅
        </button>
        <button className="nav-item">⚙️</button>
      </div>
    </div>
  );

  // Booking Confirmation Screen
  const BookingScreen = () => (
    <div className="booking-app">
      <div className="status-bar">
        <span className="device-name">FIT@NWU</span>
      </div>
      
      <div className="app-header">
        <button className="back-button" onClick={() => setView('classes')}>
          ‹
        </button>
        <h1 className="page-title">Confirm Booking</h1>
        <div></div>
      </div>
      
      <div className="app-content">
        {selectedClass && (
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
                  <p className="user-name">{user.name}</p>
                  <p className="user-id">Student ID: {user.studentNumber}</p>
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
        )}
      </div>
      
      <div className="booking-actions">
        <button 
          className="cancel-booking-button"
          onClick={() => setView('classes')}
        >
          Cancel
        </button>
        <button 
          className="confirm-booking-button"
          onClick={() => bookClass(selectedClass.id)}
          disabled={loading}
        >
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </div>
      
      <div className="bottom-nav">
        <button className="nav-item" style={{visibility: 'hidden' }}>🏢</button>
        <button className="nav-item">📅</button>
        <button className="nav-item">⚙️</button>
      </div>
    </div>
  );

  // My Bookings Screen
  const MyBookingsScreen = () => (
    <div className="booking-app">
      <div className="status-bar">
        <span className="device-name">FIT@NWU</span>
      </div>
      
      <div className="app-header">
        <button className="back-button" onClick={() => setView('classes')}>
          ‹
        </button>
        <h1 className="page-title">My Bookings</h1>
        <div></div>
      </div>
      
      <div className="app-content">
        {loading && <div className="loading-spinner">Loading bookings...</div>}
        
        {myBookings.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No Bookings Yet</h3>
            <p>You haven't booked any classes. Browse classes to find sessions!</p>
            <button 
              className="primary-button"
              onClick={() => setView('classes')}
            >
              Browse Classes
            </button>
          </div>
        )}
        
        <div className="bookings-list">
          {myBookings.map(booking => (
            <div key={booking.bookingId} className="booking-card">
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
                onClick={() => cancelBooking(booking.bookingId)}
                disabled={loading}
              >
                Cancel Booking
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bottom-nav">
        <button className="nav-item" style={{visibility: 'hidden'}}>🏢</button>
        <button className="nav-item active">📅</button>
        <button className="nav-item">⚙️</button>
      </div>
    </div>
  );

  // Render appropriate screen
  const renderScreen = () => {
    switch (view) {
      case 'classes':
        return <ClassesScreen />;
      case 'booking':
        return <BookingScreen />;
      case 'myBookings':
        return <MyBookingsScreen />;
      default:
        return <ClassesScreen />;
    }
  };

  return renderScreen();
};

export default ClassBookingsApp;