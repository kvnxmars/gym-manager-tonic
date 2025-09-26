const express = require("express");
const router = express.Router();
const Class = require('../models/Class');
const Booking = require('../models/ClassBooking');

//====CLASS ROUTES====//

// POST to create a new class
router.post("/create", async (req, res) => {
    try {
        // Log the request body for debugging
        console.log("Request body received:", req.body);

        const { className, instructor, capacity, schedule, campus, classTime } = req.body;

        // Check for missing or falsy required fields
        const missingFields = [];
        if (!className) missingFields.push("className");
        if (!instructor) missingFields.push("instructor");
        if (!capacity) missingFields.push("capacity");
        if (!schedule) missingFields.push("schedule");
        if (!campus) missingFields.push("campus");
        if (!classTime) missingFields.push("classTime");

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "Missing required fields",
                missing: missingFields,
            });
        }

        // Additional validation for data types
        if (typeof capacity !== "number" || capacity < 1) {
            return res.status(400).json({
                message: "Invalid capacity: must be a number greater than or equal to 1",
            });
        }

        const newClass = new Class({
            className,
            instructor,
            capacity,
            schedule,
            campus,
            classTime,
        });

        await newClass.save();
        res.status(201).json({ message: "Class created successfully", class: newClass });

    } catch (err) {
        // Handle Mongoose validation errors specifically
        if (err.name === "ValidationError") {
            const errors = Object.values(err.errors).map(e => ({
                field: e.path,
                message: e.message,
            }));
            return res.status(400).json({
                message: "Validation failed",
                errors,
            });
        }
        console.error("Error creating class:", err);
        res.status(500).json({ message: "Server error creating class", error: err.message });
    }
});

// GET all available classes
router.get("/", async (req, res) => {
    try {
        const classes = await Class.find({});
        res.json({ classes });
    } catch (err) {
        console.error("Error fetching classes:", err);
        res.status(500).json({ message: "Server error fetching classes" });
    }
});

// GET a single class by ID
router.get("/:id", async (req, res) => {
    try {
        const cls = await Class.findById(req.params.id);
        if (!cls) {
            return res.status(404).json({ message: "Class not found" });
        }
        res.json({ class: cls });
    } catch (err) {
        console.error("Error fetching class:", err);
        res.status(500).json({ message: "Server error fetching class" });
    }
});

// PUT to update a class
router.put("/:id", async (req, res) => {
    try {
        const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedClass) {
            return res.status(404).json({ message: "Class not found" });
        }
        res.json({ message: "Class updated successfully", class: updatedClass });
    } catch (err) {
        console.error("Error updating class:", err);
        res.status(500).json({ message: "Server error updating class" });
    }
});

// DELETE a class
router.delete("/:id", async (req, res) => {
    try {
        const deletedClass = await Class.findByIdAndDelete(req.params.id);
        if (!deletedClass) {
            return res.status(404).json({ message: "Class not found" });
        }
        // Also delete all associated bookings for this class
        await Booking.deleteMany({ classId: req.params.id });
        res.status(200).json({ message: "Class and its bookings deleted successfully" });
    } catch (err) {
        console.error("Error deleting class:", err);
        res.status(500).json({ message: "Server error deleting class" });
    }
});

//====BOOKING ROUTES====//

// POST to book a class
router.post("/book", async (req, res) => {
    try {
        const { studentId, classId, date, time } = req.body;
        if (!studentId || !classId) {
            return res.status(400).json({ message: "Student ID and Class ID are required" });
        }

        const cls = await Class.findById(classId);
        if (!cls) {
            return res.status(404).json({ message: "Class not found" });
        }
        
        // Check if the class is full
        const bookedCount = await Booking.countDocuments({ classId });
        if (bookedCount >= cls.capacity) {
            return res.status(400).json({ message: "Class is full" });
        }

        // Check if the student has already booked this class
        const existingBooking = await Booking.findOne({ studentId, classId });
        if (existingBooking) {
            return res.status(400).json({ message: "Student already booked in this class" });
        }

        // Create the new booking document
        const newBooking = new Booking({
            studentId,
            classId,
            className: cls.className,
            campus: cls.campus,
            time,
            instructor: cls.instructor,
            date,
        });
        await newBooking.save();

        res.status(200).json({ message: "Class booked successfully", booking: newBooking });
    } catch (err) {
        console.error("Error booking class:", err);
        res.status(500).json({ message: "Server error booking class" });
    }
});

// GET bookings for a specific class
router.get("/:id/bookings", async (req, res) => {
    try {
        const bookings = await Booking.find({ classId: req.params.id }).populate('studentId', 'studentNumber');
        res.json({ bookings });
    } catch (err) {
        console.error("Error fetching bookings:", err);
        res.status(500).json({ message: "Server error fetching bookings" });
    }
});

// DELETE to cancel a booking
router.delete("/cancel", async (req, res) => {
    try {
        const { studentId, classId } = req.body;
        if (!studentId || !classId) {
            return res.status(400).json({ message: "Student ID and Class ID are required" });
        }

        // Find and delete the booking document
        const bookingToDelete = await Booking.findOneAndDelete({ studentId, classId });
        if (!bookingToDelete) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json({ message: "Booking cancelled successfully" });
    } catch (err) {
        console.error("Error cancelling booking:", err);
        res.status(500).json({ message: "Server error during cancellation" });
    }
});

module.exports = router;
