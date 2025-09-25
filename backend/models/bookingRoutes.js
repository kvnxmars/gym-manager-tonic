const express = require("express");
const router = express.Router();

// Temporary array (replace with database later)
let bookings = [];

router.post("/", (req, res) => {
  const { className, date } = req.body;
  if (!className || !date) return res.status(400).json({ message: "Missing fields" });

  const booking = { className, date };
  bookings.push(booking);

  res.status(201).json({ message: "Booking successful", booking });
});

router.get("/", (req, res) => {
  res.json(bookings);
});

module.exports = router;
