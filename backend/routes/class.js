const express = require("express");
const router = express.Router();
const ClassBooking = require("../models/ClassBooking");
const Student = require("../models/Student");
const campuses = require("../models/Campus");
const classSchema = require("../models/Class");
//const Booking = require("../models/Booking");

//====CLASS BOOKING ROUTES====//

// POST to create a new class
router.post("/create", async (req, res) => {
    try {
        const { className, instructor, capacity, schedule, spaceLeft, campus, classTime } = req.body;
        if (!className || !instructor || !capacity || !schedule || !spaceLeft || !campus || !classTime) {
            return res.status(400).json({ message: "All class fields are required" });
        }

        const newClass = new ClassBooking({
            className,
            instructor,
            capacity,
            schedule,
            spaceLeft,
            campus,
            classTime,
            bookedStudents: [] // Initialize with an empty array
        });

        await newClass.save();
        res.status(201).json({ message: "Class created successfully", class: newClass });

    } catch (err) {
        console.error("Error creating class:", err);
        res.status(500).json({ message: "Server error creating class" });
    }
});

// GET all available classes for each campus
router.get("/:campus", async (req, res) => {
    try {
        const classes = await classSchema.find({});
        res.json({ classes });
    } catch (err) {
        console.error("Error fetching classes:", err);
        res.status(500).json({ message: "Server error fetching classes" });
    }
});

// GET classes booked by a specific student
router.get("/student/:studentId", async (req, res) => {
    try {
        const { studentId } = req.params;
        const classes = await ClassBooking.find({ bookedStudents: studentId });
        res.json({ classes });
    } catch (err) {
        console.error("Error fetching student's classes:", err);
        res.status(500).json({ message: "Server error fetching student's classes" });
    }
});

// GET campus from campusSchema
router.get("/campuses", async (req, res) => {
    try {
        res.json({ campuses });
    } catch (err) {
        console.error("Error fetching campuses:", err);
        res.status(500).json({ message: "Server error fetching campuses" });
    }
   
});

// GET campus-specific classes
router.get("/campus/:campusName", async (req, res) => {
    try {
        const { campusName } = req.params;
        const classes = await ClassBooking.find({ campus: campusName });
        res.json({ classes });
    } catch (err) {
        console.error("Error fetching campus classes:", err);
        res.status(500).json({ message: "Server error fetching campus classes" });
    }
});

// POST to book a class
router.post("/book/:studentNumber", async (req, res) => {
    try {
        const { studentID, classID } = req.body;
        if (!studentID || !classID) {
            return res.status(400).json({ message: "Student ID and Class ID are required" });
        }

        const student = await Student.findById(studentID);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const cls = await ClassBooking.findById(classID);
        if (!cls) {
            return res.status(404).json({ message: "Class not found" });
        }
        
        if (cls.bookedStudents.length >= cls.capacity) {
            return res.status(400).json({ message: "Class is full" });
        }

        if (cls.bookedStudents.includes(studentID)) {
            return res.status(400).json({ message: "Student already booked in this class" });
        }

        cls.bookedStudents.push(studentID);
        await cls.save();

        res.status(200).json({ message: "Class booked successfully", class: cls });
    } catch (err) {
        console.error("Error booking class:", err);
        res.status(500).json({ message: "Server error booking class" });
    }
});

// GET all student bookings
router.get("/bookings/:studentId", async (req, res) => {
    try {
        const { studentId } = req.params;
        const bookings = await ClassBooking.find({ bookedStudents: studentId });
        res.json({ bookings });
    } catch (err) {
        console.error("Error fetching bookings:", err);
        res.status(500).json({ message: "Server error fetching bookings" });
    }   
});

// DELETE to cancel a booking
router.delete("/cancel/:bookingId", async (req, res) => {
    try {
        const { studentId, bookingId } = req.body;
        if (!studentId || !bookingId) {
            return res.status(400).json({ message: "Student ID and Booking ID are required" });
        }

        const cls = await Booking.findById(bookingId);
        if (!cls) {
            return res.status(404).json({ message: "Class not found" });
        }

        const studentIndex = cls.bookedStudents.findIndex(
            (id) => id.toString() === studentId
        );
        if (studentIndex === -1) {
            return res.status(404).json({ message: "Booking not found" });
        }

        cls.bookedStudents.splice(studentIndex, 1);
        await cls.save();

        res.status(200).json({ message: "Booking cancelled successfully", class: cls });
    } catch (err) {
        console.error("Error cancelling booking:", err);
        res.status(500).json({ message: "Server error during cancellation" });
    }
});

module.exports = router;
