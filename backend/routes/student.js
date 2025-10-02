// routes/studentProfiles.js
const express = require("express");
const router = express.Router();
const StudentProfile = require("../models/Student");

// CREATE profile
router.post("/", async (req, res) => {
  try {
    const profile = new StudentProfile(req.body);
    const savedProfile = await profile.save();
    res.status(201).json(savedProfile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all profiles
router.get("/", async (req, res) => {
  try {
    const profiles = await StudentProfile.find();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ profile by student number
router.get("/:studentNumber/qrcode", async (req, res) => {
  try {
    const studentNumber = req.params.studentNumber;
    const student = await StudentProfile.findOne({ studentNumber });
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Generate QR image (PNG as Data URL)
    const qrImage = await QRCode.toDataURL(student.qrCode);

    res.json({
      studentNumber: student.studentNumber,
      name: student.name,
      email: student.email,
      qrCode: student.qrCode,
      qrImage, // <-- frontend can display this
    });
  } catch (err) {
    console.error("student qrcode error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE profile
router.put("/:studentNumber", async (req, res) => {
  try {
    const profile = await StudentProfile.findOneAndUpdate(
      { studentNumber: req.params.studentNumber },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE profile
router.delete("/:studentNumber", async (req, res) => {
  try {
    const profile = await StudentProfile.findOneAndDelete({
      studentNumber: req.params.studentNumber,
    });
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json({ message: "Profile deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
