const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const bookingController = require('../controllers/bookingController');

// No campus tracking anymore — generic class endpoints for the student app

// Public / student routes (specific routes before any param routes)
router.get('/', classController.getAllClasses); // GET /api/classes
router.get('/student/:studentId', bookingController.getStudentClasses);

// Booking-specific routes
router.get('/booking/:bookingId', bookingController.getBookingDetails);
router.put('/booking/:bookingId/checkIn', bookingController.checkInStudent);

// Admin routes
router.post('/create', classController.createClass);          // POST /api/classes/create
router.put('/update/:classId', classController.updateClass); // PUT /api/classes/update/:classId
router.delete('/delete/:classId', classController.deleteClass); // DELETE /api/classes/delete/:classId
router.get('/bookings/all', classController.getAllBookings); // GET /api/classes/bookings/all

// Student booking actions
router.post('/book', classController.bookClass);
router.post('/cancel', classController.cancelBooking);

module.exports = router;
