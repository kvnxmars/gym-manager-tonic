// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();

const Student = require("../models/Student");
const CheckIn = require("../models/CheckIns");

// ================== ADMIN ROUTES ================== //

// ✅ POST: QR Check-in
// Body: { studentNumber: "12345" }
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

    // Check if student is already checked in
    const active = await CheckIn.findOne({
      studentId: student._id,
      checkOutTime: null,
    });

    if (active) {
      return res.status(400).json({
        message: "Student already checked in",
        active,
      });
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

// ✅ POST: Manual Checkout
// Body: { studentNumber: "12345" }
router.post("/checkout", async (req, res) => {
  try {
    const { studentNumber } = req.body;
    if (!studentNumber) {
      return res.status(400).json({ message: "Missing studentNumber" });
    }

    const student = await Student.findOne({ studentNumber });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const active = await CheckIn.findOne({
      studentId: student._id,
      checkOutTime: null,
    });

    if (!active) {
      return res.status(400).json({ message: "Student is not checked in" });
    }

    active.checkOutTime = new Date();
    await active.save();

    res.json({
      message: "✅ Student checked out successfully",
      checkIn: active,
    });
  } catch (err) {
    console.error("Admin checkout error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET: Get all check-ins
router.get("/checkins", async (req, res) => {
  try {
    const results = await CheckIn.find()
      .sort({ checkInTime: -1 })
      .populate("studentId", "studentNumber name email");

    res.json(results);
  } catch (err) {
    console.error("Admin get all checkins error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET: Active students (currently checked in)
router.get("/active", async (req, res) => {
  try {
    const active = await CheckIn.find({ checkOutTime: null }).populate(
      "studentId",
      "studentNumber firstName lastName email"
    );

    res.json(active);
  } catch (err) {
    console.error("Admin active students error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
