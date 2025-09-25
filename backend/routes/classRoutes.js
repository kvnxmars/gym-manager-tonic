const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const bookingController = require('../controllers/bookingController');

//====CLASS ROUTES====//

//General class routes (student and admin)
router.get('/:campus', classController.getClassesByCampus); //get 
router.get('/', classController.getAllClasses);
router.get('/student/:studentId', bookingController.getStudentClasses);


//Admin-specific routes
router.post('/create', classController.createClass); // Admin creates a new class
router.put('/update/:classId', classController.updateClass); // Admin updates class details
router.delete('/delete/:classId', classController.deleteClass); // Admin deletes a class
router.get('bookings/all', classController.getAllBookings); // Admin views all bookings

//Booking-specific routes
router.get('/booking/:bookingId', bookingController.getBookingDetails);
router.put('/booking/:bookingId/checkIn', bookingController.checkInStudent);

//student specific routes
router.get('/campus/:campusName', classController.getClassesByCampus);
router.post('/book', classController.bookClass); // Student books a class
router.post('/cancel', classController.cancelBooking); // Student cancels a booking

module.exports = router;
