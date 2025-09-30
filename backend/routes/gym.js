const express = require("express");
const { getStats } = require("../controllers/gymController");
const router = express.Router();
const CheckIn = require("../models/CheckIns");

// Gym occupancy
router.get("/occupancy", async (req, res) => {
  try {
    const active = await CheckIn.countDocuments({ checkOutTime: null });
    res.json({ currentOccupancy: active, lastUpdated: new Date() });
  } catch (err) {
    console.error("Occupancy error:", err);
    res.status(500).json({ message: "Server error fetching occupancy" });
  }
});

module.exports = router;
