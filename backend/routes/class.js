const express = require("express");
const router = express.Router();
const ClassBooking = require("../models/ClassBooking");
const Student = require("../models/Student");

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

// GET all available classes
router.get("/", async (req, res) => {
    try {
        const classes = await ClassBooking.find({});
        res.json({ classes });
    } catch (err) {
        console.error("Error fetching classes:", err);
        res.status(500).json({ message: "Server error fetching classes" });
    }
});

// POST to book a class
router.post("/book", async (req, res) => {
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

// DELETE to cancel a booking
router.delete("/cancel", async (req, res) => {
    try {
        const { studentId, classId } = req.body;
        if (!studentId || !classId) {
            return res.status(400).json({ message: "Student ID and Class ID are required" });
        }

        const cls = await ClassBooking.findById(classId);
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
