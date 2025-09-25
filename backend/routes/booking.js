const express = require('express');
const bookingController = require('../controllers/bookingController');
const router = express.Router();

//====BOOKING ROUTES====//

//Admin-specific routes
router.get('/all', bookingController.getAllBookings); // Admin views all bookings
router.get('/student/:studentId', bookingController.getStudentClasses); // Admin views bookings for a student
router.get('/:bookingId', bookingController.getBookingDetails); // Admin views specific booking details
router.put('/:bookingId/checkIn', bookingController.checkInStudent); // Admin checks in a student to a class
//router.put('/:bookingId/checkOut', bookingController.checkOutStudent); // Admin checks out a student from a class

module.exports = router;