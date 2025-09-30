// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();

const Student = require("../models/Student");
const CheckIn = require("../models/CheckIns"); // ✅ point to CheckIns.js

// POST: QR Check-in
router.post("/checkin-qr", async (req, res) => {
  try {
    const { studentNumber } = req.body;
    if (!studentNumber) {
      return res.status(400).json({ message: "Missing studentNumber" });
    }

    const student = await Student.findOne({ studentNumber });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if student is already inside
    const active = await CheckIn.findOne({
      studentId: student._id,
      checkOutTime: null,
    });

    if (active) {
      return res.status(400).json({ message: "Student already checked in", active });
    }

    const checkIn = new CheckIn({
      studentId: student._id,
      checkInTime: new Date(),
    });

    await checkIn.save();

    res.status(201).json({
      message: "✅ Check-in successful",
      checkIn,
    });
  } catch (err) {
    console.error("Admin checkin error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET: Get all check-ins for a specific student
router.get("/checkins/:studentNumber", async (req, res) => {
  try {
    const { studentNumber } = req.params;
    const student = await Student.findOne({ studentNumber });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const history = await CheckIn.find({ studentId: student._id }).sort({ checkInTime: -1 });

    res.json({
      student: {
        id: student._id,
        studentNumber: student.studentNumber,
      },
      history,
    });
  } catch (err) {
    console.error("Admin history error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET: Get all check-ins (optionally filter by date range)
router.get("/checkins", async (req, res) => {
  try {
    const { from, to } = req.query;
    const filter = {};

    if (from || to) {
      filter.checkInTime = {};
      if (from) filter.checkInTime.$gte = new Date(from);
      if (to) filter.checkInTime.$lte = new Date(to);
    }

    const results = await CheckIn.find(filter)
      .sort({ checkInTime: -1 })
      .populate("studentId", "studentNumber name email");

    res.json(results);
  } catch (err) {
    console.error("Admin get all checkins error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
