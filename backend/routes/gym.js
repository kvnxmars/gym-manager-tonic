// backend/routes/gym.js
const express = require("express");
const router = express.Router();
const CheckIn = require("../models/CheckIns"); // ✅ point to CheckIns.js

// GET current occupancy
router.get("/occupancy", async (req, res) => {
  try {
    // Count students who are still inside (no checkout yet)
    const activeCount = await CheckIn.countDocuments({ checkOutTime: null });
    res.json({ currentOccupancy: activeCount });
  } catch (err) {
    console.error("Occupancy error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
