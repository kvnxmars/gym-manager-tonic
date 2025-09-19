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
router.get("/:studentNumber", async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({
      studentNumber: req.params.studentNumber,
    });
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
