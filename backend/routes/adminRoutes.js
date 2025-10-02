const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const CheckIn = require("../models/CheckIns");

// QR check-in
router.post("/checkin-qr", async (req, res) => {
  try {
    const { studentNumber, qrCode } = req.body;
    if (!studentNumber && !qrCode) return res.status(400).json({ message: "Missing studentNumber or qrCode" });

    const query = studentNumber ? { studentNumber } : { qrCode };
    const student = await Student.findOne(query);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Already inside?
    const active = await CheckIn.findOne({ studentId: student._id, checkOutTime: null });
    if (active) return res.status(400).json({ message: "Student already checked in", active });

    const checkIn = new CheckIn({
      studentId: student._id,
      checkInTime: new Date(),
    });
    await checkIn.save();
    await checkIn.populate({ path: "studentId", select: "studentNumber name email" });

    res.status(201).json({ message: "Check-in successful", checkIn });
  } catch (err) {
    console.error("Admin checkin error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// checkout
router.post("/checkout", async (req, res) => {
  try {
    const { studentNumber } = req.body;
    if (!studentNumber) return res.status(400).json({ message: "Missing studentNumber" });

    const student = await Student.findOne({ studentNumber });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const checkIn = await CheckIn.findOne({ studentId: student._id, checkOutTime: null });
    if (!checkIn) return res.status(404).json({ message: "No active check-in" });

    checkIn.checkOutTime = new Date();
    await checkIn.save();

    res.json({ message: "Check-out successful", checkIn });
  } catch (err) {
    console.error("Admin checkout error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// all checkins
router.get("/checkins", async (req, res) => {
  try {
    const items = await CheckIn.find()
      .sort({ checkInTime: -1 })
      .limit(100)
      .populate("studentId", "studentNumber name email");
    res.json(items);
  } catch (err) {
    console.error("Admin get checkins error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// active
router.get("/active", async (req, res) => {
  try {
    const items = await CheckIn.find({ checkOutTime: null }).populate("studentId", "studentNumber name email");
    res.json(items);
  } catch (err) {
    console.error("Admin get active error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
