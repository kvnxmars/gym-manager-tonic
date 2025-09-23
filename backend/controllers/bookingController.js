const Class = require('../models/Class');
const Campus = require('../models/Campus');

class bookingController {

    // GET /api/booking/student/:studentId - Get classes booked by a specific student
    static async getStudentClasses(req, res) {
        try {
            const { studentId } = req.params;
            const classes = await Class.find({ bookedStudents: studentId });

            res.json({ classes }); // Return the classes directly
        }
        catch (err) {
            console.error("Error fetching student's classes:", err);
            res.status(500).json({ message: "Server error fetching student's classes" });
        }
    }

    // GET /api/booking/:bookingId - Get details of a specific booking
    static async getBookingDetails(req, res) {
        try{
            const { bookingId } = req.params;

            const booking = await Class.findById(bookingId);
            if (!booking) {
                return res.status(404).json({ message: "Booking not found" });
            }
            res.json({ booking });


        }
        catch (err) {
            console.error("Error fetching booking details:", err);
            res.status(500).json({ message: "Server error fetching booking details" });
        }
    }

    // PUT /api/booking/:bookingId/checkIn - Check-in a student to a class
    static async checkInStudent(req, res) {
        try {
            const { bookingId } = req.params;
            const { studentId } = req.body;

            const booking = await Class.findById(bookingId);
            if (!booking) {
                return res.status(404).json({ message: "Booking not found" });
            }

            if (!booking.bookedStudents.includes(studentId)) {
                return res.status(400).json({ message: "Student not booked for this class" });
            }

            if (booking.checkedInStudents.includes(studentId)) {
                return res.status(400).json({ message: "Student already checked in" });
            }
            booking.checkedInStudents.push(studentId);
            await booking.save();

            res.json({ message: "Student checked in successfully", booking });
        }
        catch (err) {
            console.error("Error checking in student:", err);
            res.status(500).json({ message: "Server error checking in student" });
        }
    }

    // PUT /api/booking/:bookingId/checkOut - Check-out a student from a class
    static async checkOutStudent(req, res) {
        try {
            const { bookingId } = req.params;
            const { studentId } = req.body;
            const booking = await Class.findById(bookingId);
            if (!booking) {
                return res.status(404).json({ message: "Booking not found" });
            }

            const index = booking.checkedInStudents.indexOf(studentId);
            if (index === -1) {
                return res.status(400).json({ message: "Student not checked in" });
            }

            booking.checkedInStudents.splice(index, 1);
            await booking.save();
            res.json({ message: "Student checked out successfully", booking });
        }
        catch (err) {
            console.error("Error checking out student:", err);
            res.status(500).json({ message: "Server error checking out student" });
        }
    }

}

module.exports = bookingController;